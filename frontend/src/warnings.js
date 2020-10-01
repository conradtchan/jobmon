import config from './config';

export function instantWarnings(data) {
  const warnings = {};

  // Node type warnings
  const nodeNames = Object.keys(data.nodes);
  for (let i = 0; i < nodeNames.length; i += 1) {
    const nodeName = nodeNames[i];
    const node = data.nodes[nodeName];

    // Default scores to zero
    warnings[nodeName] = { node: {}, jobs: {} };

    // Score = percentage of swap used
    if (100 * ((node.swap.total - node.swap.free) / node.swap.total) > config.warnSwap) {
      const score = 100 * (
        (node.swap.total - node.swap.free) / node.swap.total
      );
      warnings[nodeName].node.swapUse = score;
    }
  }

  const jobIds = Object.keys(data.jobs);
  // For each job
  for (let i = 0; i < jobIds.length; i += 1) {
    const jobId = jobIds[i];
    const job = data.jobs[jobId];

    if (job.state === 'RUNNING' && job.runTime > config.graceTime) {
      const jobNodeNames = Object.keys(job.layout);
      const nNodes = jobNodeNames.length;
      let nCores = 0;
      // For each node in the job
      for (let j = 0; j < nNodes; j += 1) {
        const jobNodeName = jobNodeNames[j];
        const node = data.nodes[jobNodeName];
        warnings[jobNodeName].jobs[jobId] = {};

        // CPU use
        let cpuUsage = 0;
        let cpuWait = 0;
        const layout = job.layout[jobNodeName];
        nCores = layout.length; // Number of cores used on this node
        for (let k = 0; k < nCores; k += 1) {
          const iLayout = layout[k];
          cpuUsage += node.cpu.core[iLayout][config.cpuKeys.user]
            + node.cpu.core[iLayout][config.cpuKeys.system]
            + node.cpu.core[iLayout][config.cpuKeys.nice];
          cpuWait += node.cpu.core[iLayout][config.cpuKeys.wait];
        }

        // Perform util check unless this is a single-core GPU job
        const doUtilCheck = !((nCores === 1) || (job.nGpus > 0));

        // If below utilisation
        if (doUtilCheck) {
          if (cpuUsage / nCores < config.warnUtil) {
            // Score = percentage wasted * number of cores
            warnings[jobNodeName].jobs[jobId].cpuUtil = (nCores * config.warnUtil) - cpuUsage;
          }
        }

        // If spending significant time waiting
        if (cpuWait / nCores > config.warnWait) {
          // Score = percentage waiting * number of cores
          warnings[jobNodeName].jobs[jobId].cpuWait = cpuWait - (nCores * config.warnWait);
        }
      }

      // Cores per node: since jobs use the same amount of cores per node, nCores is accurate
      const nCoresPerNode = nCores;

      // Memory that jobs can get for free
      const freeMem = config.baseMem * (nCoresPerNode - 1.0) + config.baseMemSingle;

      // Factor for making it stricter for large requests
      const x = Math.max(0.0, (job.memReq - freeMem) / job.memReq);

      // Memory warning criteria
      const criteria = (job.memReq - freeMem) * (1.0 - x)
        + x * (config.warnMem / 100.0) * job.memReq;

      if (job.memMax < criteria) {
        // Max is over all nodes - only warn if all nodes are below threshold (quite generous)
        const memNodeNames = Object.keys(job.mem);
        for (let k = 0; k < memNodeNames.length; k += 1) {
          const memNodeName = memNodeNames[k];
          // Score = GB wasted
          warnings[memNodeName].jobs[jobId].memUtil = (criteria - job.memMax) / 1024;
        }
      }
    }
  }

  return warnings;
}

export function generateWarnings(snapshotTime, historyData) {
  // Get the data snapshots that we check for warnings
  const now = snapshotTime / 1000;
  const warningDataIndex = [];
  for (let i = 0; i < historyData.length; i += 1) {
    const data = historyData[i];
    if (now - data.timestamp < config.warningWindow) {
      warningDataIndex.push(i);
    }
  }

  const nSnapshots = warningDataIndex.length;

  // Threshold number of snapshots for triggering warning
  const threshold = Math.floor(config.warningFraction * nSnapshots);

  // Collate all the instantaneous warnings
  const warningSums = {}; // Number of times warned
  const scoreSums = {}; // Warning score

  // For each snapshot that the warning is being calculated for
  for (let i = 0; i < nSnapshots; i += 1) {
    const data = historyData[warningDataIndex[i]];
    const warnings = instantWarnings(data);

    // For each node
    const nodeNames = Object.keys(warnings);
    for (let j = 0; j < nodeNames.length; j += 1) {
      const nodeName = nodeNames[j];

      // If a tally hasn't been created for this node yet, create it
      if (!Object.keys(warningSums).includes(nodeName)) {
        warningSums[nodeName] = { node: {}, jobs: {} };
        scoreSums[nodeName] = { node: {}, jobs: {} };
      }

      // Count node warnings
      const nodeWarningNames = Object.keys(warnings[nodeName].node);
      for (let k = 0; k < nodeWarningNames.length; k += 1) {
        const warningName = nodeWarningNames[k];

        // If a tally hasn't been created for this warning yet, create it
        if (!Object.keys(warningSums[nodeName].node).includes(warningName)) {
          warningSums[nodeName].node[warningName] = 0;
          scoreSums[nodeName].node[warningName] = 0;
        }

        if (warnings[nodeName].node[warningName] > 0) {
          warningSums[nodeName].node[warningName] += 1;
          scoreSums[nodeName].node[warningName] += warnings[nodeName].node[warningName];
        }
      }

      // Count job warnings
      const jobIds = Object.keys(warnings[nodeName].jobs);
      for (let k = 0; k < jobIds.length; k += 1) {
        const jobId = jobIds[k];

        // If a tally hasn't been created for this warning yet, create it
        if (!Object.keys(warningSums[nodeName].jobs).includes(jobId)) {
          warningSums[nodeName].jobs[jobId] = {};
          scoreSums[nodeName].jobs[jobId] = {};
        }

        const jobWarningNames = Object.keys(warnings[nodeName].jobs[jobId]);

        for (let l = 0; l < jobWarningNames.length; l += 1) {
          const jobWarningName = jobWarningNames[l];

          // If a tally hasn't been created for this warning yet, create it
          if (!Object.keys(warningSums[nodeName].jobs[jobId]).includes(jobWarningName)) {
            warningSums[nodeName].jobs[jobId][jobWarningName] = 0;
            scoreSums[nodeName].jobs[jobId][jobWarningName] = 0;
          }

          if (warnings[nodeName].jobs[jobId][jobWarningName] > 0) {
            warningSums[nodeName].jobs[jobId][jobWarningName] += 1;
            scoreSums[nodeName].jobs[jobId][jobWarningName]
              += warnings[nodeName].jobs[jobId][jobWarningName];
          }
        }
      }
    }
  }

  // Set jobs below the threshold to score = 0
  const nodeNames = Object.keys(warningSums);
  for (let i = 0; i < nodeNames.length; i += 1) {
    const nodeName = nodeNames[i];

    // Node type warnings
    const warningNames = Object.keys(warningSums[nodeName].node);
    for (let j = 0; j < warningNames.length; j += 1) {
      const warningName = warningNames[j];
      if (warningSums[nodeName].node[warningName] > threshold) {
        // convert to integer
        scoreSums[nodeName].node[warningName] = Math.floor(
          scoreSums[nodeName].node[warningName] / nSnapshots,
        );
      } else {
        scoreSums[nodeName].node[warningName] = 0;
      }
    }

    // Job type warnings
    const jobIds = Object.keys(warningSums[nodeName].jobs);
    for (let j = 0; j < jobIds.length; j += 1) {
      const jobId = jobIds[j];
      const jobWarningNames = Object.keys(warningSums[nodeName].jobs[jobId]);
      for (let k = 0; k < jobWarningNames.length; k += 1) {
        const jobWarningName = jobWarningNames[k];
        if (warningSums[nodeName].jobs[jobId][jobWarningName] > threshold) {
          // convert to integer
          scoreSums[nodeName].jobs[jobId][jobWarningName] = Math.floor(
            scoreSums[nodeName].jobs[jobId][jobWarningName] / nSnapshots,
          );
        } else {
          scoreSums[nodeName].jobs[jobId][jobWarningName] = 0;
        }
      }
    }
  }

  return scoreSums;
}

export function getWarnedJobs(warnings) {
  const warnedJobs = [];

  // For each node in warnings
  const warnedNodes = Object.keys(warnings);
  for (let i = 0; i < warnedNodes.length; i += 1) {
    const nodeName = warnedNodes[i];
    const nodeWarnings = warnings[nodeName];

    if (Object.keys(nodeWarnings).includes('jobs')) {
      const jobIds = Object.keys(nodeWarnings.jobs);

      // For each job on the node
      for (let j = 0; j < jobIds.length; j += 1) {
        const jobId = jobIds[j];
        let jobWarned = false;

        // If the job hasn't already been added to the list
        if (!(warnedJobs.includes(jobId))) {
          // Job type warnings
          const jobTypeWarnIds = Object.keys(nodeWarnings.jobs[jobId]);
          for (let k = 0; k < jobTypeWarnIds.length; k += 1) {
            const warning = jobTypeWarnIds[k];
            if (nodeWarnings.jobs[jobId][warning] > 0) {
              warnedJobs.push(jobId);
              jobWarned = true;
              break;
            }
          }

          // Check for node type warnings if there are no job type warnings
          if (!(jobWarned)) {
            // Node type warnings
            const nodeTypeWarnings = Object.keys(nodeWarnings.node);

            for (let k = 0; k < nodeTypeWarnings.length; k += 1) {
              const warning = nodeTypeWarnings[k];

              if (nodeWarnings.node[warning] > 0) {
                warnedJobs.push(jobId);
                jobWarned = true;
                break;
              }
            }
          }
        }
      }
    }
  }

  return warnedJobs;
}

export function getWarnedUsers(warnings, jobs) {
  const warnedUsers = [];
  const nodeNames = Object.keys(warnings);
  const activeJobIds = Object.keys(jobs);

  for (let i = 0; i < nodeNames.length; i += 1) {
    const nodeName = nodeNames[i];
    const jobIds = Object.keys(warnings[nodeName].jobs);

    for (let j = 0; j < jobIds.length; j += 1) {
      const jobId = jobIds[j];

      if (activeJobIds.includes(jobId)) {
        const { username } = jobs[jobId];

        if (!warnedUsers.includes(username)) {
          let userWarned = false;

          // Node type warnings
          const nodeWarnings = Object.keys(warnings[nodeName].node);
          for (let k = 0; k < nodeWarnings.length; k += 1) {
            const warning = nodeWarnings[k];
            if (!(warnedUsers.includes(username))) {
              if (warnings[nodeName].node[warning]) {
                warnedUsers.push(username);
                userWarned = true;
                break;
              }
            }
          }

          // Job type warnings
          if (!userWarned) {
            const jobWarnings = Object.keys(warnings[nodeName].jobs[jobId]);
            for (let k = 0; k < jobWarnings.length; k += 1) {
              const warning = jobWarnings[k];
              if (warnings[nodeName].jobs[jobId][warning]) {
                if (!(warnedUsers.includes(username))) {
                  warnedUsers.push(username);
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  return warnedUsers;
}

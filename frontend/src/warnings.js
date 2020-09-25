export function instantWarnings(data) {
  const warnSwap = 20; // If swap greater than
  const warnWait = 5; // If waiting more than
  const warnUtil = 80; // If CPU utilisation below
  const warnMem = 70; // If memory used is less than
  const baseMem = 2048; // Megabytes of "free" memory per core not to warn for
  const baseMemSingle = 4096; // Megabytes of memory for the first core
  const graceTime = 5; // (Minutes) give jobs some time to get setup

  const cpuKeys = {
    user: 0, nice: 1, system: 2, wait: 3, idle: 4,
  };

  const warnings = {};

  // Node type warnings
  const nodeNames = Object.keys(data.nodes);
  for (let i = 0; i < nodeNames.length; i += 1) {
    const nodeName = nodeNames[i];
    const node = data.nodes[nodeName];

    // Default scores to zero
    warnings[nodeName] = { node: { swapUse: 0 }, jobs: {} };

    // Score = percentage of swap used
    if (100 * ((node.swap.total - node.swap.free) / node.swap.total) > warnSwap) {
      warnings[nodeName].node.swapUse = 100 * (
        (node.swap.total - node.swap.free) / node.swap.total
      );
    }
  }

  const jobIds = Object.keys(data.jobs);
  // For each job
  for (let i = 0; i < jobIds.length; i += 1) {
    const jobId = jobIds[i];
    const job = data.jobs[jobId];

    if (job.state === 'RUNNING' && job.runTime > graceTime) {
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
        const layoutNumbers = Object.keys(job.layout[jobNodeName]);
        nCores = layoutNumbers.length; // Number of cores used on this node
        for (let k = 1; k < nCores; k += 1) {
          const iLayout = layoutNumbers[k];
          cpuUsage += node.cpu.coreC[iLayout][cpuKeys.user]
            + node.cpu.coreC[iLayout][cpuKeys.system]
            + node.cpu.coreC[iLayout][cpuKeys.nice];
          cpuWait += node.cpu.coreC[iLayout][cpuKeys.wait];
        }

        // Only perform CPU utilisation check if the job uses more than 1 core
        // and if it is not a GPU job
        const doUtilCheck = (nCores > 1) || (job.nGpus === 0);

        // If below utilisation
        if (doUtilCheck) {
          if (cpuUsage / nCores < warnUtil) {
            // Score = percentage wasted * number of cores
            warnings[jobNodeName].jobs[jobId].cpuUtil = (nCores * warnUtil) - cpuUsage;
          }
        }

        // If spending significant time waiting
        if (cpuWait / nCores > warnWait) {
          // Score = percentage waiting * number of cores
          warnings[jobNodeName].jobs[jobId].cpuWait = cpuWait - warnWait;
        }
      }

      // Cores per node: since jobs either use less than a whole node,
      // or multiples of a whole node, nCores will accurately give the average cores per node
      const nCoresPerNode = nCores;

      // Memory that jobs can get for free
      const freeMem = baseMem * (nCoresPerNode - 1.0) + baseMemSingle;

      // Factor for making it stricter for large requests
      const x = Math.max(0.0, (job.memReq - freeMem) / job.memReq);

      // Memory warning criteria
      const criteria = (job.memReq - freeMem) * (1.0 - x) + x * (warnMem / 100.0) * job.memReq;

      if (job.memMax < criteria) {
        // Max is over all nodes - only warn if all nodes are below threshold (quite generous)
        const memNodeNames = Object.keys(job.mem);
        for (let k = 1; k < memNodeNames.length; k += 1) {
          const memNodeName = memNodeNames[k];
          // Score = GB wasted
          warnings[memNodeName].jobs[jobId].memUtil = (criteria - job.memMax) / 1024;
        }
      }
    }
  }

  return warnings;
}

export default function generateWarnings(snapshotTime, historyData) {
  // Time window to check for warnings
  const warningWindow = 600;

  // If more than this fraction in the window is bad, then trigger warning
  const warningFraction = 0.5;

  // Get the data snapshots that we check for warnings
  const now = snapshotTime / 1000;
  const warningDataIndex = [];
  for (let i = 0; i < historyData.length; i += 1) {
    const data = historyData[i];
    if (now - data.timestamp < warningWindow) {
      warningDataIndex.push(i);
    }
  }

  // Threshold number of snapshots for triggering warning
  const threshold = Math.floor(warningFraction * warningDataIndex.length);

  // Collate all the instantaneous warnings
  const warningSums = {};
  const scoreSums = {};

  // i is the index of the data
  for (let i = 0; i < warningDataIndex.length; i += 1) {
    const data = historyData[warningDataIndex[i]];
    const warnings = instantWarnings(data);

    // For each node
    const nodeNames = Object.keys(warnings);
    for (let j = 1; j < nodeNames.length; j += 1) {
      const nodeName = nodeNames[j];
      if (!(Object.prototype.hasOwnProperty.call(warningSums, nodeName))) {
        warningSums[nodeName] = { node: {}, jobs: {} };
        scoreSums[nodeName] = { node: {}, jobs: {} };
      }

      // Count node warnings
      const warningNames = Object.keys(warnings);
      for (let k = 0; k < warningNames.length; k += 1) {
        const warningName = warningNames[k];
        if (!(Object.prototype.hasOwnProperty.call(warningSums[nodeName].node, warningName))) {
          warningSums[nodeName].node[warningName] = 0;
          scoreSums[nodeName].node[warningName] = 0;
        }
        if (warnings[nodeName].node[warningName] > 0) {
          warningSums[nodeName].node[warningName] += 1;
          scoreSums[nodeName].node[warningName]
            += Math.floor(warnings[nodeName].node[warningName]);
        }
      }

      // Count job warnings
      const jobIds = Object.keys(warnings[nodeName].jobs);
      for (let k = 0; k < jobIds.length; k += 1) {
        const jobId = jobIds[k];
        if (!(Object.prototype.hasOwnProperty.call(warningSums[nodeName].jobs, jobId))) {
          warningSums[nodeName].jobs[jobId] = {};
          scoreSums[nodeName].jobs[jobId] = {};
        }
        const jobWarningNames = Object.keys(warnings[nodeName].jobs[jobId]);
        for (let l = 0; l < jobWarningNames.length; l += 1) {
          const jobWarningName = jobWarningNames[l];
          if (!(
            Object.prototype.hasOwnProperty.call(
              warningSums[nodeName].jobs[jobId],
              jobWarningName,
            )
          )) {
            warningSums[nodeName].jobs[jobId][jobWarningName] = 0;
            scoreSums[nodeName].jobs[jobId][jobWarningName] = 0;
          }
          if (warnings[nodeName].jobs[jobId][jobWarningName] > 0) {
            warningSums[nodeName].jobs[jobId][jobWarningName] += 1;
            scoreSums[nodeName].jobs[jobId][jobWarningName]
              += Math.floor(warnings[nodeName].jobs[jobId][jobWarningName]);
          }
        }
      }
    }
  }

  // Set jobs below the threshold to score = 0
  const nodeNames = Object.keys(warningSums);
  for (let i = 0; i < nodeNames.length; i += 1) {
    const nodeName = nodeNames[i];
    const warningNames = Object.keys(warningSums[nodeName].node);
    for (let j = 0; j < warningNames.length; j += 1) {
      const warningName = warningNames[j];
      if (warningSums[nodeName].node[warningName] > threshold) {
        // convert to integer
        scoreSums[nodeName].node[warningName] = Math.floor(
          scoreSums[nodeName].node[warningName] / warningDataIndex.length,
        );
      } else {
        scoreSums[nodeName].node[warningName] = 0;
      }
    }
    const jobIds = Object.keys(warningSums[nodeName].jobs);
    for (let j = 0; j < jobIds.length; j += 1) {
      const jobId = jobIds[j];
      const jobWarningNames = warningSums[nodeName].jobs[jobId];
      for (let k = 0; k < jobWarningNames.length; k += 1) {
        const jobWarningName = jobWarningNames[k];
        if (warningSums[nodeName].jobs[jobId][jobWarningName] > threshold) {
          // convert to integer
          scoreSums[nodeName].jobs[jobId][jobWarningName] = Math.floor(
            scoreSums[nodeName].jobs[jobId][jobWarningName] / warningDataIndex.length,
          );
        } else {
          scoreSums[nodeName].jobs[jobId][jobWarningName] = 0;
        }
      }
    }
  }

  return scoreSums;
}

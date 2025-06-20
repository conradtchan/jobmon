import config from "./config";

// Get the per job usage for a specific node
export function getNodeUsage(jid, job, node, host) {
  const usage = {
    cpu: {
      user: 0, system: 0, wait: 0, idle: 0,
    },
    mem: { used: 0, total: 0 },
    infiniband: { bytes_in: 0, bytes_out: 0 },
    lustre: { read: 0, write: 0 },
    gpu: {
      total: 0,
      memory: { used: 0, total: 0 },
    },
    jobfs: { used: 0 },
  };

  if (Object.prototype.hasOwnProperty.call(job.layout, host)) {
    const layout = job.layout[host];

    // If multicpu stats are not reported, leave them at 0
    if (node.cpu.core.length > 0) {
      for (let i = 0; i < layout.length; i += 1) {
        const iLayout = layout[i];
        usage.cpu.user += node.cpu.core[iLayout][config.cpuKeys.user]
                + node.cpu.core[iLayout][config.cpuKeys.nice];
        usage.cpu.system += node.cpu.core[iLayout][config.cpuKeys.system];
        usage.cpu.wait += node.cpu.core[iLayout][config.cpuKeys.wait];
        usage.cpu.idle += node.cpu.core[iLayout][config.cpuKeys.idle];
      }
    }

    // If this is a GPU job
    let gpuNumbers = [];
    if (job.nGpus > 0 && node.gpus) {
      // Zero if unknown
      usage.gpu.total = 0;
      usage.gpu.memory.used = 0;
      usage.gpu.memory.total = 0;

      // If the GPU mapping is known
      if (Object.prototype.hasOwnProperty.call(job.gpuLayout, host)) {
        if (job.gpuLayout[host].length > 0) {
          gpuNumbers = job.gpuLayout[host];
        }
      }

      // If the mapping is not known, then the usage will remain zero
      for (let j = 0; j < gpuNumbers.length; j += 1) {
        const iGpu = gpuNumbers[j];
        const gpuKey = "gpu".concat(iGpu.toString());

        if (node.gpus[gpuKey]) {
          // Add GPU utilization
          if (typeof node.gpus[gpuKey] === "object" && node.gpus[gpuKey].util !== undefined) {
            usage.gpu.total += node.gpus[gpuKey].util;
          } else {
            // For backwards compatibility with old data format
            usage.gpu.total += node.gpus[gpuKey];
          }

          // Add GPU memory if available
          if (typeof node.gpus[gpuKey] === "object" && node.gpus[gpuKey].memory) {
            usage.gpu.memory.used += node.gpus[gpuKey].memory.used;
            usage.gpu.memory.total += node.gpus[gpuKey].memory.total;
          }
        }
      }
    }

    if (host in job.mem) {
      usage.mem.used = job.mem[host];
    }
    usage.mem.max = job.memMax;
    usage.mem.total = node.mem.total;
    if (node.infiniband !== null) {
      usage.infiniband.bytes_in = node.infiniband.bytes_in;
      usage.infiniband.bytes_out = node.infiniband.bytes_out;
    } else {
      usage.infiniband.bytes_in = 0.0;
      usage.infiniband.bytes_out = 0.0;
    }

    if (node.lustre !== null) {
      usage.lustre.read = node.lustre.read;
      usage.lustre.write = node.lustre.write;
    }

    usage.jobfs.used = job.jobfs[host];

    const nCores = layout.length;
    usage.cpu.user /= nCores;
    usage.cpu.system /= nCores;
    usage.cpu.wait /= nCores;
    usage.cpu.idle /= nCores;
    if (job.nGpus > 0) {
      // Divide by the total number of GPUs on this node
      // (minimum of 1, in case the mapping is unknown)
      const numGpus = Math.max(gpuNumbers.length, 1);
      usage.gpu.total /= numGpus;

      // Also normalize the GPU memory metrics if we have them
      if (usage.gpu.memory.total > 0) {
        usage.gpu.memory.used /= numGpus;
        usage.gpu.memory.total /= numGpus;
      }
    }
  }

  return usage;
}

// Get the per job usage
export function getJobUsage(jid, job, nodes) {
  const usage = {
    cpu: {
      user: 0, system: 0, wait: 0, idle: 0,
    },
    mem: { used: 0, max: 0, total: 0 },
    infiniband: { bytes_in: 0, bytes_out: 0 },
    lustre: { read: 0, write: 0 },
    gpu: {
      total: 0,
      memory: { used: 0, total: 0 },
    },
  };

  let nCpus = 0;

  const hosts = Object.keys(job.layout);
  for (let i = 0; i < hosts.length; i += 1) {
    const host = hosts[i];
    if (host in nodes) {
      const nodeUsage = getNodeUsage(jid, job, nodes[host], host);
      const nCores = job.layout[host].length;
      usage.cpu.user += nodeUsage.cpu.user * nCores;
      usage.cpu.system += nodeUsage.cpu.system * nCores;
      usage.cpu.wait += nodeUsage.cpu.wait * nCores;
      usage.cpu.idle += nodeUsage.cpu.idle * nCores;
      if (host in job.mem) {
        usage.mem.used += job.mem[host];
      }
      usage.mem.total += nodeUsage.mem.total;
      usage.infiniband.bytes_in += nodeUsage.infiniband.bytes_in;
      usage.infiniband.bytes_out += nodeUsage.infiniband.bytes_out;
      usage.lustre.read += nodeUsage.lustre.read;
      usage.lustre.write += nodeUsage.lustre.write;
      if (job.nGpus > 0) {
        usage.gpu.total += nodeUsage.gpu.total;

        // Add GPU memory metrics if available
        if (nodeUsage.gpu.memory) {
          usage.gpu.memory.used += nodeUsage.gpu.memory.used;
          usage.gpu.memory.total += nodeUsage.gpu.memory.total;
        }
      }

      // Count number of CPUs (job.nCpus gives the total amount, not the subset)
      nCpus += job.layout[host].length;
    }
  }

  usage.mem.max = job.memMax;

  usage.cpu.user /= nCpus;
  usage.cpu.system /= nCpus;
  usage.cpu.wait /= nCpus;
  usage.cpu.idle /= nCpus;

  const numNodes = Object.keys(job.layout).length;
  usage.gpu.total /= numNodes;

  // Also normalize the GPU memory metrics if we have them
  if (usage.gpu.memory.total > 0) {
    usage.gpu.memory.used /= numNodes;
    usage.gpu.memory.total /= numNodes;
  }

  return usage;
}

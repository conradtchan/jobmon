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
    gpu: { total: 0 },
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

    // If thif is a GPU job
    if (job.nGpus > 0) {
      // Zero if unknown
      usage.gpu.total = 0;
      let gpuNumbers = [];

      // TODO: currently hardcoded to 2,
      // but can make this general from the API
      const nGpuMax = 2;

      // If the GPU mapping is known
      if (Object.prototype.hasOwnProperty.call(job.gpuLayout, host)) {
        if (job.gpuLayout[host].length > 0) {
          gpuNumbers = Object.keys(job.gpuLayout[host]);
        }
      // If both GPUs are used, then mapping doesn't matter
      } else if (job.nGpus === nGpuMax) {
        for (let j = 0; j < nGpuMax; j += 1) {
          gpuNumbers.push(j);
        }
      }
      for (let j = 0; j < gpuNumbers.length; j += 1) {
        const iGpu = gpuNumbers[j];
        usage.gpu.total += node.gpus["gpu".concat(iGpu.toString())];
      }
    }

    usage.mem.used = job.mem[host];
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

    const nCores = layout.length;
    usage.cpu.user /= nCores;
    usage.cpu.system /= nCores;
    usage.cpu.wait /= nCores;
    usage.cpu.idle /= nCores;
    if (job.nGpus > 0) {
      usage.gpu.total /= job.nGpus;
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
    gpu: { total: 0 },
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
      usage.mem.used += job.mem[host];
      usage.mem.total += nodeUsage.mem.total;
      usage.infiniband.bytes_in += nodeUsage.infiniband.bytes_in;
      usage.infiniband.bytes_out += nodeUsage.infiniband.bytes_out;
      usage.lustre.read += nodeUsage.lustre.read;
      usage.lustre.write += nodeUsage.lustre.write;
      if (job.nGpus > 0) {
        usage.gpu.total += nodeUsage.gpu.total;
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
  usage.gpu.total /= Object.keys(job.layout).length;

  return usage;
}

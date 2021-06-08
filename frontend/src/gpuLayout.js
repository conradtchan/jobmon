import arraysEqual from "./utils";

export default function extractGpuLayout(data, oldGpuLayout) {
  // The GPU mapping always needs to be the current one,
  // because it may not have been properly determined in the past

  const layout = {};
  const jobIds = Object.keys(data.jobs);

  let changed = false;

  let oldJobs = [];
  if (oldGpuLayout !== null) {
    oldJobs = Object.keys(oldGpuLayout);
  }

  for (let i = 0; i < jobIds.length; i += 1) {
    const jid = jobIds[i];

    if (data.jobs[jid].nGpus > 0) {
      if (!changed) {
        // If job id wasn't in the previous layout
        if (!oldJobs.includes(jid)) {
          changed = true;
        }
      }

      layout[jid] = {};
      const gpuHosts = Object.keys(data.jobs[jid].gpuLayout);
      for (let j = 0; j < gpuHosts.length; j += 1) {
        const host = gpuHosts[j];
        const newLayout = data.jobs[jid].gpuLayout[host];

        // Only perform check if a new job hasn't been introduced
        if (!changed) {
          // Check if the layout has changed
          if (!arraysEqual(oldGpuLayout[jid][host], newLayout)) {
            changed = true;
          }
        }

        layout[jid][host] = newLayout;
      }
    }
  }

  if (changed) {
    return layout;
  }
  return null; // return null if the layout is unchanged
}

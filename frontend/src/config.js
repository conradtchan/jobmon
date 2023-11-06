const config = {

  // Homepage
  homepage: "https://supercomputing.swin.edu.au/",

  // Address of API
  address: "https://supercomputing.swin.edu.au/monitor/api/",

  // API version
  apiVersion: 14,

  // Page title
  pageTitle: "Job Monitor",

  // Frequency to fetch data (seconds)
  fetchFrequency: 15,

  // Frequency to fetch history array (seconds)
  fetchHistoryFrequency: 100,

  // Frequency to fetch backfill (seconds)
  fetchBackfillFrequency: 100,

  // If snapshots are old by this amount, trigger maintenace message
  maintenanceAge: 1200,

  // Array indices for CPU usage
  cpuKeys: {
    user: 0, nice: 1, system: 2, wait: 3, idle: 4,
  },

  // Number of initial points for charts
  historyDataCountInitial: 30,

  // Factor to increase chart resolution at each refinment
  historyResolutionMultiplier: 3,

  // Number of bars to show on the time machine
  timeMachineBars: 200,

  // Maximum number of CPU cores to show per row
  maxPiesPerRow: 20,

  // ===== Warning configuration ===== //

  // Instantaneous warnings
  warnSwap: 100, // If swap use % greater than
  warnSys: 30, // If sys use % greater than
  warnWait: 5, // If wait time % greater than
  warnUtil: 80, // If CPU usage % less than
  warnMem: 70, // If memory usage % less than
  baseMem: 2048, // Megabytes of "free" memory per core not to warn
  baseMemSingle: 4096, // Megabytes of memory for the first core
  warnGpuUtil: 30, // If GPU usage % less than
  graceTime: 5, // Minutes: give jobs  time to get setup without warning

  // Warnings over time
  warningWindow: 600, // Time window to check for warnings
  warningFraction: 0.5, // Trigger warning if over this fraction is bad

  // Threshold for marking jobs as terrible
  terribleThreshold: 1000,

  // Maximum time that can be reserved by a job in seconds
  tMaxRes: 604800, // 1 week

};

export default config;

const config = {

  // Address of API
  address: 'https://supercomputing.swin.edu.au/monitor/api/',

  // Array indices for CPU usage
  cpuKeys: {
    user: 0, nice: 1, system: 2, wait: 3, idle: 4,
  },

  // Number of initial points for charts
  historyDataCountInitial: 30,

  // Factor to increase chart resolution at each refinment
  historyResolutionMultiplier: 3,
};

export default config;

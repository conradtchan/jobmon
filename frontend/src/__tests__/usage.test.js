import { getJobUsage, getNodeUsage } from "../usage";

const testData = require("./test_data.json");
const gpuLayout = require("./reference_gpuLayout.json");

const nodeUsageRef = require("./reference_nodeUsage.json");
const jobUsageRef = require("./reference_jobUsage.json");

it("per-job resource usage for a specific node", () => {
  const jobIds = Object.keys(testData.jobs);

  // Make reference data
  const ref = {};

  // Over all jobs
  for (let i = 0; i < jobIds.length; i += 1) {
    const jid = jobIds[i];
    const job = testData.jobs[jid];

    // Test running jobs only
    if (job.state === "RUNNING") {
      const hosts = Object.keys(job.layout);

      ref[jid] = {};

      // Over each node that the job is running on
      for (let j = 0; j < hosts.length; j += 1) {
        const host = hosts[j];
        const node = testData.nodes[host];
        const usage = getNodeUsage(jid, job, node, host, gpuLayout);

        ref[jid][host] = usage;

        // Compare each usage
        expect(usage).toEqual(nodeUsageRef[jid][host]);
      }
    }
  }

  // Output to generate reference data
  // console.log(JSON.stringify(ref))
});

it("per-job resource usage", () => {
  const jobIds = Object.keys(testData.jobs);

  // Make reference data
  const ref = {};

  // Over all jobs
  for (let i = 0; i < jobIds.length; i += 1) {
    const jid = jobIds[i];
    const job = testData.jobs[jid];

    // Test running jobs only
    if (job.state === "RUNNING") {
      const usage = getJobUsage(jid, job, testData.nodes, gpuLayout);

      ref[jid] = usage;

      // Compare each usage
      expect(usage).toEqual(jobUsageRef[jid]);
    }
  }

  // Output to generate reference data
  // console.log(JSON.stringify(ref))

  expect(1).toEqual(1);
});

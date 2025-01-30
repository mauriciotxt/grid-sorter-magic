import axios from 'axios';
import { GithubCommit } from '../types/interfaces';

// Replace with your GitHub Token
const token = 'ADD YOUR TOKEN HERE';  // Replace with your GitHub Token
const org = 'aviva-verde';  // GitHub organization or username
const repositories = ['policy-api'];  // List of repos
// const repositories = ['policy-api', 'quote-api', 'pricing-api'];  // List of repos
const perPage = 10; // Limit to 10 PRs per repo

// Headers for GitHub API requests
const headers = {
  'Accept': 'application/vnd.github+json',
  'Authorization': `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
};

// Function to fetch merged pull requests for a given repository
async function getMergedPullRequests(repo: string) {
  // let allPullRequests: any[] = [];
  const githubApiUrl = `https://api.github.com/repos/${org}/${repo}/pulls`;

  console.log(`🔍 Fetching last ${perPage} merged pull requests for ${repo}...`);

  try {
    const url = `${githubApiUrl}?base=production&state=closed&sort=updated&direction=desc&per_page=${perPage}`;
    const response = await axios.get(url, { headers });
    const pullRequests = response.data;

    // Filter and format PRs
    return pullRequests
      .filter((pr: any) => pr.merged_at !== null && pr.merged_at !== undefined)
      .map((pr: any) => ({
        time: pr.merged_at.replace('T', ' ').replace('Z', ''), // Keep full date & time
        repo: repo,
        pr_number: pr.number,
        head_sha: pr.head.sha,  // Extract commit SHA for workflow check
      }));

  } catch (error) {
    console.error(`❌ Error fetching pull requests for ${repo}:`, error);
    return [];
  }
}

// Function to fetch workflow status for a given repo and commit SHA
async function getWorkflowStatus(repo: string, head_sha: string) {
  try {
    const url = `https://api.github.com/repos/${org}/${repo}/actions/runs?head_sha=${head_sha}`;
    const response = await axios.get(url, { headers });

    const workflowRuns = response.data.workflow_runs;
    if (workflowRuns.length === 0) return 'No Runs Found';

    return workflowRuns[0].conclusion || 'In Progress';
  } catch (error) {
    console.error(`❌ Error fetching workflow status for ${repo} (SHA: ${head_sha}):`, error);
    return 'Error';
  }
}

// Function to fetch approvers for a given PR
async function getPRApprovers(repo: string, pr_number: number) {
  try {
    const url = `https://api.github.com/repos/${org}/${repo}/pulls/${pr_number}/reviews`;
    const response = await axios.get(url, { headers });

    return response.data
      .filter((review: any) => review.state === "APPROVED")
      .map((review: any) => review.user.login);
  } catch (error) {
    console.error(`❌ Error fetching approvers for PR #${pr_number} in ${repo}:`, error);
    return [];
  }
}

// Function to fetch commits for a given PR
async function getPRCommits(repo: string, pr_number: number) {
  try {
    const url = `https://api.github.com/repos/${org}/${repo}/pulls/${pr_number}/commits`;
    const response = await axios.get(url, { headers });

    return response.data.map((commit: any) => ({
      authorName: commit.commit.author.name,
      message: commit.commit.message
    }));
  } catch (error) {
    console.error(`❌ Error fetching commits for PR #${pr_number} in ${repo}:`, error);
    return [];
  }
}

// Run the function for all repositories and merge into one timeline
export async function fetchAllRepositories() {
  console.log(`🚀 Fetching merged pull requests from all repositories...`);
  let allMergedPRs: GithubCommit[] = [];

  for (const repo of repositories) {
    const mergedPRs = await getMergedPullRequests(repo);
    allMergedPRs = [...allMergedPRs, ...mergedPRs];
  }

  console.log(`📊 Sorting all merged pull requests by date...`);
  allMergedPRs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  console.log(`🔄 Fetching workflow statuses, approvers, and commits for each pull request...`);
  for (const pr of allMergedPRs) {
    pr.status = await getWorkflowStatus(pr.repo, pr.head_sha);
    pr.approvers = await getPRApprovers(pr.repo, pr.pr_number);
    pr.commits = await getPRCommits(pr.repo, pr.pr_number);
  }

  // console.log(`✅ Final PR Data:\n`, JSON.stringify(allMergedPRs, null, 2));
  return allMergedPRs;
}

// fetchAllRepositories();

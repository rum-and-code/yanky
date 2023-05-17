const axios = require('axios');
const { Command } = require('commander');
const fs = require('fs');
const toml = require('toml');

const program = new Command();

if (!fs.existsSync('./config.toml')) {
  console.error('Error: config.toml not found');
  process.exit(1);
}

const file = fs.readFileSync('./config.toml', 'utf-8');
config = toml.parse(file);

program.version('1.0.0');
program
  .action(async () => {
    const { owner, team_slug: team, token, exclude_bots: excludeBots } = config;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }

    console.log('\n\x1b[32m%s\x1b[0m', "Let's Yank this!");
    console.log('\x1b[33m%s\x1b[0m%s', "Organization: ", owner);
    console.log('\x1b[33m%s\x1b[0m%s', "Team: ", team);
    console.log("\nFetching repositories...");

    const response = await axios.get(`https://api.github.com/orgs/${owner}/repos?per_page=100`, { headers });
    if (response.status !== 200) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      process.exit(1);
    }
    const repoNames = response.data.map(repo => repo.name);
    console.log("Found", repoNames.length, "repositories for organization", owner);

    const filterByTeam = async (repoName) => {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/teams`, { headers });
      if (response.status !== 200) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        process.exit(1);
      }
      const teamNames = response.data.map(obj => obj.slug);
      return teamNames.includes(team);
    }

    const filterAsync = async (array, filterFunc) => {
      const results = await Promise.all(array.map(filterFunc));
      return array.filter((_v, i) => results[i]);
    }

    const getOpenPullRequests = async (repoName) => {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/pulls?state=open`, { headers });
      if (response.status !== 200) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        process.exit(1);
      }
      return response.data
        .filter((pr) => {
          if (excludeBots) {
            return pr.user.type !== 'Bot';
          } else {
            return true;
          }
        })
    }

    const enhancePullRequestWithReview = async (pullRequest) => {
      ;
      const { number, head: { repo: { name } } } = pullRequest;
      const response = await axios.get(`https://api.github.com/repos/${owner}/${name}/pulls/${number}/reviews`, { headers });
      if (response.status !== 200) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        process.exit(1);
      }
      const results = response.data
      const reviewStates = results.map((review) => review.state);
      return { ...pullRequest, reviewStates };
    }

    filterAsync(repoNames, filterByTeam)
      .then(async (repos) => {
        console.log("Found", repos.length, "repositories for team", team);
        const result = await Promise.all(repos.map(getOpenPullRequests));
        const openPullRequests = result.flat();
        console.log("Found", openPullRequests.length, "open pull requests in these repos");
        const openPullRequestsWithReviews = await Promise.all(openPullRequests.map(enhancePullRequestWithReview));
        console.log("Getting reviews for these pull requests...");
        console.log("\n");
        openPullRequestsWithReviews
          .forEach((pr) => {
            if (pr.draft) {
              console.log('\x1b[36m%s\x1b[0m (Draft)', pr.title);
            } else if (pr.reviewStates.includes('APPROVED')) {
              console.log('\x1b[32m%s\x1b[0m', pr.title); // green
            } else {
              console.log('\x1b[33m%s\x1b[0m', pr.title); // yellow
            }
            console.log(pr._links.html.href);
            if (pr.reviewStates.length !== 0) {
              console.log("Review States:", pr.reviewStates.join(', '));
            }
            console.log("\n");
          });
      });
  });

program.parse(process.argv);

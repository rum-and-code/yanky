const axios = require('axios');
const { Command } = require('commander');
const dotenv = require('dotenv');

dotenv.config();

const program = new Command();
program.version('1.0.0');

program
  .action(async () => {
    const owner = process.env.OWNER;
    const team = process.env.TEAM_SLUG;
    const token = process.env.TOKEN;
    const excludeBots = (process.env.EXCLUDE_BOTS && process.env.EXCLUDE_BOTS != 'false') || true;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }

    console.log('\n\x1b[32m%s\x1b[0m', "Let's Yank this!");
    console.log('\x1b[33m%s\x1b[0m%s', "Organization: ", owner);
    console.log('\x1b[33m%s\x1b[0m%s', "Team: ", team);
    console.log("\nFetching repositories...");

    const response = await axios.get(`https://api.github.com/orgs/${owner}/repos?per_page=100`, {headers});
    if (response.status !== 200) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      process.exit(1);
    }
    const repoNames = response.data.map(repo => repo.name);
    console.log("Found", repoNames.length, "repositories for organization", owner);

    const filterByTeam = async (repoName) => {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/teams`, {headers});
      if (response.status !== 200) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        process.exit(1);
      }
      const teamNames = response.data.map(obj => obj.slug);
      return teamNames.includes(team);
    }

    async function filterAsync(array, filterFunc) {
      const results = await Promise.all(array.map(filterFunc));
      return array.filter((_v, i) => results[i]);
    }

    const getOpenPullRequests = async (repoName) => {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/pulls?state=open`, {headers});
      if (response.status !== 200) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        process.exit(1);
      }
      const results = response.data
      .filter((pr) => {
        if (excludeBots) {
          return pr.user.type !== 'Bot';
        } else {
          return true;
        }
      })
      .map((pr) => {
        return {
          title: pr.title,
          url: pr._links.html.href,
        }
      });
      return results;
    }

    filterAsync(repoNames, filterByTeam)
    .then(async (result) => {
      console.log("Found", result.length, "repositories for team", team);
      console.log("\n\n");
      const repoPullRequests = await Promise.all(result.map(getOpenPullRequests));
      repoPullRequests
      .filter((pr) => pr.length > 0)
      .forEach((pullRequests) => {
        pullRequests.forEach((pr) => {
          console.log('\x1b[33m%s\x1b[0m', pr.title);
          console.log(pr.url);
          console.log("\n");
        });
      });
    });
  });

program.parse(process.argv);

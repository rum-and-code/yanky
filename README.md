Use `yanky` to get the GitHub pull requests of a specific team in your organization.

## Setup

1. Create config.toml (see "Configuration file)
2. Update your shell (see "Changes to shell environment")
3. `npm install`
4. You should be good to call `yanky` from anywhere now.

## Configuration file

Copy `config.toml.example` to `config.toml` and supply the following parameters:

### Required parameters:

- owner: GitHub organization name
- token: Your personal access token (see below)
- team_slug: GitHub team name (will be kebab-case with no accents, so "Les Très Émus 4" would be `les-tres-emus-4`)

### Optional parameter:

- exclude_bots: (optional) if "false", results will include Bot-created PR, such as those by dependabot.

## Changes to shell environment

You need to make the `yanky` directory available in your environment as `YANKY_PATH`. The `yanky` script is just a wrapper around `npm start` with a `--prefix` argument to tell `npm` where to find the `package.json`, etc. You'll also want to add this directory to your path so you can run `yanky` from anywhere. In `.zshrc` (the default shell in macOS) this would involve:

```
export YANKY_PATH="${HOME}/<your path>/yanky"
export PATH="${YANKY_PATH}:${PATH}"
```

## Yanky GUI

Yanky also comes with a small GUI application that will run in the macOS menu bar. To run, once your shell environment is correctly setup, simply call `yanky-g` instead of `yanky`.
It will run `yanky` in the background every 10 minutes and display the results. You can check or uncheck the PRs to help you keep track of which PRs you have reviewed.
Clicking on a PR will open the PR directly in your default browser.

TODO: (this is a WIP, new features to be added over time)

- [ ] Add a manual refresh button
- [ ] Add the time it last refreshed the PRs.
- [ ] Show a badge over the menu bar icon to show when there are new PRs.

## GitHub Fine-grained Personal Access Token

Follow [these instructions for generating a fine-grained personal access token limited to our orgs repos](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token). Your token will need read-only permission for Administration, Metadata and Pull requests on all R&C repos.

## Setup

To setup and run:

```
npm install
./yanky
```

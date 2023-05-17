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

## GitHub Fine-grained Personal Access Token

Follow [these instructions for generating a fine-grained personal access token limited to our orgs repos](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token). Your token will need read-only permission for Administration, Metadata and Pull requests on all R&C repos.


## Setup

To setup and run:
```
npm install
./yanky
```

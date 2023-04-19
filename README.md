Use `yanky` to get the GitHub pull requests of a specific team in your organization.

## Environment

We recommend managing the environment with a `.envrc` file and using `direnv`. You can copy `envrc.example` to `.envrc` to start.

### Required environment variables are:
- OWNER: GitHub organization name
- TOKEN: Your personal access token (see below)
- TEAM: GitHub team name (will be snake-case with no accents, so "Les Très Émus 4" would be `les-tres-emus-4`)

### Optional

- EXCLUDE_BOTS: (optional) if "false", results will include Bot-created PR, such as those by dependabot.

## GitHub Fine-grained Personal Access Token

Follow [these instructions for generating a fine-grained personal access token limited to our orgs repos](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token). Your token will need read-only permission for Administration, Metadata and Pull requests on all R&C repos.


## Setup

To setup and run:
```
npm install
./yanky
```

Repolet

Copy a complete GitHub repository or a specific GitHub folder directly to your local filesystem.

Repolet does not create a ZIP file and does not copy the .git history. It downloads the actual files into a normal local directory.

Features

Copy an entire GitHub repository

Copy only a specific GitHub subfolder

Support nested folders

Preserve binary files such as PNG, PDF, MP3, SVG, etc.

Custom destination folder

Recursive file discovery

GitHub token support

Download progress

Existing-folder protection

Installation

Using npm:

npm install -g repolet

Using pnpm:

pnpm add -g repolet

Or run directly with:

npx repolet <github-url>

Usage

Copy an entire repository

repolet https://github.com/user/repository

For example:

repolet https://github.com/Devendradhote001/KODR4-React kodr-repo

Creates:

kodr-repo/
├── public/
├── src/
├── package.json
└── ...

Copy a specific folder

repolet https://github.com/user/repository/tree/main/src my-src

For example:

repolet https://github.com/shivsingh78/my-portfolio/tree/main/src my-portfolio-src

Creates:

my-portfolio-src/
├── App.jsx
├── assets/
├── components/
├── index.css
└── main.jsx

Destination is optional

repolet https://github.com/user/repository/tree/main/src

Repolet will use the selected folder name as the destination.

GitHub Authentication

Public repositories can be downloaded without authentication.

For private repositories or higher GitHub API limits, set a GitHub fine-grained personal access token:

export GITHUB_TOKEN="your_token"

Then:

repolet https://github.com/user/private-repo private-repo

The token is read from:

GITHUB_TOKEN

Repolet does not store the token.

For a fine-grained token, use the minimum required repository permissions, such as:

Contents → Read-only

Options

repolet --help
repolet --version

Examples

Copy a complete repository:

repolet https://github.com/user/repository

Copy a folder:

repolet https://github.com/user/repository/tree/main/components

Copy to a custom directory:

repolet https://github.com/user/repository/tree/main/components ui-components

Requirements

Node.js 18 or newer

License

MIT
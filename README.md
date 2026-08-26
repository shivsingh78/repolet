Repolet

Copy a GitHub repository or any subfolder directly to your local machine.



🚀 Install

npm install -g repolet

Or use without installing:

npx repolet <github-url>

📦 Usage

Copy a repository:

repolet https://github.com/facebook/react

Copy a specific folder:

repolet https://github.com/expressjs/express/tree/master/lib

Choose a destination:

repolet https://github.com/expressjs/express/tree/master/lib my-lib

✨ Features

Copy full repositories or selected folders

Recursively copy nested directories

Supports binary files such as PNG, PDF, MP3, and SVG

Supports GitHub branches

Optional GITHUB_TOKEN authentication

Protects existing destination folders

No ZIP files and no .git history

🔐 Authentication

Public repositories work without a token.

For private repositories:

export GITHUB_TOKEN="your_token"

Windows PowerShell:

$env:GITHUB_TOKEN="your_token"

Use a GitHub fine-grained token with Contents: Read-only.

⚙️ Options

repolet --help
repolet --version

🧰 Requirements

Node.js 18+

Internet connection

📄 License

MIT

Repolet — take the part of GitHub you actually need.
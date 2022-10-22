# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

First of all, you need to install both [Node.js](https://nodejs.org/en/) and [Yarn](https://classic.yarnpkg.com/lang/en/).

After of it, check yarn is successfully installed using below command. Input in the command prompt:

```
yarn --version
```

Move to the directory of this repository in the command prompt and then input the command:

```
$ yarn
```

Ok, let's started to write post.

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

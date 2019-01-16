# SAFE CLI Proof Of Concept

|Linux/OS X|Windows|Coverage Status|
|:---:|:---:|:---:|
|[![Build Status](https://travis-ci.org/joshuef/node-cli-starter.svg?branch=master)](https://travis-ci.org/joshuef/node-cli-starter)|[![Build status](https://ci.appveyor.com/api/projects/status/uqlsh2o5e5qxfw2s?svg=true)](https://ci.appveyor.com/project/joshuef/node-cli-starter)|[![Coverage Status](https://coveralls.io/repos/github/joshuef/node-cli-starter/badge.svg?branch=master)](https://coveralls.io/github/joshuef/node-cli-starter?branch=master)|


A simple CLI for accessing SAFE. Super POC, almost no features as yet, and has only been tested on MacOS.

The commands could/should probably be pulled out to be more modular. They could, perhaps form a basis of another API layer on SAFE, wrapping some of the lower level functionalities to keep things simple for users.


## Setup:

- `yarn`
- `yarn build`
- `chmod +x lib` or equivalent on windows 

## Running

- `./lib/<script>`

Flags:

```js
-g --get Get a url 
-s --src-dir Source directory for uploads
-p --pid Process pid for receiving IPC
-r --response Response URL from safe authenticator.
```

### GET 
- `./lib/get/index.js -l -g <safe://url-or-xorurl>`

### UPLOAD

Will walk over a directory and upload all contents.

No you cannot target a single file just now. No you cannot upload recursive dirs.

Everything will be given mimetype 'text/plain' for now. (just to stop the browser trying to dl everying)

- `./lib/upload/index.js -l -s ./dist`



## OSX Helper app.

In order to receive the url param on OSX, after registering the CLI app the `url-helper.app` is needed to receive these native OSX events.

It's a simple applescript (can be viewed via the applescript editor), which passes the params onto the compiled `lib/index.js` for handling.

debugging this app can be done by looking for `SAFE URL Helper` in the system logs.

## TODO

In project you'll need to edit:

- Package.json
    - rename
    - change version
    - change repo
    - change author
- Clear changelog.md
- Readme
    - title
    - badges

## Features:

- `.editorconfig`
- CI (basic travis and appveyor files).
- eslint
- jest
- babel
- commander
- bristol logger
- conventional-changelogsss

License: MIT

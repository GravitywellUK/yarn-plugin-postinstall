# `@yarnpkg/plugin-postinstall`

Yarn v2 only runs postinstall hooks if cached dependencies have changed. This Yarn plugin adds support for defining a postinstall hook in the `.yarnrc.yml` file, which is *always* run after each `yarn install`.

## Installation

You can add this plugin to your Yarn 2 ("Yarn Berry") project running the following command:

```bash
yarn plugin import https://raw.githubusercontent.com/gravitywelluk/yarn-plugin-postinstall/master/bundles/%40yarnpkg/plugin-postinstall.js
```

## Configuration

Before using the `postinstall` hook, you must first define it in your `.yarnrc.yml` file.

```yaml
# .yarnrc.yml

postinstall: npx pod-install ios
```

## Usage

You can now call `yarn postinstall` to manually trigger the `postinstall` hook. Otherwise, the hook will run after *every* `yarn install` command.

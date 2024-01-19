# Voya Design System

[Demo](https://pages.github.voya.net/Voya/VDS/)

- [Voya Design System](#voya-design-system)
  - [Overview](#overview)
  - [Project Setup](#project-setup)
  - [Development](#development)
  - [Build](#build)
  - [Run Prettier and Lint format Before Code Commit:](#run-prettier-and-lint-format-before-code-commit)
  - [Prettier](#prettier)
  - [Additional Resources](#additional-resources)

## Overview
A library of native Web Components to be reused across Voya's web platforms. This library leverages `LitElement`, and includes polyfills necessary to support all evergreen browsers, as well as IE11.

To learn more about Web Components, check out [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components) or [Google](https://developers.google.com/web/fundamentals/web-components/). [LitElement](https://lit-element.polymer-project.org/) is created and distributed by the Polymer team at Google. [Lit-HTML](https://lit-html.polymer-project.org/) is the template library LitElement includes as a dependency. 

## Project Setup

1. Clone the repository.

```
git clone git@github.com:Voya-Financial/vds.git
```

2. Install the dependencies.

```
npm install
```

## Development

To run the dev server, run:

```
npm run start
```

View the demo app at `http://localhost:8080`. The demo app is compiled from the `demo/index.js` entrypoint, which includes all components, as well as any demo-specific styles, assets, and components. These consist of the contents of `demo/`, as well as the `demo.js` and `README.md` files for each component.

Initialize any new components in the `components/` directory, and import them in the entrypoint at `src/index.js`. Add new components to the demo by following the pattern established in `demo/components/v-demo-app/demo-config.js`.

To keep the Github Pages [demo site](https://pages.github.voya.net/Voya/VDS/) in sync with the VDS repository, run the docs command `npm run docs` and commit the generated doc-bundle.js along with your pull request.

## Build

To create a build for production use, run the build command:

```
npm run build
```

This will output the following in the `build/` directory:

- `bundle.js`
- `static` folder

The `bundle.js` should be sourced in your project - once done, you'll be able to use any of the components in your markup. Note that this build excludes the `demo.js` files and `README.md` files, which are only imported in the demo app.

The `static` contains all of the css and images used in the components, as well as the `@font-face` declarations. Change the values of the variables to re-theme the project. The `@font-face` declarations will need to be updated with your project's fonts.

## Run Prettier and Lint format Before Code Commit:
`https://open-wc.org/linting/`

Please Run below commands before anyone commits the code:
npm run format to auto format your files.
npm run lint to check if any file has lint issues.
Whenever you create a commit the update files will be auto formatted and the commit message will be linted for you.
TODO: Need to add npm run test prepush hook to fail any missing test scripts.
Test Cases Running on Port http://localhost:9876/debug.html 

## Prettier

To maintain code formatting consistency, we have implemented Prettier. Prettier and ESLint are run automatically via a precommit hook whenever changes are git added. Additionally, Prettier can be configured to format automatically on save in your code editor; see below links:

VSCode: https://github.com/prettier/prettier-vscode
Atom: https://atom.io/packages/prettier-atom
SublimeText: https://github.com/danreeves/sublime-prettier

The config for prettier is located in package.json:

```
"prettier": {
    "singleQuote": true,
    "trailingComma": "all"
  }
```

Usage:

Install Globally (https://prettier.io/docs/en/install.html)

```
npm install --global prettier
```

Additional Details: https://prettier.io/docs/en/index.html

## Additional Resources
Tutorials:

* [Web Components - Basics](https://open-wc.org/codelabs/basics/web-components.html?index=/codelabs/#0)
* [LitHTML & LitElement: Basics](https://open-wc.org/codelabs/basics/lit-html.html?index=/codelabs/#0)
* [LitHTML & LitElement: Intermediate](https://open-wc.org/codelabs/intermediate/lit-html.html?index=/codelabs/#0)

Code Examples:
* [Examples for using the lit-html library and LitElement base class](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F01-basic-setup.js)


How to include VDS individual component bundles integrating with applications:
<head>
  <script src="./v-polyfills.js"></script>//babel and webcomponent polyfills
  <script src="./v-vendor.js"></script>//VDS Lit Element and Webcomponents dependencies.
  <script src="./v-theme-component.js"></script> // baseconfigs and themecompoents to be loaded initially.
  <script src="./v-article-infobar-topics.js"></script>//load individual components and it's dependent components.
  <script src="./v-article-infobar.js"></script>
  <script src="./v-article-list-item.js"></script>
  <script src="./v-article-list.js"></script>
  <v-article-list></v-article-list>
</head>
How to include VDS all components bundle integrating with applications:
<head>
  <script src="bundle.js"></script>//babel and webcomponent polyfills
</head>
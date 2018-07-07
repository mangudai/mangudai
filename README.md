# Mangudai

> AoE2 Random Map Scripting for humans

JavaScript parser and linter for [Random Map Scripts](http://aok.heavengames.com/cgi-bin/forums/display.cgi?action=ct&f=28,42485,,30) (RMS) for the [Age of Empires II](https://en.wikipedia.org/wiki/Age_of_Empires_II) video game.

- [Online playground](https://mangudai.github.io/) ([repo](https://github.com/mangudai/mangudai.github.io))
- [VS Code extension](https://marketplace.visualstudio.com/items?itemName=deltaidea.aoe2-rms) ([repo](https://github.com/mangudai/vscode))
- [Sublime Text package](https://packagecontrol.io/packages/AoE2%20RMS%20Syntax%20Highlighting) ([repo](https://github.com/mangudai/sublime-text))

## Install

Mangudai is published as an [NPM](https://docs.npmjs.com/getting-started/what-is-npm) package compatible with [Node.js](https://nodejs.org/en/) and browsers.

```Bash
npm install mangudai
```

Use a tool like [Webpack](https://webpack.js.org) or [Rollup](https://rollupjs.org/) to include Mangudai in your front-end app.

The code is compiled to ES5 (old and stable JavaScript) before publishing, so the module has maximum compatibility out-of-the-box.

## Usage

Let's parse an RMS script into an [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST) and lint it.

```JavaScript
import { parse, lint } from 'mangudai'

const { ast, errors } = parse('<PLAYER_SETUP> \n random_placement')

if (errors.length) {
  console.log('Unable to parse the script! Probably invalid syntax.', errors)
} else {
  const lintErrors = lint(ast)
  console.log(`Linter found ${lintErrors.length} problems.`, lintErrors)
}
```

Mangudai is written in [TypeScript](https://www.typescriptlang.org/) and exports all relevant typings.

## API

- ### parse( script: `string` ) => { ast: [`Script`](docs/ast-spec.md), errors: [`ParseError[]`](docs/errors.md) }
- ### lint( ast: [`Script`](docs/ast-spec.md) ) => [`LintError[]`](docs/errors.md)

## Contribute

[![Travis status](https://img.shields.io/travis/mangudai/mangudai/master.svg)](https://travis-ci.org/mangudai/mangudai)
[![Test coverage](https://img.shields.io/codecov/c/github/mangudai/mangudai/master.svg)](https://codecov.io/gh/mangudai/mangudai)
[![TypeScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com/)
[![Standard Readme](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)

This project is still in its early development stage. Any help is greatly appreciated! Feel free to ask questions in issues. PRs accepted.

## License

[MIT](./LICENSE.md) © Mangudai contributors

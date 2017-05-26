# Mangudai

[![Greenkeeper badge](https://img.shields.io/badge/greenkeeper-enabled-brightgreen.svg)](https://greenkeeper.io/)
[![Travis status](https://img.shields.io/travis/deltaidea/mangudai/master.svg)](https://travis-ci.org/deltaidea/mangudai)
[![Test coverage](https://img.shields.io/codecov/c/github/deltaidea/mangudai/master.svg)](https://codecov.io/gh/deltaidea/mangudai)
[![TypeScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com/)
[![Standard Readme](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)

> AoE2 Random Map Scripting for humans

JavaScript library for working with [Random Map Scripts](http://aok.heavengames.com/cgi-bin/forums/display.cgi?action=ct&f=28,42485,,30) (RMS) for the [Age of Empires II](https://en.wikipedia.org/wiki/Age_of_Empires_II) video game.

Currently Mangudai can parse an RMS script into an [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST) and serialize AST back into a string.

Motivation for this project comes from the lack of open-source tooling: syntax highlighting, linting, parsing into AST for advanced third-party tools.

The goal of this project is to make writing random maps accessible to the AoE2 community at large by making it as straight-forward and pleasant as possible. There's also potential to bring all the necessary tools online since this is a JavaScript project.

## Install

Mangudai is published as an [NPM](https://docs.npmjs.com/getting-started/what-is-npm) package compatible with [Node.js](https://nodejs.org/en/) and browsers.

```Bash
npm install --save mangudai
```

Use a tool like [Webpack](https://webpack.js.org) or [Rollup](https://rollupjs.org/) to include Mangudai in your front-end code.

## Usage

```JavaScript
import { parseRms, serializeRms } from 'mangudai'

// ast: { type: 'Script', statements: ... }
const { ast, errors } = parse('<PLAYER_SETUP> \n random_placement')
const generatedRms = serialize(ast)
```

Mangudai is written in [TypeScript](https://www.typescriptlang.org/) and exports all relevant typings.

## Contribute

This project is still in its early development stage. Any help is greatly appreciated! Feel free to ask questions in issues. PRs accepted.

## License

[MIT](./LICENSE.md) © Nikita Litvin

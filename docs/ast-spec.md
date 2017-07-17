# RMS Abstract Syntax Tree Specification

<!-- TOC -->

- [RMS Abstract Syntax Tree Specification](#rms-abstract-syntax-tree-specification)
  - [Example](#example)
  - [Node objects](#node-objects)
  - [Script](#script)
  - [IfStatement](#ifstatement)
    - [ElseIfStatement](#elseifstatement)
  - [RandomStatement](#randomstatement)
    - [ChanceStatement](#chancestatement)
  - [SectionStatement](#sectionstatement)
  - [CommandStatement](#commandstatement)
  - [ConditionalCommandStatement](#conditionalcommandstatement)
  - [AttributeStatement](#attributestatement)
  - [DeclarationStatement](#declarationstatement)
  - [IncludeDrsStatement](#includedrsstatement)
  - [MultilineComment](#multilinecomment)

<!-- /TOC -->

## Example

```RMS
<PLAYER_SETUP>
random_placement
```

The RMS script above is parsed into this AST:

```JSON
{
  "type": "Script",
  "statements": [
    {
      "type": "SectionStatement",
      "name": "PLAYER_SETUP",
      "statements": [
        {
          "type": "CommandStatement",
          "name": "random_placement",
          "args": []
        }
      ]
    }
  ]
}
```

## Node objects

AST is a nested plain object. Every AST node implements the following interface:

```TypeScript
interface AstNode {
  type: string
}
```

Below are the core Mangudai AST node types.

If you'd like to have access to concrete tokens, `AstNode` implements `CstNode` interface and has [non-enumerable](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) properties `children` (array) and `childrenByType` (object with arrays). There's also a bunch of helpers for common tasks like finding nodes of a particular type:

- [`import * as treeHelpers from 'mangudai/treeHelpers'`](src/treeHelpers.ts)
- [`import * as tokenHelpers from 'mangudai/tokenHelpers'`](src/tokenHelpers.ts)

## Script

```TypeScript
{
  type: 'Script',
  statements: Statement[]
}
```

Represents the whole script. This is always the root AST node. Even an empty RMS script is considered a `Script` node without children.

An RMS script consists of statements. Possible types of these statements are explored below.

## IfStatement

```TypeScript
{
  type: 'IfStatement',
  condition: string,
  statements?: Statement[],
  elseifs?: ElseIfStatement[],
  elseStatements?: Statement[]
}
```

There're three places where an `if` statement can appear: as a top-level statement, in a section, and in a command. Statements inside the `if` will be of the same type as the siblings outside, i.e. an `if` inside a section can only contain statements that are legal inside a section.

### ElseIfStatement

```TypeScript
{
  type: 'ElseIfStatement'
  condition: string,
  statements?: Statement[]
}
```

## RandomStatement

```TypeScript
{
  type: 'RandomStatement',
  statements: (MultilineComment | ChanceStatement)[]
}
```

A block of random choices. Example:

```RMS
start_random
  percent_chance 50
    #define SUMMER /* 50% chance of being a "summer" map */
  percent_chance 50
    #define WINTER /* 50% chance of being a "winter" map */
end_random
```

### ChanceStatement

```TypeScript
{
  type: 'ChanceStatement',
  chance: number,
  statements: Statement[]
}
```

## SectionStatement

```TypeScript
{
  type: 'SectionStatement',
  name: string,
  statements: Statement[]
}
```

A section that starts with `<SECTION_NAME>` and contains commands.

## CommandStatement

```TypeScript
{
  type: 'CommandStatement',
  name: string,
  args: (string | number)[],
  preLeftCurlyComments?: MultilineComment[],
  statements?: Statement[]
}
```

A command (instruction) related to the current section, e.g. `random_placement` or `create_object`.

A command optionally has arguments, e.g. `base_terrain DIRT`: `base_terrain` is a command name, `DIRT` is an argument.

A command can also have an optional set of attributes in curly brackets, e.g. `create_object TOWN_CENTER { ... }`, in which case `preLeftCurlyComments` may contain comments that appear before the opening curly: `command /* here */ { ... }`.

## ConditionalCommandStatement

```TypeScript
ConditionalCommandStatement {
  type: 'ConditionalCommandStatement',
  header: IfStatement,
  preLeftCurlyComments?: MultilineComment[],
  statements?: Statement[]
}
```

A special kind of command that has an `if` before the attributes `{ ... }`. Example:

```RMS
if TROPICAL_MAP
  create_object JAVELINA
else
  create_object BOAR
endif
{
  number_of_objects 1
  set_loose_grouping
}
```

This is obviously so different from normal commands that it deserves its own statement type.

## AttributeStatement

```TypeScript
{
  type: 'AttributeStatement',
  name: string,
  args: (string | number)[]
}
```

## DeclarationStatement

```TypeScript
{
  type: 'DeclarationStatement',
  kind: 'const' | 'define',
  name: string,
  value?: number
}
```

Definition of a constant, e.g. `#const FOO 10`, or a flag, e.g. `#define IS_WATER_MAP`.

## IncludeDrsStatement

```TypeScript
{
  type: 'IncludeDrsStatement',
  filename: string,
  id?: number
}
```

`#include_drs` statement. They are ignored when used in custom maps. However, some people still copy them by mistake. Example:

```RMS
#include_drs random_map.def 54000
```

## MultilineComment

```TypeScript
{
  type: 'MultilineComment',
  comment: string
}
```

A comment. The `comment` property contains the whole comment as it appears in the script text, including `/* */`.

# RMS AST Specification

This file defines the format of Random Map Script (RMS) Abstract Syntax Tree (AST) in hopes of compatibility between RMS-related tools.

## Example

This RMS script:

```
<PLAYER_SETUP>
random_placement
```

Matches this AST:

```JSON
{
  "type": "RandomMapScript",
  "statements": [
    {
      "type": "Section",
      "name": "PLAYER_SETUP",
      "statements": [
        {
          "type": "Command",
          "name": "random_placement",
          "args" []
        }
      ]
    }
  ]
}
```

## Nodes

### RandomMapScript

```TypeScript
{
  type: 'RandomMapScript',
  statements: TopLevelStatement[]
}
```

Represents the whole script. This is always the root AST node. Even an empty RMS script is considered a `RandomMapScript` node without children.

An RMS script consists of statements. Possible types of these statements are explored below.

### TopLevelStatement

```TypeScript
Section | ConstDefinition | FlagDefinition | If<TopLevelStatement>
```

### If<Child>

```TypeScript
{
  type: 'If',
  condition: string,
  statements?: Child[],
  elseifs?: { condition: string, statements?: Child[] }[],
  elseStatements?: Child[]
}
```

There're three places where an `if` statement can appear: as a top-level statement, in a section, and in a command. Statements inside the `if` must be of the same type as the siblings outside, i.e. an `if` inside a section can only contain statements that are legal inside a section. This is what `<Child>` refers to in this generic definition.

### Section

```TypeScript
{
  type: 'Section',
  name: string,
  statements: SectionStatement[]
}
```

Represents a section that starts with `<SECTION_NAME>` and contains commands.

### SectionStatement

```TypeScript
Command | ConstDefinition | FlagDefinition | If<SectionStatement>
```

### Command

```TypeScript
{
  type: 'Command',
  name: string,
  args: (string | number)[],
  statements?: CommandStatement[]
}
```

Represents a command (instruction) related to the current section, e.g. `random_placement` or `create_object`.

A command optionally has arguments, e.g. `base_terrain DIRT`: `base_terrain` is a command name, `DIRT` is an argument.

A command can also have an optional set of attributes in curly brackets, e.g. `create_object TOWN_CENTER { ... }`.

### CommandStatement

```TypeScript
Attribute | If<CommandStatement>
```

### Attribute

```TypeScript
{
  type: 'Attribute',
  name: string,
  args: (string | number)[]
}
```

### ConstDefinition

```TypeScript
{
  type: 'ConstDefinition',
  name: string,
  value: number
}
```

Represents definition of a custom constant, e.g. `#const FOO 10`.

### FlagDefinition

```TypeScript
{
  type: 'FlagDefinition',
  flag: string
}
```

Represents definition of a custom bool flag, e.g. `#define IS_WATER_MAP`.

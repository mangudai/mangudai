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
          "name": "random_placement"
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

An RMS script consists of statements. Types of statements are explored below.

### TopLevelStatement

```TypeScript
Section | ConstDefinition | FlagDefinition
```

### Section

```TypeScript
{
  type: 'Section',
  name: string,
  statements: SectionStatement[]
}
```

### SectionStatement

```TypeScript
Command | ConstDefinition | FlagDefinition
```

### Command

```TypeScript
{
  type: 'Command',
  name: string,
  value?: string | number,
  attributes?: Attribute[]
}
```

### Attribute

```TypeScript
{
  type: 'Attribute',
  name: string,
  value?: string | number
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

### FlagDefinition

```TypeScript
{
  type: 'FlagDefinition',
  flag: string
}
```

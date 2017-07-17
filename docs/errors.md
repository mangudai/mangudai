# Possible errors

<!-- TOC -->

- [Possible errors](#possible-errors)
  - [ParseError](#parseerror)
  - [LintError](#linterror)
  - [TextSpan](#textspan)

<!-- /TOC -->

All errors inherit `Error` as their prototype so you can `throw` and type-check them.

## ParseError

```TypeScript
{
  name: 'ParseError'
  message: string,
  boundaries: TextSpan
}
```

## LintError

```TypeScript
{
  name: 'LintError'
  message: string,
  boundaries: TextSpan
}
```

## TextSpan

This is not an error type, this is the interface of `boundaries` in the errors above.

```TypeScript
{
  start: {
    line: number,
    col: number
  },
  end: {
    line: number,
    col: number
  }
}
```

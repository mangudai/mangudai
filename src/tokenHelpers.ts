import { Token } from 'moo'

const EMPTY_TOKEN: Token = {
  value: '',
  offset: 0,
  size: 0,
  lineBreaks: false,
  line: 1,
  col: 1
}

export function getBoundaries (token: Token = EMPTY_TOKEN): TextSpan {
  const tokenLines = token.value.split('\n')
  return {
    start: {
      line: token.line,
      col: token.col - 1
    },
    end: {
      line: token.line + tokenLines.length - 1,
      col: token.col - 1 + tokenLines[tokenLines.length - 1].length
    }
  }
}

export interface TextSpan {
  start: {
    line: number,
    col: number
  },
  end: {
    line: number,
    col: number
  }
}

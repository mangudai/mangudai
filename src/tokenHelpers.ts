import { Token } from 'moo'
import { ErrorBoundaries } from './'

const EMPTY_TOKEN: Token = {
  value: '',
  offset: 0,
  size: 0,
  lineBreaks: false,
  line: 1,
  col: 1
}

export function getBoundaries (token: Token = EMPTY_TOKEN): ErrorBoundaries {
  const tokenLines = token.value.split('\n')
  return {
    start: {
      line: token.line,
      col: token.col
    },
    end: {
      line: token.line + tokenLines.length - 1,
      col: token.col + tokenLines[tokenLines.length - 1].length - 1
    }
  }
}

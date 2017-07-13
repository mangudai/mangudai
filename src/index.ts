import { TextSpan } from './tokenHelpers'

export * from './parseRms'
export { lint } from './lintRms/index'

export interface TextSpanError extends Error {
  name: string,
  message: string,
  boundaries: TextSpan
}

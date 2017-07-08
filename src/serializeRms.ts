import { AstNode, RmsAst, RmsIf, ElseIf, RandomStatement, ChanceStatement, RmsSection, RmsCommand,
  RmsAttribute, RmsConstDefinition, RmsFlagDefinition, RmsMultilineComment, RmsIncludeDrs } from './parseRms'

const serializers: { [x: string]: (n: AstNode) => string } = {
  RandomMapScript: (ast: RmsAst) => ast.statements.map(serializeNode).join('\n\n') + '\n',

  Section: ({ name, statements}: RmsSection) =>
    `<${name}>\n` +
    statements.map(serializeNode).map(indent).join('\n'),

  Command: ({ name, args, statements }: RmsCommand) =>
    name +
    args.map(a => ' ' + a).join('') +
    (statements === undefined ? '' :
      statements.length ? ' {\n' + statements.map(serializeNode).map(indent).join('\n') + '\n}' : ' {}'),

  Attribute: ({ name, args }: RmsAttribute) => name + args.map(a => ' ' + a).join(''),

  ConstDefinition: ({ name, value }: RmsConstDefinition) => '#const ' + name + ' ' + value,

  FlagDefinition: ({ flag }: RmsFlagDefinition) => `#define ${flag}`,

  IfStatement: ({ condition, statements, elseifs, elseStatements }: RmsIf<any>) => {
    let str = `if ${condition}`
    if (statements && statements.length) str += '\n' + statements.map(serializeNode).map(indent).join('\n')
    if (elseifs && elseifs.length) str += '\n' + elseifs.map(serializeElseif).join('\n')
    if (elseStatements && elseStatements.length) str += '\nelse\n' + elseStatements.map(serializeNode).map(indent).join('\n')
    str += '\nendif'
    return str
  },

  RandomStatement: ({ statements }: RandomStatement<any>) => 'start_random\n' +
    statements.map(serializeNode).map(indent).join('\n') +
    '\nend_random',

  ChanceStatement: ({ chance, statements }: ChanceStatement<any>) => `percent_chance ${chance}\n` +
    statements.map(serializeNode).map(indent).join('\n'),

  MultilineComment: ({ comment }: RmsMultilineComment) => comment,

  IncludeDrs: ({ filename, id }: RmsIncludeDrs) => `#include_drs ${filename}` + (id ? ` ${id}` : '')
}

function serializeElseif ({ condition, statements }: ElseIf<any>) {
  let str = `elseif ${condition}`
  if (statements && statements.length) str += '\n' + statements.map(serializeNode).map(indent).join('\n')
  return str
}

function indent (str: string): string {
  return str.split('\n').map(s => `  ${s}`).join('\n')
}

function serializeNode (node: AstNode): string {
  return serializers[node.type](node)
}

export function serialize (input: RmsAst): string {
  return serializeNode(input)
}

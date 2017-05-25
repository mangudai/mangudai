import { RmsAst, RmsTopLevelStatement, RmsSectionStatement, RmsAttribute, RmsSection, RmsCommand,
  RmsConstDefinition, RmsFlagDefinition } from './parseRms/ast'

type RmsAstNode = RmsAst | RmsTopLevelStatement | RmsSectionStatement | RmsAttribute

const serializers: { [x: string]: (n: RmsAstNode) => string } = {
  Script: (ast: RmsAst) => ast.statements.map(serializeNode).join('\n\n') + '\n',
  Section: ({ name, statements}: RmsSection) =>
    `<${name}>\n` +
    statements.map(serializeNode).map(indent).join('\n'),
  Command: ({ name, value, attributes }: RmsCommand) =>
    name +
    (value === undefined ? '' : ' ' + value) +
    (attributes === undefined ? '' :
      attributes.length ? ' {\n' + attributes.map(serializeNode).map(indent).join('\n') + '\n}' : ' {}'),
  Attribute: ({ name, value }: RmsAttribute) => name + (value === undefined ? '' : ' ' + value),
  ConstDefinition: ({ name, value }: RmsConstDefinition) => '#const ' + name + ' ' + value,
  FlagDefinition: ({ flag }: RmsFlagDefinition) => `#define ${flag}`
}

function indent (str: string): string {
  return str.split('\n').map(s => s ? '  ' + s : s).join('\n')
}

function serializeNode (node: RmsAstNode): string {
  return serializers[node.type](node)
}

export function serialize (input: RmsAst): string {
  return serializeNode(input)
}

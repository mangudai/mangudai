@preprocessor typescript
@{% import { lexer } from './lexer'; %}
@lexer lexer

Script -> __:? ((TopLevelLine %eol):* TopLevelLine %eol:?):? ((Section %eol):* Section %eol:?):?

GenericIfSeq[FirstChild, SecondChild] ->
  %ifToken %space %identifier %eol
  (($FirstChild %eol):* ($SecondChild %eol):*)
  (%elseifToken %space %identifier __ ($FirstChild %eol):* ($SecondChild %eol):*):*
  (%elseToken __ ($FirstChild %eol):* ($SecondChild %eol):*):?
  %endifToken

GenericIf[Child] -> GenericIfSeq[$Child, null]

GenericRandom[Child] ->
  %startRandom %eol (MultilineComment __):*
  (%percentChance %space %int __ ($Child %eol):+):+
  %endRandom

GenericWithComments[Statement] -> (MultilineComment %space:?):* ($Statement (%space:? MultilineComment):* | MultilineComment)

TopLevelLine -> GenericWithComments[(Command | ConstDefinition | FlagDefinition | IncludeDrs | TopLevelIf | TopLevelRandom)]
TopLevelIf -> GenericIf[TopLevelLine]
TopLevelRandom -> GenericRandom[TopLevelLine]

Section -> %lArrow %identifier %rArrow (%eol (SectionLine %eol):* SectionLine):?
SectionLine -> GenericWithComments[(Command | ConstDefinition | FlagDefinition | IncludeDrs | SectionIf | SectionRandom)]
# Sections cannot be nested. Nevertheless, we allow Section to occur inside SectionIf. In that case, it's a TopLevelIf.
# We move the `If` out of the current section and end the section here during CST traversal.
# This seems to be the best way to avoid ambiguity and performance issues.
SectionIf -> GenericIfSeq[SectionLine, Section]
SectionRandom -> GenericRandom[SectionLine]

Command -> Attribute ((__:? MultilineComment):* __:? %lCurly (__ ((CommandLevelLine %eol):* CommandLevelLine %eol:?)):? %rCurly):?
CommandLevelLine -> GenericWithComments[(Attribute | CommandIf | CommandRandom)]
CommandIf -> GenericIf[CommandLevelLine]
CommandRandom -> GenericRandom[CommandLevelLine]

Attribute -> %identifier (%space (%identifier | %int)):*

ConstDefinition -> %constToken %space %identifier %space %int
FlagDefinition -> %define %space %identifier
IncludeDrs -> %includeDrs %space %identifier (%space %int):?

MultilineComment -> %multilineComment

__ -> (%eol | %space):+

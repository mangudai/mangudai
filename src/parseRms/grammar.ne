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

GenericRandomSeq[FirstChild, SecondChild] ->
  %startRandom %eol (MultilineComment __):*
  (%percentChance %space %int __ ($FirstChild %eol):* ($SecondChild %eol):*):+
  %endRandom

GenericRandom[Child] -> GenericRandomSeq[$Child, null]

GenericWithComments[Statement] -> (MultilineComment %space:?):* ($Statement (%space:? MultilineComment):* | MultilineComment)

TopLevelLine -> GenericWithComments[(Command | ConstDefinition | FlagDefinition | IncludeDrs | TopLevelIf | TopLevelRandom)]
TopLevelIf -> GenericIfSeq[TopLevelLine, Section]
TopLevelRandom -> GenericRandomSeq[TopLevelLine, Section]

Section -> %lArrow %identifier %rArrow (%eol (SectionLine %eol):* SectionLine):?
SectionLine -> GenericWithComments[(Command | ConditionalCommand | ConstDefinition | FlagDefinition | IncludeDrs | SectionIf | SectionRandom)]
# Sections cannot be nested. Nevertheless, we allow Section to occur inside SectionIf. In that case, it's a TopLevelIf.
# We move the `If` out of the current section and end the section here during CST traversal.
# This seems to be the best way to avoid ambiguity and performance issues.
SectionIf -> GenericIfSeq[SectionLine, Section]
SectionRandom -> GenericRandomSeq[SectionLine, Section]

Command -> Attribute CommandBody:?
CommandLevelLine -> GenericWithComments[(Attribute | ConstDefinition | FlagDefinition | IncludeDrs | CommandIf | CommandRandom)]
CommandIf -> GenericIf[CommandLevelLine]
CommandRandom -> GenericRandom[CommandLevelLine]

# Special kind of a command with an IfStatement as a header instead of AttributeStatement. See #17.
ConditionalCommand ->
  (
    %ifToken %space %identifier %eol
    (Attribute %eol)
    (%elseifToken %space %identifier __ Attribute %eol):*
    (%elseToken __ Attribute %eol):?
    %endifToken
  )
  CommandBody

CommandBody -> (__:? MultilineComment):* __:? %lCurly (__ ((CommandLevelLine %eol):* CommandLevelLine %eol:?)):? %rCurly

Attribute -> %identifier (%space (%identifier | %int)):*

ConstDefinition -> %constToken %space %identifier %space %int
FlagDefinition -> %define %space %identifier
IncludeDrs -> %includeDrs %space %identifier (%space %int):?

MultilineComment -> %multilineComment

__ -> (%eol | %space):+

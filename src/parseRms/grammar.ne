@preprocessor typescript
@{% import { lexer } from './lexer'; %}
@lexer lexer

Script -> _ ((TopLevelLine eol):* TopLevelLine eol?):? ((Section eol):* Section eol?):?

GenericIf[Child] ->
  %If ws identifier eol
  ($Child eol):*
  (%Elseif ws identifier __ ($Child eol):*):*
  (%Else __ ($Child eol):*):?
  %Endif

GenericIfSeq[FirstChild, SecondChild] ->
  %If ws identifier eol
  (($FirstChild eol):* ($SecondChild eol):*)
  (%Elseif ws identifier __ ($FirstChild eol):* ($SecondChild eol):*):*
  (%Else __ ($FirstChild eol):* ($SecondChild eol):*):?
  %Endif

GenericRandom[Child] ->
  %StartRandom eol (MultilineComment __):*
  (%PercentChance ws int __ ($Child eol):+):+
  %EndRandom

GenericWithComments[Statement] -> (MultilineComment ws?):* ($Statement (ws? MultilineComment):* | MultilineComment)

TopLevelLine -> GenericWithComments[(Command | ConstDefinition | FlagDefinition | IncludeDrs | TopLevelIf | TopLevelRandom)]
TopLevelIf -> GenericIf[TopLevelLine]
TopLevelRandom -> GenericRandom[TopLevelLine]

Section -> %LArrow identifier %RArrow (eol (SectionLine eol):* SectionLine):?
SectionLine -> GenericWithComments[(Command | ConstDefinition | FlagDefinition | SectionIf | SectionRandom)]
# Sections cannot be nested. Nevertheless, we allow Section to occur inside SectionIf. In that case, it's a TopLevelIf.
# We move the `If` out of the current section and end the section here during CST traversal.
# This seems to be the best way to avoid ambiguity and performance issues.
SectionIf -> GenericIfSeq[SectionLine, Section]
SectionRandom -> GenericRandom[SectionLine]

Command -> Attribute (_ %LCurly eol? ((CommandLevelLine eol):* CommandLevelLine eol?):? %RCurly):?
CommandLevelLine -> GenericWithComments[(Attribute | CommandIf | CommandRandom)]
CommandIf -> GenericIf[CommandLevelLine]
CommandRandom -> GenericRandom[CommandLevelLine]

Attribute -> identifier (ws (identifier | int)):*

ConstDefinition -> %Const ws identifier ws int
FlagDefinition -> %Define ws identifier
IncludeDrs -> %IncludeDrs ws identifier (ws int):?

MultilineComment -> %MultilineComment

int -> %Integer
identifier -> %Identifier

eol  -> %LineBreak
eol? -> eol:?
ws   -> %Space
ws?  -> ws:?
__   -> (eol | ws):+
_    -> __:?

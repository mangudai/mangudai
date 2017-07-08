@preprocessor typescript
@{% import { lexer } from './lexer'; %}
@lexer lexer

Script -> _ ((TopLevelStatementsLine eol):* TopLevelStatementsLine eol?):?

GenericIf[Child] -> %If ws identifier eol
                    ($Child eol):*
                    (%Elseif ws identifier __ ($Child eol):*):*
                    (%Else __ ($Child eol):*):?
                    %Endif

GenericRandom[Child] -> %StartRandom eol (MultilineComment __):*
                        (%PercentChance ws int __ ($Child eol):+):+
                        %EndRandom

GenericWithInlineComments[Statement] -> (MultilineComment ws?):* ($Statement (ws? MultilineComment):* | MultilineComment)

TopLevelStatementsLine -> GenericWithInlineComments[(Section | ConstDefinition | FlagDefinition | IncludeDrs | TopLevelIf | TopLevelRandom)]
TopLevelIf -> GenericIf[TopLevelStatementsLine]
TopLevelRandom -> GenericRandom[TopLevelStatementsLine]

Section -> %LArrow identifier %RArrow (eol (SectionStatementsLine eol):* SectionStatementsLine):?
SectionStatementsLine -> GenericWithInlineComments[(Command | ConstDefinition | FlagDefinition | SectionIf | SectionRandom)]
SectionIf -> GenericIf[SectionStatementsLine]
SectionRandom -> GenericRandom[SectionStatementsLine]

Command -> Attribute (_ %LCurly eol? ((CommandStatementsLine eol):* CommandStatementsLine eol?):? %RCurly):?
CommandStatementsLine -> GenericWithInlineComments[(Attribute | CommandIf | CommandRandom)]
CommandIf -> GenericIf[CommandStatementsLine]
CommandRandom -> GenericRandom[CommandStatementsLine]

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

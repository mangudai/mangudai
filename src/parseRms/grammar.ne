@preprocessor typescript
@{% import { lexer } from './lexer'; %}
@lexer lexer

Script -> _ ((TopLevelStatementsLine eol):* TopLevelStatementsLine eol?):?

GenericIf[Child] -> %If ws identifier __
                    ($Child eol):*
                    (%Elseif ws identifier __ ($Child eol):*):*
                    (%Else __ ($Child eol):+):?
                    %Endif

GenericAllowInlineComments[Statement] -> (MultilineComment ws?):* ($Statement (ws? MultilineComment):* | MultilineComment)

TopLevelStatementsLine -> GenericAllowInlineComments[(Section | ConstDefinition | FlagDefinition | IncludeDrs | TopLevelIf)]
TopLevelIf -> GenericIf[TopLevelStatementsLine]

Section -> %LArrow identifier %RArrow (eol (SectionStatementsLine eol):* SectionStatementsLine):?
SectionStatementsLine -> GenericAllowInlineComments[(Command | ConstDefinition | FlagDefinition | SectionIf)]
SectionIf -> GenericIf[SectionStatementsLine]

Command -> Attribute (_ %LCurly eol? ((CommandStatementsLine eol):* CommandStatementsLine eol?):? %RCurly):?
CommandStatementsLine -> GenericAllowInlineComments[(Attribute | CommandIf)]
CommandIf -> GenericIf[CommandStatementsLine]

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

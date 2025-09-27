// All supported AST node types in the JavaScript interpreter
export type NodeType =
  // Expressions
  | "LiteralExpression"
  | "BinaryExpression"
  | "UnaryExpression"
  | "GroupingExpression"
  | "IdentifierExpression"
  | "AssignmentExpression"
  | "UpdateExpression"
  | "TemplateLiteralExpression"
  | "ArrayExpression"
  | "MemberExpression"
  | "DictionaryExpression"
  // Statements
  | "ExpressionStatement"
  | "VariableDeclaration"
  | "BlockStatement"
  | "IfStatement"
  | "ForStatement"
  | "WhileStatement";

export interface LanguageFeatures {
  excludeList?: string[];
  includeList?: string[];
  allowShadowing?: boolean;
  allowTruthiness?: boolean;
  requireVariableInstantiation?: boolean;
  allowTypeCoercion?: boolean;
  oneStatementPerLine?: boolean;
  enforceStrictEquality?: boolean;
  // AST node-level restrictions
  // null/undefined = all nodes allowed (default behavior)
  // [] = no nodes allowed
  // ["NodeType", ...] = only specified nodes allowed
  allowedNodes?: NodeType[] | null;
}

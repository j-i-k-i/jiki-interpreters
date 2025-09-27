// All supported AST node types in the Python interpreter
export type NodeType =
  // Expressions
  | "LiteralExpression"
  | "BinaryExpression"
  | "UnaryExpression"
  | "GroupingExpression"
  | "IdentifierExpression"
  | "ListExpression"
  | "SubscriptExpression"
  // Statements
  | "ExpressionStatement"
  | "PrintStatement"
  | "AssignmentStatement"
  | "BlockStatement"
  | "IfStatement"
  | "ForInStatement"
  | "BreakStatement"
  | "ContinueStatement";

export interface LanguageFeatures {
  excludeList?: string[];
  includeList?: string[];
  allowTruthiness?: boolean;
  allowTypeCoercion?: boolean;
  // AST node-level restrictions
  // null/undefined = all nodes allowed (default behavior)
  // [] = no nodes allowed
  // ["NodeType", ...] = only specified nodes allowed
  allowedNodes?: NodeType[] | null;
}

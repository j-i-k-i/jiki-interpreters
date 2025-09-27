// Python AST node types - stub for now, to be filled in later
export type NodeType = never; // Empty union type for now

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

# ESLint Implementation Plan

## Initial Status (After Auto-Fix)
- **Total Issues**: 645 (reduced from 1,212 after auto-fix)
- **Errors**: 210
- **Warnings**: 435

## Issues Breakdown

### Already Fixed by Auto-Fix (567 issues):
- ✅ `@typescript-eslint/consistent-type-imports` (239) - Added `import type`
- ✅ `curly` (133) - Added curly braces to control statements
- ✅ `@typescript-eslint/consistent-type-definitions` (76) - Changed `type` to `interface`
- ✅ `@typescript-eslint/no-unnecessary-type-assertion` (66) - Removed unnecessary assertions
- ✅ `@typescript-eslint/prefer-readonly` (27) - Added readonly modifiers
- ✅ `no-else-return` (26) - Removed unnecessary else blocks

### Remaining Issues to Fix:

#### Phase 1 - Quick Wins (In Progress)
- [ ] **eqeqeq (135 issues)** - Change `==` to `===` and `!=` to `!==`
- [ ] **no-console (28 issues)** - Remove or convert console.logs

#### Phase 2 - Manual Review Required
- [ ] **@typescript-eslint/no-unused-vars (309 issues)** - Review and remove/prefix with _
- [ ] **@typescript-eslint/no-unnecessary-condition (62 issues)** - Review logic
- [ ] **no-useless-escape (36 issues)** - Remove unnecessary escape characters

#### Phase 3 - Important Fixes
- [ ] **@typescript-eslint/no-floating-promises (15 issues)** - Add await or void
- [ ] **@typescript-eslint/naming-convention (22 issues)** - Fix naming or adjust config

#### Phase 4 - Config/Minor Issues
- [ ] **Parsing errors (2)** - Add to ESLint ignores or tsconfig
- [ ] **@typescript-eslint/method-signature-style (10)** - Style preference
- [ ] **no-undef (7)** - Fix undefined variables in JS files
- [ ] **Other minor issues** - Small fixes

## Progress Log

### 2025-01-25 - Initial Setup
- Copied ESLint config from ../fe
- Installed dependencies
- Added lint scripts to package.json
- Ran auto-fix (fixed 567 issues automatically)
- Created this plan

### Next Steps
1. Fix all eqeqeq issues (135)
2. Fix all no-console issues (28)
3. Re-assess remaining issues
4. Consider config adjustments for overly strict rules
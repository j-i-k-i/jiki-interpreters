# Educational Features

JikiScript is designed specifically for educational environments, with features that help students learn programming concepts effectively.

## Progressive Language Learning

### Configurable Syntax

Students don't need to learn all programming concepts at once:

```typescript
// Example: Start with basic variables and expressions
const basicFeatures: LanguageFeatures = {
  includeList: ["IDENTIFIER", "NUMBER", "STRING", "EQUAL", "PLUS"],
  excludeList: ["FUNCTION", "CLASS", "LOOP"],
  // ... other settings
};

// Later: Enable loops when students are ready
const intermediateFeatures: LanguageFeatures = {
  includeList: ["IDENTIFIER", "NUMBER", "STRING", "EQUAL", "PLUS", "REPEAT"],
  // ... other settings
};
```

### Learning Progression

1. **Variables & Basic Operations**: Assignment, arithmetic, simple expressions
2. **Control Flow**: Conditionals, basic loops
3. **Functions**: Function calls, then function definitions
4. **Advanced Features**: Classes, complex data structures, advanced loops

## Visual Learning Tools

### Frame-by-Frame Execution

Every line of code execution becomes a visual frame:

- **Timeline Scrubbing**: Students can "rewind" and "fast-forward" through execution
- **Step-by-Step Analysis**: See exactly what happens at each moment
- **Variable Evolution**: Watch how variable values change over time
- **Execution Flow**: Visualize how control flows through conditionals and loops

### Execution Descriptions

Plain-language explanations of what code does:

```javascript
let x = 5 + 3;
// Frame description: "Calculate 5 + 3 (which equals 8) and store the result in variable x"

if (x > 7) {
  console.log("big");
}
// Frame descriptions:
// "Check if x (8) is greater than 7"
// "Since 8 > 7 is true, execute the code inside the if statement"
// "Display 'big' to the console"
```

## Error Handling & Debugging Support

### Student-Friendly Error Messages

Technical errors are translated into learning opportunities:

```javascript
// Technical: "ReferenceError: foo is not defined"
// Educational: "The variable 'foo' hasn't been created yet. Did you mean to write 'let foo = ...' first?"

// Technical: "SyntaxError: Unexpected token '}'"
// Educational: "There's an extra closing brace '}' here. Make sure every opening brace '{' has a matching closing brace."
```

### Error Prevention

- **Typo Detection**: Suggest corrections for common mistakes
- **Scope Guidance**: Help students understand variable visibility
- **Syntax Hints**: Guide students toward correct syntax patterns

### Debugging Tools

- **Variable Inspector**: See all variables and their values at any point
- **Execution Trace**: Step through code line by line
- **State Snapshots**: Compare variable states between different execution points

## Safety & Constraints

### Execution Limits

Protect students from infinite loops and resource exhaustion:

- **Loop Iteration Limits**: Prevent runaway loops
- **Execution Time Limits**: Ensure code completes in reasonable time
- **Memory Limits**: Control resource usage

### Controlled Environment

- **Safe Standard Library**: Educational functions without system access
- **Predictable Behavior**: Consistent results for learning examples
- **Isolated Execution**: Student code can't affect the host system

## Assessment & Analytics

### Execution Analytics

Track student progress and understanding:

- **Execution Patterns**: How students approach problems
- **Common Errors**: Identify learning difficulties
- **Debugging Behavior**: How students investigate and fix issues
- **Feature Usage**: Which language features students struggle with

### Educational Feedback

Support for automated and human feedback:

- **Code Quality Metrics**: Readability, efficiency, style
- **Learning Objective Tracking**: Did the code demonstrate required concepts?
- **Peer Comparison**: Anonymous comparison with other student solutions

## UI Integration

### Jiki Interface

The interpreter feeds standardized data to Jiki's educational UI:

```typescript
interface Frame {
  location: Location; // Where in code we are
  variables: VariableState[]; // All variable values
  description: string; // What this step does
  result?: any; // Result of this operation
  timestamp: number; // For timeline positioning
}
```

### Interactive Features

- **Breakpoints**: Students can pause execution at specific lines
- **Variable Watches**: Monitor specific variables throughout execution
- **Step Controls**: Step into/over/out of function calls
- **Speed Controls**: Adjust execution speed for learning pace

## Multi-Language Support

### Consistent Experience

When JavaScript and Python interpreters are added:

- **Same Frame Format**: Identical UI experience across languages
- **Consistent Descriptions**: Similar educational explanations
- **Progressive Features**: Same learning progression model
- **Shared Analytics**: Compare student progress across languages

### Language-Specific Adaptations

- **Syntax Differences**: Respect each language's conventions
- **Cultural Context**: Error messages and descriptions adapt to language
- **Learning Pathways**: Different concept introduction orders per language

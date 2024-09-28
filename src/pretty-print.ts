import { Expr } from "./parse";

export const prettyPrint = (ast: Expr): string => {
  if (ast.kind === 'var') {
    return ast.data;
  }

  if (ast.kind === 'abs') {
    return `\\${ast.param}.${prettyPrint(ast.body)}`;
  }

  if (ast.kind === 'app') {
    return `(${prettyPrint(ast.lhs)}) ${prettyPrint(ast.rhs)}`;
  }

  throw new Error(`Unexpected AST error`);
}

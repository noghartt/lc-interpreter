import { Expr, ExprKind } from "./parse";

export const substitute = (expr: Expr, param: string, term: Expr): Expr => {
  if (expr.kind === ExprKind.VAR) {
    return expr.data === param ? term : expr;
  }

  if (expr.kind === ExprKind.ABS) {
    if (expr.param === param) {
      return expr;
    }

    // TODO: Handle substitution and alpha-conversion here...
    throw new Error(`Substitution not implemented yet`);
  }

  if (expr.kind === ExprKind.APP) {
    const lhs = substitute(expr.lhs, param, term);
    const rhs = substitute(expr.rhs, param, term);
    return { kind: ExprKind.APP, lhs, rhs };
  }

  throw new Error(`Unexpected AST error`);
}

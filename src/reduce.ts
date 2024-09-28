import { Expr, ExprKind } from "./parse";
import { substitute } from "./substitute";

export const reduce = (expr: Expr): Expr => {
  if (expr.kind === ExprKind.VAR) {
    return expr;
  }

  if (expr.kind === ExprKind.ABS) {
    return expr;
  }

  if (expr.kind === ExprKind.APP) {
    const lhs = reduce(expr.lhs);
    const rhs = reduce(expr.rhs);

    if (lhs.kind === ExprKind.ABS) {
      return substitute(lhs.body, lhs.param, rhs);
    }

    if (lhs.kind === ExprKind.VAR) {
      return rhs;
    }

    throw new Error(`Unexpected AST error`);
  }

  throw new Error(`Unexpected AST error`);
}

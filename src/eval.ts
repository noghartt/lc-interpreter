import { Expr } from "./parse";
import { tokenize } from './token';
import { parse } from './parse';
import { prettyPrint } from "./pretty-print";

const evalExpr = (expr: Expr, ctx: Record<string, string> = {}) => {
  if (expr.kind === 'var') {
    return ctx[expr.data];
  }

  if (expr.kind === 'abs') {
    const alreadyInCtx = ctx[expr.head];
    if (alreadyInCtx) {
      const suffix = Object.keys(ctx).filter(k => k.startsWith(expr.head)).length;
      const newHead = `${expr.head}_${suffix}`;
      expr.head = newHead;
    }
  }
  
  if (expr.kind === 'app') {
    const lhs = evalExpr(expr.lhs, ctx);
    const rhs = evalExpr(expr.rhs, {});
    return lhs(rhs);
  }
}

export const _eval = (input: string) => {
  try {
    const tokens = tokenize(input);
    const ast = parse(tokens);
  
    if (!ast) {
      throw new Error('Failed to parse');
    }
  
    console.dir({ ast }, { depth: null });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

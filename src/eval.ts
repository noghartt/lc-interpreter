import { Expr, ExprKind } from "./parse";
import { tokenize, TokenKind } from './token';
import { parse } from './parse';
import { prettyPrint } from "./pretty-print";
import { reduce } from "./reduce";

export const _eval = (input: string) => {
  try {
    const tokens = tokenize(input);
    const ast = parse(tokens);
  
    if (!ast) {
      throw new Error('Failed to parse');
    }

    const result = reduce(ast);
    const pp = prettyPrint(result);
    console.log('Result:', pp, result);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

import type { Token } from './token';

type EVar = {
  kind: 'var';
  data: string;
}

type EAbs = {
  kind: 'abs';
  head: string;
  body: Expr;
}

type EApp = {
  kind: 'app';
  lhs: Expr;
  rhs: Expr;
}

export type Expr = EVar | EAbs | EApp | Record<string, never>;

export function parse(tokens: Token[]): Expr | undefined {
  if (tokens.length === 0) {
    return;
  }

  const getNextToken = () => {
    if (i >= tokens.length) {
      return;
    }

    i++;
    return tokens[i];
  }

  const expectToken = (kind: string): Token => {
    const token = getNextToken();
    if (!token || token.kind !== kind) {
      throw new Error(`Expected ${kind}, got ${token?.kind}`);
    }
    return token;
  }

  const parseExpr = (token: Token): Expr | undefined => {
    const s =  parseApp(token) || parseAbs(token) || parseVar(token);
    return s;
  }

  const parseAbs = (token: Token): Expr | undefined => {
    if (token.kind !== 'lambda') {
      return;
    }

    // skip lambda
    getNextToken();

    const head = tokens[i];
    if (!head || head.kind !== 'var') {
      return;
    }

    // skip dot
    getNextToken();

    const bodyToken = getNextToken();
    if (!bodyToken) {
      return;
    }

    if (bodyToken.kind === 'lpar') {
      const nextToken = getNextToken();
      if (!nextToken) {
        return;
      }
      return parseExpr(nextToken);
    }

    const body = parseExpr(bodyToken);
    if (!body) {
      return;
    }
    return { kind: 'abs', head: head.data, body }; 
  }

  const parseApp = (token: Token): Expr | undefined => {
    if (token.kind !== 'lpar') {
      return;
    }

    const lhsT = getNextToken();
    const lhs = parseExpr(lhsT!);
    if (!lhs) {
      return;
    }

    const tt = getNextToken();
    if (tt && tt.kind === 'var') {
      const rhs = parseExpr(tt);
      if (!rhs) {
        return;
      }
      expectToken('rpar');
      return { kind: 'app', lhs, rhs };
    } else {
      if (!tt || tt.kind !== 'rpar') {
        return;
      }
    }
    
    const t = getNextToken();
    if (!t) {
      return lhs;
    }

    const rhs = parseExpr(t);
    if (!rhs) {
      return;
    }

    return { kind: 'app', lhs, rhs };
  }

  const parseVar = (token: Token): Expr | undefined => {
    if (token.kind !== 'var') {
      return;
    }

    return { kind: 'var', data: token.data };
  }

  let ast: Expr | undefined;
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token.kind === 'dot' && i > 0 && tokens[i + 1].kind === 'var') {
      throw new Error('Unexpected dot');
    }
    ast = parseExpr(token);
    i++;
  }

  if (!ast) {
    throw new Error("Wrong syntax: failed to parse");
  }

  return ast;
}


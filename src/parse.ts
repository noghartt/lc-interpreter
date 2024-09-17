import { TId, Token, TokenKind } from './token';

enum ExprKind {
  VAR = 'var',
  ABS = 'abs',
  APP = 'app',
}

type EVar = {
  kind: ExprKind.VAR;
  data: string;
}

type EAbs = {
  kind: ExprKind.ABS;
  param: string;
  body: Expr;
}

type EApp = {
  kind: ExprKind.APP;
  lhs: Expr;
  rhs: Expr;
}

export type Expr = EVar | EAbs | EApp | Record<string, never>;

export function parse(tokens: Token[]): Expr | undefined {
  if (tokens.length === 0) {
    throw new Error('Empty input');
  }

  const getNextToken = (): Token => {
    i++;
    return tokens[i];
  };

  const matchNextToken = (kind: TokenKind): boolean => {
    if (tokens[i + 1]?.kind !== kind) {
      return false;
    }
    i++;
    return true;
  };

  const getNextTokenByKind = (kind: TokenKind): Token => {
    const token = getNextToken();
    if (!token || token.kind !== kind) {
      throw new Error(`Expected ${kind}, got ${token?.kind}`);
    }
    return token;
  }

  const parseTerm = (token: Token): Expr | undefined => {
    const isLambda = token.kind === TokenKind.LAMBDA;
    if (!isLambda) {
      return parseApplication(token);
    }

    const param = getNextTokenByKind(TokenKind.ID);

    matchNextToken(TokenKind.DOT);

    const body = parseTerm(getNextToken());
    if (!body) {
      throw new Error('Expected body');
    }

    return { kind: ExprKind.ABS, param: param.data, body };
  }

  const parseApplication = (token: Token): Expr | undefined => {
    let lhs = parseAtom(token);
    if (!lhs) {
      return;
    }

    while (true) {
      const nextToken = getNextToken();
      if (!nextToken) {
        return lhs;
      }
  
      const rhs = parseAtom(nextToken);
      if (!rhs) {
        return lhs;
      }

      lhs = { kind: ExprKind.APP, lhs, rhs };
    }
  }

  const parseAtom = (token: Token): Expr | undefined => {
    const isLParen = token.kind === TokenKind.LPAREN;
    if (isLParen) {
      const expr = parseTerm(getNextToken());
      matchNextToken(TokenKind.RPAREN);
      return expr;
    }

    const isID = token?.kind === TokenKind.ID;
    if (isID) {
      return { kind: ExprKind.VAR, data: token.data };
    }
  }

  let i = 0;
  let ast: Expr | undefined = parseTerm(tokens[0]);
  if (!ast) {
    throw new Error("Wrong syntax: failed to parse");
  }

  return ast;
}

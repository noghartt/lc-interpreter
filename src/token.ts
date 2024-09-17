export enum TokenKind {
  ID = 'id',
  LPAREN = 'lparen',
  RPAREN = 'rparen',
  DOT = 'dot',
  LAMBDA = 'lambda',
}

export type TId = {
  kind: TokenKind.ID;
  data: string;
}

export type TRParen = {
  kind: TokenKind.RPAREN;
}

export type TLParen = {
  kind: TokenKind.LPAREN;
}

export type TDot = {
  kind: TokenKind.DOT;
}

export type TLambda = {
  kind: TokenKind.LAMBDA;
}

export type Token = TId | TDot | TLambda | TRParen | TLParen;

export function tokenize(input: string): Token[] {
  if (input.length === 0) {
    return [];
  }

  const tokens: Token[] = [];

  let i = 0;
  while (i < input.length) {
    const c = input[i];

    if (isSpace(c)) {
      i++;
      continue;
    }

    if (isAlpha(c)) {
      let j = i + 1;
      while (j < input.length && isAlpha(input[j])) {
        j++;
      }
      tokens.push({ kind: TokenKind.ID, data: input.slice(i, j) });
      i = j;
      continue;
    }

    if (isLambda(c)) {
      tokens.push({ kind: TokenKind.LAMBDA });
      i++;
      continue;
    }

    if (isDot(c)) {
      tokens.push({ kind: TokenKind.DOT });
      i++;
      continue;
    }

    if (isLPar(c)) {
      tokens.push({ kind: TokenKind.LPAREN });
      i++;
      continue;
    }

    if (isRPar(c)) {
      tokens.push({ kind: TokenKind.RPAREN });
      i++;
      continue;
    }

    throw new Error(`Unexpected character '${c}'`);
  }

  return tokens;
}

const isSpace = (c: string) => c === ' ';
const isAlpha = (c: string) => c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z';
const isLambda = (c: string) => c === '\\';
const isDot = (c: string) => c === '.';
const isLPar = (c: string) => c === '(';
const isRPar = (c: string) => c === ')';
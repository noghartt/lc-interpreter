type TVar = {
  kind: 'var';
  data: string;
}

type TExpr = {
  kind: 'expr';
  lhs: Token;
  rhs: Token;
}

type TRPar = {
  kind: 'rpar';
}

type TLPar = {
  kind: 'lpar';
}

type TDot = {
  kind: 'dot';
}

type TLambda = {
  kind: 'lambda';
}

export type Token = TVar | TDot | TLambda | TExpr | TRPar | TLPar;

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
      tokens.push({ kind: 'var', data: input.slice(i, j) });
      i = j;
      continue;
    }

    if (isLambda(c)) {
      tokens.push({ kind: 'lambda' });
      i++;
      continue;
    }

    if (isDot(c)) {
      tokens.push({ kind: 'dot' });
      i++;
      continue;
    }

    if (isLPar(c)) {
      tokens.push({ kind: 'lpar' });
      i++;
      continue;
    }

    if (isRPar(c)) {
      tokens.push({ kind: 'rpar' });
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
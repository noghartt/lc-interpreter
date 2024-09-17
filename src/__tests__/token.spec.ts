import { describe, it } from 'node:test';
import { equal } from 'node:assert';

import { tokenize } from '../token';

describe('tokenize', () => {
  it('should tokenize a single variable', () => {
    const tokens = tokenize('x');
    equal(tokens.length, 1);
    equal(tokens[0].kind, 'id');
    // @ts-ignore
    equal(tokens[0].data, 'x');
  });

  it('should tokenize an abstraction', () => {
    const tokens = tokenize('\\x.x');
    equal(tokens.length, 4);
    const [lambda, var1, dot, var2] = tokens;
    equal(lambda.kind, 'lambda');
    equal(var1.kind, 'id');
    // @ts-ignore
    equal(var1.data, 'x');
    equal(dot.kind, 'dot');
    equal(var2.kind, 'id');
    // @ts-ignore
    equal(var2.data, 'x');
  });

  it('should tokenize an abstraction with a large argument', () => {
    const tokens = tokenize('\\xy.xy');
    equal(tokens.length, 4);
    const [lambda, var1, dot, var2] = tokens;
    equal(lambda.kind, 'lambda');
    equal(var1.kind, 'id');
    // @ts-ignore
    equal(var1.data, 'xy');
    equal(dot.kind, 'dot');
    equal(var2.kind, 'id');
    // @ts-ignore
    equal(var2.data, 'xy');
  });

  it('should tokenize a lambda application', () => {
    const tokens = tokenize('(\\x.x) y');
    equal(tokens.length, 7);
    const [lpar, lambda, var1, dot, var2, rpar] = tokens;
    equal(lpar.kind, 'lparen');
    equal(lambda.kind, 'lambda');
    equal(var1.kind, 'id');
    // @ts-ignore
    equal(var1.data, 'x');
    equal(dot.kind, 'dot');
    equal(var2.kind, 'id');
    // @ts-ignore
    equal(var2.data, 'x');
    equal(rpar.kind, 'rparen');
  });
});


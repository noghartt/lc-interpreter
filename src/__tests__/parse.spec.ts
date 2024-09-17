import { it } from 'node:test';
import { equal } from 'node:assert';

import { parse } from '../parse';
import { tokenize } from '../token';

it('should parse an application', () => {
  const tokens = tokenize('(\\x.x) y');
  const ast = parse(tokens);

  equal(ast?.kind, 'app');
  equal(ast?.lhs?.kind, 'abs');
  equal(ast?.lhs?.param, 'x');
  equal(ast?.lhs?.body?.kind, 'var');
  equal(ast?.lhs?.body?.data, 'x');
  equal(ast?.rhs?.kind, 'var');
  equal(ast?.rhs?.data, 'y');
});

it('should parse a single variable', () => {
  const tokens = tokenize('x');
  const ast = parse(tokens);

  equal(ast?.kind, 'var');
  equal(ast?.data, 'x');
});

it('should parse a single abstraction', () => {
  const tokens = tokenize('\\x.x');
  const ast = parse(tokens);
  equal(ast?.kind, 'abs');
  equal(ast?.param, 'x');
  equal(ast?.body?.kind, 'var');
  equal(ast?.body?.data, 'x');
});
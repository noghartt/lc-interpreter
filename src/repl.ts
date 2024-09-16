import readline from 'node:readline';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'path';

import { _eval } from "./eval"; 

function repl() {
  console.log('[REPL] Welcome to the lambda calculus REPL!');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.prompt();

  rl.on('SIGINT', () => {
    console.log('[REPL] Bye!');
    process.exit(0);
  });

  rl.on('close', () => {
    console.log('[REPL] Bye!');
    process.exit(0);
  });

  rl.on('line', (line) => {
    console.log(`${line}`);
    try {
      _eval(line);
    } catch (e) {
      console.log("\x1b[31m", "[ERROR]", "\x1b[0m", e.message);
    }
    rl.prompt();
  });
}

repl();

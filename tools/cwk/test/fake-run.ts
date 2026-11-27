import type { Run, RunResult } from '../src/gh.ts';

// Ersetzt gh und git in den Tests von `cwk new`, `cwk secrets` und `cwk sync`: zeichnet jeden Aufruf auf und antwortet
// nach Regeln „Anfang der Befehlszeile → Antwort“. Ohne passende Regel ist der Aufruf erfolgreich und leer.

interface Call {
  line: string;
  input?: string;
  cwd?: string;
  env?: Record<string, string>;
}

type Reply = Partial<RunResult> | ((call: Call) => Partial<RunResult>);

export function fakeRun(rules: (readonly [prefix: string, reply: Reply])[] = []) {
  const calls: Call[] = [];
  const run: Run = (cmd, args, options = {}) => {
    const call: Call = { line: [cmd, ...args].join(' '), ...options };
    calls.push(call);
    const rule = rules.find(([prefix]) => call.line.startsWith(prefix));
    const reply = typeof rule?.[1] === 'function' ? rule[1](call) : (rule?.[1] ?? {});
    return { status: 0, stdout: '', stderr: '', ...reply };
  };
  const lines = () => calls.map((call) => call.line);
  return { run, calls, lines };
}

export const notFound: Partial<RunResult> = { status: 1, stderr: 'gh: Not Found (HTTP 404)' };

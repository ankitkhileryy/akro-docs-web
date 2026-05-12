import { tokenize, Parser } from './parser'
import {
  AkroValue, AkroMap, AkroFunction, ASTNode,
  Environment, ReturnSignal, BreakSignal, ContinueSignal, ThrowSignal,
  OutputLine
} from './types'

export type { OutputLine }

class Interpreter {
  private output: OutputLine[] = []
  private steps = 0
  private readonly MAX = 50000

  private makeNative(fn: (args: AkroValue[], env: Environment) => AkroValue): AkroFunction {
    return { __type: 'function', params: [], body: [], closure: new Environment(), __native: fn }
  }
  private isAkroFn(v: AkroValue): v is AkroFunction {
    return typeof v === 'object' && v !== null && !Array.isArray(v) && (v as AkroFunction).__type === 'function'
  }
  private typeOf(v: AkroValue): string {
    if (v === null) return 'nil'
    if (typeof v === 'boolean') return 'bool'
    if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float'
    if (typeof v === 'string') return 'string'
    if (Array.isArray(v)) return 'array'
    if (this.isAkroFn(v)) return 'function'
    return 'map'
  }
  private isTruthy(v: AkroValue): boolean {
    if (v === null || v === false || v === 0 || v === '') return false
    if (Array.isArray(v) && v.length === 0) return false
    return true
  }
  private stringify(v: AkroValue): string {
    if (v === null) return 'nil'
    if (typeof v === 'boolean') return v ? 'true' : 'false'
    if (typeof v === 'number') return String(v)
    if (typeof v === 'string') return v
    if (Array.isArray(v)) return '[' + v.map(x => this.stringify(x)).join(', ') + ']'
    if (this.isAkroFn(v)) return '<function>'
    return '{' + Object.entries(v as AkroMap).map(([k, val]) => `${k}: ${this.stringify(val)}`).join(', ') + '}'
  }
  private emit(text: string): void { this.output.push({ text, type: 'output' }) }

  private interpolate(tmpl: string, env: Environment): string {
    return tmpl.replace(/\{([^}]+)\}/g, (_, expr) => {
      try {
        const ast = new Parser(tokenize(expr.trim())).parse()
        if (!ast.length) return ''
        return this.stringify(this.evalNode(ast[0], env) as AkroValue)
      } catch { return `{${expr}}` }
    })
  }

  private globalEnv(): Environment {
    const env = new Environment()
    const def = (name: string, fn: (args: AkroValue[], env: Environment) => AkroValue) =>
      env.define(name, this.makeNative(fn), false)

    def('say', a => { this.emit(this.stringify(a[0] ?? null)); return null })
    def('print', a => { this.emit(this.stringify(a[0] ?? null)); return null })
    def('int', a => {
      const v = a[0]
      if (typeof v === 'number') return Math.trunc(v)
      if (typeof v === 'string') { const n = parseInt(v); if (!isNaN(n)) return n }
      if (typeof v === 'boolean') return v ? 1 : 0
      return 0
    })
    def('float', a => {
      const v = a[0]
      if (typeof v === 'number') return v
      if (typeof v === 'string') { const n = parseFloat(v); if (!isNaN(n)) return n }
      return 0
    })
    def('str', a => this.stringify(a[0] ?? null))
    def('bool', a => this.isTruthy(a[0] ?? null))
    def('type', a => this.typeOf(a[0] ?? null))
    def('len', a => {
      const v = a[0]
      if (typeof v === 'string') return v.length
      if (Array.isArray(v)) return v.length
      if (v && typeof v === 'object' && !this.isAkroFn(v)) return Object.keys(v as AkroMap).length
      return 0
    })
    def('range', a => {
      if (a.length === 1) return Array.from({ length: a[0] as number }, (_, i) => i)
      return Array.from({ length: (a[1] as number) - (a[0] as number) }, (_, i) => i + (a[0] as number))
    })
    def('append', a => [...(a[0] as AkroValue[]), a[1]])
    def('push', a => [...(a[0] as AkroValue[]), a[1]])
    def('pop', a => (a[0] as AkroValue[]).slice(0, -1))
    def('sort', a => [...(a[0] as AkroValue[])].sort((x, y) => {
      if (typeof x === 'number' && typeof y === 'number') return x - y
      return String(x).localeCompare(String(y))
    }))
    def('reverse', a => [...(a[0] as AkroValue[])].reverse())
    def('sum', a => (a[0] as number[]).reduce((x, y) => (x as number) + (y as number), 0))
    def('min', a => Array.isArray(a[0]) ? Math.min(...(a[0] as number[])) : Math.min(...(a as number[])))
    def('max', a => Array.isArray(a[0]) ? Math.max(...(a[0] as number[])) : Math.max(...(a as number[])))
    def('map', (a, env) => {
      const arr = a[0] as AkroValue[], fn = a[1] as AkroFunction
      return arr.map(item => this.callFn(fn, [item], env))
    })
    def('filter', (a, env) => {
      const arr = a[0] as AkroValue[], fn = a[1] as AkroFunction
      return arr.filter(item => this.isTruthy(this.callFn(fn, [item], env)))
    })
    def('reduce', (a, env) => {
      const arr = a[0] as AkroValue[], fn = a[1] as AkroFunction
      let acc = a[2] ?? null
      for (const item of arr) acc = this.callFn(fn, [acc, item], env)
      return acc
    })
    def('contains', a => {
      const [col, item] = a
      if (Array.isArray(col)) return col.some(x => x === item)
      if (typeof col === 'string') return col.includes(String(item))
      return false
    })
    def('abs', a => Math.abs(a[0] as number))
    def('sqrt', a => Math.sqrt(a[0] as number))
    def('pow', a => Math.pow(a[0] as number, a[1] as number))
    def('floor', a => Math.floor(a[0] as number))
    def('ceil', a => Math.ceil(a[0] as number))
    def('round', a => Math.round(a[0] as number))
    def('sin', a => Math.sin(a[0] as number))
    def('cos', a => Math.cos(a[0] as number))
    def('tan', a => Math.tan(a[0] as number))
    def('log', a => Math.log(a[0] as number))
    def('rand', a => {
      if (!a.length) return Math.random()
      return Math.floor(Math.random() * ((a[1] as number) - (a[0] as number) + 1)) + (a[0] as number)
    })
    def('upper', a => String(a[0]).toUpperCase())
    def('lower', a => String(a[0]).toLowerCase())
    def('trim', a => String(a[0]).trim())
    def('split', a => String(a[0]).split(String(a[1] ?? '')))
    def('join', a => (a[0] as string[]).join(String(a[1] ?? '')))
    def('replace', a => String(a[0]).replaceAll(String(a[1]), String(a[2])))
    def('starts_with', a => String(a[0]).startsWith(String(a[1])))
    def('ends_with', a => String(a[0]).endsWith(String(a[1])))
    def('repeat', a => String(a[0]).repeat(a[1] as number))
    def('input', a => window.prompt(String(a[0] ?? '')) ?? '')
    env.define('PI', Math.PI, false)
    env.define('E', Math.E, false)
    return env
  }

  private getMember(obj: AkroValue, prop: string): AkroValue {
    if (typeof obj === 'string') {
      const m: Record<string, AkroValue> = {
        length: obj.length,
        upper: this.makeNative(() => obj.toUpperCase()),
        lower: this.makeNative(() => obj.toLowerCase()),
        trim: this.makeNative(() => obj.trim()),
        split: this.makeNative(a => obj.split(String(a[0] ?? ''))),
        replace: this.makeNative(a => obj.replaceAll(String(a[0]), String(a[1]))),
        contains: this.makeNative(a => obj.includes(String(a[0]))),
        starts_with: this.makeNative(a => obj.startsWith(String(a[0]))),
        ends_with: this.makeNative(a => obj.endsWith(String(a[0]))),
        reverse: this.makeNative(() => obj.split('').reverse().join('')),
        repeat: this.makeNative(a => obj.repeat(a[0] as number)),
      }
      return m[prop] ?? null
    }
    if (Array.isArray(obj)) {
      const m: Record<string, AkroValue> = {
        length: obj.length, len: obj.length,
        push: this.makeNative(a => { obj.push(a[0]); return null }),
        pop: this.makeNative(() => obj.pop() ?? null),
        shift: this.makeNative(() => obj.shift() ?? null),
        reverse: this.makeNative(() => { obj.reverse(); return null }),
        sort: this.makeNative(() => { obj.sort(); return null }),
        join: this.makeNative(a => obj.map(x => this.stringify(x)).join(String(a[0] ?? ','))),
        contains: this.makeNative(a => obj.includes(a[0])),
        clear: this.makeNative(() => { obj.length = 0; return null }),
        slice: this.makeNative(a => obj.slice(a[0] as number, a[1] as number)),
      }
      return m[prop] ?? null
    }
    if (obj && typeof obj === 'object' && !this.isAkroFn(obj)) {
      const map = obj as AkroMap
      if (prop === 'keys') return this.makeNative(() => Object.keys(map))
      if (prop === 'values') return this.makeNative(() => Object.values(map))
      if (prop === 'remove') return this.makeNative(a => { delete map[String(a[0])]; return null })
      if (prop === 'has') return this.makeNative(a => String(a[0]) in map)
      return map[prop] ?? null
    }
    return null
  }

  callFn(fn: AkroFunction, args: AkroValue[], _env: Environment): AkroValue {
    if (fn.__native) return fn.__native(args, fn.closure)
    const fnEnv = fn.closure.child()
    fn.params.forEach((p, i) => fnEnv.define(p, args[i] ?? null, true))
    const r = this.execBlock(fn.body, fnEnv)
    if (r instanceof ReturnSignal) return r.value
    return r as AkroValue
  }

  private execBlock(stmts: ASTNode[], env: Environment): AkroValue | ReturnSignal | BreakSignal | ContinueSignal {
    let last: AkroValue | ReturnSignal | BreakSignal | ContinueSignal = null
    for (const s of stmts) {
      last = this.evalNode(s, env)
      if (last instanceof ReturnSignal || last instanceof BreakSignal || last instanceof ContinueSignal) return last
    }
    return last
  }

  private matchPat(val: AkroValue, pat: ASTNode, env: Environment): boolean {
    if (pat.type === 'BinOp' && pat.op === '..') {
      const lo = this.evalNode(pat.left, env) as number, hi = this.evalNode(pat.right, env) as number
      return typeof val === 'number' && val >= lo && val < hi
    }
    if (pat.type === 'BinOp' && pat.op === '..=') {
      const lo = this.evalNode(pat.left, env) as number, hi = this.evalNode(pat.right, env) as number
      return typeof val === 'number' && val >= lo && val <= hi
    }
    return val === (this.evalNode(pat, env) as AkroValue)
  }

  private evalBin(op: string, ln: ASTNode, rn: ASTNode, env: Environment): AkroValue {
    if (op === 'and') { const l = this.evalNode(ln, env) as AkroValue; if (!this.isTruthy(l)) return false; return this.isTruthy(this.evalNode(rn, env) as AkroValue) }
    if (op === 'or') { const l = this.evalNode(ln, env) as AkroValue; if (this.isTruthy(l)) return true; return this.isTruthy(this.evalNode(rn, env) as AkroValue) }
    const l = this.evalNode(ln, env) as AkroValue, r = this.evalNode(rn, env) as AkroValue
    switch (op) {
      case '+': if (typeof l === 'string' || typeof r === 'string') return this.stringify(l) + this.stringify(r)
                if (Array.isArray(l) && Array.isArray(r)) return [...l, ...r]
                return (l as number) + (r as number)
      case '-': return (l as number) - (r as number)
      case '*': if (typeof l === 'string' && typeof r === 'number') return l.repeat(r); return (l as number) * (r as number)
      case '/': if ((r as number) === 0) throw new Error('Division by zero'); return (l as number) / (r as number)
      case '%': return (l as number) % (r as number)
      case '**': return Math.pow(l as number, r as number)
      case '==': return l === r
      case '!=': return l !== r
      case '<': return (l as number) < (r as number)
      case '>': return (l as number) > (r as number)
      case '<=': return (l as number) <= (r as number)
      case '>=': return (l as number) >= (r as number)
      default: return null
    }
  }

  evalNode(node: ASTNode, env: Environment): AkroValue | ReturnSignal | BreakSignal | ContinueSignal {
    if (++this.steps > this.MAX) throw new Error('Execution limit reached (infinite loop?)')
    switch (node.type) {
      case 'NilLit': return null
      case 'BoolLit': return node.value
      case 'NumberLit': return node.value
      case 'StringLit': return this.interpolate(node.value, env)
      case 'Identifier': try { return env.get(node.name) } catch { return null }
      case 'ArrayLit': return node.elements.map(e => this.evalNode(e, env) as AkroValue)
      case 'MapLit': { const m: AkroMap = {}; for (const { key, value } of node.pairs) m[key] = this.evalNode(value, env) as AkroValue; return m }
      case 'FnExpr': return { __type: 'function', params: node.params, body: node.body, closure: env, isAsync: node.isAsync }
      case 'FnDecl': env.define(node.name, { __type: 'function', params: node.params, body: node.body, closure: env, isAsync: node.isAsync }, false); return null
      case 'VarDecl': env.define(node.name, this.evalNode(node.value, env) as AkroValue, node.mutable); return null
      case 'Assign': { const v = this.evalNode(node.value, env) as AkroValue; try { env.set(node.name, v) } catch { env.define(node.name, v, true) }; return null }
      case 'IndexAssign': {
        const obj = this.evalNode(node.object, env) as AkroValue
        const idx = this.evalNode(node.index, env) as AkroValue
        const val = this.evalNode(node.value, env) as AkroValue
        if (Array.isArray(obj)) { let i = idx as number; if (i < 0) i = obj.length + i; obj[i] = val }
        else if (obj && typeof obj === 'object' && !this.isAkroFn(obj)) (obj as AkroMap)[String(idx)] = val
        return null
      }
      case 'Say': this.emit(this.stringify(this.evalNode(node.value, env) as AkroValue)); return null
      case 'Return': return new ReturnSignal(node.value ? this.evalNode(node.value, env) as AkroValue : null)
      case 'Break': return new BreakSignal()
      case 'Continue': return new ContinueSignal()
      case 'Throw': throw new ThrowSignal(this.evalNode(node.value, env) as AkroValue)
      case 'TryCatch': {
        try { const r = this.execBlock(node.try_, env); if (r instanceof ReturnSignal) return r }
        catch (e) {
          const ce = env.child()
          ce.define(node.catchVar, e instanceof ThrowSignal ? e.value : String((e as Error).message ?? e), false)
          const r = this.execBlock(node.catch_, ce); if (r instanceof ReturnSignal) return r
        } finally { if (node.finally_) this.execBlock(node.finally_, env) }
        return null
      }
      case 'If': {
        if (this.isTruthy(this.evalNode(node.cond, env) as AkroValue)) return this.execBlock(node.then, env.child())
        for (const el of node.elifs) if (this.isTruthy(this.evalNode(el.cond, env) as AkroValue)) return this.execBlock(el.body, env.child())
        if (node.else_) return this.execBlock(node.else_, env.child())
        return null
      }
      case 'ForRange': {
        const s = this.evalNode(node.start, env) as number, e = this.evalNode(node.end, env) as number
        for (let i = s; node.inclusive ? i <= e : i < e; i++) {
          const le = env.child(); le.define(node.var, i, true)
          const r = this.execBlock(node.body, le)
          if (r instanceof BreakSignal) break
          if (r instanceof ReturnSignal) return r
        }
        return null
      }
      case 'ForIn': {
        const iter = this.evalNode(node.iter, env) as AkroValue
        let items: AkroValue[] = []
        if (Array.isArray(iter)) items = iter
        else if (typeof iter === 'string') items = iter.split('')
        else if (iter && typeof iter === 'object' && !this.isAkroFn(iter))
          items = Object.entries(iter as AkroMap).map(([k, v]) => [k, v] as AkroValue)
        for (let idx = 0; idx < items.length; idx++) {
          const le = env.child(); const item = items[idx]
          if (node.indexVar) { le.define(node.indexVar, idx, false); le.define(node.var, item, false) }
          else le.define(node.var, item, false)
          const r = this.execBlock(node.body, le)
          if (r instanceof BreakSignal) break
          if (r instanceof ReturnSignal) return r
        }
        return null
      }
      case 'While': {
        let iters = 0
        while (this.isTruthy(this.evalNode(node.cond, env) as AkroValue)) {
          if (++iters > 10000) throw new Error('While loop limit reached')
          const r = this.execBlock(node.body, env.child())
          if (r instanceof BreakSignal) break
          if (r instanceof ReturnSignal) return r
        }
        return null
      }
      case 'Loop': {
        let iters = 0
        while (true) {
          if (++iters > 10000) throw new Error('Loop limit reached')
          const r = this.execBlock(node.body, env.child())
          if (r instanceof BreakSignal) break
          if (r instanceof ReturnSignal) return r
        }
        return null
      }
      case 'Match': {
        const val = this.evalNode(node.value, env) as AkroValue
        for (const c of node.cases) {
          if (c.pattern === null) { if (c.guard && !this.isTruthy(this.evalNode(c.guard, env) as AkroValue)) continue; return this.execBlock(c.body, env.child()) }
          if (this.matchPat(val, c.pattern, env)) { if (c.guard && !this.isTruthy(this.evalNode(c.guard, env) as AkroValue)) continue; return this.execBlock(c.body, env.child()) }
        }
        return null
      }
      case 'BinOp': return this.evalBin(node.op, node.left, node.right, env)
      case 'UnaryOp': { const v = this.evalNode(node.operand, env) as AkroValue; if (node.op === '-') return -(v as number); if (node.op === 'not') return !this.isTruthy(v); return null }
      case 'Call': {
        if (node.callee.type === 'MemberAccess') {
          const obj = this.evalNode(node.callee.object, env) as AkroValue
          const method = this.getMember(obj, node.callee.property)
          const args = node.args.map(a => this.evalNode(a, env) as AkroValue)
          if (this.isAkroFn(method)) return this.callFn(method, args, env)
          throw new Error(`${node.callee.property} is not a function`)
        }
        const callee = this.evalNode(node.callee, env) as AkroValue
        const args = node.args.map(a => this.evalNode(a, env) as AkroValue)
        if (!this.isAkroFn(callee)) throw new Error(`${node.callee.type === 'Identifier' ? node.callee.name : '?'} is not a function`)
        return this.callFn(callee, args, env)
      }
      case 'MemberAccess': return this.getMember(this.evalNode(node.object, env) as AkroValue, node.property)
      case 'Index': {
        const obj = this.evalNode(node.object, env) as AkroValue
        const idx = this.evalNode(node.index, env) as AkroValue
        if (Array.isArray(obj)) { let i = idx as number; if (i < 0) i = obj.length + i; return obj[i] ?? null }
        if (typeof obj === 'string') { let i = idx as number; if (i < 0) i = obj.length + i; return obj[i] ?? null }
        if (obj && typeof obj === 'object') return (obj as AkroMap)[String(idx)] ?? null
        return null
      }
      default: return null
    }
  }

  run(source: string): OutputLine[] {
    this.output = []; this.steps = 0
    try {
      const ast = new Parser(tokenize(source)).parse()
      const env = this.globalEnv()
      for (const node of ast) if (node.type === 'FnDecl') env.define(node.name, { __type: 'function', params: node.params, body: node.body, closure: env, isAsync: node.isAsync }, false)
      for (const node of ast) { const r = this.evalNode(node, env); if (r instanceof ReturnSignal) break }
      if (env.has('main')) { const m = env.get('main'); if (this.isAkroFn(m)) this.callFn(m, [], env) }
    } catch (e) {
      if (e instanceof ThrowSignal) this.output.push({ text: `Uncaught: ${this.stringify(e.value)}`, type: 'error' })
      else this.output.push({ text: String((e as Error).message ?? e), type: 'error' })
    }
    return this.output
  }
}

export function runAkro(source: string): OutputLine[] {
  return new Interpreter().run(source)
}

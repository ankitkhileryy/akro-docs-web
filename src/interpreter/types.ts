export type AkroValue = string | number | boolean | null | AkroValue[] | AkroMap | AkroFunction

export interface AkroMap { [key: string]: AkroValue }

export interface AkroFunction {
  __type: 'function'
  params: string[]
  body: ASTNode[]
  closure: Environment
  isAsync?: boolean
  __native?: (args: AkroValue[], env: Environment) => AkroValue
}

export type ASTNode =
  | { type: 'FnDecl'; name: string; params: string[]; body: ASTNode[]; isAsync: boolean }
  | { type: 'VarDecl'; name: string; value: ASTNode; mutable: boolean; isConst: boolean }
  | { type: 'Assign'; name: string; value: ASTNode }
  | { type: 'IndexAssign'; object: ASTNode; index: ASTNode; value: ASTNode }
  | { type: 'Say'; value: ASTNode }
  | { type: 'Return'; value: ASTNode | null }
  | { type: 'If'; cond: ASTNode; then: ASTNode[]; elifs: { cond: ASTNode; body: ASTNode[] }[]; else_: ASTNode[] | null }
  | { type: 'ForRange'; var: string; start: ASTNode; end: ASTNode; inclusive: boolean; body: ASTNode[] }
  | { type: 'ForIn'; var: string; indexVar: string | null; iter: ASTNode; body: ASTNode[] }
  | { type: 'While'; cond: ASTNode; body: ASTNode[] }
  | { type: 'Loop'; body: ASTNode[] }
  | { type: 'Break' }
  | { type: 'Continue' }
  | { type: 'Throw'; value: ASTNode }
  | { type: 'TryCatch'; try_: ASTNode[]; catchVar: string; catch_: ASTNode[]; finally_: ASTNode[] | null }
  | { type: 'Match'; value: ASTNode; cases: { pattern: ASTNode | null; guard: ASTNode | null; body: ASTNode[] }[] }
  | { type: 'BinOp'; op: string; left: ASTNode; right: ASTNode }
  | { type: 'UnaryOp'; op: string; operand: ASTNode }
  | { type: 'Call'; callee: ASTNode; args: ASTNode[] }
  | { type: 'MemberAccess'; object: ASTNode; property: string }
  | { type: 'Index'; object: ASTNode; index: ASTNode }
  | { type: 'Identifier'; name: string }
  | { type: 'NumberLit'; value: number }
  | { type: 'StringLit'; value: string }
  | { type: 'BoolLit'; value: boolean }
  | { type: 'NilLit' }
  | { type: 'ArrayLit'; elements: ASTNode[] }
  | { type: 'MapLit'; pairs: { key: string; value: ASTNode }[] }
  | { type: 'FnExpr'; params: string[]; body: ASTNode[]; isAsync: boolean }

export class Environment {
  private vars = new Map<string, { value: AkroValue; mutable: boolean }>()
  constructor(private parent: Environment | null = null) {}
  get(name: string): AkroValue {
    if (this.vars.has(name)) return this.vars.get(name)!.value
    if (this.parent) return this.parent.get(name)
    throw new Error(`Undefined variable: ${name}`)
  }
  set(name: string, value: AkroValue): void {
    if (this.vars.has(name)) {
      const e = this.vars.get(name)!
      if (!e.mutable) throw new Error(`Cannot reassign immutable variable: ${name}`)
      e.value = value; return
    }
    if (this.parent && this.parent.has(name)) { this.parent.set(name, value); return }
    throw new Error(`Undefined variable: ${name}`)
  }
  has(name: string): boolean { return this.vars.has(name) || (this.parent?.has(name) ?? false) }
  define(name: string, value: AkroValue, mutable = true): void { this.vars.set(name, { value, mutable }) }
  child(): Environment { return new Environment(this) }
}

export class ReturnSignal { constructor(public value: AkroValue) {} }
export class BreakSignal {}
export class ContinueSignal {}
export class ThrowSignal { constructor(public value: AkroValue) {} }

export interface OutputLine {
  text: string
  type: 'output' | 'error' | 'info'
}

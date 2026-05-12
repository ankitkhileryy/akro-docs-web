// ============================================================
// Akro Language Interpreter — Browser JS Implementation
// ============================================================

export interface OutputLine {
  text: string
  type: 'output' | 'error' | 'info'
}

type AkroValue = string | number | boolean | null | AkroValue[] | AkroMap | AkroFunction

interface AkroMap { [key: string]: AkroValue }

interface AkroFunction {
  __type: 'function'
  params: string[]
  body: ASTNode[]
  closure: Environment
  isAsync?: boolean
  __native?: (args: AkroValue[], env: Environment) => AkroValue
}

type ASTNode =
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

class ReturnSignal { constructor(public value: AkroValue) {} }
class BreakSignal {}
class ContinueSignal {}
class ThrowSignal { constructor(public value: AkroValue) {} }

class Environment {
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

  has(name: string): boolean {
    return this.vars.has(name) || (this.parent?.has(name) ?? false)
  }

  define(name: string, value: AkroValue, mutable = true): void {
    this.vars.set(name, { value, mutable })
  }

  child(): Environment { return new Environment(this) }
}

// ── Tokenizer ────────────────────────────────────────────────
type TT =
  | 'NUM' | 'STR' | 'IDENT' | 'BOOL' | 'NIL'
  | 'PLUS' | 'MINUS' | 'STAR' | 'SLASH' | 'PCT' | 'STARSTAR'
  | 'EQ' | 'NEQ' | 'LT' | 'GT' | 'LTE' | 'GTE'
  | 'AND' | 'OR' | 'NOT'
  | 'ASSIGN' | 'WALRUS' | 'COMMA' | 'DOT' | 'DOTDOT' | 'DOTDOTEQ'
  | 'LPAREN' | 'RPAREN' | 'LBRACE' | 'RBRACE' | 'LBRACK' | 'RBRACK'
  | 'COLON' | 'SPREAD'
  | 'FN' | 'RETURN' | 'IF' | 'ELIF' | 'ELSE' | 'FOR' | 'IN' | 'WHILE'
  | 'LOOP' | 'BREAK' | 'CONTINUE' | 'SAY' | 'PRINT' | 'LET' | 'MUT'
  | 'CONST' | 'STRUCT' | 'ENUM' | 'MATCH' | 'CASE' | 'THROW' | 'TRY'
  | 'CATCH' | 'FINALLY' | 'ASYNC' | 'AWAIT' | 'IMPORT' | 'EXPORT'
  | 'EOF'

interface Token { type: TT; value: string; line: number }

const KW: Record<string, TT> = {
  fn:'FN', return:'RETURN', if:'IF', elif:'ELIF', else:'ELSE',
  for:'FOR', in:'IN', while:'WHILE', loop:'LOOP', break:'BREAK',
  continue:'CONTINUE', say:'SAY', print:'PRINT', let:'LET', mut:'MUT',
  const:'CONST', struct:'STRUCT', enum:'ENUM', match:'MATCH', case:'CASE',
  throw:'THROW', try:'TRY', catch:'CATCH', finally:'FINALLY',
  async:'ASYNC', await:'AWAIT', import:'IMPORT', export:'EXPORT',
  true:'BOOL', false:'BOOL', nil:'NIL', and:'AND', or:'OR', not:'NOT',
}

function tokenize(src: string): Token[] {
  const toks: Token[] = []
  let i = 0, line = 1
  while (i < src.length) {
    const c = src[i]
    if (c === '\n') { line++; i++; continue }
    if (c === '\r' || c === ' ' || c === '\t') { i++; continue }
    if (c === '/' && src[i+1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue }
    if (/\d/.test(c)) {
      let n = ''
      while (i < src.length && /[\d._]/.test(src[i])) { if (src[i] !== '_') n += src[i]; i++ }
      toks.push({ type:'NUM', value:n, line }); continue
    }
    if (c === '"') {
      i++; let s = ''
      while (i < src.length && src[i] !== '"') {
        if (src[i] === '\\') { i++; const e: Record<string,string> = {n:'\n',t:'\t',r:'\r','"':'"','\\':'\\'}; s += e[src[i]] ?? src[i] }
        else s += src[i]
        i++
      }
      i++; toks.push({ type:'STR', value:s, line }); continue
    }
    if (/[a-zA-Z_]/.test(c)) {
      let id = ''
      while (i < src.length && /\w/.test(src[i])) id += src[i++]
      toks.push({ type: KW[id] ?? 'IDENT', value:id, line }); continue
    }
    if (c===':'&&src[i+1]==='='){toks.push({type:'WALRUS',value:':=',line});i+=2;continue}
    if (c==='.'&&src[i+1]==='.'&&src[i+2]==='='){toks.push({type:'DOTDOTEQ',value:'..=',line});i+=3;continue}
    if (c==='.'&&src[i+1]==='.'&&src[i+2]==='.'){toks.push({type:'SPREAD',value:'...',line});i+=3;continue}
    if (c==='.'&&src[i+1]==='.'){toks.push({type:'DOTDOT',value:'..',line});i+=2;continue}
    if (c==='*'&&src[i+1]==='*'){toks.push({type:'STARSTAR',value:'**',line});i+=2;continue}
    if (c==='='&&src[i+1]==='='){toks.push({type:'EQ',value:'==',line});i+=2;continue}
    if (c==='!'&&src[i+1]==='='){toks.push({type:'NEQ',value:'!=',line});i+=2;continue}
    if (c==='<'&&src[i+1]==='='){toks.push({type:'LTE',value:'<=',line});i+=2;continue}
    if (c==='>'&&src[i+1]==='='){toks.push({type:'GTE',value:'>=',line});i+=2;continue}
    const S: Record<string,TT> = {
      '+':'PLUS','-':'MINUS','*':'STAR','/':'SLASH','%':'PCT',
      '<':'LT','>':'GT','=':'ASSIGN',',':'COMMA','.':'DOT',
      '(':'LPAREN',')':'RPAREN','{':'LBRACE','}':'RBRACE',
      '[':'LBRACK',']':'RBRACK',':':'COLON'
    }
    if (S[c]) { toks.push({type:S[c],value:c,line}); i++; continue }
    i++
  }
  toks.push({type:'EOF',value:'',line})
  return toks
}
// ── Parser ───────────────────────────────────────────────────
class Parser {
  private pos = 0
  private toks: Token[]
  constructor(toks: Token[]) { this.toks = toks.filter(t => t.type !== ('NEWLINE' as TT)) }

  private peek(o=0): Token { return this.toks[Math.min(this.pos+o, this.toks.length-1)] }
  private adv(): Token { return this.toks[this.pos++] }
  private check(t: TT): boolean { return this.peek().type === t }
  private match(...ts: TT[]): boolean { if (ts.includes(this.peek().type)){this.adv();return true} return false }
  private expect(t: TT): Token {
    if (!this.check(t)) throw new Error(`Expected ${t} got ${this.peek().type}("${this.peek().value}") line ${this.peek().line}`)
    return this.adv()
  }

  parse(): ASTNode[] {
    const b: ASTNode[] = []
    while (!this.check('EOF')) b.push(this.stmt())
    return b
  }

  private stmt(): ASTNode {
    const t = this.peek()
    if (t.type==='FN'||(t.type==='ASYNC'&&this.peek(1).type==='FN')) return this.parseFn()
    if (t.type==='RETURN') return this.parseReturn()
    if (t.type==='SAY'||t.type==='PRINT') return this.parseSay()
    if (t.type==='IF') return this.parseIf()
    if (t.type==='FOR') return this.parseFor()
    if (t.type==='WHILE') return this.parseWhile()
    if (t.type==='LOOP') { this.adv(); this.expect('LBRACE'); return {type:'Loop',body:this.block()} }
    if (t.type==='BREAK') { this.adv(); return {type:'Break'} }
    if (t.type==='CONTINUE') { this.adv(); return {type:'Continue'} }
    if (t.type==='THROW') { this.adv(); return {type:'Throw',value:this.expr()} }
    if (t.type==='TRY') return this.parseTry()
    if (t.type==='MATCH') return this.parseMatch()
    if (t.type==='MUT'||t.type==='LET') return this.parseVarDecl()
    if (t.type==='CONST') return this.parseConst()
    if (['IMPORT','EXPORT','STRUCT','ENUM'].includes(t.type)) {
      while (!this.check('EOF')&&!this.check('RBRACE')) {
        if (this.check('LBRACE')){this.adv();this.skipBlock();break}
        this.adv()
      }
      return {type:'NilLit'}
    }
    return this.exprStmt()
  }

  private parseFn(): ASTNode {
    const isAsync = this.match('ASYNC')
    this.expect('FN')
    const name = this.expect('IDENT').value
    const params: string[] = []
    if (this.match('LPAREN')) {
      while (!this.check('RPAREN')&&!this.check('EOF')) {
        if (this.check('SPREAD')) this.adv()
        params.push(this.expect('IDENT').value)
        if (!this.match('COMMA')) break
      }
      this.expect('RPAREN')
    }
    this.expect('LBRACE')
    return {type:'FnDecl',name,params,body:this.block(),isAsync}
  }

  private parseReturn(): ASTNode {
    this.expect('RETURN')
    if (this.check('RBRACE')||this.check('EOF')) return {type:'Return',value:null}
    return {type:'Return',value:this.expr()}
  }

  private parseSay(): ASTNode { this.adv(); return {type:'Say',value:this.expr()} }

  private parseIf(): ASTNode {
    this.expect('IF')
    const cond = this.expr()
    this.expect('LBRACE')
    const then = this.block()
    const elifs: {cond:ASTNode;body:ASTNode[]}[] = []
    let else_: ASTNode[]|null = null
    while (this.check('ELIF')) {
      this.adv(); const ec=this.expr(); this.expect('LBRACE'); elifs.push({cond:ec,body:this.block()})
    }
    if (this.match('ELSE')) { this.expect('LBRACE'); else_=this.block() }
    return {type:'If',cond,then,elifs,else_}
  }

  private parseFor(): ASTNode {
    this.expect('FOR')
    const first = this.expect('IDENT').value
    let indexVar: string|null = null, iterVar = first
    if (this.match('COMMA')) { indexVar=first; iterVar=this.expect('IDENT').value }
    this.expect('IN')
    const startExpr = this.addSub()
    if (this.check('DOTDOT')||this.check('DOTDOTEQ')) {
      const inc = this.peek().type==='DOTDOTEQ'; this.adv()
      const endExpr = this.addSub()
      this.expect('LBRACE')
      return {type:'ForRange',var:iterVar,start:startExpr,end:endExpr,inclusive:inc,body:this.block()}
    }
    this.expect('LBRACE')
    return {type:'ForIn',var:iterVar,indexVar,iter:startExpr,body:this.block()}
  }

  private parseWhile(): ASTNode {
    this.expect('WHILE'); const cond=this.expr(); this.expect('LBRACE')
    return {type:'While',cond,body:this.block()}
  }

  private parseTry(): ASTNode {
    this.expect('TRY'); this.expect('LBRACE'); const try_=this.block()
    this.expect('CATCH'); const catchVar=this.expect('IDENT').value; this.expect('LBRACE'); const catch_=this.block()
    let finally_: ASTNode[]|null = null
    if (this.match('FINALLY')) { this.expect('LBRACE'); finally_=this.block() }
    return {type:'TryCatch',try_,catchVar,catch_,finally_}
  }

  private parseMatch(): ASTNode {
    this.expect('MATCH'); const value=this.expr(); this.expect('LBRACE')
    const cases: {pattern:ASTNode|null;guard:ASTNode|null;body:ASTNode[]}[] = []
    while (!this.check('RBRACE')&&!this.check('EOF')) {
      this.expect('CASE')
      let pattern: ASTNode|null = null, guard: ASTNode|null = null
      if (this.check('IDENT')&&this.peek().value==='_') { this.adv() }
      else {
        pattern = this.expr()
        if (this.check('IDENT')&&this.peek().value==='if') { this.adv(); guard=this.expr() }
      }
      this.expect('LBRACE'); cases.push({pattern,guard,body:this.block()})
    }
    this.expect('RBRACE')
    return {type:'Match',value,cases}
  }

  private parseVarDecl(): ASTNode {
    const mutable = this.match('MUT'); if (!mutable) this.match('LET')
    const name = this.expect('IDENT').value
    if (this.match('COLON')) this.adv()
    this.expect('ASSIGN')
    return {type:'VarDecl',name,value:this.expr(),mutable,isConst:false}
  }

  private parseConst(): ASTNode {
    this.expect('CONST'); const name=this.expect('IDENT').value
    if (this.match('COLON')) this.adv()
    this.expect('WALRUS')
    return {type:'VarDecl',name,value:this.expr(),mutable:false,isConst:true}
  }

  private exprStmt(): ASTNode {
    const e = this.expr()
    if (this.check('WALRUS')) {
      this.adv(); const val=this.expr()
      if (e.type==='Identifier') return {type:'VarDecl',name:e.name,value:val,mutable:false,isConst:false}
    }
    if (this.check('ASSIGN')) {
      this.adv(); const val=this.expr()
      if (e.type==='Identifier') return {type:'Assign',name:e.name,value:val}
      if (e.type==='Index') return {type:'IndexAssign',object:e.object,index:e.index,value:val}
      if (e.type==='MemberAccess') return {type:'IndexAssign',object:e.object,index:{type:'StringLit',value:e.property},value:val}
    }
    return e
  }

  private block(): ASTNode[] {
    const s: ASTNode[] = []
    while (!this.check('RBRACE')&&!this.check('EOF')) s.push(this.stmt())
    this.expect('RBRACE'); return s
  }

  private skipBlock(): void {
    let d=1
    while (d>0&&!this.check('EOF')) {
      if (this.check('LBRACE')) d++
      if (this.check('RBRACE')) d--
      this.adv()
    }
  }

  private expr(): ASTNode { return this.or() }
  private or(): ASTNode {
    let l=this.and()
    while(this.check('OR')){this.adv();l={type:'BinOp',op:'or',left:l,right:this.and()}}
    return l
  }
  private and(): ASTNode {
    let l=this.not_()
    while(this.check('AND')){this.adv();l={type:'BinOp',op:'and',left:l,right:this.not_()}}
    return l
  }
  private not_(): ASTNode {
    if(this.check('NOT')){this.adv();return{type:'UnaryOp',op:'not',operand:this.not_()}}
    return this.cmp()
  }
  private cmp(): ASTNode {
    let l=this.addSub()
    const ops=['EQ','NEQ','LT','GT','LTE','GTE'] as TT[]
    while(ops.includes(this.peek().type)){const op=this.adv().value;l={type:'BinOp',op,left:l,right:this.addSub()}}
    return l
  }
  private addSub(): ASTNode {
    let l=this.mulDiv()
    while(this.check('PLUS')||this.check('MINUS')){const op=this.adv().value;l={type:'BinOp',op,left:l,right:this.mulDiv()}}
    return l
  }
  private mulDiv(): ASTNode {
    let l=this.power()
    while(this.check('STAR')||this.check('SLASH')||this.check('PCT')){const op=this.adv().value;l={type:'BinOp',op,left:l,right:this.power()}}
    return l
  }
  private power(): ASTNode {
    let l=this.unary()
    if(this.check('STARSTAR')){this.adv();return{type:'BinOp',op:'**',left:l,right:this.power()}}
    return l
  }
  private unary(): ASTNode {
    if(this.check('MINUS')){this.adv();return{type:'UnaryOp',op:'-',operand:this.unary()}}
    if(this.check('NOT')){this.adv();return{type:'UnaryOp',op:'not',operand:this.unary()}}
    return this.postfix()
  }
  private postfix(): ASTNode {
    let e=this.primary()
    while(true){
      if(this.check('DOT')){
        this.adv(); const prop=this.expect('IDENT').value
        if(this.check('LPAREN')){this.adv();const args=this.args();e={type:'Call',callee:{type:'MemberAccess',object:e,property:prop},args}}
        else e={type:'MemberAccess',object:e,property:prop}
      } else if(this.check('LBRACK')){
        this.adv();const idx=this.expr();this.expect('RBRACK');e={type:'Index',object:e,index:idx}
      } else if(this.check('LPAREN')){
        this.adv();const args=this.args();e={type:'Call',callee:e,args}
      } else break
    }
    return e
  }
  private args(): ASTNode[] {
    const a: ASTNode[]=[]
    while(!this.check('RPAREN')&&!this.check('EOF')){a.push(this.expr());if(!this.match('COMMA'))break}
    this.expect('RPAREN');return a
  }
  private primary(): ASTNode {
    const t=this.peek()
    if(t.type==='NUM'){this.adv();return{type:'NumberLit',value:parseFloat(t.value)}}
    if(t.type==='BOOL'){this.adv();return{type:'BoolLit',value:t.value==='true'}}
    if(t.type==='NIL'){this.adv();return{type:'NilLit'}}
    if(t.type==='STR'){this.adv();return{type:'StringLit',value:t.value}}
    if(t.type==='LPAREN'){this.adv();const e=this.expr();this.expect('RPAREN');return e}
    if(t.type==='LBRACK'){
      this.adv();const els: ASTNode[]=[]
      while(!this.check('RBRACK')&&!this.check('EOF')){els.push(this.expr());if(!this.match('COMMA'))break}
      this.expect('RBRACK');return{type:'ArrayLit',elements:els}
    }
    if(t.type==='LBRACE'){
      this.adv();const pairs: {key:string;value:ASTNode}[]=[]
      while(!this.check('RBRACE')&&!this.check('EOF')){
        let key: string
        if(this.check('STR')) key=this.adv().value
        else key=this.expect('IDENT').value
        this.expect('COLON');const val=this.expr();pairs.push({key,value:val})
        if(!this.match('COMMA'))break
      }
      this.expect('RBRACE');return{type:'MapLit',pairs}
    }
    if(t.type==='FN'||(t.type==='ASYNC'&&this.peek(1).type==='FN')){
      const isAsync=this.match('ASYNC');this.expect('FN')
      const params: string[]=[]
      if(this.match('LPAREN')){
        while(!this.check('RPAREN')&&!this.check('EOF')){
          if(this.check('SPREAD'))this.adv()
          params.push(this.expect('IDENT').value);if(!this.match('COMMA'))break
        }
        this.expect('RPAREN')
      }
      this.expect('LBRACE');return{type:'FnExpr',params,body:this.block(),isAsync}
    }
    if(t.type==='IDENT'){this.adv();return{type:'Identifier',name:t.value}}
    this.adv();return{type:'NilLit'}
  }
}
// ── Interpreter ──────────────────────────────────────────────
class Interpreter {
  private output: OutputLine[] = []
  private steps = 0
  private readonly MAX = 100000

  private makeNative(fn: (args: AkroValue[], env: Environment) => AkroValue): AkroFunction {
    return { __type:'function', params:[], body:[], closure:new Environment(), __native:fn }
  }

  private isAkroFn(v: AkroValue): v is AkroFunction {
    return typeof v==='object'&&v!==null&&!Array.isArray(v)&&(v as AkroFunction).__type==='function'
  }

  private typeOf(v: AkroValue): string {
    if(v===null) return 'nil'
    if(typeof v==='boolean') return 'bool'
    if(typeof v==='number') return Number.isInteger(v)?'int':'float'
    if(typeof v==='string') return 'string'
    if(Array.isArray(v)) return 'array'
    if(this.isAkroFn(v)) return 'function'
    return 'map'
  }

  private isTruthy(v: AkroValue): boolean {
    if(v===null||v===false||v===0||v==='') return false
    if(Array.isArray(v)&&v.length===0) return false
    return true
  }

  private stringify(v: AkroValue): string {
    if(v===null) return 'nil'
    if(typeof v==='boolean') return v?'true':'false'
    if(typeof v==='number') return String(v)
    if(typeof v==='string') return v
    if(Array.isArray(v)) return '['+v.map(x=>this.stringify(x)).join(', ')+']'
    if(this.isAkroFn(v)) return '<function>'
    return '{'+Object.entries(v as AkroMap).map(([k,val])=>`${k}: ${this.stringify(val)}`).join(', ')+'}'
  }

  private emit(text: string): void { this.output.push({text,type:'output'}) }

  private interpolate(tmpl: string, env: Environment): string {
    return tmpl.replace(/\{([^}]+)\}/g, (_,expr) => {
      try {
        const toks = tokenize(expr.trim())
        const ast = new Parser(toks).parse()
        if(!ast.length) return ''
        return this.stringify(this.evalNode(ast[0],env) as AkroValue)
      } catch { return `{${expr}}` }
    })
  }

  private globalEnv(): Environment {
    const env = new Environment()
    const def = (name: string, fn: (args: AkroValue[], env: Environment) => AkroValue) =>
      env.define(name, this.makeNative(fn), false)

    def('say', (a) => { this.emit(this.stringify(a[0]??null)); return null })
    def('print', (a) => { this.emit(this.stringify(a[0]??null)); return null })
    def('int', (a) => {
      const v=a[0]; if(typeof v==='number') return Math.trunc(v)
      if(typeof v==='string'){const n=parseInt(v);if(!isNaN(n))return n}
      if(typeof v==='boolean') return v?1:0; return 0
    })
    def('float', (a) => {
      const v=a[0]; if(typeof v==='number') return v
      if(typeof v==='string'){const n=parseFloat(v);if(!isNaN(n))return n}; return 0
    })
    def('str', (a) => this.stringify(a[0]??null))
    def('bool', (a) => this.isTruthy(a[0]??null))
    def('type', (a) => this.typeOf(a[0]??null))
    def('len', (a) => {
      const v=a[0]
      if(typeof v==='string') return v.length
      if(Array.isArray(v)) return v.length
      if(v&&typeof v==='object'&&!this.isAkroFn(v)) return Object.keys(v as AkroMap).length
      return 0
    })
    def('range', (a) => {
      if(a.length===1) return Array.from({length:a[0] as number},(_,i)=>i)
      return Array.from({length:(a[1] as number)-(a[0] as number)},(_,i)=>i+(a[0] as number))
    })
    def('append', (a) => [...(a[0] as AkroValue[]), a[1]])
    def('push', (a) => [...(a[0] as AkroValue[]), a[1]])
    def('pop', (a) => (a[0] as AkroValue[]).slice(0,-1))
    def('sort', (a) => {
      return [...(a[0] as AkroValue[])].sort((x,y)=>{
        if(typeof x==='number'&&typeof y==='number') return x-y
        return String(x).localeCompare(String(y))
      })
    })
    def('reverse', (a) => [...(a[0] as AkroValue[])].reverse())
    def('sum', (a) => (a[0] as number[]).reduce((x,y)=>(x as number)+(y as number),0))
    def('min', (a) => Array.isArray(a[0]) ? Math.min(...(a[0] as number[])) : Math.min(...(a as number[])))
    def('max', (a) => Array.isArray(a[0]) ? Math.max(...(a[0] as number[])) : Math.max(...(a as number[])))
    def('map', (a, env) => {
      const arr=a[0] as AkroValue[], fn=a[1] as AkroFunction
      return arr.map(item=>this.callFn(fn,[item],env))
    })
    def('filter', (a, env) => {
      const arr=a[0] as AkroValue[], fn=a[1] as AkroFunction
      return arr.filter(item=>this.isTruthy(this.callFn(fn,[item],env)))
    })
    def('reduce', (a, env) => {
      const arr=a[0] as AkroValue[], fn=a[1] as AkroFunction
      let acc=a[2]??null
      for(const item of arr) acc=this.callFn(fn,[acc,item],env)
      return acc
    })
    def('contains', (a) => {
      const [col,item]=a
      if(Array.isArray(col)) return col.some(x=>x===item)
      if(typeof col==='string') return col.includes(String(item))
      return false
    })
    def('abs', (a) => Math.abs(a[0] as number))
    def('sqrt', (a) => Math.sqrt(a[0] as number))
    def('pow', (a) => Math.pow(a[0] as number, a[1] as number))
    def('floor', (a) => Math.floor(a[0] as number))
    def('ceil', (a) => Math.ceil(a[0] as number))
    def('round', (a) => Math.round(a[0] as number))
    def('sin', (a) => Math.sin(a[0] as number))
    def('cos', (a) => Math.cos(a[0] as number))
    def('tan', (a) => Math.tan(a[0] as number))
    def('log', (a) => Math.log(a[0] as number))
    def('rand', (a) => {
      if(!a.length) return Math.random()
      return Math.floor(Math.random()*((a[1] as number)-(a[0] as number)+1))+(a[0] as number)
    })
    def('upper', (a) => String(a[0]).toUpperCase())
    def('lower', (a) => String(a[0]).toLowerCase())
    def('trim', (a) => String(a[0]).trim())
    def('split', (a) => String(a[0]).split(String(a[1]??'')))
    def('join', (a) => (a[0] as string[]).join(String(a[1]??'')))
    def('replace', (a) => String(a[0]).replaceAll(String(a[1]),String(a[2])))
    def('starts_with', (a) => String(a[0]).startsWith(String(a[1])))
    def('ends_with', (a) => String(a[0]).endsWith(String(a[1])))
    def('repeat', (a) => String(a[0]).repeat(a[1] as number))
    def('input', (a) => window.prompt(String(a[0]??''))??'')
    env.define('PI', Math.PI, false)
    env.define('E', Math.E, false)
    return env
  }

  private getMember(obj: AkroValue, prop: string): AkroValue {
    if(typeof obj==='string') {
      const m: Record<string,AkroValue> = {
        length: obj.length,
        upper: this.makeNative(()=>obj.toUpperCase()),
        lower: this.makeNative(()=>obj.toLowerCase()),
        trim: this.makeNative(()=>obj.trim()),
        split: this.makeNative(a=>obj.split(String(a[0]??''))),
        replace: this.makeNative(a=>obj.replaceAll(String(a[0]),String(a[1]))),
        contains: this.makeNative(a=>obj.includes(String(a[0]))),
        starts_with: this.makeNative(a=>obj.startsWith(String(a[0]))),
        ends_with: this.makeNative(a=>obj.endsWith(String(a[0]))),
        reverse: this.makeNative(()=>obj.split('').reverse().join('')),
        repeat: this.makeNative(a=>obj.repeat(a[0] as number)),
      }
      return m[prop]??null
    }
    if(Array.isArray(obj)) {
      const m: Record<string,AkroValue> = {
        length: obj.length,
        len: obj.length,
        push: this.makeNative(a=>{obj.push(a[0]);return null}),
        pop: this.makeNative(()=>obj.pop()??null),
        shift: this.makeNative(()=>obj.shift()??null),
        reverse: this.makeNative(()=>{obj.reverse();return null}),
        sort: this.makeNative(()=>{obj.sort();return null}),
        join: this.makeNative(a=>obj.map(x=>this.stringify(x)).join(String(a[0]??','))),
        contains: this.makeNative(a=>obj.includes(a[0])),
        clear: this.makeNative(()=>{obj.length=0;return null}),
        slice: this.makeNative(a=>obj.slice(a[0] as number, a[1] as number)),
      }
      return m[prop]??null
    }
    if(obj&&typeof obj==='object'&&!this.isAkroFn(obj)) {
      const map=obj as AkroMap
      if(prop==='keys') return this.makeNative(()=>Object.keys(map))
      if(prop==='values') return this.makeNative(()=>Object.values(map))
      if(prop==='remove') return this.makeNative(a=>{delete map[String(a[0])];return null})
      if(prop==='clear') return this.makeNative(()=>{for(const k in map)delete map[k];return null})
      if(prop==='has') return this.makeNative(a=>String(a[0]) in map)
      return map[prop]??null
    }
    return null
  }

  private callFn(fn: AkroFunction, args: AkroValue[], _env: Environment): AkroValue {
    if(fn.__native) return fn.__native(args, fn.closure)
    const fnEnv = fn.closure.child()
    fn.params.forEach((p,i)=>fnEnv.define(p, args[i]??null, true))
    const r = this.execBlock(fn.body, fnEnv)
    if(r instanceof ReturnSignal) return r.value
    return r as AkroValue
  }

  private execBlock(stmts: ASTNode[], env: Environment): AkroValue|ReturnSignal|BreakSignal|ContinueSignal {
    let last: AkroValue|ReturnSignal|BreakSignal|ContinueSignal = null
    for(const s of stmts) {
      last = this.evalNode(s, env)
      if(last instanceof ReturnSignal||last instanceof BreakSignal||last instanceof ContinueSignal) return last
    }
    return last
  }

  private matchPat(val: AkroValue, pat: ASTNode, env: Environment): boolean {
    if(pat.type==='BinOp'&&pat.op==='..') {
      const lo=this.evalNode(pat.left,env) as number, hi=this.evalNode(pat.right,env) as number
      return typeof val==='number'&&val>=lo&&val<hi
    }
    if(pat.type==='BinOp'&&pat.op==='..=') {
      const lo=this.evalNode(pat.left,env) as number, hi=this.evalNode(pat.right,env) as number
      return typeof val==='number'&&val>=lo&&val<=hi
    }
    const pv = this.evalNode(pat,env) as AkroValue
    return val===pv
  }

  private evalBin(op: string, ln: ASTNode, rn: ASTNode, env: Environment): AkroValue {
    if(op==='and'){const l=this.evalNode(ln,env) as AkroValue;if(!this.isTruthy(l))return false;return this.isTruthy(this.evalNode(rn,env) as AkroValue)}
    if(op==='or'){const l=this.evalNode(ln,env) as AkroValue;if(this.isTruthy(l))return true;return this.isTruthy(this.evalNode(rn,env) as AkroValue)}
    const l=this.evalNode(ln,env) as AkroValue, r=this.evalNode(rn,env) as AkroValue
    switch(op){
      case '+': if(typeof l==='string'||typeof r==='string') return this.stringify(l)+this.stringify(r)
                if(Array.isArray(l)&&Array.isArray(r)) return [...l,...r]
                return (l as number)+(r as number)
      case '-': return (l as number)-(r as number)
      case '*': if(typeof l==='string'&&typeof r==='number') return l.repeat(r)
                return (l as number)*(r as number)
      case '/': if((r as number)===0) throw new Error('Division by zero'); return (l as number)/(r as number)
      case '%': return (l as number)%(r as number)
      case '**': return Math.pow(l as number, r as number)
      case '==': return l===r
      case '!=': return l!==r
      case '<': return (l as number)<(r as number)
      case '>': return (l as number)>(r as number)
      case '<=': return (l as number)<=(r as number)
      case '>=': return (l as number)>=(r as number)
      default: return null
    }
  }

  evalNode(node: ASTNode, env: Environment): AkroValue|ReturnSignal|BreakSignal|ContinueSignal {
    if(++this.steps>this.MAX) throw new Error('Execution limit reached (infinite loop?)')
    switch(node.type){
      case 'NilLit': return null
      case 'BoolLit': return node.value
      case 'NumberLit': return node.value
      case 'StringLit': return this.interpolate(node.value, env)
      case 'Identifier': try{return env.get(node.name)}catch{return null}
      case 'ArrayLit': return node.elements.map(e=>this.evalNode(e,env) as AkroValue)
      case 'MapLit': {
        const m: AkroMap={}
        for(const {key,value} of node.pairs) m[key]=this.evalNode(value,env) as AkroValue
        return m
      }
      case 'FnExpr': return {__type:'function',params:node.params,body:node.body,closure:env,isAsync:node.isAsync}
      case 'FnDecl': {
        env.define(node.name,{__type:'function',params:node.params,body:node.body,closure:env,isAsync:node.isAsync},false)
        return null
      }
      case 'VarDecl': {
        const v=this.evalNode(node.value,env) as AkroValue
        env.define(node.name,v,node.mutable)
        return null
      }
      case 'Assign': {
        const v=this.evalNode(node.value,env) as AkroValue
        try{env.set(node.name,v)}catch{env.define(node.name,v,true)}
        return null
      }
      case 'IndexAssign': {
        const obj=this.evalNode(node.object,env) as AkroValue
        const idx=this.evalNode(node.index,env) as AkroValue
        const val=this.evalNode(node.value,env) as AkroValue
        if(Array.isArray(obj)){let i=idx as number;if(i<0)i=obj.length+i;obj[i]=val}
        else if(obj&&typeof obj==='object'&&!this.isAkroFn(obj))(obj as AkroMap)[String(idx)]=val
        return null
      }
      case 'Say': { const v=this.evalNode(node.value,env) as AkroValue; this.emit(this.stringify(v)); return null }
      case 'Return': return new ReturnSignal(node.value?this.evalNode(node.value,env) as AkroValue:null)
      case 'Break': return new BreakSignal()
      case 'Continue': return new ContinueSignal()
      case 'Throw': throw new ThrowSignal(this.evalNode(node.value,env) as AkroValue)
      case 'TryCatch': {
        try{
          const r=this.execBlock(node.try_,env)
          if(r instanceof ReturnSignal) return r
        }catch(e){
          const ce=env.child()
          if(e instanceof ThrowSignal) ce.define(node.catchVar,e.value,false)
          else ce.define(node.catchVar,String((e as Error).message??e),false)
          const r=this.execBlock(node.catch_,ce)
          if(r instanceof ReturnSignal) return r
        }finally{
          if(node.finally_) this.execBlock(node.finally_,env)
        }
        return null
      }
      case 'If': {
        if(this.isTruthy(this.evalNode(node.cond,env) as AkroValue)) return this.execBlock(node.then,env.child())
        for(const el of node.elifs) if(this.isTruthy(this.evalNode(el.cond,env) as AkroValue)) return this.execBlock(el.body,env.child())
        if(node.else_) return this.execBlock(node.else_,env.child())
        return null
      }
      case 'ForRange': {
        const s=this.evalNode(node.start,env) as number, e=this.evalNode(node.end,env) as number
        for(let i=s;node.inclusive?i<=e:i<e;i++){
          const le=env.child();le.define(node.var,i,true)
          const r=this.execBlock(node.body,le)
          if(r instanceof BreakSignal) break
          if(r instanceof ReturnSignal) return r
        }
        return null
      }
      case 'ForIn': {
        const iter=this.evalNode(node.iter,env) as AkroValue
        let items: AkroValue[]=[]
        if(Array.isArray(iter)) items=iter
        else if(typeof iter==='string') items=iter.split('')
        else if(iter&&typeof iter==='object'&&!this.isAkroFn(iter))
          items=Object.entries(iter as AkroMap).map(([k,v])=>[k,v] as AkroValue)
        for(let idx=0;idx<items.length;idx++){
          const le=env.child()
          const item=items[idx]
          if(node.indexVar){le.define(node.indexVar,idx,false);le.define(node.var,item,false)}
          else if(Array.isArray(item)&&item.length===2&&iter&&typeof iter==='object'&&!Array.isArray(iter)){
            // for k, v in map — but no indexVar means single var gets the pair
            le.define(node.var,item,false)
          } else le.define(node.var,item,false)
          const r=this.execBlock(node.body,le)
          if(r instanceof BreakSignal) break
          if(r instanceof ReturnSignal) return r
        }
        return null
      }
      case 'While': {
        let iters=0
        while(this.isTruthy(this.evalNode(node.cond,env) as AkroValue)){
          if(++iters>10000) throw new Error('While loop limit reached')
          const r=this.execBlock(node.body,env.child())
          if(r instanceof BreakSignal) break
          if(r instanceof ReturnSignal) return r
        }
        return null
      }
      case 'Loop': {
        let iters=0
        while(true){
          if(++iters>10000) throw new Error('Loop limit reached')
          const r=this.execBlock(node.body,env.child())
          if(r instanceof BreakSignal) break
          if(r instanceof ReturnSignal) return r
        }
        return null
      }
      case 'Match': {
        const val=this.evalNode(node.value,env) as AkroValue
        for(const c of node.cases){
          if(c.pattern===null){
            if(c.guard&&!this.isTruthy(this.evalNode(c.guard,env) as AkroValue)) continue
            return this.execBlock(c.body,env.child())
          }
          if(this.matchPat(val,c.pattern,env)){
            if(c.guard&&!this.isTruthy(this.evalNode(c.guard,env) as AkroValue)) continue
            return this.execBlock(c.body,env.child())
          }
        }
        return null
      }
      case 'BinOp': return this.evalBin(node.op,node.left,node.right,env)
      case 'UnaryOp': {
        const v=this.evalNode(node.operand,env) as AkroValue
        if(node.op==='-') return -(v as number)
        if(node.op==='not') return !this.isTruthy(v)
        return null
      }
      case 'Call': {
        if(node.callee.type==='MemberAccess'){
          const obj=this.evalNode(node.callee.object,env) as AkroValue
          const method=this.getMember(obj,node.callee.property)
          const args=node.args.map(a=>this.evalNode(a,env) as AkroValue)
          if(this.isAkroFn(method)) return this.callFn(method,args,env)
          throw new Error(`${node.callee.property} is not a function`)
        }
        const callee=this.evalNode(node.callee,env) as AkroValue
        const args=node.args.map(a=>this.evalNode(a,env) as AkroValue)
        if(!this.isAkroFn(callee)){
          const name=node.callee.type==='Identifier'?node.callee.name:'?'
          throw new Error(`${name} is not a function`)
        }
        return this.callFn(callee,args,env)
      }
      case 'MemberAccess': {
        const obj=this.evalNode(node.object,env) as AkroValue
        return this.getMember(obj,node.property)
      }
      case 'Index': {
        const obj=this.evalNode(node.object,env) as AkroValue
        const idx=this.evalNode(node.index,env) as AkroValue
        if(Array.isArray(obj)){let i=idx as number;if(i<0)i=obj.length+i;return obj[i]??null}
        if(typeof obj==='string'){let i=idx as number;if(i<0)i=obj.length+i;return obj[i]??null}
        if(obj&&typeof obj==='object') return (obj as AkroMap)[String(idx)]??null
        return null
      }
      default: return null
    }
  }

  run(source: string): OutputLine[] {
    this.output=[]; this.steps=0
    try{
      const toks=tokenize(source)
      const ast=new Parser(toks).parse()
      const env=this.globalEnv()
      // First pass: register all top-level fns
      for(const node of ast){
        if(node.type==='FnDecl'){
          env.define(node.name,{__type:'function',params:node.params,body:node.body,closure:env,isAsync:node.isAsync},false)
        }
      }
      // Execute
      for(const node of ast){
        const r=this.evalNode(node,env)
        if(r instanceof ReturnSignal) break
      }
      // Auto-call main
      if(env.has('main')){
        const m=env.get('main')
        if(this.isAkroFn(m)) this.callFn(m,[],env)
      }
    }catch(e){
      if(e instanceof ThrowSignal)
        this.output.push({text:`Uncaught: ${this.stringify(e.value)}`,type:'error'})
      else
        this.output.push({text:String((e as Error).message??e),type:'error'})
    }
    return this.output
  }
}

export function runAkro(source: string): OutputLine[] {
  return new Interpreter().run(source)
}


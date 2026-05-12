// Akro Parser — imported by akroInterpreter.ts
import type { ASTNode } from './types'

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
  fn:'FN',return:'RETURN',if:'IF',elif:'ELIF',else:'ELSE',
  for:'FOR',in:'IN',while:'WHILE',loop:'LOOP',break:'BREAK',
  continue:'CONTINUE',say:'SAY',print:'PRINT',let:'LET',mut:'MUT',
  const:'CONST',struct:'STRUCT',enum:'ENUM',match:'MATCH',case:'CASE',
  throw:'THROW',try:'TRY',catch:'CATCH',finally:'FINALLY',
  async:'ASYNC',await:'AWAIT',import:'IMPORT',export:'EXPORT',
  true:'BOOL',false:'BOOL',nil:'NIL',and:'AND',or:'OR',not:'NOT',
}

export function tokenize(src: string): Token[] {
  const toks: Token[] = []
  let i = 0, line = 1
  while (i < src.length) {
    const c = src[i]
    if (c==='\n'){line++;i++;continue}
    if (c==='\r'||c===' '||c==='\t'){i++;continue}
    if (c==='/'&&src[i+1]==='/'){while(i<src.length&&src[i]!=='\n')i++;continue}
    if (/\d/.test(c)){
      let n=''
      while(i<src.length&&/[\d._]/.test(src[i])){if(src[i]!=='_')n+=src[i];i++}
      toks.push({type:'NUM',value:n,line});continue
    }
    if (c==='"'){
      i++;let s=''
      while(i<src.length&&src[i]!=='"'){
        if(src[i]==='\\'){i++;const e:Record<string,string>={n:'\n',t:'\t',r:'\r','"':'"','\\':'\\'};s+=e[src[i]]??src[i]}
        else s+=src[i]
        i++
      }
      i++;toks.push({type:'STR',value:s,line});continue
    }
    if (/[a-zA-Z_]/.test(c)){
      let id=''
      while(i<src.length&&/\w/.test(src[i]))id+=src[i++]
      toks.push({type:KW[id]??'IDENT',value:id,line});continue
    }
    if(c===':'&&src[i+1]==='='){toks.push({type:'WALRUS',value:':=',line});i+=2;continue}
    if(c==='.'&&src[i+1]==='.'&&src[i+2]==='='){toks.push({type:'DOTDOTEQ',value:'..=',line});i+=3;continue}
    if(c==='.'&&src[i+1]==='.'&&src[i+2]==='.'){toks.push({type:'SPREAD',value:'...',line});i+=3;continue}
    if(c==='.'&&src[i+1]==='.'){toks.push({type:'DOTDOT',value:'..',line});i+=2;continue}
    if(c==='*'&&src[i+1]==='*'){toks.push({type:'STARSTAR',value:'**',line});i+=2;continue}
    if(c==='='&&src[i+1]==='='){toks.push({type:'EQ',value:'==',line});i+=2;continue}
    if(c==='!'&&src[i+1]==='='){toks.push({type:'NEQ',value:'!=',line});i+=2;continue}
    if(c==='<'&&src[i+1]==='='){toks.push({type:'LTE',value:'<=',line});i+=2;continue}
    if(c==='>'&&src[i+1]==='='){toks.push({type:'GTE',value:'>=',line});i+=2;continue}
    const S:Record<string,TT>={
      '+':'PLUS','-':'MINUS','*':'STAR','/':'SLASH','%':'PCT',
      '<':'LT','>':'GT','=':'ASSIGN',',':'COMMA','.':'DOT',
      '(':'LPAREN',')':'RPAREN','{':'LBRACE','}':'RBRACE',
      '[':'LBRACK',']':'RBRACK',':':'COLON'
    }
    if(S[c]){toks.push({type:S[c],value:c,line});i++;continue}
    i++
  }
  toks.push({type:'EOF',value:'',line})
  return toks
}

export class Parser {
  private pos=0
  private toks: Token[]
  constructor(toks: Token[]){this.toks=toks}
  private peek(o=0):Token{return this.toks[Math.min(this.pos+o,this.toks.length-1)]}
  private adv():Token{return this.toks[this.pos++]}
  private check(t:TT):boolean{return this.peek().type===t}
  private match(...ts:TT[]):boolean{if(ts.includes(this.peek().type)){this.adv();return true}return false}
  private expect(t:TT):Token{
    if(!this.check(t))throw new Error(`Expected ${t} got "${this.peek().value}" line ${this.peek().line}`)
    return this.adv()
  }
  parse():ASTNode[]{
    const b:ASTNode[]=[]
    while(!this.check('EOF'))b.push(this.stmt())
    return b
  }
  private stmt():ASTNode{
    const t=this.peek()
    if(t.type==='FN'||(t.type==='ASYNC'&&this.peek(1).type==='FN'))return this.parseFn()
    if(t.type==='RETURN')return this.parseReturn()
    if(t.type==='SAY'||t.type==='PRINT')return this.parseSay()
    if(t.type==='IF')return this.parseIf()
    if(t.type==='FOR')return this.parseFor()
    if(t.type==='WHILE'){this.adv();const c=this.expr();this.expect('LBRACE');return{type:'While',cond:c,body:this.block()}}
    if(t.type==='LOOP'){this.adv();this.expect('LBRACE');return{type:'Loop',body:this.block()}}
    if(t.type==='BREAK'){this.adv();return{type:'Break'}}
    if(t.type==='CONTINUE'){this.adv();return{type:'Continue'}}
    if(t.type==='THROW'){this.adv();return{type:'Throw',value:this.expr()}}
    if(t.type==='TRY')return this.parseTry()
    if(t.type==='MATCH')return this.parseMatch()
    if(t.type==='MUT'||t.type==='LET')return this.parseVarDecl()
    if(t.type==='CONST')return this.parseConst()
    if(['IMPORT','EXPORT','STRUCT','ENUM'].includes(t.type)){
      while(!this.check('EOF')&&!this.check('RBRACE')){
        if(this.check('LBRACE')){this.adv();this.skipBlock();break}
        this.adv()
      }
      return{type:'NilLit'}
    }
    return this.exprStmt()
  }
  private parseFn():ASTNode{
    const isAsync=this.match('ASYNC');this.expect('FN')
    const name=this.expect('IDENT').value
    const params:string[]=[]
    if(this.match('LPAREN')){
      while(!this.check('RPAREN')&&!this.check('EOF')){
        if(this.check('SPREAD'))this.adv()
        params.push(this.expect('IDENT').value)
        if(!this.match('COMMA'))break
      }
      this.expect('RPAREN')
    }
    this.expect('LBRACE')
    return{type:'FnDecl',name,params,body:this.block(),isAsync}
  }
  private parseReturn():ASTNode{
    this.expect('RETURN')
    if(this.check('RBRACE')||this.check('EOF'))return{type:'Return',value:null}
    return{type:'Return',value:this.expr()}
  }
  private parseSay():ASTNode{this.adv();return{type:'Say',value:this.expr()}}
  private parseIf():ASTNode{
    this.expect('IF');const cond=this.expr();this.expect('LBRACE');const then=this.block()
    const elifs:{cond:ASTNode;body:ASTNode[]}[]=[]
    let else_:ASTNode[]|null=null
    while(this.check('ELIF')){this.adv();const ec=this.expr();this.expect('LBRACE');elifs.push({cond:ec,body:this.block()})}
    if(this.match('ELSE')){this.expect('LBRACE');else_=this.block()}
    return{type:'If',cond,then,elifs,else_}
  }
  private parseFor():ASTNode{
    this.expect('FOR');const first=this.expect('IDENT').value
    let indexVar:string|null=null,iterVar=first
    if(this.match('COMMA')){indexVar=first;iterVar=this.expect('IDENT').value}
    this.expect('IN')
    const startExpr=this.addSub()
    if(this.check('DOTDOT')||this.check('DOTDOTEQ')){
      const inc=this.peek().type==='DOTDOTEQ';this.adv()
      const endExpr=this.addSub();this.expect('LBRACE')
      return{type:'ForRange',var:iterVar,start:startExpr,end:endExpr,inclusive:inc,body:this.block()}
    }
    this.expect('LBRACE')
    return{type:'ForIn',var:iterVar,indexVar,iter:startExpr,body:this.block()}
  }
  private parseTry():ASTNode{
    this.expect('TRY');this.expect('LBRACE');const try_=this.block()
    this.expect('CATCH');const catchVar=this.expect('IDENT').value;this.expect('LBRACE');const catch_=this.block()
    let finally_:ASTNode[]|null=null
    if(this.match('FINALLY')){this.expect('LBRACE');finally_=this.block()}
    return{type:'TryCatch',try_,catchVar,catch_,finally_}
  }
  private parseMatch():ASTNode{
    this.expect('MATCH');const value=this.expr();this.expect('LBRACE')
    const cases:{pattern:ASTNode|null;guard:ASTNode|null;body:ASTNode[]}[]=[]
    while(!this.check('RBRACE')&&!this.check('EOF')){
      this.expect('CASE')
      let pattern:ASTNode|null=null,guard:ASTNode|null=null
      if(this.check('IDENT')&&this.peek().value==='_')this.adv()
      else{
        pattern=this.expr()
        if(this.check('IDENT')&&this.peek().value==='if'){this.adv();guard=this.expr()}
      }
      this.expect('LBRACE');cases.push({pattern,guard,body:this.block()})
    }
    this.expect('RBRACE')
    return{type:'Match',value,cases}
  }
  private parseVarDecl():ASTNode{
    const mutable=this.match('MUT');if(!mutable)this.match('LET')
    const name=this.expect('IDENT').value
    if(this.match('COLON'))this.adv()
    this.expect('ASSIGN')
    return{type:'VarDecl',name,value:this.expr(),mutable,isConst:false}
  }
  private parseConst():ASTNode{
    this.expect('CONST');const name=this.expect('IDENT').value
    if(this.match('COLON'))this.adv()
    this.expect('WALRUS')
    return{type:'VarDecl',name,value:this.expr(),mutable:false,isConst:true}
  }
  private exprStmt():ASTNode{
    const e=this.expr()
    if(this.check('WALRUS')){
      this.adv();const val=this.expr()
      if(e.type==='Identifier')return{type:'VarDecl',name:e.name,value:val,mutable:false,isConst:false}
    }
    if(this.check('ASSIGN')){
      this.adv();const val=this.expr()
      if(e.type==='Identifier')return{type:'Assign',name:e.name,value:val}
      if(e.type==='Index')return{type:'IndexAssign',object:e.object,index:e.index,value:val}
      if(e.type==='MemberAccess')return{type:'IndexAssign',object:e.object,index:{type:'StringLit',value:e.property},value:val}
    }
    return e
  }
  private block():ASTNode[]{
    const s:ASTNode[]=[]
    while(!this.check('RBRACE')&&!this.check('EOF'))s.push(this.stmt())
    this.expect('RBRACE');return s
  }
  private skipBlock():void{
    let d=1
    while(d>0&&!this.check('EOF')){
      if(this.check('LBRACE'))d++
      if(this.check('RBRACE'))d--
      this.adv()
    }
  }
  private expr():ASTNode{return this.or()}
  private or():ASTNode{
    let l=this.and()
    while(this.check('OR')){this.adv();l={type:'BinOp',op:'or',left:l,right:this.and()}}
    return l
  }
  private and():ASTNode{
    let l=this.not_()
    while(this.check('AND')){this.adv();l={type:'BinOp',op:'and',left:l,right:this.not_()}}
    return l
  }
  private not_():ASTNode{
    if(this.check('NOT')){this.adv();return{type:'UnaryOp',op:'not',operand:this.not_()}}
    return this.cmp()
  }
  private cmp():ASTNode{
    let l=this.addSub()
    const ops=['EQ','NEQ','LT','GT','LTE','GTE'] as TT[]
    while(ops.includes(this.peek().type)){const op=this.adv().value;l={type:'BinOp',op,left:l,right:this.addSub()}}
    return l
  }
  private addSub():ASTNode{
    let l=this.mulDiv()
    while(this.check('PLUS')||this.check('MINUS')){const op=this.adv().value;l={type:'BinOp',op,left:l,right:this.mulDiv()}}
    return l
  }
  private mulDiv():ASTNode{
    let l=this.power()
    while(this.check('STAR')||this.check('SLASH')||this.check('PCT')){const op=this.adv().value;l={type:'BinOp',op,left:l,right:this.power()}}
    return l
  }
  private power():ASTNode{
    let l=this.unary()
    if(this.check('STARSTAR')){this.adv();return{type:'BinOp',op:'**',left:l,right:this.power()}}
    return l
  }
  private unary():ASTNode{
    if(this.check('MINUS')){this.adv();return{type:'UnaryOp',op:'-',operand:this.unary()}}
    if(this.check('NOT')){this.adv();return{type:'UnaryOp',op:'not',operand:this.unary()}}
    return this.postfix()
  }
  private postfix():ASTNode{
    let e=this.primary()
    while(true){
      if(this.check('DOT')){
        this.adv();const prop=this.expect('IDENT').value
        if(this.check('LPAREN')){this.adv();const args=this.args();e={type:'Call',callee:{type:'MemberAccess',object:e,property:prop},args}}
        else e={type:'MemberAccess',object:e,property:prop}
      }else if(this.check('LBRACK')){
        this.adv();const idx=this.expr();this.expect('RBRACK');e={type:'Index',object:e,index:idx}
      }else if(this.check('LPAREN')){
        this.adv();const args=this.args();e={type:'Call',callee:e,args}
      }else break
    }
    return e
  }
  private args():ASTNode[]{
    const a:ASTNode[]=[]
    while(!this.check('RPAREN')&&!this.check('EOF')){a.push(this.expr());if(!this.match('COMMA'))break}
    this.expect('RPAREN');return a
  }
  private primary():ASTNode{
    const t=this.peek()
    if(t.type==='NUM'){this.adv();return{type:'NumberLit',value:parseFloat(t.value)}}
    if(t.type==='BOOL'){this.adv();return{type:'BoolLit',value:t.value==='true'}}
    if(t.type==='NIL'){this.adv();return{type:'NilLit'}}
    if(t.type==='STR'){this.adv();return{type:'StringLit',value:t.value}}
    if(t.type==='LPAREN'){this.adv();const e=this.expr();this.expect('RPAREN');return e}
    if(t.type==='LBRACK'){
      this.adv();const els:ASTNode[]=[]
      while(!this.check('RBRACK')&&!this.check('EOF')){els.push(this.expr());if(!this.match('COMMA'))break}
      this.expect('RBRACK');return{type:'ArrayLit',elements:els}
    }
    if(t.type==='LBRACE'){
      this.adv();const pairs:{key:string;value:ASTNode}[]=[]
      while(!this.check('RBRACE')&&!this.check('EOF')){
        let key:string
        if(this.check('STR'))key=this.adv().value
        else key=this.expect('IDENT').value
        this.expect('COLON');const val=this.expr();pairs.push({key,value:val})
        if(!this.match('COMMA'))break
      }
      this.expect('RBRACE');return{type:'MapLit',pairs}
    }
    if(t.type==='FN'||(t.type==='ASYNC'&&this.peek(1).type==='FN')){
      const isAsync=this.match('ASYNC');this.expect('FN')
      const params:string[]=[]
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

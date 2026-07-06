'use strict';
// ============ MAIN: state machine, player, boss, HUD, menus, save ============
let st='title',frame=0,paused=false,sel=0,shake=0;
let fade={a:0,d:0,cb:null},msgQ=[],msg=null,banner=null,shopOpen=false,shopSel=0,mapOpen=false,questOpen=false,craftOpen=false,craftSel=0;
let bombs=[];
let cam={x:0,y:0};
let P,gems,coins,maxhp,hp,playT,deaths,SAVE={};
let gemT=0,winT=0,coinBump=0;
let boss=null,bullets=[],arena=null,bEn=[];
function blankSave(){return{chests:[],qon:[0,0,0,0,0],qdone:[0,0,0,0,0],qp:[0,0,0,0,0],dash:false,djump:false,rod:false,potion:false,charm:false,boots:false,sword:0,shards:0,pieces:0,fish:0,hero:false,done:false,heroDone:false,mats:{w:0,s:0,o:0,wl:0},bombs:0,tonics:0,planks:0,cloak:false,caves:[],blocks:0,seeds:0,crops:0,stews:0,pick:0,shield:0}}
function save(){try{localStorage.setItem('gembound3',JSON.stringify({gems,coins,maxhp,playT,deaths,S:SAVE}))}catch(e){}}
function hasSave(){try{return!!localStorage.getItem('gembound3')}catch(e){return false}}
function fadeTo(cb){if(fade.d)return;fade.d=1;fade.cb=cb}
function say(s){msgQ.push(s)}
const DIRV={up:[-.707,-.707],down:[.707,.707],left:[-.707,.707],right:[.707,-.707]};
// ---------- game flow ----------
function newGame(cont,hero){
 gems=[0,0,0,0,0,0,0,0];coins=0;maxhp=6;playT=0;deaths=0;SAVE=blankSave();
 if(cont){try{const s=JSON.parse(localStorage.getItem('gembound3'));gems=s.gems;coins=s.coins;maxhp=s.maxhp;playT=s.playT;deaths=s.deaths;SAVE=Object.assign(blankSave(),s.S)}catch(e){}}
 if(hero){SAVE.hero=true;gems=[0,0,0,0,0,0,0,0];toast('HERO MODE! FOES ARE FIERCE','#f66')}
 bombs=[];craftOpen=false;
 hp=maxhp;genOv();
 P={x:SPAWN.x*TS+5,y:SPAWN.y*TS+3,w:14,h:20,vx:0,vy:0,face:1,dir:'down',mov:0,inv:0,atk:0,coy:0,jb:0,onG:0,dashT:0,dashCd:0,land:0,blink:0,trail:[],jumps:0,dmg:SAVE.sword?2:1,arm:0};
 if(SAVE.shards>=12&&SAVE.gemblade)P.dmg=3;
 st='top';setTheme('ov');lastTrig=null;shopOpen=false;region='';
 if(!cont)say("WELCOME TO HAVEN VALE! VISIT THE|TRAINING GROVE 'O' NORTHWEST, AND|TALK TO VILLAGERS WITH E OR ENTER.")}
function dmg(n){if(P.inv>0||fade.d||P.dashT>0)return;
 if(SAVE.hero)n*=2;
 if(SAVE.shield>0){SAVE.shield=0;sfx('clank');ftxt(P.x+7,P.y-6,'SHIELDED!','#ffd75e');P.inv=40;return}
 if(SAVE.armor&&++P.arm%2==0){sfx('clank');ftxt(P.x+7,P.y-6,'BLOCKED','#aab');P.inv=30;return}
 hp-=n;P.inv=70;shake=6;sfx('hurt');puff(P.x+7,P.y+8,'#ff5555',9);
 if(hp<=0){if(SAVE.potion){SAVE.potion=false;hp=4;sfx('heal');ftxt(P.x+7,P.y-8,'POTION!','#8ff');puff(P.x+7,P.y+8,'#8ff',14);save();return}
  deaths++;fadeTo(()=>{st='top';setTheme('ov');hp=maxhp;coins=Math.max(0,coins-10);shopOpen=false;
  P.x=SPAWN.x*TS+5;P.y=SPAWN.y*TS+3;P.vx=P.vy=0;lastTrig='faint';say('YOU FAINTED AND DRIFTED HOME...|(-10 COINS)')})}}
function hurtCp(){dmg(1);if(hp>0){P.x=lvl.cp.x;P.y=lvl.cp.y;P.vx=0;P.vy=0;P.inv=70}}
function enterDungeon(i){sfx('door');fadeTo(()=>{curD=i;if(i<0)parseTut();else genLevel(i+1);st='side';setTheme('dun');
 banner={t:0,s:(i<0?TUTPAL:PALS[i]).name};cam.x=0})}
function exitToOv(pos){st='top';setTheme('ov');const d=pos||DOORS[curD];
 P.x=d[0]*TS+5;P.y=(d[1]+1)*TS+3;P.vx=P.vy=0;P.dir='down';lastTrig=null;banner={t:0,s:'OVERWORLD'};
 cam.x=isoX(P.x,P.y)-W/2;cam.y=isoY(P.x,P.y)-H/2}
function enterBoss(){sfx('door');fadeTo(()=>{st='boss';setTheme('boss');
 arena=Array.from({length:12},(_,y)=>Array.from({length:22},(_,x)=>(x==0||y==0||x==21||y==11||((x==5||x==16)&&(y==3||y==8)))?'#':'.'));
 P.x=11*TS;P.y=9*TS;P.vx=P.vy=0;P.dir='up';P.inv=60;hp=maxhp;
 boss={x:10*TS,y:2.5*TS,w:42,h:39,hp:60,mhp:60,st:'idle',t:80,vx:0,vy:0,ang:0,ihit:0,onG:0,phase:1};
 bullets=[];bEn=[];banner={t:0,s:'GEM GOLEM'};
 cam.x=isoX(11*TS,6*TS)-W/2;cam.y=isoY(11*TS,6*TS)-H/2+10})}
const arSolid=(x,y)=>arena[y]?arena[y][x]=='#':true;
// ---------- shared player ----------
function swordBox(){const r={x:P.x,y:P.y,w:22,h:22};
 if(st=='side'){r.x=P.face>0?P.x+P.w:P.x-22;r.y=P.y-2;r.h=24}
 else{const v=DIRV[P.dir];r.x=P.x+7+v[0]*19-11;r.y=P.y+10+v[1]*19-11}
 return r}
function uAtk(){if(P.atk>0)P.atk--;if(pAtk()&&P.atk<=0&&P.dashT<=0){P.atk=20;sfx('swing')}}
function tryDash(){if(SAVE.dash&&pDash()&&P.dashCd<=0){P.dashT=9;P.dashCd=45;sfx('dash');P.trail=[]}}
function topMove(solid,sp){
 const ix=(mvR()?1:0)-(mvL()?1:0),iy=(mvD()?1:0)-(mvU()?1:0);
 let dx=(ix+iy)*.707,dy=(iy-ix)*.707;
 if(P.dashT>0){P.dashT--;const v=DIRV[P.dir];dx=v[0]*2.6;dy=v[1]*2.6;
  if(frame%2==0)P.trail.push({x:P.x,y:P.y,l:12});sp=2.4}
 else{if(ix||iy){if(Math.abs(ix)>=Math.abs(iy))P.dir=ix>0?'right':'left';else P.dir=iy>0?'down':'up'}
  P.mov=!!(ix||iy)}
 if(P.dashCd>0)P.dashCd--;
 P.vx=dx*sp;P.vy=dy*sp;move(P,solid)}
function uTrail(){for(let i=P.trail.length;i--;){if(--P.trail[i].l<=0)P.trail.splice(i,1)}}
function collideAxis(o,solid,ax){
 const l=Math.floor(o.x/TS),r=Math.floor((o.x+o.w-1)/TS),tt=Math.floor(o.y/TS),b=Math.floor((o.y+o.h-1)/TS);
 for(let ty=tt;ty<=b;ty++)for(let tx=l;tx<=r;tx++)if(solid(tx,ty)){
  if(ax==0){if(o.vx>0){o.x=tx*TS-o.w;o.hit=1}else if(o.vx<0){o.x=(tx+1)*TS;o.hit=1}o.vx=0;return}
  else{if(o.vy>0){o.y=ty*TS-o.h;o.vy=0;o.onG=1}else if(o.vy<0){o.y=(ty+1)*TS;o.vy=0}return}}}
function move(o,solid){o.hit=0;o.x+=o.vx;collideAxis(o,solid,0);o.y+=o.vy;collideAxis(o,solid,1)}
// ---------- top-down enemies (uSlime lives in world.js) ----------
function uBeetle(b,solid,tgt){b.t+=.05;b.hurt>0&&b.hurt--;
 const sp2=SAVE.hero?1.35:1;
 if(b.st==0){if(Math.random()<.008){b.dx=Math.random()-.5;b.dy=Math.random()-.5}b.vx=b.dx*.4;b.vy=b.dy*.4;
  const ax=Math.abs(tgt.x-b.x),ay=Math.abs(tgt.y-b.y);
  if((ax<14&&ay<170)||(ay<14&&ax<170)){b.st=1;b.t2=22;
   if(ax<14){b.cdy=Math.sign(tgt.y-b.y);b.cdx=0}else{b.cdx=Math.sign(tgt.x-b.x);b.cdy=0}}}
 else if(b.st==1){b.vx=0;b.vy=0;if(--b.t2<=0){b.st=2;b.t2=55;sfx('dash')}}
 else{b.vx=b.cdx*3.9*sp2;b.vy=b.cdy*3.9*sp2;move(b,solid);if(b.hit||--b.t2<=0){b.st=0;if(b.hit){shake=Math.max(shake,3);puff(b.x+9,b.y+7,'#caa',6)}}return}
 move(b,solid)}
function hitEnemies(list,killcb){if(P.atk<7||P.atk>15)return;const sb=swordBox();
 for(const s of list){if(s.hp>0&&s.hurt<=0&&ovl(sb,s)){
  if(s.kind=='knight'&&st=='side'&&((P.face>0&&P.x<s.x)||(P.face<0&&P.x>s.x))&&false){}
  s.hp-=P.dmg;s.hurt=18;sfx(s.hp<=0?'kill':'stomp');
  const a=Math.atan2(s.y-P.y,s.x-P.x);s.kx=Math.cos(a)*4.5;s.ky=Math.sin(a)*4.5;
  puff(s.x+8,s.y+6,'#aef',5);
  if(s.hp<=0){puff(s.x+8,s.y+6,'#7c7',10);const dr=SAVE.charm?2:Math.random()<.5?2:0;
   if(dr){coins+=dr;coinBump=10;ftxt(s.x+8,s.y,'+'+dr,'#ffd700');sfx('coin')}if(killcb)killcb(s)}}}}
// ---------- states ----------
function uMsg(){if(msg.i<msg.s.length){msg.i+=1.6;if(frame%3==0)sfx('msg');if(pOk())msg.i=msg.s.length}
 else if(pOk()){msg=null;sfx('sel')}}
function uTitle(){const opts=titleOpts();
 if(prs('ArrowUp','KeyW')){sel=(sel+opts.length-1)%opts.length;sfx('msg')}
 if(prs('ArrowDown','KeyS')){sel=(sel+1)%opts.length;sfx('msg')}
 if(prs('Enter','Space','KeyZ')){sfx('sel');const o=opts[sel];
  fadeTo(()=>newGame(o.k=='cont',o.k=='hero'))}}
function titleOpts(){const o=[{k:'new',s:'NEW GAME'}];
 if(hasSave()){o.push({k:'cont',s:'CONTINUE'});
  try{const s=JSON.parse(localStorage.getItem('gembound3'));if(s.S&&s.S.done)o.push({k:'hero',s:'HERO MODE'+(s.S.heroDone?' *':'')})}catch(e){}}
 return o}
const SHOPITEMS=[
 {n:'HEART CONTAINER',c:30,d:'MAX HEALTH +1 HEART',own:()=>maxhp>=16,buy:()=>{maxhp+=2;hp=maxhp}},
 {n:'LIFE POTION',c:20,d:'AUTO-REVIVE WHEN FAINTING',own:()=>SAVE.potion,buy:()=>SAVE.potion=true},
 {n:'LUCKY CHARM',c:25,d:'FOES ALWAYS DROP COINS',own:()=>SAVE.charm,buy:()=>SAVE.charm=true},
 {n:'SWIFT BOOTS',c:30,d:'MOVE 12 PERCENT FASTER',own:()=>SAVE.boots,buy:()=>SAVE.boots=true},
 {n:'IRON ARMOR',c:35,d:'BLOCKS EVERY OTHER HIT',own:()=>SAVE.armor,buy:()=>SAVE.armor=true},
 {n:'GEM BLADE',c:0,sh:12,d:'12 SHARDS: SWORD DMG 3',own:()=>SAVE.gemblade,buy:()=>{SAVE.gemblade=true;P.dmg=3}},
 {n:'WHEAT SEEDS X3',c:5,d:'PLANT AT THE FARM PLOT (E)',own:()=>false,buy:()=>SAVE.seeds+=3}];
function uShop(){const n=SHOPITEMS.length+1;
 if(prs('ArrowUp','KeyW')){shopSel=(shopSel+n-1)%n;sfx('msg')}
 if(prs('ArrowDown','KeyS')){shopSel=(shopSel+1)%n;sfx('msg')}
 if(prs('Escape')){shopOpen=false;return}
 if(prs('Enter','KeyZ','KeyX','Space')){
  if(shopSel==n-1){shopOpen=false;sfx('sel');return}
  const it=SHOPITEMS[shopSel];
  if(it.own()){sfx('deny');ftxt(P.x+7,P.y-8,'OWNED!','#f88')}
  else if(it.sh?SAVE.shards<it.sh:coins<it.c){sfx('deny');ftxt(P.x+7,P.y-8,it.sh?'NEED SHARDS!':'NEED COINS!','#f88')}
  else{if(it.sh)SAVE.shards-=it.sh;else coins-=it.c;sfx('buy');puff(P.x+7,P.y,'#ffd700',10);it.buy();save()}}}
function dShop(){px(W/2-130,26,260,196,'rgba(12,10,20,.95)');g.strokeStyle='#c9a86a';g.strokeRect(W/2-129.5,26.5,259,195);
 T('SLIME MART',W/2,34,'#ffd75e',2,'center');
 T("'BUY SOMETHING, WON'T YOU?'",W/2,50,'#8890b0',1,'center');
 SHOPITEMS.forEach((it,i)=>{const y=62+i*18,on=shopSel==i,owned=it.own();
  if(on){px(W/2-124,y-3,248,15,'rgba(255,215,94,.12)');T('>',W/2-120,y,'#ffd75e')}
  T(it.n,W/2-110,y,owned?'#667':on?'#fff':'#aab');
  T(owned?'OWNED':it.sh?it.sh+' SH':it.c+'C',W/2+114,y,owned?'#667':(it.sh?SAVE.shards>=it.sh:coins>=it.c)?'#ffd700':'#f88',1,'right');
  if(on)T(it.d,W/2-110,y+8,'#7a86a8')});
 const on=shopSel==SHOPITEMS.length;if(on){px(W/2-124,62+SHOPITEMS.length*18-3,248,13,'rgba(255,215,94,.12)');T('>',W/2-120,62+SHOPITEMS.length*18,'#ffd75e')}
 T('LEAVE',W/2-110,62+SHOPITEMS.length*18,on?'#fff':'#aab');
 T('COINS '+coins+'  SHARDS '+SAVE.shards,W/2,212,'#ffe66e',1,'center')}
function uGem(){gemT++;if(gemT==130)fadeTo(()=>exitToOv())}
// ---------- final boss (2 phases) ----------
function uBoss(){playT++;topMove(arSolid,2.3);uAtk();tryDash();uTrail();P.inv>0&&P.inv--;
 const B=boss,pcx=P.x+7,pcy=P.y+10,bcx=B.x+21,bcy=B.y+19;
 const sp2=(SAVE.hero?1.25:1)*(B.phase==2?1.3:1);
 if(B.st!='dead'){B.t--;B.ihit>0&&B.ihit--;
  const phase=B.hp>B.mhp*.66?0:B.hp>B.mhp*.33?1:2;
  if(B.st=='idle'){B.x+=clamp(pcx-bcx,-1,1)*.5;B.y+=Math.sin(frame/20)*.4;
   B.x=clamp(B.x,TS+2,20*TS-B.w);B.y=clamp(B.y,TS+2,10*TS-B.h);
   if(B.t<=0){const r=Math.random();
    if(B.phase==2&&r<.3){B.st='ring';B.t=10}
    else if(phase==2&&bEn.length<3&&r<.25){B.st='summon';B.t=40}
    else if(phase>=1&&r<.45){B.st='ctel';B.t=34}
    else if(phase>=1&&r<.7){B.st='spiral';B.t=64}
    else{B.st='aim';B.t=30}}}
  else if(B.st=='aim'){if(B.t<=0){sfx('shot');const a=Math.atan2(pcy-bcy,pcx-bcx);
   for(let i=-2;i<=2;i++){const an=a+i*.22;bullets.push({x:bcx,y:bcy,vx:Math.cos(an)*2.55*sp2,vy:Math.sin(an)*2.55*sp2})}
   B.st='idle';B.t=68-phase*14}}
  else if(B.st=='spiral'){if(B.t%5==0){B.ang+=.55;sfx('shot');
   bullets.push({x:bcx,y:bcy,vx:Math.cos(B.ang)*2.1*sp2,vy:Math.sin(B.ang)*2.1*sp2});
   bullets.push({x:bcx,y:bcy,vx:-Math.cos(B.ang)*2.1*sp2,vy:-Math.sin(B.ang)*2.1*sp2})}
   if(B.t<=0){B.st='idle';B.t=60}}
  else if(B.st=='ring'){if(B.t<=0){sfx('shot');for(let i=0;i<10;i++){const an=i*.628+frame*.01;
   bullets.push({x:bcx,y:bcy,vx:Math.cos(an)*1.9,vy:Math.sin(an)*1.9})}
   B.st='idle';B.t=55}}
  else if(B.st=='ctel'){shake=Math.max(shake,2);if(B.t<=0){const a=Math.atan2(pcy-bcy,pcx-bcx);
   B.vx=Math.cos(a)*5.4*sp2;B.vy=Math.sin(a)*5.4*sp2;B.st='charge';B.t=80;sfx('swing')}}
  else if(B.st=='charge'){move(B,arSolid);if(B.hit||B.t<=0){B.st='stun';B.t=B.phase==2?70:95;shake=8;sfx('boom');puff(bcx,bcy,'#ccc',16,3.4)}}
  else if(B.st=='stun'){if(B.t<=0){B.st='idle';B.t=50}}
  else if(B.st=='summon'){if(B.t<=0){for(let i=0;i<2;i++)bEn.push(mkSlime(bcx-8+i*16,bcy+26));sfx('kill');B.st='idle';B.t=70}}
  if(P.atk>=7&&P.atk<=15&&B.ihit<=0&&ovl(swordBox(),B)){
   const d=(B.st=='stun'?2:1)*P.dmg;B.hp-=d;B.ihit=14;sfx('stomp');puff(bcx,bcy,'#fff',6);ftxt(bcx,B.y-6,'-'+d,'#ff8');
   if(B.hp<=0){
    if(B.phase==1){B.phase=2;B.hp=B.mhp=50;B.st='idle';B.t=70;B.ihit=50;bullets=[];
     shake=10;sfx('boom');puff(bcx,bcy,'#ff8',30,4);banner={t:0,s:'THE CORE AWAKENS'};toast('PHASE 2!','#f66')}
    else{B.st='dead';B.t=150;setTheme(null);sfx('boom');bullets=[];bEn=[]}}}
  if(P.inv<=0&&P.dashT<=0&&ovl(P,B))dmg(1);
 }else{shake=3;if(B.t%12==0){puff(B.x+Math.random()*42,B.y+Math.random()*38,['#fff','#ff8','#f66'][B.t%3],10,3);sfx('kill')}
  if(--B.t<=0){SAVE.done=true;if(SAVE.hero)SAVE.heroDone=true;save();fadeTo(()=>{st='win';winT=0;setTheme('title')})}}
 for(let i=bullets.length;i--;){const b=bullets[i];b.x+=b.vx;b.y+=b.vy;
  if(arSolid(Math.floor(b.x/TS),Math.floor(b.y/TS))){puff(b.x,b.y,'#f7a',3,1);bullets.splice(i,1);continue}
  if(P.inv<=0&&P.dashT<=0&&b.x>P.x-3&&b.x<P.x+17&&b.y>P.y-3&&b.y<P.y+22){dmg(1);bullets.splice(i,1)}}
 for(const s of bEn){if(s.hp<=0)continue;uSlime(s,arSolid,P);if(s.hurt<=0&&P.inv<=0&&P.dashT<=0&&ovl(P,s))dmg(1)}
 hitEnemies(bEn.filter(s=>s.hp>0))}
function dBoss(){
 const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,boss.phase==2?'#200a14':'#140a10');gr.addColorStop(1,boss.phase==2?'#48141e':'#2c1220');g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.save();g.translate(-(cam.x|0)+(shake?(Math.random()*shake-shake/2)|0:0),-(cam.y|0)+(shake?(Math.random()*shake-shake/2)|0:0));
 const list=[];
 for(let ty=0;ty<12;ty++)for(let tx=0;tx<22;tx++){
  const cx=isoX(tx*TS,ty*TS)+12,cy=isoY(tx*TS,ty*TS)+12;
  if(arena[ty][tx]=='#')list.push({d:(tx+ty)*TS+TS,f:()=>isoBlock(cx,cy,20,'#5c4454','#4a3644','#3b2b36')});
  else{diamond(cx,cy,(tx+ty)%2?'#6b4a5e':'#734f65');if(hash(tx,ty)<.15)px(cx-4,cy-2,6,3,'rgba(0,0,0,.18)')}}
 const B=boss;
 if(B.st!='dead'||B.t>0){const bsx=isoX(B.x+21,B.y+19),bsy=isoY(B.x+21,B.y+19);
  list.push({d:B.x+B.y+40,f:()=>{
   g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(bsx,bsy+6,20,8,0,0,7);g.fill();
   const fl=(B.ihit>0||B.st=='ctel')&&(frame>>1)&1;
   const bod=fl?'#fff':B.st=='stun'?'#7a7a88':B.phase==2?'#4a3a50':'#5c5c6e';
   const bo=B.st=='stun'?3:Math.sin(frame/12)*3,x=bsx-21,y=bsy-45+bo;
   px(x+3,y+6,36,27,bod);px(x+7,y,28,9,bod);px(x,y+12,6,15,bod);px(x+36,y+12,6,15,bod);
   px(x+6,y+33,9,8,bod);px(x+27,y+33,9,8,bod);
   const gc=B.phase==2?['#ff5577','#ffe66e'][(frame>>3)&1]:PALS[(frame>>4)%8].gem;
   const gs=B.phase==2?4:0;px(x+16-gs/2,y+15-gs/2,9+gs,10+gs,gc);px(x+18,y+17,3,3,'#fff');
   const ex=clamp(Math.sign(P.x-B.x),-1,1);
   if(B.st=='stun')T('X X',x+21,y+3,'#111',1,'center');
   else{px(x+12+ex,y+4,4,4,B.phase==2?'#ffe66e':'#ff3344');px(x+26+ex,y+4,4,4,B.phase==2?'#ffe66e':'#ff3344')}
   if(B.phase==2){for(let i=0;i<3;i++)px(x+8+i*11,y+8+(i%2)*16,2,8,'#ff5577')}
   if(B.hp<B.mhp*.5){px(x+9,y+12,2,9,'#2c2c36');px(x+30,y+18,2,7,'#2c2c36')}}})}
 for(const s of bEn)if(s.hp>0){const sx=isoX(s.x+8,s.y+6),sy=isoY(s.x+8,s.y+6);
  list.push({d:s.x+s.y,f:()=>{g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(sx,sy+5,8,3.5,0,0,7);g.fill();drawSlime(sx-8,sy-9,s)}})}
 for(const b of bullets){const sx=isoX(b.x,b.y),sy=isoY(b.x,b.y);
  list.push({d:b.x+b.y,f:()=>{g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(sx,sy+4,4,2,0,0,7);g.fill();
   px(sx-3,sy-11,6,6,boss.phase==2?'#ffe66e':'#ff77aa');px(sx-1,sy-9,3,3,'#fff')}})}
 list.push({d:P.x+P.y+20,f:()=>drawHeroIso(isoX(P.x+7,P.y+10),isoY(P.x+7,P.y+10)+5)});
 list.sort((a,b)=>a.d-b.d);for(const it of list)it.f();
 dParts(true);g.restore();hud();
 px(W/2-82,H-16,164,9,'#20101a');px(W/2-80,H-14,160*Math.max(0,boss.hp)/boss.mhp,5,boss.phase==2?'#f6c':'#e33');px(W/2-80,H-14,160*Math.max(0,boss.hp)/boss.mhp,2,'#f9a');
 T('GEM GOLEM'+(boss.phase==2?' - CORE':''),W/2,H-25,'#fbb',1,'center')}
// ---------- win/gem/hud ----------
function uWin(){winT++;if(winT%5==0)parts.push({x:Math.random()*W,y:-4,vx:(Math.random()-.5),vy:1.4+Math.random(),life:150,c:['#f66','#6f6','#66f','#ff6','#f6f'][Math.random()*5|0],s:2});
 if(winT>90&&pOk()){fadeTo(()=>{st='title';sel=0})}}
function dGem(){const pal=lvl.pal;dSideBg(pal);
 g.fillStyle='rgba(0,0,0,.55)';g.fillRect(0,0,W,H);
 const y=155-Math.min(gemT,40)*1.8;
 for(let i=0;i<10;i++){const a=frame/14+i*.628;px(W/2+Math.cos(a)*(38+Math.sin(frame/9)*6)-1,y+10+Math.sin(a)*38-1,3,3,'#fff')}
 g.save();g.translate(W/2-12,y);g.scale(6,6);drawGemIcon(0,0,pal.gem);g.restore();
 if(gemT>35){T('GEM GET!',W/2,92,'#fff',4,'center');
  T(pal.name+' CLEARED - '+gems.reduce((a,b)=>a+b,0)+'/8 GEMS',W/2,222,'#ffd',1,'center')}}
function hud(){const low=hp<=2;
 px(2,2,4+Math.ceil(maxhp/2)*9,12,'rgba(0,0,0,.3)');
 for(let i=0;i<maxhp/2;i++)drawHeart(6+i*9,5,hp>=i*2+2?2:hp==i*2+1?1:0,low);
 for(let i=0;i<8;i++){if(gems[i]){const gy2=4+Math.sin(frame/10+i);drawGemIcon(W/2-38+i*10,gy2,PALS[i].gem)}else{g.fillStyle='rgba(255,255,255,.18)';g.fillRect(W/2-38+i*10,4,4,4)}}
 const cb=coinBump>5?coinBump-5:0;
 px(W-46,5-cb,5,5,'#ffd700');px(W-45,6-cb,1,1,'#fff');T(coins,W-38,5,'#fff');
 px(W-70,5,4,6,'#ffe66e');T(SAVE.shards,W-64,5,'#ffe66e');
 if(SAVE.dash){const rd=P.dashCd<=0;px(W-46,14,5,5,rd?'#7fe3a0':'#3a4a40')}
 if(SAVE.potion){px(W-56,13,5,7,'#d33');px(W-55,12,3,2,'#8ff')}
 if(SAVE.hero)T('HERO',W-4,H-8,'#f66',1,'right');
 if(muted)T('MUTE',W-4,H-16,'#888',1,'right');
 // materials row
 const M=SAVE.mats;
 px(2,16,110,10,'rgba(0,0,0,.3)');
 [['#a8703f',M.w],['#8a8a96',M.s],['#b8c4d0',M.o],['#eee6da',M.wl]].forEach((m,i)=>{px(6+i*27,18,6,6,m[0]);px(6+i*27,18,6,2,'rgba(255,255,255,.3)');T(m[1],15+i*27,19,'#dfe4f0')});
 if(SAVE.bombs>0){drawBombSpr(W-42,25,99);T('X'+SAVE.bombs,W-36,22,'#fbb')}
 if(SAVE.tonics>0){px(W-58,21,5,7,'#d33');px(W-57,20,3,2,'#8ff');T(SAVE.tonics,W-51,22,'#8ff')}
 if(SAVE.stews>0){px(W-74,22,7,5,'#b3763a');px(W-73,21,5,2,'#ffd75e');T(SAVE.stews,W-65,22,'#ffd75e')}
 if(SAVE.shield>0){px(W-86,21,7,8,'#ffd75e');px(W-85,22,5,6,'#8a6a1e');px(W-84,24,3,2,'#ffd75e')}
 let hx=6;const row2=[];
 if(SAVE.blocks>0)row2.push(['#9a9aa8',SAVE.blocks]);
 if(SAVE.seeds>0)row2.push(['#7dbf5e',SAVE.seeds]);
 if(SAVE.crops>0)row2.push(['#ffd75e',SAVE.crops]);
 if(SAVE.planks>0)row2.push(['#c9a86a',SAVE.planks]);
 if(row2.length){px(2,27,4+row2.length*27,10,'rgba(0,0,0,.3)');
  row2.forEach((m,i)=>{px(6+i*27,29,6,6,m[0]);T(m[1],15+i*27,30,'#dfe4f0')})}
 if(SAVE.pick>0)T(SAVE.pick>1?'IRON PICK':'STONE PICK',6,40,'#8a95a5')}
function dTitle(){
 const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#141a33');gr.addColorStop(1,'#3c2a4d');g.fillStyle=gr;g.fillRect(0,0,W,H);
 for(let i=0;i<60;i++){const tw=hash(i,9)*99;px(hash(i,1)*W,hash(i,2)*150,1,1,(frame/8+tw)%9<5?'#fff':'#667')}
 const ix2=W-85,iy2=175+Math.sin(frame/40)*4;
 for(let ty=0;ty<3;ty++)for(let tx=0;tx<3;tx++){const cx=ix2+(tx-ty)*24,cy=iy2+(tx+ty)*12-24;
  isoBlock(cx,cy,16,'#3e8948','#5a4030','#453022')}
 drawTreeG(ix2-48,iy2+3,1,2,0);
 const savedP=P;P={dir:'down',mov:0,blink:frame%180<6?4:0,atk:0,inv:0,trail:[],x:0,y:0,dashT:0};
 drawHeroIso(ix2+14,iy2+3);P=savedP;
 for(let i=0;i<8;i++)drawGemIcon(W/2-72+i*19,32+Math.sin(frame/16+i)*4,PALS[i].gem,true);
 T('GEMBOUND',W/2+3,63,'#5a3a10',6,'center');T('GEMBOUND',W/2,60,'#ffd75e',6,'center');
 T('III',W/2+130,54,'#fff',2,'center');
 T('THE GOLDEN GATE',W/2,102,'#9aa5c9',1,'center');
 const opts=titleOpts();
 opts.forEach((o,i)=>{const y=128+i*14;
  if(sel==i){T('>',W/2-56,y,'#ffd75e');T(o.s,W/2,y,'#fff',1,'center')}
  else T(o.s,W/2,y,'#8890b0',1,'center')});
 T('ARROWS/WASD MOVE - SPACE/Z JUMP - X/J SWORD - C DASH - E TALK',W/2,248,'#667',1,'center');
 T('R CRAFT - B BOMB - G BUILD - H DRINK - TAB MAP - Q QUESTS - P PAUSE - M MUTE',W/2,257,'#667',1,'center');
 if((frame>>5)&1)T('- PRESS ENTER -',W/2,205,'#cfd8dc',1,'center');
 dParts()}
function dWin(){const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#1a2447');gr.addColorStop(1,'#5e3a63');g.fillStyle=gr;g.fillRect(0,0,W,H);
 dParts();
 T('YOU ARE GEMBOUND',W/2,52,'#ffd75e',3,'center');
 T(SAVE.hero?'EVEN IN HERO MODE. LEGENDARY.':'THE GOLEM CRUMBLES. LIGHT RETURNS TO THE REALM.',W/2,82,'#cfd8dc',1,'center');
 for(let i=0;i<8;i++)drawGemIcon(W/2-72+i*19,98+Math.sin(frame/12+i)*3,PALS[i].gem,true);
 const m=Math.floor(playT/3600),s=Math.floor(playT/60)%60;
 T('TIME '+m+'M '+(s<10?'0':'')+s+'S    COINS '+coins+'    FAINTS '+deaths,W/2,136,'#fff',1,'center');
 T('SHARDS '+SAVE.shards+'/30   FISH '+SAVE.fish+'   QUESTS '+SAVE.qdone.filter(q=>q).length+'/5',W/2,150,'#ffe66e',1,'center');
 if(!SAVE.hero)T('HERO MODE UNLOCKED AT THE TITLE!',W/2,176,'#f66',1,'center');
 T('THANKS FOR PLAYING!',W/2,198,'#9aa5c9',1,'center');
 if(winT>90&&(frame>>5)&1)T('- ENTER -',W/2,224,'#cfd8dc',1,'center')}
function dMsgBox(){px(14,H-62,W-28,50,'rgba(10,10,20,.93)');
 g.strokeStyle='#8890b0';g.strokeRect(14.5,H-61.5,W-29,49);px(14,H-62,W-28,1,'#c9cfe8');
 const lines=msg.s.split('|');let shown=msg.i|0;
 lines.forEach((ln,i)=>{if(shown<=0)return;T(ln.slice(0,shown),24,H-54+i*12,'#fff');shown-=ln.length});
 if(msg.i>=msg.s.length&&(frame>>4)&1)T('~',W-30,H-20,'#ffd75e')}
// ---------- master update/draw ----------
function update(){frame++;
 if(fade.d==1){fade.a+=.06;if(fade.a>=1){fade.a=1;const cb=fade.cb;fade.cb=null;fade.d=-1;cb&&cb()}}
 else if(fade.d==-1){fade.a-=.06;if(fade.a<=0){fade.a=0;fade.d=0}}
 shake*=.85;if(shake<.3)shake=0;
 if(coinBump>0)coinBump--;
 musTick();uParts();
 if(banner&&++banner.t>150)banner=null;
 if(!msg&&msgQ.length)msg={s:msgQ.shift(),i:0};
 if(prs('Tab')&&(st=='top'||st=='side')){mapOpen=!mapOpen;questOpen=false;sfx('sel')}
 if(prs('KeyQ')&&(st=='top'||st=='side')){questOpen=!questOpen;mapOpen=false;craftOpen=false;sfx('sel')}
 if(prs('KeyR')&&!msg&&(st=='top'||st=='side'||st=='cave')){craftOpen=!craftOpen;mapOpen=questOpen=false;sfx('sel')}
 if(prs('KeyH')&&hp>0){if(SAVE.tonics>0&&hp<maxhp){SAVE.tonics--;hp=Math.min(maxhp,hp+4);sfx('heal');puff(P.x+7,P.y+8,'#8ff',10);toast('TONIC! +4 HP','#8ff');save()}
  else if(SAVE.stews>0){SAVE.stews--;hp=maxhp;SAVE.shield=1;sfx('heal');puff(P.x+7,P.y+8,'#ffd75e',12);toast('STEW! FULL HP + SHIELD','#ffd75e');save()}}
 if(prs('KeyB')&&!craftOpen&&!paused)tryBomb();
 if(prs('KeyG')&&!craftOpen&&!paused&&st=='top')tryBuild();
 if(prs('KeyP','Escape')&&!shopOpen&&!mapOpen&&!questOpen&&!craftOpen&&(st=='top'||st=='side'||st=='boss'||st=='cave'))paused=!paused;
 if(prs('Escape')){mapOpen=false;questOpen=false;craftOpen=false}
 if(msg&&st!='title')uMsg();
 else if(craftOpen)uCraft();
 else if(paused||mapOpen||questOpen){}
 else if(!fade.d||st=='gem'||st=='win'){
  if(st=='title')uTitle();else if(st=='top')uTop();else if(st=='side')uSide();
  else if(st=='gem')uGem();else if(st=='boss')uBoss();else if(st=='win')uWin();else if(st=='fish')uFish();else if(st=='cave')uCave()}
 Kp={}}
function draw(){g.imageSmoothingEnabled=false;g.clearRect(0,0,W,H);
 if(st=='title')dTitle();else if(st=='top')dOverworld();else if(st=='side')dSide();
 else if(st=='gem')dGem();else if(st=='boss')dBoss();else if(st=='win')dWin();else if(st=='fish')dFish();else if(st=='cave')dCave();
 if(craftOpen)dCraft();
 if(banner){const a=banner.t<20?banner.t/20:banner.t>110?(150-banner.t)/40:1;
  g.globalAlpha=clamp(a,0,1);px(0,36,W,16,'rgba(0,0,0,.55)');T('- '+banner.s+' -',W/2,42,'#ffd75e',1,'center');g.globalAlpha=1}
 dToasts();
 if(msg&&st!='title')dMsgBox();
 if(mapOpen)dMap();if(questOpen)dQuests();
 if(paused){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,0,W,H);
  T('PAUSED',W/2,100,'#fff',3,'center');
  T('P RESUME - M MUTE - TAB MAP - Q QUESTS - R CRAFT',W/2,134,'#cfd8dc',1,'center')}
 if(fade.a>0){g.fillStyle='#000';const r=(1-fade.a)*Math.hypot(W,H)/2;
  g.beginPath();g.rect(0,0,W,H);g.arc(W/2,H/2,Math.max(0,r),0,6.29,true);g.fill()}}
// ---------- boot ----------
prerender();
let acc=0,last=performance.now();
function loop(ts){requestAnimationFrame(loop);acc+=Math.min(60,ts-last);last=ts;
 let n=0;while(acc>=16.66&&n++<4){update();acc-=16.66}draw()}
requestAnimationFrame(loop);
setTheme('title');
// ============ v4: bombs & crafting ============
function tryBomb(){if(SAVE.bombs<=0||!(st=='top'||st=='side'||st=='cave'))return;
 SAVE.bombs--;sfx('msg');bombs.push({x:P.x+7,y:P.y+(st=='side'?16:10),t:100,mode:st});save()}
function uBombs(mode){for(let i=bombs.length;i--;){const bm=bombs[i];if(bm.mode!=mode)continue;
 if(--bm.t>0)continue;
 bombs.splice(i,1);sfx('boom');shake=9;
 const R2=54;puff(bm.x,bm.y,'#ff8',18,3.8);puff(bm.x,bm.y,'#fff',10,2.2);puff(bm.x,bm.y,'#f80',8,3);
 const near=(x,y)=>Math.hypot(x-bm.x,y-bm.y)<R2;
 if(near(P.x+7,P.y+10))dmg(1);
 if(mode=='top'){
  const tx0=Math.floor((bm.x-R2)/TS),tx1=Math.floor((bm.x+R2)/TS),ty0=Math.floor((bm.y-R2)/TS),ty1=Math.floor((bm.y+R2)/TS);
  for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){if(!near(tx*TS+12,ty*TS+12))continue;
   const c=ovGet(tx,ty),k=tx+','+ty;
   if(c=='K'){const isCave=KROCKS.slice(0,3).some(p=>p[0]==tx&&p[1]==ty);
    ov[ty][tx]=isCave?'V':'.';SAVE.caves.push(k);SAVE.mats.s+=2;
    toast(isCave?'A CAVE IS REVEALED!':'BOULDER GONE! +2 STONE','#c9a86a');save()}
   else if(NODE_HP[c]){ov[ty][tx]='.';respawns.push({x:tx,y:ty,c,t:2400});
    const mat=c=='T'?'w':c=='R'?'s':'o';SAVE.mats[mat]+=2;delete ovNode[k];
    ftxt(tx*TS+12,ty*TS,'+2','#e8c25a')}}
  for(const s of ovEn)if(s.hp>0&&s.kind!='sheep'&&near(s.x+8,s.y+6)){s.hp-=3;s.hurt=20;if(s.hp<=0)puff(s.x+8,s.y+6,'#7c7',10)}}
 else if(mode=='cave'){
  for(let ty=0;ty<cave.h;ty++)for(let tx=0;tx<cave.w;tx++)
   if(cave.t[ty][tx]=='W'&&near(tx*TS+12,ty*TS+12)){cave.t[ty][tx]='.';SAVE.mats.o++;ftxt(tx*TS+12,ty*TS,'+1 ORE','#cfd8e8')}
  for(const s of caveEn)if(s.hp>0&&near(s.x+8,s.y+6)){s.hp-=3;s.hurt=20}
  save()}
 else{
  const tx0=Math.floor((bm.x-R2)/TS),tx1=Math.floor((bm.x+R2)/TS),ty0=Math.max(0,Math.floor((bm.y-R2)/TS)),ty1=Math.min(lvl.h-1,Math.floor((bm.y+R2)/TS));
  for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){if(tx<0||tx>=lvl.w||!near(tx*TS+12,ty*TS+12))continue;
   const c=lvl.t[ty][tx];
   if(c=='K'){lvl.t[ty][tx]=' ';coins+=5;SAVE.shards++;coinBump=10;
    toast('SECRET STASH! +5C +1 SHARD','#ffd700');puff(tx*TS+12,ty*TS+12,'#ffd700',10);save()}
   else if(c=='p'){lvl.t[ty][tx]=' ';coins+=2;puff(tx*TS+12,ty*TS+12,'#c96',8)}}
  for(const e of lvl.en)if(e.hp>0&&near(e.x+8,e.y+7)){e.hp-=3;e.hurt=20}
  for(const bt of lvl.bats)if(!bt.dead&&near(bt.x+7,bt.y+5)){bt.dead=1;puff(bt.x+7,bt.y+5,'#a8f',8)}
  for(const gh of lvl.ghosts)if(!gh.dead&&near(gh.x+8,gh.y+8)){gh.hp-=3;if(gh.hp<=0){gh.dead=1;puff(gh.x+8,gh.y+8,'#cfd6ff',10)}}
  const B=lvl.mb;if(B&&B.hp>0&&near(B.x+B.w/2,B.y+B.h/2)){B.hp-=3;B.hurt=20;ftxt(B.x+B.w/2,B.y-8,'-3','#ff8')}}}}
function dBombsList(list){for(const bm of bombs){if(bm.mode=='side')continue;
 const sx=isoX(bm.x,bm.y),sy=isoY(bm.x,bm.y);
 list.push({d:bm.x+bm.y,f:()=>{g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(sx,sy+3,6,2.5,0,0,7);g.fill();drawBombSpr(sx,sy-6,bm.t)}})}}
const MATN={w:'WOOD',s:'STONE',o:'ORE',wl:'WOOL',crops:'WHEAT'};
const RECIPES=[
 {n:'BOMB',cost:{w:2,s:1},d:'BLASTS CRACKED ROCK - B TO USE',give:()=>SAVE.bombs++,max:()=>SAVE.bombs>=5?'MAX 5':null},
 {n:'TONIC',cost:{w:1,wl:1},d:'HEALS 4 HP - PRESS H TO DRINK',give:()=>SAVE.tonics++,max:()=>SAVE.tonics>=3?'MAX 3':null},
 {n:'PLANK',cost:{w:3},d:'BRIDGES WATER - E AT THE SHORE',give:()=>SAVE.planks++,max:()=>SAVE.planks>=4?'MAX 4':null},
 {n:'WOOL CLOAK',cost:{wl:4},d:'PERMANENT +1 HEART (ONCE)',give:()=>{SAVE.cloak=true;maxhp+=2;hp=maxhp},max:()=>SAVE.cloak?'OWNED':null},
 {n:'STONE BLOCK',cost:{s:2},d:'BUILD A WALL - G TO PLACE',give:()=>SAVE.blocks++,max:()=>SAVE.blocks>=10?'MAX 10':null},
 {n:'STONE PICK',cost:{s:3,w:1},d:'MINE AND CHOP TWICE AS FAST',give:()=>SAVE.pick=1,max:()=>SAVE.pick>=1?'OWNED':null},
 {n:'IRON PICK',cost:{o:3,w:1},d:'FASTER STILL - MINES CRYSTAL',give:()=>SAVE.pick=2,max:()=>SAVE.pick>=2?'OWNED':SAVE.pick<1?'NEED STONE PICK':null},
 {n:'HEARTY STEW',cost:{crops:3},d:'H: FULL HEAL + 1-HIT SHIELD',give:()=>SAVE.stews++,max:()=>SAVE.stews>=2?'MAX 2':null}];
function canPay(c){for(const k in c){const have=k=='crops'?SAVE.crops:SAVE.mats[k];if(have<c[k])return false}return true}
function pay(c){for(const k in c){if(k=='crops')SAVE.crops-=c[k];else SAVE.mats[k]-=c[k]}}
function uCraft(){const n=RECIPES.length+1;
 if(prs('ArrowUp','KeyW')){craftSel=(craftSel+n-1)%n;sfx('msg')}
 if(prs('ArrowDown','KeyS')){craftSel=(craftSel+1)%n;sfx('msg')}
 if(prs('Enter','KeyZ','KeyX','Space')){
  if(craftSel==n-1){craftOpen=false;sfx('sel');return}
  const rc=RECIPES[craftSel];
  if(rc.max()){sfx('deny');toast(rc.max(),'#f88');return}
  if(!canPay(rc.cost)){sfx('deny');toast('NOT ENOUGH MATERIALS','#f88');return}
  pay(rc.cost);
  rc.give();sfx('buy');toast(rc.n+' CRAFTED!','#9ad2ff');save()}}
function dCraft(){px(W/2-124,28,248,216,'rgba(12,14,24,.95)');g.strokeStyle='#9ad2ff';g.strokeRect(W/2-123.5,28.5,247,215);
 T('CRAFTING',W/2,36,'#9ad2ff',2,'center');
 T('WOOD '+SAVE.mats.w+' STONE '+SAVE.mats.s+' ORE '+SAVE.mats.o+' WOOL '+SAVE.mats.wl+' WHEAT '+SAVE.crops,W/2,52,'#e8c25a',1,'center');
 RECIPES.forEach((rc,i)=>{const y=64+i*20,on=craftSel==i,mx=rc.max();
  if(on){px(W/2-118,y-3,236,17,'rgba(154,210,255,.12)');T('>',W/2-114,y,'#9ad2ff')}
  T(rc.n,W/2-104,y,mx?'#667':on?'#fff':'#aab');
  const cost=Object.keys(rc.cost).map(k=>rc.cost[k]+' '+MATN[k]).join(' + ');
  T(mx||cost,W/2+108,y,mx?'#667':canPay(rc.cost)?'#8f8':'#f88',1,'right');
  if(on)T(rc.d,W/2-104,y+9,'#7a86a8')});
 const on=craftSel==RECIPES.length,y2=64+RECIPES.length*20;
 if(on){px(W/2-118,y2-3,236,13,'rgba(154,210,255,.12)');T('>',W/2-114,y2,'#9ad2ff')}
 T('CLOSE (R)',W/2-104,y2,on?'#fff':'#aab')}

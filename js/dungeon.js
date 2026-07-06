'use strict';
// ============ DUNGEON: 8 themes, gen, tutorial, enemies, minibosses ============
const PALS=[
 {sky:['#7ec8e3','#d8f1fa'],hill:'#5aa05e',hill2:'#75b876',blk:'#8a5a34',blk2:'#6e4527',top:'#4caf50',top2:'#66c95f',name:'VERDANT HOLLOW',gem:'#39d353',wx:0},
 {sky:['#2e3350','#5a5f80'],hill:'#3c415c',hill2:'#4a4f6c',blk:'#5c5f73',blk2:'#484a5c',top:'#9a9eb8',top2:'#b2b6cc',name:'SLATE CAVERNS',gem:'#7ab8ff',wx:0},
 {sky:['#9fd3e8','#eef9ff'],hill:'#c4dfeb',hill2:'#daedf5',blk:'#7fa7c9',blk2:'#6890b3',top:'#f2fbff',top2:'#ffffff',name:'FROSTBITE PEAK',gem:'#a5ecff',wx:1},
 {sky:['#2c3a26','#5a6b45'],hill:'#3a4a30',hill2:'#46583a',blk:'#4a5a3a',blk2:'#3a482e',top:'#6b8a4a',top2:'#82a55c',name:'MURKMIRE DEPTHS',gem:'#9dd45e',wx:4},
 {sky:['#f2b04c','#ffe3a8'],hill:'#d99e4a',hill2:'#e6b364',blk:'#b3763a',blk2:'#96602c',top:'#e8c05f',top2:'#f4d382',name:'SUNSCORCH RUINS',gem:'#ffb347',wx:2},
 {sky:['#3a4a6b','#8a9ac9'],hill:'#46557a',hill2:'#525f88',blk:'#5a6b8a',blk2:'#485672',top:'#8a9ab8',top2:'#a5b2cc',name:'TEMPEST SPIRE',gem:'#ffe66e',wx:5},
 {sky:['#22091a','#5c1f33'],hill:'#38122a',hill2:'#4a1830',blk:'#6e2438',blk2:'#571b2c',top:'#a03a52',top2:'#bf4a64',name:'CRIMSON KEEP',gem:'#ff5577',wx:3},
 {sky:['#0a0a14','#1a1230'],hill:'#141024',hill2:'#1c1630',blk:'#3a3450',blk2:'#2c2840',top:'#5c548a',top2:'#7a6fb3',name:'VOID SANCTUM',gem:'#c9a5ff',wx:6}];
const TUTPAL={sky:['#a8dfc8','#e8f9ee'],hill:'#6db884',hill2:'#8acc9e',blk:'#7d6a4a',blk2:'#63533a',top:'#5abf6a',top2:'#74d97f',name:'TRAINING GROVE',gem:'#fff',wx:0};
const MBNAMES=['MEGA SLIME','BONE BIRD','STONE FIST'];
let lvl=null,curD=0,mboss=null;
const TUTMAP=[
'                                            ',
'                                            ',
'                                            ',
'                                            ',
'                    oo                      ',
'                   ####                     ',
'                  S      ?               D  ',
'   ?       ?  oo  #      #  ^^  ? F      D  ',
'########  #############  ####################',
'########  #############  ####################',
'########  #############  ####################'];
const TUTSIGNS=['MOVE WITH ARROWS OR WASD.|JUMP WITH SPACE OR Z.|HOLD JUMP TO GO HIGHER!','A GAP! RUN AND JUMP ACROSS.|STOMP THE RED WALKER AHEAD,|OR SWING YOUR SWORD WITH X.','SPRINGS LAUNCH YOU HIGH!|BOUNCE UP TO GRAB THE COINS,|THEN HOP DOWN THE FAR SIDE.','SPIKES HURT! JUMP CLEAR OVER|THEM. GREEN FLAGS AHEAD ARE|CHECKPOINTS - TOUCH TO SAVE.'];
function parseTut(){const h=11,w=44,t=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>(TUTMAP[y]&&TUTMAP[y][x])||' '));
 lvl={t,w,h,n:0,en:[mkWalker(13*TS,8*TS-14,.5)],bats:[],spit:[],proj:[],ghosts:[],flags:new Set(),signs:new Set(),cp:{x:30,y:8*TS-21},pal:TUTPAL,springT:{},signMap:{3:0,11:1,25:2,32:3},mb:null};
 P.x=30;P.y=8*TS-21;P.vx=0;P.vy=0;P.face=1;P.inv=40;P.jumps=0}
function mkWalker(x,y,v){return{kind:'walker',x,y,w:16,h:14,vx:v,vy:0,hp:1,hurt:0}}
function mkKnight(x,y,v){return{kind:'knight',x,y,w:16,h:19,vx:v,vy:0,hp:2,hurt:0}}
function mkCrab(x,y,v){return{kind:'crab',x,y,w:18,h:12,vx:v,vy:0,hp:1,hurt:0}}
function genLevel(n){seed=n*9127+77;
 const w=170+n*18,h=11,t=Array.from({length:h},()=>Array(w).fill(' '));
 const col=(x,from)=>{for(let y=from;y<h;y++)t[y][x]='#'};
 let gy=8;for(let x=0;x<7;x++)col(x,gy);
 const en=[],bats=[];let lastCp=0,X=7;
 const spd=(.68+n*.09)*(SAVE.hero?1.4:1);
 while(X<w-40){
  if(X-lastCp>40){for(let i=0;i<4;i++)col(X+i,gy);t[gy-1][X+1]='F';lastCp=X;X+=4;continue}
  const r=X<20?rng()*.3:rng();
  if(r<.3){const L=4+(rng()*4|0);for(let i=0;i<L;i++)col(X+i,gy);
   if(rng()<.2+n*.06&&L>4){const rr=rng();
    en.push(n>=4&&rr<.3?mkKnight((X+2)*TS,gy*TS-19,spd*.7):n>=3&&rr<.55?mkCrab((X+2)*TS,gy*TS-12,spd*1.5):mkWalker((X+2)*TS,gy*TS-14,spd))}
   if(rng()<.45)for(let i=1;i<L-1;i++)t[gy-2][X+i]='o';
   if(n>=2&&rng()<.24)bats.push({bx:(X+L/2)*TS,by:(gy-4)*TS,x:0,y:0,t:rng()*9,hp:1,hurt:0,dead:0});
   X+=L}
  else if(r<.5){const G=2+(rng()<.3+n*.08?1:0)+(n>=5&&rng()<.3?1:0);
   for(let i=0;i<Math.min(G,3);i++)t[gy-3][X+i]='o';X+=G;
   for(let i=0;i<3;i++)col(X+i,gy);X+=3}
  else if(r<.68){const mx=n>=5?3:2,d=(rng()<.5?-1:1)*(1+(rng()<.35?(rng()<.4&&n>=5?2:1):0));gy=clamp(gy+clamp(d,-mx,mx),4,9);
   for(let i=0;i<4;i++)col(X+i,gy);X+=4}
  else if(r<.84){const L=2+(n>2&&rng()<.5?1:0);
   for(let i=0;i<L;i++){col(X+i,gy);t[gy-1][X+i]='^'}X+=L;
   for(let i=0;i<3;i++)col(X+i,gy);X+=3}
  else{const L=rng()<.5?6:8;
   const p1y=gy-(n>=2&&rng()<.5?1:0);for(let i=0;i<2;i++){t[p1y][X+2+i]='#';t[p1y-2][X+2+i]='o'}
   if(L==8){const p2y=clamp(p1y-1,3,9);for(let i=0;i<2;i++)t[p2y][X+5+i]='#'}
   X+=L;for(let i=0;i<3;i++)col(X+i,gy);X+=3}}
 // miniboss arena
 while(gy!=7){gy+=Math.sign(7-gy);for(let i=0;i<3;i++)col(X+i,gy);X+=3}
 for(let i=0;i<3;i++)col(X+i,gy);t[gy-1][X+1]='F';X+=3;
 const ax=X;for(;X<w;X++)col(X,7);
 for(let y2=0;y2<7;y2++){t[y2][ax+1]='G'}
 for(let y2=0;y2<7;y2++)t[y2][w-1]='#';
 t[6][w-5]='D';t[5][w-5]='D';
 // decor pass
 seed=n*555+3;const spit=[],ghosts=[];let kC=0;
 for(let x=10;x<ax-8;x++){let ty=0;while(ty<h&&t[ty][x]!='#')ty++;
  if(ty>2&&ty<h&&t[ty-1][x]==' '&&t[ty][x-1]=='#'&&t[ty][x+1]=='#'){
   const r=rng();if(r<.06)t[ty-1][x]='p';
   else if(n>=5&&r<.085&&spit.length<5)spit.push({x:x*TS+4,y:ty*TS-15,t:rng()*100});
   else if(n>=7&&r<.11&&ghosts.length<5)ghosts.push({x:x*TS,y:(ty-3)*TS,t:rng()*9,hp:2,hurt:0,dead:0,fade:.8});
   else if(r>.94&&x>30&&kC<2){t[ty-1][x]='K';kC++}}}
 lvl={t,w,h,n,en,bats,spit,ghosts,proj:[],flags:new Set(),signs:new Set(),cp:{x:36,y:gy0(t)},pal:PALS[n-1],springT:{},mb:mkMiniboss(n,ax),mbAx:ax};
 P.x=36;P.y=lvl.cp.y;P.vx=0;P.vy=0;P.face=1;P.inv=40;P.jumps=0;
 function gy0(t2){for(let y=0;y<h;y++)if(t2[y][2]=='#')return y*TS-21;return 8*TS-21}}
function mkMiniboss(n,ax){const type=(n-1)%3,hp=(10+n*3)*(SAVE.hero?1.5:1);
 const x=(ax+14)*TS,gy2=7*TS;
 if(type==0)return{type,x,y:gy2-30,w:44,h:30,vx:0,vy:0,hp,mhp:hp,st:'idle',t:60,hurt:0,sq:0,onG:0};
 if(type==1)return{type,x,y:gy2-110,bx:x,by:gy2-110,w:38,h:20,vx:0,vy:0,hp,mhp:hp,st:'fly',t:90,hurt:0,ang:0};
 return{type,x,y:gy2-38,w:44,h:38,vx:0,vy:0,hp,mhp:hp,st:'idle',t:80,hurt:0,waves:[],onG:0}}
const lvlSolid=(x,y)=>{if(x<0||x>=lvl.w)return true;const r=lvl.t[y];return r?(r[x]=='#'||r[x]=='G'||r[x]=='K'):false};
// ---------- side update ----------
function uSide(){playT++;
 const ax2=(mvR()?1:0)-(mvL()?1:0);
 if(P.dashT>0){P.dashT--;P.vx=P.face*6.9;P.vy=0;if(frame%2==0)P.trail.push({x:P.x,y:P.y,l:12})}
 else{P.vx+=(ax2*2.85*(SAVE.boots?1.12:1)-P.vx)*.35;if(Math.abs(P.vx)<.07)P.vx=0;if(ax2)P.face=ax2;
  P.vy=Math.min(P.vy+.51,9)}
 if(P.dashCd>0)P.dashCd--;tryDash();uTrail();uBombs('side');
 if(P.onG){P.coy=6;P.jumps=0}else if(P.coy>0)P.coy--;
 if(pJump())P.jb=6;else if(P.jb>0)P.jb--;
 const maxJ=SAVE.djump?1:0;
 if(P.jb>0&&P.dashT<=0&&(P.coy>0||P.jumps<maxJ)){
  if(P.coy<=0)P.jumps++;P.vy=-8.4;P.jb=0;P.coy=0;sfx('jump');
  puff(P.x+7,P.y+20,P.jumps>0?'#9fe3c0':'#fff',P.jumps>0?7:4,1.1)}
 if(!hJump()&&P.vy<-3&&P.dashT<=0)P.vy=-3;
 const wasAir=!P.onG;P.onG=0;move(P,lvlSolid);
 if(P.onG&&wasAir){P.land=8;puff(P.x+7,P.y+20,'#ccc',3,.9)}
 if(P.land>0)P.land--;
 uAtk();
 if((P.atk>=7&&P.atk<=15)||P.dashT>0){const sb=P.dashT>0?P:swordBox();
  const l=Math.floor(sb.x/TS),r=Math.floor((sb.x+sb.w-1)/TS),tt=Math.floor(sb.y/TS),b=Math.floor((sb.y+sb.h-1)/TS);
  for(let ty=tt;ty<=b;ty++)for(let tx=l;tx<=r;tx++){const row=lvl.t[ty];
   if(row&&row[tx]=='p'){row[tx]=' ';sfx('break');puff(tx*TS+12,ty*TS+12,'#c96',9,2.6);
    const cn=SAVE.charm?3:2;coins+=cn;coinBump=10;ftxt(tx*TS+12,ty*TS,'+'+cn,'#ffd700')}
   else if(row&&row[tx]=='K'&&P.atk==13){sfx('clank');ftxt(tx*TS+12,ty*TS-6,'BOMB IT!','#f88')}}}
 const l=Math.floor(P.x/TS),r=Math.floor((P.x+P.w-1)/TS),tt=Math.floor(P.y/TS),b=Math.floor((P.y+P.h-1)/TS);
 for(let ty=tt;ty<=b;ty++)for(let tx=l;tx<=r;tx++){const row=lvl.t[ty];if(!row)continue;const c=row[tx];
  if(c=='o'){row[tx]=' ';coins++;coinBump=10;sfx('coin');puff(tx*TS+12,ty*TS+12,'#ffd700',5,1.2)}
  else if(c=='^'){if(P.dashT<=0){hurtCp();return}}
  else if(c=='S'&&P.vy>0){P.vy=-12.6;lvl.springT[tx]=10;sfx('spring');puff(tx*TS+12,ty*TS+6,'#fff',5)}
  else if(c=='?'&&!lvl.signs.has(tx)){lvl.signs.add(tx);say(TUTSIGNS[(lvl.signMap&&lvl.signMap[tx])||0]||'...')}
  else if(c=='F'&&!lvl.flags.has(tx)){lvl.flags.add(tx);lvl.cp={x:tx*TS,y:ty*TS+TS-21};sfx('heal');ftxt(tx*TS+12,ty*TS-6,'CHECKPOINT','#8f8');if(hp<maxhp)hp++}
  else if(c=='D'){
   if(curD<0){SAVE.dash=true;save();sfx('gem');fadeTo(()=>{exitToOv(TUT);say('TRAINING COMPLETE! YOU EARNED|THE DASH BOOTS. PRESS C, K OR|SHIFT TO DASH. NOW GO GEM HUNTING!')});return}
   gems[curD]=1;questProg('gems');
   if(curD==2&&!SAVE.djump){SAVE.djump=true;toast('DOUBLE JUMP UNLOCKED!','#9fe3c0')}
   save();st='gem';gemT=0;setTheme(null);sfx('gem');return}}
 for(const k in lvl.springT)if(lvl.springT[k]>0)lvl.springT[k]--;
 if(P.y>lvl.h*TS+50){hurtCp();return}
 uSideEnemies();uMiniboss();
 P.inv>0&&P.inv--;if(P.blink>0)P.blink--;else if(Math.random()<.006)P.blink=6;
 cam.x=lerp(cam.x,clamp(P.x-190+P.face*30,0,lvl.w*TS-W),.12);cam.y=-2}
function uSideEnemies(){
 for(const e of lvl.en){if(e.hp<=0)continue;
  if(Math.abs(e.x-P.x)>W)continue;
  e.vy=Math.min(e.vy+.51,8);const pvx=e.vx;e.onG=0;move(e,lvlSolid);
  if(e.hit)e.vx=-pvx;else e.vx=pvx;
  if(e.onG){const ft=Math.floor((e.x+(e.vx>0?e.w+1:-2))/TS),fy=Math.floor((e.y+e.h+2)/TS);
   if(!lvlSolid(ft,fy))e.vx=-e.vx}
  e.hurt>0&&e.hurt--;
  if(ovl(P,e)){
   if(P.vy>1.5&&P.y+P.h<e.y+10){e.hp-=e.kind=='knight'?1:9;P.vy=-6.3;sfx('stomp');puff(e.x+8,e.y+5,'#7c7',9);
    if(e.hp<=0){coins++;coinBump=10;ftxt(e.x+8,e.y,'+1','#ffd700')}}
   else if(P.dashT>0&&e.kind!='knight'){e.hp=0;sfx('kill');puff(e.x+8,e.y+5,'#7c7',9)}
   else if(e.hurt<=0&&P.inv<=0){dmg(1);P.vx=P.x<e.x?-3.75:3.75;P.vy=-3}}}
 lvl.en=lvl.en.filter(e=>e.hp>0||e.perm);
 for(const bt of lvl.bats){if(bt.dead)continue;bt.t+=.05;
  bt.bx+=clamp(P.x-bt.bx,-1.5,1.5)*.25;
  bt.x=bt.bx+Math.sin(bt.t*2)*27;bt.y=bt.by+Math.sin(bt.t*3.1)*15;
  const bb={x:bt.x,y:bt.y,w:16,h:12};bt.hurt>0&&bt.hurt--;
  if(ovl(P,bb)){if((P.vy>1.5&&P.y+P.h<bb.y+7)||P.dashT>0){bt.dead=1;sfx('stomp');puff(bt.x+7,bt.y+5,'#a8f',8);if(P.dashT<=0)P.vy=-6}
   else if(P.inv<=0){dmg(1);P.vx=P.x<bt.x?-3.75:3.75}}
  if(P.atk>=7&&P.atk<=15&&ovl(swordBox(),bb)){bt.dead=1;sfx('kill');puff(bt.x+7,bt.y+5,'#a8f',9);coins++;coinBump=10}}
 for(const gh of lvl.ghosts){if(gh.dead)continue;gh.t+=.04;
  gh.fade=.35+Math.abs(Math.sin(gh.t))*.55;
  const d=Math.hypot(P.x-gh.x,P.y-gh.y)||1;
  gh.x+=(P.x-gh.x)/d*.75;gh.y+=(P.y-gh.y)/d*.6;
  gh.hurt>0&&gh.hurt--;
  const bb={x:gh.x,y:gh.y,w:16,h:16};
  if(ovl(P,bb)&&P.inv<=0&&P.dashT<=0&&gh.fade>.5)dmg(1);
  if(P.atk>=7&&P.atk<=15&&gh.hurt<=0&&ovl(swordBox(),bb)){gh.hp-=P.dmg;gh.hurt=20;sfx('stomp');
   gh.x-=Math.sign(P.x<gh.x?-1:1)*-14;puff(gh.x+8,gh.y+8,'#cfd6ff',6);
   if(gh.hp<=0){gh.dead=1;sfx('kill');puff(gh.x+8,gh.y+8,'#cfd6ff',12);coins+=2;coinBump=10}}}
 for(const sp2 of lvl.spit){const dx=P.x-sp2.x;
  if(Math.abs(dx)<220){sp2.t++;
   if(sp2.t%140==120)sfx('spit');
   if(sp2.t%140==0)lvl.proj.push({x:sp2.x+8,y:sp2.y+4,vx:Math.sign(dx)*2.1,vy:-3.9})}}
 for(let i=lvl.proj.length;i--;){const pr=lvl.proj[i];pr.x+=pr.vx;pr.y+=pr.vy;pr.vy+=.22;
  if(lvlSolid(Math.floor(pr.x/TS),Math.floor(pr.y/TS))||pr.y>300){puff(pr.x,pr.y,'#8c6',4,1);lvl.proj.splice(i,1);continue}
  if(P.inv<=0&&P.dashT<=0&&pr.x>P.x-4&&pr.x<P.x+18&&pr.y>P.y-4&&pr.y<P.y+22){dmg(1);lvl.proj.splice(i,1)}}
 hitEnemies(lvl.en.filter(e=>e.hp>0),e=>{if(e.kind=='knight')0});}
// ---------- miniboss ----------
function uMiniboss(){const B=lvl.mb;if(!B||B.hp<=0)return;
 if(P.x<lvl.mbAx*TS-40)return;
 B.hurt>0&&B.hurt--;
 const hero2=SAVE.hero?1.3:1;
 if(B.type==0){ // MEGA SLIME: hops at player
  B.vy=Math.min(B.vy+.51,9);B.onG=0;move(B,lvlSolid);
  if(B.onG){B.sq=Math.min(6,(B.sq||0)+1);
   if(--B.t<=0){B.vy=-7-Math.random()*2;B.vx=Math.sign(P.x-B.x)*(1.6+Math.random())*hero2;B.t=50+Math.random()*40;B.sq=0;sfx('jump')}
   else B.vx=0}
  if(B.onG&&B.vyl>4){shake=5;sfx('pound');puff(B.x+22,B.y+28,'#7c7',10,2.5)}
  B.vyl=B.vy}
 else if(B.type==1){ // BONE BIRD: sine fly + swoop
  if(B.st=='fly'){B.ang+=.03;B.x=B.bx+Math.sin(B.ang)*90;B.y=B.by+Math.sin(B.ang*1.7)*24;
   if(--B.t<=0){B.st='tel';B.t=30}}
  else if(B.st=='tel'){if(--B.t<=0){B.st='dive';const d=Math.hypot(P.x-B.x,P.y-B.y)||1;
   B.vx=(P.x-B.x)/d*4.5*hero2;B.vy=(P.y-B.y)/d*4.5*hero2;sfx('swing')}}
  else if(B.st=='dive'){B.x+=B.vx;B.y+=B.vy;
   if(B.y>7*TS-B.h-2||B.y<30){B.st='rise';B.t=40;
    if(Math.random()<.6){lvl.en.push(mkWalker(B.x+10,B.y+10,.9));sfx('break')}}}
  else{B.y-=2.2;B.x+=(B.bx-B.x)*.04;if(--B.t<=0||B.y<=B.by){B.st='fly';B.t=80+Math.random()*60}}}
 else{ // STONE FIST: pound → shockwaves → stun
  B.vy=Math.min(B.vy+.51,9);B.onG=0;move(B,lvlSolid);
  if(B.st=='idle'){B.x+=Math.sign(P.x-B.x)*.5*hero2;if(--B.t<=0){B.st='tel';B.t=26}}
  else if(B.st=='tel'){shake=Math.max(shake,2);if(--B.t<=0){B.st='pound';B.t=18;shake=8;sfx('pound');
   B.waves.push({x:B.x-4,vx:-3.4},{x:B.x+B.w+4,vx:3.4})}}
  else if(B.st=='pound'){if(--B.t<=0){B.st='stun';B.t=110}}
  else{if(--B.t<=0){B.st='idle';B.t=70}}
  for(let i=B.waves.length;i--;){const w2=B.waves[i];w2.x+=w2.vx;
   if(w2.x<lvl.mbAx*TS||w2.x>lvl.w*TS){B.waves.splice(i,1);continue}
   if(frame%3==0)puff(w2.x,7*TS-4,'#caa',2,.8);
   if(P.inv<=0&&P.dashT<=0&&P.onG&&Math.abs(P.x+7-w2.x)<12)dmg(1)}}
 // hits
 const bb={x:B.x,y:B.y,w:B.w,h:B.h};
 if(ovl(P,bb)){if(P.vy>1.5&&P.y+P.h<B.y+12){B.hp-=1;B.hurt=14;P.vy=-6.5;sfx('stomp');puff(P.x+7,B.y,'#fff',6)}
  else if(P.inv<=0&&P.dashT<=0)dmg(1)}
 if(P.atk>=7&&P.atk<=15&&B.hurt<=0&&ovl(swordBox(),bb)){
  const d=(B.st=='stun'?2:1)*P.dmg;B.hp-=d;B.hurt=14;sfx('stomp');puff(B.x+B.w/2,B.y+8,'#fff',6);ftxt(B.x+B.w/2,B.y-8,'-'+d,'#ff8')}
 if(B.hp<=0){sfx('boom');shake=9;puff(B.x+B.w/2,B.y+B.h/2,'#fff',24,3.5);
  for(let y2=0;y2<7;y2++)if(lvl.t[y2][lvl.mbAx+1]=='G')lvl.t[y2][lvl.mbAx+1]=' ';
  toast(MBNAMES[B.type]+' DEFEATED!','#ff8');coins+=10;coinBump=10}}
// ---------- side drawing ----------
function dSideBg(pal){
 const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,pal.sky[0]);gr.addColorStop(1,pal.sky[1]);
 g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.fillStyle=pal.hill2;for(let x=0;x<W;x+=4){const h2=64+Math.sin((x+cam.x*.25)/66)*20;g.fillRect(x,H-h2,4,h2)}
 g.fillStyle=pal.hill;for(let x=0;x<W;x+=4){const h1=40+Math.sin((x+cam.x*.5)/42)*15;g.fillRect(x,H-h1,4,h1)}
 if(lvl.n==2||lvl.n==8)for(let i=0;i<26;i++){const sx=(hash(i,7)*W*2-cam.x*.15)%W;px((sx+W)%W,hash(i,3)*100,1,1,'#dde')}
 const wx=pal.wx;
 if(wx==1)for(let i=0;i<34;i++){const sx=(hash(i,1)*W+frame*(.4+hash(i,2)*.5))%W,sy=(hash(i,3)*H+frame*(.7+hash(i,4)*.7))%H;px(sx,sy,2,2,'rgba(255,255,255,.7)')}
 if(wx==3)for(let i=0;i<18;i++){const sx=(hash(i,1)*W+Math.sin(frame/30+i)*26)%W,sy=H-((hash(i,3)*H+frame*(.5+hash(i,4)*.4))%H);px(sx,sy,2,2,'rgba(255,120,80,.6)')}
 if(wx==2)for(let i=0;i<12;i++){const sx=(hash(i,1)*W+frame*(1.4+hash(i,2)))%W;px(sx,H-40-hash(i,5)*80,4,1,'rgba(255,230,170,.5)')}
 if(wx==4)for(let i=0;i<16;i++){const sy=H-((hash(i,3)*H+frame*.35)%H);px((hash(i,1)*W+Math.sin(frame/40+i)*10)%W,sy,2,2,'rgba(157,212,94,.4)')}
 if(wx==5){for(let i=0;i<40;i++){const sx=(hash(i,1)*W+frame*.6)%W,sy=(hash(i,3)*H+frame*4.5)%H;px(sx,sy,1,5,'rgba(180,200,255,.45)')}
  if(frame%180<3){g.fillStyle='rgba(255,255,255,.25)';g.fillRect(0,0,W,H)}}}
function dSideTile(c,tx,ty,pal){const x=tx*TS,y=ty*TS;
 if(c=='#'||c=='G'){if(c=='G'){const gl2=Math.sin(frame/10)*.2+.5;px(x+4,y,16,TS,'rgba(200,80,255,'+gl2*.5+')');px(x+9,y,6,TS,'#c9a5ff');return}
  px(x,y,TS,TS,pal.blk);
  const above=ty==0||lvl.t[ty-1][tx]!='#';
  if(above){px(x,y,TS,6,pal.top);px(x,y,TS,2,pal.top2);px(x,y+6,TS,1,'rgba(0,0,0,.25)');
   if(lvl.n==1&&hash(tx,7)<.4){px(x+3,y-3,2,3,'#66c95f');px(x+11,y-4,2,4,'#4caf50');px(x+18,y-3,2,3,'#66c95f')}}
  if(tx==0||lvl.t[ty][tx-1]!='#')px(x,y,2,TS,'rgba(255,255,255,.15)');
  if(tx>=lvl.w-1||lvl.t[ty][tx+1]!='#')px(x+22,y,2,TS,'rgba(0,0,0,.3)');
  if(hash(tx,ty)<.3)px(x+4+(hash(tx,ty)*20|0)%12,y+10+(hash(ty,tx)*20|0)%9,6,4,'rgba(0,0,0,.14)');
  if(hash(tx,ty)>.85)px(x+7,y+13,5,3,pal.blk2)}
 else if(c=='^'){px(x,y+20,TS,4,'#777');g.fillStyle='#d8d8e2';
  for(let i=0;i<2;i++){g.beginPath();g.moveTo(x+i*12,y+21);g.lineTo(x+i*12+6,y+4);g.lineTo(x+i*12+12,y+21);g.fill();px(x+i*12+5,y+7,1,6,'#fff')}}
 else if(c=='o'){const w2=Math.abs(Math.sin(frame/9+tx))*8+1;px(x+12-w2/2,y+6,w2,12,'#ffd700');px(x+12-w2/2,y+8,w2,3,'#fff3b0');
  if((frame+tx*13)%60<5)px(x+16,y+3,3,3,'#fff')}
 else if(c=='F'){px(x+10,y,3,24,'#8a6430');px(x+10,y,1,24,'#a87c42');const on=lvl.flags.has(tx);g.fillStyle=on?'#4caf50':'#b0483e';
  const wv=Math.sin(frame/8)*2;g.beginPath();g.moveTo(x+13,y+2);g.lineTo(x+25+wv,y+6);g.lineTo(x+13,y+12);g.fill();
  if(on&&(frame>>3)%4==0)px(x+17,y-3,2,2,'#8f8')}
 else if(c=='p'){px(x+4,y+9,14,13,'#c98a56');px(x+6,y+6,10,4,'#a86e40');px(x+7,y+22,10,2,'#8a5a34');px(x+6,y+12,3,7,'#e0aa76')}
 else if(c=='K'){px(x,y,TS,TS,'#7a7264');px(x,y,TS,4,'#8f8776');px(x+3,y+8,10,2,'#2c2820');px(x+9,y+3,2,8,'#2c2820');px(x+13,y+14,7,2,'#2c2820');px(x+4,y+17,2,5,'#2c2820');
  if((frame>>5)&1)px(x+9,y+9,3,3,'#ffd75e')}
 else if(c=='S'){const sq=lvl.springT[tx]>0?6:0;px(x+3,y+18+sq/2,18,6-sq/2,'#888');
  px(x+4,y+12+sq,15,3,'#aaa');px(x+6,y+15+sq,12,2,'#777');px(x+3,y+9+sq,18,4,'#d9534f')}
 else if(c=='?'){px(x+10,y+9,3,15,'#6e4a2a');px(x+3,y,18,12,'#c9a86a');px(x+3,y,18,2,'#e0c88c');T('?',x+12,y+3,'#5a3a1a',1,'center')}
 else if(c=='D'&&lvl.t[ty+1]&&lvl.t[ty+1][tx]=='D'){px(x-2,y,27,48,'#3a2c1e');px(x+2,y+4,19,44,'#151019');
  const gl=Math.sin(frame/15)*.3+.5;g.fillStyle='rgba(255,255,180,'+gl*.14+')';g.fillRect(x-6,y-3,36,52);
  drawGemIcon(x+7,y+12,pal.gem,true);px(x-5,y-5,33,6,pal.top);px(x-5,y-5,33,2,pal.top2)}}
function dSide(){const pal=lvl.pal;dSideBg(pal);
 g.save();g.translate(-(cam.x|0)+(shake?(Math.random()*shake-shake/2)|0:0),-(cam.y|0));
 const x0=Math.max(0,Math.floor(cam.x/TS));
 for(let ty=0;ty<lvl.h;ty++)for(let tx=x0;tx<=x0+21&&tx<lvl.w;tx++){
  const c=lvl.t[ty][tx];if(c!=' ')dSideTile(c,tx,ty,pal)}
 for(const e of lvl.en)if(e.hp>0&&Math.abs(e.x-cam.x-240)<300){
  if(e.kind=='knight')drawKnight(e);else if(e.kind=='crab')drawCrab(e);else drawWalker(e)}
 for(const b of lvl.bats)if(!b.dead)drawBat(b);
 for(const gh of lvl.ghosts)if(!gh.dead)drawGhost(gh);
 for(const s of lvl.spit)drawSpitter(s);
 for(const pr of lvl.proj){px(pr.x-3,pr.y-3,6,6,'#8c6');px(pr.x-1,pr.y-1,3,3,'#cfa')}
 for(const bm of bombs)if(bm.mode=='side')drawBombSpr(bm.x,bm.y,bm.t);
 const B=lvl.mb;
 if(B&&B.hp>0&&Math.abs(B.x-cam.x-240)<340){
  if(B.type==0)drawMegaSlime(B);else if(B.type==1)drawBoneBird(B);else drawStoneFist(B)}
 drawHeroSide(P.x,P.y);dParts();g.restore();
 if(lvl.n==8)lightPass(.72,[{x:P.x-cam.x+7,y:P.y-cam.y+10,r:100},{x:(lvl.w-5)*TS-cam.x,y:6*TS-cam.y,r:60,a:.7}]);
 hud();T(pal.name,6,H-10,'#fff');
 if(B&&B.hp>0&&P.x>lvl.mbAx*TS-40){px(W/2-62,H-16,124,8,'#20101a');px(W/2-60,H-14,120*Math.max(0,B.hp)/B.mhp,4,'#e33');
  T(MBNAMES[B.type],W/2,H-25,'#fbb',1,'center')}
 if(P.inv>55){g.fillStyle='rgba(255,0,0,'+((P.inv-55)/15*.25)+')';g.fillRect(0,0,W,H)}}

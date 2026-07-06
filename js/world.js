'use strict';
// ============ WORLD: biomes, overworld, NPCs, quests, harvesting, caves, fishing ============
let ov,ovW=72,ovH=48,ovEn=[],bflies=[],lastTrig=null,dayT=.25,region='';
let ovNode={},respawns=[],cave=null,caveEn=[],hintWood=false,farm={};
const SPAWN={x:36,y:25};
const DOORS=[[30,34],[14,38],[52,40],[56,22],[64,12],[58,8],[10,28],[36,6]];
const GATE=[36,4],TUT=[30,21],SHOP=[40,22];
const KROCKS=[[24,33],[48,16],[12,16],[60,30],[42,12],[18,40]];// first 3 hide caves
const BIOME_NAME=['MEADOW VALE','DEEPWOOD','GOLDEN DUNES','FROSTFIELD','MURKMIRE','ASHEN REACH'];
function biome(x,y){
 const n=(hash(x>>2,y>>2)-.5)*4;
 if(y<10+n)return 5;
 if(x>50&&y<20+n)return 3;
 if(x>46+n)return 2;
 if(x<18+n&&y>24)return 4;
 if(y>32+n)return 1;
 return 0}
const CHESTS={'6,44':'hp','66,44':'coin','20,10':'mimic','44,38':'doll','8,8':'coin3','22,20':'coin4'};
const SIGNS={'38,24':'EIGHT GEMS LIE IN EIGHT DUNGEONS.|CLAIM THEM ALL, THEN BREACH THE|NORTHERN GATE IN ASHEN REACH.','34,23':"CHOP TREES AND MINE ROCKS WITH|YOUR SWORD FOR MATERIALS, THEN|PRESS R TO CRAFT BOMBS AND MORE!",'36,10':'THE GATE HUNGERS FOR GEMS.|TAB: MAP - Q: QUESTS - R: CRAFT','25,22':'AN ISLAND SITS IN THE LAKE...|CRAFT PLANKS (R) AND PRESS E|AT THE SHORE TO BRIDGE ACROSS.','23,35':'CRACKED BOULDERS HIDE OLD CAVES.|ONLY A BOMB CAN OPEN THEM.|BEWARE THE DARK AFTER DUSK...'};
let NPCS=[];
const QUESTS=[
 {giver:'FARMER BRAN',desc:'CULL 8 SLIMES',type:'kill',count:8,rew:()=>{coins+=30;SAVE.seeds+=5;toast('QUEST DONE! +30C +5 SEEDS')}},
 {giver:'SMITH DARA',desc:'BRING 3 IRON ORE',type:'ore',count:3,rew:()=>{P.dmg=Math.max(P.dmg,2);SAVE.sword=1;toast('SWORD REFORGED! DMG UP')}},
 {giver:'FISHER OTTO',desc:'CATCH 3 FISH',type:'fish',count:3,rew:()=>{coins+=40;toast('QUEST DONE! +40 COINS')}},
 {giver:'LITTLE MAE',desc:'FIND HER LOST DOLL',type:'doll',count:1,rew:()=>{SAVE.pieces++;toast('HEART PIECE GET!');checkPieces()}},
 {giver:'ELDER ROWAN',desc:'CLEAR 3 DUNGEONS',type:'gems',count:3,rew:()=>{SAVE.potion=true;coins+=20;toast('POTION + 20 COINS!')}}];
function QD(){return SAVE}
function mkNPCs(){NPCS=[
 {i:0,x:34,y:22,name:'ELDER ROWAN',c:'#7a6a9e',c2:'#9a8abe',hair:'#ddd',q:5,txt:["WELCOME TO HAVEN VILLAGE, HERO.|THE GOLEM'S GATE STIRS IN THE|NORTH. WE NEED THOSE EIGHT GEMS.","CLEAR 3 DUNGEONS AND I WILL|REWARD YOUR COURAGE."]},
 {i:1,x:38,y:27,name:'FARMER BRAN',c:'#8a6a3a',c2:'#a8853f',hair:'#6a3f1a',hat:'#d8b56a',q:1,txt:['SLIMES ATE MY CABBAGES AGAIN!|CULL 8 OF THEM, WOULD YOU?','THEY SQUISH REAL GOOD IF YOU|SWORD THEM. X OR J!']},
 {i:2,x:31,y:26,name:'SMITH DARA',c:'#666677',c2:'#88889e',hair:'#2a2a33',q:2,txt:['YOUR BLADE IS DULL AS A SPOON.|BRING 3 IRON ORE FROM BEETLES|OR THE GLINTING ROCKS.','PURPLE BEETLES AND ORE ROCKS|CARRY IRON. MINE WITH YOUR SWORD.']},
 {i:3,x:20,y:27,name:'FISHER OTTO',c:'#3a6a8a',c2:'#4f88ad',hair:'#8a5a2a',hat:'#3a5a3a',q:3,txt:['TAKE THIS OLD ROD. THE LAKE IS|FULL OF FAT ONES. STAND AT THE|SHORE AND PRESS E TO CAST!','CATCH ME 3 FISH AND THE|REWARD IS YOURS.']},
 {i:4,x:37,y:29,name:'LITTLE MAE',c:'#c26a8a',c2:'#d98aa8',hair:'#e8c25a',q:4,txt:['SNIFF... I LOST MY DOLLY|SOMEWHERE IN THE DEEPWOOD.|PLEASE FIND HER!','SHE IS IN A CHEST, I THINK.|A BIG MEANIE TOOK HER.']}];}
function checkPieces(){if(SAVE.pieces>=4){SAVE.pieces-=4;maxhp+=2;hp=maxhp;toast('HEART CONTAINER FORMED!','#f66');sfx('heal')}}
function genOv(){seed=4242;ovNode={};respawns=[];
 ov=Array.from({length:ovH},(_,y)=>Array.from({length:ovW},(_,x)=>{
  if(x<2||y<2||x>=ovW-2||y>=ovH-2)return'T';
  const b=biome(x,y);
  const lake=((x-22)/8)**2+((y-20)/5)**2<1;
  if(lake)return(x==22||x==23)&&y==20?'.':'~';
  const r=hash(x,y);
  if(b==5)return r<.14?'R':r<.18?'W':r<.24?'T':'.';
  if(b==4)return r<.2?'T':r<.26?'~':'.';
  if(b==3)return r<.16?'T':r<.19?'R':r<.21?'W':'.';
  if(b==2)return r<.1?'T':r<.14?'R':r<.16?'W':'.';
  if(b==1)return r<.3?'T':'.';
  return r<.1?'T':r>.93&&r<.95?'R':'.'}));
 const carve=(x1,y1,x2,y2)=>{let x=x1,y=y1;const step=(nx,ny)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const c=ov[ny+dy]&&ov[ny+dy][nx+dx];if(c=='T'||c=='~'||c=='R'||c=='W')ov[ny+dy][nx+dx]='.'}ov[ny][nx]=',';x=nx;y=ny};
  while(x!=x2)step(x+Math.sign(x2-x),y);while(y!=y2)step(x,y+Math.sign(y2-y))};
 DOORS.forEach(d=>carve(SPAWN.x,SPAWN.y,d[0],d[1]));carve(SPAWN.x,SPAWN.y,GATE[0],GATE[1]+1);
 carve(SPAWN.x,SPAWN.y,TUT[0],TUT[1]);carve(SPAWN.x,SPAWN.y,SHOP[0],SHOP[1]);
 carve(SPAWN.x,SPAWN.y,20,27);carve(SPAWN.x,SPAWN.y,6,44);carve(SPAWN.x,SPAWN.y,66,44);carve(SPAWN.x,SPAWN.y,20,10);carve(SPAWN.x,SPAWN.y,44,38);carve(SPAWN.x,SPAWN.y,8,8);
 const clear=(cx,cy,r)=>{for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++)if(ov[y]&&ov[y][x]&&'T~RW'.includes(ov[y][x]))ov[y][x]='.'};
 clear(SPAWN.x,SPAWN.y,3);DOORS.forEach(d=>clear(d[0],d[1],2));clear(GATE[0],GATE[1],2);clear(TUT[0],TUT[1],2);clear(SHOP[0],SHOP[1],2);
 mkNPCs();NPCS.forEach(n=>clear(n.x,n.y,2));
 DOORS.forEach((d,i)=>ov[d[1]][d[0]]=''+(i+1));
 ov[GATE[1]][GATE[0]]='B';ov[GATE[1]][GATE[0]-1]='R';ov[GATE[1]][GATE[0]+1]='R';
 ov[24][35]='H';ov[TUT[1]][TUT[0]]='O';ov[SHOP[1]][SHOP[0]]='M';
 KROCKS.forEach((k,i)=>{clear(k[0],k[1],1);ov[k[1]][k[0]]=SAVE.caves.includes(k[0]+','+k[1])?(i<3?'V':'.'):'K'});
 for(const k in CHESTS){const[x,y]=k.split(',').map(Number);if(!(x==22&&y==20))clear(x,y,1);ov[y][x]='C'}
 ov[20][23]='z';
 for(const k in SIGNS){const[x,y]=k.split(',').map(Number);ov[y][x]='!'}
 [[68,6],[4,24]].forEach(p=>{clear(p[0],p[1],1);ov[p[1]][p[0]]='h'});
 [[40,28],[41,28],[42,28],[40,29],[41,29],[42,29]].forEach(p=>{clear(p[0],p[1],1);ov[p[1]][p[0]]='f'});
 ov[27][42]='!';SIGNS['42,27']='FARM PLOT! BUY SEEDS AT THE SHOP,|PRESS E ON SOIL TO PLANT, WAIT FOR|GOLDEN WHEAT, THEN E TO HARVEST.';
 farm={};
 let sh=0;for(let y=4;y<ovH-4&&sh<29;y++)for(let x=4;x<ovW-4&&sh<29;x++)
  if(ov[y][x]=='.'&&hash(x*31,y*17)>.987){ov[y][x]='z';sh++}
 ovEn=[];let nb=0,ns=0;
 for(let y=3;y<ovH-3;y++)for(let x=3;x<ovW-3;x++){
  if(ov[y][x]!='.')continue;const d=Math.hypot(x-SPAWN.x,y-SPAWN.y);
  if(hash(x*7,y*13)>.972&&d>9&&ovEn.length<38)ovEn.push(mkSlime(x*TS+4,y*TS+5));
  else if(hash(x*3,y*11)>.991&&d>12&&nb<8){ovEn.push({kind:'beetle',x:x*TS+4,y:y*TS+5,w:18,h:14,vx:0,vy:0,hp:3,hurt:0,t:hash(x,y)*99,st:0,dx:0,dy:0,kx:0,ky:0});nb++}
  else if(biome(x,y)==0&&hash(x*17,y*5)>.988&&d>6&&ns<5){ovEn.push({kind:'sheep',x:x*TS+4,y:y*TS+5,w:19,h:15,vx:0,vy:0,hp:99,hurt:0,t:hash(x,y)*99,dx:0,dy:0,kx:0,ky:0,shear:0});ns++}}
 bflies=[];for(let i=0;i<10;i++)bflies.push({x:(8+hash(i,4)*56)*TS,y:(6+hash(i,8)*36)*TS,t:hash(i,2)*99,c:['#ffd75e','#ff9ecf','#aee6ff'][i%3]});}
function mkSlime(x,y,shade){return{kind:shade?'shade':'slime',x,y,w:16,h:12,vx:0,vy:0,hp:shade?1:2,hurt:0,t:Math.random()*99,dx:0,dy:0,kx:0,ky:0}}
const ovGet=(x,y)=>(ov[y]&&ov[y][x])||'T';
const ovSolid=(x,y)=>{const c=ovGet(x,y);return c=='T'||c=='R'||c=='~'||c=='K'||c=='W'||c=='Y'};
const isNight=()=>dayT>.5&&dayT<.9;
// ---------- harvesting / building ----------
const NODE_HP={T:3,R:4,W:5,Y:2};
function tryBuild(){if(SAVE.blocks<=0||st!='top')return;
 const cx=Math.floor((P.x+7)/TS),cy=Math.floor((P.y+10)/TS);
 const fx=cx+Math.round(DIRV[P.dir][0]),fy=cy+Math.round(DIRV[P.dir][1]),c=ovGet(fx,fy);
 if(c!='.'&&c!=',')  {sfx('deny');return}
 for(const s of ovEn)if(s.hp>0&&Math.abs(s.x-fx*TS)<24&&Math.abs(s.y-fy*TS)<24){sfx('deny');return}
 SAVE.blocks--;ov[fy][fx]='Y';sfx('clank');puff(fx*TS+12,fy*TS+12,'#8a8a96',6);save()}
function harvest(){if(P.atk!=13)return;const sb=swordBox();
 const l=Math.floor(sb.x/TS),r=Math.floor((sb.x+sb.w-1)/TS),tt=Math.floor(sb.y/TS),b=Math.floor((sb.y+sb.h-1)/TS);
 for(let ty=tt;ty<=b;ty++)for(let tx=l;tx<=r;tx++){const c=ovGet(tx,ty),k=tx+','+ty;
  if(c=='K'){sfx('clank');ftxt(tx*TS+12,ty*TS-4,'NEEDS A BOMB!','#f88');return}
  if(!NODE_HP[c])continue;
  if(ovNode[k]==null)ovNode[k]=NODE_HP[c];
  ovNode[k]-=1+(SAVE.pick||0);sfx(c=='T'?'break':'clank');shake=Math.max(shake,1.5);
  puff(tx*TS+12,ty*TS+8,c=='T'?'#3f8a4d':c=='W'?'#b8c4d0':'#8a8a96',5,1.6);
  if(ovNode[k]<=0){delete ovNode[k];ov[ty][tx]='.';if(c!='Y')respawns.push({x:tx,y:ty,c,t:2400});
   const mat=c=='T'?'w':(c=='R'||c=='Y')?'s':'o',amt=c=='T'?2:c=='R'?2:1;
   SAVE.mats[mat]+=amt;sfx('coin');
   ftxt(tx*TS+12,ty*TS,'+'+amt+' '+(mat=='w'?'WOOD':mat=='s'?'STONE':'ORE'),mat=='o'?'#cfd8e8':'#e8c25a');
   if(c=='W')questProg('ore');
   if(!hintWood){hintWood=true;toast('PRESS R TO CRAFT!','#9ad2ff')}save()}
  return}}
function uRespawns(){for(let i=respawns.length;i--;){const r=respawns[i];
 if(--r.t<=0){if(ovGet(r.x,r.y)=='.'){ov[r.y][r.x]=r.c;respawns.splice(i,1)}else r.t=300}}}
// ---------- quests ----------
function questProg(type){const q=QUESTS.findIndex(q2=>q2.type==type);if(q<0)return;
 if(!SAVE.qon[q]||SAVE.qdone[q])return;
 SAVE.qp[q]++;if(SAVE.qp[q]>=QUESTS[q].count){SAVE.qdone[q]=true;QUESTS[q].rew();save()}
 else toast(QUESTS[q].desc+' '+SAVE.qp[q]+'/'+QUESTS[q].count,'#9ad2ff')}
function nearNPC(){for(const n of NPCS){if(Math.hypot(n.x*TS+12-(P.x+7),n.y*TS+12-(P.y+10))<34)return n}return null}
function talkNPC(n){const qi=n.q-1,Q2=QUESTS[qi];
 if(!SAVE.qon[qi]){SAVE.qon[qi]=true;say(n.name+':|'+n.txt[0]);toast('NEW QUEST: '+Q2.desc,'#9ad2ff');
  if(Q2.type=='fish')SAVE.rod=true;
  if(Q2.type=='gems')SAVE.qp[qi]=gems.reduce((a,b)=>a+b,0);save()}
 else if(SAVE.qdone[qi])say(n.name+':|MANY THANKS, HERO! GO WELL.');
 else say(n.name+':|'+n.txt[1]+'|('+Q2.desc+' '+SAVE.qp[qi]+'/'+Q2.count+')')}
// ---------- overworld update ----------
function uTop(){if(shopOpen){uShop();return}
 playT++;dayT=(dayT+1/21600)%1;
 setTheme(isNight()?'night':'ov');
 topMove(ovSolid,2.25*(SAVE.boots?1.14:1));uAtk();tryDash();uTrail();harvest();uRespawns();uBombs('top');
 const cx=Math.floor((P.x+7)/TS),cy=Math.floor((P.y+10)/TS),c=ovGet(cx,cy),tk=cx+','+cy;
 const b=biome(cx,cy);if(BIOME_NAME[b]!=region){region=BIOME_NAME[b];banner={t:0,s:region}}
 if(pTalk()){const n=nearNPC();
  const fx=cx+Math.round(DIRV[P.dir][0]),fy=cy+Math.round(DIRV[P.dir][1]);
  const fk=(ovGet(cx,cy)=='f')?cx+','+cy:(ovGet(fx,fy)=='f')?fx+','+fy:null;
  if(n)talkNPC(n);
  else if(fk){const pl=farm[fk];
   if(!pl){if(SAVE.seeds>0){SAVE.seeds--;farm[fk]={st:0,t:0};sfx('break');puff(P.x+7,P.y+8,'#9dd45e',5);save()}
    else{sfx('deny');ftxt(P.x+7,P.y-6,'NEED SEEDS!','#f88')}}
   else if(pl.st>=2){delete farm[fk];SAVE.crops+=2;sfx('coin');coinBump=10;
    puff(P.x+7,P.y,'#ffd75e',9);ftxt(P.x+7,P.y-6,'+2 WHEAT','#ffd75e');save()}
   else{sfx('msg');ftxt(P.x+7,P.y-6,'GROWING...','#9dd45e')}}
  else{if(SAVE.planks>0&&ovGet(fx,fy)=='~'){SAVE.planks--;ov[fy][fx]='=';sfx('break');puff(fx*TS+12,fy*TS+12,'#c9a86a',8);toast('PLANK PLACED!','#c9a86a');save()}
   else if(SAVE.rod){let w2=false;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(ovGet(cx+dx,cy+dy)=='~')w2=true;
    if(w2){st='fish';fish={t:0,m:0,zone:.35+Math.random()*.3,got:0,ph:0};sfx('splash');return}}}}
 for(const k in farm){const pl=farm[k];if(pl.st<2&&++pl.t>2700){pl.st++;pl.t=0;
  const[px2,py2]=k.split(',').map(Number);if(pl.st==2)puff(px2*TS+12,py2*TS+8,'#ffd75e',5)}}
 if(tk!=lastTrig){
  if(c>='1'&&c<='8'){const i=+c-1;
   if(gems[i]){lastTrig=tk;say(PALS[i].name+' IS ALREADY CLEARED.')}
   else enterDungeon(i)}
  else if(c=='O'){if(SAVE.dash){lastTrig=tk;say('THE TRAINING GROVE. DASH IS|YOURS ALREADY. (C/K/SHIFT)')}else enterDungeon(-1)}
  else if(c=='M'){lastTrig=tk;shopOpen=true;shopSel=0;sfx('sel')}
  else if(c=='B'){lastTrig=tk;const gc=gems.reduce((a,b2)=>a+b2,0);
   if(gc<8){say('THE GATE HUMS WITH HUNGER...|'+gc+'/8 GEMS. IT WILL NOT YIELD.');P.y+=8}
   else enterBoss()}
  else if(c=='V'){enterCave(cx,cy);return}
  else if(c=='H'){lastTrig=tk;if(hp<maxhp){hp=maxhp;sfx('heal');puff(P.x+7,P.y,'#8ff',12);ftxt(P.x+7,P.y-6,'HP MAX!','#8ff')}}
  else if(c=='C'){lastTrig=tk;if(!SAVE.chests.includes(tk)){SAVE.chests.push(tk);sfx('chest');
   const kind=CHESTS[tk];
   if(kind=='mimic'){ovEn.push({kind:'mimic',x:cx*TS+3,y:cy*TS+5,w:18,h:14,vx:0,vy:0,hp:4,hurt:0,t:Math.random()*9,dx:0,dy:0,kx:0,ky:0});
    toast('A MIMIC!','#f66');sfx('kill');shake=5}
   else if(kind=='hp'){SAVE.pieces++;toast('HEART PIECE!','#f66');checkPieces()}
   else if(kind=='doll'){questProg('doll');say("YOU FOUND A SMALL RAG DOLL.|MAE WILL BE OVERJOYED!")}
   else if(kind=='coin4'){coins+=40;coinBump=10;ftxt(P.x+7,P.y-6,'+40','#ffd700');toast('ISLAND TREASURE!','#ffd700')}
   else{coins+=30;coinBump=10;ftxt(P.x+7,P.y-6,'+30','#ffd700')}save()}}
  else if(c=='h'){lastTrig=tk;if(!SAVE.chests.includes(tk)){SAVE.chests.push(tk);SAVE.pieces++;sfx('gem');toast('HEART PIECE!','#f66');checkPieces();save()}}
  else if(c=='z'){ov[cy][cx]='.';SAVE.shards++;sfx('coin');puff(P.x+7,P.y+4,'#ffe66e',7);ftxt(P.x+7,P.y-6,'SHARD '+SAVE.shards+'/30','#ffe66e');save()}
  else if(c=='!'){lastTrig=tk;say(SIGNS[tk]||'...')}
  else lastTrig=null}
 // night shades
 if(isNight()){const shades=ovEn.filter(s=>s.kind=='shade'&&s.hp>0).length;
  if(shades<3&&frame%100==0){const a=Math.random()*6.28,d2=160+Math.random()*90;
   const sx2=P.x+Math.cos(a)*d2,sy2=P.y+Math.sin(a)*d2,tx2=Math.floor(sx2/TS),ty2=Math.floor(sy2/TS);
   if(ovGet(tx2,ty2)=='.'){ovEn.push(mkSlime(sx2,sy2,true));puff(sx2+8,sy2+6,'#7a5aa8',8)}}}
 else for(const s of ovEn)if(s.kind=='shade'&&s.hp>0){s.hp=0;puff(s.x+8,s.y+6,'#7a5aa8',6)}
 for(const s of ovEn){if(s.hp<=0)continue;
  if(s.kind=='beetle')uBeetle(s,ovSolid,P);
  else if(s.kind=='sheep'){s.t+=.05;s.shear>0&&s.shear--;s.hurt>0&&s.hurt--;
   if(s.kx||s.ky){s.vx=s.kx;s.vy=s.ky;s.kx*=.9;s.ky*=.9;if(Math.abs(s.kx)<.3)s.kx=s.ky=0}
   else{if(Math.random()<.008){s.dx=Math.random()-.5;s.dy=Math.random()-.5}s.vx=s.dx*.5;s.vy=s.dy*.5}
   move(s,ovSolid);
   if(P.atk==13&&s.shear<=0&&ovl(swordBox(),s)){s.shear=240;s.hurt=10;SAVE.mats.wl++;sfx('coin');
    const a=Math.atan2(s.y-P.y,s.x-P.x);s.kx=Math.cos(a)*5;s.ky=Math.sin(a)*5;
    puff(s.x+9,s.y+4,'#fff',10);ftxt(s.x+9,s.y-6,'+1 WOOL','#fff');save()}
   continue}
  else{const sp2=s.kind=='shade'?1.35:1;uSlime(s,ovSolid,P,sp2)}
  if(s.kind!='sheep'&&s.hurt<=0&&P.inv<=0&&P.dashT<=0&&ovl(P,s))dmg(1)}
 hitEnemies(ovEn.filter(s=>s.hp>0&&s.kind!='sheep'),s=>{
  if(s.kind=='slime')questProg('kill');
  if(s.kind=='shade'&&Math.random()<.3){SAVE.shards++;ftxt(s.x,s.y-8,'SHARD!','#ffe66e');save()}
  if(s.kind=='beetle'){SAVE.mats.o++;questProg('ore');ftxt(s.x,s.y-8,'+1 ORE','#cfd8e8');save()}
  if(s.kind=='mimic'){coins+=25;coinBump=10;toast('MIMIC SLAIN! +25 COINS','#ffd700');save()}});
 for(const b2 of bflies){b2.t+=.06;b2.x+=Math.sin(b2.t)*.9;b2.y+=Math.cos(b2.t*1.3)*.5}
 P.inv>0&&P.inv--;if(P.blink>0)P.blink--;else if(Math.random()<.006)P.blink=6;
 const txp=isoX(P.x+7,P.y+10),typ=isoY(P.x+7,P.y+10);
 cam.x=lerp(cam.x,txp-W/2+DIRV[P.dir][0]*30,.08);cam.y=lerp(cam.y,typ-H/2+DIRV[P.dir][1]*15,.08)}
function uSlime(s,solid,tgt,spMul){s.t+=.08;s.hurt>0&&s.hurt--;spMul=spMul||1;
 const sp2=(SAVE.hero?1.4:1)*spMul;
 const d=Math.hypot(tgt.x-s.x,tgt.y-s.y)||1;
 if(s.kx||s.ky){s.vx=s.kx;s.vy=s.ky;s.kx*=.8;s.ky*=.8;if(Math.abs(s.kx)<.2)s.kx=s.ky=0}
 else if(d<140){const m=Math.sin(s.t*4)>0?.93*sp2:.12;s.vx=(tgt.x-s.x)/d*m;s.vy=(tgt.y-s.y)/d*m}
 else{if(Math.random()<.01){s.dx=(Math.random()-.5);s.dy=(Math.random()-.5)}s.vx=s.dx*.45;s.vy=s.dy*.45}
 move(s,solid)}
// ---------- caves ----------
function enterCave(tx,ty){sfx('door');fadeTo(()=>{st='cave';setTheme('dun');
 seed=tx*97+ty*13;const w2=16,h2=11;
 const t=Array.from({length:h2},(_,y)=>Array.from({length:w2},(_,x)=>
  (x==0||y==0||x==w2-1||y==h2-1)?'#':rng()<.1?'#':rng()<.12?'W':rng()<.05?'X':'.'));
 t[h2-2][2]='V';t[2][w2-3]='C';t[5][7]='.';
 cave={t,w:w2,h:h2,ox:tx,oy:ty,key:'cave:'+tx+','+ty};
 caveEn=[];for(let i=0;i<3;i++)caveEn.push(mkSlime((4+i*3)*TS,(3+(i%2)*3)*TS));
 if(tx==KROCKS[2][0]&&ty==KROCKS[2][1]&&!SAVE.chests.includes('rockking'))
  caveEn.push({kind:'rock',x:9*TS,y:4*TS,w:30,h:20,vx:0,vy:0,hp:16,hurt:0,t:0,dx:0,dy:0,kx:0,ky:0});
 P.x=2*TS+5;P.y=(h2-3)*TS+5;P.vx=P.vy=0;P.dir='up';P.inv=40;
 banner={t:0,s:'OLD CAVE'}})}
const caveGet=(x,y)=>(cave.t[y]&&cave.t[y][x])||'#';
const caveSolid=(x,y)=>{const c=caveGet(x,y);return c=='#'||c=='W'}
function uCave(){playT++;topMove(caveSolid,2.25*(SAVE.boots?1.14:1));uAtk();tryDash();uTrail();uBombs('cave');
 // mining in cave
 if(P.atk==13){const sb=swordBox();
  const l=Math.floor(sb.x/TS),r=Math.floor((sb.x+sb.w-1)/TS),tt=Math.floor(sb.y/TS),b=Math.floor((sb.y+sb.h-1)/TS);
  loop:for(let ty=tt;ty<=b;ty++)for(let tx=l;tx<=r;tx++){const k='c'+tx+','+ty,cc=caveGet(tx,ty);
   if(cc=='X'&&(SAVE.pick||0)<2){sfx('clank');ftxt(tx*TS+12,ty*TS,'NEEDS IRON PICK!','#f88');break loop}
   if(cc=='W'||cc=='X'){if(ovNode[k]==null)ovNode[k]=cc=='W'?4:6;
    ovNode[k]-=1+(SAVE.pick||0);sfx('clank');puff(tx*TS+12,ty*TS+12,cc=='X'?'#c9a5ff':'#b8c4d0',5,1.6);
    if(ovNode[k]<=0){delete ovNode[k];cave.t[ty][tx]='.';
     if(cc=='X'){SAVE.shards+=3;sfx('gem');ftxt(tx*TS+12,ty*TS,'+3 SHARDS!','#c9a5ff')}
     else{SAVE.mats.o++;questProg('ore');sfx('coin');ftxt(tx*TS+12,ty*TS,'+1 ORE','#cfd8e8')}save()}
    break loop}}}
 const cx=Math.floor((P.x+7)/TS),cy=Math.floor((P.y+10)/TS),c=caveGet(cx,cy),tk=cx+','+cy;
 if(c=='V'){fadeTo(()=>{st='top';setTheme(isNight()?'night':'ov');
  P.x=cave.ox*TS+5;P.y=(cave.oy+1)*TS+3;P.vx=P.vy=0;P.dir='down';lastTrig=null});return}
 if(c=='C'&&!SAVE.chests.includes(cave.key)){SAVE.chests.push(cave.key);sfx('chest');
  coins+=20;SAVE.shards+=2;SAVE.mats.o+=2;coinBump=10;
  toast('CAVE HOARD! +20C +2SH +2ORE','#ffd700');save()}
 for(const s of caveEn){if(s.hp<=0)continue;uSlime(s,caveSolid,P,s.kind=='rock'?.8:1);
  if(s.hurt<=0&&P.inv<=0&&P.dashT<=0&&ovl(P,s))dmg(1)}
 hitEnemies(caveEn.filter(s=>s.hp>0),s=>{
  if(s.kind=='rock'){SAVE.chests.push('rockking');SAVE.mats.o+=3;SAVE.pieces++;
   toast('ROCK KING FELLED!','#ff8');toast('+3 ORE +HEART PIECE','#f66');checkPieces();shake=8;sfx('boom');save()}});
 P.inv>0&&P.inv--;
 cam.x=lerp(cam.x,isoX(P.x+7,P.y+10)-W/2,.1);cam.y=lerp(cam.y,isoY(P.x+7,P.y+10)-H/2,.1)}
function dCave(){px(0,0,W,H,'#0a0810');
 g.save();g.translate(-(cam.x|0),-(cam.y|0));
 const list=[];
 for(let ty=0;ty<cave.h;ty++)for(let tx=0;tx<cave.w;tx++){
  const cx=isoX(tx*TS,ty*TS)+12,cy=isoY(tx*TS,ty*TS)+12,c=cave.t[ty][tx];
  if(c=='#'){list.push({d:(tx+ty)*TS+TS,f:()=>isoBlock(cx,cy,18,'#4a4456','#3a3444','#2c2836')});continue}
  diamond(cx,cy,(tx+ty)%2?'#3c3648':'#443d50');
  if(c=='W')list.push({d:(tx+ty)*TS+TS,f:()=>{isoBlock(cx,cy,12,'#5a6470','#4a5460','#3c4450');
   px(cx-6,cy-10,3,3,'#b8c4d0');px(cx+2,cy-14,3,3,'#b8c4d0');px(cx-1,cy-7,2,2,'#dfe8f0')}});
  else if(c=='X')list.push({d:(tx+ty)*TS+TS,f:()=>{isoBlock(cx,cy,12,'#4a4060','#3c3450','#302a42');
   px(cx-5,cy-12,4,6,'#c9a5ff');px(cx+2,cy-16,3,5,'#c9a5ff');px(cx-1,cy-8,3,4,'#e0ccff');
   if((frame+tx*9)%50<5)px(cx+4,cy-19,2,2,'#fff')}});
  else if(c=='C')list.push({d:(tx+ty)*TS+TS,f:()=>{const open=SAVE.chests.includes(cave.key);
   px(cx-8,cy-11,16,11,open?'#5c4426':'#8a6430');px(cx-8,cy-11,16,4,open?'#493018':'#a87c42');px(cx-1,cy-8,3,4,'#ffd700')}});
  else if(c=='V')list.push({d:(tx+ty)*TS+TS,f:()=>{px(cx-8,cy-14,16,14,'#0c0a12');T('~',cx,cy-22,'#9ad2ff',1,'center')}})}
 for(const s of caveEn)if(s.hp>0){const sx=isoX(s.x+8,s.y+6),sy=isoY(s.x+8,s.y+6);
  list.push({d:s.x+s.y,f:()=>{g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(sx,sy+5,s.kind=='rock'?14:8,s.kind=='rock'?6:3.5,0,0,7);g.fill();
   if(s.kind=='rock')drawRock(sx-15,sy-16,s);else drawSlime(sx-8,sy-9,s)}})}
 list.push({d:P.x+P.y+20,f:()=>drawHeroIso(isoX(P.x+7,P.y+10),isoY(P.x+7,P.y+10)+5)});
 dBombsList(list);
 list.sort((a,b)=>a.d-b.d);for(const it of list)it.f();
 dParts(true);g.restore();
 lightPass(.78,[{x:isoX(P.x+7,P.y+10)-cam.x,y:isoY(P.x+7,P.y+10)-cam.y-8,r:105},
  {x:isoX(2*TS,2*TS)-cam.x,y:isoY(2*TS,2*TS)-cam.y,r:50,a:.6},{x:isoX(13*TS,8*TS)-cam.x,y:isoY(13*TS,8*TS)-cam.y,r:50,a:.6}]);
 hud();T('OLD CAVE - E EXIT AT LADDER',6,H-10,'#9ad2ff')}
// ---------- fishing ----------
let fish=null;
function uFish(){fish.t++;fish.ph+=.035+Math.sin(fish.t/90)*.012;
 const m=(Math.sin(fish.ph)+1)/2;fish.m=m;
 if(prs('Escape')){st='top';return}
 if(prs('Space','Enter','KeyZ')){
  if(Math.abs(m-fish.zone)<.09){const big=Math.abs(m-fish.zone)<.035;
   SAVE.fish++;coins+=big?12:6;coinBump=10;sfx('fish');questProg('fish');
   toast((big?'BIG ':'')+'FISH! +'+(big?12:6)+'C','#9ad2ff');save()}
  else{sfx('deny');toast('IT GOT AWAY...','#8890b0')}
  st='top';P.inv=20}}
function dFish(){dOverworld();
 px(W/2-90,H-70,180,44,'rgba(8,10,22,.92)');g.strokeStyle='#9ad2ff';g.strokeRect(W/2-89.5,H-69.5,179,43);
 T('HOOK THE FISH! (SPACE)',W/2,H-64,'#9ad2ff',1,'center');
 const bx=W/2-80,bw=160;px(bx,H-48,bw,10,'#1a2a3a');
 px(bx+fish.zone*bw-7,H-48,14,10,'#2f8038');px(bx+fish.zone*bw-2,H-48,5,10,'#57c26a');
 const mx=bx+fish.m*bw;px(mx-1,H-51,3,16,'#fff');
 T('ESC TO LEAVE',W/2,H-34,'#556',1,'center')}
// ---------- iso overworld drawing ----------
function skyTint(){const d2=dayT;
 if(d2<.4)return[0,''];if(d2<.5)return[(d2-.4)*4,'rgba(255,140,60,'];
 if(d2<.9)return[.52,'rgba(10,10,50,'];return[(1-d2)*5.2,'rgba(255,140,60,']}
function dOverworld(){
 const grd=g.createLinearGradient(0,0,0,H);grd.addColorStop(0,'#2d5c38');grd.addColorStop(1,'#1d3f26');g.fillStyle=grd;g.fillRect(0,0,W,H);
 g.save();const shx=shake?(Math.random()*shake-shake/2)|0:0;
 g.translate(-(cam.x|0)+shx,-(cam.y|0)+(shake?(Math.random()*shake-shake/2)|0:0));
 const list=[];
 for(let ty=0;ty<ovH;ty++)for(let tx=0;tx<ovW;tx++){
  const cx=isoX(tx*TS,ty*TS)+TS/2- -12,cy=isoY(tx*TS,ty*TS)+12;
  const scx=cx-cam.x,scy=cy-cam.y;if(scx<-60||scx>W+60||scy<-80||scy>H+40)continue;
  const c=ov[ty][tx],b=biome(tx,ty);
  if(c=='~'){g.drawImage(IMG['w'+((frame>>4)+((tx+ty)&1)*2)%4],cx-24,cy-16);
   if(ovGet(tx,ty-1)!='~'&&ovGet(tx,ty-1)!='T')px(cx-12,cy-9,10,2,'#bde6ff');continue}
  if(c=='='){g.drawImage(IMG['w'+((frame>>4)%4)],cx-24,cy-16);
   px(cx-16,cy-6,32,8,'#a87c42');px(cx-16,cy-6,32,2,'#c9a86a');px(cx-4,cy-6,2,8,'#7a5a30');continue}
  if(c=='f'){diamond(cx,cy,'#5a4030');diamond(cx,cy-1,'#6e4e3a');
   for(let i=0;i<3;i++)px(cx-10+i*8,cy-2,4,1,'#4a3428');
   const pl=farm[tx+','+ty];
   if(pl){if(pl.st==0)px(cx-1,cy-5,2,4,'#7dbf5e');
    else if(pl.st==1){px(cx-1,cy-8,2,7,'#5aa34a');px(cx-4,cy-6,3,2,'#7dbf5e');px(cx+2,cy-7,3,2,'#7dbf5e')}
    else{px(cx-1,cy-10,2,9,'#b8983f');px(cx-3,cy-13,6,5,'#ffd75e');px(cx-2,cy-14,4,1,'#ffe89a');
     if((frame+tx*7)%40<4)px(cx+4,cy-15,2,2,'#fff')}}
   continue}
  g.drawImage(c==','?IMG.path:IMG['g'+b],cx-24,cy-12);
  const h2=hash(tx,ty);
  if(c=='.'){if(h2>.9&&h2<.96&&b!=2&&b!=5){const fc=['#e8e06a','#e88ac2','#9ad2ff'][(h2*50|0)%3];px(cx+2,cy-2,3,3,fc);px(cx+2,cy-3,3,1,'#fff8')}
   if(b==2&&h2<.1)px(cx-4,cy,5,2,'#bf9c52');
   if(b==5&&h2<.15)px(cx-3,cy-1,4,3,'#3a2a28')}
  tallOv(tx,ty,c,b,cx,cy,list)}
 for(const s of ovEn){if(s.hp<=0)continue;const sx=isoX(s.x+8,s.y+6),sy=isoY(s.x+8,s.y+6);
  list.push({d:s.x+s.y,f:()=>{g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(sx,sy+5,8,3.5,0,0,7);g.fill();
   if(s.kind=='beetle')drawBeetle(sx-9,sy-11,s);
   else if(s.kind=='sheep')drawSheep(sx-9,sy-12,s);
   else if(s.kind=='shade')drawShade(sx-8,sy-9,s);
   else if(s.kind=='mimic')drawMimic(sx-9,sy-11,s);
   else drawSlime(sx-8,sy-9,s)}})}
 for(const n of NPCS)list.push({d:n.x*TS+n.y*TS+12,f:()=>drawNPC(isoX(n.x*TS+12,n.y*TS+12),isoY(n.x*TS+12,n.y*TS+12)+6,n)});
 list.push({d:P.x+P.y+20,f:()=>drawHeroIso(isoX(P.x+7,P.y+10),isoY(P.x+7,P.y+10)+5)});
 dBombsList(list);
 for(const b2 of bflies)list.push({d:b2.x+b2.y+900,f:()=>{const sx=isoX(b2.x,b2.y),sy=isoY(b2.x,b2.y)-18+Math.sin(b2.t*2)*4,f2=(frame>>2)&1;
  px(sx-3+f2,sy,3,3,b2.c);px(sx+1-f2,sy,3,3,b2.c)}});
 list.sort((a,b2)=>a.d-b2.d);for(const it of list)it.f();
 dParts(true);g.restore();
 const[ta,tc]=skyTint();
 if(tc&&ta>0){if(tc.includes('10,10')){const lights=[{x:isoX(P.x+7,P.y+10)-cam.x,y:isoY(P.x+7,P.y+10)-cam.y-8,r:95}];
   for(const n of NPCS){const lx=isoX(n.x*TS,n.y*TS)-cam.x,ly=isoY(n.x*TS,n.y*TS)-cam.y;if(lx>-40&&lx<W+40)lights.push({x:lx,y:ly,r:40,a:.8})}
   for(const bm of bombs){const lx=isoX(bm.x,bm.y)-cam.x,ly=isoY(bm.x,bm.y)-cam.y;lights.push({x:lx,y:ly,r:30,a:.7})}
   lightPass(ta,lights);
   if(frame%9==0&&Math.random()<.5)parts.push({x:P.x+(Math.random()-.5)*260,y:P.y+(Math.random()-.5)*160,vx:0,vy:-.1,life:60,c:'#cfe87a',s:1,z:14+Math.random()*16})}
  else{g.fillStyle=tc+(ta*.35)+')';g.fillRect(0,0,W,H)}}
 const nn=nearNPC();if(nn&&st=='top')TO('E: TALK TO '+nn.name,W/2,H-30,'#fff',1,'center');
 else if(st=='top'&&SAVE.planks>0){const fx=Math.floor((P.x+7)/TS)+Math.round(DIRV[P.dir][0]),fy=Math.floor((P.y+10)/TS)+Math.round(DIRV[P.dir][1]);
  if(ovGet(fx,fy)=='~')TO('E: PLACE PLANK ('+SAVE.planks+')',W/2,H-30,'#c9a86a',1,'center')}
 hud();T('GEMS '+gems.reduce((a,b2)=>a+b2,0)+'/8',6,H-10,'#cfd8dc');
 if(isNight())T('NIGHT - BEWARE',6,H-18,'#9a8ad2');
 if(shopOpen)dShop()}
function tallOv(tx,ty,c,b,cx,cy,list){const d=(tx+ty)*TS+TS;
 const nk=tx+','+ty,dmgd=ovNode[nk]!=null;
 if(c=='T')list.push({d,f:()=>{if(dmgd&&(frame>>1)&1)g.globalAlpha=.7;drawTreeG(cx,cy,tx,ty,b==1?1:b==2?2:b==3?3:b==4?4:0);g.globalAlpha=1}});
 else if(c=='R')list.push({d,f:()=>{isoBlock(cx,cy,14,b==5?'#7d5a52':'#8a8a96',b==5?'#6b4a44':'#6b6b76',b==5?'#553a36':'#55555e');
  if(dmgd){px(cx-6,cy-10,8,1,'#333');px(cx-2,cy-14,1,5,'#333')}}});
 else if(c=='W')list.push({d,f:()=>{isoBlock(cx,cy,14,'#5a6470','#4a5460','#3c4450');
  px(cx-8,cy-10,3,3,'#b8c4d0');px(cx+4,cy-16,3,3,'#b8c4d0');px(cx-2,cy-7,3,3,'#b8c4d0');
  if((frame+tx*9)%70<5)px(cx+1,cy-18,2,2,'#fff');
  if(dmgd){px(cx-6,cy-12,9,1,'#222');px(cx,cy-16,1,6,'#222')}}});
 else if(c=='Y')list.push({d,f:()=>{isoBlock(cx,cy,13,'#9a9aa8','#7d7d8c','#666672');
  px(cx-14,cy-9,10,1,'#565660');px(cx+4,cy-9,10,1,'#565660');px(cx-4,cy-15,9,1,'#565660');
  if(dmgd){px(cx-4,cy-12,8,1,'#222')}}});
 else if(c=='K')list.push({d,f:()=>{isoBlock(cx,cy,16,'#7a7264','#665e52','#524a40');
  px(cx-9,cy-14,12,2,'#2c2820');px(cx-2,cy-20,2,8,'#2c2820');px(cx+3,cy-11,7,2,'#2c2820');
  px(cx-4,cy-24,8,3,'#2c2820')}});
 else if(c=='V')list.push({d,f:()=>{px(cx-11,cy-8,22,10,'#3c3630');px(cx-8,cy-12,16,14,'#0c0a12');
  if((frame>>4)&1)px(cx-1,cy-6,2,2,'#9ad2ff')}});
 else if(c>='1'&&c<='8'){const i=+c-1;list.push({d,f:()=>{
  isoBlock(cx,cy,20,'#6b6b76','#5c5c66','#4a4a52');
  px(cx-7,cy-20,14,14,'#0c0c12');px(cx-9,cy-34,18,7,PALS[i].blk);T(c,cx,cy-33,'#fff',1,'center');
  if(gems[i])drawGemIcon(cx-3,cy-14,PALS[i].gem);
  if(!gems[i]&&(frame>>4)&1)px(cx-1,cy-16,2,2,PALS[i].gem)}})}
 else if(c=='O')list.push({d,f:()=>{isoBlock(cx,cy,17,'#7d9a5a','#6a8a4a','#57703c');
  px(cx-7,cy-17,14,13,'#12200e');T('O',cx,cy-30,'#dfffd0',1,'center')}});
 else if(c=='M')list.push({d,f:()=>{isoBlock(cx,cy,17,'#b3763a','#96602c','#7d4f24');
  g.fillStyle='#d9534f';g.beginPath();g.moveTo(cx-20,cy-17);g.lineTo(cx,cy-31);g.lineTo(cx+20,cy-17);g.closePath();g.fill();
  g.fillStyle='#b13a36';g.beginPath();g.moveTo(cx-20,cy-17);g.lineTo(cx,cy-29);g.lineTo(cx,cy-31);g.closePath();g.fill();
  px(cx-16,cy-17,32,4,'#f0e6c8');T('SHOP',cx,cy-16,'#5a3a1a',1,'center');
  const s={t:frame/40,hurt:0};drawSlime(cx-8,cy-42+Math.sin(frame/20),s);px(cx-8,cy-46,16,3,'#7a4a1e')}});
 else if(c=='B')list.push({d,f:()=>{
  isoBlock(cx-24,cy-12,26,'#5c5c68','#4a4a55','#3d3d47');isoBlock(cx+24,cy-12,26,'#5c5c68','#4a4a55','#3d3d47');
  isoBlock(cx,cy-24,38,'#6b6b78','#5a5a66','#484852');
  px(cx-8,cy-20,16,16,'#111119');
  const gl=Math.sin(frame/20)*.5+.5;g.fillStyle='rgba(255,80,80,'+gl*.25+')';g.fillRect(cx-8,cy-20,16,16);
  for(let i=0;i<8;i++){if(gems[i])drawGemIcon(cx-19+i*5,cy-46,PALS[i].gem);else px(cx-19+i*5,cy-46,4,4,'#2c2c36')}}});
 else if(c=='H')list.push({d,f:()=>{isoBlock(cx,cy,7,'#9db3c9','#8299b3','#6d84a0');
  px(cx-5,cy-15,10,9,'#3fa9e0');px(cx-5,cy-15,10,3,'#8fd4f5');
  const s2=(frame>>3)&3;px(cx-3,cy-20+s2,6,3,'#aee6ff')}});
 else if(c=='C')list.push({d,f:()=>{const open=SAVE.chests.includes(tx+','+ty);
  px(cx-8,cy-11,16,11,open?'#5c4426':'#8a6430');px(cx-8,cy-11,16,4,open?'#493018':'#a87c42');
  px(cx-1,cy-8,3,4,'#ffd700');if(!open&&(frame>>4)&1)px(cx+5,cy-15,2,2,'#fff')}});
 else if(c=='h')list.push({d,f:()=>{if(SAVE.chests.includes(tx+','+ty))return;
  const bb=Math.sin(frame/14)*2;g.save();g.translate(cx-4,cy-14+bb);g.scale(1.4,1.4);drawHeart(0,0,2);g.restore();
  for(let i=0;i<2;i++)px(cx-8+((frame>>2)+i*7)%16,cy-18+bb+i*3,1,1,'#fff')}});
 else if(c=='z')list.push({d,f:()=>{const bb=Math.sin(frame/11+tx)*2;
  px(cx-2,cy-12+bb,4,6,'#ffe66e');px(cx-1,cy-13+bb,2,1,'#fff');px(cx-1,cy-9+bb,2,2,'#d9b23f');
  if((frame+tx*7)%50<4)px(cx+3,cy-15+bb,2,2,'#fff')}});
 else if(c=='!')list.push({d,f:()=>{px(cx-1,cy-11,3,12,'#6e4a2a');px(cx-8,cy-19,16,9,'#c9a86a');
  px(cx-6,cy-17,12,2,'#6e4a2a');px(cx-6,cy-14,9,2,'#6e4a2a')}})}
// ---------- overlays ----------
function dMap(){px(W/2-160,H/2-110,320,220,'rgba(8,8,18,.94)');g.strokeStyle='#c9a86a';g.strokeRect(W/2-159.5,H/2-109.5,319,219);
 T('WORLD MAP  (TAB TO CLOSE)',W/2,H/2-102,'#ffd75e',1,'center');
 const mx=W/2-144,my=H/2-88,s=4;
 for(let y=0;y<ovH;y++)for(let x=0;x<ovW;x++){const c=ov[y][x];let col=BIOME_C[biome(x,y)][0];
  if(c=='~')col='#2e6bb3';else if(c=='T')col='#1d4a26';else if(c==',')col='#c8a06a';else if(c=='R'||c=='K')col='#666';else if(c=='W')col='#8a95a5';
  px(mx+x*s,my+y*s,s,s,col)}
 DOORS.forEach((d,i)=>{px(mx+d[0]*s-2,my+d[1]*s-2,8,8,gems[i]?'#39d353':'#0c0c12');T(''+(i+1),mx+d[0]*s+2,my+d[1]*s-1,'#fff',1,'center')});
 px(mx+GATE[0]*s-3,my+GATE[1]*s-2,10,8,'#a33');T('B',mx+GATE[0]*s+2,my+GATE[1]*s,'#fff',1,'center');
 px(mx+SHOP[0]*s,my+SHOP[1]*s,4,4,'#ffd75e');px(mx+TUT[0]*s,my+TUT[1]*s,4,4,'#9f9');
 if((frame>>3)&1){const pxx=mx+(P.x/TS)*s,pyy=my+(P.y/TS)*s;px(pxx-2,pyy-2,5,5,'#fff');px(pxx-1,pyy-1,3,3,'#e33')}
 T('VILLAGE: CENTER - GATE: NORTH',W/2,H/2+98,'#8890b0',1,'center')}
function dQuests(){px(W/2-120,H/2-90,240,180,'rgba(8,8,18,.94)');g.strokeStyle='#9ad2ff';g.strokeRect(W/2-119.5,H/2-89.5,239,179);
 T('QUEST LOG  (Q TO CLOSE)',W/2,H/2-82,'#9ad2ff',1,'center');
 let y=H/2-64;
 QUESTS.forEach((q,i)=>{if(!SAVE.qon[i]){T('? - - - - - - -',W/2-104,y,'#3a3f55');y+=26;return}
  T(q.giver,W/2-104,y,SAVE.qdone[i]?'#5a7':'#fff');
  T(q.desc+(SAVE.qdone[i]?' - DONE!':' ('+SAVE.qp[i]+'/'+q.count+')'),W/2-104,y+9,SAVE.qdone[i]?'#5a7':'#aab');y+=26});
 T('SHARDS '+SAVE.shards+'/30   PIECES '+SAVE.pieces+'/4   FISH '+SAVE.fish,W/2,H/2+74,'#ffe66e',1,'center')}

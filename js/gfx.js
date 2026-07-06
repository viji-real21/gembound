'use strict';
// ============ GFX: iso primitives, prerendered tiles, sprites ============
function diamond(cx,cy,c,ctx){ctx=ctx||g;ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(cx,cy-12);ctx.lineTo(cx+24,cy);ctx.lineTo(cx,cy+12);ctx.lineTo(cx-24,cy);ctx.closePath();ctx.fill()}
function isoBlock(cx,cy,h,ct,cl,cr){
 g.fillStyle=cl;g.beginPath();g.moveTo(cx-24,cy);g.lineTo(cx,cy+12);g.lineTo(cx,cy+12-h);g.lineTo(cx-24,cy-h);g.closePath();g.fill();
 g.fillStyle=cr;g.beginPath();g.moveTo(cx+24,cy);g.lineTo(cx,cy+12);g.lineTo(cx,cy+12-h);g.lineTo(cx+24,cy-h);g.closePath();g.fill();
 diamond(cx,cy-h,ct);
 g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.moveTo(cx-24,cy-h);g.lineTo(cx,cy-h-12);g.lineTo(cx+24,cy-h);g.lineTo(cx,cy-h-10);g.closePath();g.fill()}
// biome ground colors: [base, light-speckle, dark-speckle]
const BIOME_C=[['#3e8948','#54a35e','#2f7038'],['#2f7a3e','#3f9450','#255f30'],['#d8b56a','#e8cd8c','#bf9c52'],['#dfeef4','#ffffff','#bccfd8'],['#4a6b45','#5c8055','#3a5636'],['#6b4a44','#7d5a52','#553a36']];
const IMG={};
function prerender(){
 for(let b=0;b<6;b++)IMG['g'+b]=makeCv(48,24,(c2)=>{const cg=c2;
  cg.fillStyle=BIOME_C[b][0];cg.beginPath();cg.moveTo(24,0);cg.lineTo(48,12);cg.lineTo(24,24);cg.lineTo(0,12);cg.closePath();cg.fill();
  cg.save();cg.clip();
  for(let i=0;i<14;i++){const h2=hash(i,b);cg.fillStyle=h2<.5?BIOME_C[b][1]:BIOME_C[b][2];
   cg.fillRect(6+h2*36,4+hash(b,i)*16,2,1)}
  cg.fillStyle='rgba(255,255,255,.06)';cg.beginPath();cg.moveTo(0,12);cg.lineTo(24,0);cg.lineTo(48,12);cg.lineTo(24,2);cg.closePath();cg.fill();
  cg.restore()});
 IMG.path=makeCv(48,24,(cg)=>{cg.fillStyle='#c8a06a';cg.beginPath();cg.moveTo(24,0);cg.lineTo(48,12);cg.lineTo(24,24);cg.lineTo(0,12);cg.closePath();cg.fill();
  cg.save();cg.clip();for(let i=0;i<8;i++)cg.fillStyle=i%2?'#b58e57':'#d4af7c',cg.fillRect(8+hash(i,3)*32,6+hash(2,i)*12,3,1);
  cg.fillStyle='rgba(0,0,0,.1)';cg.beginPath();cg.moveTo(0,12);cg.lineTo(24,24);cg.lineTo(48,12);cg.lineTo(24,22);cg.closePath();cg.fill();cg.restore()});
 for(let f=0;f<4;f++)IMG['w'+f]=makeCv(48,28,(cg)=>{
  cg.fillStyle='#2e6bb3';cg.beginPath();cg.moveTo(24,4);cg.lineTo(48,16);cg.lineTo(24,28);cg.lineTo(0,16);cg.closePath();cg.fill();
  cg.save();cg.clip();cg.fillStyle='#4585cc';
  for(let i=0;i<4;i++)cg.fillRect(4+((i*13+f*4)%36),8+i*5,7,1);
  cg.fillStyle='#7db2e0';for(let i=0;i<3;i++)cg.fillRect(10+((i*17+f*6)%28),10+i*6,3,1);cg.restore()})}
// ---------- HERO ----------
const SK='#f2c99a',SK2='#d9a877',HR='#8a4a22',HR2='#a8632f',TU='#3fa34d',TU2='#57c26a',TU3='#2f8038',PN='#35406e',CP='#c0392b',CP2='#96281b';
function heroSprite(x,y,d,wf,opts){opts=opts||{};const atk=opts.atk||0,blink=opts.blink,sq=opts.sq||0,str=opts.str||0;
 x|=0;y=(y|0)-str+sq;
 // cape
 const cw=Math.sin(frame/5)*(opts.mov?3:.8),cdir=d=='left'?1:-1;
 if(d!='down'){g.fillStyle=CP;g.beginPath();g.moveTo(x+(cdir>0?12:2),y+6);g.lineTo(x+7+cdir*(9+cw),y+16);g.lineTo(x+(cdir>0?11:3),y+15);g.closePath();g.fill();
  g.fillStyle=CP2;g.fillRect(x+(cdir>0?11:2),y+6,1,3)}
 // legs (4-frame)
 const lo=[0,2,0,-2][wf],ro=[0,-2,0,2][wf];
 px(x+3,y+15+Math.max(0,lo),3,5-Math.max(0,lo),PN);px(x+8,y+15+Math.max(0,ro),3,5-Math.max(0,ro),PN);
 px(x+3,y+19,3,1,'#20242e');px(x+8,y+19,3,1,'#20242e');
 // body
 px(x+2,y+7,10,9,TU);px(x+2,y+7,10,2,TU2);px(x+2,y+14,10,2,TU3);
 px(x+2,y+12,10,1,'#7a4a1e');px(x+6,y+12,2,1,'#e8c25a');
 // arms swing
 const asw=[0,1,0,-1][wf];
 if(d!='up'){px(x+1,y+8+asw,1,4,SK);px(x+12,y+8-asw,1,4,SK)}
 // head w/ outline shading
 px(x+2,y,10,7,SK);px(x+2,y+5,10,2,SK2);
 if(d=='up'){px(x+2,y,10,7,HR);px(x+2,y,10,2,HR2)}
 else{px(x+2,y,10,3,HR);px(x+2,y,10,1,HR2);px(x+2,y+2,1,3,HR);px(x+11,y+2,1,3,HR);
  if(blink){if(d=='down'){px(x+4,y+4,2,1,'#a67');px(x+8,y+4,2,1,'#a67')}else px(d=='left'?x+3:x+9,y+4,2,1,'#a67')}
  else if(d=='down'){px(x+4,y+3,2,2,'#26221f');px(x+8,y+3,2,2,'#26221f');px(x+4,y+3,1,1,'#4a443f');px(x+8,y+3,1,1,'#4a443f')}
  else if(d=='left'){px(x+3,y+3,2,2,'#26221f')}
  else px(x+9,y+3,2,2,'#26221f')}
 // sword
 if(atk>0){const ph=atk>13?0:atk>7?1:2;g.fillStyle='#e8e8f0';
  if(d=='right'){g.fillRect(x+13,y+2+ph*6,13,2);g.fillStyle='#fff';g.fillRect(x+13,y+2+ph*6,13,1);g.fillStyle='#b9861f';g.fillRect(x+12,y+1+ph*6,2,5)}
  else if(d=='left'){g.fillRect(x-12,y+2+ph*6,13,2);g.fillStyle='#fff';g.fillRect(x-12,y+2+ph*6,13,1);g.fillStyle='#b9861f';g.fillRect(x,y+1+ph*6,2,5)}
  else if(d=='up'){g.fillRect(x+1+ph*5,y-13,2,13);g.fillStyle='#b9861f';g.fillRect(x+ph*5,y-3,5,2)}
  else{g.fillRect(x+11-ph*5,y+19,2,13);g.fillStyle='#b9861f';g.fillRect(x+10-ph*5,y+18,5,2)}
  if(ph==1){g.fillStyle='rgba(255,255,255,.25)';g.beginPath();
   const cxn=x+7,cyn=y+9;g.arc(cxn,cyn,17,d=='right'?-.9:d=='left'?2.2:d=='up'?-2.4:.7,d=='right'?.9:d=='left'?4:d=='up'?-.7:2.4);g.arc(cxn,cyn,11,d=='right'?.9:d=='left'?4:d=='up'?-.7:2.4,d=='right'?-.9:d=='left'?2.2:d=='up'?-2.4:.7,true);g.fill()}}}
function drawHeroSide(x,y){x|=0;y|=0;
 g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(x+7,y+20,7,2.5,0,0,7);g.fill();
 for(const t of P.trail){g.globalAlpha=t.l/26;px(t.x+2,t.y+6,10,10,'#7fe3a0');g.globalAlpha=1}
 if(P.inv>0&&(frame>>2)&1)return;
 const mvg=Math.abs(P.vx)>.4&&P.onG,wf=mvg?(frame>>2)&3:0;
 heroSprite(x,y,P.face>0?'right':'left',wf,{atk:P.atk,blink:P.blink>0,mov:mvg,sq:P.land>4?1:0,str:(!P.onG&&P.vy<-1)?1:0})}
function drawHeroIso(sx,sy){sx|=0;sy|=0;
 g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(sx,sy,8,3.5,0,0,7);g.fill();
 for(const t of P.trail){const tx=isoX(t.x+7,t.y+10),ty=isoY(t.x+7,t.y+10);
  g.globalAlpha=t.l/26;px(tx-5,ty-15,10,10,'#7fe3a0');g.globalAlpha=1}
 if(P.inv>0&&(frame>>2)&1)return;
 const wf=P.mov?(frame>>2)&3:0,bob=(!P.mov&&(frame>>4)&1)?1:0;
 heroSprite(sx-7,sy-21+bob,P.dir,wf,{atk:P.atk,blink:P.blink>0,mov:P.mov})}
// ---------- ENEMIES ----------
function drawSlime(x,y,s){const sq=Math.sin(s.t*4)*2;x|=0;y|=0;
 const c=s.hurt>0&&(frame>>1)&1?'#fff':'#4db34d',c2=s.hurt>0&&(frame>>1)&1?'#fff':'#7ee07e';
 px(x,y+3-sq/2,16,9+sq/2,c);px(x+2,y-sq/2,12,4,c);px(x+2,y+1-sq/2,12,3,c2);px(x+1,y+10,14,2,'#3a8a3a');
 if(Math.sin(s.t*.7)>.9){px(x+4,y+5,3,1,'#111');px(x+10,y+5,3,1,'#111')}
 else{px(x+4,y+4,3,3,'#111');px(x+10,y+4,3,3,'#111');px(x+4,y+4,1,1,'#fff');px(x+10,y+4,1,1,'#fff')}}
function drawBeetle(x,y,b){x|=0;y|=0;const c=b.hurt>0&&(frame>>1)&1?'#fff':b.st==1&&(frame>>2)&1?'#e77':'#8a5adb';
 px(x+1,y+3,14,9,c);px(x+3,y+1,10,3,'#a97ae8');px(x+4,y+4,8,4,'#b99af0');px(x+7,y+3,2,9,'#6a42b0');
 px(x+15,y+5,3,4,'#5a3a99');px(x+15+((frame>>3)&1),y+2,1,3,'#5a3a99');px(x+17-((frame>>3)&1),y+2,1,3,'#5a3a99');
 const f=(frame>>2)&1;px(x+3,y+12,2,2+f,'#3d2a66');px(x+11,y+12,2,3-f,'#3d2a66')}
function drawWalker(e){const x=e.x|0,y=e.y|0,c=e.hurt>0&&(frame>>1)&1?'#fff':'#b3553a';
 px(x,y+3,16,10,c);px(x+2,y,12,4,c);px(x+3,y+3,10,3,'#cf7a5c');
 px(x+3+(e.vx>0?5:0),y+4,3,3,'#111');px(x+9+(e.vx>0?2:-3),y+4,3,3,'#111');
 px(x+3+(e.vx>0?6:0),y+4,1,1,'#fff');
 const f=(frame>>3)&1;px(x+2,y+13,4,2+f,'#6e2f1c');px(x+10,y+13,4,3-f,'#6e2f1c');
 for(let i=0;i<4;i++)px(x+2+i*4,y-2+((frame>>(3+i))&1),2,3,'#7d3a24')}
function drawBat(b){const x=b.x|0,y=b.y|0,f=(frame>>2)&1;
 px(x+4,y+3,7,7,'#6a4a9e');px(x+5,y+2,5,2,'#7d5cb3');px(x+5,y+4,2,2,'#ffd');px(x+8,y+4,2,2,'#ffd');
 px(x+5,y+5,1,1,'#611');px(x+8,y+5,1,1,'#611');px(x+6,y+9,1,2,'#fff');px(x+8,y+9,1,2,'#fff');
 px(x-2+f*2,y+(f?0:4),6,3,'#4a3372');px(x+11-f*2,y+(f?0:4),6,3,'#4a3372')}
function drawSpitter(s){const x=s.x|0,y=s.y|0,open=s.t%140>115;
 px(x,y+8,16,7,'#4a7c3f');px(x+2,y+3,12,8,'#5f9950');px(x+4,y+5,8,open?6:3,'#2c4a26');
 if(open)px(x+6,y+7,4,2,'#9dd45e');
 px(x+1,y-2+((frame>>3)&1),3,6,'#4a7c3f');px(x+12,y-2+((frame>>4)&1),3,6,'#4a7c3f')}
function drawKnight(e){const x=e.x|0,y=e.y|0,c=e.hurt>0&&(frame>>1)&1?'#fff':'#8a8a9e';
 px(x+2,y+4,12,12,c);px(x+3,y,10,6,'#a8a8bc');px(x+5,y+2,6,2,'#232330');
 px(x+5+(e.vx>0?2:-1),y+3,2,1,'#f66');
 const sx2=e.vx>0?x+13:x-3;px(sx2,y+2,6,13,'#6a6a7d');px(sx2+1,y+3,4,11,'#8a8a9e');px(sx2+2,y+6,2,3,'#d4b25a');
 const f=(frame>>3)&1;px(x+3,y+16,4,3+f,'#55556a');px(x+9,y+16,4,4-f,'#55556a')}
function drawCrab(e){const x=e.x|0,y=e.y|0,c=e.hurt>0&&(frame>>1)&1?'#fff':'#d96a3f';
 px(x+2,y+3,14,7,c);px(x+4,y+1,10,3,'#e8865c');
 px(x+4,y+3,2,3,'#fff');px(x+12,y+3,2,3,'#fff');px(x+5,y+4,1,1,'#111');px(x+13,y+4,1,1,'#111');
 const f=(frame>>2)&1;px(x-1,y+2+f,3,3,'#b34e2a');px(x+16,y+2+(1-f),3,3,'#b34e2a');
 px(x+1,y+10,2,2+f,'#b34e2a');px(x+6,y+10,2,3-f,'#b34e2a');px(x+11,y+10,2,2+f,'#b34e2a');px(x+15,y+10,2,3-f,'#b34e2a')}
function drawGhost(e){const a=e.fade!=null?e.fade:.8;g.globalAlpha=a*(e.hurt>0&&(frame>>1)&1?.4:1);
 const x=e.x|0,y=(e.y+Math.sin(e.t*2)*2)|0;
 px(x+2,y+2,12,11,'#cfd6ff');px(x+3,y,10,4,'#e8ecff');
 for(let i=0;i<3;i++)px(x+2+i*4+((frame>>3)&1),y+13,3,2,'#cfd6ff');
 px(x+4,y+4,3,4,'#3a3a66');px(x+9,y+4,3,4,'#3a3a66');g.globalAlpha=1}
// ---------- MINIBOSSES (side view) ----------
function drawMegaSlime(b){const x=b.x|0,y=b.y|0,sq=b.sq||0;
 const c=b.hurt>0&&(frame>>1)&1?'#fff':'#3a9e5c';
 px(x,y+8+sq,44,20-sq,c);px(x+4,y+2+sq,36,8,c);px(x+4,y+4+sq,36,4,'#6fd393');px(x+2,y+26,40,4,'#2a7a44');
 px(x+10,y+10+sq,6,6,'#111');px(x+28,y+10+sq,6,6,'#111');px(x+10,y+10+sq,2,2,'#fff');px(x+28,y+10+sq,2,2,'#fff');
 px(x+16,y+20+sq,12,3,'#1a4a2a');
 drawGemIcon(x+19,y-6+sq,'#39d353')}
function drawBoneBird(b){const x=b.x|0,y=b.y|0,f=(frame>>2)&1,c=b.hurt>0&&(frame>>1)&1?'#fff':'#d8d2c2';
 px(x+8,y+6,20,12,c);px(x+10,y+8,16,4,'#efe9dc');px(x+24,y+2,10,8,c);px(x+30,y+5,4,3,'#e8a23f');
 px(x+27,y+4,3,3,'#a11');px(x+28,y+4,1,1,'#fff');
 px(x-2+f*3,y+(f?-2:6),12,4,c);px(x+26-f*3,y+(f?-2:6),12,4,c);
 for(let i=0;i<3;i++)px(x+10+i*5,y+18,3,3+((frame>>3+i)&1),'#b8b2a2')}
function drawStoneFist(b){const x=b.x|0,y=b.y|0,c=b.hurt>0&&(frame>>1)&1?'#fff':b.st=='stun'?'#8a8a99':'#6e6e80';
 px(x+6,y+8,32,30,c);px(x+9,y+2,26,10,c);px(x+11,y+4,22,4,'#8a8a9e');
 px(x+14,y+8,4,4,'#f33');px(x+26,y+8,4,4,'#f33');
 const fy=b.st=='pound'?y+30:y+16+Math.sin(frame/14)*3;
 px(x-6,fy,12,12,c);px(x+38,fy,12,12,c);px(x-4,fy+2,8,3,'#8a8a9e');px(x+40,fy+2,8,3,'#8a8a9e');
 drawGemIcon(x+18,y+18,'#ffb347',true);
 if(b.st=='stun')T('X X',x+22,y+9,'#111',1,'center')}
// ---------- misc ----------
function drawGemIcon(x,y,c,big){const s=big?2:1;
 px(x+s,y,2*s,s,c);px(x,y+s,4*s,2*s,c);px(x+s,y+3*s,2*s,s,c);px(x+s,y+s,s,s,'#fff')}
function drawHeart(x,y,fill,wob){y+=wob?Math.sin(frame/4+x):0;
 if(fill==1){px(x,y+1,3,3,'#e33');px(x+1,y,1,1,'#e33');px(x+3,y+1,4,3,'#3a2430');px(x+5,y,1,1,'#3a2430');px(x+2,y+4,1,1,'#e33');px(x+3,y+4,2,1,'#3a2430');px(x+3,y+5,1,1,'#3a2430')}
 else{const c=fill==2?'#e33':'#3a2430';px(x,y+1,7,3,c);px(x+1,y,2,1,c);px(x+4,y,2,1,c);px(x+2,y+4,3,1,c);px(x+3,y+5,1,1,c)}
 if(fill>0)px(x+1,y+1,1,1,'#f99')}
function drawTreeG(cx,cy,tx,ty,kind){const sw=Math.sin(frame/40+tx*.7+ty)*1.6;
 g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(cx,cy+3,13,5,0,0,7);g.fill();
 if(kind==2){ // cactus
  px(cx-3,cy-22,6,25,'#3f8a4d');px(cx-3,cy-22,2,25,'#57a862');
  px(cx-9,cy-16,6,3,'#3f8a4d');px(cx-9,cy-16,3,8,'#3f8a4d');px(cx+3,cy-12,6,3,'#3f8a4d');px(cx+6,cy-12,3,6,'#3f8a4d');
  if(hash(tx,ty)>.7)px(cx-2,cy-24,3,3,'#e88ac2');return}
 if(kind==4){ // dead swamp tree
  px(cx-2,cy-20,4,22,'#4a4038');px(cx-8,cy-16,7,2,'#4a4038');px(cx+2,cy-19,8,2,'#4a4038');px(cx+7,cy-24,2,6,'#4a4038');
  return}
 px(cx-3,cy-14,6,16,'#6e4a2a');px(cx-3,cy-14,2,16,'#8a6038');
 if(kind==3){ // snowy pine
  for(let i=0;i<3;i++){g.fillStyle=i%2?'#2c5e3a':'#38724a';g.beginPath();g.moveTo(cx+sw*(.3+i*.2),cy-16-i*9-9);g.lineTo(cx+13-i*3+sw*.3,cy-16-i*9);g.lineTo(cx-13+i*3+sw*.3,cy-16-i*9);g.closePath();g.fill();
   g.fillStyle='#eef7fa';g.fillRect(cx-11+i*3+sw*.3,cy-17-i*9,(11-i*3)*2,2)}return}
 if(kind==1){ // pine
  for(let i=0;i<3;i++){g.fillStyle=i%2?'#245c31':'#2f7a3e';g.beginPath();g.moveTo(cx+sw*(.3+i*.2),cy-16-i*9-10);g.lineTo(cx+14-i*3+sw*.3,cy-16-i*9);g.lineTo(cx-14+i*3+sw*.3,cy-16-i*9);g.closePath();g.fill()}return}
 g.fillStyle='#245c31';g.beginPath();g.ellipse(cx+sw*.5,cy-24,15,11,0,0,7);g.fill();
 g.fillStyle='#2c6e3a';g.beginPath();g.ellipse(cx+sw*.6,cy-28,13,10,0,0,7);g.fill();
 g.fillStyle='#3f8a4d';g.beginPath();g.ellipse(cx+sw*.7,cy-31,11,8,0,0,7);g.fill();
 g.fillStyle='#57a862';g.beginPath();g.ellipse(cx+sw*.8-3,cy-34,6,4,0,0,7);g.fill();
 g.fillStyle='#6fc27a';g.beginPath();g.ellipse(cx+sw*.8+5,cy-30,4,3,0,0,7);g.fill();
 if(hash(tx,ty)>.6){px(cx+4+sw,cy-33,2,2,'#e86a6a');px(cx-6+sw,cy-26,2,2,'#e86a6a');px(cx-1+sw,cy-22,2,2,'#e86a6a')}}
function drawNPC(sx,sy,n){const x=sx-7,y=sy-20,b=Math.sin(frame/22+n.i)*1;
 g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(sx,sy,7,3,0,0,7);g.fill();
 px(x+3,y+15,3,4,'#3a3a4a');px(x+8,y+15,3,4,'#3a3a4a');
 px(x+2,y+7+b,10,8,n.c);px(x+2,y+7+b,10,2,n.c2);
 px(x+2,y+b,10,7,SK);px(x+2,y+b,10,2,n.hair||'#555');
 px(x+4,y+3+b,2,2,'#26221f');px(x+8,y+3+b,2,2,'#26221f');
 if(n.hat){px(x,y-2+b,14,3,n.hat);px(x+3,y-5+b,8,4,n.hat)}
 if(n.q&&QUESTS[n.q-1]&&!QD().qdone[n.q-1]&&(frame>>4)&1)T('!',sx,y-12,'#ffd75e',2,'center')}
// ---------- v4 sprites: sheep, shade, bomb ----------
function drawSheep(x,y,s){x|=0;y|=0;const f=(frame>>3)&1;
 px(x+1,y+3,16,9,s.hurt>0&&(frame>>1)&1?'#fff':'#eee6da');px(x+2,y+1,14,4,'#f7f2ea');
 px(x+13,y,6,6,'#3a3330');px(x+15,y+1,2,1,'#fff');px(x+18,y+2,1,2,'#3a3330');
 px(x+3,y+12,2,3+f,'#3a3330');px(x+8,y+12,2,4-f,'#3a3330');px(x+13,y+12,2,3+f,'#3a3330');
 if(s.hurt>0)for(let i=0;i<2;i++)px(x+4+i*6,y-3,2,2,'#fff')}
function drawShade(x,y,s){const sq=Math.sin(s.t*4)*2;x|=0;y|=0;
 const c=s.hurt>0&&(frame>>1)&1?'#fff':'#4a3466',c2='#7a5aa8';
 px(x,y+3-sq/2,16,9+sq/2,c);px(x+2,y-sq/2,12,4,c);px(x+2,y+1-sq/2,12,3,c2);
 px(x+4,y+4,3,3,'#e8c8ff');px(x+10,y+4,3,3,'#e8c8ff');px(x+5,y+5,1,1,'#fff');px(x+11,y+5,1,1,'#fff');
 if(frame%5==0)parts.push({x:x+4+Math.random()*8,y:y+6,vx:0,vy:-.3,life:14,c:'#7a5aa8',s:1,z:8})}
function drawBombSpr(x,y,t){x|=0;y|=0;const fl=t<30&&(frame>>2)&1;
 px(x-4,y-4,9,9,fl?'#f55':'#26222c');px(x-3,y-5,7,11,fl?'#f55':'#26222c');px(x-5,y-3,11,7,fl?'#f55':'#26222c');
 px(x-2,y-3,3,3,'#4a4658');px(x-1,y-7,2,3,'#8a6430');
 if(frame&1)px(x-1+Math.sin(frame)*2,y-9,2,2,['#ff8','#f80'][frame%2])}
// ---------- v5 sprites ----------
function drawMimic(x,y,s){x|=0;y|=0;const open=Math.sin(s.t*5)>.2,c=s.hurt>0&&(frame>>1)&1?'#fff':'#8a6430';
 px(x,y+4,18,10,c);px(x,y+4-(open?5:1),18,5,s.hurt>0&&(frame>>1)&1?'#fff':'#a87c42');
 if(open){px(x+1,y+4,16,3,'#2c0f0f');for(let i=0;i<4;i++){px(x+2+i*4,y+4,2,2,'#fff');px(x+4+i*4,y+7,2,2,'#fff')}}
 px(x+3,y+1-(open?5:1),3,3,'#f33');px(x+12,y+1-(open?5:1),3,3,'#f33');px(x+8,y+8,3,4,'#ffd700')}
function drawRock(x,y,s){const sq=Math.sin(s.t*3)*2;x|=0;y|=0;
 const c=s.hurt>0&&(frame>>1)&1?'#fff':'#6e6e80',c2='#8a8a9e';
 px(x,y+5-sq/2,30,15+sq/2,c);px(x+3,y-sq/2,24,7,c);px(x+3,y+1-sq/2,24,4,c2);
 px(x+6,y+6,5,5,'#f55');px(x+19,y+6,5,5,'#f55');px(x+7,y+7,2,2,'#fff');px(x+20,y+7,2,2,'#fff');
 px(x+2,y-5,5,5,'#55555e');px(x+12,y-7,6,6,'#55555e');px(x+23,y-5,5,5,'#55555e');
 px(x+10,y+15,10,3,'#4a4a58')}

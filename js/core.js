'use strict';
// ============ CORE: canvas, helpers, font, input, audio, particles ============
const TS=24,W=480,H=270,cv=document.getElementById('c'),g=cv.getContext('2d');
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t;
let seed=1;const rng=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff};
const hash=(x,y)=>{let h=((x*374761393+y*668265263)^1597334677)>>>0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296};
const px=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x|0,y|0,w,h)};
const ovl=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const isoX=(x,y)=>x-y,isoY=(x,y)=>(x+y)/2;
function makeCv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const cg=c.getContext('2d');fn(cg,w,h);return c}
// ---- crisp 4x5 bitmap font ----
const FONT={A:'69F99',B:'E9E9E',C:'78887',D:'E999E',E:'F8E8F',F:'F8E88',G:'78B97',H:'99F99',I:'E444E',J:'31196',K:'9ACA9',L:'8888F',M:'9F999',N:'9DB99',O:'69996',P:'E9E88',Q:'699A5',R:'E9EA9',S:'7861E',T:'F4444',U:'99996',V:'999A4',W:'999F9',X:'99699',Y:'99644',Z:'F168F','0':'6BD96','1':'4C44E','2':'E168F','3':'E161E','4':'99F11','5':'F8E1E','6':'78E96','7':'F1244','8':'69696','9':'6971E','.':'00004',',':'00048','!':'44404','?':'E1604','-':'00E00',':':'04040',"'":'44000','/':'11248','+':'04E40','(':'24442',')':'42224','>':'8CEC8','*':'4EFE4','~':'0F640','%':'92489',' ':'00000'};
function T(s,x,y,c,sc,al){sc=sc||1;s=(''+s).toUpperCase();const w=s.length*5*sc-sc;
 if(al=='center')x-=w/2;else if(al=='right')x-=w;x|=0;y|=0;g.fillStyle=c;
 for(let i=0;i<s.length;i++){const gl=FONT[s[i]]||FONT['?'];
  for(let r=0;r<5;r++){const b=parseInt(gl[r],16);
   for(let cc=0;cc<4;cc++)if(b&(8>>cc))g.fillRect(x+i*5*sc+cc*sc,y+r*sc,sc,sc)}}
 return w}
function TO(s,x,y,c,sc,al){T(s,x+sc,y+sc,'rgba(0,0,0,.55)',sc,al);T(s,x,y,c,sc,al)}
// ---- input ----
let K={},Kp={},muted=false;
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Tab'].includes(e.code))e.preventDefault();if(!e.repeat)Kp[e.code]=1;K[e.code]=1;initAudio();if(e.code=='KeyM'&&!e.repeat)muted=!muted});
addEventListener('keyup',e=>K[e.code]=0);
const key=(...c)=>c.some(k=>K[k]),prs=(...c)=>c.some(k=>Kp[k]);
const mvL=()=>key('ArrowLeft','KeyA'),mvR=()=>key('ArrowRight','KeyD'),mvU=()=>key('ArrowUp','KeyW'),mvD=()=>key('ArrowDown','KeyS');
const pJump=()=>prs('Space','KeyZ'),hJump=()=>key('Space','KeyZ','ArrowUp','KeyW'),pAtk=()=>prs('KeyX','KeyJ'),pOk=()=>prs('Enter','Space','KeyZ','KeyX'),pDash=()=>prs('KeyC','KeyK','ShiftLeft'),pTalk=()=>prs('Enter','KeyE');
// ---- audio ----
let AC=null,mus={th:null,s:0,next:0};
function initAudio(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();mus.next=AC.currentTime+.1}catch(e){}}else if(AC.state=='suspended')AC.resume()}
const NF=n=>261.63*Math.pow(2,n/12);
function tone(f,t,d,ty,v,f2){if(!AC||muted)return;const o=AC.createOscillator(),ga=AC.createGain();o.type=ty;o.frequency.setValueAtTime(Math.max(20,f),t);if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+d);ga.gain.setValueAtTime(v,t);ga.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(ga);ga.connect(AC.destination);o.start(t);o.stop(t+d+.02)}
function sfx(n){if(!AC||muted)return;const t=AC.currentTime;
 const S={jump:[240,.13,'square',.07,540],coin:0,swing:[700,.07,'triangle',.09,180],hurt:[240,.22,'sawtooth',.1,70],stomp:[400,.1,'square',.07,120],boom:[120,.5,'sawtooth',.14,30],shot:[900,.09,'sawtooth',.05,300],msg:[600,.04,'square',.03],sel:[880,.08,'square',.06,1100],dash:[300,.15,'sawtooth',.07,900],spring:[200,.2,'square',.08,800],deny:[180,.2,'square',.07,120],spit:[500,.1,'triangle',.06,200],clank:[1200,.09,'square',.05,400],pound:[90,.35,'sawtooth',.13,40],splash:[400,.25,'triangle',.08,100]};
 if(S[n]){const a=S[n];tone(a[0],t,a[1],a[2],a[3],a[4]);return}
 if(n=='coin'){tone(988,t,.06,'square',.06);tone(1319,t+.06,.12,'square',.06)}
 else if(n=='kill'){tone(300,t,.14,'square',.08,60);tone(150,t+.02,.18,'triangle',.09,40)}
 else if(n=='gem')[0,4,7,12,16].forEach((s,i)=>tone(NF(s+12),t+i*.09,.25,'square',.06));
 else if(n=='door'){tone(200,t,.1,'square',.06);tone(300,t+.1,.1,'square',.06);tone(400,t+.2,.15,'square',.06)}
 else if(n=='heal')[7,12,16].forEach((s,i)=>tone(NF(s+12),t+i*.07,.15,'triangle',.08));
 else if(n=='chest'){tone(500,t,.08,'square',.06);tone(750,t+.08,.16,'square',.06)}
 else if(n=='break'){tone(500,t,.08,'square',.06,150);tone(320,t+.03,.1,'triangle',.07,90)}
 else if(n=='buy')[0,7,12].forEach((s,i)=>tone(NF(s+12),t+i*.06,.12,'square',.06));
 else if(n=='quest')[0,5,9,12].forEach((s,i)=>tone(NF(s+12),t+i*.08,.2,'triangle',.07))
 else if(n=='fish'){tone(300,t,.1,'square',.06,600);tone(600,t+.1,.15,'square',.06,900)}}
const THEMES={
 title:{spb:.21,bass:[-24,null,null,null,-17,null,null,null,-20,null,null,null,-19,null,null,null],lead:[12,null,16,19,null,16,12,null,14,null,17,21,null,17,14,null,12,null,16,19,null,23,19,16,14,null,11,null,7,null,null,null]},
 ov:{spb:.14,bass:[-24,null,-12,null,-24,null,-12,null,-17,null,-5,null,-17,null,-5,null,-20,null,-8,null,-20,null,-8,null,-19,null,-7,null,-19,-19,-7,null],lead:[0,null,4,7,null,9,7,null,4,null,7,9,12,null,9,7,5,null,9,12,null,14,12,null,11,null,14,16,14,null,11,7]},
 night:{spb:.24,bass:[-24,null,null,null,-19,null,null,null,-17,null,null,null,-20,null,null,null],lead:[7,null,null,12,null,null,11,null,7,null,null,9,null,null,null,null,4,null,null,9,null,null,7,null,2,null,null,4,null,null,null,null]},
 dun:{spb:.15,bass:[-27,null,null,-27,null,null,-27,null,-24,null,null,-24,null,null,-24,null,-29,null,null,-29,null,null,-29,null,-26,null,null,-26,null,-26,null,null],lead:[9,null,12,null,16,null,12,null,9,null,null,null,8,null,null,null,7,null,10,null,14,null,10,null,7,null,8,null,9,null,null,null]},
 boss:{spb:.105,bass:[-27,-27,-15,-27,-27,-15,-27,-15,-25,-25,-13,-25,-25,-13,-25,-13,-24,-24,-12,-24,-24,-12,-24,-12,-22,-22,-10,-22,-23,-23,-11,-23],lead:[9,null,9,12,null,9,16,null,15,null,15,17,null,15,20,null,12,null,12,15,null,12,19,null,20,19,17,15,14,null,12,null]}};
function musTick(){const th=THEMES[mus.th];if(!th||!AC||muted){if(AC)mus.next=AC.currentTime;return}
 while(mus.next<AC.currentTime+.12){const t=Math.max(mus.next,AC.currentTime);
  const b=th.bass[mus.s%th.bass.length];if(b!=null)tone(NF(b),t,th.spb*1.7,'triangle',.09);
  const l=th.lead[mus.s%th.lead.length];if(l!=null)tone(NF(l),t,th.spb*.9,'square',.038);
  mus.s++;mus.next+=th.spb}}
function setTheme(n){if(mus.th==n)return;mus.th=n;mus.s=0;if(AC)mus.next=AC.currentTime+.05}
// ---- particles / toasts ----
let parts=[],toasts=[];
function puff(x,y,c,n=6,sp=2){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=Math.random()*sp;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.6,life:20+Math.random()*15,c,s:1+(Math.random()<.4?1:0)})}}
function ftxt(x,y,s,c){parts.push({x,y,vx:0,vy:-.65,life:45,txt:s,c})}
function toast(s,c){toasts.push({s,c:c||'#ffd75e',t:0});sfx('quest')}
function uParts(){for(let i=parts.length;i--;){const p=parts[i];p.x+=p.vx;p.y+=p.vy;if(!p.txt)p.vy+=.06;if(--p.life<=0)parts.splice(i,1)}
 for(let i=toasts.length;i--;)if(++toasts[i].t>190)toasts.splice(i,1)}
function dParts(iso){for(const p of parts){let x=p.x,y=p.y;if(iso){x=isoX(p.x,p.y);y=isoY(p.x,p.y)-(p.z||10)}
 if(p.txt)T(p.txt,x,y,p.c,1,'center');else px(x,y,p.s,p.s,p.c)}}
function dToasts(){toasts.forEach((t2,i)=>{const sl=t2.t<15?(15-t2.t)*8:t2.t>160?(t2.t-160)*5:0;
 const w2=t2.s.length*5+14;px(W-w2-8+sl,26+i*15,w2,12,'rgba(10,10,22,.9)');px(W-w2-8+sl,26+i*15,2,12,t2.c);
 T(t2.s,W-w2-2+sl,30+i*15,t2.c)})}
// ---- lighting ----
const LC=makeCv(W,H,()=>{}),lg=LC.getContext('2d');
function lightPass(dark,lights){lg.globalCompositeOperation='source-over';lg.clearRect(0,0,W,H);
 lg.fillStyle='rgba(4,4,18,'+dark+')';lg.fillRect(0,0,W,H);
 lg.globalCompositeOperation='destination-out';
 for(const L of lights){const gr=lg.createRadialGradient(L.x,L.y,4,L.x,L.y,L.r);
  gr.addColorStop(0,'rgba(0,0,0,'+(L.a||1)+')');gr.addColorStop(1,'rgba(0,0,0,0)');
  lg.fillStyle=gr;lg.fillRect(L.x-L.r,L.y-L.r,L.r*2,L.r*2)}
 g.drawImage(LC,0,0)}

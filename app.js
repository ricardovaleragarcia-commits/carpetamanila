/* Collection: one folder column per category (Desktop - 4), scrolling sideways like a filing drawer. */
const $=s=>document.querySelector(s);
const stage=$('#stage'),rail=$('#rail'),sheet=$('#sheet'),blank=$('#blank'),panel=$('#panel'),card=$('#card'),tilt=$('#tilt'),tcard=$('#tcard'),ntag=$('#ntag');

const ROW_Y=[39.87,191.58,343.30,495.01,646.72,798.43,950.15];
const ROW_PITCH=151.71,ITEM_H=65,ITEM_X=40.75;
const LABELS=['Resume','Cover Letter','Portfolio','Brand Guidelines','Invoice','Proposal'];
const COUNTS=[10,8,9,5,7,3];
/* tab drawing from the Figma (55 x 1028): right line, a soft step, left line, plus a faint left edge above the step.
   The step slides down with the length of the name, keeping the Figma's 48px of air between the name and the step. */
const tabD=(dy,s=1)=>{
  const x=v=>(54.5088-(54.5088-v)*s).toFixed(3);   /* s: 0 = straight line on the hinge, 1 = the real tab shape */
  return `M${x(54.5088)} 0V${171.938+dy}C${x(54.5088)} ${179.418+dy} ${x(50.3352)} ${186.273+dy} ${x(43.6903)} ${189.706+dy}L${x(11.3187)} ${206.434+dy}C${x(4.67373)} ${209.868+dy} ${x(.500132)} ${216.722+dy} ${x(.500132)} ${224.202+dy}V1027.92`;
};
const tabF=(dy,s=1)=>`M${(54.5088-54*s).toFixed(3)} 1V${184.7+dy}`;
const pad=(n,l=2)=>String(n).padStart(l,'0');

/* blank sheets: real paper sizes (mm), so an A5 reads smaller than an A3 */
const PAPER={
  letter:{n:'US Letter',mm:[215.9,279.4],txt:['8.5','11','in']},
  a4:{n:'A4',mm:[210,297],txt:['210','297','mm']},
  a5:{n:'A5',mm:[148,210],txt:['148','210','mm']},
  a3:{n:'A3',mm:[297,420],txt:['297','420','mm']},
  tabloid:{n:'Tabloid',mm:[279.4,431.8],txt:['11','17','in']},
  slide:{n:'Slide 16:9',mm:[254,142.9],txt:['1920','1080','px'],fixed:1},
  square:{n:'Square',mm:[210,210],txt:['210','210','mm']}
};
const FORMS=[
  [['a4',0],['letter',0],['a4',0],['a5',0],['letter',0]],
  [['letter',0],['a4',0]],
  [['a4',1],['letter',1],['slide',0],['square',0],['a3',1]],
  [['a4',1],['slide',0],['letter',1],['tabloid',1]],
  [['letter',0],['a4',0],['a5',0]],
  [['letter',1],['a4',1],['letter',0],['slide',0]]
];
const SOFT={
  Figma:'link',Canva:'link','Google Docs':'link',Word:'.docx',Pages:'.pages',InDesign:'.idml',Illustrator:'.ai',Keynote:'.key',Excel:'.xlsx'
};
const OPTIONS=[
  ['Figma','Canva','Word','Pages','Google Docs'],
  ['Word','Pages','Google Docs','Canva'],
  ['InDesign','Figma','Canva','Keynote'],
  ['InDesign','Figma','Canva','Illustrator'],
  ['Word','Excel','Google Docs','Canva','Pages'],
  ['InDesign','Figma','Keynote','Word']
];
function dims(f){
  const p=PAPER[f[0]];let [w,h]=p.mm,[a,b]=p.txt;
  if(f[1]){[w,h]=[h,w];[a,b]=[b,a]}
  return{p,w,h,size:`${a} × ${b} ${p.txt[2]}`,orient:w>h?'Landscape':w<h?'Portrait':'Square'};
}

const ITEMS=[];
(function build(){
  let id=0;
  COUNTS.forEach((n,t)=>{
    for(let v=0;v<n;v++){
      id++;const seed=id*31+7,r=rng(seed),f=FORMS[t][v%FORMS[t].length];
      ITEMS.push({id,type:t,v,seed,f,name:`${ADJ[v%ADJ.length]} ${TYPES[t].short}`,
        by:content(seed).name,date:`${1+Math.floor(r()*28)} ${MON[Math.floor(r()*5)]} 2026`});
    }
  });
})();
const byId=new Map(ITEMS.map(i=>[i.id,i]));

COUNTS.forEach((n,t)=>{
  const col=document.createElement('section'),k=t%2?'t':'b';
  col.className='col';col.setAttribute('aria-label',LABELS[t]);col.style.setProperty('--cd',(850+t*190)+'ms');
  const cs=document.createElement('div'),ci=document.createElement('div');
  cs.className='cs';ci.className='ci';ci.style.height=Math.max(1080,ROW_Y[0]+ROW_PITCH*(n-1)+ITEM_H+60)+'px';
  ITEMS.filter(i=>i.type===t).forEach((it,v)=>{
    const d=document.createElement('div');
    d.className='item';d.dataset.id=it.id;d.tabIndex=0;d.setAttribute('role','button');
    d.style.setProperty('--x',ITEM_X+'px');d.style.setProperty('--y',(ROW_Y[0]+ROW_PITCH*v)+'px');
    d.innerHTML=`<span class="n">${pad(v+1)}.</span><span class="t"><span>${it.name}</span><span>${TYPES[t].n}</span><span>By <i>${it.by}</i></span><span>${it.date}</span><span class="go">Retrieve</span></span>`;
    ci.append(d);
  });
  cs.append(ci);
  const tab=document.createElement('div');tab.className='tab '+k;
  tab.innerHTML=`<svg viewBox="0 0 55.0088 1027.92" preserveAspectRatio="none" fill="none" aria-hidden="true"><path class="tf" d="${tabF(0,0)}" stroke="#c9b795"/><path class="tp" d="${tabD(0,0)}" stroke="currentColor"/></svg><p class="lab">${LABELS[t]}</p>`;
  const fold=document.createElement('div');fold.className='fold';fold.append(cs);col.append(fold,tab);rail.append(col);
  cs.addEventListener('scroll',()=>hide(true),{passive:true});
});

function fitTabs(){
  if(matchMedia('(max-width:760px)').matches)return;
  rail.querySelectorAll('.tab').forEach(tab=>{
    const dy=Math.max(0,62+tab.querySelector('.lab').offsetHeight+48-172);
    tab._dy=dy;
    tab.querySelector('.tp').setAttribute('d',tabD(dy,tab._s??0));
    tab.querySelector('.tf').setAttribute('d',tabF(dy,tab._s??0));
  });
}

/* fit the 1920 x 1080 frame to the window; below 760px switch to the mobile drawer */
const mq=matchMedia('(max-width:760px)');
let S=1;
function fitStage(){
  const m=mq.matches;
  document.documentElement.classList.toggle('m',m);
  S=m?1:Math.min(innerWidth/1920,innerHeight/1080);
  if(!m)stage.style.setProperty('--s',S);
}
addEventListener('resize',fitStage);fitStage();

/* hover sheet: a blank white sheet in the item's format; pointer-events none, so the next entry stays reachable underneath */
/* every sheet shares one tall height (about 87% of the frame); only very wide formats are capped so they stay inside the page */
const SHEET_H=936,SHEET_MAXW=1584;
let hideT=0;
function show(el){
  if(!card.hidden||mq.matches)return;
  clearTimeout(hideT);
  const {w,h}=dims(byId.get(+el.dataset.id).f),k=Math.min(SHEET_H/h,SHEET_MAXW/w);
  blank.style.width=w*k+'px';blank.style.height=h*k+'px';
  sheet.classList.add('on');
}
function hide(now){
  clearTimeout(hideT);
  const go=()=>sheet.classList.remove('on');
  now?go():hideT=setTimeout(go,90);
}
stage.addEventListener('pointerover',e=>{
  if(e.pointerType==='touch'||mq.matches)return;
  const it=e.target.closest('.item');it?show(it):hide(true);   /* off the instant the pointer leaves the text, anywhere on the stage */
});
stage.addEventListener('pointerleave',()=>hide(true));
rail.addEventListener('focusin',e=>{const it=e.target.closest('.item');if(it)show(it)});
rail.addEventListener('focusout',()=>hide());

/* retrieval slip: the floating window to choose a software */
function openCard(el){
  const it=byId.get(+el.dataset.id),{p,w,h,size,orient}=dims(it.f),k=Math.min(112/h,112/w);
  hide(true);closePanel();
  card.innerHTML=`<div class="cc"><div class="cth"><i style="width:${w*k}px;height:${h*k}px"></i></div><div class="cm">
    <p class="kk">Retrieval slip · No. ${pad(it.id,4)}</p><h2>${it.name}</h2><p>${TYPES[it.type].n} — By <i>${it.by}</i></p></div></div>
    <dl class="ix r"><div><dt>Format</dt><span class="ld"></span><dd>${p.n} · ${orient}</dd></div><div><dt>Size</dt><span class="ld"></span><dd>${size}</dd></div><div><dt>Filed</dt><span class="ld"></span><dd>${it.date}</dd></div></dl>
    <p class="kk">Retrieve as</p>
    <ul class="ix">${OPTIONS[it.type].map(s=>`<li><button data-sw="${s}"><span class="nm">${s}</span><span class="ld"></span><span class="ct">${SOFT[s]}</span></button></li>`).join('')}</ul>
    <p class="stamp" id="stamp" hidden>No file attached yet</p>
    <button class="x" data-close>— Close</button>`;
  card.hidden=false;card.scrollTop=0;
}
function closeCard(){card.hidden=true}
rail.addEventListener('click',e=>{const it=e.target.closest('.item');if(it)openCard(it)});
rail.addEventListener('keydown',e=>{
  const it=e.target.closest('.item');
  if(it&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openCard(it)}
});
card.addEventListener('click',e=>{
  if(e.target.closest('[data-close]'))closeCard();
  else if(e.target.closest('[data-sw]')){const s=$('#stamp');s.hidden=false;s.style.animation='none';void s.offsetWidth;s.style.animation=''}
});

/* gestures: a trackpad swipe is horizontal or vertical, never both. Horizontal moves the drawer, vertical scrolls the column under the pointer.
   Movement is weighted: the position eases toward its target, the drawer settles on a column, and the ends pull back like a spring. */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function Scroller(el,ax,max,over,snap,RUB=0){
  const get=()=>ax==='x'?el.scrollLeft:el.scrollTop,put=v=>{ax==='x'?el.scrollLeft=v:el.scrollTop=v};
  let pos=0,tg=0,last=0,raf=0,t0=0,idle=0,k=11,edgeT=0;
  function frame(t){
    const dt=Math.min(.05,(t-t0)/1000||.016),m=max();t0=t;
    pos+=(tg-pos)*(1-Math.exp(-dt*k));
    if(Math.abs(tg-pos)<.25)pos=tg;
    const c=clamp(pos,0,m);put(c);last=get();over(pos-c);
    raf=pos===tg?0:requestAnimationFrame(frame);
  }
  const run=()=>{if(!raf){t0=performance.now();raf=requestAnimationFrame(frame)}};
  const sync=()=>{if(Math.abs(get()-last)>1.5){pos=tg=get();last=pos}};   /* only adopt the real position if something else moved it */
  function release(){
    const m=max(),over=tg<0||tg>m;
    tg=clamp(tg,0,m);if(snap)tg=clamp(snap(tg),0,m);
    if(over)edgeT=performance.now();
    k=over?14:7;run();                 /* a stretched end snaps back quickly, a normal stop settles gently */
  }
  return{
    at:()=>raf?tg:get(),
    push(d){
      const m=max();if(m<=0)return;
      sync();
      /* at an end, drop the momentum tail: once stretched, or just after bouncing, more outward push is ignored so the bounce stays short */
      if(RUB&&((tg<=0&&d<0)||(tg>=m&&d>0))&&(tg<0||tg>m||performance.now()-edgeT<450))return;
      k=11;
      if(!RUB)tg=clamp(tg+d,0,m);       /* columns stop dead at their ends: no bounce */
      else{                              /* the drawer stretches a little past its ends, with growing resistance */
        let rem=d;
        if(tg>=0&&tg<=m){const room=d>0?m-tg:-tg;if(Math.abs(d)<=Math.abs(room)){tg+=d;rem=0}else{tg+=room;rem=d-room}}
        if(rem){
          const o=tg<0?tg:tg>m?tg-m:0,dir=Math.sign(rem);
          if(o===0||Math.sign(o)===dir)tg=(dir>0?m:0)+clamp(o+rem*Math.max(0,1-Math.abs(o)/RUB)*.3,-RUB,RUB);
          else tg+=rem;
        }
      }
      if(tg<0||tg>m)k=18;                /* the stretch itself follows the pull quickly, then lets go */
      run();clearTimeout(idle);idle=setTimeout(release,tg<0||tg>m?85:130);
    },
    to(v){sync();const m=max();tg=clamp(v,0,m);k=7;run()}
  };
}
const cols=[...rail.children];
const colW=()=>rail.firstElementChild.offsetWidth;
const maxLeft=()=>rail.scrollWidth-rail.clientWidth;
const railS=Scroller(rail,'x',maxLeft,v=>cols.forEach(c=>{c.style.transform=v?`translateX(${-v}px)`:''}),v=>{const w=colW(),m=maxLeft(),r=Math.round(v/w)*w;return Math.abs(m-v)<Math.abs(r-v)?m:r},18);
cols.forEach(col=>{
  const cs=col.querySelector('.cs'),ci=col.querySelector('.ci');
  cs._s=Scroller(cs,'y',()=>cs.scrollHeight-cs.clientHeight,v=>{ci.style.transform=v?`translateY(${-v}px)`:''});
});
function goTo(i){railS.to(i*colW())}
function step(dir){const q=railS.at()/colW();goTo(dir>0?Math.floor(q+.01)+1:Math.ceil(q-.01)-1)}
let axis='',lastW=0;
document.addEventListener('wheel',e=>{
  if(mq.matches||e.target.closest('.panel,.card'))return;
  e.preventDefault();               /* also stops the browser's swipe-back past the logo */
  const m=e.deltaMode===1?16:e.deltaMode===2?innerHeight:1;
  let dx=e.deltaX*m/S,dy=e.deltaY*m/S;
  if(e.shiftKey&&!dx){dx=dy;dy=0}
  if(!axis||e.timeStamp-lastW>160)axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
  lastW=e.timeStamp;hide(true);
  if(axis==='x')railS.push(dx);
  else{const col=e.target.closest('.col'),cs=col&&col.querySelector('.cs');if(cs)cs._s.push(dy)}
},{passive:false});
rail.addEventListener('scroll',()=>hide(true),{passive:true});

/* spine flaps: three strips behind the logo. At rest they are slim; the one under the pointer opens, and everything below it moves down with it. */
const RX=97.2,LX=29.54,DY=58.37,EXTRA=100,STRIP=25;
const BASE=[338.5,363.4,388.4,413.4];          /* where each diagonal starts on the right line, all strips slim */
const FLAP_ID=['info','team','contact'];
const ftext=[0,1,2].map(i=>$('#spT'+i));
let shift=[0,0,0,0],goal=[0,0,0,0],openFlap=-1,fraf=0,ft0=0;
let coverS=0;                                    /* 0 = the cover is a single line on its hinge, 1 = open */
const X=x=>(RX-(RX-x)*coverS).toFixed(3);
const diag=y=>`M${X(RX)} ${y}C${X(RX)} ${y+7.6} ${X(92.89)} ${y+14.54} ${X(86.09)} ${y+17.92}L${X(40.65)} ${y+40.45}C${X(33.85)} ${y+43.83} ${X(LX)} ${y+50.77} ${X(LX)} ${y+DY}`;
function drawFlaps(){
  const d=BASE.map((b,i)=>b+shift[i]);
  $('#spF').setAttribute('d',`M${X(LX)} 27.19V345.13`);
  $('#spR').setAttribute('d',`M${RX} 25.81V${d[3]}`);
  d.forEach((y,i)=>$('#spD'+i).setAttribute('d',diag(y)));
  $('#spL').setAttribute('d',`M${X(LX)} ${d[0]+DY}V1055.15`);
  ftext.forEach((t,k)=>{
    const o=clamp((d[k+1]-d[k]-STRIP)/EXTRA,0,1),cy=(d[k]+d[k+1])/2+27.6;
    t.setAttribute('transform',`translate(63.87 ${cy}) rotate(90)`);
    t.style.opacity=clamp((o-.4)/.6,0,1);
  });
}
function tick(t){
  const dt=Math.min(.05,(t-ft0)/1000||.016);ft0=t;let moving=false;
  for(let i=1;i<4;i++){
    shift[i]+=(goal[i]-shift[i])*(1-Math.exp(-dt*12));
    if(Math.abs(goal[i]-shift[i])<.05)shift[i]=goal[i];else moving=true;
  }
  drawFlaps();fraf=moving?requestAnimationFrame(tick):0;
}
function setFlap(k){
  if(k===openFlap)return;
  openFlap=k;goal=[0,1,2,3].map(j=>k>=0&&j>k?EXTRA:0);
  if(!fraf){ft0=performance.now();fraf=requestAnimationFrame(tick)}
}
function flapAt(e){
  const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/S,y=(e.clientY-r.top)/S;
  if(x<LX||x>RX+3)return -1;
  const off=(RX-x)/(RX-LX)*DY,d=BASE.map((b,i)=>b+shift[i]);
  for(let k=0;k<3;k++)if(y>=d[k]+off&&y<d[k+1]+off)return k;
  return -1;
}
drawFlaps();
stage.addEventListener('pointermove',e=>{
  if(mq.matches||e.pointerType==='touch')return;
  const k=flapAt(e);setFlap(k);stage.classList.toggle('hit',k>=0);
});
stage.addEventListener('pointerleave',()=>{setFlap(-1);stage.classList.remove('hit')});
document.querySelectorAll('.flaps button').forEach((b,i)=>{b.addEventListener('focus',()=>setFlap(i));b.addEventListener('blur',()=>setFlap(-1))});

const PANELS={
  info:`<h2>Info</h2><p class="big">Carpeta Manila is a growing collection of open access templates and resources.</p><p>Every template is original, free to download and made with working designers, art directors and studios. Resumes, portfolios, cover letters, brand guidelines, invoices and more, each one filed in the software you work in.</p><p class="small">Formats: Figma, Canva, InDesign, Word, Pages, Google Docs, Keynote.</p>`,
  team:`<h2>Team</h2><p class="big">Name Surname<br>Name Surname<br>Name Surname</p><p>Placeholder names. Each template credits the creative who made it.</p>`,
  contact:`<h2>Contact</h2><p class="big">hello@carpetamanila.example</p><p>Write to suggest a collaboration or to submit a template.</p><p class="small">Placeholder address.</p>`
};
/* fade a floating block out, then hide it. Reopening during the fade cancels it. */
function fadeClose(el){
  if(el.hidden||el.classList.contains('out'))return;
  el.classList.add('out');
  el._t=setTimeout(()=>{el.hidden=true;el.classList.remove('out');el.classList.remove('back')},320);
}
function showBlock(el){clearTimeout(el._t);el.classList.remove('out');el.hidden=false}
function closePanel(){panel.hidden=true;fadeClose(tilt);fadeClose(tcard);fadeClose(ntag)}
function openPanel(name){
  hide(true);closeCard();
  if(name==='info'){
    if(mq.matches){tilt.hidden=true;panel.innerHTML=PANELS.info;panel.hidden=false;return}
    showBlock(tilt);
    /* the strip is as long as in the Figma: scale the three lines so the longest one fills it like the design does */
    tilt.style.setProperty('--k',1);
    const need=Math.max(...[...tilt.children].map(p=>p.offsetWidth)),room=tilt.clientWidth-32;
    tilt.style.setProperty('--k',(room/need).toFixed(4));
  }
  if(name==='contact'&&!mq.matches)showBlock(tcard);   /* the grey card now belongs to Contact; its content is a placeholder until the contact data arrives */
  if(name==='team'&&!mq.matches)showBlock(ntag);
}
document.addEventListener('click',e=>{
  if(!mq.matches){const k=flapAt(e);if(k>=0){openPanel(FLAP_ID[k]);return}}
  const b=e.target.closest('[data-panel]');
  if(b){openPanel(b.dataset.panel);return}
  if((!panel.hidden||!tilt.hidden||!tcard.hidden||!ntag.hidden)&&!panel.contains(e.target)&&!tcard.contains(e.target))closePanel();
  if(!card.hidden&&!card.contains(e.target)&&!e.target.closest('.item'))closeCard();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closePanel();closeCard();hide(true)}
  else if(panel.hidden&&tilt.hidden&&tcard.hidden&&ntag.hidden&&card.hidden&&(e.key==='ArrowRight'||e.key==='ArrowLeft')&&!e.target.closest('.cs')){step(e.key==='ArrowRight'?1:-1)}
});

/* entrance. Each folder is turned in 3D, and its outline is drawn apart as ONE line that begins as a straight line on the hinge and unfolds into the tab shape,
   so there is never a doubled or blinking line. Progress comes from one easing curve, so lines and turn stay in step. */
const ease=(()=>{
  const x1=.45,y1=.05,x2=.2,y2=1,cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
  const X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t,D=t=>(3*ax*t+2*bx)*t+cx;
  return x=>{
    if(x<=0)return 0;if(x>=1)return 1;
    let t=x;for(let i=0;i<8;i++){const e=X(t)-x,d=D(t);if(Math.abs(e)<1e-5||Math.abs(d)<1e-6)break;t-=e/d}
    return Y(t);
  };
})();
function runIntro(){
  const root=document.documentElement;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches||mq.matches){coverS=1;drawFlaps();root.classList.remove('pre');fitTabs();return}
  const DUR=1500,tabs=[...rail.querySelectorAll('.tab')].map((tab,k)=>({tab,fold:tab.parentElement.querySelector('.fold'),tp:tab.querySelector('.tp'),tf:tab.querySelector('.tf'),delay:850+k*190})),cover=$('.cover');
  const t0=performance.now();
  const frame=now=>{
    const el=now-t0;let busy=false;
    for(const f of tabs){
      const p=ease((el-f.delay)/DUR),th=90*(1-p),s=Math.cos(th*Math.PI/180),dy=f.tab._dy||0;
      if(p<1)busy=true;
      f.tab._s=s;
      f.fold.style.transform=p<1?`perspective(2400px) rotateY(${-th}deg)`:'';
      f.tp.setAttribute('d',tabD(dy,s));f.tf.setAttribute('d',tabF(dy,s));
    }
    const p=ease((el-250)/DUR),th=90*(1-p);
    if(p<1)busy=true;
    coverS=Math.cos(th*Math.PI/180);
    cover.style.transform=p<1?`perspective(2400px) rotateY(${-th}deg)`:'';
    drawFlaps();
    if(busy)requestAnimationFrame(frame);
  };
  frame(t0);root.classList.remove('pre');requestAnimationFrame(frame);
}
Promise.all([document.fonts.load('700 15px "Libre Franklin"'),document.fonts.load('550 11px "Libre Franklin"')]).catch(()=>{}).then(()=>{fitTabs();runIntro()});

/* the card turns over on click */
tcard.addEventListener('click',e=>{if(e.target.closest('a'))return;tcard.classList.toggle('back')});

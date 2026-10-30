/* Collection: one folder column per category (Desktop - 4), scrolling sideways like a filing drawer. */
const $=s=>document.querySelector(s);
const stage=$('#stage'),rail=$('#rail'),sheet=$('#sheet'),blank=$('#blank'),panel=$('#panel'),card=$('#card');

const ROW_Y=[39.87,191.58,343.30,495.01,646.72,798.43,950.15];
const ROW_PITCH=151.71,ITEM_H=85,ITEM_X=61.7;
const LABELS=['Resumes','Cover Letters','Portfolios','Brand Guidelines','Invoices','Proposals'];
const COUNTS=[10,8,9,5,7,3];
const TAB={
  t:'M53.5 0V257C53.5 262 51 267 46.5 269.5L7.5 291C3 293.5 .5 298 .5 303V1000',
  b:'M.5 0V690C.5 695 3 700 7.5 702.5L46.5 724C51 726.5 53.5 731 53.5 736V1000'
};
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
  const col=document.createElement('section'),k=t%2?'b':'t';
  col.className='col';col.setAttribute('aria-label',LABELS[t]);
  const cs=document.createElement('div'),ci=document.createElement('div');
  cs.className='cs';ci.className='ci';ci.style.height=Math.max(1080,ROW_Y[0]+ROW_PITCH*(n-1)+ITEM_H+60)+'px';
  ITEMS.filter(i=>i.type===t).forEach((it,v)=>{
    const d=document.createElement('div');
    d.className='item';d.dataset.id=it.id;d.tabIndex=0;d.setAttribute('role','button');
    d.style.setProperty('--x',ITEM_X+'px');d.style.setProperty('--d',(750+t*120+Math.min(v,6)*75)+'ms');d.style.setProperty('--y',(ROW_Y[0]+ROW_PITCH*v)+'px');
    d.innerHTML=`<span class="n">${pad(v+1)}.</span><span class="t"><span>${it.name}</span><span>${TYPES[t].n}</span><span>By <i>${it.by}</i></span><span>${it.date}</span><span class="go">Retrieve</span></span>`;
    ci.append(d);
  });
  cs.append(ci);
  const tab=document.createElement('div');tab.className='tab '+k;tab.style.setProperty('--d',(400+t*120)+'ms');
  tab.innerHTML=`<svg viewBox="0 0 54 1000" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="${TAB[k]}" stroke="currentColor"/></svg><p class="lab">${LABELS[t]}</p>`;
  col.append(cs,tab);rail.append(col);
  cs.addEventListener('scroll',()=>hide(true),{passive:true});
});

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
const SHEET_H=940,SHEET_MAXW=1400;
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
function Scroller(el,ax,max,over,snap){
  const get=()=>ax==='x'?el.scrollLeft:el.scrollTop,put=v=>{ax==='x'?el.scrollLeft=v:el.scrollTop=v};
  const RUB=70;
  let pos=0,tg=0,raf=0,t0=0,idle=0,k=11;
  function frame(t){
    const dt=Math.min(.05,(t-t0)/1000||.016),m=max();t0=t;
    pos+=(tg-pos)*(1-Math.exp(-dt*k));
    if(Math.abs(tg-pos)<.25)pos=tg;
    const c=clamp(pos,0,m);put(c);over(pos-c);
    raf=pos===tg?0:requestAnimationFrame(frame);
  }
  const run=()=>{if(!raf){t0=performance.now();raf=requestAnimationFrame(frame)}};
  function release(){
    const m=max();tg=clamp(tg,0,m);if(snap)tg=clamp(snap(tg),0,m);
    k=7;run();
  }
  return{
    at:()=>raf?tg:get(),
    push(d){
      const m=max();if(m<=0)return;
      if(!raf){pos=tg=get()}
      k=11;
      let rem=d;
      if(tg>=0&&tg<=m){const room=d>0?m-tg:-tg;if(Math.abs(d)<=Math.abs(room)){tg+=d;rem=0}else{tg+=room;rem=d-room}}
      if(rem){
        const o=tg<0?tg:tg>m?tg-m:0,dir=Math.sign(rem);
        if(o===0||Math.sign(o)===dir)tg=(dir>0?m:0)+clamp(o+rem*Math.max(0,1-Math.abs(o)/RUB)*.35,-RUB,RUB);
        else tg+=rem;
      }
      run();clearTimeout(idle);idle=setTimeout(release,130);
    },
    to(v){const m=max();if(!raf)pos=get();tg=clamp(v,0,m);k=7;run()}
  };
}
const cols=[...rail.children];
const colW=()=>rail.firstElementChild.offsetWidth;
const maxLeft=()=>rail.scrollWidth-rail.clientWidth;
const railS=Scroller(rail,'x',maxLeft,v=>cols.forEach(c=>{c.style.transform=v?`translateX(${-v}px)`:''}),v=>{const w=colW(),m=maxLeft(),r=Math.round(v/w)*w;return Math.abs(m-v)<Math.abs(r-v)?m:r});
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

/* menu */
const menu=$('#menu'),mbtn=$('#mbtn');
function setMenu(open){menu.classList.toggle('open',open);mbtn.setAttribute('aria-expanded',open);mbtn.textContent=open?'— Index':'Index'}
mbtn.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));

const PANELS={
  info:`<h2>Info</h2><p class="big">Carpeta Manila is a growing collection of open access templates and resources.</p><p>Every template is original, free to download and made with working designers, art directors and studios. Resumes, portfolios, cover letters, brand guidelines, invoices and more, each one filed in the software you work in.</p><p class="small">Formats: Figma, Canva, InDesign, Word, Pages, Google Docs, Keynote.</p>`,
  team:`<h2>Team</h2><p class="big">Name Surname<br>Name Surname<br>Name Surname</p><p>Placeholder names. Each template credits the creative who made it.</p>`,
  contact:`<h2>Contact</h2><p class="big">hello@carpetamanila.example</p><p>Write to suggest a collaboration or to submit a template.</p><p class="small">Placeholder address.</p>`
};
PANELS.menu=`<h2>— Index</h2><div class="mlist">${['info','team','contact'].map(k=>`<button data-panel="${k}">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')}</div>`;
function closePanel(){panel.hidden=true}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-panel]');
  if(b){hide(true);closeCard();panel.innerHTML=PANELS[b.dataset.panel];panel.hidden=false;return}
  if(!panel.hidden&&!panel.contains(e.target))closePanel();
  if(!card.hidden&&!card.contains(e.target)&&!e.target.closest('.item'))closeCard();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closePanel();closeCard();setMenu(false);hide(true)}
  else if(panel.hidden&&card.hidden&&(e.key==='ArrowRight'||e.key==='ArrowLeft')&&!e.target.closest('.cs')){step(e.key==='ArrowRight'?1:-1)}
});

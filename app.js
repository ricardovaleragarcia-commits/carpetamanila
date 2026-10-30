/* Collection: one folder column per category (Desktop - 4), scrolling sideways like a filing drawer. */
const $=s=>document.querySelector(s);
const stage=$('#stage'),rail=$('#rail'),sheet=$('#sheet'),sheetIn=$('#sheetIn'),panel=$('#panel');

const ROW_Y=[39.87,191.58,343.30,495.01,646.72,798.43,950.15];
const ROW_PITCH=151.71,ITEM_H=85,ITEM_X=61.7;
const LABELS=['Resumes','Cover Letters','Portfolios','Brand Guidelines','Invoices','Proposals'];
const COUNTS=[10,8,9,5,7,3];
const TAB={
  t:'M53.5 0V257C53.5 262 51 267 46.5 269.5L7.5 291C3 293.5 .5 298 .5 303V1000',
  b:'M.5 0V690C.5 695 3 700 7.5 702.5L46.5 724C51 726.5 53.5 731 53.5 736V1000'
};
const pad=n=>String(n).padStart(2,'0');

const ITEMS=[];
(function build(){
  let id=0;
  COUNTS.forEach((n,t)=>{
    for(let v=0;v<n;v++){
      id++;const seed=id*31+7,r=rng(seed);
      ITEMS.push({id,type:t,v,seed,pair:(v+t)%6,pal:(v*5+t*2)%6,lay:v%2,blur:22,
        name:`${ADJ[v%ADJ.length]} ${TYPES[t].short}`,sw:TYPES[t].sw[v%4],date:`${1+Math.floor(r()*28)} ${MON[Math.floor(r()*5)]} 2026`});
    }
  });
})();
const byId=new Map(ITEMS.map(i=>[i.id,i])),cache=new Map();

COUNTS.forEach((n,t)=>{
  const col=document.createElement('section'),k=t%2?'b':'t';
  col.className='col';col.setAttribute('aria-label',LABELS[t]);
  const cs=document.createElement('div'),ci=document.createElement('div');
  cs.className='cs';ci.className='ci';ci.style.height=Math.max(1080,ROW_Y[0]+ROW_PITCH*(n-1)+ITEM_H+60)+'px';
  ITEMS.filter(i=>i.type===t).forEach((it,v)=>{
    const c=content(it.seed),d=document.createElement('div');
    d.className='item';d.dataset.id=it.id;d.tabIndex=0;
    d.style.setProperty('--x',ITEM_X+'px');d.style.setProperty('--y',(ROW_Y[0]+ROW_PITCH*v)+'px');
    d.innerHTML=`<span class="n">${pad(v+1)}.</span><span class="t"><span>${it.name}</span><span>${TYPES[t].n}</span><span>By <i>${c.name}</i></span><span>${it.date}</span><span>${it.sw}</span></span>`;
    ci.append(d);
  });
  cs.append(ci);
  const tab=document.createElement('div');tab.className='tab '+k;
  tab.innerHTML=`<svg viewBox="0 0 54 1000" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="${TAB[k]}" stroke="currentColor"/></svg><p class="lab">${LABELS[t]}</p>`;
  col.append(cs,tab);rail.append(col);
  cs.addEventListener('scroll',()=>hide(true),{passive:true});
});

/* fit the 1920 x 1080 frame to the window; below 760px switch to the mobile drawer */
const mq=matchMedia('(max-width:760px)');
function fitStage(){
  const m=mq.matches;
  document.documentElement.classList.toggle('m',m);
  if(m){
    const sw=Math.min(innerWidth*.92,innerHeight*.86/1.3006,560);
    stage.style.setProperty('--sw',sw+'px');sheetIn.style.transform=`scale(${sw/816})`;
  }else{
    stage.style.setProperty('--s',Math.min(innerWidth/1920,innerHeight/1080));sheetIn.style.transform='';
  }
}
addEventListener('resize',fitStage);fitStage();

/* hover sheet: pointer-events none on desktop, so the next entry stays reachable underneath; on touch a tap opens it */
let hideT=0;
function show(el){
  clearTimeout(hideT);
  const id=+el.dataset.id,it=byId.get(id);
  if(!cache.has(id))cache.set(id,tplHTML(it));
  sheetIn.innerHTML=cache.get(id);
  sheet.classList.add('on');
}
function hide(now){
  clearTimeout(hideT);
  const go=()=>sheet.classList.remove('on');
  now?go():hideT=setTimeout(go,90);
}
rail.addEventListener('pointerover',e=>{
  if(e.pointerType==='touch'||mq.matches)return;
  const it=e.target.closest('.item');it?show(it):hide();
});
stage.addEventListener('pointerleave',()=>{if(!mq.matches)hide()});
rail.addEventListener('focusin',e=>{const it=e.target.closest('.item');if(it)show(it)});
rail.addEventListener('focusout',()=>{if(!mq.matches)hide()});
rail.addEventListener('click',e=>{const it=e.target.closest('.item');if(it&&(mq.matches||matchMedia('(hover:none)').matches)){e.stopPropagation();show(it)}});
document.addEventListener('click',e=>{if(mq.matches&&sheet.classList.contains('on')&&!e.target.closest('.item'))hide(true)});

/* sideways: wheel scrolls the column under the pointer, and moves the drawer when that column has nothing left to scroll */
const colW=()=>rail.firstElementChild.offsetWidth;
let lock=0,acc=0;
const maxLeft=()=>rail.scrollWidth-rail.clientWidth;
function goTo(i){rail.scrollTo({left:Math.max(0,Math.min(maxLeft(),i*colW())),behavior:'smooth'})}
function step(dir){goTo(Math.round(rail.scrollLeft/colW())+dir)}
rail.addEventListener('wheel',e=>{
  if(mq.matches)return;
  const dx=e.deltaX,dy=e.deltaY;
  if(Math.abs(dx)>Math.abs(dy)){hide(true);return}
  const cs=e.target.closest('.cs');
  if(cs&&((dy>0&&cs.scrollTop+cs.clientHeight<cs.scrollHeight-1)||(dy<0&&cs.scrollTop>0)))return;
  e.preventDefault();hide(true);
  if(performance.now()<lock)return;
  acc+=dy;
  if(Math.abs(acc)>30){step(acc>0?1:-1);acc=0;lock=performance.now()+550}
},{passive:false});
rail.addEventListener('scroll',()=>hide(true),{passive:true});

/* menu */
const menu=$('#menu'),mbtn=$('#mbtn');
function setMenu(open){menu.classList.toggle('open',open);mbtn.setAttribute('aria-expanded',open);mbtn.textContent=open?'— Menu':'Menu'}
mbtn.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));

const PANELS={
  index:`<h2>Index</h2><ul class="ix">${LABELS.map((l,i)=>`<li><button data-go="${i}"><span class="no">No. ${pad(i+1)}</span><span class="nm">${l}</span><span class="ld"></span><span class="ct">${COUNTS[i]}</span></button></li>`).join('')}</ul>`,
  info:`<h2>Info</h2><p class="big">Carpeta Manila is a growing collection of open access templates and resources.</p><p>Every template is original, free to download and made with working designers, art directors and studios. Resumes, portfolios, cover letters, brand guidelines, invoices and more.</p><p class="small">Formats: Figma, InDesign, Word, Google Docs, Keynote.</p>`,
  team:`<h2>Team</h2><p class="big">Name Surname<br>Name Surname<br>Name Surname</p><p>Placeholder names. Each template credits the creative who made it.</p>`,
  contact:`<h2>Contact</h2><p class="big">hello@carpetamanila.example</p><p>Write to suggest a collaboration or to submit a template.</p><p class="small">Placeholder address.</p>`
};
PANELS.menu=`<h2>— Menu</h2><div class="mlist">${['index','info','team','contact'].map(k=>`<button data-panel="${k}">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')}</div>`;
function closePanel(){panel.hidden=true}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');
  if(g){goTo(+g.dataset.go);closePanel();setMenu(false);return}
  const b=e.target.closest('[data-panel]');
  if(b){hide(true);panel.innerHTML=PANELS[b.dataset.panel];panel.hidden=false;return}
  if(!panel.hidden&&!panel.contains(e.target))closePanel();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closePanel();setMenu(false);hide(true)}
  else if(panel.hidden&&(e.key==='ArrowRight'||e.key==='ArrowLeft')&&!e.target.closest('.cs')){step(e.key==='ArrowRight'?1:-1)}
});

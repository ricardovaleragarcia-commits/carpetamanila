/* ============ data ============ */
const FONTS_URL='https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800&family=Bitter:ital,wght@0,400;0,700;0,800;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;700&family=Fraunces:ital,wght@0,400;0,500;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Syne:wght@500;700;800&display=swap';

const PAIRS=[['Fraunces','DM Sans'],['Instrument Serif','Archivo'],['Syne','IBM Plex Mono'],['Cormorant Garamond','Archivo'],['Bitter','DM Sans'],['Archivo','IBM Plex Mono']];
const PALS=[
  {n:'Manila',paper:'#fbf6ea',ink:'#1a1612',accent:'#b4532a',tint:'#ecd9b0'},
  {n:'Bone y cobalto',paper:'#f7f5f0',ink:'#12151c',accent:'#2b4bd6',tint:'#d9def5'},
  {n:'Noche',paper:'#14120f',ink:'#f1ebdd',accent:'#e0a526',tint:'#2a2620'},
  {n:'Musgo',paper:'#eef0e4',ink:'#1c2418',accent:'#3d6b3a',tint:'#cfd9b5'},
  {n:'Arcilla',paper:'#f8ece8',ink:'#2a1815',accent:'#c2455a',tint:'#f0cfc7'},
  {n:'Mono',paper:'#ffffff',ink:'#0d0d0d',accent:'#0d0d0d',tint:'#e6e6e6'}
];
const TYPES=[
  {id:'resume',n:'Resume',short:'Resume',sw:['Figma','Word','Pages','Google Docs']},
  {id:'cover',n:'Cover Letter',short:'Cover Letter',sw:['Word','Google Docs','Figma','Pages']},
  {id:'portfolio',n:'Portfolio (PDF)',short:'Portfolio',sw:['InDesign','Figma','Keynote','Illustrator']},
  {id:'brand',n:'Brand Guidelines',short:'Guidelines',sw:['InDesign','Figma','Illustrator','Keynote']},
  {id:'invoice',n:'Invoice',short:'Invoice',sw:['Word','Google Docs','Figma','Excel']},
  {id:'proposal',n:'Proposal',short:'Proposal',sw:['Figma','Keynote','InDesign','Google Docs']}
];
const ADJ=['Quiet','Ledger','Hairline','Margin','Index','Tabbed','Plain','Folio','Carbon','Grain','Stencil','Mono','Gazette','Atlas'];
const NAMES=['Marta Quispe','Joaquín Rey','Lena Okafor','Tomás Ibarra','Sofía Wren','Daniel Cho','Inés Valverde','Amaru Soto','Noor Haddad','Camila Ferrer','Ravi Menon','Elena Brandt','Mateo Lindqvist','Aiko Tanabe'];
const ROLES=['Art Director','Motion Designer','Illustrator','Brand Strategist','Photographer','Type Designer','Creative Developer','Copywriter'];
const ORGS=['Estudio Norte','Paper & Wire','Lumen Co.','Taller Sur','Harbor Press','Studio Ochre','Field Office','Casa Tinta'];
const CITIES=['Lima, Peru','Mexico City','Madrid','Buenos Aires','Lisbon','Bogotá'];
const CLIENTS=['Alder & Finch','North Pier','Marlowe Press','Casa Lúcida','Tidewater','Olive Hour'];
const BUL=['Led the identity system for a regional publisher across print and web.','Directed a team of four on a twelve-week campaign launch.','Cut production time by a third with a shared component library.','Presented concepts to clients and refined them through three rounds.','Built a reusable template kit now used by the whole studio.','Art directed shoots, edited selects and delivered final retouching.'];
const SKILLS=['Identity systems','Editorial layout','Typography','Motion design','Illustration','Art direction','Prototyping','Photo retouching','Copywriting'];
const DESC=['Brand identity system','Website design, 5 templates','Packaging illustration','Motion titles, 3 spots','Photo retouching, 40 images','Art direction, per day'];
const PROJ=['Harbor Press identity','Olive Hour packaging','Tidewater campaign','Casa Lúcida website','Marlowe Press books','North Pier signage'];
const MON=['Jun','Jul','Aug','Sep','Oct'];

function rng(seed){let s=(seed>>>0)||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296}}
function content(seed){
  const r=rng(seed*2654435761+17);const pk=a=>a[Math.floor(r()*a.length)];
  const name=pk(NAMES);const slug=name.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(' ','.');
  const [first,last]=name.split(' ');
  const sk=SKILLS.slice().sort(()=>r()-.5).slice(0,6);
  const ds=DESC.slice().sort(()=>r()-.5).slice(0,4).map(d=>({d,q:1+Math.floor(r()*9),rate:(12+Math.floor(r()*150))*10}));
  const YRS=['2023 – Now','2019 – 2023','2015 – 2019'];
  return{
    name,first,last,role:pk(ROLES),email:`${slug}@example.com`,site:`${slug.split('.')[1]}.example.com`,city:pk(CITIES),
    summary:'Designer working across identity, editorial and motion. Focused on clear systems and quiet, well-made things.',
    jobs:[0,1,2].map(i=>({role:pk(ROLES),org:pk(ORGS),yrs:YRS[i],b:[pk(BUL),pk(BUL)]})),
    skills:sk,client:pk(CLIENTS),inv:String(1000+Math.floor(r()*900)),items:ds,
    paras:['I am writing to introduce myself and to share how my work in identity and editorial design could support your upcoming projects.','Over the past eight years I have led small teams, built shared systems and delivered work that holds up in print and on screen. I care about clear structure, honest typography and a calm finish.','I would welcome the chance to talk through your plans for the year. My portfolio and references are available on request, and I can start on short notice.']
  };
}

/* ============ template css (also used in exported html) ============ */
const TPL_CSS=`.tpl{--h:'Fraunces';--b:'DM Sans';--paper:#fff;--ink:#111;--accent:#c33;--tint:#eee;--blur:22px;width:816px;height:1056px;box-sizing:border-box;padding:56px;position:relative;overflow:hidden;background:var(--paper);color:var(--ink);font:400 12.5px/1.55 var(--b),sans-serif}
.tpl *{box-sizing:border-box;margin:0}
.tpl h1,.tpl h2,.tpl h3{font-family:var(--h),serif;font-weight:500;line-height:1}
.tpl .lab{font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;opacity:.7;font-weight:500}
.tpl .acc{color:var(--accent);opacity:1}
.tpl .rule{height:1px;background:var(--ink)}
.tpl .stack{display:flex;flex-direction:column;gap:var(--g,14px)}
.tpl .row{display:flex;justify-content:space-between;gap:16px}
.tpl ul{list-style:none;padding:0}
.tpl table{width:100%;border-collapse:collapse}
.tpl th{font-weight:500;text-align:left;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;opacity:.7;padding:8px 0;border-bottom:1px solid var(--ink)}
.tpl td{padding:11px 0;border-bottom:1px solid color-mix(in srgb,var(--ink) 18%,transparent);vertical-align:top}
.tpl .r{text-align:right}
.tpl .ph{position:relative;overflow:hidden;background:var(--tint)}
.tpl .ph::before{content:"";position:absolute;inset:-25%;background:radial-gradient(circle at var(--x,30%) var(--y,30%),var(--accent) 0,transparent 55%),radial-gradient(circle at calc(100% - var(--x,30%)) calc(100% - var(--y,30%)),var(--ink) 0,transparent 48%);filter:blur(var(--blur));opacity:.6}`;
document.getElementById("tplcss").textContent=TPL_CSS;

/* ============ renderers ============ */
const money=n=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const blk=(l,h)=>`<div class="stack" style="--g:6px"><p class="lab">${l}</p>${h}</div>`;
const li=a=>a.map(x=>`<li>${x}</li>`).join('');
const RENDER={
resume(c,o,p,st){
  const jobs=c.jobs.map(j=>`<div class="stack" style="--g:4px"><div class="row"><h3 style="font-size:19px">${j.role}</h3><span class="lab">${j.yrs}</span></div><p style="opacity:.7">${j.org}</p><ul class="stack" style="--g:3px;margin-top:5px">${li(j.b)}</ul></div>`);
  const edu='<p>BA Graphic Design<br>Universidad de Artes<br>2011 – 2015</p>';
  const skills=`<ul class="stack" style="--g:3px">${li(c.skills)}</ul>`;
  if(o.lay===0)return`<div class="tpl" style="${st}"><div style="display:grid;grid-template-columns:220px 1fr;gap:40px"><div class="stack" style="--g:22px"><div class="ph" style="aspect-ratio:1/1.2"></div>${blk('Contact',`<p>${c.email}<br>${c.city}<br>${c.site}</p>`)}${blk('Skills',skills)}${blk('Education',edu)}</div><div class="stack" style="--g:26px"><div class="stack" style="--g:12px"><h1 style="font-size:58px;letter-spacing:-.01em">${c.first}<br>${c.last}</h1><p class="lab acc">${c.role}</p></div><div class="rule"></div><p style="font-size:14px;max-width:46ch">${c.summary}</p><p class="lab">Experience</p>${jobs.join('')}</div></div></div>`;
  return`<div class="tpl" style="${st}"><div class="stack" style="--g:24px"><h1 style="font-size:78px;letter-spacing:-.02em;line-height:.95">${c.name}</h1><div class="row" style="align-items:flex-end"><p class="lab acc">${c.role}</p><p style="text-align:right">${c.email} · ${c.city}</p></div><div class="rule" style="height:3px"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:36px"><div class="stack" style="--g:24px"><p class="lab">Experience</p>${jobs[0]}${jobs[1]}</div><div class="stack" style="--g:24px"><p class="lab">&nbsp;</p>${jobs[2]}${blk('Skills',skills)}${blk('Education',edu)}</div></div><div class="ph" style="height:150px;--x:70%;--y:40%"></div></div></div>`;
},
cover(c,o,p,st){
  const paras=c.paras.map(t=>`<p>${t}</p>`).join('');
  if(o.lay===0)return`<div class="tpl" style="${st}"><div class="stack" style="--g:34px"><div class="row" style="align-items:flex-start"><h1 style="font-size:44px">${c.name}</h1><p style="text-align:right">${c.email}<br>${c.city}<br>${c.site}</p></div><div class="rule"></div><p class="lab">October 29, 2026</p><p>${c.client}<br>Hiring team<br>12 Harbor Lane</p><p style="font-family:var(--h);font-size:20px">Dear ${c.client} team,</p><div class="stack" style="--g:14px;font-size:13.5px;max-width:60ch">${paras}</div><div class="stack" style="--g:4px"><p>Warm regards,</p><p style="font-family:var(--h);font-style:italic;font-size:38px;color:var(--accent)">${c.name}</p></div></div></div>`;
  return`<div class="tpl" style="${st}"><div style="display:grid;grid-template-columns:170px 1fr;gap:40px;height:100%"><div class="stack" style="--g:22px"><div class="ph" style="height:170px;--x:60%"></div>${blk('From',`<p>${c.name}<br>${c.email}<br>${c.city}</p>`)}${blk('To',`<p>${c.client}<br>Hiring team</p>`)}${blk('Date','<p>October 29, 2026</p>')}</div><div class="stack" style="--g:26px"><p class="lab acc">Application</p><h1 style="font-size:48px;letter-spacing:-.01em">${c.role}<br>position</h1><div class="rule"></div><p style="font-family:var(--h);font-size:20px">Dear ${c.client} team,</p><div class="stack" style="--g:14px;font-size:13.5px">${paras}</div><p style="font-family:var(--h);font-style:italic;font-size:38px;color:var(--accent);margin-top:auto">${c.name}</p></div></div></div>`;
},
portfolio(c,o,p,st){
  if(o.lay===0)return`<div class="tpl" style="${st}"><div class="stack" style="--g:30px;height:100%"><div class="row"><p class="lab">Portfolio</p><p class="lab">${c.name} · 2026</p></div><h1 style="font-size:118px;letter-spacing:-.03em;line-height:.88">Selected<br>Work<span style="color:var(--accent)">.</span></h1><div style="display:grid;grid-template-columns:1.3fr 1fr;grid-template-rows:200px 200px;gap:14px"><div class="ph" style="grid-row:span 2;--x:25%"></div><div class="ph" style="--x:70%;--y:20%"></div><div class="ph" style="--x:40%;--y:75%"></div></div><div class="row" style="align-items:flex-end;margin-top:auto"><p style="max-width:34ch">${c.role} based in ${c.city}. Identity, editorial and motion for studios, publishers and small brands.</p><p style="text-align:right">${c.email}</p></div></div></div>`;
  const rows=PROJ.slice(0,5).map((t,i)=>`<div class="row" style="padding:10px 0;border-bottom:1px solid color-mix(in srgb,var(--ink) 20%,transparent);align-items:baseline"><span class="lab" style="width:30px">0${i+1}</span><span style="flex:1;font-family:var(--h);font-size:20px">${t}</span><span style="width:150px">${c.role}</span><span class="lab">${2026-i}</span></div>`).join('');
  return`<div class="tpl" style="${st}"><div class="stack" style="--g:26px;height:100%"><div class="ph" style="height:430px;margin:-56px -56px 0;--x:65%;--y:35%"></div><div class="row" style="align-items:flex-end"><h1 style="font-size:72px;letter-spacing:-.02em">${c.name}</h1><p class="lab">Portfolio 2026</p></div><div class="rule"></div><div>${rows}</div></div></div>`;
},
brand(c,o,p,st){
  const f=PAIRS[o.pair];
  const mark=(inv)=>`<div style="width:96px;height:96px;border-radius:50%;background:${inv?'var(--paper)':'var(--accent)'};color:${inv?'var(--accent)':'var(--paper)'};display:grid;place-items:center;font-family:var(--h);font-size:56px;line-height:1">${c.client[0]}</div>`;
  const sw=[['Paper',p.paper],['Ink',p.ink],['Accent',p.accent],['Tint',p.tint]].map(([n,h])=>`<div class="stack" style="--g:5px"><div style="height:110px;background:${h};border:1px solid color-mix(in srgb,var(--ink) 25%,transparent)"></div><p style="font-weight:500">${n}</p><p class="lab" style="letter-spacing:.08em">${h.toUpperCase()}</p></div>`).join('');
  const body=`<div class="stack" style="--g:14px"><p class="lab">01 · Colour</p><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">${sw}</div></div><div class="stack" style="--g:14px"><p class="lab">02 · Typography</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:30px"><div class="stack" style="--g:4px"><p style="font-family:var(--h);font-size:112px;line-height:.9">Aa</p><p style="font-weight:500">${f[0]}</p><p class="lab">Headlines</p></div><div class="stack" style="--g:4px"><p style="font-size:112px;line-height:.9">Aa</p><p style="font-weight:500">${f[1]}</p><p class="lab">Text</p></div></div></div><div class="row" style="margin-top:auto"><p class="lab">${c.client} · Brand Guidelines</p><p class="lab">01 / 12</p></div>`;
  if(o.lay===0)return`<div class="tpl" style="${st}"><div class="stack" style="--g:30px;height:100%"><div class="row" style="align-items:flex-start">${mark(false)}<p class="lab">Version 1.0</p></div><h1 style="font-size:84px;letter-spacing:-.025em;line-height:.92">Brand<br>Guidelines</h1><div class="rule"></div>${body}</div></div>`;
  return`<div class="tpl" style="${st}"><div class="stack" style="--g:30px;height:100%"><div style="height:340px;margin:-56px -56px 0;background:var(--accent);color:var(--paper);padding:56px;display:flex;flex-direction:column;justify-content:space-between">${mark(true)}<h1 style="font-size:74px;letter-spacing:-.025em;line-height:.92">Brand<br>Guidelines</h1></div>${body}</div></div>`;
},
invoice(c,o,p,st){
  const sub=c.items.reduce((a,x)=>a+x.q*x.rate,0),tax=sub*.1;
  const rows=c.items.map(x=>`<tr><td>${x.d}</td><td class="r">${x.q}</td><td class="r">${money(x.rate)}</td><td class="r">${money(x.q*x.rate)}</td></tr>`).join('');
  const head=o.lay===0
    ?`<div class="row" style="align-items:flex-end"><h1 style="font-size:84px;letter-spacing:-.02em">Invoice</h1><div style="text-align:right"><p class="lab">No.</p><p style="font-family:var(--h);font-size:28px">${c.inv}</p></div></div>`
    :`<div class="row" style="align-items:flex-end"><div class="stack" style="--g:6px"><p class="lab acc">Invoice</p><h1 style="font-size:120px;letter-spacing:-.03em;line-height:.85">${c.inv}</h1></div><p class="lab" style="text-align:right">Issued Oct 29, 2026</p></div>`;
  const band=o.lay===1?'<div style="position:absolute;left:0;top:0;bottom:0;width:22px;background:var(--accent)"></div>':'';
  return`<div class="tpl" style="${st}">${band}<div class="stack" style="--g:30px;height:100%">${head}<div class="rule"></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">${blk('From',`<p>${c.name}<br>${c.email}<br>${c.city}</p>`)}${blk('Billed to',`<p>${c.client}<br>Accounts payable<br>12 Harbor Lane</p>`)}${blk('Dates','<p>Issued Oct 29, 2026<br>Due Nov 28, 2026</p>')}</div><table><thead><tr><th>Description</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead><tbody>${rows}</tbody></table><div class="stack" style="--g:7px;width:270px;margin-left:auto"><div class="row"><span>Subtotal</span><span>${money(sub)}</span></div><div class="row"><span>Tax 10%</span><span>${money(tax)}</span></div><div class="rule"></div><div class="row" style="align-items:baseline"><span class="lab">Total due</span><span style="font-family:var(--h);font-size:30px">${money(sub+tax)}</span></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:auto">${blk('Notes','<p>Thank you for the work together. Late payments accrue 2% per month.</p>')}${blk('Payment','<p>Example Bank<br>IBAN XX00 0000 0000 0000<br>Ref. '+c.inv+'</p>')}</div></div></div>`;
},
proposal(c,o,p,st){
  const ph=['Discovery','Design','Delivery'];
  const scope=[['Research and positioning','2 weeks'],['Identity and website design','5 weeks'],['Templates, handover and training','3 weeks']].map((s,i)=>`<div class="row" style="padding:9px 0;border-bottom:1px solid color-mix(in srgb,var(--ink) 20%,transparent);align-items:baseline"><span class="lab" style="width:30px">0${i+1}</span><span style="flex:1;font-family:var(--h);font-size:19px">${s[0]}</span><span class="lab">${s[1]}</span></div>`).join('');
  const bars=[[0,20],[20,50],[70,30]].map((b,i)=>`<div style="display:grid;grid-template-columns:100px 1fr;align-items:center;gap:12px"><span>${ph[i]}</span><div style="position:relative;height:12px;background:color-mix(in srgb,var(--ink) 10%,transparent)"><div style="position:absolute;left:${b[0]}%;width:${b[1]}%;top:0;bottom:0;background:var(--accent)"></div></div></div>`).join('');
  const top=o.lay===1?'<div class="ph" style="height:230px;margin:-56px -56px 0;--x:60%;--y:40%"></div>':'';
  return`<div class="tpl" style="${st}"><div class="stack" style="--g:24px;height:100%">${top}<div class="row"><p class="lab">Proposal</p><p class="lab">Valid until Nov 30, 2026</p></div><h1 style="font-size:62px;letter-spacing:-.02em;line-height:.98">Identity &amp; website<br>for ${c.client}</h1><p class="lab acc">Prepared by ${c.name}</p><div class="rule"></div><p style="font-size:14px;max-width:52ch">A three-phase plan to refresh the brand and launch a small site that is easy to keep up to date.</p><p class="lab">Scope</p><div>${scope}</div><p class="lab">Timeline · 10 weeks</p><div class="stack" style="--g:8px">${bars}</div><div class="row" style="margin-top:auto;align-items:flex-end"><div class="stack" style="--g:4px"><p class="lab">Investment</p><p style="font-family:var(--h);font-size:40px">$14,500.00</p></div><div class="stack" style="--g:22px;width:240px"><div class="rule"></div><p class="lab">Client signature</p></div></div></div></div>`;
}
};
function tplHTML(o){
  const c=content(o.seed),p=PALS[o.pal],f=PAIRS[o.pair];
  const st=`--h:'${f[0]}';--b:'${f[1]}';--paper:${p.paper};--ink:${p.ink};--accent:${p.accent};--tint:${p.tint};--blur:${o.blur??22}px`;
  return RENDER[TYPES[o.type].id](c,o,p,st);
}
function exportDoc(o){
  return`<!doctype html>\n<html><head><meta charset="utf-8"><title>${TYPES[o.type].n} template</title>\n<link rel="stylesheet" href="${FONTS_URL}">\n<style>body{margin:0;background:#ddd}${TPL_CSS}</style></head>\n<body>${tplHTML(o)}</body></html>`;
}


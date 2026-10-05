/* PURSUE - all app logic: data (LocalStorage), login, pages, chatbot, settings */
/* ============ 1. LOGO (P + rising arrow = "pursue") ============ */
const LOGO=(s=34)=>`<svg width="${s}" height="${s}" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="lgr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E74FF"/><stop offset="1" stop-color="#0FB5A0"/></linearGradient></defs><rect width="40" height="40" rx="11" fill="url(#lgr)"/><path d="M13 30V10h8.5a6 6 0 0 1 0 12H13" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 31l8-8m0 0h-6m6 0v6" fill="none" stroke="#FFC24B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ILL=`<svg class="ill" viewBox="0 0 520 420" aria-hidden="true"><circle cx="270" cy="210" r="190" fill="var(--brand-s)"/>
<rect x="150" y="140" width="240" height="160" rx="14" fill="var(--surf)" stroke="var(--brand)" stroke-width="4"/><rect x="115" y="300" width="310" height="16" rx="8" fill="var(--brand)"/>
<rect x="175" y="168" width="110" height="12" rx="6" fill="var(--brand)"/><rect x="175" y="194" width="170" height="8" rx="4" fill="var(--line)"/><rect x="175" y="214" width="140" height="8" rx="4" fill="var(--line)"/><rect x="175" y="246" width="80" height="28" rx="9" fill="var(--teal)"/>
<g class="f1"><rect x="330" y="60" width="150" height="58" rx="14" fill="var(--surf)"/><text x="346" y="86" font-size="14" font-weight="700" fill="var(--ink)">New project</text><text x="346" y="106" font-size="14" font-weight="700" fill="#F5A524">₹5,000</text></g>
<g class="f2"><rect x="30" y="100" width="130" height="46" rx="23" fill="var(--teal)"/><text x="56" y="129" font-size="15" font-weight="700" fill="#fff">UI/UX ✓</text></g>
<g class="f3"><rect x="50" y="335" width="160" height="46" rx="23" fill="var(--brand)"/><text x="72" y="364" font-size="15" font-weight="700" fill="#fff">Proposal sent</text></g></svg>`;

/* ============ 2. DATA: users, projects, proposals, notifications, messages — all in LocalStorage ============ */
const DK='pursue_db',SK='pursue_session';
const CATS=['All','Web Development','Design','Data & AI','Marketing','Media','Engineering','Other'];
const ICON={'Web Development':'💻','Design':'🎨','Data & AI':'🤖','Marketing':'📣','Media':'🎬','Engineering':'🔧','Other':'✨'};
const COLORS=['#6C4CF1','#0FB5A0','#E5484D','#F5A524','#3E63DD','#D6409F'];
const DEFSET={theme:'system',nProp:true,nMsg:true,nConn:true,visible:true};
const mk=(id,name,role,edu,skills)=>({id,name,email:id+'@seed.local',pass:null,role,edu,about:'',skills,bm:[],conn:{},set:{...DEFSET},seed:true});
const SEEDU=[mk('c1','TechFest Team','client','Event cell · NIT',[]),mk('c2','Priya Bakery','client','Local business',[]),mk('c3','StartUp Labs','client','Early-stage startup',[]),
 mk('s1','Arjun Reddy','freelancer','CSE · 3rd year',['React','Node.js','MongoDB']),mk('s2','Sneha Rao','freelancer','Design · 2nd year',['Figma','UI/UX','Logo Design']),
 mk('s3','Karthik N','freelancer','AIML · 4th year',['Python','Data Analysis','ML']),mk('s4','Meera Joshi','freelancer','BBA · 3rd year',['SEO','Social Media','Content Writing']),
 mk('s5','Rahul Verma','freelancer','ECE · 2nd year',['Arduino','Embedded C','CAD']),mk('s6','Divya S','freelancer','B.Com · 3rd year',['Excel','Data Entry','Tally'])];
const P=(id,title,cat,mode,min,max,days,owner,skills,desc)=>({id,title,cat,mode,min,max,days,owner,skills,desc});
const SEEDP=[P('p1','College Event Website','Web Development','Remote',2000,5000,14,'c1',['HTML','CSS','JavaScript'],'Responsive website for our tech fest with schedule, registration and contact page.'),
 P('p2','Bakery Logo & Brand Kit','Design','Remote',1500,3000,7,'c2',['Logo Design','Figma'],'Logo, colour palette and visiting card for a new home bakery.'),
 P('p3','Sales Data Dashboard','Data & AI','Remote',3000,6000,10,'c3',['Python','Data Analysis'],'Clean a monthly sales CSV and chart the trends by region.'),
 P('p4','Instagram Content Calendar','Marketing','Remote',1000,2500,5,'c2',['Social Media','Content Writing'],'Plan 30 days of posts with captions and hashtags for a food brand.'),
 P('p5','Promo Video Editing','Media','Remote',2000,4000,6,'c1',['Video Editing'],'Edit a 60-second highlight reel from fest footage.'),
 P('p6','Inventory Excel Sheet','Other','Remote',800,1800,4,'c2',['Excel','Data Entry'],'Inventory tracker with stock alerts and a monthly summary.'),
 P('p7','Mobile App UI Screens','Design','Remote',4000,8000,12,'c3',['UI/UX','Figma'],'Design 10 screens for a habit-tracking app with a clickable prototype.'),
 P('p8','Arduino Plant Monitor','Engineering','On-site',3500,7000,15,'c3',['Arduino','Embedded C'],'Prototype a soil-moisture sensor with LED alerts.')];
let DB=null;try{DB=JSON.parse(localStorage.getItem(DK))}catch(e){}
if(!DB)DB={users:SEEDU,projects:SEEDP,apps:[],notes:[],msgs:{}};
const save=()=>{try{localStorage.setItem(DK,JSON.stringify(DB))}catch(e){}};
let ME=null,ready=false;
const UI={page:'home',q:'',cat:'All',mode:'Any',sort:'new',chat:null,menu:false};

/* ============ 3. HELPERS ============ */
const $=s=>document.querySelector(s);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const user=id=>id==='bot'?BOT:DB.users.find(u=>u.id===id),proj=id=>DB.projects.find(p=>p.id===id);
const ago=t=>{const m=Math.round((Date.now()-t)/6e4);return m<1?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' h ago':Math.round(m/1440)+' d ago'};
const hash=s=>{let h=5381;for(const c of s)h=(h*33^c.charCodeAt(0))>>>0;return h.toString(36)}; // demo-only hashing, not real security
const key=(a,b)=>[a,b].sort().join('|');
const avatar=u=>u.bot?`<div class="av" style="background:linear-gradient(135deg,#6C4CF1,#0FB5A0)">🤖</div>`:`<div class="av" style="background:${COLORS[u.name.charCodeAt(0)%6]}">${esc(u.name[0].toUpperCase())}</div>`;
function toast(m){const e=document.createElement('div');e.className='t';e.textContent=m;$('#toast').append(e);setTimeout(()=>e.remove(),2600)}
function modal(h){closeModal();const o=document.createElement('div');o.className='ov';o.id='ov';o.innerHTML=`<div class="md">${h}</div>`;o.onclick=e=>{if(e.target===o)closeModal()};document.body.append(o)}
function closeModal(){$('#ov')?.remove()}
function ask(q,fn){modal(`<h2>${q}</h2><div class="row" style="margin-top:16px"><button class="btn red" onclick="closeModal();${fn}()">Yes, continue</button><button class="btn ghost" onclick="closeModal()">Cancel</button></div>`)}
function go(p){UI.page=p;UI.menu=false;render();scrollTo(0,0)}
// create a notification for a user, respecting their notification settings
function notify(to,ic,txt,type){const u=user(to);if(!u||u.set[type]===false)return;DB.notes.unshift({id:Date.now()+Math.random(),to,ic,txt,at:Date.now(),read:false});save();if(ready)renderNav()}
function applyTheme(){const t=ME?.set.theme,r=document.documentElement;t&&t!=='system'?r.dataset.theme=t:r.removeAttribute('data-theme')}

/* ============ 4. AUTH (sign in / join, two roles) ============ */
function authModal(mode='join',role='freelancer'){
 const j=mode==='join';
 modal(`<h2>${j?'Join PURSUE':'Welcome back'}</h2>
 ${j?`<div class="seg"><button class="${role==='freelancer'?'on':''}" onclick="authModal('join','freelancer')">💼 I want to earn</button><button class="${role==='client'?'on':''}" onclick="authModal('join','client')">📝 I want to hire</button></div><label>Full name</label><input id="an" autocomplete="name">`:''}
 <label>Email</label><input id="ae" type="email" autocomplete="email"><label>Password</label><input id="ap" type="password" placeholder="At least 6 characters">
 <p id="err" style="color:var(--red);margin:8px 0"></p>
 <button class="btn big" onclick="doAuth('${mode}','${role}')">${j?'Create account':'Sign in'}</button>
 ${j?'':'<button class="btn big ghost" style="margin-top:10px" onclick="$(\'#ae\').value=\'bujji123@gmail.com\';$(\'#ap\').value=\'kpk123\'">Use demo account (Bujji)</button>'}<p class="mut c" style="margin:14px auto 0">${j?'Already a member? <a onclick="authModal(\'login\')">Sign in</a>':'New to PURSUE? <a onclick="authModal(\'join\')">Join now</a>'}</p>`);
}
function doAuth(mode,role){
 const e=$('#ae').value.trim().toLowerCase(),p=$('#ap').value,n=$('#an')?.value.trim(),err=m=>$('#err').textContent=m;
 if(!/^\S+@\S+\.\S+$/.test(e))return err('Enter a valid email address.');
 if(p.length<6)return err('Password needs at least 6 characters.');
 let u=DB.users.find(x=>x.email===e);
 if(mode==='join'){
  if(!n)return err('Enter your name.');if(u)return err('This email is already registered. Sign in instead.');
  u={id:'u'+Date.now(),name:n,email:e,pass:hash(p),role,edu:'',about:'',skills:[],bm:[],conn:{},set:{...DEFSET},at:Date.now()};
  DB.users.push(u);DB.msgs[key('c1',u.id)]=[{f:'c1',t:'Welcome to PURSUE! Check the Projects page and say hi if you need anything.',at:Date.now()}];
  ME=u;DB.notes.unshift(...NEWN(u.id,role));
 }else if(!u||u.pass!==hash(p))return err('Email or password is incorrect.');
 ME=u;localStorage.setItem(SK,u.id);save();closeModal();UI.page='home';applyTheme();render();toast('Welcome, '+u.name.split(' ')[0]);
}
function logout(){localStorage.removeItem(SK);ME=null;UI.menu=false;applyTheme();render()}

/* ============ 5. HEADER ============ */
function renderNav(){
 if(!ME){$('#nav').innerHTML=`<a class="lg" onclick="render()" style="color:inherit">${LOGO()}<span class="wm">PURSUE</span></a><span class="sp"></span><button class="btn out sm" style="border-radius:999px;padding:8px 18px" onclick="authModal('login')">Sign in</button><button class="btn sm" style="border-radius:999px;padding:10px 18px;margin-left:6px" onclick="authModal('join')">Join now</button>`;return}
 const un=DB.notes.filter(n=>n.to===ME.id&&!n.read).length;
 const IC=[['home','🏠'],['projects','💼'],['network','🤝'],['messages','💬'],['notes','🔔'],['me','👤'],['settings','⚙️']];
 $('#nav').innerHTML=`<a class="lg" onclick="go('home')" style="color:inherit">${LOGO()}<span class="wm">PURSUE</span></a><span class="sp"></span>`+
 IC.map(([k,i])=>`<button class="ib ${UI.page===k?'on':''} ${k==='notes'&&un?'ring':''}" onclick="go('${k}')" title="${tr(k)}" aria-label="${tr(k)}">${i}${k==='notes'&&un?`<span class="dot">${un}</span>`:''}</button>`).join('');
}
document.addEventListener('click',e=>{if(UI.menu&&!e.target.closest('.pm')){UI.menu=false;renderNav()}});

/* ============ 6. PROJECTS: card, filter, details, apply, post ============ */
function card(p){
 const o=user(p.owner),own=ME.id===p.owner,fl=ME.role==='freelancer',ap=DB.apps.find(a=>a.pid===p.id&&a.uid===ME.id);
 return `<div class="card pc"><div class="row"><span class="tag">${esc(p.cat)}</span>${p.hired?'<span class="tag" style="background:var(--teal);color:#fff">Hired</span>':''}
 ${fl?`<button class="bm" onclick="toggleBm('${p.id}')" aria-label="Save">${ME.bm.includes(p.id)?'🔖':'📑'}</button>`:''}</div>
 <h3>${esc(p.title)}</h3><div class="mut">by ${esc(o?.name||'Unknown')} · ${esc(p.mode)} · ${p.days} days</div>
 <div>${p.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div><div class="price">₹${p.min.toLocaleString()} – ₹${p.max.toLocaleString()}</div>
 <div class="row"><button class="btn ghost sm" onclick="details('${p.id}')">View details</button>
 ${own?'<span class="mut">Your project</span>':ap?`<span class="tag" style="background:var(--teal);color:#fff">✓ ${ap.status}</span>`:fl&&!p.hired?`<button class="btn sm" onclick="applyForm('${p.id}')">Apply</button>`:''}</div></div>`;
}
function filtered(){const q=UI.q.toLowerCase();
 const r=DB.projects.filter(p=>(UI.cat==='All'||p.cat===UI.cat)&&(UI.mode==='Any'||p.mode===UI.mode)&&(!q||(p.title+p.desc+p.skills.join(' ')).toLowerCase().includes(q)));
 if(UI.sort==='high')r.sort((a,b)=>b.max-a.max);if(UI.sort==='low')r.sort((a,b)=>a.min-b.min);return r}
function toggleBm(id){const i=ME.bm.indexOf(id);i<0?(ME.bm.push(id),toast('Project saved')):(ME.bm.splice(i,1),toast('Removed from saved'));save();render()}
function details(id){const p=proj(id);modal(`<h2>${esc(p.title)}</h2><p class="mut">${esc(user(p.owner)?.name)} · ${esc(p.cat)} · ${esc(p.mode)}</p><p>${esc(p.desc)}</p>
 <div>${p.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div><p class="price">Budget ₹${p.min.toLocaleString()} – ₹${p.max.toLocaleString()} · ${p.days} days</p>
 <div class="row">${ME.role==='freelancer'&&!p.hired&&!DB.apps.find(a=>a.pid===id&&a.uid===ME.id)?`<button class="btn" onclick="applyForm('${id}')">Apply now</button>`:''}<button class="btn ghost" onclick="closeModal()">Close</button></div>`)}
function applyForm(id){const p=proj(id);modal(`<h2>Apply: ${esc(p.title)}</h2><p class="mut">Client budget ₹${p.min}–₹${p.max}</p>
 <label>Your bid (₹)</label><input id="bid" type="number" value="${p.min}"><label>Why are you a good fit?</label><textarea id="pm" rows="4" placeholder="Mention your skills and similar work"></textarea>
 <p id="err" style="color:var(--red)"></p><div class="row"><button class="btn" onclick="submitProposal('${id}')">Send proposal</button><button class="btn ghost" onclick="closeModal()">Cancel</button></div>`)}
function submitProposal(pid){
 const bid=+$('#bid').value,msg=$('#pm').value.trim();
 if(!bid||bid<100)return $('#err').textContent='Enter a bid of at least ₹100.';
 if(msg.length<15)return $('#err').textContent='Write at least 15 characters about your fit.';
 const a={id:'a'+Date.now(),pid,uid:ME.id,bid,msg,at:Date.now(),status:'Pending'};DB.apps.push(a);const p=proj(pid);
 notify(ME.id,'📨','Proposal sent for "'+p.title+'"','nProp');notify(p.owner,'📥',ME.name+' applied to "'+p.title+'"','nProp');
 save();closeModal();toast('Proposal sent');render();
 if(user(p.owner)?.seed)setTimeout(()=>shortlist(a.id),8000); // demo clients reply automatically
}
function shortlist(id){const a=DB.apps.find(x=>x.id===id);if(a&&a.status==='Pending'){a.status='Shortlisted';notify(a.uid,'⭐','You were shortlisted for "'+proj(a.pid).title+'"','nProp');save();if(ready)render()}}
function decide(id,st){const a=DB.apps.find(x=>x.id===id),p=proj(a.pid);a.status=st;if(st==='Accepted')p.hired=a.uid;
 notify(a.uid,st==='Rejected'?'❌':'✅','Your proposal for "'+p.title+'" was '+st.toLowerCase(),'nProp');save();toast('Marked '+st);render()}
function postForm(){modal(`<h2>Post a project</h2><label>Title</label><input id="pt"><label>Category</label><select id="pc">${CATS.slice(1).map(c=>`<option>${c}</option>`).join('')}</select>
 <label>Skills needed (comma separated)</label><input id="ps"><label>Budget min / max (₹)</label><div class="row"><input id="p1" type="number" style="width:48%"><input id="p2" type="number" style="width:48%"></div>
 <label>Description</label><textarea id="pd" rows="3"></textarea><p id="err" style="color:var(--red)"></p><div class="row"><button class="btn" onclick="postProject()">Publish project</button><button class="btn ghost" onclick="closeModal()">Cancel</button></div>`)}
function postProject(){const t=$('#pt').value.trim(),mn=+$('#p1').value,mx=+$('#p2').value,sk=$('#ps').value.split(',').map(s=>s.trim()).filter(Boolean);
 if(!t||!sk.length||!mn||mx<mn)return $('#err').textContent='Add a title, at least one skill and a valid budget range.';
 DB.projects.unshift(P('u'+Date.now(),t,$('#pc').value,'Remote',mn,mx,10,ME.id,sk,$('#pd').value.trim()||'No description.'));
 save();closeModal();toast('Project published');render()}

/* ============ 7. PAGES ============ */
function landing(){
 const n=c=>DB.projects.filter(p=>p.cat===c).length;
 return `<section class="lh"><div><h1>Find real projects and build your career</h1><p class="rt">Made for <b id="rw">developers</b></p><div class="stack">
 <button class="btn big" onclick="authModal('join','freelancer')">💼 Join as a freelancer</button><button class="btn big out" onclick="authModal('join','client')">📝 Join as a client</button><button class="btn big out" onclick="authModal('login')">Sign in with email</button></div>
 <p class="mut c" style="margin:16px 0 8px">By continuing, you agree to PURSUE's User Agreement and Privacy Policy.</p><p class="c">New to PURSUE? <a onclick="authModal('join')">Join now</a></p></div>${ILL}</section>
 <p class="mut">Handpicked projects from real clients</p><div class="g4">${DB.projects.slice(0,8).map(p=>`<div class="card lc" onclick="authModal('join')"><div class="row"><span class="mut">${esc(p.cat)}</span><span class="sp"></span><span class="ic" style="font-size:22px;display:inline-block">${ICON[p.cat]||'✨'}</span></div><h3 style="margin:16px 0 6px;font-size:18px">${esc(p.title)}</h3><span class="mut">₹${p.min.toLocaleString()} – ₹${p.max.toLocaleString()}</span></div>`).join('')}</div>
 <h2 class="sec">Topic Categories</h2><div class="g4">${CATS.slice(1).map(c=>`<div class="card lc" onclick="authModal('join')"><div class="ic" style="font-size:26px;display:inline-block">${ICON[c]}</div><h3 style="margin:30px 0 4px;font-size:18px">${c}</h3><span class="mut">${n(c)} projects</span></div>`).join('')}</div>`;
}
function pHomeF(){ // freelancer dashboard
 const mine=DB.apps.filter(a=>a.uid===ME.id),sk=ME.skills.map(s=>s.toLowerCase());
 const rec=DB.projects.filter(p=>!p.hired&&p.owner!==ME.id).map(p=>[p,p.skills.filter(s=>sk.includes(s.toLowerCase())).length]).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
 return `<h2>${tr('hi')} ${esc(ME.name.split(' ')[0])} 👋</h2><p class="mut">Here is your activity at a glance.</p>
 <div class="stats"><div class="card"><b>${mine.length}</b>proposals sent</div><div class="card"><b>${mine.filter(a=>a.status==='Shortlisted'||a.status==='Accepted').length}</b>shortlisted or hired</div><div class="card"><b>${ME.bm.length}</b>saved</div><div class="card"><b>${Object.values(ME.conn).filter(c=>c==='connected').length}</b>connections</div></div>
 <h2 class="sec">${sk.length?'Recommended for your skills':'Open projects'}</h2>${sk.length?'':'<p class="mut">Add skills in your profile to get better matches.</p>'}<div class="grid">${rec.map(card).join('')}</div>
 <h2 class="sec">Browse by area</h2><div class="chips">${CATS.slice(1).map(c=>`<button class="chip" onclick="UI.cat='${c}';go('projects')">${ICON[c]} ${c}</button>`).join('')}</div>`;
}
function pHomeC(){ // client dashboard: my projects + proposals received
 const mp=DB.projects.filter(p=>p.owner===ME.id);
 return `<div class="row"><h2 style="flex:1">${tr('hi')} ${esc(ME.name.split(' ')[0])} 👋</h2><button class="btn" onclick="postForm()">+ Post a project</button></div>
 <div class="stats"><div class="card"><b>${mp.length}</b>projects posted</div><div class="card"><b>${DB.apps.filter(a=>proj(a.pid)?.owner===ME.id).length}</b>proposals received</div><div class="card"><b>${mp.filter(p=>p.hired).length}</b>freelancers hired</div></div>
 <h2 class="sec">Your projects</h2>${mp.length?mp.map(p=>`<div class="card" style="margin-bottom:14px"><div class="row"><h3 style="flex:1">${esc(p.title)}</h3>${p.hired?'<span class="tag" style="background:var(--teal);color:#fff">Hired</span>':''}<span class="price">₹${p.min}–₹${p.max}</span></div>
 ${DB.apps.filter(a=>a.pid===p.id).map(a=>{const u=user(a.uid);return `<div class="app"><b>${esc(u.name)}</b> · bid ₹${a.bid} <span class="tag">${a.status}</span><div class="mut" style="margin:4px 0 8px">${esc(a.msg)}</div>
 ${p.hired?'':`<div class="row"><button class="btn sm ok" onclick="decide('${a.id}','Accepted')">Accept</button><button class="btn sm ghost" onclick="decide('${a.id}','Shortlisted')">Shortlist</button><button class="btn sm ghost" onclick="decide('${a.id}','Rejected')">Reject</button><button class="btn sm ghost" onclick="openChat('${u.id}')">Message</button></div>`}</div>`}).join('')||'<div class="mut app">No proposals yet. Freelancers will appear here.</div>'}</div>`).join(''):'<div class="empty">You have not posted anything yet. Post a project to start receiving proposals.</div>'}`;
}
function pProjects(){return `<div class="row"><h2 style="flex:1">${tr('projects')}</h2>${ME.role==='client'?'<button class="btn" onclick="postForm()">+ Post a project</button>':''}</div>
 <div class="row" style="margin-top:14px"><input style="flex:2;min-width:200px" placeholder="Search title, skill..." value="${esc(UI.q)}" oninput="UI.q=this.value;showList()" aria-label="Search">
 <select style="flex:1" onchange="UI.mode=this.value;showList()">${['Any','Remote','On-site'].map(m=>`<option ${UI.mode===m?'selected':''}>${m}</option>`).join('')}</select>
 <select style="flex:1" onchange="UI.sort=this.value;showList()"><option value="new">Newest</option><option value="high" ${UI.sort==='high'?'selected':''}>Highest budget</option><option value="low" ${UI.sort==='low'?'selected':''}>Lowest budget</option></select></div>
 <div class="chips">${CATS.map(c=>`<button class="chip ${UI.cat===c?'on':''}" onclick="UI.cat='${c}';render()">${c}</button>`).join('')}</div><div id="plist"></div>`}
function showList(){const r=filtered();$('#plist').innerHTML=r.length?`<div class="grid">${r.map(card).join('')}</div>`:'<div class="empty">No projects match. Try another keyword or clear the filters.</div>'}
function pNetwork(){
 const us=DB.users.filter(u=>u.id!==ME.id&&u.set.visible!==false);
 return `<h2>${tr('network')}</h2><p class="mut">${Object.values(ME.conn).filter(c=>c==='connected').length} connections</p><div class="grid" style="margin-top:14px">`+us.map(u=>{const c=ME.conn[u.id];
 return `<div class="card"><div class="row">${avatar(u)}<div><b>${esc(u.name)}</b><div class="mut">${u.role==='client'?'Client':'Freelancer'} · ${esc(u.edu||'PURSUE member')}</div></div></div>
 <div style="margin:10px 0">${u.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div>
 ${c==='connected'||ME.role==='client'&&u.role==='freelancer'?`<button class="btn ghost sm" onclick="openChat('${u.id}')">Message</button>`:c==='sent'?'<button class="btn ghost sm" disabled>Request sent</button>':c==='incoming'?`<button class="btn ok sm" onclick="acceptConn('${ME.id}','${u.id}')">Accept request</button>`:`<button class="btn sm" onclick="connect('${u.id}')">Connect</button>`}</div>`}).join('')+'</div>';
}
function connect(id){const u=user(id);ME.conn[id]='sent';u.conn[ME.id]='incoming';notify(id,'🤝',ME.name+' wants to connect','nConn');save();toast('Request sent');render();if(u.seed)setTimeout(()=>acceptConn(id,ME.id),3500)}
function acceptConn(a,r){user(a).conn[r]=user(r).conn[a]='connected';notify(r,'🤝',user(a).name+' accepted your request','nConn');save();if(ready)render()}
function openChat(id){const k=key(ME.id,id);DB.msgs[k]=DB.msgs[k]||[];UI.chat=id;save();go('messages')}
const REPLIES=['Sounds good! Can you share a sample of your work?','Thanks for reaching out. When can you start?','Great, let’s discuss the details.','Perfect, I will send the requirements shortly.'];
function pMessages(){
 const ids=[BOT,...DB.users.filter(u=>u.id!==ME.id&&DB.msgs[key(ME.id,u.id)])];
 if(!ids.find(u=>u.id===UI.chat))UI.chat='bot';
 const k=key(ME.id,UI.chat),bot=UI.chat==='bot';
 if(bot&&!DB.msgs[k]){DB.msgs[k]=[{f:'bot',t:`Hi ${ME.name.split(' ')[0]}! I am the PURSUE Assistant. Ask me how to apply, set your price, build a portfolio or post a project.`,at:Date.now()}];save()}
 const cur=user(UI.chat),m=DB.msgs[k]||[];
 return `<h2>${tr('messages')}</h2><div class="chat" style="margin-top:14px"><div class="card cl">${ids.map(u=>`<div class="ci ${u.id===UI.chat?'on':''}" onclick="UI.chat='${u.id}';render()">${avatar(u)}<div><b>${esc(u.name)}</b><div class="mut">${esc(((DB.msgs[key(ME.id,u.id)]||[]).slice(-1)[0]?.t||'Ask me anything').slice(0,26))}</div></div></div>`).join('')}</div>
 <div class="card cw"><div class="row" style="padding:12px;border-bottom:1px solid var(--line)">${avatar(cur)}<b>${esc(cur.name)}</b>${bot?'<span class="tag">AI</span>':''}</div>
 <div class="ms" id="ms">${m.map(x=>`<div class="b ${x.f===ME.id?'me':'th'}">${esc(x.t)}<div style="font-size:11px;opacity:.7">${ago(x.at)}</div></div>`).join('')}${bot&&UI.typing?'<div class="b th"><span class="dots"><i></i><i></i><i></i></span></div>':''}</div>
 ${bot?`<div class="row" style="padding:8px 12px">${['How do I apply?','What should I charge?','Improve my profile','Is PURSUE safe?','How do I get paid?'].map(q=>`<button class="chip" onclick="sendText('${q}')">${q}</button>`).join('')}</div>`:''}
 <form class="cf" onsubmit="send(event)"><input id="mi" placeholder="${bot?'Ask the assistant...':'Type a message'}" autocomplete="off"><button class="btn">Send</button></form></div></div>`}
function send(e){e.preventDefault();const t=$('#mi').value.trim();if(t)sendText(t)}
function sendText(t){const id=UI.chat,k=key(ME.id,id),o=user(id);(DB.msgs[k]=DB.msgs[k]||[]).push({f:ME.id,t,at:Date.now()});save();
 if(o.bot){UI.typing=true;render();setTimeout(()=>{UI.typing=false;DB.msgs[k].push({f:'bot',t:botReply(t),at:Date.now()});save();if(ME&&UI.page==='messages')render()},900+Math.random()*600);return}
 render();
 if(o.seed)setTimeout(()=>{DB.msgs[k].push({f:id,t:REPLIES[Math.floor(Math.random()*REPLIES.length)],at:Date.now()});save();if(ME&&UI.page==='messages')render()},1200);
 else notify(id,'💬','New message from '+ME.name,'nMsg')}
// rule-based assistant: matches keywords and answers using the user's role and data
function botReply(t){
 const s=t.toLowerCase(),h=(...w)=>w.some(x=>s.includes(x)),cl=ME.role==='client',mine=DB.apps.filter(a=>a.uid===ME.id).length;
 if(/^(hi|hello|hey)\b/.test(s))return `Hello ${ME.name.split(' ')[0]}! I can help with applying, pricing, profile tips, payments, safety and settings. What do you need?`;
 if(h('thank'))return 'You are welcome! Ask me anything else about PURSUE. 😊';
 if(h('apply','proposal','bid'))return cl?'Proposals appear on Home under each of your projects. Compare the bids, check the freelancer’s profile and portfolio, then Shortlist or Accept.':`To apply: open Projects, tap View details, then Apply. In 3–4 lines mention your matching skill, a similar piece of work and your timeline. You have sent ${mine} proposal${mine===1?'':'s'} so far.`;
 if(h('charge','price',' rate','how much','budget'))return cl?'Student projects usually cost ₹800–₹2,000 for small tasks, ₹2,000–₹6,000 for websites and ₹4,000–₹8,000 for app design. Give a budget range so freelancers can bid inside it.':'A good starting point is ₹800–₹2,000 for small tasks, ₹2,000–₹6,000 for websites and ₹4,000–₹8,000 for app or UI work. Bid inside the client’s budget and list exactly what you will deliver.';
 if(h('earning','earned','paid','payment','money','income')){const tt=(ME.done||[]).reduce((a,x)=>a+x.amount,0);return tt?`You have earned ₹${tt.toLocaleString()} across ${ME.done.length} projects. Real payments are not connected in this demo, so agree on milestones with your client in Messages.`:'Real payments are not connected in this demo. Agree on milestones with your client in Messages, and finish a first project to start your earnings history.'}
 if(h('portfolio','profile','skill'))return 'Open Profile, add 5 or more skills, write a short About section and show finished work in your portfolio. Clear skill lists get you recommended to clients first.';
 if(h('post','hire'))return cl?'Go to Home and tap Post a project. Add a clear title, the skills you need and a budget range. Specific descriptions get more proposals.':'Hiring needs a client account. You can create one with another email using Join as a client.';
 if(h('safe','scam','fraud','trust'))return 'Stay safe: never pay in advance, never share your OTP or password, and keep discussions in Messages. Report anything suspicious through Settings, then Feedback.';
 if(h('trend','popular'))return 'Today’s trending list is on your Home page. It ranks the top 15 projects by views and proposals and changes every day.';
 if(h('plan','subscription','premium','upgrade'))return 'Settings → Subscription has three demo plans: Free, Pro (₹199/month) and Premium (₹499/month). No payment is taken in this demo.';
 if(h('password','email','username','language','theme','dark','setting'))return 'All of that is under Settings (the ⚙️ icon in the top bar): account details, password, privacy, language, theme and feedback.';
 if(h('deadline','late','delay'))return 'If you may miss a deadline, tell the client early in Messages and suggest a new date. Honest updates are usually accepted.';
 return 'I can help with applying, pricing, profile and portfolio tips, payments, safety, trending projects and settings. Try one of the suggestions below.'}
function pNotes(){const ns=DB.notes.filter(n=>n.to===ME.id);
 return `<div class="row"><h2 style="flex:1">${tr('notes')}</h2><button class="btn ghost sm" onclick="DB.notes.forEach(n=>n.to===ME.id&&(n.read=true));save();render()">Mark all as read</button><button class="btn ghost sm" onclick="DB.notes=DB.notes.filter(n=>n.to!==ME.id);save();render()">Clear all</button></div><div style="margin-top:14px">`+
 (ns.map(n=>`<div class="card nt ${n.read?'':'un'}" onclick="DB.notes.find(x=>x.id==${n.id}).read=true;save();render()"><span style="font-size:24px">${n.ic}</span><div style="flex:1">${esc(n.txt)}<div class="mut">${ago(n.at)}</div></div></div>`).join('')||'<div class="empty">You are all caught up.</div>')+'</div>'}
function pMe(){const sv=ME.bm.map(proj).filter(Boolean),ap=DB.apps.filter(a=>a.uid===ME.id);
 return `<div class="card"><div class="row"><div class="av" style="background:var(--brand);width:72px;height:72px;font-size:28px">${esc(ME.name[0].toUpperCase())}</div><div style="flex:1"><h2>${esc(ME.name)}</h2><div class="mut">${ME.role==='client'?'Client':'Freelancer'} · ${esc(ME.edu||'Add your education')}${ME.uname?' · @'+esc(ME.uname):''}</div></div><button class="btn ghost" onclick="editProfile()">Edit profile</button></div>
 <p>${esc(ME.about||'Tell people about yourself.')}</p><div>${ME.skills.map((s,i)=>`<span class="tag x" title="Remove" onclick="ME.skills.splice(${i},1);save();render()">${esc(s)} ✕</span>`).join('')}</div>
 <form class="row" style="margin-top:10px" onsubmit="addSkill(event)"><input id="ns" placeholder="Add a skill" style="max-width:220px"><button class="btn sm">Add</button></form></div>
 ${ME.role==='freelancer'?folio()+`<h2 class="sec">My proposals</h2>${ap.length?ap.map(a=>`<div class="card row" style="margin-bottom:10px"><div style="flex:1"><b>${esc(proj(a.pid)?.title||'Project')}</b><div class="mut">Bid ₹${a.bid} · ${ago(a.at)}</div></div><span class="tag">${a.status}</span>${a.status==='Accepted'?'':`<button class="btn ghost sm" onclick="DB.apps=DB.apps.filter(x=>x.id!=='${a.id}');save();toast('Proposal withdrawn');render()">Withdraw</button>`}</div>`).join(''):'<div class="empty">No proposals yet.</div>'}
 <h2 class="sec">Saved projects</h2>${sv.length?`<div class="grid">${sv.map(card).join('')}</div>`:'<div class="empty">Tap the bookmark on a project to save it here.</div>'}`:''}`}
function addSkill(e){e.preventDefault();const v=$('#ns').value.trim();if(v&&!ME.skills.includes(v)){ME.skills.push(v);save();render()}}
function editProfile(){modal(`<h2>Edit profile</h2><label>Name</label><input id="en" value="${esc(ME.name)}"><label>Education / title</label><input id="ee" value="${esc(ME.edu)}"><label>About</label><textarea id="ea" rows="3">${esc(ME.about)}</textarea>
 <div class="row" style="margin-top:14px"><button class="btn" onclick="ME.name=$('#en').value.trim()||ME.name;ME.edu=$('#ee').value;ME.about=$('#ea').value;save();closeModal();toast('Profile updated');render()">Save changes</button><button class="btn ghost" onclick="closeModal()">Cancel</button></div>`)}

/* ============ 8. SETTINGS ============ */
const sw=(k,t)=>`<label class="sw"><input type="checkbox" ${ME.set[k]!==false?'checked':''} onchange="setS('${k}',this.checked)">${t}</label>`;
function setS(k,v){ME.set[k]=v;save();if(k==='theme')applyTheme();toast('Settings saved')}
function setPlan(n){ME.plan=n;save();toast('Switched to '+n+' (demo, no payment taken)');render()}
function sendFb(){const t=$('#ft2').value.trim();if(t.length<5)return $('#err3').textContent='Write at least 5 characters.';
 DB.feedback.push({uid:ME.id,r:+$('#fr').value,t,at:Date.now()});save();$('#ft2').value='';$('#err3').textContent='';toast('Thanks for your feedback')}
function pSettings(){const plan=ME.plan||'Free',C='class="card" style="margin-top:14px"';
 return `<h2>${tr('settings')}</h2>
 <div ${C}><h3>Subscription</h3><p class="mut">Demo plans. No payment is taken.</p><div class="grid">${PLANS.map(([n,pr,d])=>`<div class="card" style="${plan===n?'border:2px solid var(--brand)':''}"><b>${n}</b><div class="price">${pr}</div><p class="mut">${d}</p>${plan===n?'<span class="tag">Current plan</span>':`<button class="btn sm" onclick="setPlan('${n}')">Choose ${n}</button>`}</div>`).join('')}</div></div>
 <div ${C}><h3>Account</h3><label>Username</label><input id="su" value="${esc(ME.uname||'')}" placeholder="e.g. bujji"><label>Full name</label><input id="sn" value="${esc(ME.name)}">
 <label>Email</label><input id="se" type="email" value="${esc(ME.email)}"><label>Mobile number</label><input id="sm" value="${esc(ME.phone||'')}" placeholder="10 digits">
 <p id="err1" style="color:var(--red);margin:6px 0"></p><button class="btn sm" onclick="saveAcct()">Save account</button></div>
 <div ${C}><h3>Password</h3><label>Current password</label><input id="op" type="password"><label>New password</label><input id="np" type="password">
 <p id="err2" style="color:var(--red);margin:6px 0"></p><button class="btn sm" onclick="changePw()">Update password</button></div>
 <div ${C}><h3>Privacy</h3>${sw('visible','Show my profile in Network')}</div>
 <div ${C}><h3>Notifications</h3>${sw('nProp','Proposal updates')}${sw('nMsg','New messages')}${sw('nConn','Connection requests')}</div>
 <div ${C}><h3>Language</h3><select onchange="setS('lang',this.value);render()">${Object.keys(LN).map(k=>`<option value="${k}" ${(ME.set.lang||'en')===k?'selected':''}>${LN[k][0]}</option>`).join('')}</select><p class="mut">Menu names and greetings change language. Full translation is planned.</p></div>
 <div ${C}><h3>Theme</h3><select onchange="setS('theme',this.value)">${['system','light','dark'].map(t=>`<option value="${t}" ${ME.set.theme===t?'selected':''}>${t[0].toUpperCase()+t.slice(1)}</option>`).join('')}</select></div>
 <div ${C}><h3>Feedback</h3><label>Rating</label><select id="fr">${[5,4,3,2,1].map(n=>`<option value="${n}">${'★'.repeat(n)}</option>`).join('')}</select><label>Your message</label><textarea id="ft2" rows="3" placeholder="Tell us what to improve"></textarea>
 <p id="err3" style="color:var(--red);margin:6px 0"></p><button class="btn sm" onclick="sendFb()">Send feedback</button></div>
 <div ${C}><div class="row"><button class="btn ghost" onclick="logout()">🚪 Sign out</button><button class="btn red" onclick="ask('Delete your account and all your data?','delAcct')">Delete account</button></div></div>`}
function saveAcct(){const n=$('#sn').value.trim(),e=$('#se').value.trim().toLowerCase(),u=$('#su').value.trim().toLowerCase(),m=$('#sm').value.trim(),er=x=>$('#err1').textContent=x;
 if(!n||!/^\S+@\S+\.\S+$/.test(e))return er('Enter a name and a valid email.');
 if(u&&!/^[a-z0-9_]{3,20}$/.test(u))return er('Username: 3–20 letters, numbers or underscores.');
 if(m&&!/^\d{10}$/.test(m))return er('Mobile number must be 10 digits.');
 if(DB.users.some(x=>x.id!==ME.id&&(x.email===e||(u&&x.uname===u))))return er('That email or username is already taken.');
 Object.assign(ME,{name:n,email:e,uname:u,phone:m});save();er('');toast('Account updated');renderNav()}
function changePw(){if(ME.pass!==hash($('#op').value))return $('#err2').textContent='Current password is incorrect.';
 if($('#np').value.length<6)return $('#err2').textContent='New password needs at least 6 characters.';
 ME.pass=hash($('#np').value);save();toast('Password updated');render()}
function delAcct(){const id=ME.id;DB.users=DB.users.filter(u=>u.id!==id);DB.apps=DB.apps.filter(a=>a.uid!==id&&proj(a.pid)?.owner!==id);DB.projects=DB.projects.filter(p=>p.owner!==id);DB.notes=DB.notes.filter(n=>n.to!==id);save();logout()}

/* ============ 9. RENDER + STARTUP ============ */
/* ============ 9. EXTRA: languages, assistant, demo user "Bujji", trending, portfolio, footer ============ */
const K=['home','projects','network','messages','notes','me','settings','hi'];
const LN={en:['English','Home','Projects','My Network','Messages','Notifications','Profile','Settings','Hi'],hi:['हिन्दी','होम','प्रोजेक्ट्स','मेरा नेटवर्क','संदेश','सूचनाएँ','प्रोफ़ाइल','सेटिंग्स','नमस्ते'],
 te:['తెలుగు','హోమ్','ప్రాజెక్టులు','నా నెట్‌వర్క్','సందేశాలు','నోటిఫికేషన్లు','ప్రొఫైల్','సెట్టింగ్‌లు','నమస్తే'],ta:['தமிழ்','முகப்பு','திட்டங்கள்','என் நெட்வொர்க்','செய்திகள்','அறிவிப்புகள்','சுயவிவரம்','அமைப்புகள்','வணக்கம்'],
 kn:['ಕನ್ನಡ','ಮುಖಪುಟ','ಯೋಜನೆಗಳು','ನನ್ನ ನೆಟ್‌ವರ್ಕ್','ಸಂದೇಶಗಳು','ಅಧಿಸೂಚನೆಗಳು','ಪ್ರೊಫೈಲ್','ಸೆಟ್ಟಿಂಗ್‌ಗಳು','ನಮಸ್ಕಾರ'],es:['Español','Inicio','Proyectos','Mi red','Mensajes','Notificaciones','Perfil','Ajustes','Hola'],
 fr:['Français','Accueil','Projets','Mon réseau','Messages','Notifications','Profil','Paramètres','Bonjour'],de:['Deutsch','Start','Projekte','Mein Netzwerk','Nachrichten','Benachrichtigungen','Profil','Einstellungen','Hallo']};
const tr=k=>(LN[ME?.set.lang]||LN.en)[1+K.indexOf(k)];
const BOT={id:'bot',name:'PURSUE Assistant',bot:true,skills:[],edu:'AI helper',set:{}};
const PLANS=[['Free','₹0','5 proposals a month · basic profile'],['Pro','₹199 / month','Unlimited proposals · featured profile · earnings insights'],['Premium','₹499 / month','Everything in Pro · priority support · top of search results']];
const EXTRA=[P('p9','Python Tutor (Beginners)','Other','Remote',500,1200,30,'c1',['Python','Tutoring'],'Teach Python basics to first-year students, 3 sessions a week.'),
 P('p10','Restaurant Menu Website','Web Development','Remote',3000,6000,10,'c2',['HTML','CSS','React'],'Menu site with photos, timings and an order-by-WhatsApp button.'),
 P('p11','YouTube Thumbnail Pack','Media','Remote',800,2000,4,'c1',['Photoshop','Design'],'Ten eye-catching thumbnails for a tech channel.'),
 P('p12','ML Resume Screener','Data & AI','Remote',5000,9000,18,'c3',['Python','ML'],'Rank resumes against a job description using simple NLP.'),
 P('p13','SEO Audit for Blog','Marketing','Remote',1500,3500,6,'c2',['SEO','Content Writing'],'Audit a food blog and list 20 fixes to rank higher.'),
 P('p14','CAD Drawing: Metal Bracket','Engineering','On-site',1200,2500,5,'c3',['CAD'],'Prepare a dimensioned 2D drawing of a bracket.'),
 P('p15','E-commerce Landing Page','Web Development','Remote',4000,7500,12,'c3',['React','UI/UX'],'High-converting landing page for a sneaker brand.')];
const NT=(to,ic,txt,m)=>({id:Math.random(),to,ic,txt,at:Date.now()-m*6e4,read:false});
const NEWN=(id,role)=>[['🎉',role==='client'?'Welcome to PURSUE! Post your first project from Home.':'Welcome to PURSUE! Add skills to your profile to get matched.',0],['🤖','Meet the PURSUE Assistant in Messages. Ask it anything.',2],['🔥','Today’s trending projects are live on your Home page.',15],
 ['💡',role==='client'?'Tip: clear descriptions and budgets get more proposals.':'Tip: profiles with 5+ skills get noticed faster.',60],['🔒','Security tip: never share your password or OTP with anyone.',180]].map(([ic,t,m])=>NT(id,ic,t,m));
const BUJJI={id:'bujji',name:'Bujji',uname:'bujji',phone:'1234567890',email:'bujji123@gmail.com',pass:hash('kpk123'),role:'freelancer',edu:'B.Tech CSE · 3rd year',plan:'Pro',
 about:'Full-stack student developer who builds clean, fast websites. 7 projects delivered with a 4.7 average rating.',skills:['React','Node.js','MongoDB','HTML','CSS','UI/UX'],bm:['p3'],conn:{s1:'connected',s2:'connected'},set:{...DEFSET},
 ongoing:[{title:'College Event Website',client:'TechFest Team',progress:70,due:'12 Oct'},{title:'Mobile App UI Screens',client:'StartUp Labs',progress:35,due:'25 Oct'}],
 done:[{title:'Portfolio Website',client:'Aarav Studio',amount:6500,m:'Sep',rating:5},{title:'Restaurant Menu App',client:'Spice Garden',amount:8000,m:'Aug',rating:5},{title:'Landing Page Redesign',client:'GreenLeaf Co',amount:4500,m:'Aug',rating:4},
 {title:'Inventory Dashboard',client:'Priya Bakery',amount:5200,m:'Jul',rating:5},{title:'Logo + Brand Kit',client:'Fit Hub',amount:3000,m:'Jun',rating:4},{title:'Event Registration Form',client:'TechFest Team',amount:2500,m:'May',rating:5},{title:'Blog CMS',client:'WriteWell',amount:7000,m:'Apr',rating:5}],
 reviews:[{co:'TechFest Team',r:5,t:'Fast delivery and great communication. Highly recommended!'},{co:'Spice Garden',r:5,t:'The menu app looked amazing and worked perfectly.'},{co:'GreenLeaf Co',r:4,t:'Good quality work. Minor revisions were handled quickly.'}],
 port:[{e:'🌐',t:'Portfolio Website',d:'Responsive personal site with dark mode.',k:['HTML','CSS','JS']},{e:'🍽️',t:'Restaurant Menu App',d:'React app with cart and order summary.',k:['React','Node']},{e:'📊',t:'Inventory Dashboard',d:'Stock tracking with charts and alerts.',k:['JS','Charts']},{e:'📝',t:'Blog CMS',d:'Write, edit and publish posts with login.',k:['MERN']}]};
const BNOTES=[NT('bujji','💰','Payment of ₹6,500 received for "Portfolio Website"',25),NT('bujji','⭐','Spice Garden left you a 5-star review',90),NT('bujji','📥','TechFest Team viewed your proposal',150),NT('bujji','📅','Reminder: "College Event Website" is due on 12 Oct',240),
 NT('bujji','🤝','Sneha Rao accepted your connection request',420),NT('bujji','🔥','Your profile appeared in 48 searches this week',700),NT('bujji','💬','StartUp Labs sent you a message',1000)];
if(!DB.users.some(u=>u.id==='bujji')){DB.users.push(BUJJI);DB.notes.push(...BNOTES)}
[mk('c4','Campus Radio','client','Student club',[]),mk('c5','GreenLeaf Co','client','Eco start-up',[]),mk('c6','Fit Hub','client','Local gym',[])].forEach(u=>{if(!user(u.id))DB.users.push(u)});
const MORE=[['Online Quiz Web App','Web Development',3500,7000,12,'c1',['JavaScript','HTML','CSS'],'Timed MCQ quiz with a score board for college clubs.'],
['Gym Membership Website','Web Development',3000,6000,10,'c6',['HTML','CSS','JavaScript'],'Landing page with class timetable and plans for a local gym.'],
['Photographer Portfolio Site','Web Development',2500,5000,8,'c5',['HTML','CSS','Responsive Design'],'Gallery-style portfolio with a contact form.'],
['Admin Dashboard UI','Web Development',5000,9000,14,'c3',['React','Tailwind'],'Responsive admin panel with charts and tables.'],
['Student Attendance App','Web Development',4500,8500,15,'c1',['MERN','MongoDB'],'Mark and report attendance with login for teachers.'],
['WordPress Blog Setup','Web Development',1500,3000,5,'c2',['WordPress','SEO'],'Install, theme and configure a food blog.'],
['Bug Fixes for Node API','Web Development',1800,3500,4,'c3',['Node.js','Express'],'Fix routing and validation bugs in a small REST API.'],
['Weather Widget Component','Web Development',900,2000,3,'c5',['JavaScript','API'],'Reusable weather card using a public API.'],
['Podcast Cover Art','Design',800,1800,3,'c4',['Photoshop','Illustration'],'Square cover art and 3 social banners.'],
['Poster for Fest Event','Design',700,1500,2,'c1',['Canva','Graphic Design'],'A3 poster and Instagram story for the cultural fest.'],
['App Icon Set','Design',2000,4000,6,'c3',['Figma','Icon Design'],'24 consistent line icons for a finance app.'],
['Cafe Menu Card Design','Design',1000,2200,4,'c2',['Graphic Design','Print'],'Two-page print menu for a cafe.'],
['Website Wireframes','Design',2500,5000,7,'c5',['Figma','UI/UX'],'Low-fidelity wireframes for 6 pages.'],
['Fitness App Onboarding Flow','Design',3000,6000,8,'c6',['UI/UX','Figma'],'Design a 5-screen onboarding flow with interaction notes.'],
['Business Card & Letterhead','Design',900,2000,3,'c2',['Logo Design','Print'],'Stationery set matching an existing logo.'],
['Customer Churn Analysis','Data & AI',4000,8000,10,'c3',['Python','Pandas'],'Analyse a telecom dataset and report the main churn drivers.'],
['FAQ Chatbot','Data & AI',5000,9500,14,'c1',['Python','NLP'],'Chatbot that answers common admission questions.'],
['Excel to Power BI Report','Data & AI',2500,5000,6,'c5',['Power BI','Excel'],'Turn monthly sales sheets into an interactive dashboard.'],
['Plant Leaf Image Classifier','Data & AI',4500,8000,12,'c3',['Python','TensorFlow'],'Train a small model to spot leaf diseases.'],
['Survey Data Cleaning','Data & AI',1200,2800,4,'c4',['Excel','Data Entry'],'Clean 2,000 survey responses and prepare summary tables.'],
['SQL Queries for Reports','Data & AI',1800,3500,5,'c6',['SQL','MySQL'],'Write 15 queries for membership and revenue reports.'],
['X (Twitter) Content Plan','Marketing',1000,2200,5,'c4',['Social Media','Copywriting'],'Four-week posting plan with sample posts.'],
['Email Newsletter Template','Marketing',1500,3000,5,'c5',['Email Marketing','HTML'],'Responsive newsletter with three reusable sections.'],
['Keyword Research for Ads','Marketing',1200,2600,4,'c6',['SEO','Research'],'Find 100 keywords with estimated costs for a gym.'],
['Product Description Writing','Marketing',900,2000,4,'c5',['Content Writing','SEO'],'Write 30 product descriptions for an online store.'],
['Brand Launch Campaign Plan','Marketing',2500,5500,9,'c3',['Digital Marketing','Strategy'],'Plan a launch campaign across Instagram and YouTube.'],
['Instagram Reels Editing','Media',1500,3500,5,'c6',['Video Editing','Reels'],'Edit 8 vertical reels from raw gym footage.'],
['Podcast Audio Cleanup','Media',1000,2200,3,'c4',['Audio Editing','Audacity'],'Remove noise and balance 4 episodes.'],
['Annual Day Photography','Media',2500,5000,2,'c1',['Photography'],'Cover the annual day event for 4 hours.','On-site'],
['Animated Logo Intro','Media',2000,4500,6,'c5',['Motion Graphics','After Effects'],'A 5-second animated logo reveal.'],
['Home Automation Prototype','Engineering',4500,9000,16,'c3',['Arduino','IoT'],'Control lights from a phone with an ESP32 board.','On-site'],
['PCB Layout for Sensor Board','Engineering',3000,6500,10,'c3',['PCB Design','KiCad'],'Design a two-layer PCB for a temperature sensor.'],
['3D Enclosure Design','Engineering',2500,5000,7,'c6',['CAD','SolidWorks'],'Design a printable enclosure with screw mounts.'],
['Solar Tracker Mini Model','Engineering',5000,9500,18,'c1',['Embedded C','Electronics'],'Working demo model for a science expo.','On-site'],
['Maths Tutor for Class 10','Other',600,1500,30,'c2',['Tutoring','Maths'],'Weekend online classes for a school student.']
].map((r,i)=>P('p'+(16+i),r[0],r[1],r[8]||'Remote',r[2],r[3],r[4],r[5],r[6],r[7]));
[...EXTRA,...MORE].forEach(p=>{if(!proj(p.id))DB.projects.push(p)});
// demo proposals and saved projects for Bujji
const bj=user('bujji');
if(bj&&!DB.apps.some(a=>a.uid==='bujji')){
 [['p1',4500,'Accepted',20,'I have built three event sites with HTML, CSS and JavaScript and can deliver in 10 days.'],['p7',7000,'Accepted',9,'I design clean mobile UI in Figma and will include a clickable prototype.'],
  ['p3',5000,'Shortlisted',3,'I use Python and Pandas daily and can build clear charts by region.'],['p10',5000,'Pending',1,'I recently built a restaurant menu app in React and can reuse that structure.'],
  ['p16',6000,'Pending',1,'I have made quiz apps before and can add a timer and a leaderboard.'],['p20',7500,'Shortlisted',2,'I know the MERN stack well and can add teacher login and attendance reports.'],
  ['p15',6500,'Rejected',6,'I can build a fast React landing page with smooth animations.']
 ].forEach(([pid,bid,st,d,msg],i)=>DB.apps.push({id:'ab'+i,pid,uid:'bujji',bid,msg,at:Date.now()-d*864e5,status:st}));
 proj('p1').hired='bujji';proj('p7').hired='bujji';bj.bm=['p3','p12','p19','p20','p31','p36'];save()}DB.feedback=DB.feedback||[];save();

// today's trending: ranked by views (changes daily) + proposals received
function views(p){let h=new Date().getDate();for(const c of p.id)h=(h*31+c.charCodeAt(0))%997;return 300+h*3+DB.apps.filter(a=>a.pid===p.id).length*120}
function trending(){const t=DB.projects.map(p=>[p,views(p)]).sort((a,b)=>b[1]-a[1]).slice(0,15),mx=t[0][1];
 return `<aside class="card tr"><h3>🔥 Today’s trending</h3><p class="mut">Top ${t.length} projects by views and proposals</p>`+t.map(([p,v],i)=>`<div class="ti" onclick="${ME?`details('${p.id}')`:'authModal(\'join\')'}"><span class="rk">${i+1}</span><div style="flex:1;min-width:0"><b>${esc(p.title)}</b><div class="mut">₹${p.max.toLocaleString()} · ${(v/1000).toFixed(1)}k views</div><div class="bar"><i style="--w:${Math.round(v/mx*100)}%"></i></div></div></div>`).join('')+'</aside>'}

// profile extras for freelancers: earnings, ratings, past work, feedback, portfolio
function folio(){
 const d=ME.done||[],o=ME.ongoing||[],rv=ME.reviews||[],pf=ME.port||[];
 if(!d.length&&!o.length&&!pf.length)return '<div class="empty card" style="margin-top:16px">Your earnings, reviews and portfolio will appear here after your first project.</div>';
 const tot=d.reduce((a,x)=>a+x.amount,0),avg=rv.length?(rv.reduce((a,x)=>a+x.r,0)/rv.length).toFixed(1):'–';
 const M=['Apr','May','Jun','Jul','Aug','Sep'],v=M.map(m=>d.filter(x=>x.m===m).reduce((a,x)=>a+x.amount,0)),mx=Math.max(...v,1),st=n=>'★'.repeat(n)+'☆'.repeat(5-n);
 return `<div class="stats"><div class="card"><b>₹${tot.toLocaleString()}</b>total earned</div><div class="card"><b>${avg}</b>average rating ★</div><div class="card"><b>${d.length}</b>projects done</div><div class="card"><b>${o.length}</b>in progress</div></div>
 <h2 class="sec">Earnings, last 6 months</h2><div class="card chart">${M.map((m,i)=>`<div class="col"><span class="mut">${v[i]?'₹'+(v[i]/1000).toFixed(1)+'k':'–'}</span><i style="--h:${Math.round(v[i]/mx*100)}%"></i><span class="mut">${m}</span></div>`).join('')}</div>
 <h2 class="sec">Working on now</h2>${o.map(x=>`<div class="card" style="margin-bottom:10px"><div class="row"><b style="flex:1">${esc(x.title)}</b><span class="mut">${esc(x.client)} · due ${esc(x.due)}</span></div><div class="bar"><i style="--w:${x.progress}%"></i></div><span class="mut">${x.progress}% complete</span></div>`).join('')||'<div class="empty">Nothing in progress.</div>'}
 <h2 class="sec">Previous projects</h2><div class="card">${d.map(x=>`<div class="app row"><b style="flex:1;min-width:160px">${esc(x.title)}<div class="mut">${esc(x.client)} · ${x.m}</div></b><span class="price">₹${x.amount.toLocaleString()}</span><span style="color:var(--amber)">${st(x.rating)}</span></div>`).join('')}</div>
 <h2 class="sec">Company feedback</h2><div class="grid">${rv.map(x=>`<div class="card"><div style="color:var(--amber)">${st(x.r)}</div><p>“${esc(x.t)}”</p><b>${esc(x.co)}</b></div>`).join('')}</div>
 <h2 class="sec">Portfolio</h2><div class="grid">${pf.map(x=>`<div class="card pc"><div style="font-size:34px">${x.e}</div><h3>${esc(x.t)}</h3><p class="mut">${esc(x.d)}</p><div>${x.k.map(k=>`<span class="tag">${esc(k)}</span>`).join('')}</div></div>`).join('')}</div>`}

let LK={n:128,on:false};try{LK=JSON.parse(localStorage.getItem('pursue_likes'))||LK}catch(e){}
const likeBtn=()=>`<button class="lk ${LK.on?'on':''}" id="lk" onclick="likeSite()"><span class="h">${LK.on?'❤️':'🤍'}</span> ${LK.on?'Liked':'Like'} · ${LK.n}</button>`;
function likeSite(){LK.on=!LK.on;LK.n+=LK.on?1:-1;try{localStorage.setItem('pursue_likes',JSON.stringify(LK))}catch(e){}$('#lk').outerHTML=likeBtn();toast(LK.on?'Thanks for the like!':'Like removed')}
const RW=['developers','designers','writers','marketers','engineers','video editors'];let rwi=0;
setInterval(()=>{const e=$('#rw');if(!e)return;rwi=(rwi+1)%RW.length;e.textContent=RW[rwi];e.classList.remove('sw');void e.offsetWidth;e.classList.add('sw')},2200);
function footer(){const L=(n,u)=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${n}</a>`;
 return `<div class="fi"><div><div class="lg" style="margin:0 0 8px">${LOGO()}<span class="wm">PURSUE</span></div><p class="mut">Real projects for students. Build skills, earn money and grow your portfolio.</p></div>
 <div><h4>Contact</h4><p><a href="mailto:hello@pursue.example">✉️ hello@pursue.example</a></p><p><a href="tel:+919876543210">📞 +91 98765 43210</a></p><p><a href="https://net77.cc/home" target="_blank" rel="noopener noreferrer">🌐 net77.cc</a></p></div>
 <div><h4>Customer care</h4><p><a href="mailto:care@pursue.example">care@pursue.example</a></p><p class="mut">Mon–Sat, 9 AM – 6 PM</p><p class="mut">Help center · FAQ</p></div>
 <div><h4>Follow us</h4><div class="so">${L('📸 Instagram','https://www.instagram.com/')}${L('💬 WhatsApp','https://www.whatsapp.com/')}${L('👻 Snapchat','https://www.snapchat.com/')}${L('📘 Facebook','https://www.facebook.com/')}${L('𝕏 X','https://x.com/')}${L('💼 LinkedIn','https://www.linkedin.com/')}${L('▶️ YouTube','https://www.youtube.com/')}</div>${likeBtn()}</div></div>
 <p class="cp">© 2026 PURSUE. All rights reserved. Privacy · Terms</p>`}

/* ============ 10. RENDER (page animation plays only when the page changes) ============ */
function fx(an){
 if(!an||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 if('IntersectionObserver' in window){ // elements fade/slide in as they scroll into view
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const e=en.target;io.unobserve(e);e.style.transitionDelay=(e._d||0)+'ms';e.classList.add('vis');setTimeout(()=>{e.classList.remove('rv','vis');e.style.transitionDelay=''},1000)}),{threshold:.08});
  document.querySelectorAll('.grid>*,.g4>*,.tr .ti,.nt,.sec,.stats>*,.app').forEach((e,i)=>{e._d=(i%6)*70;e.classList.add('rv');io.observe(e)})}
 document.querySelectorAll('.stats b').forEach(b=>{const m=b.textContent.match(/^(₹?)([\d,]+)$/);if(!m)return;const to=+m[2].replace(/,/g,''),t0=performance.now();
  (function f(t){const k=Math.min(1,(t-t0)/900);b.textContent=m[1]+Math.round(to*k*(2-k)).toLocaleString();if(k<1)requestAnimationFrame(f)})(t0)})}
function render(){renderNav();
 const k=ME?UI.page:'out',an=UI.last!==k;UI.last=k;
 if(!ME){$('#app').innerHTML=`<div class="page ${an?'in':''}">${landing()}<div style="margin-top:28px">${trending()}</div></div>`;fx(an);return}
 const pg={home:ME.role==='client'?pHomeC:pHomeF,projects:pProjects,network:pNetwork,messages:pMessages,notes:pNotes,me:pMe,settings:pSettings};
 let h=(pg[UI.page]||pHomeF)();if(UI.page==='home')h=`<div class="hm"><div>${h}</div>${trending()}</div>`;
 $('#app').innerHTML=`<div class="page ${an?'in':''}">${h}</div>`;
 if(UI.page==='projects')showList();const ms=$('#ms');if(ms)ms.scrollTop=ms.scrollHeight;
 if(UI.page==='messages'&&!an)$('#mi')?.focus();fx(an)}
ME=user(localStorage.getItem(SK))||null;applyTheme();
// finish demo events (client replies, accepted connections) that were pending when the page was last closed
DB.apps.forEach(a=>{if(a.status==='Pending'&&user(proj(a.pid)?.owner)?.seed)shortlist(a.id)});
DB.users.forEach(x=>Object.entries(x.conn).forEach(([k,v])=>{if(v==='sent'&&user(k)?.seed)acceptConn(k,x.id)}));
$('#ft').innerHTML=footer();ready=true;render();

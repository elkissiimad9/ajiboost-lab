/* ============ shared behaviour ============ */

/* ---- language (persists across pages) ---- */
function setLang(l){
  document.body.classList.toggle('en',l==='en');
  document.documentElement.lang=l;
  const lf=document.getElementById('lf'),le=document.getElementById('le');
  if(lf&&le){lf.classList.toggle('on',l==='fr');le.classList.toggle('on',l==='en');}
  try{localStorage.setItem('lang',l);}catch(e){}
}
(function(){
  let l='fr';
  try{l=localStorage.getItem('lang')||'fr';}catch(e){}
  document.addEventListener('DOMContentLoaded',()=>setLang(l));
})();

/* ---- mobile menu ---- */
function toggleMenu(){const m=document.getElementById('mm');if(m)m.classList.toggle('open');}

/* ---- custom magnetic cursor ---- */
(function(){
  if(matchMedia('(hover:none),(pointer:coarse)').matches)return;
  const dot=document.createElement('div');dot.className='cur';
  const ring=document.createElement('div');ring.className='cur-ring';
  document.addEventListener('DOMContentLoaded',()=>{document.body.append(dot,ring);});
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
  addEventListener('mouseover',e=>{
    if(e.target.closest('a,button,.magnet,input,textarea')) document.body.classList.add('hovering');
  });
  addEventListener('mouseout',e=>{
    if(e.target.closest('a,button,.magnet,input,textarea')) document.body.classList.remove('hovering');
  });
})();

/* ---- data-particles that trail the cursor ---- */
(function(){
  if(matchMedia('(hover:none),(pointer:coarse)').matches)return;
  let cv,ctx,parts=[],last=0;
  const glyphs=['+','↗','%','×','·','◆','∆'];
  document.addEventListener('DOMContentLoaded',()=>{
    cv=document.createElement('canvas');cv.id='spark';document.body.prepend(cv);
    ctx=cv.getContext('2d');resize();addEventListener('resize',resize);
    addEventListener('mousemove',spawn);tick();
  });
  function resize(){if(!cv)return;cv.width=innerWidth;cv.height=innerHeight;}
  function spawn(e){
    const now=performance.now();
    if(now-last<46)return;last=now;
    parts.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*.6,vy:-.5-Math.random()*.7,
      life:1,g:glyphs[Math.random()*glyphs.length|0],
      c:Math.random()<.5?'29,59,232':'244,112,10',s:9+Math.random()*7});
    if(parts.length>60)parts.shift();
  }
  function tick(){
    if(!ctx){requestAnimationFrame(tick);return;}
    ctx.clearRect(0,0,cv.width,cv.height);
    parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life-=.016;
      ctx.font=`700 ${p.s}px 'Space Mono',monospace`;
      ctx.fillStyle=`rgba(${p.c},${Math.max(p.life,0)*.75})`;
      ctx.fillText(p.g,p.x,p.y);
    });
    parts=parts.filter(p=>p.life>0);
    requestAnimationFrame(tick);
  }
})();

/* ---- magnetic buttons ---- */
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.magnet').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      el.style.transform=`translate(${x*.25}px,${y*.35}px)`;
    });
    el.addEventListener('mouseleave',()=>{el.style.transform='';});
  });
});

/* ---- scroll reveal ---- */
document.addEventListener('DOMContentLoaded',()=>{
  const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12});
  document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4*55)+'ms';io.observe(el);});
});

/* ---- demo form ---- */
function sendForm(e){
  e.preventDefault();
  const en=document.body.classList.contains('en');
  alert(en?"Got it. I'll get back to you fast. Want it quicker? Ping me on WhatsApp.":"C'est noté. Je reviens vers vous vite. Vous voulez plus rapide ? Écrivez-moi sur WhatsApp.");
  e.target.reset();return false;
}

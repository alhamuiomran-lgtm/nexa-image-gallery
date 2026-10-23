/* CODALINE: progressive reveal, original mesh, counters, menu, filters and subtle pointer motion. */
(()=>{'use strict';
 const root=document.querySelector('body.codaline'); if(!root)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 root.classList.add('coda-js');
 const header=root.querySelector('.site-head'),toggle=header?.querySelector('.menu-toggle');
 const nav=header?.querySelector('.coda-navigation');
 nav?.querySelectorAll('.menu-item-has-children').forEach((li,i)=>{
  li.classList.add('coda-has-submenu');const link=li.querySelector(':scope > a'),sub=li.querySelector(':scope > ul');if(!link||!sub)return;
  const label=document.createElement('div');label.className='coda-nav-label';li.insertBefore(label,link);label.append(link);sub.classList.add('coda-submenu');sub.id='coda-custom-submenu-'+i;
  const btn=document.createElement('button');btn.type='button';btn.className='coda-submenu-toggle';btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls',sub.id);btn.setAttribute('aria-label','Open '+link.textContent.trim()+' menu');btn.innerHTML='<span aria-hidden="true">⌄</span>';label.append(btn);
 });
 const menus=[...header?.querySelectorAll('.coda-has-submenu')||[]];
 const setMenu=(li,open)=>{li.classList.toggle('is-open',open);li.querySelector('.coda-submenu-toggle')?.setAttribute('aria-expanded',String(open));};
 const closeMenus=()=>menus.forEach(li=>setMenu(li,false));
 const close=()=>{closeMenus();header?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');};
 toggle?.addEventListener('click',()=>{const open=!header.classList.contains('open');header.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));if(!open)closeMenus();});
 menus.forEach(li=>{
  const button=li.querySelector('.coda-submenu-toggle');
  button?.addEventListener('click',()=>{const open=!li.classList.contains('is-open');const ancestors=menus.filter(item=>item!==li&&item.contains(li));closeMenus();if(open)ancestors.forEach(item=>setMenu(item,true));setMenu(li,open);});
  li.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:1101px)').matches){const ancestors=menus.filter(item=>item!==li&&item.contains(li));closeMenus();ancestors.forEach(item=>setMenu(item,true));setMenu(li,true);}});
  li.addEventListener('pointerleave',()=>{if(matchMedia('(min-width:1101px)').matches&&!li.contains(document.activeElement))setMenu(li,false);});
  li.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(!li.contains(document.activeElement))setMenu(li,false);}));
 });
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{const parent=a.closest('.coda-nav-label')?.parentElement;if(parent?.classList.contains('coda-has-submenu')&&matchMedia('(max-width:1100px)').matches&&!parent.classList.contains('is-open')){e.preventDefault();closeMenus();menus.filter(item=>item!==parent&&item.contains(parent)).forEach(item=>setMenu(item,true));setMenu(parent,true);return;}close();}));
 document.addEventListener('pointerdown',e=>{if(header&&!header.contains(e.target))close();});
 document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const opened=menus.find(li=>li.classList.contains('is-open'));if(opened){const button=opened.querySelector('.coda-submenu-toggle');closeMenus();button?.focus();}else if(header?.classList.contains('open')){close();toggle?.focus();}});
 matchMedia('(min-width:1101px)').addEventListener('change',close);
 const meter=root.querySelector('.scroll-meter');let scheduled=false;
 const paint=()=>{if(meter)meter.style.width=Math.min(100,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100)+'%';header?.classList.toggle('has-scrolled',scrollY>24);scheduled=false;};
 addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(paint);scheduled=true;}},{passive:true});paint();
 const reveals=[...root.querySelectorAll('.reveal')];
 if(reduced||!('IntersectionObserver' in window)){reveals.forEach(el=>el.classList.add('visible'));}
 else{
  const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}},{threshold:.04,rootMargin:'0px 0px 70px 0px'});
  reveals.forEach((el,i)=>{el.style.setProperty('--delay',Math.min((i%4)*85,255)+'ms');if(el.getBoundingClientRect().top<innerHeight){el.classList.add('visible');}else{el.classList.add('coda-reveal-ready');io.observe(el);}});
 }
 const counters=[...root.querySelectorAll('[data-count]')];
 if(!reduced&&'IntersectionObserver'in window){
  const io=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;io.unobserve(e.target);const n=e.target,goal=Number(n.dataset.count)||0,start=performance.now(),decimals=Number.isInteger(goal)?0:1;
   const tick=t=>{const p=Math.min((t-start)/1250,1);n.textContent=(goal*(1-(1-p)**3)).toFixed(decimals)+(n.dataset.suffix||'');if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);}});
  counters.forEach(n=>io.observe(n));
 }
 root.querySelectorAll('.coda-portfolio').forEach(portfolio=>{
  const row=portfolio.querySelector('.coda-filters'),cards=[...portfolio.querySelectorAll('.coda-portfolio-cards > .wp-block-codaline-portfolio > *')],status=portfolio.querySelector('.coda-filter-status');if(!row||!cards.length)return;row.hidden=false;
  row.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
   row.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   cards.forEach(card=>{const show=button.dataset.codaFilter==='all'||card.classList.contains('coda-type-'+button.dataset.codaFilter);card.hidden=!show;if(show&&!reduced)card.animate([{opacity:.25,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});});
   if(status)status.textContent=cards.filter(c=>!c.hidden).length+' projects shown';
  }));
 });
 if(!reduced&&!matchMedia('(pointer:coarse)').matches){root.querySelectorAll('.a-hero-visual').forEach(visual=>{let ticking=false;visual.addEventListener('pointermove',e=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const b=visual.getBoundingClientRect(),child=visual.querySelector('.a-showcase');if(child)child.style.transform=`translate3d(${((e.clientX-b.left)/b.width-.5)*8}px,${((e.clientY-b.top)/b.height-.5)*8}px,0)`;ticking=false;});});visual.addEventListener('pointerleave',()=>visual.querySelector('.a-showcase')?.style.removeProperty('transform'));});}
})();

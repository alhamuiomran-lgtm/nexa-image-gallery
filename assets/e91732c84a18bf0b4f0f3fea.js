/* Scoped progressive enhancement, per-instance state. GPL-2.0-or-later. */
(function () {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 document.querySelectorAll('[data-nexac-slider]').forEach(root=>{
  if(root.dataset.initialized)return;root.dataset.initialized='1';
  const track=root.querySelector('.nexac-stage'),slides=Array.from(track.children).filter(e=>e.classList.contains('wp-block-group')),controls=root.querySelector('.nexac-slider-controls');
  if(!slides.length)return;
  let index=0,timer=null,paused=false;const next=root.querySelector('[data-nexac-next]'),prev=root.querySelector('[data-nexac-prev]'),play=root.querySelector('[data-nexac-play]'),dots=root.querySelector('.nexac-slider-dots'),announce=root.querySelector('.nexac-slide-announcement');
  const text=i=>root.dataset.announcement.replace('%1$d',i+1).replace('%2$d',slides.length);
  const rtl=()=>getComputedStyle(track).direction==='rtl';
  const visible=()=>Math.max(1,Math.round(track.clientWidth/slides[0].getBoundingClientRect().width));
  const max=()=>Math.max(0,slides.length-visible());
  slides.forEach((slide,i)=>{slide.setAttribute('role','group');slide.setAttribute('aria-roledescription','slide');slide.setAttribute('aria-label',text(i));const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',text(i));dot.setAttribute('aria-controls',track.id);dot.addEventListener('click',()=>go(i,true));dots.append(dot);});
  const update=()=>{controls.hidden=max()===0;Array.from(dots.children).forEach((dot,i)=>{dot.setAttribute('aria-current',i===index?'true':'false');dot.disabled=i>max();});if(root.dataset.loop!=='1'){prev.disabled=index===0;next.disabled=index===max();}};
  const go=(target,user=false)=>{const m=max();index=root.dataset.loop==='1'?(target<0?m:target>m?0:target):Math.min(m,Math.max(0,target));const box=slides[index].getBoundingClientRect(),view=track.getBoundingClientRect();track.scrollBy({left:rtl()?box.right-view.right:box.left-view.left,behavior:reduced.matches?'instant':'smooth'});update();if(user){announce.textContent=text(index);stop();paused=true;syncPlay();}};
  const stop=()=>{if(timer)clearInterval(timer);timer=null;};
  const syncPlay=()=>{play.hidden=root.dataset.autoplay!=='1'||reduced.matches;play.textContent=paused||reduced.matches?play.dataset.play:play.dataset.pause;play.setAttribute('aria-pressed',paused?'false':'true');};
  const start=()=>{stop();if(root.dataset.autoplay==='1'&&!paused&&!reduced.matches&&!document.hidden&&max()>0){timer=setInterval(()=>go(index+1),Number(root.dataset.interval));}syncPlay();};
  prev.addEventListener('click',()=>go(index-1,true));next.addEventListener('click',()=>go(index+1,true));
  track.addEventListener('keydown',e=>{if(e.target!==track)return;let target;if(e.key==='ArrowRight')target=index+(rtl()?-1:1);if(e.key==='ArrowLeft')target=index+(rtl()?1:-1);if(e.key==='Home')target=0;if(e.key==='End')target=max();if(target!==undefined){e.preventDefault();go(target,true);}});
  track.addEventListener('scroll',()=>{const view=track.getBoundingClientRect();let nearest=0,distance=Infinity;slides.forEach((slide,i)=>{const box=slide.getBoundingClientRect(),d=Math.abs(rtl()?box.right-view.right:box.left-view.left);if(d<distance){distance=d;nearest=i;}});index=Math.min(max(),nearest);update();},{passive:true});
  root.addEventListener('pointerenter',stop);root.addEventListener('pointerleave',()=>{if(!root.contains(document.activeElement))start();});root.addEventListener('focusin',stop);
  root.addEventListener('focusout',()=>setTimeout(()=>{if(!root.contains(document.activeElement))start();},0));
  play.addEventListener('click',()=>{paused=!paused;start();});document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  reduced.addEventListener('change',start);window.addEventListener('resize',()=>{index=Math.min(index,max());update();});window.addEventListener('pagehide',stop,{once:true});
  controls.hidden=slides.length<2;play.hidden=root.dataset.autoplay!=='1'||reduced.matches;update();start();
 });
 document.querySelectorAll('[data-nexac-counter]').forEach(root=>{
  if(root.dataset.initialized)return;root.dataset.initialized='1';const value=root.querySelector('.nexac-counter-value'),start=Number(root.dataset.start),end=Number(root.dataset.end),duration=Number(root.dataset.duration),decimals=Number(root.dataset.decimals);
  const format=new Intl.NumberFormat(document.documentElement.lang||undefined,{minimumFractionDigits:decimals,maximumFractionDigits:decimals,useGrouping:root.dataset.grouping==='1'});
  const write=n=>{value.textContent=root.dataset.prefix+format.format(n)+root.dataset.suffix;};
  const animate=()=>{if(reduced.matches||duration===0){write(end);return;}let started;const tick=time=>{started??=time;const ratio=Math.min(1,(time-started)/duration);write(start+(end-start)*(1-Math.pow(1-ratio,3)));if(ratio<1&&!reduced.matches)requestAnimationFrame(tick);else write(end);};requestAnimationFrame(tick);};
  if(!('IntersectionObserver' in window)){write(end);return;}const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();animate();}},{threshold:.1});observer.observe(root);
 });
})();

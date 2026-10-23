/* NEXA Climate presentation only. No requests, pricing or customer data storage. */
(() => {
  'use strict';
  if (!document.body.classList.contains('climate-v2')) return;
  const root = document.body;
  const one = (selector) => root.querySelector(selector);
  const all = (selector) => [...root.querySelectorAll(selector)];
  const labels = window.nexasvcClimateV2?.labels || {};
  const escapeText = (text) => { const span = document.createElement('span'); span.textContent = text || ''; return span.innerHTML; };
  const slideTitle = (prefix) => escapeText(labels[prefix + 'Title']) + ' <span class="gradient-text">' + escapeText(labels[prefix + 'Accent']) + '</span>';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Authored block data: never infer slides from filenames or overwrite custom copy.
  const hero = one('.hero'), image = hero?.querySelector('.hero-picture img');
  const dots = hero ? [...hero.querySelectorAll('[data-hero-slide]')] : [];
  if (hero && image && dots.length) {
    const title = hero.querySelector('h1'), copy = hero.querySelector('.hero-p');
    const actions = hero.querySelector('.hero-actions');
    const slides = [{src: image.src, srcset: image.srcset, sizes: image.sizes, alt: image.alt, title: title?.innerHTML, copy: copy?.innerHTML, actions: actions?.innerHTML}];
    hero.querySelectorAll('.nc-hero-slide').forEach(slide => {
      const photo = slide.querySelector('img');
      if (photo) slides.push({src: photo.src, srcset: photo.srcset, sizes: photo.sizes, alt: photo.alt, title: slide.querySelector('h2,h1')?.innerHTML || title?.innerHTML, copy: slide.querySelector('.hero-p')?.innerHTML || copy?.innerHTML, actions: slide.querySelector('.hero-actions')?.innerHTML || actions?.innerHTML});
    });
    let index = 0;
    const show = next => {
      index = (next + slides.length) % slides.length;
      const slide = slides[index];
      image.srcset = slide.srcset || ''; image.sizes = slide.sizes || '';
      image.src = slide.src; image.alt = slide.alt;
      if (title) title.innerHTML = slide.title;
      if (copy) copy.innerHTML = slide.copy;
      if (actions) actions.innerHTML = slide.actions;
      dots.forEach((dot, i) => { dot.classList.toggle('active', i === index); dot.setAttribute('aria-pressed', String(i === index)); dot.hidden = i >= slides.length; });
    };
    hero.querySelector('#heroPrev')?.addEventListener('click', () => show(index - 1));
    hero.querySelector('#heroNext')?.addEventListener('click', () => show(index + 1));
    dots.forEach((dot, i) => { dot.hidden = i >= slides.length; dot.addEventListener('click', () => show(i)); });
    if (slides.length < 2) hero.querySelector('.hero-controls')?.setAttribute('hidden', '');
  }

  const tabs = all('[data-comfort]'), panel = one('#comfortPanel');
  if (tabs.length && panel) {
    const visual = one('#comfortImage img') || one('#comfortImage'), note = one('#comfortImageNote');
    const initial = { kicker: one('#comfortKicker')?.textContent, title: one('#comfortTitle')?.textContent, desc: one('#comfortDesc')?.textContent, src: visual?.src, srcset: visual?.srcset, sizes: visual?.sizes, alt: visual?.alt, note: note?.textContent };
    const authored = (key, fallback) => {
      const option = one('.nc-comfort-' + key);
      if (!option) return fallback; // Read-only compatibility for saved older compositions.
      const picture = option.querySelector('img');
      return {kicker: option.querySelector('.comfort-kicker')?.textContent, title: option.querySelector('h3')?.textContent, desc: option.querySelector('.nc-comfort-description')?.textContent, src: picture?.src, srcset: picture?.srcset, sizes: picture?.sizes, alt: picture?.alt, note: option.querySelector('.nc-comfort-note')?.textContent};
    };
    const data = {
      temperature: initial,
      air: authored('air', { kicker: labels.airKicker, title: labels.airTitle, desc: labels.airCopy, src: initial.src, alt: initial.alt, note: labels.airNote }),
      control: authored('control', { kicker: labels.controlKicker, title: labels.controlTitle, desc: labels.controlCopy, src: initial.src, alt: initial.alt, note: labels.controlNote })
    };
    panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-live', 'polite');
    const select = (tab) => {
      const entry = data[tab.dataset.comfort];
      if (!entry) return;
      tabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', tab.id);
      for (const [id, key] of [['comfortKicker', 'kicker'], ['comfortTitle', 'title'], ['comfortDesc', 'desc'], ['comfortImageNote', 'note']]) {
        const target = one('#' + id);
        if (target) target.textContent = entry[key] || '';
      }
      if (visual && entry.src) { visual.srcset = entry.srcset || ''; visual.sizes = entry.sizes || '';  visual.src = entry.src; visual.alt = entry.alt || ''; }
    };
    tabs.forEach((tab) => tab.addEventListener('click', () => select(tab)));
    tabs.forEach((tab) => { tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tabs[0].id);
    one('.comfort-tablist')?.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const rtl = getComputedStyle(root).direction === 'rtl';
      const step = (event.key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1);
      const index = tabs.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + step + tabs.length) % tabs.length;
      tabs[next].focus(); select(tabs[next]);
    });
  }

  const viewport = one('.project-viewport'), track = one('#projectTrack');
  if (viewport && track?.children.length) {
    const move = (direction) => {
      const sign = getComputedStyle(viewport).direction === 'rtl' ? -1 : 1;
      viewport.scrollBy({ left: sign * direction * (track.children[0].getBoundingClientRect().width + 22), behavior: reduced ? 'auto' : 'smooth' });
    };
    one('#prevProject')?.addEventListener('click', () => move(-1));
    one('#nextProject')?.addEventListener('click', () => move(1));
  }
  const zones = {
    roof: [labels.roofTitle, labels.roofCopy],
    living: [labels.livingTitle, labels.livingCopy],
    outside: [labels.outsideTitle, labels.outsideCopy]
  };
  for(const key of ['roof','living','outside']){const option=one('.nc-zone-'+key);if(option)zones[key]=[option.querySelector('h3')?.textContent,option.querySelector('p')?.textContent];}
  all('[data-zone]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.zone === 'roof'));
    button.addEventListener('click', () => {
      const zone = zones[button.dataset.zone];
      if (!zone) return;
      if (one('#zoneTitle')) one('#zoneTitle').textContent = zone[0];
      if (one('#zoneDesc')) one('#zoneDesc').textContent = zone[1];
      all('[data-zone]').forEach((item) => {
        const active = item.dataset.zone === button.dataset.zone;
        item.setAttribute('aria-pressed', String(active)); item.classList.toggle('active', active);
      });
    });
  });
  const range = one('#compareRange');
  range?.addEventListener('input', () => {
    const value = Math.max(0, Math.min(100, Number(range.value)));
    if (one('#afterLayer')) one('#afterLayer').style.clipPath = `inset(0 0 0 ${value}%)`;
    if (one('#comparisonLine')) one('#comparisonLine').style.left = value + '%';
    if (one('#comparisonHandle')) one('#comparisonHandle').style.left = value + '%';
  });
  let temperature = 22;
  const adjust = (delta) => {
    const value = one('#setpoint');
    if (!value) return;
    temperature = Math.max(16, Math.min(28, temperature + delta));
    value.replaceChildren(document.createTextNode(String(temperature)));
    const symbol = document.createElement('span'); symbol.textContent = '°'; value.append(symbol);
  };
  one('#tempDown')?.addEventListener('click', () => adjust(-1));
  one('#tempUp')?.addEventListener('click', () => adjust(1));

})();
/* Shared menus and source interior interactions; no prototype success messages. */
(()=>{'use strict';const root=document.querySelector('body.climate-v2');if(!root)return;root.classList.add('cv2-js');const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches,nav=root.querySelector('#navLinks'),toggle=root.querySelector('#menuToggle');
nav?.querySelectorAll('.menu-item-has-children').forEach(li=>{const a=li.querySelector(':scope>a'),sub=li.querySelector(':scope>ul');if(!a||!sub)return;const d=document.createElement('details'),s=document.createElement('summary'),panel=document.createElement('div');s.textContent=a.textContent;panel.className='cl-nav-dropdown-panel';panel.append(a);sub.querySelectorAll('a').forEach(link=>panel.append(link));d.append(s,panel);li.replaceChildren(d);});
const details=[...nav?.querySelectorAll('details')||[]];const closeDetails=()=>details.forEach(d=>d.open=false);const close=()=>{closeDetails();nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');};toggle?.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));if(!open)closeDetails();});details.forEach(d=>{d.addEventListener('toggle',()=>{if(d.open)details.forEach(other=>{if(other!==d&&!other.contains(d))other.open=false;});});d.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:1001px)').matches)d.open=true;});d.addEventListener('pointerleave',()=>{if(matchMedia('(min-width:1001px)').matches&&!d.contains(document.activeElement))d.open=false;});});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('pointerdown',e=>{if(nav&&!nav.contains(e.target)&&!toggle?.contains(e.target))close();});document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const open=details.find(d=>d.open);if(open){closeDetails();open.querySelector('summary')?.focus();}else if(nav?.classList.contains('open')){close();toggle?.focus();}});matchMedia('(min-width:1001px)').addEventListener('change',close);
const header=root.querySelector('.cl-header'),bar=root.querySelector('.cl-scroll-progress');let queued=false;addEventListener('scroll',()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{header?.classList.toggle('is-pinned',scrollY>145);if(bar)bar.style.width=(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100)+'%';queued=false;});},{passive:true});
const reveals=[...root.querySelectorAll('.reveal,.cl-reveal')];if(!reduced&&'IntersectionObserver'in window){root.classList.add('cv2-motion');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible','is-visible');e.target.classList.remove('cv2-reveal-pending');io.unobserve(e.target);} }),{threshold:.05,rootMargin:'0px 0px 65px 0px'});reveals.forEach((e,i)=>{e.style.setProperty('--cv2-delay',(i%3)*90+'ms');if(e.getBoundingClientRect().top>innerHeight)e.classList.add('cv2-reveal-pending');else e.classList.add('visible','is-visible');io.observe(e);});}
root.querySelectorAll('[data-filter-group]').forEach(group=>{const scope=root.querySelector('#'+CSS.escape(group.dataset.filterGroup));group.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{group.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));scope?.querySelectorAll('[data-category]').forEach(card=>card.hidden=btn.dataset.filter!=='all'&&!card.dataset.category.split(' ').includes(btn.dataset.filter));}));});
root.querySelectorAll('[data-temperature-widget]').forEach(w=>{let t=22;const value=w.querySelector('[data-temp-value]');w.querySelector('[data-temp-minus]')?.addEventListener('click',()=>{t=Math.max(16,t-1);if(value)value.textContent=t+'°';});w.querySelector('[data-temp-plus]')?.addEventListener('click',()=>{t=Math.min(28,t+1);if(value)value.textContent=t+'°';});});
root.querySelectorAll('[data-rotator]').forEach(r=>{const slides=[...r.querySelectorAll('[data-slide]')];let i=0;const show=()=>slides.forEach((s,j)=>s.hidden=j!==i);show();r.querySelector('[data-prev]')?.addEventListener('click',()=>{i=(i-1+slides.length)%slides.length;show();});r.querySelector('[data-next]')?.addEventListener('click',()=>{i=(i+1)%slides.length;show();});});
const widgets=[...root.querySelectorAll('[data-quote-wizard]')];const homeWizard=root.querySelector('#quoteStage')?.closest('section');if(homeWizard&&!widgets.includes(homeWizard))widgets.push(homeWizard);widgets.forEach(w=>{const area=w.querySelector('[data-quote-area],#quoteStage');if(!area)return;const steps=[...area.querySelectorAll('.cv2-wizard-step')],result=area.querySelector('[data-cv2-result]'),next=w.querySelector('[data-quote-next],#quoteNext'),back=w.querySelector('[data-quote-back],#quoteBack'),meter=w.querySelector('[data-quote-meter],#quoteProgress');if(!steps.length||!next||!back)return;let index=0;const answers=Array(steps.length).fill('');const show=()=>{steps.forEach((s,i)=>s.hidden=i!==index);back.hidden=index===0;next.disabled=index<steps.length&&!answers[index];next.textContent=index===steps.length?'Download my brief ↗':index===steps.length-1?'Build my brief ↗':'Continue →';if(meter)meter.style.width=Math.min(100,(index+1)*100/steps.length)+'%';if(result){result.hidden=index!==steps.length;if(index===steps.length){result.replaceChildren();const h=document.createElement('h3');h.textContent='Your comfort brief is ready.';const p=document.createElement('p');p.textContent=answers.join(' · ');const note=document.createElement('p');note.textContent='A planning aid for your next conversation. No equipment recommendation or price estimate.';result.append(h,p,note);}}};steps.forEach((s,i)=>s.querySelectorAll('[data-choice]').forEach(btn=>btn.addEventListener('click',()=>{answers[i]=btn.textContent.trim();s.querySelectorAll('[data-choice]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});next.disabled=false;})));next.addEventListener('click',()=>{if(index===steps.length){const blob=new Blob(['NEXA Comfort Brief\n\n'+answers.join('\n')+'\n\nPlanning aid only. Contact a qualified provider.'],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='NEXA-Comfort-Brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}if(!answers[index])return;index++;show();});back.addEventListener('click',()=>{index=Math.max(0,index-1);show();});show();});
})();

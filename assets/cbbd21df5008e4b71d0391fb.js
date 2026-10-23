/* Native dialog gallery, scoped to interior Gutenberg galleries. */
(() => {
 'use strict';
 if (typeof HTMLDialogElement === 'undefined') return;
 const galleries = document.querySelectorAll('.nc-premium .wp-block-gallery, .nexal-gallery');
 if (!galleries.length) return;
 const text = window.nexasvcGallery;
 const fullImageUrl = source => {
  const link = source.closest('a');
  try {
   const url = new URL(source.dataset.fullUrl || link?.href || '', document.baseURI);
   if (/^https?:$/.test(url.protocol) && (source.dataset.fullUrl || /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname))) return url.href;
  } catch (_) { /* Invalid document links must not prevent opening the image. */ }
  return source.src || source.currentSrc;
 };
 galleries.forEach(gallery => {
  const images = [...gallery.querySelectorAll('img')].filter(source => source.closest('figure') && !source.dataset.ncGalleryEnhanced); if (!images.length) return;
  let index = 0, trigger;
  const dialog = document.createElement('dialog'); dialog.className = 'nc-lightbox';
  dialog.setAttribute('aria-label', text.open);
  const controls = document.createElement('div'); controls.className = 'nc-lightbox-controls';
  const image = document.createElement('img'), caption = document.createElement('p');
  const show = i => {
   index = (i + images.length) % images.length;
   const source = images[index];
   // An image may link to an attachment page or another document, not its media file.
   image.src = fullImageUrl(source);
   image.alt = source.alt;
   caption.textContent = `${index + 1} / ${images.length} · ${source.alt}`;
  };
  [[text.previous, () => show(index - 1)],[text.close, () => dialog.close()],[text.next, () => show(index + 1)]].forEach(([label, action]) => { const button = document.createElement('button'); button.type = 'button'; button.textContent = label; button.addEventListener('click', action); controls.append(button); });
  dialog.append(controls, image, caption); document.body.append(dialog);
  images.forEach((source, i) => { const figure = source.closest('figure'); source.dataset.ncGalleryEnhanced = 'true'; figure.classList.add('nc-gallery-item'); const button = document.createElement('button'); button.type = 'button'; button.className = 'nc-gallery-open'; button.textContent = text.open; button.setAttribute('aria-label', `${text.open}: ${source.alt || i + 1}`); figure.append(button); button.addEventListener('click', () => { trigger = button; show(i); dialog.showModal(); controls.children[1].focus(); }); });
  dialog.addEventListener('close', () => trigger?.focus());
  dialog.addEventListener('click', e => { if (e.target === dialog && (e.clientX < dialog.getBoundingClientRect().left || e.clientX > dialog.getBoundingClientRect().right)) dialog.close(); });
  dialog.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); show(index + (e.key === 'ArrowRight' ? 1 : -1)); } });
 });
})();

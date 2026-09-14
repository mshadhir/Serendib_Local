export function imageSources(src) {
  if(src==='/images/hero.webp')return '/images/hero-640.webp 640w, /images/hero-1200.webp 1200w, /images/hero.webp 1800w';
  if(src==='/images/coast.webp'||src==='/images/train.webp')return src.replace('.webp','-768.webp')+' 768w, '+src+' 1000w';
  return undefined;
}
export const cardSizes='(max-width: 760px) calc(100vw - 40px), (max-width: 1296px) calc((100vw - 96px) / 3), 383px';

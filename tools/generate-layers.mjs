import { mkdir, writeFile } from 'node:fs/promises';
const dir = 'public/assets/environment';
await mkdir(dir, { recursive: true });
const svg = (viewBox, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">${body}</svg>`;
// Original vector fronds: every leaflet is a separate tapered Bézier shape.
function frond(cx, cy, ex, ey, bend, color) {
  let out = `<path d="M${cx} ${cy} Q${(cx+ex)/2} ${cy+bend} ${ex} ${ey}" stroke="${color}" stroke-width="3"/>`;
  for (let i=1;i<19;i++) {
    const t=i/20, x=cx+(ex-cx)*t, y=(1-t)*(1-t)*cy+2*(1-t)*t*(cy+bend)+t*t*ey;
    const len=65*Math.sin(Math.PI*t)*(.65+t*.3), side=ex>cx?1:-1;
    out += `<path d="M${x} ${y} Q${x+len*side*.3} ${y+12} ${x+len*side*.22} ${y+len} Q${x-len*side*.23} ${y+18} ${x-6*side} ${y-3}Z" fill="${color}"/>`;
  }
  return out;
}
let palm = '<path d="M105 710 Q190 410 305 145 L320 151 Q235 414 183 720Z" fill="#213f35"/><path d="M148 710 Q225 403 311 149" stroke="#607058" stroke-width="5"/>';
for (const [x,y,b,c] of [[-80,225,-140,'#203f35'],[-40,80,-90,'#294e3e'],[25,-30,-105,'#36583f'],[280,-50,-120,'#284f3c'],[505,-20,-130,'#284b38'],[690,155,-100,'#234333'],[620,320,-30,'#294f3b'],[440,400,0,'#203f35']]) palm+=frond(313,147,x,y,b,c);
await writeFile(`${dir}/palm-foreground.svg`,svg('0 0 700 720',palm));
await writeFile(`${dir}/clouds.svg`,svg('0 0 1440 700','<g fill="#fff4e4" opacity=".32"><path d="M30 175 Q60 140 92 153 Q116 112 155 143 Q180 120 207 155 Q249 145 281 175Z"/><path d="M850 100 Q885 72 926 88 Q960 44 1000 81 Q1040 65 1061 100 Q1100 88 1135 110H825Z"/></g>'));
await writeFile(`${dir}/birds.svg`,svg('0 0 1440 900','<g stroke="#173746" stroke-width="2" stroke-linecap="round" opacity=".65"><path d="M940 235q9-7 18 0q9-7 18 0M990 215q6-5 12 0q6-5 12 0M1040 245q7-5 14 0q7-5 14 0"/></g>'));
await writeFile(`${dir}/waves.svg`,svg('0 0 1440 900','<g stroke="#fff4e4" stroke-linecap="round"><path opacity=".26" d="M80 643q170-15 330-2t250-10M600 708q140-16 310-8M20 771q130-8 270 1"/><path opacity=".3" d="M450 560q90-4 155-1M700 600q80 4 160-7M1030 535q45-3 80-12"/></g>'));
console.log('Four original SVG environment layers written.');

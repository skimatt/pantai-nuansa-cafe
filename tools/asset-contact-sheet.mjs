import sharp from 'sharp';
const tiles=[];
for(let i=1;i<=8;i++){
 const tile=await sharp(`public/assets/menu/menu-${String(i).padStart(2,'0')}.webp`).resize(320,320).toBuffer();
 tiles.push({input:tile,left:((i-1)%4)*340+20,top:Math.floor((i-1)/4)*360+20});
 const label=Buffer.from(`<svg width="320" height="28"><text x="0" y="18" font-size="12" fill="#173746">${String(i).padStart(2,'0')} — AI concept / placeholder</text></svg>`);
 tiles.push({input:label,left:((i-1)%4)*340+20,top:Math.floor((i-1)/4)*360+344});
}
await sharp({create:{width:1380,height:744,channels:3,background:'#fff4e4'}}).composite(tiles).png().toFile('evidence/screenshots/menu-contact-sheet.png');
console.log('Eight concept assets in evidence/screenshots/menu-contact-sheet.png');

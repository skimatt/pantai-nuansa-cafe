/** Painted paper/foam cover: moves over the image instead of GPU polygon clipping. */
const edge=Array.from({length:101},(_,i)=>`${i*10},${(172+Math.sin(i*.23)*22+Math.sin(i*1.7)*5).toFixed(3)}`).join(' ');
export default function PhotoSurf({dish=false}:{dish?:boolean}){
 return <svg className={dish?'photo-surf dish-surf':'photo-surf'} viewBox="0 0 1000 240" preserveAspectRatio="none" aria-hidden="true"><polygon points={`0,0 1000,0 ${edge.split(' ').reverse().join(' ')}`} fill="#fff4e4"/><polyline points={edge} fill="none" stroke="#b3c6ae" strokeWidth="5"/><polyline points={edge} transform="translate(0 7)" fill="none" stroke="#fff4e4" strokeWidth="3"/></svg>;
}

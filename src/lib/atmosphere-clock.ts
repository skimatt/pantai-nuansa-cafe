/** One visibility-aware RAF clock for all below-fold environments. */
type Paint=(time:number)=>void;
const clients=new Map<Paint,boolean>();
let raf=0,last=0,time=0;
function tick(now:number){
  if(now-last>=1000/24-.6){time+=Math.min((now-last)/1000,.08);last=now;for(const [paint,active] of clients)if(active)paint(time);}
  raf=requestAnimationFrame(tick);
}
function sync(){
  cancelAnimationFrame(raf);raf=0;
  if(!document.hidden&&[...clients.values()].some(Boolean)){last=performance.now();raf=requestAnimationFrame(tick);}
}
export function joinAtmosphere(paint:Paint){
  if(clients.size===0)document.addEventListener('visibilitychange',sync);
  clients.set(paint,false);
  return {active(value:boolean){clients.set(paint,value);sync();},dispose(){clients.delete(paint);sync();if(clients.size===0)document.removeEventListener('visibilitychange',sync);}};
}

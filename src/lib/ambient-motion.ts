const choiceKey='nuansa-ambient-motion-v1',choiceEvent='nuansa-ambient-motion-change';
let enabled:boolean|undefined;
export function ambientMotionEnabled(){
 if(enabled===undefined){try{enabled=localStorage.getItem(choiceKey)==='enabled';}catch{enabled=false;}}
 return enabled;
}
export function setAmbientMotionEnabled(value:boolean){
 enabled=value;
 try{if(value)localStorage.setItem(choiceKey,'enabled');else localStorage.removeItem(choiceKey);}catch{/* Session choice remains usable when storage is blocked. */}
 window.dispatchEvent(new Event(choiceEvent));
}
export function subscribeAmbientMotion(listener:()=>void){
 const system=matchMedia('(prefers-reduced-motion:reduce)');
 system.addEventListener('change',listener);window.addEventListener(choiceEvent,listener);
 return ()=>{system.removeEventListener('change',listener);window.removeEventListener(choiceEvent,listener);};
}
/** An explicit local choice only enables ambient animation; system scroll/intro
 * reduction and audio remain untouched. No OS/browser preference is changed. */
export function ambientMotionPreference(){
 const system=matchMedia('(prefers-reduced-motion:reduce)');
 return {
  get matches(){return system.matches&&!ambientMotionEnabled();},
  addEventListener(_event:'change',listener:()=>void){system.addEventListener('change',listener);window.addEventListener(choiceEvent,listener);},
  removeEventListener(_event:'change',listener:()=>void){system.removeEventListener('change',listener);window.removeEventListener(choiceEvent,listener);},
 };
}

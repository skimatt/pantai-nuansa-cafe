export type IntroState = 'ready' | 'playing' | 'hero';
export function shouldPlayIntro(options:{enabled:boolean;reduced:boolean;seen:boolean;hasHash:boolean}) {
  return options.enabled&&!options.reduced&&!options.seen&&!options.hasHash;
}
export function readSession(key:string) {
  try{return sessionStorage.getItem(key)==='seen';}catch{return false;}
}
export function markSession(key:string) {
  try{sessionStorage.setItem(key,'seen');}catch{/* Animation stays usable in private/restricted contexts. */}
}

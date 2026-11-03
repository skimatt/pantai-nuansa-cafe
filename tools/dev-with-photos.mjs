import {watch} from 'node:fs';
import {spawn} from 'node:child_process';
import {syncLocalPhotos} from './sync-local-photos.mjs';
await syncLocalPhotos();
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1',...process.argv.slice(2)],{stdio:'inherit',windowsHide:true});
let timer,busy=false,pending=false;
async function sync(){if(busy){pending=true;return;}busy=true;try{await syncLocalPhotos();}catch(error){console.error(`Foto belum siap diproses: ${error.message}. Manifest sebelumnya dipertahankan.`);}finally{busy=false;if(pending){pending=false;timer=setTimeout(sync,450);}}}
const observer=watch('foto-website',{recursive:true},()=>{clearTimeout(timer);timer=setTimeout(sync,600);});
const close=()=>{clearTimeout(timer);observer.close();child.kill('SIGTERM');};
process.on('SIGINT',close);process.on('SIGTERM',close);child.on('exit',code=>{observer.close();clearTimeout(timer);process.exit(code??0);});

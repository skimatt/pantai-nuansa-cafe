import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('deliverables/coastal-asset-kit'),types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.glb':'model/gltf-binary','.md':'text/plain','.csv':'text/csv'};
createServer(async(req,res)=>{try{const url=new URL(req.url,'http://127.0.0.1'),name=decodeURIComponent(url.pathname),file=path.resolve(root,'.'+name+(name.endsWith('/')?'index.html':''));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream','Cache-Control':'no-store'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}}).listen(4181,'127.0.0.1',()=>console.log('Asset studio: http://127.0.0.1:4181/viewer/'));

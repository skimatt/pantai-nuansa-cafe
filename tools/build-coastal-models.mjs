import * as THREE from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {OBJExporter} from 'three/addons/exporters/OBJExporter.js';
import {writeFile,readFile,mkdir} from 'node:fs/promises';
const root='deliverables/coastal-asset-kit';
// GLTFExporter uses FileReader for binary buffers. No DOM or network required.
globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}readAsDataURL(blob){blob.arrayBuffer().then(result=>{this.result=`data:${blob.type};base64,${Buffer.from(result).toString('base64')}`;this.onloadend?.();});}};
const random=n=>{const r=Math.sin(n*127.1+19.8)*43758.5453;return r-Math.floor(r);};
const mat=(color)=>new THREE.MeshStandardMaterial({color,roughness:1,flatShading:true,side:THREE.DoubleSide});
const colors={wood:mat('#7b6447'),leaf:mat('#426d51'),light:mat('#7d905a'),dark:mat('#264f43'),foam:mat('#f7ebcf'),sea:mat('#327d86'),sand:mat('#e4c79f'),bird:mat('#edeedb'),ink:mat('#365c65'),beak:mat('#bc914d')};
function mesh(geo,material,parent,name){const m=new THREE.Mesh(geo,material);m.name=name;parent.add(m);return m;}
function sphere(parent,name,x,y,z,sx,sy,sz,material){const m=mesh(new THREE.SphereGeometry(1,10,7),material,parent,name);m.position.set(x,y,z);m.scale.set(sx,sy,sz);return m;}
function branch(parent,name,a,b,r1,r2,material=colors.wood){
 const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),delta=vb.clone().sub(va);
 const m=mesh(new THREE.CylinderGeometry(r2,r1,delta.length(),7),material,parent,name);m.position.copy(va.clone().add(vb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m;
}
function sway(name,amount=.045){const times=[0,1,2,3,4],angles=[0,amount,0,-amount,0],q=[];angles.forEach(a=>q.push(...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),a).toArray()));return new THREE.AnimationClip('Wind_loop',4,[new THREE.QuaternionKeyframeTrack(`${name}.quaternion`,times,q)]);}
function tree(kind){
 const root=new THREE.Group();root.name=`Tree_${kind}`;
 const wind=new THREE.Group();wind.name='Wind_crown';root.add(wind);
 const height=kind==='pine'?7:5.5;
 branch(wind,'Trunk',[0,0,0],[.15,height*.72,0],.2,.07);
 for(let i=0;i<(kind==='banyan'?9:5);i++){
  const a=i*2.399,end=[Math.cos(a)*(.6+random(i)*.5),.02,Math.sin(a)*(.5+random(i+21)*.4)];branch(root,`Root_${i}`,[0,.5,0],end,.1,.025);
 }
 const count=kind==='pine'?34:kind==='banyan'?46:32;
 for(let i=0;i<count;i++){
  const angle=i*2.399,level=kind==='pine'?.2+random(i)*.72:kind==='almond'?.39+(i%4)*.14:.65+random(i)*.23;
  const breadth=kind==='pine'?(1-level)*2.5:kind==='banyan'?2.3:2.1-(i%4)*.26;
  const a=[.15*level,height*level,0],b=[Math.cos(angle)*breadth,height*level+.16,Math.sin(angle)*breadth*.7];
  branch(wind,`Branch_${i}`,a,b,.045,.012);
  const leaf=sphere(wind,`Canopy_${i}`,...b,kind==='pine'?.55:.75,kind==='pine'?.12:.3,kind==='pine'?.24:.52,i%3?colors.leaf:colors.light);leaf.rotation.z=(random(i+20)-.5)*.25;
  if(kind==='banyan'&&i%4===0)branch(wind,`Aerial_root_${i}`,b,[b[0],.5+random(i+5),b[2]],.015,.008);
 }
 return {object:root,clips:[sway(wind.name,kind==='pine'?.065:.03)]};
}
function bird(egret=false,standing=false){
 const root=new THREE.Group();root.name=egret?'Egret':'Gull';
 sphere(root,'Body',0,standing?1.2:0,0,.65,.25,.3,colors.bird);
 const y=standing?1.2:0;
 if(egret){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(.35,y+.08,0),new THREE.Vector3(.6,y+.5,0),new THREE.Vector3(.4,y+.9,0),new THREE.Vector3(.75,y+1.15,0)]);mesh(new THREE.TubeGeometry(curve,16,.08,7,false),colors.bird,root,'Neck');}
 const hx=egret?.85:.6,hy=y+(egret?1.15:.14);sphere(root,'Head',hx,hy,0,.16,.13,.13,colors.bird);branch(root,'Beak',[hx+.1,hy,0],[hx+(egret?.63:.4),hy-.04,0],.05,.003,colors.beak);sphere(root,'Eye',hx+.07,hy+.025,.119,.022,.022,.01,colors.ink);
 if(egret){for(const z of [-.1,.1]){const end=standing?[.05,.05,z]:[-1.3,y-.15,z];branch(root,`Leg_${z}`,[-.15,y-.1,z],end,.018,.01,colors.ink);branch(root,`Toe_${z}`,end,[end[0]+.2,end[1],end[2]+.05],.01,.005,colors.ink);}}
 const clips=[];
 if(!standing){
  const tracks=[];for(const sign of [-1,1]){
   const wing=new THREE.Group();wing.name=sign<0?'Wing_left':'Wing_right';wing.position.set(0,y,0);root.add(wing);
   const s=new THREE.Shape();s.moveTo(.35,0);s.quadraticCurveTo(-.05,1,-.55,1.8);s.lineTo(-.35,1.2);s.lineTo(-.7,1.55);s.lineTo(-.45,.8);s.lineTo(-.8,1);s.quadraticCurveTo(-.5,.15,.35,0);
   const g=new THREE.ExtrudeGeometry(s,{depth:.025,bevelEnabled:false,curveSegments:8});g.rotateX(sign*Math.PI/2);mesh(g,sign<0?colors.bird:colors.light,wing,'Feathers_'+sign);
   const q=[];for(const a of [0,.65,0,-.55,0])q.push(...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),a*sign).toArray());tracks.push(new THREE.QuaternionKeyframeTrack(`${wing.name}.quaternion`,[0,.25,.5,.75,1],q));
  }clips.push(new THREE.AnimationClip('Flight_loop',1,tracks));
 }
 return {object:root,clips};
}
function wave(){
 const root=new THREE.Group();root.name='Serrated_surf';const clips=[];
 for(let layer=0;layer<3;layer++){
  const positions=[],target=[],indices=[],n=160;
  for(let i=0;i<=n;i++){
   const x=i/n*18-9,edge=(phase)=>1+Math.sin(x*1.4+phase)*.35+Math.sin(x*6.1-phase)*.08+Math.sin(x*15)*.025+layer*.1;
   positions.push(x,edge(0),layer*.03,x,-3,layer*.03);target.push(x,edge(2),layer*.03,x,-3,layer*.03);
   if(i<n){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.morphAttributes.position=[new THREE.Float32BufferAttribute(target,3)];g.computeVertexNormals();
  const m=mesh(g,[colors.sea,colors.light,colors.foam][layer]??colors.leaf,root,`Surf_layer_${layer}`);
  clips.push(new THREE.NumberKeyframeTrack(`${m.name}.morphTargetInfluences[0]`,[0,2,4],[0,1,0]));
 }
 return {object:root,clips:[new THREE.AnimationClip('Surf_loop',4,clips)]};
}
function dune(){
 const root=new THREE.Group();root.name='Sand_dunes';const g=new THREE.PlaneGeometry(12,6,48,24),p=g.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,.7*Math.sin(x*.48+y*.21)+.18*Math.sin(x*2+y*.6));}g.computeVertexNormals();g.rotateX(-Math.PI/2);mesh(g,colors.sand,root,'Rippled_dune');return {object:root,clips:[]};
}
const entries=[['wave-serrated',wave()],['dune-sand',dune()],['gull-flight',bird()],['egret-flight',bird(true)],['egret-standing',bird(true,true)],['tree-coastal-pine',tree('pine')],['tree-almond',tree('almond')],['tree-banyan',tree('banyan')]];
await mkdir(`${root}/models`,{recursive:true});const records=[];
for(const [id,{object,clips}]of entries){
 object.updateMatrixWorld(true);const exporter=new GLTFExporter();const result=await exporter.parseAsync(object,{binary:true,animations:clips,onlyVisible:true});
 await writeFile(`${root}/models/${id}.glb`,Buffer.from(result));await writeFile(`${root}/models/${id}.obj`,new OBJExporter().parse(object));
 records.push({id,glb:`models/${id}.glb`,obj:`models/${id}.obj`,bytes:result.byteLength,animationClips:clips.map(c=>({name:c.name,duration:c.duration,tracks:c.tracks.length})),source:'tools/build-coastal-models.mjs',sourceType:'procedural',note:'Editable structural/stylized model; generated tree raster is a separate illustration, not a GLB render.'});
 object.traverse(o=>{if(o.isMesh)o.geometry.dispose();});
}
const manifest=JSON.parse(await readFile(`${root}/manifest.json`,'utf8'));manifest.models=records;
await writeFile(`${root}/manifest.json`,JSON.stringify(manifest,null,2));
await writeFile(`${root}/source/model-inventory.json`,JSON.stringify(records,null,2));
console.log(`Exported ${records.length} GLB + OBJ masters with ${records.reduce((n,r)=>n+r.animationClips.length,0)} animation clips.`);

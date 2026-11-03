import type {FoundationContent} from './content';
export function sceneKit(content:FoundationContent,scene:string){
 const kit=content.scenes.assetKit;
 const get=(id:string)=>content.media.assets.find(a=>a.id===id)!;
 const tree=scene==='explore'?kit.trees.almond:scene==='moments'?kit.trees.banyan:kit.trees.pine;
 return {bird:get(scene==='experience'||scene==='find-us'?kit.egret:kit.gull),tree:get(tree),sand:get(kit.sand),flightFrame:kit.flightFrame,sandFrame:kit.sandFrame};
}
export type SceneKit=ReturnType<typeof sceneKit>;

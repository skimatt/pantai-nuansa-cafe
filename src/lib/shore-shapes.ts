/** Original serrated foam edge. Shared by scene surf and navigation curtain. */
export function foamEdge(ctx:CanvasRenderingContext2D,w:number,y:number,t:number,amplitude:number,reverse=false){
  if(reverse)ctx.lineTo(w+24,y);else ctx.moveTo(-20,y);
  for(let step=0;step<=Math.ceil((w+48)/8);step++){
    const x=reverse?w+24-step*8:-20+step*8;
    const rolling=Math.sin(x*.009+t)*amplitude+Math.sin(x*.023-t*.8)*amplitude*.28;
    const teeth=Math.sin(x*.105+t*1.5)*amplitude*.1+Math.sin(x*.173-t)*amplitude*.055;
    ctx.lineTo(x,y+rolling+teeth);
  }
}
export function drawBentLeaf(c:CanvasRenderingContext2D,sprite:CanvasImageSource,sw:number,sh:number,x:number,y:number,angle:number,length:number,time:number,wind:number,mobile:boolean){
  c.save();c.translate(x,y);c.rotate(angle+Math.sin(time*.85)*.045*wind);if(Math.cos(angle)<0)c.scale(1,-1);
  const height=length*sh/sw,segments=mobile?10:18;
  for(let i=0;i<segments;i++){
    const p=i/segments,dy=Math.sin(time*1.4-p*2.5)*p*p*17*wind;
    c.drawImage(sprite,p*sw,0,sw/segments+.8,sh,p*length-length*.04,dy-height*.4,length/segments+.8,height);
  }c.restore();
}

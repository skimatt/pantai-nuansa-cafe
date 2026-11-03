/** Both bird atlases face right. Motion must follow the beak, with the wrap
 * entirely outside the visible frame and a shallow, continuous glide path. */
export function forwardFlight(width:number,time:number,index:number,start=.55){
 const speed=20-index*2,span=width+160;
 return {x:((width*start+index*64+time*speed)%span+span)%span-80,
  rise:Math.sin(time*.46+index*.7)*5,
  bank:Math.cos(time*.46+index*.7)*.035};
}

/** Brief brush-thin breezes with soft tails. Long quiet intervals prevent a
 * constant decorative loop from competing with photography or typography. */
export function drawSeaBreeze(c:CanvasRenderingContext2D,w:number,top:number,height:number,time:number,strength=1,night=false){
 if(height<1)return;c.save();c.lineCap='round';
 for(let i=0;i<2;i++){
  const phase=((time+i*4.7)%13)/4.8;if(phase>=1)continue;
  const fade=Math.sin(Math.PI*phase)**2,x=-190+phase*(w+320),y=top+height*(.31+i*.24)+Math.sin(time*.35+i)*9,length=w<700?95:155;
  const ink=night?'211,226,207':'73,117,111',stroke=c.createLinearGradient(x,0,x+length,0);
  stroke.addColorStop(0,`rgba(${ink},0)`);stroke.addColorStop(.35,`rgba(${ink},${fade*Math.min(.2,strength*.095)})`);stroke.addColorStop(1,`rgba(${ink},0)`);
  c.strokeStyle=stroke;c.lineWidth=w<700?.8:1;
  c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+length*.3,y-12,x+length*.68,y+9,x+length,y-3);c.stroke();
  c.globalAlpha=.55;c.beginPath();c.moveTo(x+18,y+7);c.bezierCurveTo(x+length*.35,y-2,x+length*.55,y+14,x+length*.78,y+6);c.stroke();c.globalAlpha=1;
 }c.restore();
}

import {forwardFlight,drawSeaBreeze} from './coastal-air';
/** Original Canvas 2D artwork. Geometry is rebuilt from joints and wave phases,
 * rather than translating a flattened illustration. Coordinates are design units. */
export type WorldSettings = { fps:number; pixelRatio:number; wind:number; surfPeriod:number; sandParticles:number };
type Point={x:number;y:number};
const TAU=Math.PI*2;
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const random=(n:number)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
function bezier(a:Point,b:Point,c:Point,t:number):Point{
  return {x:(1-t)**2*a.x+2*(1-t)*t*b.x+t*t*c.x,y:(1-t)**2*a.y+2*(1-t)*t*b.y+t*t*c.y};
}

export class CoastalWorld {
  private ctx:CanvasRenderingContext2D;
  private w=1440; private h=900; private mobile=false;
  private texture:HTMLCanvasElement;
  private px=0; private py=0;
  private pointer={x:0,y:0};
  private ripple={x:0,y:0,at:-100};
  private backdrop:HTMLImageElement;
  private frondSprite:HTMLImageElement;
  private frondTexture:HTMLCanvasElement;
  private elapsed=0;private still=false;
  private quality=1;
  public camera=0;
  public frames=0;
  constructor(private canvas:HTMLCanvasElement,private settings:WorldSettings,source:string,frond:string){
    const ctx=canvas.getContext('2d',{alpha:false});
    if(!ctx)throw new Error('Canvas 2D unavailable');
    this.ctx=ctx;
    this.backdrop=new Image();this.backdrop.onload=()=>this.draw(this.elapsed,this.still);this.backdrop.src=source;
    this.frondTexture=document.createElement('canvas');this.frondTexture.width=320;this.frondTexture.height=214;
    this.frondSprite=new Image();this.frondSprite.onload=()=>{this.frondTexture.getContext('2d')!.drawImage(this.frondSprite,0,0,320,214);this.draw(this.elapsed,this.still);};this.frondSprite.src=frond;
    this.texture=document.createElement('canvas');this.texture.width=384;this.texture.height=256;
    const noise=this.texture.getContext('2d')!;
    for(let i=0;i<14000;i++){
      noise.fillStyle=i%3?'rgba(255,247,220,.035)':'rgba(15,48,49,.04)';
      noise.fillRect(random(i)*384,random(i+240)*256,random(i+12)*2+.3,.6);
    }
  }
  resize(width:number,height:number){
    if(!Number.isFinite(width)||!Number.isFinite(height)||width<1||height<1)return;
    this.mobile=width<641;this.w=this.mobile?600:1440;this.h=this.w*height/width;
    const dpr=Math.min(devicePixelRatio||1,this.mobile?1:this.settings.pixelRatio)*this.quality;
    this.canvas.width=Math.round(width*dpr);this.canvas.height=Math.round(height*dpr);
  }
  move(x:number,y:number){this.pointer={x:(x-.5)*2,y:(y-.5)*2};}
  touch(x:number,y:number,time:number){this.ripple={x:x*this.w,y:y*this.h,at:time};}
  dispose(){this.backdrop.onload=null;this.frondSprite.onload=null;}
  economy(){this.quality=.72;}
  setBackdrop(source:string){if(!this.backdrop.src.endsWith(source))this.backdrop.src=source;}
  draw(time:number,reduced=false){
    if(!this.canvas.isConnected||!Number.isFinite(this.h)||this.h<1)return;
    this.elapsed=time;this.still=reduced;
    const c=this.ctx,w=this.w,h=this.h;
    this.frames++;
    this.px=mix(this.px,reduced?0:this.pointer.x,.045);this.py=mix(this.py,reduced?0:this.pointer.y,.045);
    c.setTransform(this.canvas.width/w,0,0,this.canvas.height/h,0,0);
    c.save();c.translate(-w*this.camera*.025,-h*this.camera*.04);c.scale(1+this.camera*.06,1+this.camera*.06);
    const t=reduced?12:time,wind=this.settings.wind;
    const horizon=h*(this.mobile?.43:.43);
    // Painterly original is a texture source; ocean pixels are displaced in depth.
    // The fallback geometry remains usable when a source cannot be decoded.
    if(this.backdrop.complete&&this.backdrop.naturalWidth){
      c.drawImage(this.backdrop,0,0,w,h);
      this.paintedOcean(t,horizon);
    }else{
      const sky=c.createLinearGradient(0,0,0,h);
      sky.addColorStop(0,'#719caa');sky.addColorStop(.43,'#e5d2b5');sky.addColorStop(.435,'#2a6f85');sky.addColorStop(1,'#35968e');
      c.fillStyle=sky;c.fillRect(0,0,w,h);this.beach(t,horizon);
    }
    const life=t-this.ripple.at;
    if(life>=0&&life<2.4&&this.ripple.y>horizon){
      c.save();c.globalAlpha=(1-life/2.4)*.5;c.strokeStyle='#fff0cf';c.lineWidth=1;
      for(let k=0;k<3;k++){c.beginPath();c.ellipse(this.ripple.x,this.ripple.y,life*38+k*12,life*9+k*3,0,0,TAU);c.stroke();}c.restore();
    }
    if(!reduced)drawSeaBreeze(c,w,0,h,t,wind);
    // Birds change wing articulation while travelling through depth.
    for(let i=0;i<5;i++){
      const flight=forwardFlight(w,t,i),x=flight.x,y=horizon*.66+flight.rise+i*6;
      const flap=Math.sin(t*3.4+i*.8)*4;
      c.strokeStyle='#385c60';c.lineWidth=1.2;c.beginPath();c.moveTo(x-7,y-flap);c.quadraticCurveTo(x-3,y-2,x,y+1);c.quadraticCurveTo(x+3,y-2,x+7,y-flap);c.stroke();
    }
    c.save();c.translate(-this.px*15,-this.py*6-this.camera*42);
    if(this.mobile){
      this.palm(w*1.12,h*.92,w*.87,h*.22,.7,t,wind);
      this.frond({x:-55,y:h*.1},-0.05,300,58,t+.4,1,'#183d36');
    }else{
      this.palm(w*1.045,h*1.13,w*.9,h*.2,.85,t,wind);
      
      this.frond({x:-110,y:-45},.44,470,76,t+2.3,.8,'#183d36');
      this.frond({x:-95,y:-50},.95,330,77,t+1,.8,'#214d40');
      // Foreground beach grass bends from its anchored root.
      for(let i=0;i<34;i++){
        const x=w*.02+random(i+64)*w*.21,y=h+15,lean=(random(i+84)-.5)*100+Math.sin(t*.8+i*.4)*12*wind;
        c.strokeStyle=i%3?'#284d3d':'#627353';c.lineWidth=1+random(i+17)*2;
        c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*.3,y-45,x+lean,y-55-random(i+29)*85);c.stroke();
      }
    }
    c.restore();
    // Windborne sand follows a shallow arc; all particles are deterministic.
    for(let i=0;i<(this.mobile?Math.ceil(this.settings.sandParticles*.5):this.settings.sandParticles);i++){
      const phase=(t*(.025+random(i+11)*.022)+random(i+41))%1;
      const x=phase*w*1.3-w*.15,y=h*(.83+random(i+67)*.18)-Math.sin(phase*Math.PI)*random(i+54)*h*.05;
      c.fillStyle=`rgba(246,226,185,${Math.sin(phase*Math.PI)*.48})`;
      c.fillRect(x-this.px*24,y,1+random(i+17)*1.8,.7);
    }
    c.save();c.globalAlpha=.65;c.drawImage(this.texture,0,0,w,h);c.restore();c.restore();
  }
  private paintedOcean(t:number,horizon:number){
    const c=this.ctx,w=this.w,h=this.h,img=this.backdrop;
    c.save();c.beginPath();c.moveTo(0,horizon);c.lineTo(w,horizon);
    for(let x=w;x>=0;x-=12)c.lineTo(x,this.paintedShore(x)-9);
    c.closePath();c.clip();
    // Scan-line displacement grows toward the viewer. Crest positions and
    // highlights deform independently; the horizon remains completely still.
    const sw=img.naturalWidth,sh=img.naturalHeight;
    const strip=this.mobile?10:4;
    for(let y=horizon;y<h;y+=strip){
      const depth=(y-horizon)/(h-horizon);
      const flow=Math.sin(y*.027-t*1.1)*depth*9+Math.sin(y*.071+t*.7)*depth*3;
      const dy=Math.sin(y*.034-t*.85)*depth*3;
      const sy=Math.max(0,Math.min(sh-.1,(y+dy)/h*sh));
      c.drawImage(img,0,sy,sw,Math.min(sh/h*(strip+.7),sh-sy),flow-8,y,w+16,strip+.7);
    }
    // Refracted light follows each wave, rather than a single moving overlay.
    for(let i=0;i<(this.mobile?25:80);i++){
      const depth=random(i+6)**1.7,y=horizon+depth*(h-horizon),x=random(i+900)*w;
      const phase=t*(.6+depth)+i,drift=Math.sin(phase)*14*depth;
      c.strokeStyle=`rgba(228,245,222,${(.04+depth*.12)*(Math.sin(phase)*.5+.5)})`;
      c.lineWidth=.6+depth*1.4;c.beginPath();c.moveTo(x+drift,y);
      c.quadraticCurveTo(x+20*depth+drift,y-Math.sin(phase)*3*depth,x+55*depth+drift,y+1);c.stroke();
    }
    c.restore();
    // A moving wash crosses the water/sand boundary, forms ragged white foam,
    // and fades while retreating, with different local phases along the beach.
    for(let j=0;j<3;j++){
      const p=(t/this.settings.surfPeriod+j/3)%1;
      const surge=Math.sin(p*Math.PI),offset=-16+surge*27;
      c.beginPath();
      for(let x=0;x<=w+12;x+=9){
        const y=this.paintedShore(x)+offset+Math.sin(x*.02+t*.5+j)*3;
        if(x===0)c.moveTo(x,y);else c.lineTo(x,y);
      }
      const opacity=Math.sin(p*Math.PI)*.57;
      c.strokeStyle=`rgba(244,244,215,${opacity})`;c.lineWidth=1.5+surge*2.5;c.stroke();
      c.fillStyle=`rgba(249,245,220,${opacity*.8})`;
      const beads=this.mobile?25:100;
      for(let i=0;i<beads;i++){
        const x=i/(beads-1)*w,y=this.paintedShore(x)+offset+Math.sin(x*.02+t*.5+j)*3;
        c.beginPath();c.ellipse(x,y+random(i+j*17)*9,1+random(i+19)*3,.6+random(i+66),0,0,TAU);c.fill();
      }
    }
  }
  private paintedShore(x:number){
    return this.mobile?this.h*(.96-.47*Math.pow(x/this.w,.75)):this.h*(1.13-.64*Math.pow(x/this.w,1.3));
  }
  private cloud(x:number,y:number,width:number,height:number,alpha:number){
    const c=this.ctx;c.save();c.fillStyle=`rgba(249,235,210,${alpha})`;
    // Soft brush marks: layered irregular masses rather than cartoon bubbles.
    for(let i=0;i<9;i++){
      c.beginPath();c.ellipse(x+width*(i/9-.5),y+Math.sin(i*2.2)*height*.2,width*.16,height*(.5+random(i+43)*.6),-.04,0,TAU);c.fill();
    }c.restore();
  }
  private shore(x:number){return this.h*(1.065-.43*Math.pow(Math.max(0,x/this.w),1.05));}
  private beach(t:number,horizon:number){
    const c=this.ctx,w=this.w,h=this.h;
    const shorePath=(offset:number,phase:number)=>{
      c.beginPath();
      for(let x=-20;x<=w+20;x+=12){
        const y=this.shore(x)+offset+Math.sin(x*.013+phase)*4+Math.sin(x*.033-phase*.7)*1.6;
        if(x===-20)c.moveTo(x,y);else c.lineTo(x,y);
      }
    };
    // Wet sand widens as the wave recedes; whitewater advances and dissolves.
    shorePath(-30,0);c.lineTo(w+20,h+20);c.lineTo(-20,h+20);c.closePath();
    const sand=c.createLinearGradient(w*.8,h*.6,w*.6,h);
    sand.addColorStop(0,'#b6b89b');sand.addColorStop(.18,'#d3c3a2');sand.addColorStop(.42,'#e1caa5');sand.addColorStop(1,'#ebd6b3');c.fillStyle=sand;c.fill();
    for(let j=0;j<4;j++){
      const p=(t/this.settings.surfPeriod+j/4)%1;
      const approach=Math.sin(p*Math.PI*.85);
      const offset=-105+(approach*111);
      const opacity=Math.sin(p*Math.PI)*.72;
      shorePath(offset,t*.38+j*2);c.lineTo(w+20,this.shore(w)+offset+15);for(let x=w+8;x>=-20;x-=12)c.lineTo(x,this.shore(x)+offset+10+Math.sin(x*.013+t*.38+j*2)*4);c.closePath();
      c.fillStyle=`rgba(227,240,218,${opacity*.22})`;c.fill();
      shorePath(offset,t*.38+j*2);c.strokeStyle=`rgba(249,245,217,${opacity})`;c.lineWidth=2+approach*2;c.stroke();
      // Ragged foam along the moving front, individual beads ebb and vanish.
      c.fillStyle=`rgba(248,244,215,${opacity*.68})`;
      for(let i=0;i<115;i++){
        const x=i/114*w+Math.sin(t*.4+i)*2,y=this.shore(x)+offset+Math.sin(x*.013+t*.38+j*2)*4;
        if(y<horizon)continue;
        c.beginPath();c.ellipse(x,y+random(i+j*13)*12,1+random(i+53)*4,.6+random(i+77)*1.1,0,0,TAU);c.fill();
      }
    }
    // Sand flecks stay on land, and create depth without a noise filter.
    c.fillStyle='rgba(113,91,65,.13)';
    for(let i=0;i<300;i++){const x=random(i+612)*w,y=h*(.65+random(i+104)*.35);if(y>this.shore(x)+24)c.fillRect(x,y,random(i+16)*2+.5,.7);}
  }
  private palm(bx:number,by:number,cx:number,cy:number,size:number,t:number,wind:number){
    const c=this.ctx,sway=Math.sin(t*.64)*11*wind*size+this.px*4*size;
    const crown={x:cx+sway,y:cy+Math.sin(t*.7)*2*size};
    const control={x:mix(bx,crown.x,.25)-55*size,y:mix(by,crown.y,.45)};
    // Tapered articulated trunk follows the same joint as its crown.
    const trunk=c.createLinearGradient(bx-20,0,bx+20,0);trunk.addColorStop(0,'#493e2e');trunk.addColorStop(.5,'#776544');trunk.addColorStop(1,'#353d2e');
    c.fillStyle=trunk;c.beginPath();c.moveTo(bx-19*size,by);
    c.quadraticCurveTo(control.x-15*size,control.y,crown.x-6*size,crown.y);
    c.quadraticCurveTo(crown.x+8*size,crown.y-5*size,crown.x+7*size,crown.y);
    c.quadraticCurveTo(control.x+16*size,control.y,bx+24*size,by);c.closePath();c.fill();
    for(let i=1;i<32;i++){
      const p=i/33,point=bezier({x:bx,y:by},control,crown,p),r=(19-p*13)*size;
      c.strokeStyle=i%2?'rgba(24,46,34,.5)':'rgba(195,167,108,.3)';c.lineWidth=1.2*size;
      c.beginPath();c.moveTo(point.x-r,point.y);c.quadraticCurveTo(point.x,point.y+5*size,point.x+r,point.y-1);c.stroke();
    }
    const fronds=[[-2.97,300,85],[-2.55,330,86],[-2.07,240,76],[-1.45,220,68],[-.77,270,77],[-.21,330,82],[.38,310,83],[2.56,270,77],[.91,205,67]];
    fronds.filter((_,i)=>!this.mobile||![2,4,8].includes(i)).forEach(([angle,length,width],i)=>this.frond(crown,angle,length*size,width*size,t+i*.63,wind,i%3===0?'#527654':i%3===1?'#2f604b':'#214b40'));
    c.fillStyle='#334c36';for(let i=0;i<4;i++){c.beginPath();c.ellipse(crown.x+(i-2)*6*size,crown.y+7*size,5*size,7*size,i*.3,0,TAU);c.fill();}
  }
  private frond(root:Point,angle:number,length:number,width:number,t:number,wind:number,color:string){
    const sprite=this.frondSprite;
    if(sprite.complete&&sprite.naturalWidth){
      const material=this.mobile?this.frondTexture:sprite;
      const c=this.ctx,sw=this.mobile?material.width:sprite.naturalWidth,sh=this.mobile?material.height:sprite.naturalHeight;
      c.save();c.translate(root.x,root.y);c.rotate(angle+Math.sin(t*.85)*.035*wind);
      if(Math.cos(angle)<0)c.scale(1,-1);
      const height=length*sh/sw;
      // Bending segments share the root, with a delayed gust toward the tip.
      const segments=this.mobile?12:24;
      for(let i=0;i<segments;i++){
        const p=i/segments,dx=p*length,dy=Math.sin(t*1.3-p*2.5)*p*p*14*wind;
        c.drawImage(material,p*sw,0,sw/segments+.8,sh,dx-length*.04,dy-height*.4,length/segments+.8,height);
      }
      c.restore();return;
    }
    const c=this.ctx,flex=Math.sin(t*.95)*.055*wind;
    const a=angle+flex;
    const end={x:root.x+Math.cos(a)*length,y:root.y+Math.sin(a)*length+length*.29};
    const control={x:root.x+Math.cos(a-.16)*length*.62,y:root.y+Math.sin(a-.16)*length*.62-length*.16};
    c.strokeStyle=color;c.lineWidth=2.3;c.beginPath();c.moveTo(root.x,root.y);c.quadraticCurveTo(control.x,control.y,end.x,end.y);c.stroke();
    // Each paired leaflet has its own flexible tip and shares a curved rachis.
    for(let i=1;i<29;i++){
      const p=i/30,point=bezier(root,control,end,p),next=bezier(root,control,end,Math.min(1,p+.02));
      const tangent=Math.atan2(next.y-point.y,next.x-point.x);
      const leaf=width*Math.sin(Math.PI*p)**.65*(1-p*.3);
      for(const side of [-1,1]){
        const flutter=Math.sin(t*1.8+i*.47+side)*.1*wind;
        const direction=tangent+side*(.87+flutter);
        const tip={x:point.x+Math.cos(direction)*leaf+Math.cos(tangent)*leaf*.43,y:point.y+Math.sin(direction)*leaf+leaf*.36};
        const thick=(1-p)*4.4+.5;
        c.fillStyle=color;c.beginPath();c.moveTo(point.x,point.y);
        c.quadraticCurveTo(mix(point.x,tip.x,.55)-Math.sin(direction)*thick,mix(point.y,tip.y,.55)-Math.cos(direction)*thick,tip.x,tip.y);
        c.quadraticCurveTo(mix(point.x,tip.x,.6)+Math.sin(direction)*thick,mix(point.y,tip.y,.6)+Math.cos(direction)*thick,point.x,point.y);c.fill();
        if(i%3===0){c.strokeStyle='rgba(192,193,118,.2)';c.lineWidth=.5;c.beginPath();c.moveTo(point.x,point.y);c.lineTo(tip.x,tip.y);c.stroke();}
      }
    }
  }
}

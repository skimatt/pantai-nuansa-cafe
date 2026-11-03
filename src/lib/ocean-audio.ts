type SoundtrackSettings = {
  src:string; volume:number; fadeInMs:number; fadeOutMs:number; loop:boolean;
};

/** Stream the locally mixed soundtrack only after the visitor enables sound. */
export class OceanAudio {
  private element:HTMLAudioElement|null=null;
  private frame=0;
  private generation=0;
  private disposed=false;
  private finishFade:(()=>void)|null=null;
  constructor(private settings:SoundtrackSettings){}

  private cancelFade(){
    cancelAnimationFrame(this.frame);this.frame=0;
    this.finishFade?.();this.finishFade=null;
  }
  private fade(to:number,duration:number){
    this.cancelFade();
    const element=this.element;
    if(!element)return Promise.resolve();
    const from=element.volume,start=performance.now();
    return new Promise<void>(resolve=>{
      this.finishFade=resolve;
      const step=(now:number)=>{
        // A callback scheduled within the current frame can receive a timestamp
        // slightly earlier than performance.now(); media volume must stay 0–1.
        const progress=Math.max(0,Math.min(1,(now-start)/Math.max(1,duration)));
        element.volume=from+(to-from)*progress;
        if(progress<1)this.frame=requestAnimationFrame(step);
        else{this.frame=0;this.finishFade=null;resolve();}
      };
      this.frame=requestAnimationFrame(step);
    });
  }
  async play(){
    if(this.disposed)return;
    const generation=++this.generation;this.cancelFade();
    if(!this.element){
      const element=document.createElement('audio');
      element.dataset.ambientTrack='true';element.setAttribute('aria-hidden','true');
      element.hidden=true;element.preload='none';element.loop=this.settings.loop;
      element.volume=0;element.src=this.settings.src;
      document.body.append(element);this.element=element;
    }
    const element=this.element;
    try{await element.play();}
    catch(error){if(generation===this.generation)throw error;return;}
    if(generation!==this.generation||this.disposed)return;
    void this.fade(this.settings.volume,this.settings.fadeInMs);
  }
  async pause(){
    const generation=++this.generation;this.cancelFade();
    const element=this.element;
    if(!element)return;
    if(document.hidden||element.paused){element.pause();element.volume=0;return;}
    await this.fade(0,this.settings.fadeOutMs);
    if(generation===this.generation){element.pause();element.volume=0;}
  }
  async dispose(){
    this.disposed=true;++this.generation;this.cancelFade();
    const element=this.element;this.element=null;
    if(element){element.pause();element.removeAttribute('src');element.load();element.remove();}
  }
}

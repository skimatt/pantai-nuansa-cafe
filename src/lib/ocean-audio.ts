/** Original synthetic ambience: no recording, license, request or autoplay. */
export class OceanAudio {
  private context:AudioContext|null=null;
  private source:AudioBufferSourceNode|null=null;
  private modulation:OscillatorNode|null=null;
  async play() {
    if(!this.context){
      const ctx=new AudioContext(); this.context=ctx;
      const length=ctx.sampleRate*8, buffer=ctx.createBuffer(1,length,ctx.sampleRate), data=buffer.getChannelData(0);
      let brown=0;
      for(let i=0;i<length;i++){brown=(brown+(.02*(Math.random()*2-1)))/1.02;data[i]=brown*3.5;}
      const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;
      const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=900;
      const gain=ctx.createGain();gain.gain.value=.13;
      const lfo=ctx.createOscillator();lfo.frequency.value=.12;
      const lfoGain=ctx.createGain();lfoGain.gain.value=.06;
      lfo.connect(lfoGain);lfoGain.connect(gain.gain);source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);
      source.start();lfo.start();this.source=source;this.modulation=lfo;
    }
    await this.context.resume();
  }
  async pause(){if(this.context?.state==='running')await this.context.suspend();}
  async dispose(){this.source?.stop();this.modulation?.stop();await this.context?.close();this.context=null;}
}

/** A cinematic tidal-stretch overlay. The NASA simulation remains unmodified. */
export function tidalIntro(video: HTMLVideoElement | null, reduced: boolean, returning: boolean): Promise<void> {
  const canvas=document.querySelector<HTMLCanvasElement>('[data-tidal]');
  const stage=document.querySelector<HTMLElement>('[data-gravity]');
  const button=document.querySelector<HTMLButtonElement>('[data-skip-intro]');
  const loader=document.querySelector<HTMLElement>('[data-loader]');
  const context=canvas?.getContext('2d');
  if(!canvas||!stage||!context||reduced||returning){if(button)button.hidden=true;return Promise.resolve();}
  const ctx=context, surface=canvas;
  const page=document.querySelector<HTMLElement>('[data-page]');
  page?.setAttribute('inert','');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  if(video && Number.isFinite(video.duration))video.currentTime=video.duration*.16;
  return new Promise(resolve=>{
    let frame=0,elapsed=0,last=performance.now(),done=false;
    const finish=()=>{
      if(done)return;done=true;cancelAnimationFrame(frame);
      media.removeEventListener('change',onReduced);button?.removeEventListener('click',finish);
      stage.dataset.phase='complete';ctx.clearRect(0,0,surface.width,surface.height);
      if(video){video.playbackRate=1;video.style.transform='';}
      surface.style.transform='';
      if(button)button.hidden=true;
      resolve();
    };
    const onReduced=()=>{if(media.matches)finish();};
    button?.addEventListener('click',finish);media.addEventListener('change',onReduced);
    const draw=(now:number)=>{
      if(done)return;
      const delta=Math.min((now-last)/1000,.1);last=now;
      if(!document.hidden)elapsed+=delta;
      if(elapsed>=9||loader?.dataset.state==='done'){finish();return;}
      frame=requestAnimationFrame(draw);
      if(document.hidden)return;
      const ratio=Math.min(devicePixelRatio,2);
      const width=stage.clientWidth,height=stage.clientHeight;
      if(surface.width!==Math.round(width*ratio)||surface.height!==Math.round(height*ratio)){
        surface.width=Math.round(width*ratio);surface.height=Math.round(height*ratio);
      }
      ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
      const approach=Math.min(1,Math.max(0,(elapsed-1.5)/6));
      stage.dataset.phase=elapsed<2?'approach':elapsed<7?'stretch':'crossing';
      const framing=`translate(${Math.sin(elapsed*.5)*5}px,${Math.sin(elapsed*.35)*3}px) scale(${1+approach*.22})`;
      surface.style.transform=framing;
      if(video)video.style.transform=framing;
      // Complete a meaningful camera arc, even as the approach slows down.
      // Never reduce the source to the nearly frozen rate of the old intro.
      if(video){
        const orbitRate=Number.isFinite(video.duration)?Math.min(4,Math.max(1,video.duration/12)):1.5;
        video.playbackRate=orbitRate*(1.1-approach*.25);
        if(video.paused)video.play().catch(()=>{});
      }
      const cx=width*.5,cy=height*.5;
      // Material parcels narrow tangentially and elongate radially near the shadow.
      for(let i=0;i<26;i++){
        const start=1.1+i*.155;
        const age=(elapsed-start)/4.2;
        if(age<0||age>1)continue;
        const theta=i*2.39996+age*1.35;
        const radius=(.54-.43*Math.pow(age,.68))*width;
        const stretch=Math.pow(age,2.1);
        const length=(2+stretch*width*.18);
        const thickness=Math.max(.35,2.4*(1-stretch));
        const alpha=Math.min(1,age*5)*Math.min(1,(1-age)*8)*.8;
        ctx.save();ctx.translate(cx+Math.cos(theta)*radius,cy+Math.sin(theta)*radius*.57);ctx.rotate(Math.atan2(Math.sin(theta)*.57,Math.cos(theta)));
        const glow=ctx.createLinearGradient(-length*.5,0,length*.5,0);
        glow.addColorStop(0,`rgba(255,196,130,0)`);glow.addColorStop(.45,`rgba(255,231,195,${alpha})`);glow.addColorStop(1,`rgba(181,211,255,0)`);
        ctx.fillStyle=glow;ctx.shadowColor='#f4b573';ctx.shadowBlur=5;ctx.beginPath();ctx.ellipse(0,0,length,thickness,0,0,Math.PI*2);ctx.fill();ctx.restore();
      }
      // Keep the black-hole shadow dark; don't paint streams over its center.
      ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(cx,cy,width*.07,0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation='source-over';
      if(elapsed>7){const fade=(9-elapsed)/2;surface.style.opacity=String(fade);}
      else surface.style.opacity='1';
    };
    frame=requestAnimationFrame(draw);
  });
}

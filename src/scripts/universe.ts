import * as THREE from 'three';
import { tidalIntro } from './tidal-intro';

// Every celestial body is geometry. No flattened hero image is downloaded.
export function startUniverse() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-universe]');
  if (!canvas || canvas.dataset.started) return;
  canvas.dataset.started = 'true';
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = media.matches;
  const root = document.documentElement;
  const reveal = () => {
    document.querySelector('[data-loader]')?.setAttribute('data-state', 'done');
    root.classList.add('is-revealed');
    document.querySelector('[data-page]')?.removeAttribute('inert');
  };
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    document.querySelector('[data-scene]')?.classList.add('scene--fallback');
    reveal(); return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.5 : 2));
  renderer.setClearColor(0x03060c, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, .1, 240);
  camera.position.set(0, 0, 15);
  const uniforms = { time: { value: 0 } };
  const vertex = `varying vec2 vUv;varying vec3 vNormal;varying vec3 vWorld;
    void main(){vUv=uv;vNormal=normalize(mat3(modelMatrix)*normal);vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
  const globe = new THREE.Group(); scene.add(globe);
  const earthMap = new THREE.Texture();
  earthMap.colorSpace = THREE.SRGBColorSpace;
  earthMap.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const planetMaterial = new THREE.ShaderMaterial({
    uniforms: { dayMap: { value: earthMap } },
    vertexShader: vertex,
    fragmentShader: `
      uniform sampler2D dayMap;varying vec2 vUv;varying vec3 vNormal;varying vec3 vWorld;
      void main(){
        vec3 normal=normalize(vNormal);
        vec3 light=normalize(vec3(-.55,.5,.85));
        float day=max(dot(normal,light),0.);
        vec3 color=texture2D(dayMap,vUv).rgb;
        color*=.012+day*1.22;
        float rim=pow(1.-max(dot(normalize(cameraPosition-vWorld),normal),0.),5.);
        color+=vec3(.025,.13,.32)*rim*pow(day,.4);
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(3.7, 128, 96), planetMaterial);
  earth.rotation.z = .12; globe.add(earth);
  const moonMap=new THREE.Texture();moonMap.colorSpace=THREE.SRGBColorSpace;moonMap.anisotropy=earthMap.anisotropy;
  const moonMaterial=new THREE.ShaderMaterial({
    uniforms:{moonMap:{value:moonMap}},vertexShader:vertex,
    fragmentShader:`uniform sampler2D moonMap;varying vec2 vUv;varying vec3 vNormal;
      void main(){float day=max(dot(normalize(vNormal),normalize(vec3(-.55,.5,.85))),0.);
      vec3 color=texture2D(moonMap,vUv).rgb*(.018+day*1.25);gl_FragColor=vec4(color,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
  });
  const moon=new THREE.Mesh(new THREE.SphereGeometry(1.0,64,48),moonMaterial);moon.visible=false;globe.add(moon);
  const cloudMap = new THREE.Texture();
  cloudMap.anisotropy = earthMap.anisotropy;
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(3.716,96,64),new THREE.ShaderMaterial({
    uniforms:{cloudMap:{value:cloudMap}},vertexShader:vertex,
    fragmentShader:`uniform sampler2D cloudMap;varying vec2 vUv;varying vec3 vNormal;
      void main(){float density=texture2D(cloudMap,vUv).r;float day=max(dot(normalize(vNormal),normalize(vec3(-.55,.5,.85))),0.);
      gl_FragColor=vec4(vec3(.96,.98,1.)*(.015+day*1.15),smoothstep(.12,.86,density)*.96);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`,transparent:true,depthWrite:false
  }));clouds.visible=false;globe.add(clouds);
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(3.735, 96, 64), new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: `varying vec3 vNormal;varying vec3 vWorld;
      void main(){vec3 n=normalize(vNormal);float rim=pow(1.-abs(dot(n,normalize(cameraPosition-vWorld))),4.);
      float lit=max(dot(n,normalize(vec3(-.55,.5,.85))),0.);
      gl_FragColor=vec4(.12,.4,.85,rim*(.08+lit*.38));}`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide
  })); globe.add(atmosphere);
  // A real volume of particles: the camera passes between stars on scroll.
  const count=innerWidth<700?1800:4200;
  let seed=91;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const positions=new Float32Array(count*3), phases=new Float32Array(count), sizes=new Float32Array(count);
  for(let i=0;i<count;i++){positions.set([(rand()-.5)*150,(rand()-.5)*100,15-rand()*160],i*3);phases[i]=rand()*6.28;sizes[i]=.6+rand()*2.5;}
  const starsGeometry=new THREE.BufferGeometry();starsGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));starsGeometry.setAttribute('phase',new THREE.BufferAttribute(phases,1));starsGeometry.setAttribute('size',new THREE.BufferAttribute(sizes,1));
  const stars=new THREE.Points(starsGeometry,new THREE.ShaderMaterial({
    uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`uniform float time;attribute float phase;attribute float size;varying float brightness;varying float tint;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);brightness=.55+.45*sin(time*.8+phase);tint=phase/6.28;gl_PointSize=clamp(size*95./max(1.,-mv.z),1.,7.);gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`varying float brightness;varying float tint;void main(){float d=length(gl_PointCoord-.5)*2.;float a=pow(max(0.,1.-d),2.);vec3 c=mix(vec3(.5,.72,1.),vec3(1.,.83,.61),tint);gl_FragColor=vec4(c,a*brightness);}`
  }));scene.add(stars);
  const comets=Array.from({length:3},(_,i)=>{
    const pos=new Float32Array(40*3),colors=new Float32Array(40*3);
    for(let j=0;j<40;j++){const b=Math.pow(1-j/40,2);colors.set([b*.5,b*.8,b],j*3);}
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(pos,3));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
    const line=new THREE.Line(geometry,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(line);return {line,pos,offset:i*5.3};
  });
  let introStart=-1,ready=false,returning=false;
  try{returning=sessionStorage.getItem('av:tidal-arrived-v2')==='1';}catch{}
  const video = document.querySelector<HTMLVideoElement>('[data-black-hole]');
  if (reduced || returning) video?.pause();
  else video?.play().catch(() => {});
  const videoReady = !video || returning ? Promise.resolve() : new Promise<void>((resolve) => {
    if(video.readyState>=2){if(reduced)video.pause();resolve();return;}
    const done=()=>{clearTimeout(timer);video.removeEventListener('loadeddata',done);video.removeEventListener('error',done);if(reduced)video.pause();resolve();};
    const timer=setTimeout(done,3000);
    video.addEventListener('loadeddata',done,{once:true});video.addEventListener('error',done,{once:true});
  });
  const cinematic = videoReady.then(()=>tidalIntro(video,reduced,returning));
  const progress=(n:number)=>{
    const b=document.querySelector<HTMLElement>('[data-loader-bar]');if(b)b.style.width=n+'%';
    const t=document.querySelector('[data-loader-value]');if(t)t.textContent=n+'%';
    if(n===100){const label=document.querySelector('.loader__label');if(label)label.textContent=root.lang==='en'?'Crossing the horizon':'Atravesando el horizonte';}
  };
  const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}; resize();
  window.addEventListener('resize',resize);
  let scroll=0,elapsed=0,last=performance.now(),frame=0;
  const pointer=new THREE.Vector2();
  window.addEventListener('pointermove',e=>{pointer.set(e.clientX/innerWidth-.5,e.clientY/innerHeight-.5);},{passive:true});
  media.addEventListener('change',()=>{reduced=media.matches;if(reduced)video?.pause();});
  const animate=(now:number)=>{
    frame=requestAnimationFrame(animate);
    const dt=Math.min((now-last)/1000,.05);last=now;
    if(document.hidden)return;
    if(!reduced)elapsed+=dt;
    uniforms.time.value=elapsed;
    const target=Math.min(1,window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight));
    scroll+= (target-scroll)*(1-Math.exp(-dt*5));
    const entrance=ready?(reduced||returning?1:THREE.MathUtils.smoothstep((now-introStart)/1700,0,1)):0;
    const mobile=innerWidth<700;
    camera.position.set(reduced?0:scroll*2+pointer.x*.15, reduced?0:Math.sin(scroll*Math.PI)*1.4-pointer.y*.1,15-(reduced?0:scroll*49));
    camera.lookAt(camera.position.x*.4,0,camera.position.z-20);
    globe.position.set(mobile?3.1:6.2,mobile?-4.1:-1.2,-2);
    globe.scale.setScalar(entrance*(mobile?1:1.4));
    earth.rotation.y=5.2+elapsed*.025;
    clouds.rotation.set(earth.rotation.x,earth.rotation.y+elapsed*.003,earth.rotation.z);
    const lunarAngle=2.05+elapsed*.035;
    moon.position.set(Math.cos(lunarAngle)*6.3,Math.sin(lunarAngle)*(mobile?1:2.9),Math.sin(lunarAngle)*4.4);
    moon.lookAt(globe.position);
    canvas.dataset.moon=moon.visible?'ready':'loading';
    canvas.dataset.moonOrbit=lunarAngle.toFixed(3);
    for(const c of comets){const phase=(elapsed+c.offset)%16; c.line.visible=!reduced&&entrance>.95&&phase<3.5;
      for(let j=0;j<40;j++){const t=phase-j*.018;c.pos.set([16-t*12,9-t*4,-18-c.offset*2],j*3);}c.line.geometry.attributes.position.needsUpdate=true;}
    canvas.dataset.travel=scroll.toFixed(3);
    canvas.dataset.rotation=earth.rotation.y.toFixed(3);
    document.querySelectorAll<HTMLElement>('[data-travel-progress]').forEach(el=>el.textContent=Math.round(scroll*100).toString().padStart(3,'0'));
    renderer.render(scene,camera);
  };
  // Earth is built from NASA satellite imagery; progress is bytes + decode + GPU.
  const finish=async()=>{
    await cinematic;
    if(ready)return;
    ready=true;introStart=performance.now();
    try{sessionStorage.setItem('av:tidal-arrived-v2','1');}catch{}
    reveal();canvas.dataset.ready='true';
    setTimeout(()=>video?.pause(),700);
  };
  const controller=new AbortController();
  const timeout=setTimeout(()=>{controller.abort();finish();},7000);
  progress(5);animate(performance.now());
  const moonReady=fetch('/textures/moon-lroc.webp',{signal:controller.signal}).then(async res=>{
    if(!res.ok)throw new Error('Moon texture unavailable');
    const url=URL.createObjectURL(await res.blob());
    try{const img=new Image();img.src=url;await img.decode();moonMap.image=img;moonMap.needsUpdate=true;moon.visible=true;}
    finally{URL.revokeObjectURL(url);}
  }).catch(()=>{moon.visible=false;});
  const cloudReady=fetch('/textures/earth-clouds.webp',{signal:controller.signal}).then(async res=>{
    if(!res.ok)throw new Error('Cloud texture unavailable');
    const url=URL.createObjectURL(await res.blob());
    try{const img=new Image();img.src=url;await img.decode();cloudMap.image=img;cloudMap.needsUpdate=true;clouds.visible=true;}
    finally{URL.revokeObjectURL(url);}
  }).catch(()=>{clouds.visible=false;});
  const loadEarth=async()=>{
    const res=await fetch('/textures/earth-blue-marble.webp',{signal:controller.signal});
    if(!res.ok)throw new Error('Earth texture unavailable');
    const total=Number(res.headers.get('content-length'));
    let blob:Blob;
    if(res.body && total>0){
      const reader=res.body.getReader();const chunks:BlobPart[]=[];let received=0;
      for(;;){const item=await reader.read();if(item.done)break;chunks.push(item.value as BlobPart);received+=item.value.length;progress(Math.min(80,5+Math.floor(received/total*75)));}
      blob=new Blob(chunks,{type:'image/webp'});
    }else{blob=await res.blob();progress(80);}
    const url=URL.createObjectURL(blob);
    try{const img=new Image();img.src=url;await img.decode();earthMap.image=img;earthMap.needsUpdate=true;}finally{URL.revokeObjectURL(url);}
    progress(85);await Promise.all([cloudReady,moonReady]);await renderer.compileAsync(scene,camera);progress(95);await Promise.all([document.fonts.ready,videoReady]);
    progress(100);clearTimeout(timeout);finish();
  };
  loadEarth().catch(()=>{clearTimeout(timeout);globe.visible=false;canvas.dataset.texture='failed';finish();});
  document.addEventListener('astro:after-swap',()=>{document.documentElement.classList.add('is-revealed','is-instant');});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);document.querySelector('[data-scene]')?.classList.add('scene--fallback');reveal();});
}

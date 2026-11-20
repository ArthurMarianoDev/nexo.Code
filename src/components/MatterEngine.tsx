import { useEffect, useRef, useState } from "react"

/**
 * Nexo DNA Matter Engine 4.0.
 * A continuous procedural double-helix sculpture persists across the experience.
 * The geometry, cinematic camera, material balance and lighting respond to
 * chapters, with one bounded WebGL2 canvas and an accessible SVG fallback.
 */
const vertex = `#version 300 es
in vec2 aPosition;
out vec2 uv;
void main(){uv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}
`

const fragment = \`#version 300 es
precision highp float;
in vec2 uv;
out vec4 outColor;
uniform vec2 uRes;
uniform vec2 uPointer;
uniform float uTime;
uniform float uScroll;
uniform float uScene;
uniform float uPackage;
uniform float uTransition;
uniform float uQuality;

#define PI 3.14159265359
mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
float capsule(vec3 p,vec3 a,vec3 b,float r){
  vec3 q=p-a,v=b-a;
  return length(q-v*clamp(dot(q,v)/dot(v,v),0.,1.))-r;
}
vec2 helixPoint(float y,float phase){
  float a=y*4.72+phase;
  float rad=.83+.018*sin(y*3.1+uTime*.37);
  return rad*vec2(cos(a),sin(a));
}
vec3 twistSpace(vec3 p){
  // A cinematic 3D pose, never a flat composited image.
  p.xy*=rot(-.23+.09*sin(uTime*.17)+uPointer.y*.055);
  p.yz*=rot(.14+uPointer.x*.045);
  p.xz*=rot(.30+uTime*.19+uScroll*2.2+uPointer.x*.24);
  return p;
}
vec3 dna(vec3 world){
  vec3 p=twistSpace(world);
  float phase=.08+sin(uTime*.29)*.14+uScene*.045;
  float edge=abs(p.y)-1.69;
  // Distance to two continuous twisted backbone tubes.
  vec2 h1=helixPoint(p.y,phase);
  vec2 h2=-h1;
  float backboneA=max(length(p.xz-h1)-.059,edge);
  float backboneB=max(length(p.xz-h2)-.059,edge);
  // Base-pairs: individual fine cylindrical bridges, not a painted texture.
  const float spacing=.225;
  float rung=1e3;
  float center=floor(p.y/spacing+.5);
  for(int i=-1;i<=1;i++){
    float y=(center+float(i))*spacing;
    vec2 endPoint=helixPoint(y,phase);
    float bar=capsule(p,vec3(endPoint.x,y,endPoint.y),vec3(-endPoint.x,y,-endPoint.y),.024);
    rung=min(rung,max(bar,abs(y)-1.64));
  }
  // Slightly wider core of the backbone catches the luminous rim light.
  float d=min(min(backboneA,backboneB),rung);
  float material=backboneA<backboneB?1.:2.;
  if(rung<min(backboneA,backboneB)) material=3.;
  return vec3(d,material,p.y);
}
vec3 normalAt(vec3 p){
  vec2 e=vec2(.004,0.);
  return normalize(vec3(
    dna(p+e.xyy).x-dna(p-e.xyy).x,
    dna(p+e.yxy).x-dna(p-e.yxy).x,
    dna(p+e.yyx).x-dna(p-e.yyx).x
  ));
}
float trace(vec3 ro,vec3 rd,out vec3 hit,out float material){
  float t=.08;
  for(int i=0;i<82;i++){
    hit=ro+rd*t;
    vec3 result=dna(hit);
    if(result.x<.0035){material=result.y;return t;}
    t+=max(result.x*.53,.011);
    if(t>8.2)break;
  }
  return -1.;
}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);
  vec3 camera=vec3(.13+uPointer.x*.15,.05-uPointer.y*.11,4.55-.17*sin(uScroll*PI));
  vec3 forward=normalize(-camera);
  vec3 right=normalize(cross(forward,vec3(0.,1.,0.)));
  vec3 up=cross(right,forward);
  vec3 ray=normalize(forward*2.1+right*p.x+up*p.y);
  vec3 pos=vec3(0.);
  float material=0.;
  float hit=trace(camera,ray,pos,material);

  vec3 background=mix(vec3(.010,.020,.028),vec3(.018,.047,.049),clamp(uv.y*.85,0.,1.));
  background+=vec3(.009,.018,.015)*exp(-dot(p-vec2(.05,.06),p-vec2(.05,.06))*3.3);
  vec3 color=background;
  if(hit>0.){
    vec3 n=normalAt(pos);
    vec3 view=normalize(camera-pos);
    vec3 key=normalize(vec3(-.68,.95,1.4)+vec3(uPointer*.12,0.));
    vec3 fill=normalize(vec3(1.0,-.3,-.8));
    float diffuse=max(dot(n,key),0.);
    float fillLight=max(dot(n,fill),0.);
    float fresnel=pow(1.-clamp(dot(n,view),0.,1.),2.3);
    float spec=pow(max(dot(reflect(-key,n),view),0.),42.);
    float softSpec=pow(max(dot(reflect(-fill,n),view),0.),17.);

    vec3 cyan=vec3(.28,.84,1.);
    vec3 lime=vec3(.68,1.,.26);
    vec3 bridge=vec3(.36,.83,.77);
    float gradient=smoothstep(-1.55,1.53,pos.y+.3*sin(uTime*.28));
    vec3 tint=material>2.5?bridge:(material<1.5?mix(cyan,lime,gradient*.9):mix(lime,cyan,gradient*.78));
    float metallic=material>2.5?.65:1.;
    vec3 shadow=tint*(.10+.52*diffuse+.18*fillLight);
    vec3 lit=shadow+tint*fresnel*(.92*metallic)+vec3(.8,1.,.94)*spec*.8+cyan*softSpec*.16;
    // Restrained emission, more intense on the outer strands than the rungs.
    lit+=tint*(material>2.5?.17:.30);
    float fog=1.-exp(-hit*.012);
    color=mix(lit/(lit+vec3(.38)),background,clamp(fog,0.,.3));
  }
  // Subtle optical bloom, staying dark enough for readable editorial typography.
  float aurora=exp(-dot(p-vec2(.12,.0),p-vec2(.12,.0))*2.25);
  color+=mix(vec3(.014,.065,.072),vec3(.033,.09,.038),.5+.5*sin(uTime*.15))*aurora*.34;
  color+=vec3(.06,.13,.055)*uTransition*.23;
  float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
  color+=(grain-.5)*.0045;
  outColor=vec4(pow(clamp(color,0.,1.),vec3(.94)),1.);
}
\`

type Chapter = {
  name: string
  element: Element
  phase: number
}
const chapterSelectors = [
  ["hero", "#inicio", 0],
  ["interlude", ".kinetic-interlude", .7],
  ["lab", "#laboratorio", 1.5],
  ["services", "#servicos", 2.5],
  ["manifesto", "#diferenciais", 3.4],
  ["process", "#processo", 4.1],
  ["about", "#sobre", 4.9],
  ["contact", "#contato", 5.7],
  ["store", ".store-hero", 6],
  ["products", ".pricing-grid", 6.5],
] as const

function compile(gl: WebGL2RenderingContext,kind:number,source:string){
  const shader=gl.createShader(kind)
  if(!shader)return null
  gl.shaderSource(shader,source)
  gl.compileShader(shader)
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
    console.warn("Nexo Matter Engine shader:",gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function MatterEngine(){
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const rootRef=useRef<HTMLDivElement>(null)
  const [fallback,setFallback]=useState(false)

  useEffect(()=>{
    const canvas=canvasRef.current
    const root=rootRef.current
    if(!canvas || !root)return
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      setFallback(true)
      return
    }
    const gl=canvas.getContext("webgl2",{alpha:false,antialias:false,powerPreference:"low-power",depth:false})
    if(!gl){setFallback(true);return}
    const vs=compile(gl,gl.VERTEX_SHADER,vertex)
    const fs=compile(gl,gl.FRAGMENT_SHADER,fragment)
    if(!vs||!fs){if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);setFallback(true);return}
    const program=gl.createProgram()
    if(!program){gl.deleteShader(vs);gl.deleteShader(fs);setFallback(true);return}
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program)
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
      console.warn("Nexo Matter Engine link:",gl.getProgramInfoLog(program))
      gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);setFallback(true);return
    }
    gl.useProgram(program)
    const vertexArray=gl.createVertexArray()
    gl.bindVertexArray(vertexArray)
    const buffer=gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW)
    const location=gl.getAttribLocation(program,"aPosition")
    gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0)
    const uRes=gl.getUniformLocation(program,"uRes"),uPointer=gl.getUniformLocation(program,"uPointer")
    const uTime=gl.getUniformLocation(program,"uTime"),uScroll=gl.getUniformLocation(program,"uScroll")
    const uScene=gl.getUniformLocation(program,"uScene"),uPackage=gl.getUniformLocation(program,"uPackage")
    const uTransition=gl.getUniformLocation(program,"uTransition"),uQuality=gl.getUniformLocation(program,"uQuality")
    let raf=0,running=true,last=0,seconds=0,scene=0,sceneTarget=0,progress=0,progressTarget=0
    let mx=0,my=0,mxTarget=0,myTarget=0,packageTarget=1,packageMix=1,transitionTarget=0,transitionMix=0
    let chapters:Chapter[]=[]
    const isSmall=matchMedia("(max-width: 820px)").matches
    const reduceQuality=isSmall || (navigator.hardwareConcurrency!==undefined && navigator.hardwareConcurrency<=4)
    const redraw=()=>{
      chapters=chapterSelectors.flatMap(([name,selector,phase])=>{
        const element=document.querySelector(selector)
        return element?[{name,element,phase}]:[]
      })
    }
    const resize=()=>{
      const rect=canvas.getBoundingClientRect()
      const dpr=Math.min(devicePixelRatio||1,reduceQuality?1:1.5)
      const cap=reduceQuality?520:1050
      const ratio=Math.min(1,cap/Math.max(1,rect.width*dpr))
      const width=Math.max(2,Math.floor(rect.width*dpr*ratio))
      const height=Math.max(2,Math.floor(rect.height*dpr*ratio))
      if(canvas.width!==width||canvas.height!==height){
        canvas.width=width;canvas.height=height
        gl.viewport(0,0,width,height)
      }
    }
    const locate=()=>{
      if(!chapters.length)redraw()
      let distance=Infinity,found=0,chapter="hero"
      const mid=innerHeight*.48
      for(const item of chapters){
        const rect=item.element.getBoundingClientRect()
        const delta=Math.abs(rect.top+rect.height*.5-mid)
        if(delta<distance){distance=delta;found=item.phase;chapter=item.name}
      }
      sceneTarget=found
      root.dataset.chapter=chapter
      const maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight)
      progressTarget=Math.max(0,Math.min(1,scrollY/maxScroll))
    }
    const pointer=(event:PointerEvent)=>{
      if(event.pointerType==="touch")return
      mxTarget=Math.max(-1,Math.min(1,event.clientX/innerWidth*2-1))
      myTarget=Math.max(-1,Math.min(1,event.clientY/innerHeight*2-1))
    }
    const packageChange=(event:Event)=>{packageTarget=Math.max(0,Math.min(2,(event as CustomEvent<number>).detail))}
    const transitionChange=(event:Event)=>{transitionTarget=(event as CustomEvent<string>).detail==="idle"?0:1}
    const onRoute=()=>{redraw();locate()}
    const frame=(now:number)=>{
      if(!running)return
      raf=requestAnimationFrame(frame)
      if(document.hidden)return
      if(now-last<(reduceQuality?55:32))return
      const dt=last?Math.min((now-last)/1000,.06):.033
      last=now;seconds+=dt
      scene+=(sceneTarget-scene)*.065
      progress+=(progressTarget-progress)*.06
      mx+=(mxTarget-mx)*.08;my+=(myTarget-my)*.08
      packageMix+=(packageTarget-packageMix)*.085
      transitionMix+=(transitionTarget-transitionMix)*.15
      resize()
      gl.useProgram(program)
      gl.uniform2f(uRes,canvas.width,canvas.height)
      gl.uniform2f(uPointer,mx,my)
      gl.uniform1f(uTime,seconds)
      gl.uniform1f(uScroll,progress)
      gl.uniform1f(uScene,scene)
      gl.uniform1f(uPackage,packageMix)
      gl.uniform1f(uTransition,transitionMix)
      gl.uniform1f(uQuality,reduceQuality?0:1)
      gl.drawArrays(gl.TRIANGLES,0,6)
    }
    const refresh=()=>{redraw();locate();resize()}
    const route=()=>{requestAnimationFrame(onRoute)}
    const lost=(event:Event)=>{event.preventDefault();running=false;cancelAnimationFrame(raf);setFallback(true)}
    window.addEventListener("scroll",locate,{passive:true})
    window.addEventListener("resize",refresh,{passive:true})
    window.addEventListener("pointermove",pointer,{passive:true})
    window.addEventListener("nexo:package-change",packageChange)
    window.addEventListener("nexo:transition",transitionChange)
    window.addEventListener("nexo:route-change",route)
    canvas.addEventListener("webglcontextlost",lost)
    const observer=new MutationObserver(()=>{redraw();locate()})
    observer.observe(document.getElementById("root")??document.body,{childList:true,subtree:false})
    refresh()
    raf=requestAnimationFrame(frame)
    return()=>{
      running=false;cancelAnimationFrame(raf);observer.disconnect()
      window.removeEventListener("scroll",locate)
      window.removeEventListener("resize",refresh)
      window.removeEventListener("pointermove",pointer)
      window.removeEventListener("nexo:package-change",packageChange)
      window.removeEventListener("nexo:transition",transitionChange)
      window.removeEventListener("nexo:route-change",route)
      canvas.removeEventListener("webglcontextlost",lost)
      gl.deleteBuffer(buffer);if(vertexArray)gl.deleteVertexArray(vertexArray)
      gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs)
    }
  },[])

  return <div className={`matter-engine ${fallback?"matter-engine--fallback":""}`} ref={rootRef} data-chapter="hero" aria-hidden="true">
    <canvas ref={canvasRef}/>
    <div className="matter-engine__fallback-art"><svg viewBox="0 0 340 540" role="presentation" focusable="false"><defs><linearGradient id="dna-backbone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#86d9ff"/><stop offset="100%" stopColor="#b9ff4f"/></linearGradient></defs>{Array.from({length:23},(_,i)=>{const y=35+i*21;const t=i*.39;const x=170+90*Math.sin(t);return <line key={i} x1={x} y1={y} x2={340-x} y2={y} stroke="#73dfd7" strokeWidth="3" opacity=".65"/>})}<path d={Array.from({length:125},(_,i)=>{const y=12+i*4.2;return `${i===0?"M":"L"} ${170+90*Math.sin(i*.088)} ${y}`}).join(" ")} fill="none" stroke="url(#dna-backbone)" strokeWidth="8" strokeLinecap="round"/><path d={Array.from({length:125},(_,i)=>{const y=12+i*4.2;return `${i===0?"M":"L"} ${170-90*Math.sin(i*.088)} ${y}`}).join(" ")} fill="none" stroke="url(#dna-backbone)" strokeWidth="8" strokeLinecap="round"/></svg></div>
    <div className="matter-engine__annotation">N/C — DNA ENGINE 004</div>
  </div>
}

import { useEffect, useRef, useState } from "react"

/**
 * Nexo Matter Engine 3.0.
 * A single original procedural sculpture persists across the entire experience.
 * The geometry, cinematic camera, material balance and lighting morph between
 * chapters, with one bounded WebGL2 canvas and a CSS-only fallback.
 */
const vertex = `#version 300 es
in vec2 aPosition;
out vec2 uv;
void main(){uv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}
`

const fragment = `#version 300 es
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
float torus(vec3 p,vec2 t){return length(vec2(length(p.xz)-t.x,p.y))-t.y;}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float form(vec3 p){
  // The scene changes from closed orbital geometry to open liquid ribbons.
  float sequence=smoothstep(0.,6.,uScene);
  float lab=smoothstep(.3,1.6,uScene)*(1.-smoothstep(1.9,2.8,uScene));
  float market=smoothstep(5.1,6.,uScene);
  float time=uTime*.21;
  p.xz*=rot(.26+uScroll*2.55+uPointer.x*.19+time*.21);
  p.xy*=rot(-.17+uPointer.y*.17+uScroll*1.4);
  p.yz*=rot(.5+sin(time*.53)*.14+uScene*.13);
  float ring=torus(p,vec2(1.04+.07*sin(time+p.y*4.),.225));
  vec3 q=p;
  q.xy*=rot(.87+uScene*.2);
  q.yz*=rot(1.28+.14*sin(time));
  float ribbon=torus(q,vec2(.77+.08*sin(q.x*3.+time),.20));
  vec3 r=p;
  r.xz*=rot(-.72+uScene*.23);
  r.yz*=rot(1.62);
  float orbit=torus(r,vec2(.90,.15+.025*sin(5.*r.x-time)));
  float blend=.28+lab*.36+market*.2;
  float shape=smin(smin(ring,ribbon,blend),orbit,.23+sequence*.10);
  // Evolving organic displacement, smooth to keep surface reflections stable.
  float displacement=.035*sin(7.*p.x+time*1.2)*sin(6.*p.z-time*.9);
  displacement+=.024*sin(p.y*12.+uScroll*12.)*sin(p.x*8.);
  shape+=displacement*(.68+lab*.65);
  // Store selections create three distinct sculptural silhouettes.
  float landing=1.-smoothstep(.0,.55,uPackage);
  float premium=smoothstep(1.4,2.,uPackage);
  shape+=market*(landing*.055*sin(9.*p.y)+premium*.07*sin(10.*p.x+time));
  return shape;
}
vec3 getNormal(vec3 p){
  vec2 e=vec2(.004,0.);
  return normalize(vec3(
    form(p+e.xyy)-form(p-e.xyy),
    form(p+e.yxy)-form(p-e.yxy),
    form(p+e.yyx)-form(p-e.yyx)
  ));
}
float march(vec3 ro,vec3 rd,out vec3 position){
  float t=.03;
  for(int i=0;i<60;i++){
    position=ro+rd*t;
    float d=form(position);
    if(d<.0038)return t;
    t+=max(d*.66,.018);
    if(t>9.5)break;
  }
  return -1.;
}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);
  vec2 mouse=uPointer;
  // Camera dolly and slight orbit tell the same continuous scroll story.
  float cameraPhase=uScroll*PI*1.6+uScene*.12;
  vec3 camera=vec3(.26*sin(cameraPhase)+mouse.x*.22,.1+mouse.y*.15,4.3-.4*sin(uScroll*PI));
  vec3 target=vec3(0.);
  vec3 forward=normalize(target-camera);
  vec3 right=normalize(cross(forward,vec3(0.,1.,0.)));
  vec3 up=cross(right,forward);
  vec3 direction=normalize(forward*2.28+right*p.x+up*p.y);
  vec3 hitPosition=vec3(0.);
  float hit=march(camera,direction,hitPosition);
  float sceneMood=smoothstep(1.0,4.5,uScene);
  vec3 graphite=vec3(.026,.048,.054);
  vec3 background=mix(graphite,vec3(.025,.075,.066),clamp(uv.y*.75+.1,0.,1.));
  background+=vec3(.011,.022,.018)*sin(p.x*4.+uTime*.12);
  vec3 finalColor=background;
  if(hit>0.){
    vec3 n=getNormal(hitPosition);
    vec3 view=normalize(camera-hitPosition);
    vec3 keyLight=normalize(vec3(-.6,.83,1.4)+vec3(mouse*.24,0.));
    vec3 rimLight=normalize(vec3(.9,-.55,-.25));
    float lit=max(dot(n,keyLight),0.);
    float cool=max(dot(n,rimLight),0.);
    float fresnel=pow(1.-clamp(dot(n,view),0.,1.),3.4);
    float halfSpec=pow(max(dot(reflect(-keyLight,n),view),0.),51.);
    float wideSpec=pow(max(dot(reflect(-rimLight,n),view),0.),13.);
    float groove=.5+.5*sin(hitPosition.y*4.9+hitPosition.x*3.3+uTime*.15);
    vec3 green=vec3(.71,1.,.29);
    vec3 cyan=vec3(.40,.85,1.);
    vec3 tint=mix(cyan,green,smoothstep(.14,.9,groove+sceneMood*.10));
    // Pseudo-transmission across a semi-opaque material with volumetric rim.
    float transmission=pow(1.-abs(dot(n,view)),1.8);
    vec3 interior=mix(vec3(.025,.095,.103),tint*.42,lit*.5+.2);
    vec3 reflection=vec3(.93,1.,.86)*halfSpec*1.25+cyan*wideSpec*.38;
    finalColor=interior*(.28+lit*.96)+tint*fresnel*1.04+
      reflection+cyan*cool*.13+tint*transmission*.38;
    finalColor+=vec3(.26,.55,.40)*pow(max(dot(n,vec3(.0,-1.,.0)),0.),3.)*.19;
    finalColor=finalColor/(finalColor+vec3(.66));
  }
  float atmosphericGlow=exp(-length(p-vec2(.08,-.01))*2.65)*.035;
  finalColor+=vec3(.20,.72,.53)*atmosphericGlow;
  float filmGrain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
  finalColor+=(filmGrain-.5)*.009;
  // A transition becomes a sculptural light event, not just a flat overlay.
  finalColor+=vec3(.1,.17,.07)*uTransition*.32;
  outColor=vec4(pow(clamp(finalColor,0.,1.),vec3(.91)),1.);
}
`

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
      const dpr=Math.min(devicePixelRatio||1,reduceQuality?1:1.35)
      const cap=reduceQuality?480:850
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
    <div className="matter-engine__fallback-art"><span/><span/><span/></div>
    <div className="matter-engine__annotation">N/C — MATTER ENGINE 003</div>
  </div>
}

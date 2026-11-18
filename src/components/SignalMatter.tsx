import { useEffect, useRef, useState } from "react"

/**
 * Nexo.Code / Signal Matter
 * Original procedural WebGL artwork. No remote assets or animation libraries.
 * Reduced motion, graphics failures and low-power devices receive a CSS fallback.
 */
const vertex = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() { vUv = aPosition * .5 + .5; gl_Position = vec4(aPosition, 0., 1.); }
`

const fragment = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uScroll;

float sph(vec3 p, float r) { return length(p)-r; }
float tor(vec3 p, vec2 t) { return length(vec2(length(p.xz)-t.x,p.y))-t.y; }
mat2 rot(float a) { float s=sin(a), c=cos(a); return mat2(c,-s,s,c); }
float smin(float a,float b,float k){float h=max(k-abs(a-b),0.)/k;return min(a,b)-h*h*k*.25;}
float scene(vec3 p) {
  p.xy *= rot(.22 + sin(uTime*.16)*.10 + uPointer.x*.22);
  p.yz *= rot(uTime*.09 + uPointer.y*.16);
  vec3 q=p;
  q.xy *= rot(.64);
  q.xz *= rot(.43);
  float wave=sin(5.3*q.x+uTime*.41)*sin(4.7*q.z-uTime*.27)*.13;
  float shell=tor(q,vec2(1.12,.31+wave));
  vec3 r=p;
  r.yz*=rot(1.24);
  r.xz*=rot(-.67);
  float loop=tor(r,vec2(.92,.24+sin(r.x*5.+uTime*.35)*.07));
  vec3 s=p;
  s.xz*=rot(-.8);
  s.xy*=rot(1.17);
  float ribbon=tor(s,vec2(.72,.22+sin(s.z*6.-uTime*.4)*.06));
  float form=smin(shell,loop,.42);
  form=smin(form,ribbon,.3);
  form+=.025*sin(12.*p.x+uTime*.3)*sin(11.*p.y);
  return form;
}
vec3 normal(vec3 p) {
  vec2 e=vec2(.003,0.);
  return normalize(vec3(
    scene(p+e.xyy)-scene(p-e.xyy),
    scene(p+e.yxy)-scene(p-e.yxy),
    scene(p+e.yyx)-scene(p-e.yyx)));
}
void main() {
  vec2 uv=(gl_FragCoord.xy-.5*uResolution)/min(uResolution.x,uResolution.y);
  vec3 ro=vec3(0.,0.,4.8);
  vec3 rd=normalize(vec3(uv*1.08,-2.35));
  float t=0.;
  float hit=-1.;
  for(int i=0;i<66;i++){
    vec3 p=ro+rd*t;
    float d=scene(p);
    if(d<.004){hit=t;break;}
    t+=max(d*.7,.025);
    if(t>9.)break;
  }
  float vig=1.-smoothstep(.15,1.4,length(uv));
  vec3 bg=mix(vec3(.025,.047,.047),vec3(.04,.075,.057),vUv.y);
  bg+=vec3(.006,.02,.012)*vig;
  vec3 col=bg;
  if(hit>0.){
    vec3 p=ro+rd*hit;
    vec3 n=normal(p);
    vec3 light=normalize(vec3(-.65,.9,1.6));
    vec3 secondary=normalize(vec3(.9,-.2,.8));
    float diff=max(dot(n,light),0.);
    float rim=pow(1.-max(dot(n,-rd),0.),3.);
    float spec=pow(max(dot(reflect(-light,n),-rd),0.),38.);
    float spec2=pow(max(dot(reflect(-secondary,n),-rd),0.),22.);
    float bands=.5+.5*sin(p.y*5.+p.x*3.+uTime*.27);
    vec3 acid=vec3(.71,1.,.24);
    vec3 teal=vec3(.08,.70,.74);
    vec3 base=mix(teal,acid,smoothstep(.15,.85,bands));
    vec3 metal=mix(vec3(.025,.12,.105),base,.45+diff*.33);
    col=metal*(.26+diff*.9);
    col+=base*rim*1.12+vec3(.82,1.,.73)*spec*.82+teal*spec2*.36;
    col+=vec3(.04,.09,.08)*pow(max(dot(n,vec3(0.,-1.,0.)),0.),3.);
    col=col/(col+vec3(.65));
  }
  float halo=exp(-length(uv-vec2(.07,-.03))*2.9)*.048;
  col+=vec3(.25,.6,.3)*halo;
  // Dot-screen signature is subtle, not a decorative particle field.
  float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-.5)*.011;
  fragColor=vec4(pow(col,vec3(.91)),1.);
}
`

function compile(gl: WebGL2RenderingContext, kind: number, source: string) {
  const shader = gl.createShader(kind)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function SignalMatter() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, powerPreference: "low-power" })
    if (!gl) { setFallback(true); return }

    const vs=compile(gl,gl.VERTEX_SHADER,vertex)
    const fs=compile(gl,gl.FRAGMENT_SHADER,fragment)
    if(!vs||!fs){setFallback(true);return}
    const program=gl.createProgram()
    if(!program){setFallback(true);return}
    gl.attachShader(program,vs)
    gl.attachShader(program,fs)
    gl.linkProgram(program)
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){setFallback(true);return}
    gl.useProgram(program)
    const buffer=gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW)
    const pos=gl.getAttribLocation(program,"aPosition")
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0)
    const resolution=gl.getUniformLocation(program,"uResolution")
    const pointer=gl.getUniformLocation(program,"uPointer")
    const time=gl.getUniformLocation(program,"uTime")
    const scroll=gl.getUniformLocation(program,"uScroll")
    let x=0,y=0,targetX=0,targetY=0,elapsed=0,last=0,raf=0,visible=true
    let running=true
    const resize=()=>{
      const rect=canvas.getBoundingClientRect()
      const dpr=Math.min(window.devicePixelRatio||1,1.15)
      // Keep WebGL work bounded on mobile or integrated GPUs.
      const scale=Math.min(1,760/Math.max(rect.width*dpr,1))
      const w=Math.max(1,Math.floor(rect.width*dpr*scale))
      const h=Math.max(1,Math.floor(rect.height*dpr*scale))
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
    }
    const move=(e:PointerEvent)=>{
      const rect=section.getBoundingClientRect()
      targetX=((e.clientX-rect.left)/Math.max(rect.width,1)- .5)*2
      targetY=((e.clientY-rect.top)/Math.max(rect.height,1)- .5)*2
    }
    const frame=(now:number)=>{
      if(!running)return
      raf=window.requestAnimationFrame(frame)
      if(!visible || document.hidden)return
      if(!reduceMotion && now-last<32)return
      const delta=last?Math.min((now-last)/1000,.05):0
      last=now
      if(!reduceMotion)elapsed+=delta
      x+=(targetX-x)*.045;y+=(targetY-y)*.045
      resize()
      gl.uniform2f(resolution,canvas.width,canvas.height)
      gl.uniform2f(pointer,x,y)
      gl.uniform1f(time,elapsed)
      gl.uniform1f(scroll,Math.min(window.scrollY/1200,1))
      gl.drawArrays(gl.TRIANGLES,0,6)
      if(reduceMotion){window.cancelAnimationFrame(raf);raf=0}
    }
    const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false},{rootMargin:"200px"})
    io.observe(section)
    section.addEventListener("pointermove",move,{passive:true})
    window.addEventListener("resize",resize,{passive:true})
    raf=window.requestAnimationFrame(frame)
    return()=>{
      running=false
      window.cancelAnimationFrame(raf)
      io.disconnect()
      section.removeEventListener("pointermove",move)
      window.removeEventListener("resize",resize)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return (
    <div className={`signal-matter ${fallback ? "signal-matter--fallback" : ""}`} ref={sectionRef}
      role="img" aria-label="Escultura digital abstrata Nexo.Code, formada por três fitas orgânicas de luz verde e azul">
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="signal-matter__fallback-shape" aria-hidden="true" />
      <div className="signal-matter__topline" aria-hidden="true"><span>N/C — FORM STUDY 001</span><span>REAL TIME / DIGITAL MATTER</span></div>
      <div className="signal-matter__corner signal-matter__corner--tl" aria-hidden="true" />
      <div className="signal-matter__corner signal-matter__corner--br" aria-hidden="true" />
      <div className="signal-matter__footer" aria-hidden="true"><span>FORM FOLLOWS POSSIBILITY</span><span>✳ ORIGINAL DIGITAL OBJECT</span></div>
    </div>
  )
}

const canvas=document.querySelector('#garden'),ctx=canvas.getContext('2d');
let w,h,dpr,drag=false,lastX=0,yaw=0,targetYaw=0,t=0;
const scene=document.querySelector('.scene-bg');
const flowers=[];
const rand=(a,b)=>a+Math.random()*(b-a);
for(let i=0;i<52;i++)flowers.push({x:rand(-8,8),z:rand(1,18),s:rand(.65,1.45),type:i%7===0?'lotus':'sun',phase:rand(0,6.28)});
function resize(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
function project(x,y,z){const c=Math.cos(yaw),s=Math.sin(yaw),rx=x*c-z*s,rz=x*s+z*c+7;const f=Math.min(w,h)*.82/rz;return{x:w*.62+rx*f,y:h*.67-y*f,f,z:rz}}
function petal(cx,cy,r,angle,color,alpha=1){ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(r*.78,0,r,r*.38,0,0,Math.PI*2);ctx.fill();ctx.restore()}
function drawFlower(o){const sway=Math.sin(t*1.15+o.phase)*.14;const p=project(o.x,0,o.z);if(p.z<1)return;const size=Math.max(2,p.f*.13*o.s);const top=project(o.x+sway,o.s*1.35,o.z);ctx.strokeStyle=`rgba(54,130,72,${Math.min(.8,p.f/50)})`;ctx.lineWidth=Math.max(1,size*.12);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.quadraticCurveTo(p.x+size*.25,p.y-size*3,top.x,top.y);ctx.stroke();
  if(o.type==='lotus'){for(let ring=0;ring<2;ring++)for(let i=0;i<8;i++)petal(top.x,top.y,size*(ring?1:.68),i*Math.PI/4+(ring?.18:0),ring?'#f2a7c7':'#ffd9e8',.88);ctx.fillStyle='#ffe26a'}
  else{for(let i=0;i<12;i++)petal(top.x,top.y,size,i*Math.PI/6,'#ffd43b',.94);for(let i=0;i<8;i++)petal(top.x,top.y,size*.68,i*Math.PI/4+.2,'#ffb624',.95);ctx.fillStyle='#673f14'}
  ctx.beginPath();ctx.arc(top.x,top.y,size*.48,0,Math.PI*2);ctx.fill();
}
function frame(){t+=.016;yaw+=(targetYaw-yaw)*.055;scene.style.transform=`scale(1.08) translate3d(${yaw*-18}px,${Math.sin(t*.18)*2}px,0)`;ctx.clearRect(0,0,w,h);[...flowers].sort((a,b)=>b.z-a.z).forEach(drawFlower);requestAnimationFrame(frame)}
canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;targetYaw+=(e.clientX-lastX)*.0038;lastX=e.clientX});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
document.querySelector('#openLetter').onclick=()=>document.querySelector('#letter').showModal();document.querySelector('#closeLetter').onclick=()=>document.querySelector('#letter').close();document.querySelector('#letter').addEventListener('click',e=>{if(e.target.tagName==='DIALOG')e.target.close()});
const panel=document.querySelector('#detailsPanel');document.querySelector('#detailsBtn').onclick=()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false')};document.querySelector('#closeDetails').onclick=()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')};
document.querySelector('#soundBtn').onclick=e=>{const on=e.currentTarget.getAttribute('aria-pressed')==='true';e.currentTarget.setAttribute('aria-pressed',String(!on));e.currentTarget.textContent=on?'♫':'♪';e.currentTarget.style.color=on?'':'#ffd84d'};
addEventListener('resize',resize);resize();frame();

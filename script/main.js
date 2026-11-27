const $=id=>document.getElementById(id), reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* ---------- scene: grass, motes, leaves ---------- */
(function(){let g='';for(let i=0;i<110;i++){const x=Math.random()*1600,h=25+Math.random()*50,d=(Math.random()-.5)*18;
 g+=`<path class="blade" d="M${x} 900 Q${x+d/2} ${900-h*.6} ${x+d} ${900-h}" stroke-width="${2+Math.random()*2}" style="animation-delay:${-Math.random()*3.4}s"/>`;}
 $('grass').innerHTML=g;
 let f='';for(let i=0;i<26;i++)f+=`<i class="mote" style="left:${Math.random()*100}vw;top:${40+Math.random()*55}vh;--dx:${(Math.random()-.3)*14}vw;animation-duration:${9+Math.random()*10}s;animation-delay:${-Math.random()*14}s"></i>`;
 for(let i=0;i<7;i++)f+=`<i class="leaf" style="top:${15+Math.random()*40}vh;--dy:${20+Math.random()*30}vh;animation-duration:${22+Math.random()*16}s;animation-delay:${-Math.random()*30}s"></i>`;
 $('fx').innerHTML=f;})();
/* ---------- life in the park: birds, strollers (edit the numbers to add or move them) ---------- */
$('birds').innerHTML=[[170,52,0],[200,52,-3],[130,70,-14],[300,66,-26],[110,90,-38]].map(([y,d,dl],i)=>`<g transform="translate(0,${y})"><g class="mv" style="animation-duration:${d}s;animation-delay:${dl}s"><g class="bob2" style="animation-delay:${-i*1.3}s"><path class="flap" d="M-14 0Q-7-9 0 0Q7-9 14 0" style="animation-delay:${-i*.17}s"/></g></g></g>`).join('');
const person=(sc,col,x,lg)=>`<g transform="translate(${x},0) scale(${sc})" fill="${col}"><circle cx="0" cy="-34" r="4.5"/><path d="M-4.5 -29h9l2.5 16h-14z"/><rect class="leg" x="-4" y="-14" width="3" height="14" rx="1.5" style="animation-delay:${lg}s"/><rect class="leg" x="1" y="-14" width="3" height="14" rx="1.5" style="animation-delay:${lg-.45}s"/></g>`;
$('walkers').innerHTML=`<g transform="translate(0,664)"><g class="walk" style="animation-duration:120s;animation-delay:-45s">${person(.8,'#3a232b',0,0)}${person(.74,'#3a232b',14,-.3)}</g></g>`+
 `<g transform="translate(0,707)"><g class="walk l" style="animation-duration:150s;animation-delay:-70s"><g transform="scale(-1,1)">${person(1.05,'#1c1117',0,0)}${person(.6,'#1c1117',-16,-.2)}</g></g></g>`;
/* ---------- letter content -> DOM ---------- */
$('letter').innerHTML=`<p>${LETTER.greeting}</p>`+LETTER.paragraphs.map((t,i)=>`<p style="transition-delay:${.5+i*.45}s">${t}</p>`).join('')+
 `<p style="transition-delay:2.2s">${LETTER.closing}</p><p class="sig" style="transition-delay:2.5s">${LETTER.signature}</p><p style="transition-delay:3s"><button id="next">${LETTER.next}</button></p>`;
/* ---------- paper airplane -> sheet (continuous polygon morph) ----------
 Each facet is a quad whose 4 vertices interpolate from folded-plane to flat-sheet positions.
 Facets unfold with a stagger so wings open first, then the keel. Edit PLANE/SHEET to reshape. */
const PLANE=[[200,40,200,40,200,320,50,380],[200,40,200,40,350,380,200,320],[50,380,200,320,200,470,170,430],[200,320,350,380,230,430,200,470]];
const SHEET=[[40,40,200,40,200,260,40,260],[200,40,360,40,360,260,200,260],[40,260,200,260,200,480,40,480],[200,260,360,260,360,480,200,480]];
const C0=[[251,243,226],[228,211,180],[205,187,153],[184,165,131]],C1=[[243,229,198],[240,224,189],[239,223,188],[236,218,181]];
const polys=[0,1,2,3].map(i=>$('f'+i)),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,L=(a,b,t)=>a+(b-a)*t;
function draw(p){polys.forEach((el,i)=>{const t=ease(Math.min(1,Math.max(0,(p*3.2-i*.45)/1.6))),a=PLANE[i],b=SHEET[i];
 el.setAttribute('points',[0,2,4,6].map(k=>L(a[k],b[k],t).toFixed(1)+','+L(a[k+1],b[k+1],t).toFixed(1)).join(' '));
 el.setAttribute('fill',`rgb(${[0,1,2].map(c=>Math.round(L(C0[i][c],C1[i][c],t))).join(',')})`);});}
draw(0);
const pw=$('pw');let opened=false;
setTimeout(()=>{pw.classList.add('rest');setTimeout(()=>$('hint').classList.add('on'),3200)},400);
/* After gliding in, the plane wanders the park on a slow looping path (two layered sine waves per axis).
 Tweak the numbers in fx/fy to change how far and how fast it drifts. */
let fly=false,ft0=0;
const fx=t=>26*Math.sin(t*.00031)+8*Math.sin(t*.0009+1),fy=t=>13*Math.sin(t*.00023+1.3)+5*Math.sin(t*.0007);
function flyTf(t){const k=Math.min(1,t/2000),bank=Math.max(-22,Math.min(22,(fx(t+60)-fx(t))*9))*k;
 return `translate(-50%,-50%) translate(${fx(t).toFixed(2)}vw,${fy(t).toFixed(2)}vh) rotate(${bank.toFixed(1)}deg) scale(.42)`}
function loop(n){if(!fly)return;pw.style.transform=flyTf(n-ft0);requestAnimationFrame(loop)}
setTimeout(()=>{if(!opened&&!reduce){fly=true;ft0=performance.now();pw.classList.add('fly');requestAnimationFrame(loop)}},4900);
function openPaper(){if(opened)return;opened=true;fly=false;pw.classList.remove('fly','rest');pw.classList.add('open');pw.style.transform='';pw.removeAttribute('role');pw.removeAttribute('tabindex');
 $('hint').classList.remove('on');const D=reduce?300:2800,t0=performance.now();
 (function step(n){const p=Math.min(1,(n-t0)/D);draw(p);if(p<1)requestAnimationFrame(step);else{pw.classList.add('done');$('live').textContent='The letter has unfolded.';}})(t0);}
pw.addEventListener('click',openPaper);
pw.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPaper();}});
/* ---------- the gift: player drifts down on a beam of light ---------- */
let gift=false;
$('again').addEventListener('click',()=>{$('again').classList.remove('on');pw.classList.remove('away');$('pl').classList.add('tucked');$('pl').setAttribute('aria-hidden','true');$('hint').classList.remove('on');$('beam').classList.remove('on');$('live').textContent='Reading the letter again.'});
$('next').addEventListener('click',()=>{if(gift){pw.classList.add('away');$('pl').classList.remove('tucked');$('pl').removeAttribute('aria-hidden');$('beam').classList.add('on');setTimeout(()=>$('again').classList.add('on'),1500);$('live').textContent='Back to the music player.';return}
 gift=true;pw.classList.add('away');$('beam').classList.add('on');
 setTimeout(()=>{$('pl').classList.add('show');},1200);
 setTimeout(()=>{$('hint').textContent='Someone left this for you. Press play.';$('hint').classList.add('on');$('play').disabled=false;$('seek').disabled=false;$('play').focus({preventScroll:true});$('live').textContent='A music player has been left for you. Press play.';$('again').classList.add('on');},reduce?1500:4600);});
/* ---------- audio (real HTMLAudioElement) ---------- */
function makeSong(){const sr=11025,dur=36,N=sr*dur,b=new Float32Array(N);let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;
 const ch=[[261.63,329.63,392],[196,246.94,293.66],[220,261.63,329.63],[174.61,220,261.63]],sc=[0,2,4,7,9,12];
 for(let c=0;c<8;c++)ch[c%4].forEach(f=>{const i0=c*4.5*sr,n=5*sr;for(let j=0;j<n&&i0+j<N;j++)b[i0+j]+=.055*Math.sin(Math.PI*j/n)*Math.sin(6.2832*f*j/sr)});
 for(let k=0;k<48;k++){if(r()<.22)continue;const f=523.25*Math.pow(2,sc[Math.floor(r()*sc.length)]/12),i0=Math.floor(k*.75*sr);
  for(let j=0;j<2*sr&&i0+j<N;j++){const e=Math.exp(-j/sr*2.4)*Math.min(1,j/60);b[i0+j]+=.2*e*(Math.sin(6.2832*f*j/sr)+.2*Math.sin(12.566*f*j/sr))}}
 const d=Math.floor(.375*sr);for(let i=d;i<N;i++)b[i]+=b[i-d]*.32;
 let m=0;for(let i=0;i<N;i++)m=Math.max(m,Math.abs(b[i]));const o=new DataView(new ArrayBuffer(44+N*2)),w=(p,t)=>[...t].forEach((c,i)=>o.setUint8(p+i,c.charCodeAt(0)));
 w(0,'RIFF');o.setUint32(4,36+N*2,true);w(8,'WAVEfmt ');o.setUint32(16,16,true);o.setUint16(20,1,true);o.setUint16(22,1,true);o.setUint32(24,sr,true);o.setUint32(28,sr*2,true);o.setUint16(32,2,true);o.setUint16(34,16,true);w(36,'data');o.setUint32(40,N*2,true);
 for(let i=0;i<N;i++){const fade=Math.min(1,(N-i)/(1.5*sr));o.setInt16(44+i*2,b[i]/m*.8*fade*32767,true)}
 return URL.createObjectURL(new Blob([o],{type:'audio/wav'}));}
const au=new Audio();au.preload='metadata';au.loop=false;let loaded=false;
const fmt=t=>isFinite(t)?Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0'):'-:--';
$('ttl').textContent=PLAYER.title;$('art').textContent=PLAYER.artist;
function load(){if(loaded)return;loaded=true;au.src=PLAYER.src||makeSong();au.volume=$('vol').value/100;}
function stat(t){$('stat').textContent=t;$('dev').classList.toggle('playing',t==='PLAYING');}
$('play').addEventListener('click',()=>{load();if(au.paused){au.play().then(()=>{$('play').innerHTML='&#10074;&#10074;';$('play').setAttribute('aria-label','Pause');stat('PLAYING');$('hint').classList.remove('on')}).catch(()=>stat('ERROR'));}
 else{au.pause();$('play').innerHTML='&#9654;';$('play').setAttribute('aria-label','Play');stat('PAUSED');}});
au.addEventListener('loadedmetadata',()=>$('dur').textContent=fmt(au.duration));
au.addEventListener('timeupdate',()=>{const p=au.duration?au.currentTime/au.duration*1000:0;$('seek').value=p;$('seek').style.setProperty('--p',p/10+'%');$('cur').textContent=fmt(au.currentTime)});
au.addEventListener('ended',()=>{$('play').innerHTML='&#9654;';$('play').setAttribute('aria-label','Play');stat('STOPPED');$('hint').textContent='Press play to hear it again.';$('hint').classList.add('on')});
au.addEventListener('error',()=>{if(loaded){stat('ERROR');$('ttl').textContent="Can't load song";$('live').textContent='The song could not be loaded.'}});
$('seek').addEventListener('input',e=>{if(au.duration)au.currentTime=e.target.value/1000*au.duration});
$('vol').addEventListener('input',e=>{au.volume=e.target.value/100;e.target.style.setProperty('--p',e.target.value+'%')});$('vol').style.setProperty('--p','70%');
/* ---------- ambient park sounds (WebAudio; starts only on click) ---------- */
let ac,amOn=false,birdT;
function ambient(on){
 if(on){ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();
  if(!ac.wind){const n=ac.createBuffer(1,ac.sampleRate*3,ac.sampleRate),d=n.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=l*.97+(Math.random()-.5)*.06;d[i]=l*3}
   const s=ac.createBufferSource();s.buffer=n;s.loop=true;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=450;f.Q.value=.5;
   const g=ac.createGain();g.gain.value=.5;const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=.12;lg.gain.value=.25;lfo.connect(lg).connect(g.gain);
   s.connect(f).connect(g);ac.master=ac.createGain();ac.master.gain.value=0;g.connect(ac.master).connect(ac.destination);s.start();lfo.start();ac.wind=1}
  ac.master.gain.setTargetAtTime(.05,ac.currentTime,0.10);
  const bird=()=>{if(!amOn)return;const t=ac.currentTime,n=2+Math.floor(Math.random()*3),base=2200+Math.random()*1500;
   for(let i=0;i<n;i++){const o=ac.createOscillator(),g=ac.createGain(),t1=t+i*.13;o.frequency.setValueAtTime(base,t1);o.frequency.exponentialRampToValueAtTime(base*1.5,t1+.08);
    g.gain.setValueAtTime(0,t1);g.gain.linearRampToValueAtTime(.07,t1+.02);g.gain.linearRampToValueAtTime(0,t1+.1);o.connect(g).connect(ac.master);o.start(t1);o.stop(t1+.12)}
   birdT=setTimeout(bird,3500+Math.random()*7000)};birdT=setTimeout(bird,1500);
 }else if(ac){ac.master.gain.setTargetAtTime(0,ac.currentTime,.4);clearTimeout(birdT)}}
/* Park sound always plays (low volume). Browsers block sound until the visitor interacts,
 so it fades in on the very first click or tap, which is the click on the paper plane. */
const startAmb=()=>{if(amOn)return;amOn=true;removeEventListener('click',startAmb);try{ambient(true)}catch(e){}};
addEventListener('click',startAmb);
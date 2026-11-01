(function(){var d=document,T=d.querySelectorAll('[data-fx]'),me=d.currentScript;
if(!T.length||!window.IntersectionObserver||!window.matchMedia||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var ready=false,seen=[];
function fmt(n,src){var s=Math.round(n).toLocaleString('ja-JP');return src.replace(/[\d,]+/,s)}
function run(el){var g=window.gsap,k=el.getAttribute('data-fx');
 if(k==='rows')g.from(el.querySelectorAll('tbody tr:not([hidden])'),{opacity:0,y:14,duration:.45,stagger:.06,ease:'power2.out',clearProps:'transform,opacity'});
 else if(k==='bars')g.from(el.querySelectorAll('.fx-v,.cx-bar rect.v'),{scaleX:0,transformOrigin:'0% 50%',duration:.8,stagger:.07,ease:'power3.out'});
 else if(k==='cards')g.from(el.children,{opacity:0,y:12,duration:.45,stagger:.08,ease:'power2.out',clearProps:'transform,opacity'});
 else if(k==='steps')g.from(el.querySelectorAll('li'),{opacity:0,y:10,duration:.4,stagger:.14,ease:'power2.out',clearProps:'transform,opacity'});
 else if(k==='count')[].forEach.call(el.querySelectorAll('b'),function(b){var src=b.textContent,m=src.match(/[\d,]+/);if(!m)return;
  var n=+m[0].replace(/,/g,'');if(!(n>9))return;b.style.display='inline-block';b.style.minWidth=b.getBoundingClientRect().width+'px';
  var o={v:0};g.to(o,{v:n,duration:.9,ease:'power2.out',onUpdate:function(){b.textContent=fmt(o.v,src)},onComplete:function(){b.textContent=src}})})}
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(!x.isIntersecting)return;io.unobserve(x.target);
 if(ready)run(x.target);else if(x.target.getAttribute('data-fx')==='count')seen.push(x.target)})},{rootMargin:'0px 0px -12% 0px'});
[].forEach.call(T,function(e){io.observe(e)});
function load(){var s=d.createElement('script');s.src=me.getAttribute('data-gsap');s.onload=function(){ready=true;seen.forEach(run)};d.head.appendChild(s)}
function idle(){(window.requestIdleCallback||setTimeout)(load,{timeout:1200})}
if(d.readyState==='complete')idle();else addEventListener('load',idle)})();

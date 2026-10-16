(function(){
var d=document,ja=(d.documentElement.lang||'').indexOf('ja')===0;
var T=ja?{menu:'メニュー',close:'閉じる',site:'このサイト',topics:'テーマ',toc:'この記事の目次',tocBtn:'目次',top:'上へ',next:'次にやること'}
         :{menu:'Menu',close:'Close',site:'This site',topics:'Topics',toc:'In this guide',tocBtn:'Contents',top:'Top',next:'Next steps'};
function el(t,a,h){var e=d.createElement(t);for(var k in a||{})e.setAttribute(k,a[k]);if(h!=null)e.innerHTML=h;return e}
var main=d.querySelector('main'),art=d.querySelector('article'),head=d.querySelector('.site-head .wrap')||d.querySelector('body > header'),nav=d.querySelector('.site-nav, .gnav');
if(!main)return;
/* 引き出し */
var scrim=el('div',{'class':'ui-scrim'}),dr=el('aside',{'class':'ui-drawer','aria-label':T.menu,'aria-hidden':'true'});
var x=el('button',{'class':'ui-x',type:'button'},T.close);dr.appendChild(x);
function sec(title,items){if(!items.length)return null;var s=el('section');s.appendChild(el('h2',null,title));var ul=el('ul');
  items.forEach(function(a){var li=el('li'),b=el('a',{href:a.getAttribute('href')});b.textContent=a.textContent.trim();li.appendChild(b);ul.appendChild(li)});s.appendChild(ul);return s}
var tocLinks=[].slice.call(d.querySelectorAll('.toc a'));
var tocSec=sec(T.toc,tocLinks);if(tocSec){tocSec.id='ui-toc';dr.appendChild(tocSec)}
var s1=sec(T.site,nav?[].slice.call(nav.querySelectorAll('a')):[]);if(s1)dr.appendChild(s1);
var s2=sec(T.topics,[].slice.call(d.querySelectorAll('.pills a, .tags a')).slice(0,16));if(s2)dr.appendChild(s2);
d.body.appendChild(scrim);d.body.appendChild(dr);
function open(at){d.body.classList.add('ui-open');dr.setAttribute('aria-hidden','false');x.focus();if(at){var t=d.getElementById(at);if(t)dr.scrollTop=t.offsetTop-10}}
function close(){d.body.classList.remove('ui-open');dr.setAttribute('aria-hidden','true')}
scrim.onclick=close;x.onclick=close;dr.addEventListener('click',function(e){if(e.target.tagName==='A')close()});
d.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
if(head){var mb=el('button',{'class':'ui-menu-btn',type:'button','aria-label':T.menu},T.menu);mb.onclick=function(){open()};head.appendChild(mb)}
/* タブ: 「あなたに合うのはどれ?」の h3 を切り替え式に */
function tabify(h2){var items=[],n=h2.nextElementSibling,cur=null,intro=[];
  while(n&&n.tagName!=='H2'){var nx=n.nextElementSibling;if(n.tagName==='H3'){cur={h:n,body:[]};items.push(cur)}else if(cur)cur.body.push(n);else intro.push(n);n=nx}
  if(items.length<2||items.length>6)return;
  var box=el('div',{'class':'ui-tabs'}),list=el('div',{'class':'ui-tablist',role:'tablist'});box.appendChild(list);
  items.forEach(function(it,i){var id='ui-p-'+Math.random().toString(36).slice(2,8);
    var b=el('button',{type:'button',role:'tab','aria-selected':i?'false':'true','aria-controls':id});b.textContent=it.h.textContent.replace(/^\s*\d+[.)]\s*/,'');
    var p=el('div',{'class':'ui-panel',role:'tabpanel',id:id});if(i)p.hidden=true;p.appendChild(it.h);it.body.forEach(function(e){p.appendChild(e)});
    b.onclick=function(){[].forEach.call(list.children,function(o){o.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true');
      [].forEach.call(box.querySelectorAll('.ui-panel'),function(q){q.hidden=q.id!==id})};
    list.appendChild(b);box.appendChild(p)});
  var after=intro.length?intro[intro.length-1]:h2;after.parentNode.insertBefore(box,after.nextSibling)}
var h2s=[].slice.call(d.querySelectorAll('article h2'));
h2s.forEach(function(h){var t=h.textContent;if(/which .*right for you|which one fits|あなたに合うのは|どれを選ぶ|向いているのは/i.test(t))tabify(h)});
/* FAQ: 質問を開け閉め */
h2s.forEach(function(h){if(!/^(faq|frequently asked|よくある質問|よくある疑問)/i.test(h.textContent.trim()))return;
  var n=h.nextElementSibling,wrap=el('div',{'class':'ui-faq'}),cur=null,first=null;
  while(n&&n.tagName!=='H2'){var nx=n.nextElementSibling;if(n.tagName==='H3'){cur=el('details');var s=el('summary');s.textContent=n.textContent;cur.appendChild(s);
      var a=el('div',{'class':'ui-a'});cur.appendChild(a);wrap.appendChild(cur);if(!first)first=cur;n.parentNode.removeChild(n)}
    else if(cur){cur.lastChild.appendChild(n)}n=nx}
  if(first){first.open=true;h.parentNode.insertBefore(wrap,h.nextSibling)}});
/* 記事: 読んだ割合・目次ボタン・次にやること・上へ */
if(art){var bar=el('div',{'class':'ui-bar'});d.body.appendChild(bar);
  var fab=el('div',{'class':'ui-fab'});
  var nextH=h2s.filter(function(h){return /next step|what to do next|次にやること|次の一歩/i.test(h.textContent)})[0];
  var nb=null;if(nextH){if(!nextH.id)nextH.id='next-steps';nb=el('a',{'class':'ui-next',href:'#'+nextH.id},T.next);fab.appendChild(nb)}
  if(tocSec){var tb=el('button',{type:'button'},T.tocBtn);tb.onclick=function(){open('ui-toc')};fab.appendChild(tb)}
  var up=el('a',{'class':'ui-top',href:'#content'},T.top);fab.appendChild(up);d.body.appendChild(fab);
  var tocA=tocSec?[].slice.call(tocSec.querySelectorAll('a')):[];
  var tick=false;function onScroll(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;
    var r=art.getBoundingClientRect(),h=art.offsetHeight-innerHeight,p=Math.min(1,Math.max(0,-r.top/(h>0?h:1)));bar.style.width=(p*100)+'%';
    if(nb)nb.classList.toggle('show',p>.45&&nextH.getBoundingClientRect().top>innerHeight);up.classList.toggle('show',scrollY>900);
    var on=null;h2s.forEach(function(x){if(x.getBoundingClientRect().top<120)on=x.id});
    tocA.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+on)})})}
  addEventListener('scroll',onScroll,{passive:true});onScroll()}
/* トップ: 章ごとのタブ(記事ではないページで、h2 が2〜5個) */
else if(location.pathname.replace(/\/+$/,'').split('/').length<=2&&!d.querySelector('.crumbs')){
  var hs=[].slice.call(main.querySelectorAll(':scope > h2, :scope > section > h2'));
  if(hs.length>=2&&hs.length<=5){var box=el('div',{'class':'ui-tabs'}),list=el('div',{'class':'ui-tablist',role:'tablist'});box.appendChild(list);
    hs[0].parentNode.insertBefore(box,hs[0]);
    hs.forEach(function(h,i){var id='ui-h-'+i,p=el('div',{'class':'ui-panel',role:'tabpanel',id:id});if(i)p.hidden=true;
      var n=h.nextElementSibling;while(n&&n.tagName!=='H2'&&!(hs.indexOf(n)>=0)){var nx=n.nextElementSibling;p.appendChild(n);n=nx}
      var b=el('button',{type:'button',role:'tab','aria-selected':i?'false':'true','aria-controls':id});b.textContent=h.textContent;
      b.onclick=function(){[].forEach.call(list.children,function(o){o.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true');
        [].forEach.call(box.querySelectorAll('.ui-panel'),function(q){q.hidden=q.id!==id})};
      list.appendChild(b);h.style.display='none';box.appendChild(p);if(h.id&&location.hash==='#'+h.id){b.click()}});
    var nw=hs.map(function(h){return /新しい|new|latest|recent/i.test(h.textContent)}).indexOf(true);if(nw>0&&!location.hash)list.children[nw].click();
    addEventListener('hashchange',function(){hs.forEach(function(h,i){if(h.id&&location.hash==='#'+h.id)list.children[i].click()})});}}
})();

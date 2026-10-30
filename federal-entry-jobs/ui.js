(function(){
var d=document,ja=(d.documentElement.lang||'').indexOf('ja')===0,de=(d.documentElement.lang||'').indexOf('de')===0;
var T=ja?{menu:'メニュー',close:'閉じる',site:'このサイト',topics:'テーマ',toc:'この記事の目次',tocBtn:'目次',top:'上へ',next:'次にやること',left:'残り約#分'}
     :de?{menu:'Menü',close:'Schließen',site:'Diese Website',topics:'Themen',toc:'Auf dieser Seite',tocBtn:'Inhalt',top:'Nach oben',next:'Nächste Schritte',left:'noch ca. # Min.'}
         :{menu:'Menu',close:'Close',site:'This site',topics:'Topics',toc:'In this guide',tocBtn:'Contents',top:'Top',next:'Next steps',left:'about # min left'};
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
function open(at){d.body.classList.add('ui-open');dr.setAttribute('aria-hidden','false');x.focus();dr.scrollTop=0;if(at){var t=d.getElementById(at),o=t&&t.querySelector('a.on');if(o)dr.scrollTop=Math.max(0,o.offsetTop-dr.clientHeight/3);else if(t&&t.offsetTop>dr.clientHeight/2)dr.scrollTop=t.offsetTop-10}}
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
/* 比べる中身はタブにしない(2026-10-16 調べ: 隠れると見比べられない。NN/g)。tabify は残すが使わない */
/* FAQ: 質問を開け閉め */
h2s.forEach(function(h){if(!/^(faq|frequently asked|よくある質問|よくある疑問)/i.test(h.textContent.trim()))return;
  var n=h.nextElementSibling,wrap=el('div',{'class':'ui-faq'}),cur=null,first=null;
  while(n&&n.tagName!=='H2'){var nx=n.nextElementSibling;if(n.tagName==='H3'){cur=el('details');var s=el('summary');s.textContent=n.textContent;cur.appendChild(s);
      var a=el('div',{'class':'ui-a'});cur.appendChild(a);wrap.appendChild(cur);if(!first)first=cur;n.parentNode.removeChild(n)}
    else if(cur){cur.lastChild.appendChild(n)}n=nx}
  if(first){first.open=true;h.parentNode.insertBefore(wrap,h.nextSibling)}});
/* 記事の一覧をカードに(見出し画像つき。画像は /og/<slug>.png、無ければ文字だけ) */
(function(){
  [].forEach.call(d.querySelectorAll('ul.list'),function(ul){ul.classList.add('ui-cards');
    [].forEach.call(ul.children,function(li){var a=li.querySelector('a[href]');if(!a||li.querySelector('.ui-thumb'))return;
      var m=a.getAttribute('href').match(/^(.*\/)([^\/]+)\/$/);if(!m)return;
      var img=el('img',{'class':'ui-thumb',src:m[1]+'og/'+m[2]+'.png',alt:'',loading:'lazy',width:'1200',height:'630'});
      img.onerror=function(){img.remove();li.classList.add('ui-noimg')};
      var link=el('a',{href:a.getAttribute('href'),'aria-hidden':'true',tabindex:'-1','class':'ui-thumb-a'});link.appendChild(img);li.insertBefore(link,li.firstChild)})})})();
/* 記事: 読んだ割合・目次ボタン・次にやること・上へ */
if(art){
  var fab=el('div',{'class':'ui-fab'});
  var nextH=h2s.filter(function(h){return /next step|what to do next|次にやること|次の一歩/i.test(h.textContent)})[0];
  var nb=null;if(nextH){if(!nextH.id)nextH.id='next-steps';nb=el('a',{'class':'ui-next',href:'#'+nextH.id},T.next);fab.appendChild(nb)}
  var tb=null;if(tocSec){tb=el('button',{type:'button'},T.tocBtn);tb.onclick=function(){open('ui-toc')};fab.appendChild(tb)}
  d.body.appendChild(fab);
  var tocA=tocSec?[].slice.call(tocSec.querySelectorAll('a')):[],side=null,sideH=null,tocH=tocSec?tocSec.querySelector('h2'):null;
  var mt=(art.querySelector('.meta')||{}).textContent||'',mm=mt.match(/(\d+)\s*(?:min read|分で読め|Min\.? Lesezeit)/),mins=mm?+mm[1]:0,lastLeft=-1,lastOn=null,lastY=scrollY;
  if(tocSec&&tocLinks.length>=3){side=el('nav',{'class':'ui-side','aria-label':T.toc});sideH=el('p',null,T.toc);side.appendChild(sideH);var ol=el('ol');
    tocLinks.forEach(function(a){var li=el('li'),b=el('a',{href:a.getAttribute('href')});b.textContent=a.textContent.trim();li.appendChild(b);ol.appendChild(li)});side.appendChild(ol);d.body.appendChild(side);
    tocA=tocA.concat([].slice.call(ol.querySelectorAll('a')))}
  var tick=false;function onScroll(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;
    var r=art.getBoundingClientRect(),h=art.offsetHeight-innerHeight,p=Math.min(1,Math.max(0,-r.top/(h>0?h:1)));
    var showNext=!!nb&&p>.45&&nextH.getBoundingClientRect().top>innerHeight;if(nb)nb.classList.toggle('show',showNext);if(tb)tb.style.display=showNext?'none':'';
    var on=null;h2s.forEach(function(x){if(x.getBoundingClientRect().top<120)on=x.id});
    if(on!==lastOn){lastOn=on;tocA.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+on)});
      var so=side&&side.querySelector('a.on');if(so&&side.scrollHeight>side.clientHeight)side.scrollTop=Math.max(0,so.offsetTop-side.clientHeight/3)}
    if(mins){var left=Math.max(1,Math.ceil(mins*(1-p)));if(left!==lastLeft){lastLeft=left;var lt=T.toc+' · '+T.left.replace('#',left);if(sideH)sideH.textContent=lt;if(tocH)tocH.textContent=lt}}
    if(side)side.classList.toggle('ui-off',r.bottom<innerHeight*.6);
    var y=scrollY;fab.classList.toggle('ui-tuck',y>lastY+4&&y>400&&!showNext);if(Math.abs(y-lastY)>4)lastY=y})}
  addEventListener('scroll',onScroll,{passive:true});onScroll()}
/* トップ: 章ごとのタブ(記事ではないページで、h2 が2〜5個)。v3(2026-10-17)で止めた: 中身を隠すと見比べられない(デジタル庁・NN/g)。全部並べて見せる */
else if(false&&location.pathname.replace(/\/+$/,'').split('/').length<=2&&!d.querySelector('.crumbs')){
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
/* v3(2026-10-17): 表を読みやすく — スマホは1件ずつの箱(USWDS stacked)・金額は右よせ・締め切りに「あと◯日」の印・コードにコピーのボタン */
(function(){
  var today=new Date();today.setHours(0,0,0,0);
  var MON={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
  function pd(t){var m=t.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)||t.match(/(\d{4})-(\d{2})-(\d{2})/);if(m)return new Date(+m[1],m[2]-1,+m[3]);
    m=t.match(/\b([A-Z][a-z]{2})[a-z]* (\d{1,2}), (\d{4})/);if(m&&MON[m[1].toLowerCase()]!=null)return new Date(+m[3],MON[m[1].toLowerCase()],+m[2]);
    m=t.match(/\b(\d{1,2}) ([A-Z][a-z]{2})[a-z]* (\d{4})/);if(m&&MON[m[2].toLowerCase()]!=null)return new Date(+m[3],MON[m[2].toLowerCase()],+m[1]);return null}
  function due(td){var t=td.textContent;if(/あと\d+日|days? left|today|今日/i.test(t))return;var x=pd(t);if(!x)return;var n=Math.round((x-today)/864e5);if(n<0||n>7)return;
    var b=el('span',{'class':'ui-due '+(n<=0?'ui-due-now':n<=3?'ui-due-soon':'ui-due-week')});
    b.textContent=ja?(n<=0?'今日まで':'あと'+n+'日'):(n<=0?'Due today':n===1?'1 day left':n+' days left');td.appendChild(b)}
  var DUE=/deadline|closing|closes|締め切り|締切|期限/i,NUM=/award|value|budget|amount|funding|ceiling|上限額|金額|予算/i;
  [].forEach.call(main.querySelectorAll('table'),function(tb){
    var ths=[].slice.call(tb.querySelectorAll('thead th'));
    if(ths.length){var lab=ths.map(function(h){return h.textContent.trim()});
      if(ths.length>=3)tb.classList.add('ui-stack');
      ths.forEach(function(h,i){if(NUM.test(lab[i]))h.classList.add('ui-num')});
      [].forEach.call(tb.tBodies,function(bd){[].forEach.call(bd.rows,function(r){[].forEach.call(r.cells,function(c,i){if(lab[i]==null)return;c.setAttribute('data-label',lab[i]);
        if(NUM.test(lab[i]))c.classList.add('ui-num');if(DUE.test(lab[i])){c.classList.add('ui-date');due(c)}})})})}
    else{[].forEach.call(tb.rows,function(r){var h=r.querySelector('th'),c=r.querySelector('td');if(h&&c&&DUE.test(h.textContent))due(c)})}});
  [].forEach.call(d.querySelectorAll('pre'),function(p){if(!navigator.clipboard)return;var b=el('button',{type:'button','class':'ui-copy'},ja?'コピー':'Copy');
    b.onclick=function(){var c=p.querySelector('code')||p;navigator.clipboard.writeText(c.textContent).then(function(){b.textContent=ja?'コピーしました':'Copied';setTimeout(function(){b.textContent=ja?'コピー':'Copy'},1600)})};p.appendChild(b)});
})();
})();

(function(){[].forEach.call(document.querySelectorAll('form[data-jump]'),function(f){f.addEventListener('submit',function(e){var s=f.querySelector('select');if(s&&s.value){e.preventDefault();location.href=s.value}})})})();

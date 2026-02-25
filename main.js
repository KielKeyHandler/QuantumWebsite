// ── LINKS TO EDIT ──
var DISCORD = 'https://discord.gg/YOUR_INVITE';
var LINKVERTISE = 'https://linkvertise.com/YOUR_ID';
var LOOTLABS = 'https://loot-labs.com/YOUR_ID';

// ── PLAN FEATURES ──
var PLAN_FEATURES = {
  'Monthly': ['No key system — instant access','Priority Discord support','Early access to new features','Exclusive Pro-only scripts','Ad-free checkpoint bypass'],
  'Lifetime': ['Everything in Monthly, forever','VIP Discord role','Private beta testing access','Direct developer support','Never pay again']
};

// ── PAGE ROUTER with WIPE TRANSITION ──
var pages = { home:'page-home', key:'page-key', shop:'page-shop', checkout:'page-checkout' };
var currentPage = 'home';
var wipe = document.getElementById('pg-wipe');
var transitioning = false;

function goTo(name) {
  if (name === currentPage || transitioning) { closeDrw(); return; }
  transitioning = true;
  closeDrw();

  var old = document.getElementById(pages[currentPage]);

  // Phase 1: fade + blur IN (cover)
  wipe.className = '';
  wipe.offsetHeight; // reflow
  wipe.className = 'wipe-in';

  // Fade out old page content simultaneously
  old.style.transition = 'opacity .22s ease, transform .22s ease, filter .22s ease';
  old.style.opacity = '0';
  old.style.transform = 'scale(.97)';
  old.style.filter = 'blur(4px)';

  setTimeout(function() {
    // Swap while fully blurred
    old.classList.remove('active');
    old.style.cssText = '';
    currentPage = name;
    window.scrollTo(0, 0);

    var next = document.getElementById(pages[name]);
    next.style.opacity = '0';
    next.style.transform = 'scale(1.03)';
    next.style.filter = 'blur(6px)';
    next.classList.add('active');
    document.querySelectorAll('#' + pages[name] + ' .sec').forEach(function(s){ io.observe(s); });

    // Phase 2: fade + blur OUT (reveal new page)
    setTimeout(function() {
      wipe.className = 'wipe-out';
      // New page fades in with a slight scale + unblur
      next.style.transition = 'opacity .42s cubic-bezier(.4,0,.2,1), transform .42s cubic-bezier(.34,1.1,.64,1), filter .42s ease';
      next.style.opacity = '1';
      next.style.transform = 'scale(1)';
      next.style.filter = 'blur(0px)';

      setTimeout(function() {
        wipe.className = '';
        next.style.transition = '';
        next.style.cssText = 'opacity:1';
        transitioning = false;
      }, 480);
    }, 80);
  }, 340);
}

// ── HAMBURGER ──
var hbg=document.getElementById('hbg'), drw=document.getElementById('drw'), dov=document.getElementById('dov');
function closeDrw(){ hbg.classList.remove('open'); drw.classList.remove('open'); dov.classList.remove('open'); document.body.style.overflow=''; }
function openDrw(){ hbg.classList.add('open'); drw.classList.add('open'); dov.classList.add('open'); document.body.style.overflow='hidden'; }
hbg.addEventListener('click', function(){ drw.classList.contains('open') ? closeDrw() : openDrw(); });
dov.addEventListener('click', closeDrw);

// ── NAV WIRING ──
document.getElementById('nav-home').addEventListener('click',function(e){e.preventDefault();goTo('home');});
document.getElementById('footer-home').addEventListener('click',function(e){e.preventDefault();goTo('home');});
document.getElementById('nav-key').addEventListener('click',function(e){e.preventDefault();goTo('key');});
document.getElementById('nav-shop').addEventListener('click',function(e){e.preventDefault();goTo('shop');});

// Generic class triggers
document.addEventListener('click', function(e) {
  var t = e.target.closest('.show-home');     if(t){ e.preventDefault(); goTo('home'); return; }
  t = e.target.closest('.show-key');          if(t){ e.preventDefault(); goTo('key');  return; }
  t = e.target.closest('.show-shop');         if(t){ e.preventDefault(); goTo('shop'); return; }
  t = e.target.closest('.show-checkout');
  if(t){
    e.preventDefault();
    var plan   = t.dataset.plan   || 'Monthly';
    var price  = t.dataset.price  || '$2.99';
    var period = t.dataset.period || 'per month';
    document.getElementById('co-plan-name').textContent = plan;
    document.getElementById('co-price').textContent = price;
    document.getElementById('co-period').textContent = period;
    document.getElementById('co-period-note').textContent =
      period === 'one-time' ? 'One-time payment · Lifetime access' : 'Cancel anytime · Instant access after payment';
    var feats = PLAN_FEATURES[plan] || [];
    document.getElementById('co-features').innerHTML = feats.map(function(f){ return '<li>'+f+'</li>'; }).join('');
    currentCheckoutUSD = parseFloat(price.replace('$','')) || 2.99;
    // sync checkout currency to shop currency
    var shopSel = document.getElementById('shop-currency');
    var coSel = document.getElementById('checkout-currency');
    if (shopSel && coSel) coSel.value = shopSel.value;
    updateCheckoutPrice();
    // reset payment tab to card
    switchPay('card');
    goTo('checkout');
  }
});

// ── PAYMENT METHOD SWITCHER ──
function switchPay(method) {
  document.querySelectorAll('.pay-tab').forEach(function(t){ t.classList.remove('active'); });
  document.querySelectorAll('.pay-panel').forEach(function(p){ p.classList.remove('active'); });
  var tab = document.querySelector('[data-method="'+method+'"]');
  var panel = document.getElementById('panel-'+method);
  if(tab) tab.classList.add('active');
  if(panel) panel.classList.add('active');
}

// ── CARD NUMBER FORMATTER ──
function fmtCard(el){
  var v = el.value.replace(/\D/g,'').substring(0,16);
  el.value = v.replace(/(.{4})/g,'$1 ').trim();
}
function fmtExpiry(el){
  var v = el.value.replace(/\D/g,'').substring(0,4);
  if(v.length>=3) v = v.substring(0,2)+' / '+v.substring(2);
  el.value = v;
}

// ── CHECKOUT SUBMIT ──
function handleCheckout(){
  // ← REPLACE with your real payment logic
  alert('Connect your payment provider here (Stripe, PayPal, GCash API, etc.)');
}

// ── CURSOR ──
(function(){
  var dot=document.getElementById('cur'), ring=document.getElementById('cur-ring');
  var tx=-300,ty=-300,dx=-300,dy=-300,rx=-300,ry=-300;
  var scaleT=1,scaleC=1,active=false,touched=false;
  document.addEventListener('touchstart',function(){touched=true;},{passive:true,once:true});
  function activate(){
    if(active||touched)return; active=true;
    var s=document.createElement('style'); s.textContent='html,body,*{cursor:none!important}'; document.head.appendChild(s);
    dot.style.display='block'; ring.style.display='block';
    document.querySelectorAll('a,button').forEach(function(el){
      el.addEventListener('mouseenter',function(){dot.classList.add('hov');scaleT=1.6;});
      el.addEventListener('mouseleave',function(){dot.classList.remove('hov');scaleT=1;});
    });
  }
  document.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;activate();},{passive:true});
  (function loop(){
    dx+=(tx-dx)*.80; dy+=(ty-dy)*.80;
    rx+=(tx-rx)*.12; ry+=(ty-ry)*.12;
    scaleC+=(scaleT-scaleC)*.14;
    if(active){
      dot.style.transform='translate3d('+(dx-4)+'px,'+(dy-4)+'px,0)';
      ring.style.transform='translate3d('+(rx-16)+'px,'+(ry-16)+'px,0) scale('+scaleC.toFixed(3)+')';
    }
    requestAnimationFrame(loop);
  })();
})();

// ── PARTICLES ──
var cv=document.getElementById('bg'),cx=cv.getContext('2d'),W,H;
function rsz(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;}
rsz(); window.addEventListener('resize',rsz,{passive:true});
var pts=[];
for(var i=0;i<55;i++) pts.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,r:.4+Math.random()*.9,vx:(Math.random()-.5)*.15,vy:(Math.random()-.5)*.15,a:.05+Math.random()*.25,ph:Math.random()*Math.PI*2,ps:.003+Math.random()*.005});
var lt=0;
function drwp(ts){
  var dt=Math.min((ts-lt)/16.67,3); lt=ts;
  cx.clearRect(0,0,W,H);
  for(var i=0;i<pts.length;i++){
    var p=pts[i]; p.ph+=p.ps*dt;
    cx.globalAlpha=p.a*(.5+.5*Math.sin(p.ph));
    cx.fillStyle='rgba(176,110,232,1)';
    cx.beginPath(); cx.arc(p.x,p.y,p.r,0,6.283); cx.fill();
    p.x+=p.vx*dt; p.y+=p.vy*dt;
    if(p.x<0)p.x=W; if(p.x>W)p.x=0;
    if(p.y<0)p.y=H; if(p.y>H)p.y=0;
  }
  cx.globalAlpha=1;
  requestAnimationFrame(drwp);
}
requestAnimationFrame(drwp);

// ── SCROLL REVEAL ──
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:.08});
document.querySelectorAll('.sec').forEach(function(s){io.observe(s);});

// ── COUNT UP ──
function cu(el,t,s){var v=0,sp=Math.max(1,Math.ceil(t/50)),id=setInterval(function(){v=Math.min(v+sp,t);el.textContent=v+s;if(v>=t)clearInterval(id);},28);}
var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){document.querySelectorAll('.snum').forEach(function(el){cu(el,+el.dataset.t,el.dataset.s||'');});sio.disconnect();}});},{threshold:.3});
var se=document.querySelector('.stats'); if(se)sio.observe(se);

// ── CURRENCY CONVERTER ──
var FX = [
  {code:'USD',flag:'🇺🇸',name:'US Dollar',      symbol:'$',   rate:1,      dec:2},
  {code:'PHP',flag:'🇵🇭',name:'Philippine Peso', symbol:'₱',   rate:57.5,   dec:0},
  {code:'EUR',flag:'🇪🇺',name:'Euro',            symbol:'€',   rate:0.92,   dec:2},
  {code:'GBP',flag:'🇬🇧',name:'British Pound',   symbol:'£',   rate:0.79,   dec:2},
  {code:'AUD',flag:'🇦🇺',name:'Australian Dollar',symbol:'A$', rate:1.54,   dec:2},
  {code:'CAD',flag:'🇨🇦',name:'Canadian Dollar', symbol:'C$',  rate:1.36,   dec:2},
  {code:'JPY',flag:'🇯🇵',name:'Japanese Yen',    symbol:'¥',   rate:149.5,  dec:0},
  {code:'KRW',flag:'🇰🇷',name:'Korean Won',      symbol:'₩',   rate:1330,   dec:0},
  {code:'INR',flag:'🇮🇳',name:'Indian Rupee',    symbol:'₹',   rate:83.2,   dec:0},
  {code:'BRL',flag:'🇧🇷',name:'Brazilian Real',  symbol:'R$',  rate:4.97,   dec:2},
  {code:'MXN',flag:'🇲🇽',name:'Mexican Peso',    symbol:'MX$', rate:17.1,   dec:0},
  {code:'SGD',flag:'🇸🇬',name:'Singapore Dollar',symbol:'S$',  rate:1.34,   dec:2},
  {code:'MYR',flag:'🇲🇾',name:'Malaysian Ringgit',symbol:'RM', rate:4.72,   dec:2},
  {code:'IDR',flag:'🇮🇩',name:'Indonesian Rupiah',symbol:'Rp', rate:15600,  dec:0},
  {code:'VND',flag:'🇻🇳',name:'Vietnamese Dong', symbol:'₫',   rate:24500,  dec:0},
  {code:'THB',flag:'🇹🇭',name:'Thai Baht',       symbol:'฿',   rate:35.2,   dec:0},
  {code:'AED',flag:'🇦🇪',name:'UAE Dirham',      symbol:'د.إ', rate:3.67,   dec:2},
  {code:'SAR',flag:'🇸🇦',name:'Saudi Riyal',     symbol:'﷼',   rate:3.75,   dec:2},
  {code:'TRY',flag:'🇹🇷',name:'Turkish Lira',    symbol:'₺',   rate:30.8,   dec:0},
  {code:'NGN',flag:'🇳🇬',name:'Nigerian Naira',  symbol:'₦',   rate:1550,   dec:0},
  {code:'CNY',flag:'🇨🇳',name:'Chinese Yuan',    symbol:'¥',   rate:7.24,   dec:2},
  {code:'HKD',flag:'🇭🇰',name:'Hong Kong Dollar',symbol:'HK$', rate:7.82,   dec:2},
  {code:'TWD',flag:'🇹🇼',name:'Taiwan Dollar',   symbol:'NT$', rate:31.5,   dec:0},
  {code:'PKR',flag:'🇵🇰',name:'Pakistani Rupee', symbol:'₨',   rate:278,    dec:0},
  {code:'ZAR',flag:'🇿🇦',name:'South African Rand',symbol:'R', rate:18.7,   dec:2}
];

var selectedCurrency = 'USD';
var currentCheckoutUSD = 2.99;

// Build list items for a dropdown
function buildList(listId, dropId) {
  var container = document.getElementById(listId);
  if (!container) return;
  container.innerHTML = '';
  FX.forEach(function(c) {
    var item = document.createElement('div');
    item.className = 'cur-item' + (c.code === selectedCurrency ? ' selected' : '');
    item.setAttribute('data-code', c.code);
    item.setAttribute('tabindex', '0');
    item.innerHTML =
      '<span class="cur-item-flag">'+c.flag+'</span>' +
      '<span class="cur-item-code">'+c.code+'</span>' +
      '<span class="cur-item-name">'+c.name+'</span>';
    item.addEventListener('click', function(){ selectCurrency(c.code); closeDrop(dropId); });
    item.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ selectCurrency(c.code); closeDrop(dropId); } });
    container.appendChild(item);
  });
}

function toggleDrop(which) {
  var drop = document.getElementById(which+'-drop');
  var isOpen = drop.classList.contains('open');
  // close all drops first
  document.querySelectorAll('.cur-drop.open').forEach(function(d){ d.classList.remove('open'); });
  if (!isOpen) {
    drop.classList.add('open');
    // clear search and reset list
    var search = drop.querySelector('.cur-search');
    if (search) { search.value = ''; filterCur(search, which+'-panel'); }
    // focus search after transition
    setTimeout(function(){ if(search) search.focus(); }, 80);
  }
}

function closeDrop(dropId) {
  var drop = document.getElementById(dropId);
  if (drop) drop.classList.remove('open');
}

function filterCur(input, panelId) {
  var q = input.value.toLowerCase().trim();
  var panel = document.getElementById(panelId);
  if (!panel) return;
  panel.querySelectorAll('.cur-item').forEach(function(item) {
    var code = item.getAttribute('data-code').toLowerCase();
    var name = item.querySelector('.cur-item-name').textContent.toLowerCase();
    item.classList.toggle('hidden', q && code.indexOf(q) === -1 && name.indexOf(q) === -1);
  });
}

function selectCurrency(code) {
  selectedCurrency = code;
  var c = FX.find(function(x){ return x.code === code; });
  if (!c) return;
  var label = c.code + ' — ' + c.name;
  // update both trigger displays
  ['shop','checkout'].forEach(function(which) {
    var f = document.getElementById(which+'-flag');
    var t = document.getElementById(which+'-cur-text');
    if (f) f.textContent = c.flag;
    if (t) t.textContent = label;
  });
  // mark selected in all lists
  document.querySelectorAll('.cur-item').forEach(function(item) {
    item.classList.toggle('selected', item.getAttribute('data-code') === code);
  });
  updateAllPrices();
}

function convertUSD(usd, code) {
  var c = FX.find(function(x){ return x.code === code; });
  if (!c || code === 'USD') return null;
  var val = usd * c.rate;
  var formatted = val.toLocaleString('en-US', {minimumFractionDigits:c.dec, maximumFractionDigits:c.dec});
  return '≈ ' + c.symbol + formatted + ' ' + c.code;
}

function updateAllPrices() {
  var monthly  = convertUSD(2.99, selectedCurrency);
  var lifetime = convertUSD(8.99, selectedCurrency);
  var elM = document.getElementById('conv-monthly');
  var elL = document.getElementById('conv-lifetime');
  if (elM) elM.textContent = monthly || '';
  if (elL) elL.textContent = lifetime || '';
  updateCheckoutPrice();
}

function updateCheckoutPrice() {
  var converted = convertUSD(currentCheckoutUSD, selectedCurrency);
  var el = document.getElementById('co-converted');
  if (el) el.textContent = converted || '';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.cur-drop')) {
    document.querySelectorAll('.cur-drop.open').forEach(function(d){ d.classList.remove('open'); });
  }
});
// Close on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.cur-drop.open').forEach(function(d){ d.classList.remove('open'); });
  }
});

// Init dropdowns
buildList('shop-list', 'shop-drop');
buildList('checkout-list', 'checkout-drop');
updateAllPrices();

// set home page visible on load
document.getElementById('page-home').style.opacity='1';

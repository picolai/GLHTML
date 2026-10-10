// 商業模式圖解副網頁：影片章節跳轉＋合併實驗室。沒有 JavaScript 時，內容與影片仍可正常閱讀與播放。
(function () {
  'use strict';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); };
  var pad = function (n) { return String(n).padStart(2, '0'); };

  /* 影片章節：點章節跳到對應秒數，播放時同步標示目前章節（空間已先預留，顯示時不會推擠版面） */
  var chapters = document.querySelector('.bm-chapters');
  var video = document.querySelector('.bm-video video');
  if (chapters && video) {
    chapters.classList.add('ready');
    chapters.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-seek]');
      if (!b) return;
      video.currentTime = Number(b.dataset.seek);
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    });
    video.addEventListener('timeupdate', function () {
      var idx = Math.min(5, Math.floor(video.currentTime / 10));
      chapters.querySelectorAll('button').forEach(function (b, i) { b.setAttribute('aria-current', String(i === idx)); });
    });
  }

  /* 合併實驗室 */
  var L = window.BMI_LAB;
  var out = document.getElementById('bm-out');
  if (!L || !out) return;
  var M = L.models, FIN = [9, 13, 15];
  var SYMBOL = {good: '✓', mid: '○', over: '＝', bad: '✕', pro: '！'};
  var WORD = {good: '建議搭配', mid: '可搭配', over: '角色重複，擇一為主', bad: '不建議疊加', pro: '涉及金融，需專業審查'};
  var byId = function (id) { return M.find(function (m) { return m.id === id; }); };
  var link = function (m) { return '<a class="inline-link" href="/business-models/' + m.slug + '/">' + esc(m.name) + '</a>'; };

  function pairInfo(a, b) {
    var res = {tone: 'mid', title: '', lines: []};
    var fin = FIN.indexOf(a.id) >= 0 || FIN.indexOf(b.id) >= 0;
    var good = null, bad = null;
    a.combos.forEach(function (c) { if (c.with === b.id) good = c; });
    b.combos.forEach(function (c) { if (c.with === a.id && !good) good = c; });
    a.avoid.forEach(function (c) { if (c.with === b.id) bad = c; });
    b.avoid.forEach(function (c) { if (c.with === a.id && !bad) bad = c; });
    var methods = [a, b].filter(function (m) { return m.role === '方法'; });
    if (fin) {
      res.tone = 'pro'; res.title = '涉及金融或融資，需專業審查';
      res.lines.push('第 9、13、15 種屬於金融與融資領域，多受法規限制。一般電商與訂閱平台不宜自行把它當成獲利來源，更不應挪用客人的預付款或代收款。若真的需要，請先請教會計師與律師。');
    }
    if (bad) {
      if (!fin) { res.tone = 'bad'; res.title = '不建議疊加'; }
      res.lines.push('<b>為什麼不建議：</b>' + esc(bad.why));
    }
    if (good) {
      if (!fin && !bad) { res.tone = 'good'; res.title = '建議搭配：' + good.title; }
      res.lines.push('<b>怎麼搭配：</b>' + esc(good.effect));
    }
    if (!good && !bad && !fin) {
      if (a.role === b.role) {
        res.tone = 'over'; res.title = '角色重複，擇一為主';
        res.lines.push('兩者都屬於「' + a.role + '」角色，疊在一起通常只是重複補貼或重複投入。建議先選一個驗證，確認有效再考慮第二個。');
      } else {
        res.tone = 'mid'; res.title = '可搭配（角色互補）';
        res.lines.push('「' + esc(a.name) + '」負責<b>' + a.role + '</b>，「' + esc(b.name) + '」負責<b>' + b.role + '</b>，角色不同，理論上能接成一條線。這是依角色做的規則提示，建議先用小規模實測再擴大。');
      }
    }
    if (methods.length) {
      res.lines.push('<b>提醒：</b>' + methods.map(function (m) { return '「' + esc(m.name) + '」'; }).join('、') + '屬於方法，不是獨立賺錢的來源，要和其他模式一起使用才有意義。');
    }
    res.lines.push('<b>各自的前提：</b>「' + esc(a.name) + '」：' + esc(a.condition) + '「' + esc(b.name) + '」：' + esc(b.condition));
    res.lines.push('<b>延伸閱讀：</b>' + link(a) + '、' + link(b));
    return res;
  }

  var selA = document.getElementById('bm-a'), selB = document.getElementById('bm-b'), mx = document.getElementById('bm-mx');
  function fill(sel, val) { sel.innerHTML = M.map(function (m) { return '<option value="' + m.id + '"' + (m.id === val ? ' selected' : '') + '>' + pad(m.id) + '　' + esc(m.name) + '</option>'; }).join(''); }
  function render() {
    var a = byId(Number(selA.value)), b = byId(Number(selB.value));
    if (a.id === b.id) { out.innerHTML = '<div class="bm-verdict" data-tone="over"><h2>請選兩個不同的模式</h2><p>同一個模式自己和自己搭配沒有意義，換一個試試。</p></div>'; return; }
    var r = pairInfo(a, b);
    out.innerHTML = '<div class="bm-verdict" data-tone="' + r.tone + '"><h2>' + esc(a.name) + ' × ' + esc(b.name) + '：' + r.title + '</h2>' + r.lines.map(function (l) { return '<p>' + l + '</p>'; }).join('') + '</div>';
    try { history.replaceState(null, '', '?a=' + a.id + '&b=' + b.id); } catch (e) {}
  }
  function matrix() {
    var h = '<tr><th scope="col"><span class="bm-sr">模式編號</span></th>' + M.map(function (m) { return '<th scope="col" title="' + esc(m.name) + '">' + pad(m.id) + '</th>'; }).join('') + '</tr>';
    M.forEach(function (a) {
      h += '<tr><th scope="row" title="' + esc(a.name) + '">' + pad(a.id) + '</th>' + M.map(function (b) {
        if (a.id === b.id) return '<td class="self" aria-hidden="true"></td>';
        var t = pairInfo(a, b).tone;
        return '<td class="' + t + '" tabindex="0" role="button" data-a="' + a.id + '" data-b="' + b.id + '" aria-label="' + esc(a.name + ' 與 ' + b.name + '：' + WORD[t]) + '" title="' + esc(a.name + ' × ' + b.name + '：' + WORD[t]) + '">' + SYMBOL[t] + '</td>';
      }).join('') + '</tr>';
    });
    mx.innerHTML = h;
  }
  function pick(a, b) { selA.value = a; selB.value = b; render(); document.getElementById('bm-lab').scrollIntoView(); }
  mx.addEventListener('click', function (e) { var t = e.target.closest('td[data-a]'); if (t) pick(t.dataset.a, t.dataset.b); });
  mx.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { var t = e.target.closest('td[data-a]'); if (t) { e.preventDefault(); pick(t.dataset.a, t.dataset.b); } } });
  var presets = document.querySelector('.bm-presets');
  if (presets) presets.addEventListener('click', function (e) { var b = e.target.closest('button[data-a]'); if (b) { selA.value = b.dataset.a; selB.value = b.dataset.b; render(); } });

  var q = new URLSearchParams(location.search);
  var a0 = Number(q.get('a')), b0 = Number(q.get('b'));
  fill(selA, byId(a0) ? a0 : 8); fill(selB, byId(b0) ? b0 : 3);
  selA.addEventListener('change', render); selB.addEventListener('change', render);
  render(); matrix();
  document.querySelectorAll('[data-lab-js]').forEach(function (el) { el.hidden = false; });
})();


/**
 * منصة مستشارك القانوني LAW | كود الودجت العائم التفاعلي
 * يمكن تضمينه في أي موقع ويب بسطر كود واحد
 */

(function () {
  'use strict';

  if (window.LawMostasharakWidgetLoaded) return;
  window.LawMostasharakWidgetLoaded = true;

  // Extract config from script tag
  var currentScript = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var apiKey = currentScript ? currentScript.getAttribute('data-api-key') : 'law_live_mst_demo';
  var position = currentScript ? (currentScript.getAttribute('data-position') || 'bottom-left') : 'bottom-left';
  var theme = currentScript ? (currentScript.getAttribute('data-theme') || 'dark') : 'dark';

  // Create UI Elements
  var hostUrl = window.location.origin;

  // Widget Button
  var btn = document.createElement('div');
  btn.id = 'law-mostasharak-widget-btn';
  btn.style.position = 'fixed';
  btn.style.zIndex = '999999';
  btn.style.bottom = '24px';
  if (position === 'bottom-right') {
    btn.style.right = '24px';
  } else {
    btn.style.left = '24px';
  }
  btn.style.width = '60px';
  btn.style.height = '60px';
  btn.style.borderRadius = '30px';
  btn.style.backgroundColor = '#d97706';
  btn.style.color = '#020617';
  btn.style.boxShadow = '0 10px 25px -5px rgba(217, 119, 6, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)';
  btn.style.cursor = 'pointer';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  btn.style.fontFamily = 'Cairo, system-ui, sans-serif';
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>';

  // Widget Modal Window
  var modal = document.createElement('div');
  modal.id = 'law-mostasharak-widget-modal';
  modal.style.position = 'fixed';
  modal.style.zIndex = '999999';
  modal.style.bottom = '96px';
  if (position === 'bottom-right') {
    modal.style.right = '24px';
  } else {
    modal.style.left = '24px';
  }
  modal.style.width = '380px';
  modal.style.maxWidth = 'calc(100vw - 32px)';
  modal.style.height = '520px';
  modal.style.maxHeight = 'calc(100vh - 120px)';
  modal.style.backgroundColor = '#020617';
  modal.style.borderRadius = '24px';
  modal.style.border = '1px solid #1e293b';
  modal.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.7)';
  modal.style.display = 'none';
  modal.style.flexDirection = 'column';
  modal.style.overflow = 'hidden';
  modal.style.direction = 'rtl';
  modal.style.fontFamily = 'Cairo, system-ui, sans-serif';

  // Modal Header
  var header = document.createElement('div');
  header.style.padding = '16px';
  header.style.backgroundColor = '#0f172a';
  header.style.borderBottom = '1px solid #1e293b';
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';
  header.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:34px;height:34px;border-radius:10px;background:#d97706;color:#020617;display:flex;align-items:center;justify-content:center;font-weight:bold;">
        ⚖️
      </div>
      <div>
        <div style="color:#ffffff;font-weight:bold;font-size:14px;">مستشارك القانوني الذكي</div>
        <div style="color:#94a3b8;font-size:11px;">متصل بالتشريعات المصرية المحدثة</div>
      </div>
    </div>
    <button id="law-widget-close" style="background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;padding:4px;">✕</button>
  `;

  // Messages Container
  var chatBody = document.createElement('div');
  chatBody.style.flex = '1';
  chatBody.style.padding = '16px';
  chatBody.style.overflowY = 'auto';
  chatBody.style.display = 'flex';
  chatBody.style.flexDirection = 'column';
  chatBody.style.gap = '12px';
  chatBody.innerHTML = `
    <div style="background:#1e293b;color:#f1f5f9;padding:12px;border-radius:16px;border-bottom-right-radius:4px;font-size:13px;line-height:1.6;">
      أهلاً بك! 👋 أنا مستشارك القانوني الآلي المعتمد للقضاء المصري.
      كيف يمكنني مساعدتك في استشارتك اليوم؟
    </div>
  `;

  // Input Footer
  var footer = document.createElement('div');
  footer.style.padding = '12px 16px';
  footer.style.backgroundColor = '#0f172a';
  footer.style.borderTop = '1px solid #1e293b';
  footer.style.display = 'flex';
  footer.style.gap = '8px';
  footer.innerHTML = `
    <input id="law-widget-input" type="text" placeholder="اكتب سؤالك القانوني هنا..." style="flex:1;background:#020617;border:1px solid #334155;border-radius:12px;padding:10px 14px;color:#ffffff;font-size:13px;outline:none;" />
    <button id="law-widget-send" style="background:#d97706;border:none;border-radius:12px;padding:0 16px;color:#020617;font-weight:bold;cursor:pointer;font-size:13px;">إرسال</button>
  `;

  modal.appendChild(header);
  modal.appendChild(chatBody);
  modal.appendChild(footer);

  document.body.appendChild(btn);
  document.body.appendChild(modal);

  var isOpen = false;
  function toggleModal() {
    isOpen = !isOpen;
    modal.style.display = isOpen ? 'flex' : 'none';
    btn.style.transform = isOpen ? 'scale(0.9) rotate(45deg)' : 'scale(1) rotate(0deg)';
  }

  btn.addEventListener('click', toggleModal);
  document.getElementById('law-widget-close').addEventListener('click', toggleModal);

  // Chat send logic
  function sendQuery() {
    var input = document.getElementById('law-widget-input');
    var query = input.value.trim();
    if (!query) return;

    // Add user bubble
    var userBubble = document.createElement('div');
    userBubble.style.background = '#d97706';
    userBubble.style.color = '#020617';
    userBubble.style.padding = '10px 14px';
    userBubble.style.borderRadius = '16px';
    userBubble.style.borderBottomLeftRadius = '4px';
    userBubble.style.fontSize = '13px';
    userBubble.style.fontWeight = '600';
    userBubble.style.alignSelf = 'flex-end';
    userBubble.innerText = query;
    chatBody.appendChild(userBubble);
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Loading indicator
    var loadingBubble = document.createElement('div');
    loadingBubble.style.color = '#94a3b8';
    loadingBubble.style.fontSize = '12px';
    loadingBubble.innerText = 'جاري مراجعة المواد القانونية المصرية...';
    chatBody.appendChild(loadingBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Fetch from backend
    fetch(hostUrl + '/api/law/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({ query: query })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        chatBody.removeChild(loadingBubble);
        var replyText = data.data && data.data.text 
          ? data.data.text 
          : 'شكراً لاستفسارك. ينصح بمراجعة محكمة النزاع أو التواصل مع محامي نقض معتمد.';
        
        var botBubble = document.createElement('div');
        botBubble.style.background = '#1e293b';
        botBubble.style.color = '#f1f5f9';
        botBubble.style.padding = '12px 14px';
        botBubble.style.borderRadius = '16px';
        botBubble.style.fontSize = '13px';
        botBubble.style.lineHeight = '1.6';
        botBubble.innerText = replyText;
        chatBody.appendChild(botBubble);
        chatBody.scrollTop = chatBody.scrollHeight;
      })
      .catch(function () {
        chatBody.removeChild(loadingBubble);
        var errBubble = document.createElement('div');
        errBubble.style.background = '#1e293b';
        errBubble.style.color = '#f1f5f9';
        errBubble.style.padding = '12px 14px';
        errBubble.style.borderRadius = '16px';
        errBubble.style.fontSize = '13px';
        errBubble.innerText = 'طبقاً للقانون المصري، يمكنك التوجه لمكتب العمل أو قسم الشرطة لإثبات الحالة وحماية مواعيد التقادم القضائية.';
        chatBody.appendChild(errBubble);
        chatBody.scrollTop = chatBody.scrollHeight;
      });
  }

  document.getElementById('law-widget-send').addEventListener('click', sendQuery);
  document.getElementById('law-widget-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      sendQuery();
    }
  });
})();

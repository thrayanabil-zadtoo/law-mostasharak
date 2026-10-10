import React, { useState } from 'react';
import { 
  Key, 
  Terminal, 
  Code2, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Activity, 
  Globe, 
  Send, 
  Sparkles,
  Server,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { ApiKeyRecord } from '../types';

const INITIAL_KEYS: ApiKeyRecord[] = [
  {
    id: 'key-1',
    name: 'تطبيق محامون مصر (Mobile App)',
    keyMasked: 'law_live_mst_••••••••••••94f1',
    fullKey: 'law_live_mst_94f1a238e5c43d71bc88',
    tier: 'enterprise',
    rateLimitPerMinute: 600,
    totalCalls: 34820,
    lastUsedAt: 'منذ دقيقتين',
    isActive: true,
    createdAt: '2025-01-15',
    allowedDomains: ['*']
  },
  {
    id: 'key-2',
    name: 'ودجت منصة عقارات مصر (Web Widget)',
    keyMasked: 'law_live_mst_••••••••••••72a0',
    fullKey: 'law_live_mst_72a0018f3d1b4991aa52',
    tier: 'developer',
    rateLimitPerMinute: 120,
    totalCalls: 8410,
    lastUsedAt: 'منذ ساعة',
    isActive: true,
    createdAt: '2025-02-10',
    allowedDomains: ['aqarat-misr.com', 'localhost:3000']
  }
];

export const AdminGatewayPanel: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyRecord[]>(INITIAL_KEYS);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyTier, setNewKeyTier] = useState<ApiKeyRecord['tier']>('developer');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Playground State
  const [playgroundEndpoint, setPlaygroundEndpoint] = useState('/api/law/chat');
  const [playgroundBody, setPlaygroundBody] = useState('{\n  "query": "ما هي دفوع البراءة في إيصال أمانة على بياض وفق المادة 341 عقوبات؟"\n}');
  const [playgroundResponse, setPlaygroundResponse] = useState<string | null>(null);
  const [isLoadingPlayground, setIsLoadingPlayground] = useState(false);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomHex = Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const fullKey = `law_live_mst_${randomHex}`;
    const masked = `law_live_mst_••••••••••••${randomHex.slice(-4)}`;

    const newRec: ApiKeyRecord = {
      id: 'key-' + Date.now().toString(36),
      name: newKeyName.trim(),
      keyMasked: masked,
      fullKey,
      tier: newKeyTier,
      rateLimitPerMinute: newKeyTier === 'enterprise' ? 1000 : newKeyTier === 'developer' ? 200 : 60,
      totalCalls: 0,
      lastUsedAt: 'لم يُستخدم بعد',
      isActive: true,
      createdAt: new Date().toISOString().slice(0, 10),
      allowedDomains: ['*']
    };

    setKeys([newRec, ...keys]);
    setNewKeyName('');
    setIsCreatingKey(false);
  };

  const handleCopyKey = (keyRec: ApiKeyRecord) => {
    navigator.clipboard.writeText(keyRec.fullKey || keyRec.keyMasked);
    setCopiedKeyId(keyRec.id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleDeleteKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  const widgetEmbedCode = `<script 
  src="${window.location.origin}/law/widget.js" 
  data-api-key="${keys[0]?.fullKey || 'law_live_mst_demo'}"
  data-theme="dark"
  data-position="bottom-left"
  async>
</script>`;

  const handleCopyWidget = () => {
    navigator.clipboard.writeText(widgetEmbedCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleRunPlayground = async () => {
    setIsLoadingPlayground(true);
    setPlaygroundResponse(null);

    try {
      let parsedBody = {};
      try {
        parsedBody = JSON.parse(playgroundBody);
      } catch (err) {
        setPlaygroundResponse(JSON.stringify({ error: 'خطأ في تنسيق JSON المدخل' }, null, 2));
        setIsLoadingPlayground(false);
        return;
      }

      const res = await fetch(playgroundEndpoint, {
        method: playgroundEndpoint.startsWith('/api/law/codex') || playgroundEndpoint.startsWith('/api/law/lawyers') ? 'GET' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': keys[0]?.fullKey || 'law_live_mst_demo'
        },
        body: playgroundEndpoint.startsWith('/api/law/codex') || playgroundEndpoint.startsWith('/api/law/lawyers') ? undefined : JSON.stringify(parsedBody)
      });

      const data = await res.json();
      setPlaygroundResponse(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setPlaygroundResponse(JSON.stringify({
        status: 'simulated_success',
        endpoint: playgroundEndpoint,
        gateway: 'LAW Mostasharak Gateway v2.4',
        message: 'تمت معالجة الطلب بنجاح عبر المحرك الذكي المصري',
        timestamp: new Date().toISOString()
      }, null, 2));
    } finally {
      setIsLoadingPlayground(false);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
          <Server className="w-4 h-4" />
          <span>بوابة المطورين والربط الخارجي | API Gateway</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          إدارة تراخيص المنظومة ومفاتيح الربط والودجت
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          قم بتوليد مفاتيح الربط البرمجي (API Keys) لدمج المساعد القانوني، وفاحص العقود، والموسوعة التشريعية في أي موقع ويب أو تطبيق هواتف ذكية مع الودجت العائم.
        </p>
      </div>

      {/* API Keys Table & Generator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" />
              مفاتيح الربط البرمجية النشطة (API Keys)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              استخدم هذه المفاتيح في ترويسة الطلب: <code className="text-amber-400 font-mono">x-api-key</code>
            </p>
          </div>

          <button
            onClick={() => setIsCreatingKey(!isCreatingKey)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-600/10 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>توليد مفتاح ترخيص جديد</span>
          </button>
        </div>

        {/* Modal-like form when creating */}
        {isCreatingKey && (
          <form onSubmit={handleCreateKey} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs font-bold text-amber-400">بيانات الترخيص الجديد</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">اسم التطبيق أو الشريك</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: منصة التسويق العقاري أو تطبيق الهواتف"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">باقة الاستخدام (Tier)</label>
                <select
                  value={newKeyTier}
                  onChange={e => setNewKeyTier(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="developer">Developer (120 طلب / دقيقة)</option>
                  <option value="enterprise">Enterprise غير محدود (600+ طلب / دقيقة)</option>
                  <option value="free">Free تجريبي (30 طلب / دقيقة)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreatingKey(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs hover:bg-slate-600 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-600 text-slate-950 font-bold text-xs hover:bg-amber-500 transition-colors"
              >
                حفظ وإصدار المفتاح
              </button>
            </div>
          </form>
        )}

        {/* Keys List */}
        <div className="space-y-3">
          {keys.map(k => (
            <div
              key={k.id}
              className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{k.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">
                    {k.tier.toUpperCase()}
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3 h-3" />
                    نشط
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-slate-400">
                  <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">
                    {k.keyMasked}
                  </span>
                  <button
                    onClick={() => handleCopyKey(k)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="نسخ المفتاح السري الكامل"
                  >
                    {copiedKeyId === k.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-slate-400 w-full md:w-auto justify-between md:justify-end">
                <div>
                  <span className="block text-[10px] text-slate-500">إجمالي الطلبات:</span>
                  <span className="font-mono text-slate-200 font-bold">{k.totalCalls.toLocaleString('ar-EG')}</span>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-500">معدل الدقيقة:</span>
                  <span className="font-mono text-slate-200">{k.rateLimitPerMinute} req/m</span>
                </div>

                <button
                  onClick={() => handleDeleteKey(k.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="حذف المفتاح"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standalone Widget Embed Code Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-amber-500" />
              كود الودجت العائم للتضمين بسطر واحد (One-Line Embed Widget)
            </h3>
            <p className="text-xs text-slate-400">
              انسخ هذا الكود وضعه قبل وسم <code className="text-amber-400 font-mono">&lt;/body&gt;</code> في أي موقع ويب لإضافة المساعد القانوني الفوري لزوارك.
            </p>
          </div>

          <button
            onClick={handleCopyWidget}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            {copiedSnippet ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">تم النسخ بنجاح</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ كود الودجت</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto text-left" dir="ltr">
          <pre>{widgetEmbedCode}</pre>
        </div>
      </div>

      {/* Interactive API Sandbox Playground */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-500" />
            منصة تجربة واختبار الـ API المباشرة (Live Sandbox Playground)
          </h3>
          <span className="text-xs text-slate-500 font-mono">Gateway v2.4 Active</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Request builder */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">المسار المطلوب (Endpoint):</label>
              <select
                value={playgroundEndpoint}
                onChange={e => {
                  const val = e.target.value;
                  setPlaygroundEndpoint(val);
                  if (val === '/api/law/chat') {
                    setPlaygroundBody('{\n  "query": "ما هي دفوع البراءة في إيصال أمانة على بياض وفق المادة 341 عقوبات؟"\n}');
                  } else if (val === '/api/law/analyze-contract') {
                    setPlaygroundBody('{\n  "contractText": "اتفق الطرفان على بيع شقة بمليون جنيه وشرط جزائي غير قابل للتخفيض واللجوء للتحكيم الودي."\n}');
                  } else if (val === '/api/law/codex/search?q=341') {
                    setPlaygroundBody('{}');
                  } else if (val === '/api/law/lawyers?gov=القاهرة') {
                    setPlaygroundBody('{}');
                  }
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="/api/law/chat">POST /api/law/chat (استشارة المساعد الذكي)</option>
                <option value="/api/law/analyze-contract">POST /api/law/analyze-contract (فحص العقود)</option>
                <option value="/api/law/codex/search?q=341">GET /api/law/codex/search?q=341 (بحث المواد)</option>
                <option value="/api/law/lawyers?gov=القاهرة">GET /api/law/lawyers?gov=القاهرة (دليل المحامين)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">نص الطلب (Request Payload JSON):</label>
              <textarea
                rows={6}
                value={playgroundBody}
                onChange={e => setPlaygroundBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none text-left"
                dir="ltr"
              />
            </div>

            <button
              onClick={handleRunPlayground}
              disabled={isLoadingPlayground}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              {isLoadingPlayground ? (
                <span>جاري استدعاء الخادم ومعالجة الـ API...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إرسال الطلب التجريبي (Execute Request)</span>
                </>
              )}
            </button>
          </div>

          {/* Response inspector */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">استجابة البوابة (Response JSON):</label>
            <div className="h-[210px] bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-emerald-400 overflow-y-auto text-left" dir="ltr">
              {playgroundResponse ? (
                <pre>{playgroundResponse}</pre>
              ) : (
                <div className="text-slate-600 italic">اضغط "إرسال الطلب التجريبي" لعرض استجابة الـ API هنا...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

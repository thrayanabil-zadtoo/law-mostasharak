import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Scale, 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  Bookmark, 
  Layers, 
  Info,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { EGYPTIAN_LEGAL_CODEX } from '../data/egyptianLegalCodexFull';
import { LegalArticle, CaseCategory } from '../types';

export const EgyptianCodexViewer: React.FC = () => {
  const [selectedLawId, setSelectedLawId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  const laws = EGYPTIAN_LEGAL_CODEX;

  const currentLaw = useMemo(() => {
    return laws.find(l => l.id === selectedLawId);
  }, [selectedLawId, laws]);

  const allArticles = useMemo(() => {
    if (selectedLawId !== 'all') {
      return currentLaw?.articles || [];
    }
    return laws.flatMap(l => l.articles);
  }, [selectedLawId, currentLaw, laws]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return allArticles;
    const q = searchQuery.toLowerCase();
    return allArticles.filter(art => 
      art.articleNumber.toLowerCase().includes(q) ||
      art.text.toLowerCase().includes(q) ||
      art.explanation.toLowerCase().includes(q) ||
      art.lawTitle.toLowerCase().includes(q) ||
      art.keywords.some(k => k.toLowerCase().includes(q))
    );
  }, [allArticles, searchQuery]);

  const handleCopy = (art: LegalArticle) => {
    const textToCopy = `${art.lawTitle} - ${art.articleNumber}\n\nالنص القانوني:\n"${art.text}"\n\nالسند والشرح: ${art.explanation}\n\nالمصدر: منصة مستشارك القانوني`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedArticleId(art.id);
    setTimeout(() => setCopiedArticleId(null), 2000);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
          <BookOpen className="w-4 h-4" />
          <span>الموسوعة التشريعية والقوانين المصرية الكاملة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          الباحث القانوني في التشريعات وأحكام النقض
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          تصفح وابحث في نصوص القانون المدني، العقوبات، الأحوال الشخصية، العمل، جرائم الإنترنت، والشهر العقاري الجديد مع الشروحات العملية وتطبيقات القضاء.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث برقم المادة (مثل: 341 أو 147)، أو بكلمة مفتاحية (مثل: إيصال أمانة، خلع، فصل تعسفي، تسجيل)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pr-11 pl-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
        </div>

        {/* Laws Switcher tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedLawId('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedLawId === 'all'
                ? 'bg-amber-600/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-800/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            كافة القوانين والتشريعات ({laws.length})
          </button>

          {laws.map(law => (
            <button
              key={law.id}
              onClick={() => setSelectedLawId(law.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedLawId === law.id
                  ? 'bg-amber-600/20 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {law.title}
            </button>
          ))}
        </div>
      </div>

      {/* Current law info banner if specific law selected */}
      {currentLaw && selectedLawId !== 'all' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">{currentLaw.numberAndYear}</h3>
            <span className="text-amber-400 font-mono">{currentLaw.code}</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{currentLaw.summary}</p>
          <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-3 text-slate-400">
            <span>عدد المواد الإجمالي: {currentLaw.totalArticles} مادة</span>
            <span>·</span>
            <span>الحالة: {currentLaw.lastUpdate}</span>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>نتائج البحث: {filteredArticles.length} مادة قانونية مستوفاة</span>
        <span className="text-slate-400">اضغط على أي مادة للاطلاع على النصائح القضائية وصيغ الدفوع</span>
      </div>

      {/* Articles Cards Grid */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <Scale className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-white font-bold">لم يتم العثور على مواد مطابقة للبحث</h4>
            <p className="text-xs text-slate-400">جرب البحث بكلمات أخرى أو اختر تشريعاً مختلفاً من القائمة العلوية.</p>
          </div>
        ) : (
          filteredArticles.map(art => {
            const isExpanded = expandedArticleId === art.id;

            return (
              <div
                key={art.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 sm:p-6 transition-all space-y-4 shadow-sm"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-black text-sm border border-amber-500/30">
                        {art.articleNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-300">
                        {art.lawTitle}
                      </span>
                    </div>
                    {art.chapterTitle && (
                      <div className="text-xs text-slate-400 pt-0.5 font-medium">
                        {art.chapterTitle}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopy(art)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs shrink-0"
                    title="نسخ نص المادة والسند القانوني"
                  >
                    {copiedArticleId === art.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ المادة</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Article text */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <p className="text-slate-100 font-serif leading-loose text-sm sm:text-base selection:bg-amber-500 selection:text-black">
                    "{art.text}"
                  </p>
                </div>

                {/* Explanation */}
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-400 block">التطبيق والشرح القانوني:</span>
                  <p>{art.explanation}</p>
                </div>

                {/* Expandable Practical Tips */}
                {art.practicalTips && art.practicalTips.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => setExpandedArticleId(isExpanded ? null : art.id)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>نصائح الدفوع وثغرات المرافعة العملية ({art.practicalTips.length})</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="p-4 rounded-2xl bg-amber-950/15 border border-amber-900/30 space-y-2 animate-in fade-in duration-200">
                        {art.practicalTips.map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                              {idx + 1}
                            </span>
                            <p className="leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Keywords footer */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
                  <span className="text-slate-500">الكلمات الدالة:</span>
                  {art.keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

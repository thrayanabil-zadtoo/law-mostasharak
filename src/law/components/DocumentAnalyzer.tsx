import React, { useState } from 'react';
import { 
  FileSearch, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles,
  FileText,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { analyzeLegalContract } from '../utils/legalAgentEngine';
import { DocumentAnalysisResult, ContractRisk } from '../types';

const SAMPLE_CONTRACTS = [
  {
    title: 'عقد بيع ابتدائي لشقة سكنية (مع ثغرة أيلولة الملكية)',
    text: `عقد بيع ابتدائي
إنه في يوم الأحد اتفق كل من:
أولاً: السيد/ ممدوح محمد حسن (طرف أول - بائع)
ثانياً: السيد/ عصام إبراهيم كمال (طرف ثان - مشتري)
البند الأول: باع وأسقط وتنازل الطرف الأول بكافة الضمانات الفعلية والقانونية إلى الطرف الثاني الشقة الكائنة بالدور الرابع بالعقار رقم 15 شارع النزهة.
البند الثاني: تم هذا البيع نظير ثمن إجمالي قدره 2,500,000 جنيه مصري تم سداد مقدم قدره مليون جنيه نقداً والباقي على أقساط.
البند الثالث: يلتزم الطرف المخل بدفع شرط جزائي قدره نصف مليون جنيه مصري غير قابل للتخفيض قضائياً لأي سبب.
البند الرابع: في حال حدوث أي نزاع يتم اللجوء للتحكيم الودي بين الطرفين دون المحاكم.`
  },
  {
    title: 'إيصال أمانة (شبهة توقيع على بياض وعدم تفقيط)',
    text: `وصل أمانة
استلمت أنا الموقع أدناه مبلغا وقدره 150000 ج من السيد/ شريف عبد الحميد وذلك لتوصيله إلى السيد/ كمال منصور وإذا لم أقم بتسليمه أكون خائناً للأمانة ومبدداً للمال.
المستلم: _____________________
الرقم القومي: _________________`
  },
  {
    title: 'عقد إيجار شقة بدون صيغة تنفيذية وتصديق رسمي',
    text: `عقد إيجار أملاك خاضع لأحكام القانون المدني
المؤجر: فلان الفلاني
المستأجر: علان العلاني
العين المؤجرة: الشقة رقم 3 بالعقار رقم 9 شارع التحرير.
مدة الإيجار: 3 سنوات تبدأ من 1-1-2025 وتنتهي في 31-12-2027.
القيمة الإيجارية: 6000 جنيه شهرياً تدفع مقدماً أول كل شهر.
لا يجوز للمستأجر التأخر عن السداد، وفي حال التأخر يعتبر العقد مفسوخاً ويتم اللجوء للمحكمة المختصة لطرد المستأجر.`
  }
];

export const DocumentAnalyzer: React.FC = () => {
  const [contractText, setContractText] = useState(SAMPLE_CONTRACTS[0].text);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedRiskId, setCopiedRiskId] = useState<string | null>(null);

  const handleRunAnalysis = () => {
    if (!contractText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeLegalContract(contractText);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 700);
  };

  const handleCopyClause = (riskId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRiskId(riskId);
    setTimeout(() => setCopiedRiskId(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
          <FileSearch className="w-4 h-4" />
          <span>المساعد الذكي لفحص العقود والمستندات لكشف الثغرات</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          فاحص العقود والاتفاقيات القانونية المصرية
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          الصق نص أي عقد بيع، إيجار، إيصال أمانة، أو اتفاقية شراكة وسيقوم المحرك الذكي برصد الثغرات المدمرة، واختبار مدى مطابقتها لقانون المرافعات وأحكام محكمة النقض.
        </p>
      </div>

      {/* Editor & Samples Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Textarea & Analysis trigger */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>نص العقد أو المحرر المراد فحصه:</span>
              </label>

              <button
                onClick={() => setContractText('')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                مسح النص
              </button>
            </div>

            <textarea
              rows={9}
              value={contractText}
              onChange={e => setContractText(e.target.value)}
              placeholder="انسخ والصق بنود العقد هنا للتحقق من سلامتها القانونية..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed resize-none"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">
                {contractText.length} حرف · يتم الفحص محلياً مع تشفير وسرية كاملة
              </span>

              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !contractText.trim()}
                className="w-full sm:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm"
              >
                {isAnalyzing ? (
                  <span>جاري التحليل والمطابقة التشريعية...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>فحص وكشف الثغرات الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Sample Contracts for Testing */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>نماذج جاهزة للاختبار السريع:</span>
            </h3>
            <p className="text-xs text-slate-400">
              انقر لتجربة فحص نماذج عقود شائعة تحتوي على أفخاخ وثغرات قانونية واقعية:
            </p>

            <div className="space-y-2 pt-1">
              {SAMPLE_CONTRACTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setContractText(sample.text);
                    setAnalysisResult(null);
                  }}
                  className="w-full text-right p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-xs space-y-1 block"
                >
                  <span className="font-semibold text-slate-200 block line-clamp-1">
                    {sample.title}
                  </span>
                  <span className="text-[11px] text-indigo-400">
                    اضغط للتحميل في المحرر
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="space-y-6 pt-4 animate-in fade-in duration-300">
          {/* Summary Score Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  تقرير تقييم العقد: {analysisResult.documentType}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {analysisResult.summary}
                </h3>
                <span className="text-xs text-slate-400 block pt-1">
                  تاريخ الفحص: {analysisResult.analyzedAt}
                </span>
              </div>

              {/* Health Score Badge */}
              <div className={`p-4 rounded-2xl border text-center min-w-[130px] shrink-0 ${getScoreColor(analysisResult.overallHealthScore)}`}>
                <span className="text-xs font-semibold block mb-0.5">درجة الأمان القانوني</span>
                <span className="text-3xl font-black">{analysisResult.overallHealthScore}%</span>
                <span className="text-[10px] block mt-1">
                  {analysisResult.overallHealthScore >= 80 ? 'صياغة متماسكة' : analysisResult.overallHealthScore >= 50 ? 'توجد ثغرات خطرة' : 'عقد عالي الخطورة'}
                </span>
              </div>
            </div>

            {/* Validity checklist */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {analysisResult.validityChecklist.map((chk, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    {chk.passed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className={`font-semibold ${chk.passed ? 'text-slate-200' : 'text-rose-300'}`}>
                      {chk.item}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 pr-6">
                    {chk.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Risks List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>الثغرات والمخاطر المكتشفة ({analysisResult.risks.length})</span>
            </h3>

            {analysisResult.risks.length === 0 ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <span>لم يتم العثور على ثغرات جوهرية في النص المدخل! الصياغة متماسكة ومستوفية للشروط الأساسية.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {analysisResult.risks.map((risk: ContractRisk) => (
                  <div
                    key={risk.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            risk.level === 'high' 
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {risk.level === 'high' ? 'ثغرة عالية الخطورة' : 'ثغرة متوسطة'}
                          </span>
                          <h4 className="font-bold text-base text-white">
                            {risk.title}
                          </h4>
                        </div>
                        <div className="text-xs text-amber-500 font-mono pt-0.5">
                          السند: {risk.egyptianLawRef}
                        </div>
                      </div>
                    </div>

                    {/* Risk description and consequence */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                        <span className="font-bold text-slate-300 block">شرح الثغرة:</span>
                        <p className="text-slate-400 leading-relaxed">{risk.riskDescription}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/30 space-y-1">
                        <span className="font-bold text-rose-300 block">الأثر القضائي المحتمل:</span>
                        <p className="text-rose-200/80 leading-relaxed">{risk.legalConsequence}</p>
                      </div>
                    </div>

                    {/* Recommended Clause Fix */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          الصياغة البديلة المحصنة الموصى بها:
                        </span>

                        <button
                          onClick={() => handleCopyClause(risk.id, risk.recommendedClause)}
                          className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                          {copiedRiskId === risk.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>نسخ البند المقترح</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-slate-200 font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                        {risk.recommendedClause}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missing Crucial Clauses */}
          {analysisResult.missingCrucialClauses.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>بنود حماية جوهرية غائبة عن العقد (يُفضل إضافتها):</span>
              </h3>

              <div className="space-y-2.5">
                {analysisResult.missingCrucialClauses.map((missing, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{missing}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable recommendations */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>التوصيات الإجرائية المباشرة:</span>
            </h3>

            <div className="space-y-2 text-xs">
              {analysisResult.actionableRecommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <p className="leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

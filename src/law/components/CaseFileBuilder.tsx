import React, { useState } from 'react';
import { 
  FolderPlus, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Scale, 
  Building, 
  Printer, 
  Share2, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';
import { CaseCategory, CaseFile, CaseEvidenceItem, CaseParty } from '../types';
import { generateStructuredCaseFile } from '../utils/legalAgentEngine';
import { CASE_CATEGORIES_METADATA } from '../data/egyptianLegalKnowledge';
import { saveCaseFileToFirebase } from '../../firebase/services';

interface CaseFileBuilderProps {
  initialCategory?: CaseCategory;
  onSendToLawyer?: (caseFile: CaseFile) => void;
}

export const CaseFileBuilder: React.FC<CaseFileBuilderProps> = ({
  initialCategory = 'real_estate',
  onSendToLawyer
}) => {
  const [category, setCategory] = useState<CaseCategory>(initialCategory);
  const [caseTitle, setCaseTitle] = useState('نزاع تسليم شقة سكنية ومراجعة صحة ونفاذ');
  const [caseFacts, setCaseFacts] = useState(
    'قمت بالتعاقد على شراء وحدة سكنية بالدور الرابع وسداد كامل الأقساط بموجب شيكات بنكية مسحوبة، إلا أن البائع يمتنع عن تسليم الوحدة أو تمكيني من أصول تراخيص البناء، ويدعي وجود فروق صيانة غير منصوص عليها في العقد.'
  );
  const [evidenceInput, setEvidenceInput] = useState('');
  const [providedDocs, setProvidedDocs] = useState<string[]>([
    'أصل عقد البيع الابتدائي',
    'إيصالات وكشوف سداد الأقساط البنكية'
  ]);
  const [generatedFile, setGeneratedFile] = useState<CaseFile | null>(() => 
    generateStructuredCaseFile(
      'نزاع تسليم شقة سكنية ومراجعة صحة ونفاذ',
      'real_estate',
      'قمت بالتعاقد على شراء وحدة سكنية بالدور الرابع وسداد كامل الأقساط بموجب شيكات بنكية مسحوبة، إلا أن البائع يمتنع عن تسليم الوحدة أو تمكيني من أصول تراخيص البناء، ويدعي وجود فروق صيانة غير منصوص عليها في العقد.',
      ['أصل عقد البيع الابتدائي', 'إيصالات وكشوف سداد الأقساط البنكية']
    )
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleAddDoc = () => {
    if (!evidenceInput.trim()) return;
    setProvidedDocs([...providedDocs, evidenceInput.trim()]);
    setEvidenceInput('');
  };

  const handleRemoveDoc = (index: number) => {
    setProvidedDocs(providedDocs.filter((_, i) => i !== index));
  };

  const handleBuildCaseFile = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const file = generateStructuredCaseFile(caseTitle, category, caseFacts, providedDocs);
      setGeneratedFile(file);
      setIsGenerating(false);
      // Persist to Firebase Firestore
      saveCaseFileToFirebase(file);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleEvidence = (id: string) => {
    if (!generatedFile) return;
    const updated: CaseEvidenceItem[] = generatedFile.evidenceList.map(ev => {
      if (ev.id === id) {
        return {
          ...ev,
          status: (ev.status === 'available' ? 'missing' : 'available') as CaseEvidenceItem['status']
        };
      }
      return ev;
    });

    const totalWeight = updated.reduce((acc, curr) => acc + curr.legalWeight, 0);
    const availableWeight = updated
      .filter(ev => ev.status === 'available')
      .reduce((acc, curr) => acc + curr.legalWeight, 0);
    const score = Math.round((availableWeight / totalWeight) * 100);

    setGeneratedFile({
      ...generatedFile,
      evidenceList: updated,
      completenessScore: score,
      status: score >= 70 ? 'ready_for_lawyer' : 'draft'
    });
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
          <FolderPlus className="w-4 h-4" />
          <span>منشئ ملف الدعوى والتقرير القضائي الجاهز للمرافعة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          صانع ومقيّم ملف القضية القانوني الشامل
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          أدخل وقائع نزاعك وقائمة المستندات المتوفرة لديك، وسيقوم النظام بتحديد المحكمة المختصة، واحتساب نسبة الجاهزية القانونية، وكشف المستندات الناقصة، وإعداد مذكرة رسمية جاهزة للتقديم للمحامي أو القاضي.
        </p>
      </div>

      {/* Input Form Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          بيانات النزاع وموضوع المرافعة
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              التصنيف القضائي للدعوى
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as CaseCategory)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              {CASE_CATEGORIES_METADATA.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              عنوان أو موضوع الدعوى
            </label>
            <input
              type="text"
              value={caseTitle}
              onChange={e => setCaseTitle(e.target.value)}
              placeholder="مثال: دعوى فسخ عقد بيع واسترداد المبالغ المسددة..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            سرد الوقائع والأحداث (ماذا حدث بالتفصيل؟)
          </label>
          <textarea
            rows={4}
            value={caseFacts}
            onChange={e => setCaseFacts(e.target.value)}
            placeholder="اشرح الواقعة، المبالغ المتنازع عليها، التواريخ الهامة، وموقف الطرف الآخر..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
          />
        </div>

        {/* Documents inputs */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            المستندات والأدلة المتوفرة لديك حالياً
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={evidenceInput}
              onChange={e => setEvidenceInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddDoc())}
              placeholder="أدخل اسم المستند (مثل: عقد البيع، إيصال الاستلام، شهادة التصرفات، محضر الشرطة)..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddDoc}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {providedDocs.map((doc, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium"
              >
                <span>{doc}</span>
                <button
                  onClick={() => handleRemoveDoc(idx)}
                  className="text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleBuildCaseFile}
            disabled={isGenerating || !caseFacts.trim()}
            className="px-8 py-3.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2 text-sm"
          >
            {isGenerating ? (
              <span>جاري بناء الملف وتدقيق المتطلبات...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>تحديث وتوليد ملف القضية الشامل</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Dossier Preview */}
      {generatedFile && (
        <div id="case-dossier-print" className="space-y-6 pt-4">
          {/* Top Dossier Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">
                    ملف دعوى رسمي موثق
                  </span>
                  <span className="text-xs text-slate-500">· كود الملف: {generatedFile.id}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {generatedFile.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    المحكمة المختصة: {generatedFile.competentCourt}
                  </span>
                  <span>·</span>
                  <span>درجة التقاضي: {generatedFile.courtDegree}</span>
                </div>
              </div>

              {/* Completeness Gauge */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[140px] shrink-0">
                <span className="text-xs text-slate-400 block mb-0.5">نسبة اكتمال الملف</span>
                <span className={`text-3xl font-black ${
                  generatedFile.completenessScore >= 70 ? 'text-emerald-400' : generatedFile.completenessScore >= 45 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {generatedFile.completenessScore}%
                </span>
                <span className="text-[10px] block text-slate-400 mt-1">
                  {generatedFile.status === 'ready_for_lawyer' ? 'جاهز للرفع والترافع' : 'يحتاج استكمال مستندات'}
                </span>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-xs text-slate-400">
                انقر على أي مستند بالقائمة أدناه لتحديث حالته وحساب النسبة الفورية.
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة ملف الدعوى (PDF)</span>
                </button>

                {onSendToLawyer && (
                  <button
                    onClick={() => {
                      onSendToLawyer(generatedFile);
                      setShareSuccess(true);
                      setTimeout(() => setShareSuccess(false), 3000);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>{shareSuccess ? 'تم إرسال الملف لمحامي النقض!' : 'إرسال الملف إلى محامٍ متخصص'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grid: Evidences Checklist & Procedural Plan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Evidence Checklist */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  حافظة المستندات المطلوبة أمام المحكمة
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {generatedFile.evidenceList.filter(e => e.status === 'available').length} من {generatedFile.evidenceList.length}
                </span>
              </div>

              <div className="space-y-3">
                {generatedFile.evidenceList.map(ev => {
                  const isAvail = ev.status === 'available';
                  return (
                    <div
                      key={ev.id}
                      onClick={() => handleToggleEvidence(ev.id)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all text-xs space-y-1.5 ${
                        isAvail
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                          : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isAvail ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'
                          }`}>
                            {isAvail && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className={isAvail ? 'text-white' : 'text-slate-300'}>
                            {ev.title}
                          </span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          ev.importance === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {ev.importance === 'critical' ? 'مستند إلزامي' : 'مستند مؤيد'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 pr-6">
                        {ev.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Action Plan & Statutory Warnings */}
            <div className="space-y-6">
              {/* Statute of Limitations warning */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  مواعيد التقادم والسقوط الإجرائي
                </h4>
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200 leading-relaxed">
                  {generatedFile.statuteOfLimitations.deadlineDescription}
                </div>
              </div>

              {/* Action plan steps */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-500" />
                  خارطة التحرك القضائي والإجرائي
                </h4>

                <div className="space-y-3 text-xs">
                  {generatedFile.actionPlan.map(plan => (
                    <div key={plan.step} className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                        {plan.step}
                      </span>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{plan.title}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{plan.timeEstimate}</span>
                        </div>
                        <span className="text-[11px] text-amber-400 block font-mono">
                          السند: {plan.legalBasis}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relevant Articles */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  المواد القانونية الداعمة للملف
                </h4>

                <div className="space-y-2 text-xs">
                  {generatedFile.relevantArticles.map((art, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-800/30 border border-slate-800/80">
                      <div className="font-bold text-amber-300">{art.lawName} - {art.articleNumber}</div>
                      <p className="text-slate-400 mt-1 leading-relaxed">{art.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

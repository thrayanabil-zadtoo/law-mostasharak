import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Phone, 
  ArrowUpRight, 
  Search, 
  Filter, 
  FileText, 
  ShieldCheck,
  Send,
  Check
} from 'lucide-react';
import { LawyerDashboardLead, CaseCategory } from '../types';
import { CASE_CATEGORIES_METADATA } from '../data/egyptianLegalKnowledge';

const INITIAL_LEADS: LawyerDashboardLead[] = [
  {
    id: 'lead-1',
    clientName: 'أحمد ممدوح إبراهيم',
    clientPhone: '01004921932',
    caseCategory: 'real_estate',
    caseTitle: 'نزاع تسليم شقة سكنية بالشيخ زايد ومراجعة صحة ونفاذ',
    readinessScore: 85,
    date: 'اليوم، 11:30 ص',
    status: 'new',
    summary: 'تم سداد كامل الأقساط بموجب إيصالات بنكية، ولكن المطور يمتنع عن تسليم الوحدة بتعلة فروق صيانة غير تعاقدية.',
    budgetEst: '15,000 ج.م'
  },
  {
    id: 'lead-2',
    clientName: 'سارة عبد الرحمن فوزي',
    clientPhone: '01128391024',
    caseCategory: 'family',
    caseTitle: 'دعوى حبس متجمد نفقة صغار واسترداد قائمة منقولات',
    readinessScore: 92,
    date: 'أمس، 04:15 م',
    status: 'scheduled',
    summary: 'صدر حكم نفقة نهائي بمبلغ 4000 جنيه شهرياً، والزوج ممتنع عن السداد منذ 7 أشهر مع تهريب المنقولات الزوجية.',
    budgetEst: '8,000 ج.م'
  },
  {
    id: 'lead-3',
    clientName: 'م. تامر جلال الشاذلي',
    clientPhone: '01229401823',
    caseCategory: 'labor',
    caseTitle: 'فصل تعسفي وإنهاء خدمة بدون إخطار أو تحقيق',
    readinessScore: 78,
    date: 'منذ يومين',
    status: 'reviewed',
    summary: 'تم إخطاري بالفصل بعد 5 سنوات خدمة، وتم تحرير محضر إثبات حالة بقسم شرطة قصر النيل وتقديم شكوى مكتب العمل.',
    budgetEst: '12,000 ج.م'
  },
  {
    id: 'lead-4',
    clientName: 'كريم محمود الإسكندراني',
    clientPhone: '01099238471',
    caseCategory: 'criminal',
    caseTitle: 'طعن بالتزوير صلب وتوقيع في جنحة إيصال أمانة على بياض',
    readinessScore: 65,
    date: 'منذ 3 أيام',
    status: 'new',
    summary: 'إيصال أمانة محرر كضمان لشراكة تجارية، والخصم قام بملء صلب الإيصال بمبلغ 450 ألف جنيه وتحددت جلسة معارضة.',
    budgetEst: '20,000 ج.م'
  }
];

export const LawyerDashboard: React.FC = () => {
  const [leads, setLeads] = useState<LawyerDashboardLead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<LawyerDashboardLead | null>(INITIAL_LEADS[0]);
  const [replyText, setReplyText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [replySuccess, setReplySuccess] = useState(false);

  const filteredLeads = leads.filter(l => {
    return filterCategory === 'all' || l.caseCategory === filterCategory;
  });

  const handleUpdateStatus = (id: string, newStatus: LawyerDashboardLead['status']) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedLead) return;
    setReplySuccess(true);
    setTimeout(() => {
      handleUpdateStatus(selectedLead.id, 'reviewed');
      setReplyText('');
      setReplySuccess(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>بوابة المحامين المعتمدين | إدارة القضايا والموكلين</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          لوحة تحكم المحامي والمستشار القانوني
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          إدارة ومتابعة طلبات الاستشارة الواردة، فحص ملفات القضايا المحررة والجاهزة للمرافعة، وتحديد المواعيد القضائية بدقة وسرية.
        </p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">الاستشارات الواردة هذا الشهر</span>
          <span className="text-2xl font-black text-white">{leads.length} ملفات</span>
          <span className="text-[11px] text-emerald-400 block pt-1 font-semibold">+18% نمو الموكلين</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">جلسات استشارية مؤكدة</span>
          <span className="text-2xl font-black text-amber-400">
            {leads.filter(l => l.status === 'scheduled').length + 2} جلسات
          </span>
          <span className="text-[11px] text-slate-400 block pt-1">مجدولة هذا الأسبوع</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">متوسط نسبة جاهزية الملفات</span>
          <span className="text-2xl font-black text-emerald-400">80%</span>
          <span className="text-[11px] text-slate-400 block pt-1">مستندات مفحوصة آلياً</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">الأتعاب والرسوم المقدرة</span>
          <span className="text-2xl font-black text-white">55,000 <span className="text-xs font-normal text-slate-400">ج.م</span></span>
          <span className="text-[11px] text-emerald-400 block pt-1 font-semibold">تحصيل مضمون</span>
        </div>
      </div>

      {/* Main Grid: Leads list & Selected Lead Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Leads list */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-500" />
                <span>الملفات الواردة ({filteredLeads.length})</span>
              </h3>

              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="all">كافة التخصصات</option>
                {CASE_CATEGORIES_METADATA.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto scrollbar-none pt-1">
              {filteredLeads.map(lead => {
                const isSelected = selectedLead?.id === lead.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                      isSelected
                        ? 'bg-slate-800 border-amber-500/60 shadow-md ring-1 ring-amber-500/20'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">
                        {lead.clientName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        lead.status === 'new' ? 'bg-amber-500/20 text-amber-300' :
                        lead.status === 'scheduled' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {lead.status === 'new' ? 'جديد' : lead.status === 'scheduled' ? 'مجدول' : 'تمت المراجعة'}
                      </span>
                    </div>

                    <p className="text-slate-300 line-clamp-1 font-medium">
                      {lead.caseTitle}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/40">
                      <span>جاهزية الملف: <span className="font-bold text-emerald-400">{lead.readinessScore}%</span></span>
                      <span>{lead.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Selected Lead Detailed dossier & Action */}
        <div className="lg:col-span-2 space-y-6">
          {selectedLead ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">
                    تفاصيل ملف الاستشارة القانونية
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {selectedLead.caseTitle}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 flex-wrap">
                    <span className="text-slate-200 font-bold">{selectedLead.clientName}</span>
                    <span>·</span>
                    <span className="font-mono text-emerald-400 flex items-center gap-1" dir="ltr">
                      <Phone className="w-3.5 h-3.5" />
                      {selectedLead.clientPhone}
                    </span>
                    <span>·</span>
                    <span>تاريخ الإرسال: {selectedLead.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedLead.status}
                    onChange={e => handleUpdateStatus(selectedLead.id, e.target.value as any)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="new">حالة: جديد</option>
                    <option value="reviewed">حالة: تمت المراجعة</option>
                    <option value="scheduled">حالة: موعد محجوز</option>
                    <option value="closed">حالة: منتهي</option>
                  </select>
                </div>
              </div>

              {/* Facts & Summary */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  سرد الوقائع وملخص النزاع:
                </h4>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                  {selectedLead.summary}
                </div>
              </div>

              {/* Readiness & Evidence Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">مؤشر تماسك الدعوى</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {selectedLead.readinessScore}%
                    </span>
                    <span className="text-xs text-slate-300">مكتمل الأركان</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">الميزانية والأتعاب المقترحة</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {selectedLead.budgetEst}
                    </span>
                    <span className="text-xs text-slate-400">تقدير أولي</span>
                  </div>
                </div>
              </div>

              {/* Direct Lawyer Reply Form */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Send className="w-4 h-4 text-amber-500" />
                  <span>إرسال الرأي القانوني الأولي أو تحديد موعد للموكل:</span>
                </h4>

                <textarea
                  rows={3}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="اكتب توجيهك القانوني الأولي للموكل، أو حدد موعد الحضور لمقر المكتب..."
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    سيصل الرد مباشرة إلى هاتف الموكل المسجل عبر SMS ورسالة واتساب مشفرة.
                  </span>

                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || replySuccess}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2"
                  >
                    {replySuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم إرسال الرأي للموكل!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>إرسال الرد الرسمي</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-3xl">
              اختر ملفاً من القائمة الجانبية لعرض تفاصيل القضية والمستندات.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

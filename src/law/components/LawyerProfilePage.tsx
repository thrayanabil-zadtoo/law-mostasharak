import React, { useState } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  ShieldCheck, 
  Award, 
  Briefcase, 
  Calendar, 
  Globe, 
  Building2, 
  MessageSquare
} from 'lucide-react';
import { Lawyer, CaseCategory } from '../types';
import { CASE_CATEGORIES_METADATA } from '../data/egyptianLegalKnowledge';
import { ConsultationBookingModal } from './ConsultationBookingModal';

interface LawyerProfilePageProps {
  lawyer: Lawyer;
  onBack: () => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

export const LawyerProfilePage: React.FC<LawyerProfilePageProps> = ({
  lawyer,
  onBack
}) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const getSpecialtyTitle = (catId: CaseCategory) => {
    return CASE_CATEGORIES_METADATA.find(c => c.id === catId)?.title || catId;
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Top back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لدليل المحامين المعتمدين</span>
        </button>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
            <div className="relative">
              <img
                src={lawyer.avatarUrl}
                alt={lawyer.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md"
              />
              <span className="absolute -bottom-2 -left-2 bg-emerald-600 text-white p-1 rounded-lg shadow-sm" title="محامٍ معتمد ومقيد بنقابة المحامين">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {lawyer.fullName}
                </h1>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {lawyer.courtDegree === 'cassation' ? 'نقض ودستورية' : lawyer.courtDegree === 'appeal' ? 'استئناف عالي' : 'ابتدائي'}
                </span>
              </div>

              <p className="text-slate-300 text-sm font-medium">
                {lawyer.title}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-400 justify-center sm:justify-start flex-wrap pt-1">
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  رقم القيد: {lawyer.licenseNumber}
                </span>
                <span>·</span>
                <span>{lawyer.barAssociationUnion}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {lawyer.governorate} ({lawyer.cityArea})
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-8 py-3.5 bg-gradient-to-l from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold rounded-2xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              <span>حجز موعد استشارة فورية</span>
            </button>
            <div className="text-center md:text-left text-xs text-slate-400">
              قيمة الاستشارة: <span className="font-bold text-amber-400 text-base">{lawyer.consultationFee.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>
        </div>

        {/* Quick Numbers Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-0.5">التقييم العام</span>
            <div className="flex items-center justify-center gap-1.5 font-bold text-lg text-white">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{lawyer.rating}</span>
              <span className="text-xs text-slate-400">({lawyer.reviewCount} تقييم)</span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-0.5">الخبرة المهنية</span>
            <div className="font-bold text-lg text-white">
              {lawyer.yearsOfExperience} <span className="text-xs font-normal text-slate-400">سنة مرافعة</span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-0.5">طرق الاستشارة</span>
            <div className="font-semibold text-xs text-emerald-400 mt-1">
              مكتب · مكالمة مشفرة · كتابي
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-0.5">اللغات المعتمدة</span>
            <div className="font-semibold text-xs text-slate-300 mt-1">
              {lawyer.languages.join(' · ')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bio & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-500" />
              نبذة وخبرات المرافعة
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
              {lawyer.bio}
            </p>

            <div className="pt-4 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                دوائر الاختصاص والخبرات القضائية:
              </h4>
              <div className="flex flex-wrap gap-2">
                {lawyer.specialties.map(spec => (
                  <span
                    key={spec}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/60"
                  >
                    {getSpecialtyTitle(spec)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              أبرز الإنجازات والأحكام القضائية المسجلة
            </h3>
            <div className="space-y-3">
              {lawyer.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
                  <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {ach}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Client Reviews */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                تقييمات وآراء الموكلين
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {lawyer.reviews.length} تقييم موثق
              </span>
            </div>

            <div className="space-y-3.5">
              {lawyer.reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{rev.authorName}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        موكل موثق
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span>· {rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "{rev.comment}"
                  </p>
                  <div className="text-[11px] text-slate-400">
                    موضوع القضية: {rev.caseType}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Office Location & Contact */}
        <div className="space-y-6">
          {/* Office card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" />
              مقر المكتب وساعات العمل
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                <span className="text-slate-400 block font-medium">العنوان التفصيلي:</span>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {lawyer.address}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400">أيام استقبال الاستشارات:</span>
                <span className="text-slate-200 font-semibold">السبت - الخميس (02:00 م - 09:00 م)</span>
              </div>
            </div>

            {/* Simulated Map Visual */}
            <div className="h-44 rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden relative flex items-center justify-center text-center p-4">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">{lawyer.cityArea}، {lawyer.governorate}</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  خط عرض: {lawyer.coordinates.lat.toFixed(4)} | خط طول: {lawyer.coordinates.lng.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          {/* Fast Contact Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500" />
              التواصل الرسمي والسكرتارية
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400">الهاتف المعتمد:</span>
                <span className="font-mono text-slate-200 font-bold" dir="ltr">{lawyer.phone}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400">البريد المهني:</span>
                <span className="font-mono text-slate-300">{lawyer.email}</span>
              </div>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>مواعيد الحجز المباشرة المتاحة</span>
            </button>
          </div>
        </div>
      </div>

      <ConsultationBookingModal
        lawyer={lawyer}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};

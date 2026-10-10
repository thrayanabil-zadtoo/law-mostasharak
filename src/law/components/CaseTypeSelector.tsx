import React, { useState } from 'react';
import { 
  Scale, 
  FileText, 
  Home, 
  Users, 
  Briefcase, 
  Building2, 
  Car, 
  Coins, 
  PenLine, 
  Landmark, 
  Search, 
  HelpCircle, 
  Sparkles, 
  Shield, 
  ArrowLeft,
  Check
} from 'lucide-react';
import { CaseCategory } from '../types';
import { CASE_CATEGORIES_METADATA } from '../data/egyptianLegalKnowledge';

interface CaseTypeSelectorProps {
  selectedCategory?: CaseCategory;
  onSelectCategory: (category: CaseCategory) => void;
  onHelpMeDecide?: () => void;
}

export const CaseTypeSelector: React.FC<CaseTypeSelectorProps> = ({
  selectedCategory = 'real_estate',
  onSelectCategory,
  onHelpMeDecide
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'felonies':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-amber-400">
            <Scale className="w-6 h-6" />
          </div>
        );
      case 'misdemeanors':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200">
            <FileText className="w-6 h-6" />
          </div>
        );
      case 'civil_compensation':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-rose-400">
            <Home className="w-6 h-6" />
          </div>
        );
      case 'family':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-amber-300">
            <Users className="w-6 h-6" />
          </div>
        );
      case 'labor':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-amber-600">
            <Briefcase className="w-6 h-6" />
          </div>
        );
      case 'commercial':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-sky-400">
            <Building2 className="w-6 h-6" />
          </div>
        );
      case 'real_estate':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <span className="text-2xl">🏗️</span>
          </div>
        );
      case 'traffic_compensation':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-red-400">
            <Car className="w-6 h-6" />
          </div>
        );
      case 'checks_debts':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-emerald-400">
            <Coins className="w-6 h-6" />
          </div>
        );
      case 'contracts_drafting':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-indigo-400">
            <PenLine className="w-6 h-6" />
          </div>
        );
      case 'administrative':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-cyan-400">
            <Landmark className="w-6 h-6" />
          </div>
        );
      case 'constitutional':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-amber-500">
            <Scale className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-amber-400">
            <Scale className="w-6 h-6" />
          </div>
        );
    }
  };

  const filteredCategories = CASE_CATEGORIES_METADATA.filter(cat => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) ||
      cat.subtitle.toLowerCase().includes(q) ||
      cat.badge.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Section Header Matching Image 2 */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>الخطوة الأولى: تحديد نوع القضية</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          ما نوع <span className="text-amber-400">مشكلتك القانونية؟</span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          اختر القسم الأقرب لوقائع موضوعك للبدء في جلسة حوارية مخصصة تجمع المعلومات وتكشف الثغرات والمواعيد طبقاً للقانون المصري.
        </p>
      </div>

      {/* Search & Help Buttons Bar Matching Image 2 */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
        {/* Help button */}
        <button
          onClick={onHelpMeDecide}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-slate-950" />
          <span>لا أعرف نوع القضية؟ (مساعدة ذكية)</span>
        </button>

        {/* Search input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="ابحث في أنواع القضايا (مثال: شيك، طلاق، إيجار)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a1120] border border-slate-800 rounded-2xl pl-4 pr-11 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
        </div>
      </div>

      {/* 12-Card Grid Matching Image 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {filteredCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group cursor-pointer rounded-2xl p-5 text-right transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0f172a] border-2 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10'
                  : 'bg-[#090e1a] border border-slate-800/90 hover:border-slate-700 hover:bg-[#0c1424]'
              }`}
            >
              {/* Top Row: Icon + Badge */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800/90 text-slate-300 border border-slate-700/60'
                  }`}>
                    {cat.badge}
                  </span>

                  <div>
                    {getCategoryIcon(cat.id)}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1.5 pt-1">
                  <h3 className={`text-base font-extrabold transition-colors leading-snug ${
                    isSelected ? 'text-amber-400' : 'text-white group-hover:text-amber-400'
                  }`}>
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Footer Row */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className={`inline-flex items-center gap-1 font-bold ${
                  isSelected ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      <span>تم التحديد</span>
                    </>
                  ) : (
                    <>
                      <span>اختر هذا القسم</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </>
                  )}
                </span>

                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-amber-500" />
                  <span>قوانين مصرية</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

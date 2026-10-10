import React, { useState } from 'react';
import { 
  Scale, 
  MessageSquare, 
  FolderPlus, 
  FileSearch, 
  BookOpen, 
  Users, 
  Briefcase, 
  Server, 
  ShieldCheck, 
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Bot,
  MapPin
} from 'lucide-react';
import { CaseCategory, Lawyer, CaseFile } from './types';
import { CaseTypeSelector } from './components/CaseTypeSelector';
import { LegalAIAgentChat } from './components/LegalAIAgentChat';
import { CaseFileBuilder } from './components/CaseFileBuilder';
import { DocumentAnalyzer } from './components/DocumentAnalyzer';
import { EgyptianCodexViewer } from './components/EgyptianCodexViewer';
import { LawyersDirectory } from './components/LawyersDirectory';
import { LawyerProfilePage } from './components/LawyerProfilePage';
import { LawyerDashboard } from './components/LawyerDashboard';
import { AdminGatewayPanel } from './components/AdminGatewayPanel';

type ActiveTab = 
  | 'home'
  | 'chat'
  | 'case_builder'
  | 'analyzer'
  | 'codex'
  | 'lawyers'
  | 'lawyer_profile'
  | 'lawyer_dashboard'
  | 'gateway_admin'
  | 'gateway_ai';

export const LawPlatform: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CaseCategory>('real_estate');

  const handleSelectLawyer = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setActiveTab('lawyer_profile');
  };

  const handleCategoryPicked = (cat: CaseCategory) => {
    setSelectedCategory(cat);
    // Switch to interactive smart assistant with category pre-selected
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-amber-500 selection:text-slate-950" dir="rtl">
      {/* Top Header Matching Image 1 Exactly */}
      <header className="sticky top-0 z-50 bg-[#030712]/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          {/* Logo & Brand on the Right */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Scale className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-white tracking-tight">
                  مستشارك
                </span>
                <span className="text-[11px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-sm">
                  القانوني الذكي
                </span>
              </div>
              <p className="text-[11px] text-amber-500/80 font-bold">
                القانون المصري EG
              </p>
            </div>
          </div>

          {/* Navigation Links in Center / Left */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold">
            {/* 1. الرئيسية */}
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              الرئيسية
            </button>

            {/* 2. المستشار الذكي */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>المستشار الذكي</span>
              <span>💬</span>
            </button>

            {/* 3. ملف القضية */}
            <button
              onClick={() => setActiveTab('case_builder')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'case_builder'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>ملف القضية</span>
              <span>📄</span>
            </button>

            {/* 4. فحص المستندات */}
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'analyzer'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>فحص المستندات</span>
              <span>📎</span>
            </button>

            {/* 5. دليل المحامين والخرائط */}
            <button
              onClick={() => setActiveTab('lawyers')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'lawyers' || activeTab === 'lawyer_profile'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>دليل المحامين والخرائط</span>
              <span>🗺️</span>
            </button>

            {/* 6. الموسوعة القانونية */}
            <button
              onClick={() => setActiveTab('codex')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'codex'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>الموسوعة القانونية</span>
              <span>📖</span>
            </button>

            {/* 7. جيت واي المشرف */}
            <button
              onClick={() => setActiveTab('gateway_admin')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'gateway_admin'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>جيت واي المشرف</span>
              <span>⚡</span>
            </button>

            {/* 8. جيت واي AI */}
            <button
              onClick={() => setActiveTab('gateway_ai')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'gateway_ai'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>جيت واي AI</span>
              <span>⚡</span>
            </button>

            {/* 9. بوابة المحامي */}
            <button
              onClick={() => setActiveTab('lawyer_dashboard')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'lawyer_dashboard'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>بوابة المحامي</span>
              <span>💼</span>
            </button>
          </nav>

          {/* Leftmost CTA Button Matching Image 1 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <div className="text-right leading-tight">
                <div>ابدأ استشارتك الآن</div>
              </div>
              <span className="text-base">⚖️</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Bar */}
        <div className="xl:hidden border-t border-slate-800/80 px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-2 text-xs font-bold bg-[#030712]">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'home' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'chat' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            المستشار الذكي 💬
          </button>
          <button
            onClick={() => setActiveTab('case_builder')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'case_builder' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            ملف القضية 📄
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'analyzer' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            فحص المستندات 📎
          </button>
          <button
            onClick={() => setActiveTab('lawyers')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'lawyers' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            دليل المحامين 🗺️
          </button>
          <button
            onClick={() => setActiveTab('codex')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'codex' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            الموسوعة 📖
          </button>
          <button
            onClick={() => setActiveTab('lawyer_dashboard')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'lawyer_dashboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            بوابة المحامي 💼
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full">
        {/* HOMEPAGE VIEW (Matching Screenshots 1, 2, and 3) */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-20">
            {/* HERO SECTION MATCHING IMAGE 1 */}
            <section className="relative pt-12 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-8">
              {/* Top Capsule Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#12131c]/90 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-bold shadow-sm">
                <span>⚖️</span>
                <span>مستشارك القانوني الذكي • جمهورية مصر العربية</span>
              </div>

              {/* Big Bold Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.25]">
                  افهم مشكلتك القانونية أولاً...
                </h1>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-amber-400 tracking-tight leading-[1.25]">
                  ثم اتخذ خطوتك بثقة.
                </h2>
              </div>

              {/* Subtitle Description */}
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
                أول وكيل ذكاء اصطناعي قانوني حواري متخصص في نصوص وقضاء القانون المصري. يجمع الوقائع خطوة بخطوة، يقيس اكتمال الأدلة، يستخرج سيناريوهات القضية، ويربطك بأفضل المحامين المعتمدين بالقرب من موقعك.
              </p>

              {/* CTA Action Buttons Matching Image 1 */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
                {/* Button 1: ابدأ الاستشارة الآن مجاناً */}
                <button
                  onClick={() => setActiveTab('chat')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-950 stroke-[3]" />
                  <span>ابدأ الاستشارة الآن مجاناً</span>
                </button>

                {/* Button 2: تصفح المحامين الأقرب لك جغرافياً */}
                <button
                  onClick={() => setActiveTab('lawyers')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#090e1a] hover:bg-[#0f172a] border border-slate-800 text-slate-200 font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="text-teal-400 text-lg">↗</span>
                  <span>تصفح المحامين الأقرب لك جغرافياً</span>
                </button>
              </div>
            </section>

            {/* THREE STEPS / FEATURES CARDS MATCHING IMAGE 2 */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1 */}
                <div 
                  onClick={() => setActiveTab('chat')}
                  className="p-6 rounded-3xl bg-[#090e1a] border border-slate-800/90 hover:border-slate-700 transition-all text-center space-y-3 cursor-pointer group"
                >
                  <div className="text-base font-extrabold text-white flex items-center justify-center gap-2">
                    <span>①</span>
                    <span>🤖</span>
                    <span className="group-hover:text-amber-400 transition-colors">الذكاء الاصطناعي القانوني</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    حوار استقصائي يفهم الواقعة ويكتشف الثغرات ونسب اكتمال الأدلة.
                  </p>
                </div>

                {/* Card 2 */}
                <div 
                  onClick={() => setActiveTab('case_builder')}
                  className="p-6 rounded-3xl bg-[#090e1a] border border-slate-800/90 hover:border-slate-700 transition-all text-center space-y-3 cursor-pointer group"
                >
                  <div className="text-base font-extrabold text-white flex items-center justify-center gap-2">
                    <span>②</span>
                    <span>📁</span>
                    <span className="group-hover:text-amber-400 transition-colors">تجهيز ملف القضية المنظم</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    ملخص زمني، أطراف النزاع، المستندات المتاحة والمفقودة، وقابلية الطباعة PDF.
                  </p>
                </div>

                {/* Card 3 */}
                <div 
                  onClick={() => setActiveTab('lawyers')}
                  className="p-6 rounded-3xl bg-[#090e1a] border border-slate-800/90 hover:border-slate-700 transition-all text-center space-y-3 cursor-pointer group"
                >
                  <div className="text-base font-extrabold text-white flex items-center justify-center gap-2">
                    <span>③</span>
                    <span>🧑‍⚖️</span>
                    <span className="group-hover:text-amber-400 transition-colors">الوصول للمحامي المعتمد</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    تواصل مباشر مع محامٍ متخصص وحساب المسافة لمكتبه عبر GPS.
                  </p>
                </div>
              </div>
            </section>

            {/* WHAT IS YOUR LEGAL PROBLEM SECTION MATCHING IMAGE 2 & 3 */}
            <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <CaseTypeSelector
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryPicked}
                onHelpMeDecide={() => setActiveTab('chat')}
              />
            </section>
          </div>
        )}

        {/* 2. CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LegalAIAgentChat onNavigateTab={(tab) => {
              if (tab === 'case_builder') setActiveTab('case_builder');
              else if (tab === 'analyzer') setActiveTab('analyzer');
              else if (tab === 'lawyers') setActiveTab('lawyers');
            }} />
          </div>
        )}

        {/* 3. CASE BUILDER TAB */}
        {activeTab === 'case_builder' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CaseFileBuilder
              initialCategory={selectedCategory}
              onSendToLawyer={() => setActiveTab('lawyers')}
            />
          </div>
        )}

        {/* 4. DOCUMENT ANALYZER TAB */}
        {activeTab === 'analyzer' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DocumentAnalyzer />
          </div>
        )}

        {/* 5. EGYPTIAN CODEX VIEWER TAB */}
        {activeTab === 'codex' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EgyptianCodexViewer />
          </div>
        )}

        {/* 6. LAWYERS DIRECTORY TAB */}
        {activeTab === 'lawyers' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LawyersDirectory
              onSelectLawyer={handleSelectLawyer}
              defaultCategory={selectedCategory}
            />
          </div>
        )}

        {/* 7. LAWYER PROFILE PAGE */}
        {activeTab === 'lawyer_profile' && selectedLawyer && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LawyerProfilePage
              lawyer={selectedLawyer}
              onBack={() => setActiveTab('lawyers')}
            />
          </div>
        )}

        {/* 8. LAWYER DASHBOARD TAB */}
        {activeTab === 'lawyer_dashboard' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LawyerDashboard />
          </div>
        )}

        {/* 9. GATEWAY ADMIN / AI TABS */}
        {(activeTab === 'gateway_admin' || activeTab === 'gateway_ai') && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminGatewayPanel />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#02050e] py-10 text-slate-400 text-xs">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">منصة مستشارك القانوني المصري EG</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                توجيه قضائي وفحص للمستندات مستند لأحكام محكمة النقض والتشريعات المصرية السارية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400 flex-wrap justify-center">
            <button onClick={() => setActiveTab('home')} className="hover:text-amber-400 transition-colors">
              الرئيسية
            </button>
            <button onClick={() => setActiveTab('chat')} className="hover:text-amber-400 transition-colors">
              المستشار الذكي
            </button>
            <button onClick={() => setActiveTab('case_builder')} className="hover:text-amber-400 transition-colors">
              ملف القضية
            </button>
            <button onClick={() => setActiveTab('analyzer')} className="hover:text-amber-400 transition-colors">
              فحص المستندات
            </button>
            <button onClick={() => setActiveTab('codex')} className="hover:text-amber-400 transition-colors">
              الموسوعة القانونية
            </button>
            <button onClick={() => setActiveTab('lawyers')} className="hover:text-amber-400 transition-colors">
              دليل المحامين
            </button>
          </div>

          <div className="text-center md:text-left text-slate-500 font-mono text-[11px]">
            جمهورية مصر العربية © 2025 · مستشارك القانوني الذكي
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LawPlatform;

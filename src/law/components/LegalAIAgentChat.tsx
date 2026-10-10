import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Scale, 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  Building2, 
  RotateCcw,
  Bot,
  User,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';
import { AgentChatMessage, CaseCategory } from '../types';
import { getSmartAgentResponse } from '../utils/legalAgentEngine';

interface LegalAIAgentChatProps {
  onNavigateTab: (tab: string, payload?: unknown) => void;
}

const PRESET_TOPICS = [
  {
    title: 'إيصال أمانة على بياض والمادة 341',
    prompt: 'وقعت على إيصال أمانة على بياض لضمان قرض، والطرف الآخر كتب فيه نصف مليون جنيه ورفع ضدي جنحة تبديد، ما هو الموقف القانوني وأهم الدفوع في أول جلسة؟'
  },
  {
    title: 'بطلان القبض والتفتيش (قانون الإجراءات 174 لسنة 2025)',
    prompt: 'تم استيقافي وتفتيشي ذاتياً في الشارع بدون إذن نيابة وبدون ارتكاب أي جريمة، ما هي دفوع بطلان القبض والتفتيش لانتفاء حالة التلبس؟'
  },
  {
    title: 'تسجيل شقة بالشهر العقاري (القانون 9 لسنة 2022)',
    prompt: 'معي عقد بيع ابتدائي لشقة في المعادي ومستقر فيها منذ 6 سنوات، كيف أقوم بتسجيلها بالحيازة المستقرة وفق تعديلات قانون الشهر العقاري؟'
  },
  {
    title: 'دعوى خلع وقائمة المنقولات ونفقة الصغار',
    prompt: 'أريد رفع دعوى خلع ضد زوجي، هل الخلع يسقط قائمة المنقولات الزوجية أو نفقة أولادي الصغار؟ وما هي الإجراءات أمام محكمة الأسرة؟'
  },
  {
    title: 'فصل تعسفي وتعويض البطالة (قانون العمل والتأمينات)',
    prompt: 'الشركة أنهت خدمتي فجأة بعد 4 سنوات دون تحقيق، ما هي مهلة شكوى مكتب العمل الـ 10 أيام وقيمة التعويض وتعويض البطالة؟'
  },
  {
    title: 'تأسيس شركة شخص واحد (قانون 159 لسنة 1981)',
    prompt: 'أريد تأسيس شركة فردية ذات مسؤولية محدودة عبر هيئة الاستثمار GAFI لحماية أموالي الشخصية، ما هي الشروط ورأس المال؟'
  }
];

export const LegalAIAgentChat: React.FC<LegalAIAgentChatProps> = ({ onNavigateTab }) => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'agent',
      text: `مرحباً بك في مستشارك القانوني المصري المباشر. ⚖️
المحرك الذكي مغذّى ومحدّث بقاعدة المعرفة التشريعية والقضائية المصرية الكاملة:
• قانون الإجراءات الجنائية الجديد رقم 174 لسنة 2025 (نفاذ 1 أكتوبر 2026 وقواعده)
• قانون العقوبات رقم 58 لسنة 1937 وتعديلاته
• القانون المدني رقم 131 لسنة 1948 وأحكام محكمة النقض
• قوانين الأسرة والأحوال الشخصية وقائمة المنقولات
• قانون العمل 12 لسنة 2003 والتأمينات الاجتماعية 148 لسنة 2019
• قانون الشركات 159 لسنة 1981 وتعديلات الاستثمار والشهر العقاري الجديد

تفضل بطرح وقائع نزاعك أو سؤالك القانوني، وسيقوم المحرك بتطبيق منهجية التحليل العشارية لبيان التوصيف، الدفوع، البطلان، ونصوص المواد فوراً.`,
      timestamp: 'الآن'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: AgentChatMessage = {
      id: 'msg-' + Date.now().toString(36),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getSmartAgentResponse(text);
      const agentMsg: AgentChatMessage = {
        id: 'msg-rep-' + Date.now().toString(36),
        sender: 'agent',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        caseCategory: response.category,
        extractedReadiness: response.readiness,
        citedArticles: response.citedArticles,
        actionLinks: response.suggestedActions
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'agent',
        text: 'تمت إعادة ضبط جلسة الاستشارة. تفضل بطرح موضوع نزاعك أو سؤالك القانوني الجديد.',
        timestamp: 'الآن'
      }
    ]);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
            <Bot className="w-4 h-4" />
            <span>المساعد القانوني الذكي الفوري المعتمد</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            المستشار الآلي للمنظومة القضائية المصرية
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            مستشار قانوني تفاعلي يحلل وقائع النزاع، يستخرج المواد التشريعية وأحكام النقض المطابقة، ويوجهك بالدفوع والمستندات المطلوبة.
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>بدء استشارة جديدة</span>
        </button>
      </div>

      {/* Preset Topics Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
        <span className="text-xs font-bold text-slate-400 block mb-1">
          موضوعات واستشارات سريعة شائعة:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRESET_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(topic.prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-amber-600/20 hover:text-amber-300 hover:border-amber-500/40 border border-slate-700/60 text-slate-300 text-xs font-medium whitespace-nowrap transition-all"
            >
              {topic.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[640px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                msg.sender === 'user'
                  ? 'bg-amber-600 border-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 border-slate-700 text-amber-400'
              }`}>
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble Content */}
              <div className={`max-w-[85%] sm:max-w-[78%] space-y-3 ${
                msg.sender === 'user' ? 'text-left' : 'text-right'
              }`}>
                <div className={`p-4 sm:p-5 rounded-3xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-slate-950 font-semibold rounded-tl-sm selection:bg-black selection:text-white'
                    : 'bg-slate-850 border border-slate-800 text-slate-100 rounded-tr-sm space-y-3 shadow-md'
                }`}>
                  <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Cited Articles if present */}
                  {msg.citedArticles && msg.citedArticles.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                      <div className="font-bold text-amber-400 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>السند والنصوص التشريعية المصرية المطبقة:</span>
                      </div>
                      {msg.citedArticles.map((cite, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                          <span className="font-bold text-amber-300 block">{cite.law} - {cite.article}</span>
                          <span className="text-[11px] text-slate-400 mt-1 block italic">{cite.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Readiness gauge if present */}
                  {msg.extractedReadiness && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">نسبة تماسك واكتمال الدفوع:</span>
                      <span className="font-bold text-emerald-400 font-mono">~{msg.extractedReadiness}% جاهزية</span>
                    </div>
                  )}
                </div>

                {/* Quick Interactive Actions Links */}
                {msg.actionLinks && msg.actionLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.actionLinks.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (action.action === 'build_case_file') onNavigateTab('case_builder');
                          if (action.action === 'analyze_contract') onNavigateTab('analyzer');
                          if (action.action === 'find_lawyer') onNavigateTab('lawyers');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <span>{action.label}</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-500 block px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-3xl rounded-tr-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 mr-2">جاري البحث في أحكام محكمة النقض ونصوص القانون...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Form */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="اكتب استفسارك القانوني أو وقائع نزاعك هنا بالتفصيل..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-normal"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md shadow-amber-600/20 shrink-0"
              title="إرسال"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center text-[10px] text-slate-500 mt-2">
            مستشارك القانوني هو نظام ذكي للتوجيه القضائي الأولي ولا يغني عن التوكيل الرسمي لمحامٍ مقيد بالنقض.
          </div>
        </div>
      </div>
    </div>
  );
};

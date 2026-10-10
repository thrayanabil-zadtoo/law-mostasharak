import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard,
  Building,
  Video,
  FileText
} from 'lucide-react';
import { Lawyer, CaseCategory } from '../types';
import { saveConsultationToFirebase } from '../../firebase/services';

interface ConsultationBookingModalProps {
  lawyer: Lawyer;
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: CaseCategory;
  onConfirmBooking?: (bookingData: unknown) => void;
}

export const ConsultationBookingModal: React.FC<ConsultationBookingModalProps> = ({
  lawyer,
  isOpen,
  onClose,
  onConfirmBooking
}) => {
  const [selectedMode, setSelectedMode] = useState<'office' | 'encrypted_call' | 'written'>('office');
  const [selectedSlotId, setSelectedSlotId] = useState<string>(lawyer.slots[0]?.id || '');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [briefSummary, setBriefSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  if (!isOpen) return null;

  const currentSlot = lawyer.slots.find(s => s.id === selectedSlotId) || lawyer.slots[0];
  const fee = selectedMode === 'written' 
    ? Math.round(lawyer.consultationFee * 0.7) 
    : lawyer.consultationFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    setIsSubmitting(true);
    const code = 'MST-' + Math.floor(100000 + Math.random() * 900000);
    setGeneratedCode(code);

    saveConsultationToFirebase({
      bookingCode: code,
      lawyerId: lawyer.id,
      lawyerName: lawyer.fullName,
      clientName,
      clientPhone,
      mode: selectedMode,
      fee,
      slot: currentSlot
    }).finally(() => {
      setIsSubmitting(false);
      setBookingConfirmed(true);

      if (onConfirmBooking) {
        onConfirmBooking({
          bookingCode: code,
          lawyerId: lawyer.id,
          lawyerName: lawyer.fullName,
          clientName,
          clientPhone,
          mode: selectedMode,
          slot: currentSlot,
          fee
        });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-right">
            <span className="text-xs text-amber-500 font-semibold uppercase tracking-wider">
              حجز موعد استشارة قانونية مؤكدة
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {lawyer.fullName}
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 justify-end">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {lawyer.governorate} · {lawyer.cityArea}
            </p>
          </div>
        </div>

        {bookingConfirmed ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white">تم تأكيد حجز الاستشارة بنجاح!</h4>
              <p className="text-slate-300 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                تم إرسال تفاصيل الموعد ورابط الدخول المشفر إلى رقم الهاتف عبر الرسائل النصية والواتساب.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-right space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
                <span className="text-xs text-slate-400">رقم الحجز المرجعي:</span>
                <span className="text-base font-mono font-bold text-amber-400">{generatedCode}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">المحامي:</span>
                <span className="font-semibold text-white">{lawyer.fullName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">نوع الاستشارة:</span>
                <span className="text-white font-medium">
                  {selectedMode === 'office' ? 'حضوري بمقر المكتب' : selectedMode === 'encrypted_call' ? 'مكالمة هاتفية / فيديو مشفرة' : 'رأي قانوني كتابي مفصل'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">الموعد المحدد:</span>
                <span className="text-emerald-400 font-medium">{currentSlot?.day} · {currentSlot?.time}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-700/60">
                <span className="text-slate-400">قيمة الاستشارة المستحقة:</span>
                <span className="text-lg font-bold text-white">{fee.toLocaleString('ar-EG')} ج.م</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-600/20"
            >
              تم ومتابعة المنصة
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Mode selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2.5">
                اختر طريقة عقد الاستشارة
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMode('office')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedMode === 'office'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-300'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span className="text-xs font-bold">بمقر المكتب</span>
                  <span className="text-[10px] text-slate-400">مباشرة في المقر</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('encrypted_call')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedMode === 'encrypted_call'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-300'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span className="text-xs font-bold">مكالمة مشفرة</span>
                  <span className="text-[10px] text-slate-400">فيديو / اتصال</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('written')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedMode === 'written'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-300'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-xs font-bold">رأي كتابي</span>
                  <span className="text-[10px] text-slate-400">تقرير رسمي</span>
                </button>
              </div>
            </div>

            {/* Slots */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2.5 flex items-center justify-between">
                <span>المواعيد المتاحة بجدول المحامي</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  مواعيد مؤكدة فورية
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {lawyer.slots.map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                      selectedSlotId === slot.id
                        ? 'bg-slate-800 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{slot.day} ({slot.date})</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {slot.time}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full border ${selectedSlotId === slot.id ? 'bg-amber-500 border-amber-400' : 'border-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Client info */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  الاسم بالكامل (أو كما ترغب في التعريف) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد محمود إبراهيم"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>رقم الهاتف المحمول (لتأكيد الموعد عبر الواتساب) *</span>
                  <span className="text-[11px] text-slate-500">سري ومحمي 100%</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="010XXXXXXXX أو 011 / 012 / 015"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ملخص مختصر لموضوع الاستشارة أو النزاع
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: شراء شقة بعقد ابتدائي وأرغب في مراجعة سلسلة العقود قبل تسليم الدفعة الأولى..."
                  value={briefSummary}
                  onChange={e => setBriefSummary(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Fee and Submit */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">تكلفة الاستشارة:</span>
                <span className="text-2xl font-black text-amber-400">
                  {fee.toLocaleString('ar-EG')} <span className="text-sm font-normal text-slate-400">ج.م</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !clientName || !clientPhone}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>جاري تسجيل الحجز...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>تأكيد الحجز الآن</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>جلسة استشارية خاضعة لقانون سرية المحاماة وضمان استرداد الرسوم</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

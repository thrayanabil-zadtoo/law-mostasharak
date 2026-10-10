import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Filter, 
  Calendar, 
  Phone, 
  Briefcase, 
  ArrowUpDown, 
  Compass,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { Lawyer, CaseCategory } from '../types';
import { CERTIFIED_EGYPTIAN_LAWYERS, GOVERNORATES_LIST } from '../data/lawyersData';
import { CASE_CATEGORIES_METADATA } from '../data/egyptianLegalKnowledge';
import { ConsultationBookingModal } from './ConsultationBookingModal';

interface LawyersDirectoryProps {
  onSelectLawyer: (lawyer: Lawyer) => void;
  defaultCategory?: CaseCategory;
}

export const LawyersDirectory: React.FC<LawyersDirectoryProps> = ({
  onSelectLawyer,
  defaultCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGov, setSelectedGov] = useState('الكل');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(defaultCategory || 'all');
  const [selectedCourtDegree, setSelectedCourtDegree] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee_asc' | 'distance'>('rating');
  const [bookingLawyer, setBookingLawyer] = useState<Lawyer | null>(null);

  // Approximate center of Cairo for distance calc
  const userLat = 30.0444;
  const userLng = 31.2357;

  // Haversine formula distance calc
  const calculateDistanceKm = (lat: number, lng: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat - userLat) * (Math.PI / 180);
    const dLon = (lng - userLng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLat * (Math.PI / 180)) *
        Math.cos(lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const filteredLawyers = useMemo(() => {
    return CERTIFIED_EGYPTIAN_LAWYERS.filter(lawyer => {
      const matchesSearch = 
        lawyer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lawyer.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lawyer.cityArea.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGov = selectedGov === 'الكل' || lawyer.governorate === selectedGov;
      
      const matchesSpecialty = 
        selectedSpecialty === 'all' || 
        lawyer.specialties.includes(selectedSpecialty as CaseCategory);

      const matchesDegree = 
        selectedCourtDegree === 'all' || 
        lawyer.courtDegree === selectedCourtDegree;

      return matchesSearch && matchesGov && matchesSpecialty && matchesDegree;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.yearsOfExperience - a.yearsOfExperience;
      if (sortBy === 'fee_asc') return a.consultationFee - b.consultationFee;
      if (sortBy === 'distance') {
        const distA = calculateDistanceKm(a.coordinates.lat, a.coordinates.lng);
        const distB = calculateDistanceKm(b.coordinates.lat, b.coordinates.lng);
        return distA - distB;
      }
      return 0;
    });
  }, [searchQuery, selectedGov, selectedSpecialty, selectedCourtDegree, sortBy]);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>محامون معتمدون ومقيدون رسمياً بنقابة المحامين المصرية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            دليل كبار المحامين والمستشارين القانونيين
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            ابحث وتواصل مع نخبة محامي النقض والاستئناف في محافظتك، مع إمكانية الفرز حسب القرب الجغرافي وحجز الاستشارات المباشرة.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث بالاسم، المدينة، الحي، أو موضوع النزاع..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pr-11 pl-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Governorate */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">المحافظة</label>
            <select
              value={selectedGov}
              onChange={e => setSelectedGov(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {GOVERNORATES_LIST.map(gov => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">التخصص القضائي</label>
            <select
              value={selectedSpecialty}
              onChange={e => setSelectedSpecialty(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">كافة التخصصات القضائية</option>
              {CASE_CATEGORIES_METADATA.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          {/* Court Degree */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">درجة القيد بالنقابة</label>
            <select
              value={selectedCourtDegree}
              onChange={e => setSelectedCourtDegree(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">جميع درجات القيد</option>
              <option value="cassation">محامي بالنقض والدستورية العليا</option>
              <option value="appeal">محامي بالاستئناف العالي ومجلس الدولة</option>
              <option value="primary">محامي بالمحاكم الابتدائية</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">ترتيب النتائج حسب</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="rating">الأعلى تقييماً</option>
              <option value="experience">الأكثر سنوات خبرة</option>
              <option value="fee_asc">الأقل تكلفة استشارة</option>
              <option value="distance">الأقرب جغرافياً (حساب المسافة)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>عرض {filteredLawyers.length} محامٍ ومستشار معتمد</span>
        {sortBy === 'distance' && (
          <span className="text-amber-400 flex items-center gap-1 font-mono">
            <Compass className="w-3.5 h-3.5" />
            مرتب طبقاً لمسافة الكيلومترات من وسط القاهرة
          </span>
        )}
      </div>

      {/* Lawyers List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredLawyers.map(lawyer => {
          const distanceKm = calculateDistanceKm(lawyer.coordinates.lat, lawyer.coordinates.lng);

          return (
            <div
              key={lawyer.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 transition-all hover:shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-start gap-4">
                  <img
                    src={lawyer.avatarUrl}
                    alt={lawyer.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border border-amber-500/30 shrink-0"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base hover:text-amber-400 cursor-pointer transition-colors"
                          onClick={() => onSelectLawyer(lawyer)}>
                        {lawyer.fullName}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{lawyer.rating}</span>
                        <span className="text-slate-400 font-normal">({lawyer.reviewCount})</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">
                      {lawyer.title}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {lawyer.governorate} · {lawyer.cityArea}
                      </span>
                      <span>·</span>
                      <span className="text-emerald-400 font-medium">
                        يبعد ~{distanceKm} كم
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specialties chips */}
                <div className="flex flex-wrap gap-1.5">
                  {lawyer.specialties.slice(0, 3).map(s => {
                    const title = CASE_CATEGORIES_METADATA.find(c => c.id === s)?.title || s;
                    return (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-[11px] font-medium border border-slate-700/60"
                      >
                        {title}
                      </span>
                    );
                  })}
                  {lawyer.specialties.length > 3 && (
                    <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px]">
                      +{lawyer.specialties.length - 3} تخصصات
                    </span>
                  )}
                </div>

                {/* Short Bio */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {lawyer.bio}
                </p>
              </div>

              {/* Bottom Actions Row */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">رسوم الاستشارة:</span>
                  <span className="text-sm font-bold text-amber-400">
                    {lawyer.consultationFee.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectLawyer(lawyer)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    الملف الشخصي
                  </button>

                  <button
                    onClick={() => setBookingLawyer(lawyer)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-600/10 flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>حجز موعد</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {bookingLawyer && (
        <ConsultationBookingModal
          lawyer={bookingLawyer}
          isOpen={true}
          onClose={() => setBookingLawyer(null)}
        />
      )}
    </div>
  );
};

/**
 * منصة مستشارك القانوني | LAW Mostasharak
 * تعريفات ونماذج البيانات البرمجية الشاملة
 */

export type CaseCategory =
  | 'felonies'                 // قضايا الجنايات
  | 'misdemeanors'             // قضايا الجنح والمخالفات
  | 'civil_compensation'       // القضايا المدنية والتعويضات
  | 'family'                   // قضايا الأحوال الشخصية والأسرة
  | 'labor'                    // قضايا العمل والعمال
  | 'commercial'               // القضايا التجارية والشركات
  | 'real_estate'              // قضايا العقارات والإيجارات والتسجيل
  | 'traffic_compensation'     // قضايا الحوادث والتعويضات المرورية
  | 'checks_debts'             // قضايا الشيكات وإيصالات الأمانة
  | 'contracts_drafting'       // صياغة ومراجعة ونزاعات العقود
  | 'administrative'           // قضاء مجلس الدولة والنزاعات الإدارية
  | 'constitutional'           // المسائل والطعون الدستورية
  | 'criminal'                 // جنائي عام
  | 'civil'                    // مدني عام
  | 'cybercrime'               // جرائم تقنية
  | 'inheritance';             // مواريث وتركات

export interface CaseCategoryMeta {
  id: CaseCategory;
  title: string;
  subtitle: string;
  iconName: string;
  badge: string;
  statCount: number;
  description: string;
  commonCases: string[];
}

export interface LegalArticle {
  id: string;
  lawCode: string;
  lawTitle: string;
  articleNumber: string;
  chapterTitle?: string;
  text: string;
  explanation: string;
  practicalTips: string[];
  keywords: string[];
  lastAmended?: string;
}

export interface EgyptianCodexLaw {
  id: string;
  code: string;
  title: string;
  numberAndYear: string;
  category: CaseCategory;
  summary: string;
  totalArticles: number;
  lastUpdate: string;
  keyPrinciples: string[];
  articles: LegalArticle[];
}

export interface LawyerReview {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  caseType: string;
  verified: boolean;
}

export interface ConsultationSlot {
  id: string;
  day: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Lawyer {
  id: string;
  fullName: string;
  title: string; // e.g. محامي بالنقض والدستورية العليا
  courtDegree: 'cassation' | 'appeal' | 'primary'; // نقض / استئناف عالي / ابتدائي
  licenseNumber: string;
  barAssociationUnion: string; // نقابة المحامين الفرعية
  governorate: string; // المحافظة
  cityArea: string; // الحي / المنطقة
  address: string;
  phone: string;
  email: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  yearsOfExperience: number;
  bio: string;
  specialties: CaseCategory[];
  consultationFee: number; // بالجنيه المصري
  urgentConsultationFee: number;
  modes: ('office' | 'encrypted_call' | 'written')[];
  coordinates: {
    lat: number;
    lng: number;
  };
  achievements: string[];
  languages: string[];
  reviews: LawyerReview[];
  slots: ConsultationSlot[];
}

export interface ConsultationBooking {
  id: string;
  lawyerId: string;
  lawyerName: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  caseCategory: CaseCategory;
  briefSummary: string;
  mode: 'office' | 'encrypted_call' | 'written';
  scheduledDate: string;
  scheduledTime: string;
  fee: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  bookingCode: string;
  createdAt: string;
}

export interface CaseParty {
  role: 'plaintiff' | 'defendant' | 'witness' | 'expert'; // المدعي / المدعى عليه / شاهد / خبير
  name: string;
  nationalId?: string;
  relationship: string;
  notes?: string;
}

export interface CaseEvidenceItem {
  id: string;
  title: string;
  category: 'official_doc' | 'contract' | 'receipt' | 'digital_proof' | 'witness' | 'other';
  status: 'available' | 'missing' | 'in_progress';
  importance: 'critical' | 'supporting' | 'optional';
  description: string;
  legalWeight: number; // 1 to 10
}

export interface CaseFile {
  id: string;
  title: string;
  category: CaseCategory;
  summary: string;
  courtDegree: string;
  competentCourt: string; // المحكمة المختصة محلياً ونوعياً
  parties: CaseParty[];
  chronology: { date: string; event: string; legalSignificance: string }[];
  evidenceList: CaseEvidenceItem[];
  completenessScore: number; // 0 - 100%
  strengths: string[];
  weaknessesAndRisks: string[];
  statuteOfLimitations: {
    deadlineDescription: string;
    criticalDate?: string;
    isUrgent: boolean;
  };
  actionPlan: { step: number; title: string; legalBasis: string; timeEstimate: string }[];
  relevantArticles: { lawName: string; articleNumber: string; summary: string }[];
  estimatedCostRange: string;
  estimatedTimeline: string;
  status: 'draft' | 'ready_for_lawyer' | 'in_litigation';
  createdAt: string;
  updatedAt: string;
}

export interface ContractRisk {
  id: string;
  level: 'high' | 'medium' | 'low';
  title: string;
  clauseExcerpt: string;
  riskDescription: string;
  legalConsequence: string;
  egyptianLawRef: string;
  recommendedClause: string;
}

export interface DocumentAnalysisResult {
  id: string;
  fileName?: string;
  documentType: string;
  overallHealthScore: number; // 0 - 100
  summary: string;
  risks: ContractRisk[];
  missingCrucialClauses: string[];
  validityChecklist: { item: string; passed: boolean; note: string }[];
  actionableRecommendations: string[];
  analyzedAt: string;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  caseCategory?: CaseCategory;
  extractedReadiness?: number;
  citedArticles?: { law: string; article: string; text: string }[];
  actionLinks?: { label: string; action: string; payload?: unknown }[];
  isStreaming?: boolean;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  keyMasked: string;
  fullKey?: string;
  tier: 'free' | 'developer' | 'enterprise';
  rateLimitPerMinute: number;
  totalCalls: number;
  lastUsedAt: string;
  isActive: boolean;
  createdAt: string;
  allowedDomains: string[];
}

export interface LawyerDashboardLead {
  id: string;
  clientName: string;
  clientPhone: string;
  caseCategory: CaseCategory;
  caseTitle: string;
  readinessScore: number;
  date: string;
  status: 'new' | 'reviewed' | 'scheduled' | 'closed';
  summary: string;
  budgetEst: string;
}

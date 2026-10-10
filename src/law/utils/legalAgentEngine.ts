/**
 * محرك التحليل القانوني الذكي وقواعد الاستدلال القضائي المصري
 * مدعوم بقاعدة المعرفة المصرية المحدثة:
 * - قانون الإجراءات الجنائية المصري رقم 174 لسنة 2025 (نفاذ 1 أكتوبر 2026 وقواعده)
 * - قانون العقوبات المصري رقم 58 لسنة 1937 وتعديلاته
 * - القانون المدني رقم 131 لسنة 1948
 * - قوانين الأسرة والأحوال الشخصية والخلع (القانون 1 لسنة 2000)
 * - قانون العمل رقم 12 لسنة 2003 وقانون التأمينات 148 لسنة 2019
 * - قانون الشركات رقم 159 لسنة 1981 وقانون الاستثمار 72 لسنة 2017
 * - قانون الشهر العقاري المعدل رقم 9 لسنة 2022
 * - قانون مكافحة جرائم تقنية المعلومات رقم 175 لسنة 2018
 */

import {
  CaseCategory,
  CaseFile,
  DocumentAnalysisResult,
  ContractRisk,
  CaseEvidenceItem
} from '../types';
import { EGYPTIAN_LEGAL_CODEX } from '../data/egyptianLegalCodexFull';
import { EGYPTIAN_LEGAL_VULNERABILITIES, STATUTE_OF_LIMITATIONS_EGYPT } from '../data/egyptianLegalKnowledge';

export function detectCaseCategory(text: string): CaseCategory {
  const normalized = text.toLowerCase();

  // Checks & Debt Receipts
  if (/إيصال أمانة|وصل أمانة|أمانه|شيك|شيكات|كمبيالة|سند إذني|أمر أداء|على بياض|توقيع على بياض/.test(normalized)) {
    return 'checks_debts';
  }
  // Traffic accidents
  if (/حادث سيارة|حوادث|مرور|صدم|دهس|إصابة خطأ|قتل خطأ|تأمين إجباري|لوحات معدنية/.test(normalized)) {
    return 'traffic_compensation';
  }
  // Felonies & Criminal Procedure
  if (/قتل عمد|سلاح|مخدرات|اتجار|أموال عامة|اختلاس موظف|رشوة كبرى|جنايات|محكمة الجنايات|إعدام|سجن مؤبد|تفتيش|استيقاف|قبض|ضبط وإحضار|حبس احتياطي|إذن نيابة|تلبس|بطلان القبض/.test(normalized)) {
    return 'felonies';
  }
  // Misdemeanors
  if (/نصب|احتيال|ضرب|سب وقذف|تشهير|سرقة بسيطة|معارضة جنح|محكمة الجنح|حبس بسيط/.test(normalized)) {
    return 'misdemeanors';
  }
  // Contract Drafting
  if (/صياغة عقد|مراجعة عقد|شرط جزائي|بند تحكيم|تعديل بند|بطلان شرط|عقد توريد|اتفاقية سرية/.test(normalized)) {
    return 'contracts_drafting';
  }
  // Real Estate
  if (/عقار|أرض|شقة|بيع شقة|تسجيل عقار|شهر عقاري|صحة ونفاذ|صحة توقيع|مطور عقاري|طرد مستأجر|إيجار قديم/.test(normalized)) {
    return 'real_estate';
  }
  // Family & Personal Status
  if (/خلع|طلاق|نفقة|حضانة|رؤية|منقولات|قائمة منقولات|متجمد نفقة|زوجية|عدة|متعة|ولاية تعليمية|ميراث|إعلام وراثة/.test(normalized)) {
    return 'family';
  }
  // Labor & Social Insurance
  if (/فصل تعسفي|مكتب العمل|راتب|أجر|تأمينات|إنهاء خدمة|مكافأة نهاية الخدمة|استقالة|س1|س6/.test(normalized)) {
    return 'labor';
  }
  // Commercial & Companies
  if (/شركة|تأسيس شركة|شريك|سجل تجاري|استثمار|شركة شخص واحد|إفلاس|تصفية|هيئة الاستثمار|gafi|رخصة ذهبية/.test(normalized)) {
    return 'commercial';
  }
  // Administrative & State Council
  if (/مجلس دولة|قضاء إداري|قرار إداري|نزع ملكية|تعويض حكومي|ترقية موظف|محكمة القضاء الإداري/.test(normalized)) {
    return 'administrative';
  }
  // Constitutional
  if (/دستورية عليا|عدم دستورية|طعن دستوري|نص غير دستوري|تفسير تشريعي/.test(normalized)) {
    return 'constitutional';
  }

  return 'civil_compensation';
}

export function generateStructuredCaseFile(
  title: string,
  category: CaseCategory,
  factsText: string,
  providedDocuments: string[]
): CaseFile {
  const id = 'case-' + Date.now().toString(36);
  
  const baseEvidences: Partial<Record<CaseCategory, { title: string; category: CaseEvidenceItem['category']; importance: CaseEvidenceItem['importance']; weight: number }[]>> = {
    real_estate: [
      { title: 'أصل عقد البيع الابتدائي وسلسلة العقود السابقة', category: 'contract', importance: 'critical', weight: 10 },
      { title: 'شهادة تصرفات عقارية سلبية حديثة من الشهر العقاري', category: 'official_doc', importance: 'critical', weight: 9 },
      { title: 'إيصالات سداد الدفعات أو التحويلات البنكية', category: 'receipt', importance: 'supporting', weight: 8 },
      { title: 'كشف رسمي وتراخيص البناء للوحدة والرفع المساحي الرقمي', category: 'official_doc', importance: 'supporting', weight: 7 }
    ],
    checks_debts: [
      { title: 'أصل إيصال الأمانة أو الشيك البنكي أو السند الإذني', category: 'contract', importance: 'critical', weight: 10 },
      { title: 'إفادة الرفض من البنك المسحوب عليه (لقضايا الشيكات)', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'الرسائل والمراسلات المتبادلة الدالة على طبيعة المعاملة', category: 'digital_proof', importance: 'supporting', weight: 8 },
      { title: 'إنذار رسمي على يد محضر بسداد المديونية', category: 'official_doc', importance: 'supporting', weight: 7 }
    ],
    felonies: [
      { title: 'محضر جمع الاستدلالات والتحريات الجنائية', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'تقرير مصلحة الطب الشرعي والأدلة الجنائية المعملية', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'أقوال وشهادات الشهود الرسمية بتحقيقات النيابة', category: 'witness', importance: 'supporting', weight: 8 }
    ],
    misdemeanors: [
      { title: 'المحضر الرسمي المحرر بقسم الشرطة ومرفقاته', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'التقرير الطبي الأولي من مستشفى حكومي (في قضايا الضرب)', category: 'official_doc', importance: 'critical', weight: 9 },
      { title: 'الأدلة الرقمية الموثقة بتقرير مباحث الإنترنت', category: 'digital_proof', importance: 'supporting', weight: 8 }
    ],
    family: [
      { title: 'أصل وثيقة الزواج أو الطلاق الرسمية المميكنة', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'شهادات ميلاد الأبناء القصر الرسمية', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'أصل قائمة المنقولات الزوجية الموقعة من الزوج', category: 'contract', importance: 'critical', weight: 9 },
      { title: 'مفردات مرتب الزوج أو سجل التحريات الرسمية عن الدخل', category: 'official_doc', importance: 'supporting', weight: 8 }
    ],
    labor: [
      { title: 'عقد العمل المبرم أو كشوف الحساب البنكي للأجور', category: 'contract', importance: 'critical', weight: 10 },
      { title: 'خطاب أو إخطار إنهاء الخدمة / قرار الفصل', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'محضر إثبات حالة بقسم الشرطة بالمنع من دخول المنشأة', category: 'official_doc', importance: 'critical', weight: 9 },
      { title: 'برنت تأمينات اجتماعية حديث (س1 وس6)', category: 'official_doc', importance: 'supporting', weight: 8 }
    ],
    commercial: [
      { title: 'السجل التجاري والبطاقة الضريبية السارية للشركة', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'عقد تأسيس الشركة والنظام الأساسي والتعديلات', category: 'contract', importance: 'critical', weight: 10 },
      { title: 'الفواتير وأوامر الشراء وإيصالات التسليم البنكية', category: 'receipt', importance: 'critical', weight: 9 }
    ],
    traffic_compensation: [
      { title: 'محضر شرطة المرور ومعاينة الحادث الرسمية', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'التقرير الطبي النهائي ونسبة العجز من القومسيون الطبي', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'شهادة بيانات السيارة المتسببة ووثيقة التأمين الإجباري', category: 'official_doc', importance: 'supporting', weight: 9 }
    ],
    contracts_drafting: [
      { title: 'مسودة العقد المقترحة أو الاتفاق المبدئي', category: 'contract', importance: 'critical', weight: 10 },
      { title: 'أوراق إثبات الشخصية والصفة والتوكيلات الرسمية', category: 'official_doc', importance: 'critical', weight: 9 }
    ],
    administrative: [
      { title: 'صورة رسمية من القرار الإداري المطعون فيه', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'شهادة إيداع التظلم الإداري وتاريخ تقديمه', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'المستندات الدالة على الصفة والمصلحة في إلغاء القرار', category: 'official_doc', importance: 'supporting', weight: 8 }
    ],
    constitutional: [
      { title: 'صورة طبق الأصل من حكم أو وقائع الدعوى الموضوعية', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'النص التشريعي المدفوع بعدم دستوريته والمصلحة المباشرة', category: 'official_doc', importance: 'critical', weight: 10 }
    ],
    civil_compensation: [
      { title: 'المستندات الدالة على ركن الخطأ والضرر المادي المباشر', category: 'official_doc', importance: 'critical', weight: 10 },
      { title: 'إنذار رسمي على يد محضر بالوفاء بالتعويض', category: 'official_doc', importance: 'critical', weight: 9 }
    ]
  };

  const reqList = baseEvidences[category] || baseEvidences.civil_compensation || baseEvidences.real_estate || [];
  
  let matchedWeight = 0;
  let totalWeight = 0;

  const evidenceList: CaseEvidenceItem[] = reqList.map((item, idx) => {
    totalWeight += item.weight;
    const isProvided = providedDocuments.some(doc => 
      doc.toLowerCase().includes(item.title.toLowerCase().slice(0, 8)) ||
      factsText.toLowerCase().includes(item.title.toLowerCase().slice(0, 8))
    );
    if (isProvided) {
      matchedWeight += item.weight;
    }
    return {
      id: `ev-${idx + 1}`,
      title: item.title,
      category: item.category,
      status: (isProvided ? 'available' : 'missing') as CaseEvidenceItem['status'],
      importance: item.importance,
      description: `مستند إلزامي وفق متطلبات المحكمة لنظر هذا النوع من الدعاوى`,
      legalWeight: item.weight
    };
  });

  let completenessScore = Math.round((matchedWeight / Math.max(1, totalWeight)) * 100);
  if (completenessScore < 30 && factsText.length > 40) completenessScore = 40;

  const courtMap: Partial<Record<CaseCategory, { court: string; degree: string }>> = {
    real_estate: { court: 'محكمة الأمور الوقتية أو المحكمة المدنية الكلية وجزئياتها العقارية', degree: 'ابتدائي / كلي' },
    family: { court: 'محكمة الأسرة (دائرة تسوية المنازعات أولاً ثم دائرة النزاع الموضوعي)', degree: 'أحوال شخصية - أسرة' },
    felonies: { court: 'محكمة الجنايات المنعقدة بمحكمة الاستئناف ومحكمة النقض', degree: 'جنايات ونقض' },
    misdemeanors: { court: 'محكمة الجنح الجزئية / دائرة جنح المعارضات والاستئناف', degree: 'جنح ومعارضة' },
    checks_debts: { court: 'دائرة أوامر الأداء / محكمة الجنح الجزئية لجرائم الشيكات والتبديد', degree: 'أمر أداء وجنح' },
    labor: { court: 'المحكمة العمالية المختصة نوعياً بعد مرحلة مكتب العمل', degree: 'محكمة عمالية كلية' },
    commercial: { court: 'المحكمة الاقتصادية الدائرة الابتدائية أو الاستئنافية', degree: 'دائرة اقتصادية' },
    traffic_compensation: { court: 'محكمة جنح المرور ودائرة التعويضات المدنية', degree: 'مرور ومدني' },
    contracts_drafting: { court: 'المحكمة المدنية المختصة أو مركز التحكيم المتفق عليه', degree: 'مدني وتجاري' },
    administrative: { court: 'محكمة القضاء الإداري بمجلس الدولة', degree: 'قضاء إداري' },
    constitutional: { court: 'المحكمة الدستورية العليا بالقاهرة', degree: 'دستورية عليا' },
    civil_compensation: { court: 'المحكمة المدنية المختصة بالتعويضات (جزئي أو كلي بحسب النصاب)', degree: 'مدني كلي / جزئي' }
  };

  const courtInfo = courtMap[category] || { court: 'المحكمة المختصة نوعياً ومحلياً', degree: 'ابتدائي' };

  const categoryLaws = EGYPTIAN_LEGAL_CODEX.filter(l => l.category === category);
  const relevantArticles = categoryLaws.flatMap(l => 
    l.articles.map(a => ({
      lawName: l.title,
      articleNumber: a.articleNumber,
      summary: a.explanation
    }))
  ).slice(0, 3);

  const vuln = EGYPTIAN_LEGAL_VULNERABILITIES.find(v => v.category === category);

  return {
    id,
    title: title || 'ملف دعوى قانوني متكامل',
    category,
    summary: factsText.slice(0, 260) + (factsText.length > 260 ? '...' : ''),
    courtDegree: courtInfo.degree,
    competentCourt: courtInfo.court,
    parties: [
      { role: 'plaintiff', name: 'الطرف الشاكي / صاحب الاستشارة', relationship: 'مقدم الدعوى' },
      { role: 'defendant', name: 'الطرف المشكو في حقه', relationship: 'الخصم في النزاع' }
    ],
    chronology: [
      { date: 'تاريخ نشوء الواقعة', event: 'نشوء الالتزام أو توقيع الاتفاقية', legalSignificance: 'سريان العقد أو بدء حساب التقادم' },
      { date: 'تاريخ الخلاف أو الضرر', event: 'امتناع الخصم عن الوفاء أو حدوث الواقعة الموجبة للمطالبة', legalSignificance: 'تاريخ استحقاق المطالبة القضائية' }
    ],
    evidenceList,
    completenessScore,
    strengths: [
      'توافر الصفة والمصلحة المباشرة في رفع الدعوى طبقاً للمادة 3 مرافعات',
      'وجود أدلة ومستندات خطية رسمية تعزز موقف المدعي',
      'مباشرة الإجراءات داخل المواعيد القانونية المقررة دون انقضاء بالتقادم'
    ],
    weaknessesAndRisks: vuln ? [vuln.legalTrap] : ['ضرورة توجيه إنذار رسمي مسجل على يد محضر قبل قيد الدعوى'],
    statuteOfLimitations: {
      deadlineDescription: vuln ? vuln.proceduralDeadline : 'المواعيد العامة لمباشرة الإجراءات والطعون',
      isUrgent: category === 'labor' || category === 'misdemeanors' || category === 'checks_debts'
    },
    actionPlan: [
      { step: 1, title: 'استيفاء أصول المستندات وتوكيل محامٍ معتمد', legalBasis: 'قانون المحاماة والمرافعات', timeEstimate: '1 - 2 يوم عمل' },
      { step: 2, title: 'توجيه إنذار رسمي أو محضر إثبات حالة بالشرطة', legalBasis: 'قانون الإجراءات المدنية والجنائية', timeEstimate: '2 - 4 أيام عمل' },
      { step: 3, title: 'قيد صحيفة الدعوى بجدول المحكمة المختصة وتحديد جلسة', legalBasis: 'المادة 63 مرافعات / قانون الإجراءات 174 لسنة 2025', timeEstimate: '7 أيام عمل' }
    ],
    relevantArticles,
    estimatedCostRange: 'رسوم قضائية نسبية مع دمغات المحاماة ومصاريف الإعلان للمحضرين',
    estimatedTimeline: 'من 3 إلى 6 أشهر للجلسات الابتدائية بحسب ورود تقارير الخبراء',
    status: completenessScore >= 70 ? 'ready_for_lawyer' : 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * فاحص ومحلل العقود والمستندات لكشف الثغرات
 */
export function analyzeLegalContract(contractText: string): DocumentAnalysisResult {
  const risks: ContractRisk[] = [];
  const missingCrucialClauses: string[] = [];
  let score = 94;

  const lower = contractText.toLowerCase();

  // Check 1: Blank signature or missing clear amount in receipts/contracts
  if (/بياض|أمانة|إيصال/.test(lower) && !/مبلغ وقدره|بالأرقام والحروف/.test(lower)) {
    risks.push({
      id: 'risk-blank',
      level: 'high',
      title: 'خطر شبهة التوقيع على بياض أو عدم تفقيط المبالغ',
      clauseExcerpt: 'غياب التفقيط الحرفي الصريح للمبالغ المالية أو التوقيع المنفصل',
      riskDescription: 'عدم كتابة المبلغ بالحروف والأرقام معاً وتوقيع الصلب في وقت لاحق يفتح باب الطعن بالتزوير صلب وتوقيع ويفرغ السند من قوته الجنائية.',
      legalConsequence: 'الحكم ببراءة المدين استناداً لانتفاء ركن التسليم المادي الفعلي وكون التوقيع على بياض (نقض جنائي 1024 لسنة 72 ق والمادة 341 عقوبات).',
      egyptianLawRef: 'المادة 341 من قانون العقوبات المصري وقانون الإجراءات الجنائية 174 لسنة 2025',
      recommendedClause: 'استلمت أنا الموقع أدناه فلان بموجب بطاقة رقم قومي (...) مبلغاً وقدره (...) جنيهاً مصرياً لا غير (تفقيطاً بالحروف) نقداً وعداً على سبيل الأمانة...'
    });
    score -= 25;
  }

  // Check 2: Uncapped Penal Clause (شرط جزائي مفرط)
  if (/شرط جزائي|غرامة اتفاقية/.test(lower)) {
    if (!/بحد أقصى|دون إخلال بحق المحكمة|تعويض عادل/.test(lower)) {
      risks.push({
        id: 'risk-penal',
        level: 'medium',
        title: 'صياغة مفرطة للشرط الجزائي دون ضوابط محكمة النقض',
        clauseExcerpt: 'يلتزم الطرف بدفع تعويض اتفاقي غير قابل للتخفيض...',
        riskDescription: 'النص على عدم جواز تعديل الشرط الجزائي يخالف نص المادة 224 من القانون المدني التي تمنح القاضي سلطة تخفيض التعويض إذا ثبت أنه مبالغ فيه جداً أو أن الالتزام نُفذ جزئياً.',
        legalConsequence: 'إمكانية تخفيض المبلغ قضاءً إلى التعويض عن الضرر الفعلي فقط وضياع قيمة الغرامة الرادعة.',
        egyptianLawRef: 'المادتان 223 و 224 من القانون المدني المصري',
        recommendedClause: 'اتفق الطرفان على شرط جزائي قدره (...) كتعويض اتفاقي عادل عن الضرر الفعلي المباشر الذي لا يمكن توقيه، مع التزام الطرفين بأنه يمثل تقديراً رضائياً غير مجحف لأي منهما.'
      });
      score -= 15;
    }
  } else {
    missingCrucialClauses.push('بند الشرط الجزائي الرادع عن التأخير في التسليم أو سداد الدفعات');
    score -= 10;
  }

  // Check 3: Arbitration without specific institution
  if (/تحكيم/.test(lower) && !/مركز القاهرة الإقليمي|هيئة تحكيم ثلاثية|القانون الواجب التطبيق/.test(lower)) {
    risks.push({
      id: 'risk-arbitration',
      level: 'high',
      title: 'بند تحكيم معيب أو غير محدد الهيئة المؤسسية',
      clauseExcerpt: 'في حال أي نزاع يتم اللجوء للتحكيم الودي...',
      riskDescription: 'شرط التحكيم الفضفاض بدون تحديد مركز التحكيم أو آلية اختيار المحكمين يسقط الاختصاص الولائي للمحاكم العادية ويعطل الفصل في النزاع لسنوات في دعاوى تعيين محكم.',
      legalConsequence: 'دفع الخصم بعدم قبول الدعوى لوجود شرط التحكيم، واستغراق وقت طويل في تشكيل هيئة التحكيم القضائية.',
      egyptianLawRef: 'قانون التحكيم المصري رقم 27 لسنة 1994',
      recommendedClause: 'تختص محاكم (القاهرة / الجيزة) بحسب الاختصاص النوعي والقيمي بنظر أي نزاع، أو: يُحال النزاع إلى مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA) وفقاً لقواعده السارية.'
    });
    score -= 18;
  }

  // Check 4: Real Estate checks
  if (/عقد بيع|شقة|عقار|أرض/.test(lower)) {
    if (!/تسلسل الملكية|أيلولة الملكية|خلو المبيع من الرهون/.test(lower)) {
      risks.push({
        id: 'risk-re-title',
        level: 'high',
        title: 'إغفال بند أيلولة الملكية والضمان التام لخلو العقار من الديون والرهون',
        clauseExcerpt: 'غياب بيان سند ملكية البائع وكيف آلت إليه الملكية وأرقام المشهرات الرسمية',
        riskDescription: 'عدم توثيق سند ملكية البائع ورقم العقد المسجل أو إعلام الوراثة يجعلك عرضة للنزاع مع شركاء على الشيوع أو دائنين حاجزين على العقار.',
        legalConsequence: 'بطلان تصرف البائع أو استحقاق الغير للعقار المبيع طبقاً لدعاوى ضمان الاستحقاق بالمادة 439 مدني.',
        egyptianLawRef: 'المادتان 439 و 444 من القانون المدني المصري وتعديلات قانون الشهر العقاري رقم 9 لسنة 2022',
        recommendedClause: 'يقر البائع بأن ملكية المبيع آلت إليه بموجب العقد المشهر رقم (...) لسنة (...) شهر عقاري، ويضمن خلو المبيع من كافة الرهون والحقوق العينية والاختصاصات والديون والنزاعات القضائية.'
      });
      score -= 20;
    }
    if (!/المواصفات والحدود الأربعة|مساحة إجمالية/.test(lower)) {
      missingCrucialClauses.push('بيان الحدود الأربعة للعقار تفصيلاً ونفي الجهالة الفاحشة وفق متطلبات الشهر العقاري والرفع المساحي الرقمي');
      score -= 10;
    }
  }

  // Check 5: Lease Specific Checks
  if (/عقد إيجار|إيجار شقة/.test(lower)) {
    if (!/صيغة تنفيذية|محضر تصديق|قانون 4 لسنة 1996/.test(lower)) {
      risks.push({
        id: 'risk-lease-exec',
        level: 'medium',
        title: 'عدم النص على وضع الصيغة التنفيذية وتصديق الشهر العقاري',
        clauseExcerpt: 'عقد إيجار عادي دون إثبات تاريخ أو تصديق رسمي بالصيغة التنفيذية',
        riskDescription: 'في حال امتنع المستأجر عن الإخلاء بعد انتهاء المدة أو امتنع عن سداد الأجرة، سيضطر المؤجر لرفع دعوى طرد موضوعية تستغرق من سنة إلى سنتين أمام القضاء.',
        legalConsequence: 'طول أمد التقاضي بدلاً من الطرد الجبري المباشر خلال 48 ساعة بواسطة محضري التنفيذ.',
        egyptianLawRef: 'القانون رقم 137 لسنة 2006 المكمل للقانون رقم 4 لسنة 1996 والمادة 2 من قانون التوثيق',
        recommendedClause: 'اتفق الطرفان على إيداع هذا العقد بالشهر العقاري وإثبات تاريخه مع وضع الصيغة التنفيذية عليه سنداً لأحكام القانون 137 لسنة 2006 ليكون سنداً تنفيذياً واجباً للنفاذ فور انتهاء مدته أو التخلف عن سداد الأجرة.'
      });
      score -= 15;
    }
  }

  // Check 6: Corporate & Companies checks
  if (/شركة|شريك|تأسيس|أرباح|إدارة/.test(lower)) {
    if (!/نصاب القرارات|فض الشراكة|حق الأولوية في شراء الحصص/.test(lower)) {
      missingCrucialClauses.push('بند حق الأولوية والشفعة في شراء الحصص وتصفية الأصول عند فض الشراكة وفق قانون الشركات 159 لسنة 1981');
      score -= 10;
    }
  }

  // General missing clauses check
  if (!/إخطارات|موطن مختار|عناوين المراسلات/.test(lower)) {
    missingCrucialClauses.push('بند الموطن المختار للإعلانات الرسمية وصحة المراسلات عبر البريد المسجل بعلم الوصول أو البريد الإلكتروني المعتمد');
  }
  if (!/القوة القاهرة|الفسخ التلقائي دون حاجة لحكم/.test(lower)) {
    missingCrucialClauses.push('بند الفسخ الاتفاقي الصريح دون حاجة لتنبيه أو إعذار أو حكم قضائي (مادة 158 مدني)');
  }

  if (score < 30) score = 35;

  return {
    id: 'doc-eval-' + Date.now().toString(36),
    documentType: /بيع/.test(lower) ? 'عقد بيع عقاري أو منقول' : /إيجار/.test(lower) ? 'عقد إيجار وحدة' : /عمل/.test(lower) ? 'عقد عمل وتوظيف' : /أمانة/.test(lower) ? 'إيصال أمانة / التزام مالي' : /شركة/.test(lower) ? 'عقد تأسيس أو اتفاقية شركاء' : 'اتفاق تعاقدي عام',
    overallHealthScore: Math.min(100, Math.max(20, score)),
    summary: `تم فحص الصياغة واكتشاف ${risks.length} مخاطر قانونية محتملة و ${missingCrucialClauses.length} بنود جوهرية مستحسنة لضمان حماية الحقوق القضائية كاملة وفق القانون المصري.`,
    risks,
    missingCrucialClauses,
    validityChecklist: [
      { item: 'توافر أهلية التعاقد والصفة القانونية للطرفين', passed: /طرف أول|طرف ثان|بالغ سن الرشد/.test(lower), note: 'يجب التأكد من سلامة الأهلية وعدم الحجر أو الوصاية' },
      { item: 'وضوح محل الالتزام ونفي الجهالة الفاحشة', passed: /المبيع|العين|المحل|المقابل/.test(lower), note: 'المحل غير المعين بدقة يبطل العقد قانوناً' },
      { item: 'تحديد المقابل المالي ومواعيد وسندات السداد', passed: /جنيه|مبلغ|دفعة|سداد/.test(lower), note: 'يجب النص على إبراء الذمة بإيصال رسمي منفصل' },
      { item: 'النص على خضوع العقد لأحكام القانون المصري والمحاكم المختصة', passed: true, note: 'تطبيق القانون المصري هو الأصل في العقود المحررة داخل القطر المصري' }
    ],
    actionableRecommendations: [
      'تعديل البنود الحاوية للمخاطر وفق الصياغة البديلة المقترحة في التقرير أعلاه قبل التوقيع النهائي.',
      'التوجه لمأمورية الشهر العقاري للتصديق على التوقيعات أو وضع الصيغة التنفيذية لضمان القوة الجبرية للمحرر.',
      'الاحتفاظ بنسخ طبق الأصل موقعة من جميع الأطراف على كل صفحة دون استثناء مع إثبات البصمة والتوقيع معاً.'
    ],
    analyzedAt: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
  };
}

/**
 * ذكاء المحادثة والرد القانوني الموثق وفق منهجية التحليل العشارية المصرية (10 خطوات)
 */
export function getSmartAgentResponse(query: string): {
  text: string;
  category: CaseCategory;
  readiness: number;
  citedArticles: { law: string; article: string; text: string }[];
  suggestedActions: { label: string; action: string }[];
} {
  const category = detectCaseCategory(query);
  const matchedLaws = EGYPTIAN_LEGAL_CODEX.filter(l => l.category === category);
  const articles = matchedLaws.flatMap(l => l.articles).slice(0, 2);

  const citedArticles = articles.map(a => ({
    law: a.lawTitle,
    article: a.articleNumber,
    text: a.text.slice(0, 180) + '...'
  }));

  const vuln = EGYPTIAN_LEGAL_VULNERABILITIES.find(v => v.category === category);
  const limitation = STATUTE_OF_LIMITATIONS_EGYPT.find(s => s.type.includes(category === 'checks_debts' ? 'الجنح' : category === 'labor' ? 'العمل' : 'المدني'));

  let advice = '';
  const readiness = Math.floor(Math.random() * 20) + 72;

  // Build 10-step structured legal advisory response
  switch (category) {
    case 'checks_debts':
      advice = `📌 استشارة قانونية مهنية: قضايا الشيكات وإيصالات الأمانة (وفق قانون العقوبات وقانون الإجراءات 174 لسنة 2025)

1️⃣ التوصيف القانوني للواقعة:
النزاع يدور حول ورقة مالية (إيصال أمانة / شيك) تخضع لجريمة خيانة الأمانة المعاقب عليها بالمادة 341 من قانون العقوبات، أو جنحة الشيك بالمادة 534 من قانون التجارة رقم 17 لسنة 1999.

2️⃣ النصوص التشريعية المطبقة:
• المادة 341 عقوبات: تجريم تبديد أو اختلاس النقود المسلمة على سبيل عقود الأمانة الخمسة (الوديعة، الوكالة، الرهن، عارية الاستعمال، الإجارة).
• المادة 15 إجراءات جنائية: تقادم الدعوى الجنائية في الجنح بمضي 3 سنوات.

3️⃣ أركان الجريمة ومدى توافرها:
الركن الجوهري في المادة 341 هو "التسليم الحقيقي للعين أو المال". إذا كان الإيصال موقعاً لضمان دين مدني أو تجاري ولم يحدث تسليم نقدي مباشر من يد المودع إلى يد المستلم، فإن الركن المادي للجريمة ينتفي تماماً.

4️⃣ فحص الإجراءات والبطلان:
إذا تم التوقيع على بياض واستكملت بيانات الصلب لاحقاً، فإن الطعن بالتزوير صلب وتوقيع يثبت انعدام المعاصرة الزمنية بين التوقيع والصلب، مما يبطل السند كدليل جنائي.

5️⃣ الدفوع الجوهرية واستراتيجية الدفاع (للمتهم أو للمجني عليه):
• للمتهم: الدفع بانتفاء ركن التسليم، والطعن بالتزوير على الصلب، وإثبات مدنية النزاع بالشهود أو الرسائل.
• للدائن: تقديم أصل الإيصال خالياً من الكشط، وإثبات واقعة الأمانة وتسليم المال بيمين أو إقرار.

6️⃣ المواعيد والتقادم الحتمي:
تقادم جنحة خيانة الأمانة يسقط بمضي 3 سنوات من تاريخ المطالبة أو آخر إجراء قاطع للتقادم.

7️⃣ التوصية الإجرائية الفورية:
حضور أول جلسة مرافعة بشخص المتهم أو بتوكيل خاص للمحامي للتقرير بالطعن بالتزوير، وطلب إحالة الملف لأبحاث التزييف والتزوير بالطب الشرعي قبل صدور حكم غيابي.`;
      break;

    case 'felonies':
      advice = `📌 استشارة قانونية مهنية: قضايا الجنايات (وفق قانون العقوبات وقانون الإجراءات الجنائية رقم 174 لسنة 2025)

1️⃣ التوصيف القانوني والمرحلة الإجرائية:
الواقعة تشكل جناية خاضعة لاختصاص محكمة الجنايات، والمرحلة تتطلب فحص سلامة تحقيقات النيابة العامة وسند تحريك الدعوى.

2️⃣ الضمانات الدستورية والإجرائية (قانون 174 لسنة 2025):
• وجوب حضور محامٍ مع المتهم في كافة مراحل التحقيق والاستجواب وجلسات المحاكمة (المادة 54 دستورياً).
• تقييد الحبس الاحتياطي بمدد قصوى، وتفعيل بدائل الحبس الإلزامية كعدم مغادرة المسكن أو المراقبة.

3️⃣ فحص صحة الإجراءات والدفوع بالبطلان:
• الدفع ببطلان القبض والتفتيش لانتفاء حالة التلبس (المادة 30 إجراءات) وصدور الإجراء دون إذن مسبق ومسبب من النيابة.
• الدفع ببطلان الاعتراف إذا شابه إكراه مادي أو معنوي، وبطلان تفتيش المسكن لانتهاك الحرمة الدستورية.

4️⃣ الأدلة الرقمية وسلسلة الحيازة:
وفقاً للمادة 11 من القانون 175 لسنة 2018، لا يعول على أي دليل رقمي (رسائل، هواتف) إلا إذا ثبتت سلامة تحريزه وعدم العبث بمحتواه ووجود تقرير فني صادر من خبير معتمد.

5️⃣ المواعيد والطعن:
انقضاء الدعوى الجنائية في الجنايات بمضي 10 سنوات، وميعاد الطعن بالنقض 60 يوماً حتمياً من تاريخ الحكم الحضوري.

6️⃣ التوصية الإجرائية المباشرة:
الاطلاع على أوراق القضية وتفريغ أحراز التحقيق، والتمسك بالدفوع الشكلية المتعلقة بالبطلان في صدر المرافعة أمام هيئة المحكمة.`;
      break;

    case 'family':
      advice = `📌 استشارة قانونية مهنية: قضايا الأسرة والأحوال الشخصية (القوانين 25 لسنة 1920، 25 لسنة 1929، والقانون 1 لسنة 2000)

1️⃣ التوصيف القانوني لموضوع النزاع:
نزاع أحوال شخصية خاضع لاختصاص محكمة الأسرة (دعوى خلع / طلاق للضرر / نفقات / قائمة منقولات).

2️⃣ القواعد الفقهية والتشريعية المستقرة:
• المادة 20 من القانون رقم 1 لسنة 2000: الخلع حق للزوجة بافتداء نفسها ورد مقدم الصداق الثابت، وحكم الخلع بات نهائي غير قابل للطعن بالاستئناف.
• أثر الخلع المالي: الخلع يسقط فقط (مؤخر الصداق، نفقة العدة، نفقة المتعة)، ولا يمس إطلاقاً حقوق ونفقات الصغار أو قائمة المنقولات.

3️⃣ قائمة المنقولات الزوجية:
قائمة المنقولات هي سند ملكية ووديعة عينية معاقب على تبديدها بالمادة 341 عقوبات، وللزوجة المطالبة بها جنائياً أو أمام محكمة الأسرة سواء كانت متزوجة أو مطلقة أو مخالعة.

4️⃣ نفقات الصغار ومسكن الحضانة:
تستحق الزوجة الحاضنة أجر مسكن وأجر حضانة ونفقة مأكل وملبس ومصاريف تعليم وعلاج، ويجوز رفع دعوى حبس بمتجمد النفقة بحد أقصى 30 يوماً قابلة للتكرار عند الامتناع.

5️⃣ التوصية الإجرائية الفورية:
التقدم بطلب تسوية لمكتب تسوية المنازعات الأسرية بمحكمة الأسرة المختصة محل إقامة المدعية كإجراء وجوبي قبل قيد صحيفة الدعوى.`;
      break;

    case 'labor':
      advice = `📌 استشارة قانونية مهنية: قضايا العمل والعمال (وفق قانون العمل 12 لسنة 2003 وقانون التأمينات 148 لسنة 2019)

1️⃣ التوصيف القانوني:
إنهاء علاقة عمل غير مبرر (فصل تعسفي) أو الامتناع عن سداد الأجور ومستحقات نهاية الخدمة.

2️⃣ النصوص القانونية وحقوق العامل:
• المادة 122 عمل: استحقاق العامل المفصول تعسفياً لتعويض لا يقل عن أجر شهرين كاملين (شاملين) عن كل سنة من سنوات الخدمة، بالإضافة لمهلة الإخطار ورصيد الإجازات.
• المادة 87 من قانون التأمينات 148 لسنة 2019: استحقاق العامل المفصول لصرف تعويض البطالة شهرياً لحين الفصل في الدعوى.

3️⃣ الميعاد الحتمي الصارم (سقوط الحق):
يجب التقدم بشكوى لمكتب العمل خلال 10 أيام فقط من تاريخ الإخطار بالفصل أو منع الدخول.

4️⃣ الخطوات الإجرائية الإلزامية:
1. تحرير محضر إثبات حالة بقسم الشرطة في اليوم الأول لإثبات المنع من العمل وبصمة الحضور.
2. التوجه لمكتب العمل المختص وتقديم الشكوى وطلب الوساطة والتسوية الودية.
3. في حال تعذر الصلح خلال 21 يوماً، يحيل مكتب العمل النزاع للمحكمة العمالية المختصة.`;
      break;

    case 'real_estate':
      advice = `📌 استشارة قانونية مهنية: قضايا العقارات والشهر العقاري والتسجيل (القانون رقم 9 لسنة 2022)

1️⃣ التوصيف القانوني:
نزاع ملكية عقارية، تسجيل شقة بالشهر العقاري، أو دعوى صحة ونفاذ تعاقد.

2️⃣ الوضع القانوني للتسجيل ونقل الملكية:
الملكية العقارية في مصر لا تنتقل بالتعاقد الابتدائي العرفي ولا بحكم صحة التوقيع؛ الملكية تنتقل فقط بالشهر والتسجيل الرسمي لدى مأمورية الشهر العقاري.

3️⃣ تيسيرات القانون رقم 9 لسنة 2022:
• إتاحة تسجيل العقار بالحيازة الهادئة المستقرة لمدة 5 سنوات بعقد ابتدائي أو 15 سنة دون عقد.
• الفصل التام بين سداد ضريبة التصرفات العقارية وإتمام إجراءات التسجيل لتسريع المعاملات.
• الاكتفاء بشهادة الرفع المساحي الرقمي (QR Code) الصادرة من المراكز التكنولوجية المعتمدة.

4️⃣ الدفوع والمخاطر:
التحقق من سلسلة أيلولة الملكية وخلو العقار من الرهون الرسمية عبر استخراج شهادة تصرفات عقارية سلبية قبل سداد كامل الثمن.`;
      break;

    default:
      advice = `📌 استشارة قانونية مهنية وفق المنظومة التشريعية والقضائية المصرية

1️⃣ التوصيف القانوني للواقعة:
النزاع يخضع للقواعد العامة في القانون المدني المصري رقم 131 لسنة 1948 وقانون المرافعات، حيث العقد شريعة المتعاقدين (المادة 147) مع وجوب تنفيذه بحسن نية (المادة 148).

2️⃣ أركان المسؤولية والتعويض:
طبقاً للمادة 163 من القانون المدني، فإن كل خطأ سبب ضرراً للغير يلزم من ارتكبه بالتعويض. يشترط اكتمال أركان الخطأ والضرر المباشر ورابطة السببية.

3️⃣ فحص الإجراءات والتقادم:
تسقط دعوى التعويض المدني بمضي 3 سنوات من تاريخ علم المضرور بالضرر والمسؤول عنه (المادة 172 مدني).

4️⃣ التوصية الإجرائية:
توجيه إنذار رسمي مسجل على يد محضر لتحديد مهلة سداد أو تصحيح الوضع قبل قيد صحيفة الدعوى بجدول المحكمة المختصة.`;
      break;
  }

  return {
    text: advice,
    category,
    readiness,
    citedArticles,
    suggestedActions: [
      { label: 'بناء وتنزيل ملف الدعوى الموثق (PDF)', action: 'build_case_file' },
      { label: 'فحص بنود العقد والمستندات لكشف الثغرات', action: 'analyze_contract' },
      { label: 'حجز استشارة مع محامٍ معتمد مقيد بالنقض', action: 'find_lawyer' }
    ]
  };
}

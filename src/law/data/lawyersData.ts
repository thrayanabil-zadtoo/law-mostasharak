/**
 * دليل المحامين المعتمدين والمكاتب القانونية بجمهورية مصر العربية
 * مع الفرز الجغرافي ودرجات القيد بنقابة المحامين
 */

import { Lawyer } from '../types';

export const CERTIFIED_EGYPTIAN_LAWYERS: Lawyer[] = [
  {
    id: 'lawyer-tarik-el-sherif',
    fullName: 'المستشار طارق الشريف',
    title: 'محامي مقيد بالنقض والدستورية العليا ومحكم دولي',
    courtDegree: 'cassation',
    licenseNumber: 'EGY-BAR-14892-N',
    barAssociationUnion: 'نقابة المحامين العامة - فرعية شمال القاهرة',
    governorate: 'القاهرة',
    cityArea: 'مصر الجديدة / الكوربة',
    address: '14 شارع بغداد، الكوربة، مصر الجديدة، القاهرة (بجوار محكمة مصر الجديدة)',
    phone: '+20 100 248 9120',
    email: 'tarek.elsherif@law-mostasharak.eg',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    rating: 4.96,
    reviewCount: 142,
    yearsOfExperience: 26,
    bio: 'خبير في المنازعات العقارية الكبرى وتسجيل الأراضي وقضايا النقض المدني والجنائي. ترافع في أكثر من 1800 قضية أمام محاكم النقض والاستئناف العالي، ومستشار لعدد من كبرى شركات التطوير العقاري.',
    specialties: ['real_estate', 'civil', 'criminal', 'commercial'],
    consultationFee: 750,
    urgentConsultationFee: 1200,
    modes: ['office', 'encrypted_call', 'written'],
    coordinates: {
      lat: 30.0886,
      lng: 31.3285
    },
    achievements: [
      'حاصل على وسام التميز النقابي لنقابة المحامين المصرية 2021',
      'عضو الاتحاد الدولي للمحامين (UIA)',
      'سجل أحكام براءة سابقة في قضايا أموال عامة وإيصالات أمانة معقدة'
    ],
    languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
    reviews: [
      {
        id: 'rev-1',
        authorName: 'المهندس أحمد ممدوح',
        rating: 5,
        date: 'منذ أسبوعين',
        comment: 'المستشار طارق كشف ثغرة جوهرية في عقد بيع أرض بـ 6 مليون جنيه كان من الممكن أن تتسبب في ضياع كامل أموالي. مهنية ودقة غير مسبوقة.',
        caseType: 'عقاري وأراضي',
        verified: true
      },
      {
        id: 'rev-2',
        authorName: 'د. سامح عبد الفتاح',
        rating: 5,
        date: 'منذ شهر',
        comment: 'حصلنا على حكم براءة تاريخي في محكمة النقض خلال جلستين فقط بفضل صياغة مذكرة أسباب الطعن البالغة الإحكام.',
        caseType: 'نقض جنائي',
        verified: true
      }
    ],
    slots: [
      { id: 's1', day: 'الأحد', date: 'غداً', time: '05:00 م - 06:00 م', available: true },
      { id: 's2', day: 'الأحد', date: 'غداً', time: '06:30 م - 07:30 م', available: true },
      { id: 's3', day: 'الثلاثاء', date: 'بعد غد', time: '07:00 م - 08:00 م', available: true },
      { id: 's4', day: 'الأربعاء', date: 'الأسبوع الجاري', time: '04:00 م - 05:00 م', available: true }
    ]
  },
  {
    id: 'lawyer-fatma-el-zahraa',
    fullName: 'الأستاذة فاطمة الزهراء علام',
    title: 'محامية بالاستئناف العالي وخبيرة منازعات الأسرة والتركات',
    courtDegree: 'appeal',
    licenseNumber: 'EGY-BAR-31420-S',
    barAssociationUnion: 'نقابة المحامين فرعية جنوب الجيزة',
    governorate: 'الجيزة',
    cityArea: 'الدقي / شارع مصدق',
    address: '42 شارع مصدق، الدور الثالث، الدقي، الجيزة (قرب محطة مترو الدقي)',
    phone: '+20 111 890 4311',
    email: 'fatma.allam@law-mostasharak.eg',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    rating: 4.92,
    reviewCount: 189,
    yearsOfExperience: 17,
    bio: 'متخصصة بقضايا الأحوال الشخصية، دعاوى الخلع السريعة، تحصيل متجمد النفقات وإصدار أوامر الحبس، حماية حقوق الحضانة ومسكن الزوجية وقضايا المواريث وتوزيع التركات الشائكة.',
    specialties: ['family', 'inheritance', 'civil'],
    consultationFee: 500,
    urgentConsultationFee: 900,
    modes: ['office', 'encrypted_call', 'written'],
    coordinates: {
      lat: 30.0384,
      lng: 31.2114
    },
    achievements: [
      'أكثر من 900 حكم نهائي نافذ في قضايا الأسرة والنفقات خلال 10 سنوات',
      'مدربة معتمدة في صياغة مذكرات محاكم الأسرة والولاية التعليمية',
      'نسبة نجاح 98% في استرداد كامل أعيان قائمة المنقولات الزوجية'
    ],
    languages: ['العربية', 'الإنجليزية'],
    reviews: [
      {
        id: 'rev-3',
        authorName: 'سارة عبد الرحمن',
        rating: 5,
        date: 'منذ 3 أيام',
        comment: 'الأستاذة فاطمة إنسانة راقية ومحامية عبقرية، استردت لي كل حقوقي ونفقة أولادي وقائمة المنقولات بدون أي مماطلة في محكمة أسرة الدقي.',
        caseType: 'أحوال شخصية ونفقات',
        verified: true
      }
    ],
    slots: [
      { id: 's5', day: 'الإثنين', date: 'هذا الأسبوع', time: '04:00 م - 05:00 م', available: true },
      { id: 's6', day: 'الإثنين', date: 'هذا الأسبوع', time: '05:30 م - 06:30 م', available: true },
      { id: 's7', day: 'الخميس', date: 'هذا الأسبوع', time: '06:00 م - 07:00 م', available: true }
    ]
  },
  {
    id: 'lawyer-hazem-abdallah',
    fullName: 'المستشار حازم عبد الله ناصف',
    title: 'محامي بالنقض ورئيس هيئة دفاع الجنايات والجرائم الرقمية',
    courtDegree: 'cassation',
    licenseNumber: 'EGY-BAR-18903-N',
    barAssociationUnion: 'نقابة المحامين فرعية الإسكندرية',
    governorate: 'الإسكندرية',
    cityArea: 'سموحة / المنشية',
    address: '7 شارع فوزي معاذ، أبراج سموحة كراون، سموحة، الإسكندرية',
    phone: '+20 102 771 9902',
    email: 'hazem.nassef@law-mostasharak.eg',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    rating: 4.88,
    reviewCount: 96,
    yearsOfExperience: 22,
    bio: 'متخصص في قضايا الجنايات الكبرى، جرائم تقنية المعلومات والابتزاز الإلكتروني، الدفوع الجوهرية في إيصالات الأمانة، وترافع أمام دوائر جنايات الإسكندرية والقاهرة.',
    specialties: ['criminal', 'cybercrime', 'commercial'],
    consultationFee: 700,
    urgentConsultationFee: 1100,
    modes: ['office', 'encrypted_call'],
    coordinates: {
      lat: 31.2156,
      lng: 29.9553
    },
    achievements: [
      'محاضر بقوانين الأدلة الرقمية الجنائية والأمن السيبراني',
      'أحكام براءة في أكثر من 300 قضية إيصالات أمانة ومنازعات تجارية',
      'مستشار قانوني لعدد من منصات التكنولوجيا والتجارة الإلكترونية'
    ],
    languages: ['العربية', 'الإنجليزية'],
    reviews: [
      {
        id: 'rev-4',
        authorName: 'كريم محمود الإسكندراني',
        rating: 5,
        date: 'منذ 5 أيام',
        comment: 'المستشار حازم خلصني من كابوس ابتزاز إلكتروني خلال 48 ساعة فقط بالتنسيق مع مباحث الإنترنت واستصدر أمر ضبط وإحضار فوري.',
        caseType: 'جرائم إلكترونية',
        verified: true
      }
    ],
    slots: [
      { id: 's8', day: 'الأحد', date: 'غداً', time: '06:00 م - 07:00 م', available: true },
      { id: 's9', day: 'الثلاثاء', date: 'هذا الأسبوع', time: '05:00 م - 06:00 م', available: true }
    ]
  },
  {
    id: 'lawyer-youssef-el-sawy',
    fullName: 'المستشار يوسف الصاوي',
    title: 'محامي بالاستئناف العالي ومستشار الشركات وقضايا العمل والتأمينات',
    courtDegree: 'appeal',
    licenseNumber: 'EGY-BAR-27514-S',
    barAssociationUnion: 'نقابة المحامين فرعية القاهرة الجديدة',
    governorate: 'القاهرة',
    cityArea: 'التجمع الخامس / شارع التسعين',
    address: 'مجمع ميتينج بوينت، شارع التسعين الشمالي، التجمع الخامس، القاهرة الجديدة',
    phone: '+20 122 344 5511',
    email: 'youssef.elsawy@law-mostasharak.eg',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    rating: 4.94,
    reviewCount: 112,
    yearsOfExperience: 15,
    bio: 'خبير في صياغة العقود التجارية، تأسيس الشركات بهيئة الاستثمار (GAFI)، دعاوى الفصل التعسفي والتعويضات العمالية، وحماية الملكية الفكرية والعلامات التجارية.',
    specialties: ['labor', 'commercial', 'civil'],
    consultationFee: 600,
    urgentConsultationFee: 950,
    modes: ['office', 'encrypted_call', 'written'],
    coordinates: {
      lat: 30.0168,
      lng: 31.4285
    },
    achievements: [
      'تأسيس أكثر من 120 شركة ناشئة ومساهمة في مصر',
      'تحصيل تعويضات عمالية قياسية لمديرين تنفيذيين وموظفين مفصولين تعسفياً',
      'عضو جمعية الضرائب والمحاسبين القانونيين'
    ],
    languages: ['العربية', 'الإنجليزية'],
    reviews: [
      {
        id: 'rev-5',
        authorName: 'م. تامر جلال',
        rating: 5,
        date: 'منذ شهر',
        comment: 'تم تحصيل تعويض فصل تعسفي بقيمة سنة ونصف أجر شامل بالإضافة لرصيد الإجازات بعد أن ادعت الشركة وجود أزمة مالية.',
        caseType: 'عمالي ومستحقات',
        verified: true
      }
    ],
    slots: [
      { id: 's10', day: 'الإثنين', date: 'غداً', time: '02:00 م - 03:00 م', available: true },
      { id: 's11', day: 'الأربعاء', date: 'هذا الأسبوع', time: '03:30 م - 04:30 م', available: true }
    ]
  },
  {
    id: 'lawyer-mahmoud-radwan',
    fullName: 'الأستاذ محمود رضوان الدسوقي',
    title: 'محامي بالاستئناف العالي ومتخصص قضايا التعويضات ومجلس الدولة',
    courtDegree: 'appeal',
    licenseNumber: 'EGY-BAR-39102-S',
    barAssociationUnion: 'نقابة المحامين فرعية الدقهلية',
    governorate: 'الدقهلية',
    cityArea: 'المنصورة / المشاية السفلية',
    address: 'شارع الجمهورية أمام مجمع المحاكم، المنصورة، الدقهلية',
    phone: '+20 101 982 3441',
    email: 'radwan.mansoura@law-mostasharak.eg',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    rating: 4.85,
    reviewCount: 78,
    yearsOfExperience: 14,
    bio: 'متمرس في دعاوى مجلس الدولة، إلغاء القرارات الإدارية، نزاعات نزع الملكية للمنفعة العامة والتعويض العادل، ومنازعات الأراضي الزراعية.',
    specialties: ['administrative', 'civil', 'real_estate'],
    consultationFee: 400,
    urgentConsultationFee: 650,
    modes: ['office', 'encrypted_call', 'written'],
    coordinates: {
      lat: 31.0409,
      lng: 31.3785
    },
    achievements: [
      'أحكام إلغاء قرارات إدارية صادرة من جهات حكومية وتعويضات تجاوزت 4 ملايين جنيه',
      'باحث ماجستير بالقانون العام ومجلس الدولة'
    ],
    languages: ['العربية'],
    reviews: [
      {
        id: 'rev-6',
        authorName: 'الحاج رمضان البدري',
        rating: 5,
        date: 'منذ أسبوعين',
        comment: 'استرجعنا حقوقنا في تعويض نزع ملكية أرض على الطريق الدائري بعد أن كان التقييم الحكومي بخساً جداً.',
        caseType: 'إداري وتعويضات',
        verified: true
      }
    ],
    slots: [
      { id: 's12', day: 'الثلاثاء', date: 'هذا الأسبوع', time: '04:00 م - 05:00 م', available: true },
      { id: 's13', day: 'الخميس', date: 'هذا الأسبوع', time: '05:30 م - 06:30 م', available: true }
    ]
  }
];

export const GOVERNORATES_LIST = [
  'الكل',
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الدقهلية',
  'القليوبية',
  'الشرقية',
  'الغربية',
  'أسيوط'
];

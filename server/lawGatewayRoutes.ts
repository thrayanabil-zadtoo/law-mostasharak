import { Router, Request, Response } from 'express';
import { EGYPTIAN_LEGAL_CODEX } from '../src/law/data/egyptianLegalCodexFull';
import { CERTIFIED_EGYPTIAN_LAWYERS } from '../src/law/data/lawyersData';
import { 
  getSmartAgentResponse, 
  analyzeLegalContract, 
  generateStructuredCaseFile 
} from '../src/law/utils/legalAgentEngine';

export const lawGatewayRouter = Router();

// Middleware for API Key verification
lawGatewayRouter.use((req: Request, res: Response, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  // Allow all for demo/sandbox, attach metadata
  (req as any).apiClientTier = apiKey ? 'developer' : 'public_demo';
  next();
});

/**
 * POST /api/law/chat
 * المحادثة والاستشارة القانونية الفورية
 */
lawGatewayRouter.post('/chat', (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'حقل query مطلوب بنص صالح' });
      return;
    }

    const result = getSmartAgentResponse(query);
    res.json({
      success: true,
      data: result,
      source: 'LAW Mostasharak Egyptian Legal Engine v2.4'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'خطأ داخلي في معالجة الاستشارة' });
  }
});

/**
 * POST /api/law/analyze-contract
 * فاحص العقود والمستندات لكشف الثغرات
 */
lawGatewayRouter.post('/analyze-contract', (req: Request, res: Response) => {
  try {
    const { contractText } = req.body;
    if (!contractText || typeof contractText !== 'string') {
      res.status(400).json({ error: 'حقل contractText مطلوب بنص العقد' });
      return;
    }

    const analysis = analyzeLegalContract(contractText);
    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'خطأ في فحص العقد' });
  }
});

/**
 * GET /api/law/codex/search
 * البحث في الموسوعة التشريعية والقوانين المصرية
 */
lawGatewayRouter.get('/codex/search', (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || '').toLowerCase().trim();
    const lawId = req.query.lawId as string;

    let targetArticles = lawId 
      ? EGYPTIAN_LEGAL_CODEX.find(l => l.id === lawId)?.articles || []
      : EGYPTIAN_LEGAL_CODEX.flatMap(l => l.articles);

    if (q) {
      targetArticles = targetArticles.filter(art =>
        art.articleNumber.toLowerCase().includes(q) ||
        art.text.toLowerCase().includes(q) ||
        art.explanation.toLowerCase().includes(q) ||
        art.keywords.some(k => k.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      totalCount: targetArticles.length,
      articles: targetArticles
    });
  } catch (error: any) {
    res.status(500).json({ error: 'خطأ في استعلام الموسوعة التشريعية' });
  }
});

/**
 * GET /api/law/lawyers
 * دليل المحامين المعتمدين والمكاتب القانونية
 */
lawGatewayRouter.get('/lawyers', (req: Request, res: Response) => {
  try {
    const gov = req.query.gov as string;
    const specialty = req.query.specialty as string;

    let list = CERTIFIED_EGYPTIAN_LAWYERS;
    if (gov && gov !== 'الكل') {
      list = list.filter(l => l.governorate === gov);
    }
    if (specialty && specialty !== 'all') {
      list = list.filter(l => l.specialties.includes(specialty as any));
    }

    res.json({
      success: true,
      count: list.length,
      lawyers: list
    });
  } catch (error: any) {
    res.status(500).json({ error: 'خطأ في جلب بيانات المحامين' });
  }
});

/**
 * POST /api/law/case-file
 * صانع ملف القضية وحساب نسبة الجاهزية
 */
lawGatewayRouter.post('/case-file', (req: Request, res: Response) => {
  try {
    const { title, category, facts, documents } = req.body;
    const file = generateStructuredCaseFile(
      title || 'ملف دعوى قضائي',
      category || 'civil',
      facts || '',
      Array.isArray(documents) ? documents : []
    );
    res.json({
      success: true,
      caseFile: file
    });
  } catch (error: any) {
    res.status(500).json({ error: 'خطأ في توليد ملف الدعوى' });
  }
});

/**
 * POST /api/law/gateway/verify-key
 * التحقق من صلاحية مفاتيح الربط
 */
lawGatewayRouter.post('/gateway/verify-key', (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('law_live_mst_')) {
    res.status(401).json({ valid: false, error: 'مفتاح ترخيص غير صالح' });
    return;
  }

  res.json({
    valid: true,
    tier: 'developer',
    rateLimitPerMinute: 120,
    status: 'active'
  });
});

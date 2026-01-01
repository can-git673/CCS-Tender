import axios from 'axios';

export interface AnalysisResult {
  summary: string;
  legalRisks: RiskItem[];
  commercialTerms: CommercialTerm[];
  recommendations: string[];
  complianceScore: number;
  detectedCountry: string;
  charts: ChartData[];
}

export interface RiskItem {
  category: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

export interface CommercialTerm {
  term: string;
  value: string;
  analysis: string;
  flag?: 'warning' | 'info';
}

export interface ChartData {
  type: 'pie' | 'bar' | 'radar';
  title: string;
  data: any;
}

// API配置 - 支持多个免费API自动切换
const API_CONFIGS = [
  {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4.1-mini',
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  {
    name: 'Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
    model: 'gemini-2.5-flash',
    apiKey: process.env.GEMINI_API_KEY || '',
  },
];

let currentAPIIndex = 0;

/**
 * 调用AI API进行分析
 */
async function callAIAPI(prompt: string, retryCount = 0): Promise<string> {
  const config = API_CONFIGS[currentAPIIndex];
  
  try {
    if (config.name === 'OpenAI') {
      const response = await axios.post(
        config.endpoint,
        {
          model: config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional legal and commercial contract analyst specializing in tender documents. Provide detailed, accurate analysis based on the relevant country\'s laws and regulations.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
          },
          timeout: 60000,
        }
      );
      
      return response.data.choices[0].message.content;
    } else if (config.name === 'Gemini') {
      const response = await axios.post(
        `${config.endpoint}?key=${config.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );
      
      return response.data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Unsupported API configuration');
  } catch (error: any) {
    console.error(`API ${config.name} failed:`, error.message);
    
    // 自动切换到下一个API
    if (retryCount < API_CONFIGS.length - 1) {
      currentAPIIndex = (currentAPIIndex + 1) % API_CONFIGS.length;
      console.log(`Switching to API: ${API_CONFIGS[currentAPIIndex].name}`);
      return await callAIAPI(prompt, retryCount + 1);
    }
    
    throw new Error('All API endpoints failed');
  }
}

/**
 * 分析招标文件
 */
export async function analyzeTenderDocument(
  documentText: string,
  metadata: any,
  onProgress?: (progress: number) => void
): Promise<AnalysisResult> {
  try {
    // 阶段1: 检测国家和法律体系 (20%)
    if (onProgress) onProgress(20);
    const countryPrompt = `
Analyze the following tender document and identify:
1. The country/jurisdiction this tender is from
2. The applicable legal system
3. Key regulatory frameworks mentioned

Document excerpt:
${documentText.substring(0, 2000)}

Respond in JSON format:
{
  "country": "country name",
  "legalSystem": "legal system description",
  "regulations": ["regulation1", "regulation2"]
}
`;
    
    const countryAnalysis = await callAIAPI(countryPrompt);
    const countryData = JSON.parse(countryAnalysis);
    
    // 阶段2: 法务风险分析 (40%)
    if (onProgress) onProgress(40);
    const legalPrompt = `
As a legal expert specializing in ${countryData.country} contract law, analyze this tender document for legal risks:

Document:
${documentText}

Identify and categorize legal risks with:
1. Risk category
2. Severity level (high/medium/low)
3. Detailed description
4. Specific recommendations

Respond in JSON format:
{
  "risks": [
    {
      "category": "category name",
      "severity": "high|medium|low",
      "description": "detailed description",
      "recommendation": "specific recommendation"
    }
  ]
}
`;
    
    const legalAnalysis = await callAIAPI(legalPrompt);
    const legalData = JSON.parse(legalAnalysis);
    
    // 阶段3: 商务条款分析 (60%)
    if (onProgress) onProgress(60);
    const commercialPrompt = `
Analyze the commercial terms in this tender document:

Document:
${documentText}

Extract and analyze:
1. Payment terms
2. Delivery/performance timelines
3. Penalties and liquidated damages
4. Warranty and guarantee terms
5. Price and cost structures

Respond in JSON format:
{
  "terms": [
    {
      "term": "term name",
      "value": "extracted value",
      "analysis": "professional analysis",
      "flag": "warning|info|null"
    }
  ]
}
`;
    
    const commercialAnalysis = await callAIAPI(commercialPrompt);
    const commercialData = JSON.parse(commercialAnalysis);
    
    // 阶段4: 综合评估和建议 (80%)
    if (onProgress) onProgress(80);
    const summaryPrompt = `
Based on the analysis of this ${countryData.country} tender document, provide:
1. Executive summary
2. Overall compliance score (0-100)
3. Top 5 recommendations
4. Key action items

Context:
- Legal risks identified: ${legalData.risks.length}
- Commercial terms analyzed: ${commercialData.terms.length}

Respond in JSON format:
{
  "summary": "executive summary",
  "complianceScore": 85,
  "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"]
}
`;
    
    const summaryAnalysis = await callAIAPI(summaryPrompt);
    const summaryData = JSON.parse(summaryAnalysis);
    
    // 阶段5: 生成图表数据 (100%)
    if (onProgress) onProgress(100);
    const charts = generateChartData(legalData.risks, commercialData.terms);
    
    return {
      summary: summaryData.summary,
      legalRisks: legalData.risks,
      commercialTerms: commercialData.terms,
      recommendations: summaryData.recommendations,
      complianceScore: summaryData.complianceScore,
      detectedCountry: countryData.country,
      charts,
    };
  } catch (error: any) {
    console.error('Analysis failed:', error);
    throw new Error(`分析失败: ${error.message}`);
  }
}

/**
 * 生成图表数据
 */
function generateChartData(risks: RiskItem[], terms: CommercialTerm[]): ChartData[] {
  // 风险分布饼图
  const riskDistribution = {
    high: risks.filter(r => r.severity === 'high').length,
    medium: risks.filter(r => r.severity === 'medium').length,
    low: risks.filter(r => r.severity === 'low').length,
  };
  
  // 风险类别柱状图
  const riskCategories: { [key: string]: number } = {};
  risks.forEach(risk => {
    riskCategories[risk.category] = (riskCategories[risk.category] || 0) + 1;
  });
  
  return [
    {
      type: 'pie',
      title: '风险严重程度分布',
      data: [
        { name: '高风险', value: riskDistribution.high },
        { name: '中风险', value: riskDistribution.medium },
        { name: '低风险', value: riskDistribution.low },
      ],
    },
    {
      type: 'bar',
      title: '风险类别统计',
      data: Object.entries(riskCategories).map(([name, value]) => ({ name, value })),
    },
    {
      type: 'radar',
      title: '合规性评估雷达图',
      data: {
        indicators: [
          { name: '法律合规', max: 100 },
          { name: '商务条款', max: 100 },
          { name: '风险控制', max: 100 },
          { name: '执行可行性', max: 100 },
          { name: '成本合理性', max: 100 },
        ],
        values: [85, 90, 75, 88, 92],
      },
    },
  ];
}

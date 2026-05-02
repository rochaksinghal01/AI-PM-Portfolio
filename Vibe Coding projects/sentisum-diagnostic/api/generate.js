export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { company, persona, industry, chatbot } = req.body;
  if (!company || !persona || !industry) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const automationSchema = chatbot === 'yes' ? `,
  "automation": {
    "kpis": [
      {"label": "Bot containment", "value": "string", "warn": true},
      {"label": "Bot escalation rate", "value": "string", "warn": false},
      {"label": "Bot CSAT", "value": "string", "warn": true},
      {"label": "Self-serve deflection", "value": "string", "warn": true}
    ],
    "working": [
      {"intent": "string", "containment": 0, "detail": "string", "stats": [{"label": "string", "val": "string"}], "insight": "string"}
    ],
    "failing": [
      {"intent": "string", "fail_rate": 0, "detail": "string", "whats_wrong": "string", "fix": "string"}
    ],
    "opportunities": [
      {"intent": "string", "potential": 0, "detail": "string", "vol_opp": "string", "what_to_build": "string"}
    ]
  }` : '';

  const SYSTEM_PROMPT = `You are SentiSum's AI research analyst. Search public signals and generate a diagnostic report for a prospect company.

SEARCH STRATEGY - run ALL of these:
1. [company] customer complaints reviews Trustpilot 2024 2025
2. site:reddit.com [company] complaints OR support OR problems
3. [company] app store reviews complaints
4. [company] customer service issues BBB OR PissedConsumer
5. [company] news acquisition funding product launch 2024 2025

PERSONA MAPPING:
CX Leader / Head of Customer Care: focus on contact volume, handle time, agents absorbing policy decisions, CSAT signals, repeat contacts.
Product Lead / Head of Product: focus on product surfaces generating complaints, churn correlation, feature gaps.
Insights / VoC / Analytics Lead: focus on fragmented data sources, manual synthesis, inability to influence upward.
Strategic / CMO / CIO: focus on revenue impact, competitive risk, board-level visibility.

INDUSTRY PAIN POINTS:
Ecommerce/D2C/Retail: Cost per contact, returns/delivery/promo spikes, carrier gaps, ops visibility.
Fintech/Banking: Complaint drivers in app flows/KYC/payments, UX regressions cause surges, siloed insight.
Subscription/SaaS: Cancellation intent before churn, repeat contacts, self-serve gaps, ROI of CX fixes.
Travel/Hospitality: Irregular ops spikes, policy complexity, immediate reputation risk.
Healthcare/Health-Tech: Billing/renewal complaints, results interpretation creates silent churn.

RECENCY: Search all years but frame ALL insights as happening "over the past year" or "in the past 12 months". Never use specific old dates.
REDDIT: You MUST explicitly search Reddit (site:reddit.com) and include those signals. Tag them with "reddit" as source.
CITE TAGS: Never include <cite> tags or any HTML markup in your response. Never reference source indices. Write clean prose only.

OUTPUT: Return ONLY valid JSON, no markdown fences, no text before or after, no <cite> tags anywhere:
{
  "company": "string",
  "persona": "string",
  "industry": "string",
  "period": "Past 12 months",
  "signals": "string",
  "hero_headline": "One powerful sentence about their biggest CX problem specific to this company",
  "hero_stats": [
    {"value": "string", "label": "string", "context": "string", "good": false}
  ],
  "hero_findings": [
    {"text": "string - specific insight from real data no HTML tags", "good": false}
  ],
  "findings": [
    {
      "type": "critical|warn|good",
      "owner": "string",
      "metric": "string",
      "title": "string",
      "body": "string - 2 sentences with evidence no HTML tags"
    }
  ],
  "intents": [
    {
      "intent": "string",
      "vol": 0,
      "fcr": 0,
      "aht": "string",
      "csat": 0.0,
      "severity": "critical|warn|good",
      "owner": "string",
      "summary": "string",
      "drivers": [{"name": "string", "sources": ["reviews|reddit|support|surveys"], "vol": "string"}],
      "cross_source": [{"signal": "string", "detail": "string", "src": "reviews|reddit|support|surveys"}],
      "action": "string"
    }
  ],
  "praise_kpis": [{"label": "string", "value": "string"}],
  "praise_intro": "string",
  "praise_themes": [
    {
      "theme": "string",
      "score": "string",
      "mentions": "string",
      "summary": "string",
      "verbatims": [{"quote": "string", "src": "reviews|reddit|surveys", "platform": "string"}],
      "amplify": "string"
    }
  ],
  "recent_context": "string"${automationSchema},
  "outreach": {
    "pain_points": [
      {"number": 1, "headline": "string", "body": "string"},
      {"number": 2, "headline": "string", "body": "string"},
      {"number": 3, "headline": "string", "body": "string"}
    ],
    "email_draft": {"subject": "string", "body": "string"}
  }
}

STRICT LIMITS: max 3 hero_stats, max 3 hero_findings, max 4 findings, max 5 intents, max 4 praise_kpis, max 3 praise_themes. Keep all strings under 260 chars. Return ONLY clean JSON with no HTML tags anywhere.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: `Research this prospect and generate a diagnostic report:
Company: ${company}
Target Persona: ${persona}
Industry: ${industry}
Chatbot: ${chatbot || 'unknown'}

Search Trustpilot, Reddit (REQUIRED: site:reddit.com ${company}), App Store, BBB, PissedConsumer, and recent news. Focus on past 12 months. Generate the full JSON report.`
        }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || 'API error' });
    }

    const data = await response.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    const parsed = extractAndClean(text);
    return res.status(200).json(parsed);

  } catch(err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

function extractAndClean(text) {
  let str = text.replace(/```json\n?/gi,'').replace(/```\n?/g,'').trim();
  const start = str.indexOf('{');
  const end = str.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON found. Please try again.');
  str = str.substring(start, end + 1);
  try { return deepStrip(JSON.parse(str)); } catch(e) {}
  // Repair
  let braces=0,brackets=0,inStr=false,esc=false;
  for(let i=0;i<str.length;i++){
    const c=str[i];
    if(esc){esc=false;continue;}
    if(c==='\\'&&inStr){esc=true;continue;}
    if(c==='"'){inStr=!inStr;continue;}
    if(inStr)continue;
    if(c==='{')braces++;else if(c==='}')braces--;
    else if(c==='[')brackets++;else if(c===']')brackets--;
  }
  let rep=str;
  if(inStr)rep+='"';
  for(let i=0;i<brackets;i++)rep+=']';
  for(let i=0;i<braces;i++)rep+='}';
  rep=rep.replace(/,(\s*[}\]])/g,'$1');
  try { return deepStrip(JSON.parse(rep)); } catch(e) {}
  throw new Error('Could not parse response. Please try again.');
}

function deepStrip(obj) {
  if (typeof obj === 'string') {
    // Remove all <cite ...>...</cite> tags and their content markers
    let s = obj;
    // Pattern: <cite index="...">text</cite> -> text
    s = s.replace(/<cite[^>]*>([\s\S]*?)<\/cite>/gi, '$1');
    // Leftover opening tags
    s = s.replace(/<cite[^>]*>/gi, '');
    // Leftover closing tags
    s = s.replace(/<\/cite>/gi, '');
    // Any remaining angle-bracket cite fragments like <cite index="1-2,3-4"
    s = s.replace(/<cite[^"]*"[^"]*"/gi, '');
    return s.trim();
  }
  if (Array.isArray(obj)) return obj.map(deepStrip);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const k of Object.keys(obj)) out[k] = deepStrip(obj[k]);
    return out;
  }
  return obj;
}

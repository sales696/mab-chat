const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Kevin's AI assistant for Mr. Auto Broker — an OMVIC-registered auto broker in Vaughan, Ontario serving the GTA. Help visitors understand the service and guide them toward booking a free consultation or filling out the lead form. Key facts: 20+ years dealership relationships, flat $500 fee only charged after saving client $1,000+, 50+ Ontario dealerships, serves GTA/Vaughan/York Region. Best deal: $17,655 saved on a 2026 Lexus RX 350. Be friendly, confident, and concise. Never invent prices or inventory.`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { messages } = req.body;
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    });
    res.status(200).json({ content: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get response.' });
  }
};

const OpenAI = require('openai');

// In-memory rate limiting map: IP -> timestamp
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 2000; // 2 seconds cooldown between requests

/**
 * Intelligent contextual fallback engine
 * Provides graceful degradation when external AI APIs are offline,
 * unconfigured, or encounter network timeouts.
 */
function generateContextualFallback(title) {
  const lower = title.toLowerCase();

  if (lower.includes('docker') || lower.includes('container') || lower.includes('compose')) {
    return 'Author multi-stage Dockerfiles and configure Docker Compose orchestration with isolated bridge networks and healthchecks for production deployment.';
  }
  if (lower.includes('ci') || lower.includes('cd') || lower.includes('test') || lower.includes('pipeline')) {
    return 'Implement automated test suites using Jest/Supertest and configure GitHub Actions CI workflow to execute validation tests on every push.';
  }
  if (lower.includes('api') || lower.includes('backend') || lower.includes('route') || lower.includes('express')) {
    return 'Develop RESTful API endpoints with request schema validation, asynchronous error handling middleware, and MongoDB database persistence.';
  }
  if (lower.includes('ui') || lower.includes('frontend') || lower.includes('react') || lower.includes('component')) {
    return 'Build responsive React interface components featuring accessible design, optimistic UI state updates, and interactive feedback indicators.';
  }
  if (lower.includes('bug') || lower.includes('fix') || lower.includes('error') || lower.includes('patch')) {
    return 'Diagnose reported issue via log inspection, implement targeted code corrections, and write regression tests to ensure long-term stability.';
  }
  if (lower.includes('event') || lower.includes('notification') || lower.includes('async')) {
    return 'Decouple notification handling using Node.js native EventEmitter for non-blocking asynchronous event processing without external queue overhead.';
  }

  return `Plan and execute development for "${title}". Verify functional requirements, conduct peer code review, and document implementation steps.`;
}

/**
 * Infer recommended priority from title keywords
 */
function inferPriority(title) {
  const lower = title.toLowerCase();
  if (lower.includes('critical') || lower.includes('fix') || lower.includes('security') || lower.includes('urgent') || lower.includes('bug')) {
    return 'high';
  }
  if (lower.includes('test') || lower.includes('doc') || lower.includes('cleanup') || lower.includes('style')) {
    return 'low';
  }
  return 'medium';
}

/**
 * @desc    Generate AI task description with graceful degradation
 * @route   POST /api/ai/generate-description
 * @access  Public
 */
const generateTaskDescription = async (req, res) => {
  const { title } = req.body;

  // 1. Validation
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Task title is required to generate description',
    });
  }

  const cleanTitle = title.trim();
  const clientIp = req.ip || req.connection?.remoteAddress || 'client';

  // 2. Simple Rate Limiting (Supplementary Problem)
  const now = Date.now();
  const lastRequest = rateLimitMap.get(clientIp);
  if (lastRequest && (now - lastRequest < RATE_LIMIT_WINDOW_MS)) {
    return res.status(429).json({
      success: false,
      error: 'Rate Limit Exceeded',
      message: 'Please wait a moment before requesting another AI suggestion.',
      fallback: true
    });
  }
  rateLimitMap.set(clientIp, now);

  const suggestedPriority = inferPriority(cleanTitle);

  // 3. Attempt External AI API call (OpenAI or Gemini)
  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  try {
    // 3A. OpenAI Integration
    if (openAiKey && !openAiKey.includes('your_key_here') && openAiKey.startsWith('sk-')) {
      const client = new OpenAI({ apiKey: openAiKey });
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an agile software development assistant. Given a task title, write a concise, professional task description (maximum 2-3 sentences) outlining what needs to be accomplished.'
          },
          {
            role: 'user',
            content: `Write a short task description for: "${cleanTitle}"`
          }
        ],
        max_tokens: 120,
        temperature: 0.7,
      });

      const description = completion.choices?.[0]?.message?.content?.trim();
      if (description) {
        return res.status(200).json({
          success: true,
          description,
          suggestedPriority,
          fallback: false,
          modelUsed: 'OpenAI gpt-4o-mini',
          disclaimer: 'AI-generated suggestion. Please review and modify as needed.'
        });
      }
    }

    // 3B. Gemini API Integration (Native Fetch)
    if (geminiKey && !geminiKey.includes('your_key_here')) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `You are an agile assistant. Write a short, professional task description (2-3 sentences max) for the software task title: "${cleanTitle}".` }]
          }],
          generationConfig: { maxOutputTokens: 120, temperature: 0.7 }
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          return res.status(200).json({
            success: true,
            description: text,
            suggestedPriority,
            fallback: false,
            modelUsed: 'Google Gemini 1.5 Flash',
            disclaimer: 'AI-generated suggestion. Please review and modify as needed.'
          });
        }
      }
    }

    // 4. Fallback Path (No API key provided or API unavailable)
    // Graceful degradation: return smart contextual fallback without throwing
    const fallbackDescription = generateContextualFallback(cleanTitle);
    return res.status(200).json({
      success: true,
      description: fallbackDescription,
      suggestedPriority,
      fallback: true,
      modelUsed: 'Contextual Fallback Engine (Offline Resilience)',
      disclaimer: 'AI-generated suggestion. Please review and modify as needed.'
    });

  } catch (err) {
    // 5. Error Catch Path: Ensure server never crashes on third-party failure
    console.error(`AI API Integration Notice: ${err.message}. Engaging graceful degradation fallback.`);
    const fallbackDescription = generateContextualFallback(cleanTitle);

    return res.status(200).json({
      success: true,
      description: fallbackDescription,
      suggestedPriority,
      fallback: true,
      errorDetails: err.message,
      modelUsed: 'Contextual Fallback Engine (Graceful Degradation)',
      disclaimer: 'AI-generated suggestion. Please review and modify as needed.'
    });
  }
};

module.exports = {
  generateTaskDescription,
  generateContextualFallback,
  inferPriority,
};

const promptLibrary = [
  {
    keywords: ['hello', 'hi', 'hey'],
    reply: 'Hi there! I am your friendly web assistant. Ask me anything about the app or just chat!'
  },
  {
    keywords: ['help', 'support'],
    reply: 'Happy to help! Tell me what you need assistance with and I will do my best.'
  },
  {
    keywords: ['features', 'capabilities'],
    reply: 'I can keep track of our conversation, answer quick questions, and offer friendly banter.'
  },
  {
    keywords: ['thanks', 'thank you'],
    reply: 'You are very welcome! Let me know if there is anything else you would like to chat about.'
  }
];

function resolveReply(message) {
  const normalized = message.toLowerCase();
  for (const entry of promptLibrary) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      return entry.reply;
    }
  }

  const fallbacks = [
    'That is interesting! Can you tell me a bit more?',
    'I am thinking about that. What else would you add?',
    'Good question! I would love to hear your thoughts too.',
    'Let us explore that further. What angle interests you the most?'
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body ?? {};

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const response = resolveReply(message.trim());

  res.status(200).json({ reply: response, timestamp: Date.now() });
}

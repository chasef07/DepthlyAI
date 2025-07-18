// api/track-bot.js - Vercel Serverless Function

const AI_BOT_PATTERNS = [
  /GPTBot/i,
  /ChatGPT-User/i,
  /OpenAI/i,
  /ClaudeBot/i,
  /Claude-Web/i,
  /Anthropic/i,
  /Bard/i,
  /GoogleOther/i,
  /PerplexityBot/i,
  /YouBot/i,
  /Meta-ExternalAgent/i,
  /FacebookBot/i,
  /facebookexternalhit/i,
  /Applebot/i,
  /Bytespider/i,
  /PetalBot/i,
  /Scrapy/i,
  /python-requests/i,
  /curl/i,
  /wget/i,
];

async function sendToDiscord(logData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('Discord webhook URL not configured');
    return;
  }

  try {
    const embed = {
      title: '🤖 AI Bot Detected',
      color: 0xff6b35,
      fields: [
        {
          name: 'User Agent',
          value: `\`${logData.userAgent.substring(0, 100)}${logData.userAgent.length > 100 ? '...' : ''}\``,
          inline: false
        },
        {
          name: 'URL',
          value: logData.url,
          inline: true
        },
        {
          name: 'IP Address',
          value: logData.ip || 'Unknown',
          inline: true
        },
        {
          name: 'Country',
          value: logData.country || 'Unknown',
          inline: true
        },
        {
          name: 'Timestamp',
          value: new Date().toISOString(),
          inline: false
        }
      ],
      footer: {
        text: 'Vercel Bot Tracker'
      }
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send to Discord:', error);
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userAgent = req.headers['user-agent'] || '';
  const { url } = req.body || {};
  const ip = req.headers['x-forwarded-for'] || 
            req.headers['x-real-ip'] || 
            req.connection?.remoteAddress;
  const country = req.headers['cf-ipcountry'] || 'Unknown';

  // Check if user agent matches any AI bot pattern
  const isAIBot = AI_BOT_PATTERNS.some(pattern => pattern.test(userAgent));

  if (isAIBot) {
    const logData = {
      userAgent,
      url: url || req.headers.referer,
      ip,
      country,
      timestamp: new Date().toISOString()
    };

    console.log('AI Bot detected:', JSON.stringify(logData, null, 2));
    
    // Send to Discord
    await sendToDiscord(logData);
    
    res.status(200).json({ 
      detected: true, 
      message: 'Bot detected and logged',
      userAgent: userAgent.substring(0, 50) + '...'
    });
  } else {
    res.status(200).json({ detected: false });
  }
}
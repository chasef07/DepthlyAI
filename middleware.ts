import { NextRequest, NextResponse } from 'next/server'

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1395767918238761121/C3lMcr8wyt9MiZ872KxKOf17jElTVp4iOhRAltQEygOgnQL_Oyde5YTGsdUj6sZT9_r6'

export async function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || ''
  const pathname = req.nextUrl.pathname
  const isBot = /bot|gpt|crawl|spider|bing|google|claude/i.test(userAgent)

  if (isBot) {
    fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🤖 Bot visit detected!\nUser-Agent: ${userAgent}\nPath: ${pathname}\nTime: ${new Date().toISOString()}`
      }),
    }).catch(() => {})
  }

  return NextResponse.next()
}



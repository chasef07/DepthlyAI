// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
  
}

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1395767918238761121/C3lMcr8wyt9MiZ872KxKOf17jElTVp4iOhRAltQEygOgnQL_Oyde5YTGsdUj6sZT9_r6'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  const pathname = request.nextUrl.pathname
  const isBot = /bot|gpt|crawl|spider|bing|google|claude/i.test(userAgent)

  if (isBot) {
    // Fire and forget - don't await to avoid blocking the request
    fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🤖 Bot visit detected!\nUser-Agent: ${userAgent}\nPath: ${pathname}\nTime: ${new Date().toISOString()}`
      }),
    }).catch(() => {})
  }

  // Continue with the request - this is the key fix
  return NextResponse.next()
}
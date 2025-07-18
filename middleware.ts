// middleware.ts
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
  runtime: 'experimental-edge',
}

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1395767918238761121/C3lMcr8wyt9MiZ872KxKOf17jElTVp4iOhRAltQEygOgnQL_Oyde5YTGsdUj6sZT9_r6'

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || ''
  const pathname = request.nextUrl.pathname
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

  return new Response(null, {
    status: 200,
    headers: {
      'x-middleware-next': '1',
    },
  })
}

// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || 'unknown'
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const pathname = req.nextUrl.pathname

  // Example: Log only bots
  if (/bot|GPT|Google|Bing|Claude|crawler/i.test(userAgent)) {
    fetch('https://your-endpoint.com/log', {
      method: 'POST',
      body: JSON.stringify({ userAgent, ip, pathname }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(err => console.error('log fail', err))
  }

  return NextResponse.next()
}

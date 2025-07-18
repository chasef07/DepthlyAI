import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || ''
  const isBot = /bot|gpt|crawl|spider|bing|google|claude/i.test(userAgent)

  if (isBot) {
    console.log(`[BOT DETECTED] User-Agent: ${userAgent} Path: ${req.nextUrl.pathname}`)
  }

  return NextResponse.next()
}


import { NextResponse } from 'next/server'

const KEY = process.env.APISPORTS_KEY!
const BASE = 'https://v3.football.api-sports.io'

export async function GET() {
  try {
    const [liveRes, todayRes] = await Promise.all([
      fetch(`${BASE}/fixtures?live=all`, { headers: { 'x-apisports-key': KEY }, next: { revalidate: 60 } }),
      fetch(`${BASE}/fixtures?date=${new Date().toISOString().split('T')[0]}&timezone=America/Sao_Paulo`, { headers: { 'x-apisports-key': KEY }, next: { revalidate: 300 } })
    ])

    const [liveData, todayData] = await Promise.all([liveRes.json(), todayRes.json()])

    const liveMatches = liveData.response || []
    const todayMatches = todayData.response || []

    const liveIds = new Set(liveMatches.map((m: any) => m.fixture.id))
    const combined = [
      ...liveMatches,
      ...todayMatches.filter((m: any) => !liveIds.has(m.fixture.id))
    ]

    const LEAGUES = [71, 13, 2, 39, 3, 9, 128, 11]
    const filtered = combined.filter((m: any) => LEAGUES.includes(m.league?.id))

    return NextResponse.json({ matches: filtered.length > 0 ? filtered : combined.slice(0, 20) })
  } catch (e) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}

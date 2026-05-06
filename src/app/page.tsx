'use client'
import { useEffect, useState } from 'react'

const LEAGUES: Record<string, string> = {
  '71': '🇧🇷 Brasileirão',
  '13': '🏆 Libertadores',
  '2': '🌍 Champions League',
  '39': '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League',
}

export default function Home() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    fetch('/api/matches')
      .then(r => r.json())
      .then(d => {
        setMatches(d.matches || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? matches : matches.filter(m => String(m.league?.id) === filter)

  if (selected) return <MatchDetail match={selected} onBack={() => setSelected(null)} />

  return (
    <div style={{minHeight:'100vh',background:'#080b10',color:'#e8edf5',fontFamily:'sans-serif'}}>
      <div style={{background:'#0d1117',borderBottom:'1px solid #1e2d42',padding:'16px 24px',display:'flex',alignItems:'center',gap:'12px'}}>
        <span style={{fontSize:'24px'}}>⚽</span>
        <span style={{fontWeight:'800',fontSize:'20px',letterSpacing:'2px'}}>SCOUTBET</span>
        <span style={{marginLeft:'auto',background:'rgba(255,77,109,0.15)',color:'#ff4d6d',padding:'4px 10px',borderRadius:'6px',fontSize:'12px',fontWeight:'700'}}>● LIVE</span>
      </div>

      <div style={{padding:'20px 24px'}}>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'20px'}}>
          {[['all','Todos'],['71','🇧🇷 Brasileirão'],['13','🏆 Libertadores'],['2','🌍 Champions'],['39','🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier']].map(([k,v]) => (
            <button key={k} onClick={() => setFilter(k)}
              style={{padding:'6px 14px',borderRadius:'20px',border:`1px solid ${filter===k?'#00e5a0':'#263347'}`,
              background:filter===k?'rgba(0,229,160,0.15)':'#131920',color:filter===k?'#00e5a0':'#8a9ab5',cursor:'pointer',fontSize:'13px'}}>
              {v}
            </button>
          ))}
        </div>

        {loading && <div style={{textAlign:'center',padding:'48px',color:'#4e5f78'}}>⏳ Buscando jogos...</div>}
        {!loading && filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'48px',color:'#4e5f78'}}>
            <div style={{fontSize:'48px',marginBottom:'12px'}}>⚽</div>
            <div>Nenhum jogo encontrado hoje nessa liga.</div>
          </div>
        )}

        {filtered.map((m: any) => {
          const isLive = ['1H','HT','2H','ET','P'].includes(m.fixture?.status?.short)
          const isFinished = m.fixture?.status?.short === 'FT'
          return (
            <div key={m.fixture?.id} onClick={() => setSelected(m)}
              style={{background:'#0d1117',border:`1px solid ${isLive?'#ff4d6d':'#1e2d42'}`,borderRadius:'12px',
              padding:'14px 18px',marginBottom:'8px',cursor:'pointer',
              display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:'12px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <img src={m.teams?.home?.logo} width={32} height={32} style={{objectFit:'contain'}} onError={(e:any)=>e.target.style.display='none'} />
                <span style={{fontWeight:'600',fontSize:'14px'}}>{m.teams?.home?.name}</span>
              </div>
              <div style={{textAlign:'center',minWidth:'90px'}}>
                {isLive || isFinished
                  ? <div style={{fontFamily:'monospace',fontSize:'24px',fontWeight:'900'}}>{m.goals?.home ?? 0} - {m.goals?.away ?? 0}</div>
                  : <div style={{fontFamily:'monospace',fontSize:'16px',color:'#e8edf5'}}>{m.fixture?.date?.substring(11,16)}</div>}
                <div style={{fontSize:'10px',color:isLive?'#ff4d6d':'#4e5f78',fontWeight:'700',marginTop:'2px'}}>
                  {isLive ? `● ${m.fixture?.status?.elapsed}'` : m.fixture?.status?.long}
                </div>
                <div style={{fontSize:'10px',color:'#4e5f78'}}>{LEAGUES[String(m.league?.id)]}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'flex-end'}}>
                <span style={{fontWeight:'600',fontSize:'14px',textAlign:'right'}}>{m.teams?.away?.name}</span>
                <img src={m.teams?.away?.logo} width={32} height={32} style={{objectFit:'contain'}} onError={(e:any)=>e.target.style.display='none'} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MatchDetail({ match: m, onBack }: any) {
  const isLive = ['1H','HT','2H','ET','P'].includes(m.fixture?.status?.short)
  return (
    <div style={{minHeight:'100vh',background:'#080b10',color:'#e8edf5',fontFamily:'sans-serif'}}>
      <div style={{background:'#0d1117',borderBottom:'1px solid #1e2d42',padding:'16px 24px',display:'flex',alignItems:'center',gap:'12px'}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:'#00e5a0',cursor:'pointer',fontSize:'14px',fontWeight:'600'}}>← Voltar</button>
        <span style={{color:'#4e5f78',fontSize:'13px'}}>{m.league?.name} — {m.league?.round}</span>
      </div>
      <div style={{padding:'28px 24px',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'32px',marginBottom:'28px'}}>
          <div style={{textAlign:'center'}}>
            <img src={m.teams?.home?.logo} width={80} height={80} style={{objectFit:'contain'}} />
            <div style={{fontWeight:'700',marginTop:'10px',fontSize:'16px'}}>{m.teams?.home?.name}</div>
          </div>
          <div>
            {isLive || m.fixture?.status?.short==='FT'
              ? <div style={{fontSize:'48px',fontWeight:'900',fontFamily:'monospace'}}>{m.goals?.home} - {m.goals?.away}</div>
              : <div style={{fontSize:'32px',fontWeight:'700',color:'#00e5a0',fontFamily:'monospace'}}>{m.fixture?.date?.substring(11,16)}</div>}
            <div style={{fontSize:'12px',color:isLive?'#ff4d6d':'#4e5f78',fontWeight:'700',marginTop:'4px'}}>
              {isLive ? `● AO VIVO ${m.fixture?.status?.elapsed}'` : m.fixture?.status?.long}
            </div>
          </div>
          <div style={{textAlign:'center'}}>
            <img src={m.teams?.away?.logo} width={80} height={80} style={{objectFit:'contain'}} />
            <div style={{fontWeight:'700',marginTop:'10px',fontSize:'16px'}}>{m.teams?.away?.name}</div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px',maxWidth:'480px',margin:'0 auto'}}>
          {[
            ['🏆 Liga',m.league?.name],
            ['🌍 País',m.league?.country],
            ['🏟️ Estádio',m.fixture?.venue?.name],
            ['📅 Data',m.fixture?.date?.substring(0,10)],
          ].map(([k,v])=>(
            <div key={k} style={{background:'#0d1117',border:'1px solid #1e2d42',borderRadius:'10px',padding:'14px'}}>
              <div style={{fontSize:'11px',color:'#4e5f78',marginBottom:'4px'}}>{k}</div>
              <div style={{fontWeight:'600',fontSize:'13px'}}>{v||'—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

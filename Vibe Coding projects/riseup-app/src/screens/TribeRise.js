import React, { useState } from 'react';

const leaderboard = [
  { rank:1, initials:'PK', name:'Priya K.', score:'7/7', streak:'Perfect week 🔥', color:'rgba(186,117,23,0.3)', textColor:'#FCD34D', owed:null },
  { rank:2, initials:'RS', name:'Rohan S. (you)', score:'5/7', streak:'4-day streak', color:'rgba(24,95,165,0.3)', textColor:'#60A5FA', owed:null },
  { rank:3, initials:'AM', name:'Aditya M.', score:'4/7', streak:'Owes ₹100', color:'rgba(83,74,183,0.3)', textColor:'#A78BFA', owed:'₹100' },
  { rank:4, initials:'SN', name:'Sneha N.', score:'3/7', streak:'Owes ₹200', color:'rgba(29,158,117,0.3)', textColor:'#34D399', owed:'₹200' },
];

export default function TribeRise({ go, userData }) {
  const [reacted, setReacted] = useState({});

  const react = (i, r) => setReacted(s => ({...s, [i]: r}));

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>TribeRise</h2>
        <p>Wake up with your people</p>
      </div>
      <div className="screen-body">

        {/* Tribe card */}
        <div className="card" style={{marginBottom:12}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12}}>
            <div>
              <div style={{fontSize:16,fontWeight:700}}>🏃 Mumbai Runners Club</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:3}}>12 members · ₹50 stake / miss · 6:00–6:30 AM</div>
            </div>
            <span className="badge badge-teal">Active</span>
          </div>
          <div style={{display:'flex',gap:4,marginBottom:8}}>
            {[1,1,1,1,0,0,0].map((hit,i) => (
              <div key={i} style={{
                width:10,height:10,borderRadius:'50%',
                background: i===4 ? '#60A5FA' : hit ? '#1D9E75' : 'rgba(255,255,255,0.12)',
                border: i===4 ? '2px solid #60A5FA' : 'none'
              }}/>
            ))}
          </div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>Your streak: 4 days · Win prize: Free massage at ProSport Spa, Bandra</div>
        </div>

        {/* Pool */}
        <div style={{background:'rgba(24,95,165,0.1)',border:'1px solid rgba(24,95,165,0.2)',borderRadius:14,padding:'12px 14px',marginBottom:12,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>This week's pool</div>
            <div style={{fontSize:28,fontWeight:700,color:'#60A5FA'}}>₹450</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>4 days left</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginTop:2}}>Winner: healthy breakfast</div>
            <div style={{fontSize:11,color:'#34D399',marginTop:1}}>The Green Theory, Bandra</div>
          </div>
        </div>

        <div className="section-label">Leaderboard — this week</div>
        <div className="card">
          {leaderboard.map((m,i) => (
            <div key={i} className="row" style={{alignItems:'center'}}>
              <div style={{fontSize:14,fontWeight:700,width:18,color: m.rank===1 ? '#FCD34D' : 'rgba(255,255,255,0.4)'}}>{m.rank}</div>
              <div style={{width:32,height:32,borderRadius:'50%',background:m.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:m.textColor,flexShrink:0}}>
                {m.initials}
              </div>
              <div className="row-main">
                <div className="row-title" style={{fontSize:13}}>{m.name}</div>
                <div className="row-sub">{m.streak}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                <div style={{fontSize:14,fontWeight:700,color: m.rank===1 ? '#FCD34D' : 'rgba(255,255,255,0.65)'}}>{m.score}</div>
                {i > 0 && (
                  <div style={{display:'flex',gap:4}}>
                    {['🔥','😢','🏆'].map(r => (
                      <button key={r} onClick={() => react(i,r)} style={{
                        fontSize:12,padding:'2px 4px',borderRadius:8,border:'none',cursor:'pointer',
                        background: reacted[i]===r ? 'rgba(255,255,255,0.15)' : 'transparent'
                      }}>{r}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Redemption options */}
        <div className="section-label">Reward options (Pro)</div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12}}>
          {[
            {icon:'🍽',title:'Tribe experience',sub:'Book group dinner at The Green Theory via Dineout',color:'rgba(29,158,117,0.15)',border:'rgba(29,158,117,0.3)'},
            {icon:'🍕',title:'Split to group',sub:'Everyone gets ₹75 Zomato credit',color:'rgba(24,95,165,0.12)',border:'rgba(24,95,165,0.25)'},
            {icon:'💰',title:'Winner takes all',sub:'₹427.50 to UPI after 2.5% platform fee',color:'rgba(186,117,23,0.12)',border:'rgba(186,117,23,0.25)'},
          ].map((r,i) => (
            <div key={i} style={{background:r.color,border:`1px solid ${r.border}`,borderRadius:12,padding:'10px 12px',display:'flex',gap:10,alignItems:'center',cursor:'pointer'}}
              onClick={() => alert(`Selected: ${r.title}`)}>
              <div style={{fontSize:20}}>{r.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{r.title}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:2}}>{r.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => alert('Opening WhatsApp with challenge link...')} className="btn-secondary">
          Challenge friends via WhatsApp 💬
        </button>

        <div style={{fontSize:11,color:'rgba(255,255,255,0.25)',textAlign:'center',marginTop:10}}>
          Stage 2 revenue: 2.5% fee on ₹450 pool = ₹11.25 this week
        </div>
      </div>
    </div>
  );
}

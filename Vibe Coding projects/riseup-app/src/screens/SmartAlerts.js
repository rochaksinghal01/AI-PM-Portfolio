import React, { useState } from 'react';

export default function SmartAlerts({ go, userData }) {
  const [waterOn, setWaterOn] = useState(true);
  const [standOn, setStandOn] = useState(true);
  const [medOn, setMedOn]   = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [timerMin, setTimerMin] = useState(8);

  if (showCreate) return (
    <div className="screen" style={{padding:'16px 24px'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
        <button onClick={() => setShowCreate(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:20,cursor:'pointer'}}>←</button>
        <h2 style={{fontSize:20,fontWeight:700}}>Quick alert</h2>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'rgba(255,255,255,0.04)',borderRadius:12,border:'1px solid rgba(255,255,255,0.08)',marginBottom:20,cursor:'pointer'}}
        onClick={() => alert('Voice: "Remind me about milk in 8 minutes"')}>
        <span style={{fontSize:16}}>🎙</span>
        <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>"Remind me about milk in 8 minutes"</span>
        <span style={{fontSize:11,color:'#60A5FA',fontWeight:600,marginLeft:'auto'}}>Speak</span>
      </div>
      <div className="section-label">Quick presets</div>
      {[['🥛','Milk on stove','8 min'],['🍲','Daal on flame','20 min'],['♨️','Pressure cooker','12 min'],['👕','Laundry cycle','45 min']].map(([icon,label,dur],i) => (
        <div key={i} className="card-sm" style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer',marginBottom:8}}
          onClick={() => { setTimerMin(parseInt(dur)); }}>
          <div style={{fontSize:20}}>{icon}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{label}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>{dur} default</div></div>
          <span className="badge badge-amber">{dur}</span>
        </div>
      ))}
      <div className="section-label" style={{marginTop:16}}>Set duration</div>
      <div style={{display:'flex',alignItems:'center',gap:16,justifyContent:'center',margin:'16px 0'}}>
        <button onClick={() => setTimerMin(m => Math.max(1,m-1))} style={{width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontSize:20,cursor:'pointer'}}>−</button>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:48,fontWeight:300}}>{timerMin}</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>minutes</div>
        </div>
        <button onClick={() => setTimerMin(m => Math.min(120,m+1))} style={{width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontSize:20,cursor:'pointer'}}>+</button>
      </div>
      <button className="btn-primary" onClick={() => { alert(`Alert set! Fires in ${timerMin} minutes.`); setShowCreate(false); }}>
        Set alert — fires at {new Date(Date.now()+timerMin*60000).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
      </button>
    </div>
  );

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Smart alerts</h2>
        <p>AI-powered · all contexts</p>
      </div>
      <div className="screen-body">
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'rgba(255,255,255,0.04)',borderRadius:12,border:'1px solid rgba(255,255,255,0.08)',marginBottom:12,cursor:'pointer'}}
          onClick={() => setShowCreate(true)}>
          <span style={{fontSize:16}}>🎙</span>
          <span style={{fontSize:12,color:'rgba(255,255,255,0.4)',flex:1}}>"Remind me about milk in 8 minutes"</span>
          <span style={{fontSize:11,color:'#60A5FA',fontWeight:600}}>Voice set</span>
        </div>

        <div className="section-label">Household</div>
        <div className="card">
          <div className="row" style={{cursor:'pointer'}} onClick={() => setShowCreate(true)}>
            <div className="row-icon">🥛</div>
            <div className="row-main"><div className="row-title">Milk on stove</div><div className="row-sub">Tap to set timer · voice or preset</div></div>
            <span className="badge badge-amber">Quick</span>
          </div>
          <div className="row" style={{cursor:'pointer'}} onClick={() => setShowCreate(true)}>
            <div className="row-icon">🍲</div>
            <div className="row-main"><div className="row-title">Daal / cooking</div><div className="row-sub">20 min default · NLP-aware</div></div>
            <span className="badge badge-amber">Quick</span>
          </div>
        </div>

        <div className="section-label">Wellness</div>
        <div className="card">
          <div className="row">
            <div className="row-icon">💧</div>
            <div className="row-main"><div className="row-title">Drink water</div><div className="row-sub">Every 90 min · 8 AM–8 PM</div></div>
            <div className={`toggle ${waterOn?'on':''}`} onClick={() => setWaterOn(v=>!v)}/>
          </div>
          <div className="row">
            <div className="row-icon">🧍</div>
            <div className="row-main"><div className="row-title">Stand up</div><div className="row-sub">Every 45 min · suppressed if moving</div></div>
            <div className={`toggle ${standOn?'on':''}`} onClick={() => setStandOn(v=>!v)}/>
          </div>
          <div className="row">
            <div className="row-icon">💊</div>
            <div className="row-main"><div className="row-title">Medicine</div><div className="row-sub">After meals · SMS-detected cadence</div></div>
            <div className={`toggle ${medOn?'on':''}`} onClick={() => setMedOn(v=>!v)}/>
          </div>
          <div className="row">
            <div className="row-icon">👁</div>
            <div className="row-main"><div className="row-title">Eye break (20-20-20)</div><div className="row-sub">Every 20 min screen time</div></div>
            <div className="toggle" onClick={() => {}}/>
          </div>
        </div>

        <div className="section-label">SMS-detected</div>
        <div className="card">
          <div className="row">
            <div className="row-icon">🏥</div>
            <div className="row-main"><div className="row-title">Apollo Hospitals</div><div className="row-sub">Dr. Mehta · 22 Mar 11:00 AM</div></div>
            <span className="badge badge-teal">Auto</span>
          </div>
          <div className="row">
            <div className="row-icon">✈️</div>
            <div className="row-main"><div className="row-title">IndiGo 6E-244 check-in</div><div className="row-sub">Web check-in · 24h before · 25 Mar</div></div>
            <span className="badge badge-teal">Auto</span>
          </div>
        </div>

        <div className="section-label">Predictive — today</div>
        <div style={{background:'rgba(153,60,29,0.12)',border:'1px solid rgba(153,60,29,0.25)',borderRadius:14,padding:'14px',marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:600,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4}}>⚽ Arsenal FC · Premier League · Today</div>
          <div style={{fontSize:15,fontWeight:700,marginBottom:2}}>Arsenal vs Manchester City</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Emirates Stadium · KO 7:30 PM</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.6)',lineHeight:1.7,marginBottom:10}}>
            <span style={{fontWeight:600}}>Predicted XI:</span> Raya · White, Saliba, Gabriel, Zinchenko · Odegaard, Thomas, Rice · Saka, Havertz, Martinelli
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button onClick={() => alert('Opening Spotify: Arsenal Anthem')} style={{background:'rgba(29,185,84,0.15)',border:'1px solid rgba(29,185,84,0.3)',color:'#1DB954',borderRadius:20,padding:'5px 12px',fontSize:11,fontWeight:600,cursor:'pointer'}}>
              🎵 Play anthem
            </button>
            <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Alert set 6:45 PM</span>
          </div>
        </div>

        <div style={{background:'rgba(83,74,183,0.12)',border:'1px solid rgba(83,74,183,0.25)',borderRadius:14,padding:'14px',marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:600,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4}}>🎬 Netflix · New episode</div>
          <div style={{fontSize:15,fontWeight:700,marginBottom:2}}>Sacred Games S3 — now streaming</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Episode 1 dropped · matches your watch history</div>
          <button onClick={() => alert('Opening Netflix')} style={{background:'rgba(83,74,183,0.2)',border:'1px solid rgba(83,74,183,0.3)',color:'#A78BFA',borderRadius:20,padding:'5px 12px',fontSize:11,fontWeight:600,cursor:'pointer'}}>
            Open Netflix →
          </button>
        </div>

        <div style={{padding:'10px 12px',background:'rgba(255,165,0,0.08)',borderRadius:12,border:'1px solid rgba(255,165,0,0.15)',marginBottom:8,fontSize:12,color:'rgba(255,255,255,0.6)',textAlign:'center'}}>
          ⚠️ Meeting DND active: no alerts fire during calendar events
        </div>
      </div>
    </div>
  );
}

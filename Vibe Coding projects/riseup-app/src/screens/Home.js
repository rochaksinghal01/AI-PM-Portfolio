import React, { useState } from 'react';

export default function Home({ go, userData }) {
  const [alarms, setAlarms] = useState([
    { id:1, time:'07:00', label:'Weekdays · Spotify', on:true, tag:'ContextWake' },
    { id:2, time:'08:00', label:'Weekends · Nature', on:false, tag:null },
  ]);

  const toggleAlarm = (id) => setAlarms(a => a.map(x => x.id===id ? {...x,on:!x.on} : x));

  const name = userData.name || 'Rohan';

  return (
    <div className="screen">
      <div className="screen-header">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h2>Good morning, {name} 👋</h2>
          <span style={{fontSize:18,cursor:'pointer'}} onClick={() => go('ringing')}>🔔</span>
        </div>
        <p>Tuesday, 18 Mar · 18°C Mumbai</p>
      </div>

      <div className="screen-body">
        {/* ContextWake banner */}
        <div style={{background:'rgba(29,158,117,0.12)',border:'1px solid rgba(29,158,117,0.25)',borderRadius:14,padding:'10px 14px',marginBottom:12,display:'flex',gap:10,alignItems:'flex-start'}}>
          <span style={{fontSize:16}}>📅</span>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.75)',lineHeight:1.5}}>
            <span style={{fontWeight:600,color:'#34D399'}}>ContextWake active</span> — Standup at 9 AM detected. Alarm adjusted to 7:00 AM with 1h 45min buffer.
          </div>
        </div>

        {/* Voice bar */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'rgba(255,255,255,0.04)',borderRadius:12,border:'1px solid rgba(255,255,255,0.08)',marginBottom:12,cursor:'pointer'}}
          onClick={() => alert('Voice: Try saying — "Set alarm for 6:30 for gym tomorrow"')}>
          <span style={{fontSize:16}}>🎙</span>
          <span style={{fontSize:12,color:'rgba(255,255,255,0.4)',flex:1}}>Set alarm with voice</span>
          <span style={{fontSize:11,color:'#60A5FA',fontWeight:600}}>Tap to speak</span>
        </div>

        <div className="section-label">Your alarms</div>
        <div className="card">
          {alarms.map(a => (
            <div key={a.id} className="row">
              <div style={{flex:1}}>
                <div style={{fontSize:22,fontWeight:600,letterSpacing:'-0.5px'}}>{a.time}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginTop:2}}>{a.label}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                <div className={`toggle ${a.on?'on':''}`} onClick={() => toggleAlarm(a.id)}/>
                {a.tag && <span className="badge badge-teal">{a.tag}</span>}
              </div>
            </div>
          ))}
          <div className="row" style={{cursor:'pointer'}} onClick={() => alert('Add new alarm')}>
            <div style={{fontSize:14,color:'#60A5FA',fontWeight:600}}>+ Add alarm</div>
          </div>
        </div>

        <div className="section-label">Today's highlights</div>
        <div className="card">
          <div className="row" onClick={() => go('alerts')} style={{cursor:'pointer'}}>
            <div className="row-icon">⚽</div>
            <div className="row-main">
              <div className="row-title">Arsenal vs Man City tonight</div>
              <div className="row-sub">Lineup alert set · 7:30 PM · Emirates</div>
            </div>
            <span className="badge badge-coral">7:30 PM</span>
          </div>
          <div className="row" onClick={() => go('tribe')} style={{cursor:'pointer'}}>
            <div className="row-icon">🏆</div>
            <div className="row-main">
              <div className="row-title">Mumbai Runners Club streak</div>
              <div className="row-sub">4-day streak · Pool: ₹250</div>
            </div>
            <span className="badge badge-amber">Day 4</span>
          </div>
          <div className="row" onClick={() => go('routine')} style={{cursor:'pointer'}}>
            <div className="row-icon">🌅</div>
            <div className="row-main">
              <div className="row-title">Morning routine ready</div>
              <div className="row-sub">7:00 AM · 8 blocks · 75 min</div>
            </div>
            <span className="badge badge-blue">Active</span>
          </div>
        </div>

        <button
          className="btn-primary"
          style={{marginTop:8}}
          onClick={() => go('ringing')}
        >
          Preview alarm ringing screen →
        </button>
      </div>
    </div>
  );
}

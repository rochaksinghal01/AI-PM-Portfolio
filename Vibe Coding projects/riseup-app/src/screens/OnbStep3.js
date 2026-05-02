import React, { useState } from 'react';

const perms = [
  { key:'calendar', icon:'📅', title:'Calendar', sub:'Auto-adjust your alarm when you have an early meeting', default:true },
  { key:'sms',      icon:'💬', title:'SMS / Messages', sub:'Detect your flight bookings and doctor appointments. On-device only.', default:true },
  { key:'notifs',   icon:'🔔', title:'Notifications', sub:"So your alerts actually reach you", default:true },
  { key:'mic',      icon:'🎙', title:'Microphone', sub:'Set reminders and snooze alarms by voice', default:true },
  { key:'location', icon:'📍', title:'Location (optional)', sub:'Detect if you\'re at the gym, office, or travelling', default:false },
];

export default function OnbStep3({ go }) {
  const [enabled, setEnabled] = useState(
    Object.fromEntries(perms.map(p => [p.key, p.default]))
  );
  const [spotify, setSpotify] = useState(false);

  return (
    <div className="screen" style={{padding:'16px 24px'}}>
      <div className="dots">
        <div className="dot"/><div className="dot"/><div className="dot active"/><div className="dot"/>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:6}}>Step 3 of 4</div>
        <h2 style={{fontSize:22,fontWeight:700}}>A few permissions</h2>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginTop:4}}>These power RiseUp's smartest features. All optional.</p>
      </div>

      <div className="card" style={{marginBottom:12}}>
        {perms.map(p => (
          <div key={p.key} className="row">
            <div className="row-icon">{p.icon}</div>
            <div className="row-main">
              <div className="row-title">{p.title}</div>
              <div className="row-sub">{p.sub}</div>
            </div>
            <div
              className={`toggle ${enabled[p.key]?'on':''}`}
              onClick={() => setEnabled(e => ({...e,[p.key]:!e[p.key]}))}
            />
          </div>
        ))}
      </div>

      <div className="card-sm" style={{marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontSize:22}}>🎵</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600}}>Spotify</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:1}}>Wake up to your music every morning</div>
          </div>
          {spotify ? (
            <span className="badge badge-teal">Connected</span>
          ) : (
            <button
              onClick={() => setSpotify(true)}
              style={{background:'rgba(29,185,84,0.15)',border:'1px solid rgba(29,185,84,0.3)',color:'#1DB954',borderRadius:20,padding:'5px 12px',fontSize:11,fontWeight:600,cursor:'pointer'}}
            >
              Connect
            </button>
          )}
        </div>
      </div>

      <button className="btn-primary" onClick={() => go('onb4')}>Allow selected</button>
      <button className="btn-secondary" onClick={() => go('onb4')}>Set up later</button>
    </div>
  );
}

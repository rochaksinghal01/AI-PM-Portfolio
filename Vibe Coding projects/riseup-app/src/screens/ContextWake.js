import React, { useState } from 'react';

export default function ContextWake({ go }) {
  const [showCalc, setShowCalc] = useState(false);

  const events = [
    { icon:'💼', title:'9:00 AM Standup', sub:'Google Meet · Video call', type:'video', commute:null, badge:'badge-teal', badgeLabel:'Video call' },
    { icon:'✈️', title:'IndiGo 6E-244 · BOM→DEL', sub:'26 Mar 9:00 AM · T2 departure', type:'flight', commute:'40 min drive', badge:'badge-coral', badgeLabel:'40 min drive' },
    { icon:'🏢', title:'Client meeting', sub:'Worli office · In person', type:'inperson', commute:'28 min drive', badge:'badge-amber', badgeLabel:'28 min' },
  ];

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>ContextWake</h2>
        <p>Calendar-aware alarm intelligence</p>
      </div>
      <div className="screen-body">

        {/* Active banner */}
        <div style={{background:'rgba(29,158,117,0.1)',border:'1px solid rgba(29,158,117,0.25)',borderRadius:14,padding:'12px 14px',marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#34D399',marginBottom:4}}>🧠 ContextWake active</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.6)',lineHeight:1.5}}>
            Alarm adjusted from 7:30 AM → 7:00 AM for your 9 AM standup. Routine duration: 55 min + 5 min buffer.
          </div>
        </div>

        {/* Formula */}
        <button onClick={() => setShowCalc(v=>!v)} className="card-sm" style={{width:'100%',textAlign:'left',cursor:'pointer',marginBottom:12,border:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:8}}>How alarm is calculated</div>
          <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',fontSize:12}}>
            <span style={{color:'#60A5FA',fontWeight:600}}>Event 9:00 AM</span>
            <span style={{color:'rgba(255,255,255,0.3)'}}>−</span>
            <span style={{color:'#34D399',fontWeight:600}}>Commute 0 min</span>
            <span style={{color:'rgba(255,255,255,0.3)'}}>−</span>
            <span style={{color:'#FCD34D',fontWeight:600}}>Routine 55 min</span>
            <span style={{color:'rgba(255,255,255,0.3)'}}>−</span>
            <span style={{color:'rgba(255,255,255,0.5)'}}>Buffer 5 min</span>
            <span style={{color:'rgba(255,255,255,0.3)'}}>= </span>
            <span style={{color:'white',fontWeight:700,fontSize:14}}>7:00 AM ✓</span>
          </div>
          {showCalc && (
            <div style={{marginTop:10,padding:'10px',background:'rgba(255,255,255,0.04)',borderRadius:10}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',lineHeight:1.8}}>
                <div>📅 Calendar sync: Google Calendar + Outlook</div>
                <div>🗺 Maps API: live traffic prediction for 9 AM tomorrow</div>
                <div>🌅 Routine: 55 min (Rohan's weekday Morning OS)</div>
                <div>⏱ Buffer: 5 min fixed (video call events)</div>
                <div style={{marginTop:6,color:'#60A5FA',fontWeight:600}}>Engine runs nightly at 10 PM. Live monitoring 6 PM–midnight.</div>
              </div>
            </div>
          )}
        </button>

        <div className="section-label">Tomorrow's events</div>
        <div className="card">
          {events.map((e,i) => (
            <div key={i} className="row">
              <div className="row-icon">{e.icon}</div>
              <div className="row-main">
                <div className="row-title">{e.title}</div>
                <div className="row-sub">{e.sub}</div>
              </div>
              <span className={`badge ${e.badge}`}>{e.badgeLabel}</span>
            </div>
          ))}
        </div>

        <div className="section-label">Alarm adjustment summary</div>
        <div className="card">
          {[
            ['Original alarm',  '7:30 AM', true],
            ['Video call buffer','5 min', false],
            ['Morning routine', '55 min', false],
            ['New alarm time',  '7:00 AM', false],
          ].map(([label,val,strike],i) => (
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom: i<3 ? '1px solid rgba(255,255,255,0.06)' : 'none'}}>
              <span style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>{label}</span>
              <span style={{fontSize: i===3 ? 16 : 13, fontWeight: i===3 ? 700 : 400, color: i===3 ? '#60A5FA' : strike ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.8)',textDecoration:strike?'line-through':'none'}}>{val}</span>
            </div>
          ))}
        </div>

        <div className="section-label">Connected calendars (Pro)</div>
        <div className="card">
          {[
            {icon:'📅',name:'Google Calendar',sub:'Personal · Synced 10 PM',status:'Connected',color:'badge-teal'},
            {icon:'💼',name:'Microsoft Outlook',sub:'Work · hritik@company.com',status:'Connected',color:'badge-teal'},
            {icon:'💬',name:'SMS bookings',sub:'Flights, doctor, hotel auto-detected',status:'Active',color:'badge-blue'},
          ].map((c,i) => (
            <div key={i} className="row">
              <div className="row-icon">{c.icon}</div>
              <div className="row-main">
                <div className="row-title">{c.name}</div>
                <div className="row-sub">{c.sub}</div>
              </div>
              <span className={`badge ${c.color}`}>{c.status}</span>
            </div>
          ))}
          <div className="row" style={{cursor:'pointer'}} onClick={() => alert('Add calendar source')}>
            <div style={{fontSize:13,color:'#60A5FA',fontWeight:600}}>+ Add calendar source</div>
          </div>
        </div>

        <div style={{background:'rgba(186,117,23,0.1)',border:'1px solid rgba(186,117,23,0.2)',borderRadius:12,padding:'10px 12px',marginBottom:8,fontSize:12,color:'rgba(255,255,255,0.6)',lineHeight:1.5}}>
          <span style={{fontWeight:600,color:'#FCD34D'}}>Live detection on</span> — Monitoring calendar for changes every 30 min (6 PM–midnight). If your meeting moves, your alarm moves.
        </div>
      </div>
    </div>
  );
}

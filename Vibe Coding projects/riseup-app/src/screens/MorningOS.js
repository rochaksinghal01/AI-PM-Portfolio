import React, { useState } from 'react';

const blocks = [
  { icon:'⏰', title:'Alarm + morning brief', sub:'Weather · calendar · Arsenal tonight', time:'7:00', done:true,  app:null },
  { icon:'🎵', title:'Spotify fade-in', sub:'Chill Morning Vibes · background', time:'7:02', done:true,  app:'Spotify' },
  { icon:'🧘', title:'Meditation', sub:'Calm · 5 min breathwork', time:'7:05', done:false, app:'Calm', current:true },
  { icon:'🏃', title:'Outdoor run', sub:'Nike Run Club · 3km Bandra route', time:'7:10', done:false, app:'Nike' },
  { icon:'🚿', title:'Shower', sub:'Countdown timer · 10 min', time:'7:35', done:false, app:null },
  { icon:'👔', title:'Get ready', sub:'15 min', time:'7:45', done:false, app:null },
  { icon:'☕', title:'Breakfast + news brief', sub:'Inshorts · voice read · 15 min', time:'8:00', done:false, app:'Inshorts' },
  { icon:'🗺', title:'Leave home', sub:'Google Maps · 22 min to office', time:'8:15', done:false, app:'Maps' },
];

export default function MorningOS({ go }) {
  const [rushMode, setRushMode] = useState(false);
  const [showNight, setShowNight] = useState(false);

  const displayBlocks = rushMode
    ? blocks.filter(b => ['⏰','🚿','👔','🗺'].includes(b.icon))
    : blocks;

  return (
    <div className="screen">
      <div className="screen-header">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h2>Morning OS</h2>
          <button onClick={() => setRushMode(r=>!r)} style={{
            fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:20,border:'none',cursor:'pointer',
            background: rushMode ? 'rgba(153,60,29,0.25)' : 'rgba(255,255,255,0.06)',
            color: rushMode ? '#F87171' : 'rgba(255,255,255,0.4)'
          }}>
            {rushMode ? '⚡ Rush Mode ON' : 'Rush Mode'}
          </button>
        </div>
        <p>Tuesday flow · 7:00 → 8:15 AM</p>
      </div>
      <div className="screen-body">

        {rushMode && (
          <div style={{background:'rgba(153,60,29,0.15)',border:'1px solid rgba(153,60,29,0.3)',borderRadius:12,padding:'10px 12px',marginBottom:12,fontSize:12,color:'#F87171',lineHeight:1.5}}>
            <span style={{fontWeight:700}}>Rush Mode active</span> — Snoozed twice. Routine collapsed to essentials. Leave by 8:00 AM.
          </div>
        )}

        {/* Spotify card */}
        <div style={{background:'rgba(29,158,117,0.1)',border:'1px solid rgba(29,158,117,0.2)',borderRadius:12,padding:'10px 14px',marginBottom:12,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:18}}>🎵</span>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:600,color:'#34D399'}}>Now on Spotify</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:1}}>Chill Morning Vibes · Recommended for you</div>
          </div>
          <button onClick={() => alert('Opening Spotify')} style={{fontSize:11,color:'#1DB954',background:'rgba(29,185,84,0.1)',border:'1px solid rgba(29,185,84,0.2)',borderRadius:20,padding:'4px 10px',cursor:'pointer',fontWeight:600}}>Open</button>
        </div>

        <div style={{padding:'0 4px'}}>
          {displayBlocks.map((b, i) => (
            <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'10px 0',position:'relative'}}>
              {i < displayBlocks.length - 1 && (
                <div style={{position:'absolute',left:15,top:36,bottom:-10,width:1,background:'rgba(255,255,255,0.08)'}}/>
              )}
              <div style={{
                width:30,height:30,borderRadius:'50%',flexShrink:0,
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,
                background: b.done ? 'rgba(29,158,117,0.2)' : b.current ? 'rgba(24,95,165,0.3)' : 'rgba(255,255,255,0.06)',
                border: b.done ? '1px solid rgba(29,158,117,0.4)' : b.current ? '1px solid rgba(55,138,221,0.5)' : '1px solid rgba(255,255,255,0.1)',
              }}>
                {b.done ? '✓' : b.icon}
              </div>
              <div style={{flex:1,paddingTop:2}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:11,fontWeight:600,color: b.current ? '#60A5FA' : 'rgba(255,255,255,0.3)'}}>{b.time}</span>
                  {b.current && <span className="badge badge-blue">Now</span>}
                </div>
                <div style={{fontSize:13,fontWeight:600,color: b.done ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.9)',marginTop:2}}>{b.title}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:1}}>{b.sub}</div>
                {b.app && !b.done && (
                  <button onClick={() => alert(`Opening ${b.app}`)} style={{marginTop:6,fontSize:10,fontWeight:600,color:'#60A5FA',background:'rgba(24,95,165,0.15)',border:'1px solid rgba(24,95,165,0.25)',borderRadius:20,padding:'3px 8px',cursor:'pointer'}}>
                    Open {b.app} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:16,borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:12}}>
          <button onClick={() => setShowNight(v=>!v)} style={{width:'100%',background:'rgba(83,74,183,0.1)',border:'1px solid rgba(83,74,183,0.2)',borderRadius:12,padding:'10px',color:'#A78BFA',fontSize:13,fontWeight:600,cursor:'pointer'}}>
            {showNight ? '▲ Hide' : '🌙 View night routine'}
          </button>
          {showNight && (
            <div style={{marginTop:10}}>
              {[
                {icon:'📵',title:'Screen-off reminder',time:'10:30 PM'},
                {icon:'📅',title:'Tomorrow brief',time:'10:35 PM'},
                {icon:'📖',title:'Reading (15 min)',time:'10:40 PM'},
                {icon:'🎵',title:'Spotify sleep sounds',time:'10:55 PM'},
                {icon:'⏰',title:'Alarm confirmed · DND on',time:'11:00 PM'},
              ].map((b,i) => (
                <div key={i} style={{display:'flex',gap:10,alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  <span style={{fontSize:16}}>{b.icon}</span>
                  <div style={{flex:1,fontSize:13}}>{b.title}</div>
                  <span style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>{b.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

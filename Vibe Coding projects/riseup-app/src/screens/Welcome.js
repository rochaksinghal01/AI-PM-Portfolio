import React from 'react';

export default function Welcome({ go }) {
  return (
    <div className="screen" style={{padding:'32px 24px',justifyContent:'space-between'}}>
      <div style={{textAlign:'center',marginTop:40}}>
        <div style={{fontSize:64,marginBottom:12}}>⏰</div>
        <h1 style={{fontSize:32,fontWeight:700,letterSpacing:'-1px'}}>RiseUp</h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:14,marginTop:8,lineHeight:1.5}}>
          The alarm clock that knows your life
        </p>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:10,margin:'32px 0'}}>
        {[
          {icon:'🎯',title:'Predictive alerts',sub:'Arsenal lineup, Netflix drops, flights — all automatic'},
          {icon:'🏆',title:'Community stakes',sub:'Wake up with your tribe. Miss = pay. Win = rewards.'},
          {icon:'🌅',title:'Morning ritual',sub:'From alarm to door — Spotify, run, brief, Maps.'},
          {icon:'📅',title:'Calendar-aware',sub:'Alarm adjusts itself. No more wrong wake times.'},
        ].map((f,i) => (
          <div key={i} className="card-sm" style={{display:'flex',gap:12,alignItems:'center'}}>
            <div style={{fontSize:22,width:36,textAlign:'center'}}>{f.icon}</div>
            <div>
              <div style={{fontSize:13,fontWeight:600}}>{f.title}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:2}}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button className="btn-primary" onClick={() => go('onb1')}>Get started</button>
        <button className="btn-secondary" onClick={() => go('home')}>I already have an account</button>
      </div>
    </div>
  );
}

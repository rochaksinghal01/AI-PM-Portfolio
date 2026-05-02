import React, { useState } from 'react';

export default function OnbStep4({ go }) {
  const [hour, setHour] = useState(7);
  const [min, setMin] = useState(0);
  const [sound, setSound] = useState('spotify');
  const [routine, setRoutine] = useState(true);

  const fmt = (h,m) => `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;

  const sounds = [
    {key:'spotify',label:'Spotify playlist'},
    {key:'chime',label:'Gentle chime'},
    {key:'nature',label:'Nature sounds'},
    {key:'energy',label:'Energetic'},
  ];

  return (
    <div className="screen" style={{padding:'16px 24px'}}>
      <div className="dots">
        <div className="dot"/><div className="dot"/><div className="dot"/><div className="dot active"/>
      </div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:6}}>Step 4 of 4</div>
        <h2 style={{fontSize:22,fontWeight:700}}>Set your first alarm</h2>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginTop:4}}>AI suggested based on your profession. Adjust anytime.</p>
      </div>

      <div style={{textAlign:'center',margin:'20px 0 24px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
          <button onClick={() => setHour(h => h > 4 ? h-1 : h)}
            style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontSize:18,cursor:'pointer'}}>−</button>
          <div style={{fontSize:56,fontWeight:300,letterSpacing:'-2px',fontVariantNumeric:'tabular-nums'}}>
            {fmt(hour,min)}
          </div>
          <button onClick={() => setHour(h => h < 11 ? h+1 : h)}
            style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontSize:18,cursor:'pointer'}}>+</button>
        </div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginTop:6}}>Weekdays · suggested for working professional</div>
      </div>

      <div style={{marginBottom:16}}>
        <div className="section-label">Wake sound</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {sounds.map(s => (
            <button key={s.key} className={`chip ${sound===s.key?'sel':''}`} onClick={() => setSound(s.key)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-sm" style={{marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{fontSize:18}}>🌅</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600}}>Morning OS routine</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:1}}>Spotify → meditation → run → breakfast → Maps</div>
          </div>
          <div className={`toggle ${routine?'on':''}`} onClick={() => setRoutine(r=>!r)} />
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,padding:'10px 12px',background:'rgba(255,255,255,0.04)',borderRadius:12,border:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{fontSize:16}}>🎙</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',flex:1}}>Or say: "Wake me at 6:30 for gym tomorrow"</div>
        <span style={{fontSize:11,color:'#60A5FA',fontWeight:600}}>Try it</span>
      </div>

      <button className="btn-primary" onClick={() => go('paywall')}>
        I'm ready to RiseUp
      </button>
    </div>
  );
}

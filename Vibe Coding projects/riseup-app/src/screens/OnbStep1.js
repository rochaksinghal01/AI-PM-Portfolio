import React, { useState } from 'react';

const professions = [
  {key:'working',label:'Working professional'},
  {key:'student',label:'Student'},
  {key:'homemaker',label:'Homemaker'},
  {key:'freelancer',label:'Freelancer'},
  {key:'retired',label:'Retired'},
];

export default function OnbStep1({ go, userData, setUserData }) {
  const [name, setName] = useState(userData.name || '');
  const [profession, setProfession] = useState(userData.profession || '');
  const [city, setCity] = useState('Mumbai');

  const handleNext = () => {
    setUserData(u => ({ ...u, name, profession, city }));
    go('onb2');
  };

  return (
    <div className="screen" style={{padding:'16px 24px'}}>
      <div className="dots">
        <div className="dot active"/><div className="dot"/><div className="dot"/><div className="dot"/>
      </div>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:6}}>Step 1 of 4</div>
        <h2 style={{fontSize:22,fontWeight:700}}>Who are you?</h2>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginTop:4}}>We use this to personalise everything from day one.</p>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <div>
          <label style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontWeight:600,display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.6px'}}>Your name</label>
          <input
            value={name} onChange={e=>setName(e.target.value)}
            placeholder="Rohan"
            style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'12px 14px',color:'white',fontSize:15,outline:'none'}}
          />
        </div>

        <div>
          <label style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontWeight:600,display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.6px'}}>City</label>
          <input
            value={city} onChange={e=>setCity(e.target.value)}
            placeholder="Mumbai"
            style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'12px 14px',color:'white',fontSize:15,outline:'none'}}
          />
        </div>

        <div>
          <label style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontWeight:600,display:'block',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.6px'}}>Profession</label>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {professions.map(p => (
              <button
                key={p.key}
                onClick={() => setProfession(p.key)}
                style={{
                  padding:'12px 14px',borderRadius:12,textAlign:'left',
                  background: profession===p.key ? 'rgba(24,95,165,0.25)' : 'rgba(255,255,255,0.04)',
                  border: profession===p.key ? '1px solid rgba(55,138,221,0.6)' : '1px solid rgba(255,255,255,0.08)',
                  color: profession===p.key ? '#60A5FA' : 'rgba(255,255,255,0.65)',
                  fontSize:14, fontWeight: profession===p.key ? 600 : 400,
                  cursor:'pointer',transition:'all 0.15s'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{marginTop:24}}>
        <button className="btn-primary" onClick={handleNext} disabled={!name||!profession}>
          Continue
        </button>
      </div>
    </div>
  );
}

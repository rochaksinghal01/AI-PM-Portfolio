import React, { useState } from 'react';

const interests = [
  { key:'football', label:'⚽ Football', sub:'Which club?', options:['Arsenal FC','Manchester City','Real Madrid','Barcelona','Liverpool','Other'] },
  { key:'cricket',  label:'🏏 Cricket',  sub:'Favourite team?', options:['Team India','Mumbai Indians','CSK','RCB','Other'] },
  { key:'netflix',  label:'🎬 Netflix',  sub:'Platform?', options:['Netflix','Prime Video','Hotstar','Zee5','All of these'] },
  { key:'music',    label:'🎵 Music',    sub:'Top artist?', options:['Arijit Singh','AP Dhillon','Coldplay','Drake','Other'] },
  { key:'finance',  label:'📈 Finance',  sub:'Track what?', options:['Nifty50','Sensex','My stocks','Crypto','All'] },
  { key:'fitness',  label:'💪 Fitness',  sub:'Activity?', options:['Running','Gym','Yoga','Cycling','Walking'] },
  { key:'gaming',   label:'🎮 Gaming',   sub:'Platform?', options:['Mobile','PS5','Xbox','PC','Nintendo'] },
  { key:'cooking',  label:'🍳 Cooking',  sub:'Cuisine?', options:['Indian','Italian','Asian','Continental','All'] },
  { key:'travel',   label:'✈️ Travel',   sub:'Style?', options:['Weekend trips','International','Backpacking','Luxury','All'] },
  { key:'news',     label:'📰 News',     sub:'Topics?', options:['Tech','Business','Sports','Politics','All'] },
];

export default function OnbStep2({ go, userData, setUserData }) {
  const [selected, setSelected] = useState(userData.interests || []);
  const [subAnswers, setSubAnswers] = useState({});

  const toggle = (key) => {
    setSelected(s => s.includes(key) ? s.filter(k=>k!==key) : [...s,key]);
  };

  const setSubAnswer = (key, val) => setSubAnswers(s => ({...s,[key]:val}));

  const handleNext = () => {
    setUserData(u => ({...u, interests: selected, subAnswers}));
    go('onb3');
  };

  return (
    <div className="screen" style={{padding:'16px 24px'}}>
      <div className="dots">
        <div className="dot"/><div className="dot active"/><div className="dot"/><div className="dot"/>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:6}}>Step 2 of 4</div>
        <h2 style={{fontSize:22,fontWeight:700}}>What are you into?</h2>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginTop:4}}>Powers your predictive alerts. Pick everything that applies.</p>
      </div>

      <div className="screen-body" style={{paddingLeft:0,paddingRight:0}}>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
          {interests.map(i => (
            <button
              key={i.key}
              className={`chip ${selected.includes(i.key)?'sel':''}`}
              onClick={() => toggle(i.key)}
            >
              {i.label}
            </button>
          ))}
        </div>

        {interests.filter(i => selected.includes(i.key)).map(i => (
          <div key={i.key} className="card-sm" style={{marginBottom:8}}>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:8}}>
              {i.label} — {i.sub}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {i.options.map(o => (
                <button
                  key={o}
                  onClick={() => setSubAnswer(i.key, o)}
                  style={{
                    padding:'5px 10px',borderRadius:20,fontSize:11,
                    background: subAnswers[i.key]===o ? 'rgba(24,95,165,0.3)' : 'rgba(255,255,255,0.04)',
                    border: subAnswers[i.key]===o ? '1px solid rgba(55,138,221,0.6)' : '1px solid rgba(255,255,255,0.08)',
                    color: subAnswers[i.key]===o ? '#60A5FA' : 'rgba(255,255,255,0.5)',
                    cursor:'pointer', fontWeight: subAnswers[i.key]===o ? 600 : 400,
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="btn-primary" onClick={handleNext} style={{marginTop:8}}>
          Continue {selected.length > 0 && `(${selected.length} selected)`}
        </button>
        <button className="btn-secondary" onClick={() => go('onb3')}>Skip for now</button>
      </div>
    </div>
  );
}

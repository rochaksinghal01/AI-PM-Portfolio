import React, { useState } from 'react';

export default function AlarmRinging({ go, setTab }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="screen" style={{padding:'32px 24px',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>🌅</div>
        <h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}>Good morning, Rohan!</h2>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:24}}>Morning routine starting...</p>
        <div style={{background:'rgba(29,158,117,0.1)',border:'1px solid rgba(29,158,117,0.2)',borderRadius:14,padding:'14px',marginBottom:12,textAlign:'left'}}>
          <div style={{fontSize:12,fontWeight:600,color:'#34D399',marginBottom:8}}>Today's brief</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.6)',lineHeight:1.8}}>
            <div>☁️ 18°C · Partly cloudy · Mumbai</div>
            <div>📋 3 events today · first: 9:00 AM standup</div>
            <div>⚽ Arsenal vs Man City tonight 7:30 PM</div>
            <div>🏆 Tribe streak: 4 days · pool ₹450</div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => { go('routine'); }}>
          Start morning routine 🌅
        </button>
        <button className="btn-secondary" onClick={() => go('home')}>
          Go to home
        </button>
      </div>
    );
  }

  return (
    <div className="screen" style={{
      background:'linear-gradient(180deg, #0D2B5E 0%, #185FA5 100%)',
      justifyContent:'space-between',
      padding:'20px 24px 40px',
    }}>
      <div style={{textAlign:'center',marginTop:20}}>
        <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Tuesday, 18 March</div>
        <div style={{fontSize:72,fontWeight:200,letterSpacing:'-3px',lineHeight:1}}>07:00</div>
        <div style={{fontSize:14,color:'rgba(255,255,255,0.6)',marginTop:8}}>Good morning, Rohan</div>
      </div>

      <div style={{background:'rgba(255,255,255,0.08)',backdropFilter:'blur(10px)',borderRadius:16,padding:'14px',textAlign:'center',border:'1px solid rgba(255,255,255,0.1)'}}>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:6}}>Today's brief</div>
        <div style={{fontSize:13,color:'white',lineHeight:1.8}}>
          <div>18°C · Partly cloudy · 3 events today</div>
          <div style={{color:'rgba(255,255,255,0.7)'}}>Arsenal 7:30 PM · ⚽ Lineup ready</div>
          <div style={{color:'rgba(255,255,255,0.7)'}}>🏆 Tribe: Day 4 streak · Pool ₹450</div>
        </div>
      </div>

      <div style={{textAlign:'center'}}>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:16}}>Tap to dismiss or swipe up</div>
        <div
          onClick={() => setDismissed(true)}
          style={{
            width:80,height:80,borderRadius:'50%',
            background:'rgba(250,236,231,0.15)',
            border:'3px solid rgba(249,150,75,0.8)',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:28,cursor:'pointer',margin:'0 auto',
            animation:'pulse 1.5s ease-in-out infinite',
          }}
        >
          🌅
        </div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginTop:10}}>Tap ring to start morning routine</div>
      </div>

      <div style={{display:'flex',gap:12,justifyContent:'center'}}>
        <button
          onClick={() => alert('Snoozed for 5 minutes')}
          style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',color:'white',padding:'12px 28px',borderRadius:24,fontSize:14,fontWeight:500,cursor:'pointer'}}
        >
          Snooze 5 min
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{background:'white',border:'none',color:'#185FA5',padding:'12px 28px',borderRadius:24,fontSize:14,fontWeight:700,cursor:'pointer'}}
        >
          Dismiss
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(249,150,75,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(249,150,75,0); }
        }
      `}</style>
    </div>
  );
}

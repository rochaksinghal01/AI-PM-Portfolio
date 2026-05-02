import React from 'react';

export default function Paywall({ go, userData, setUserData }) {
  const handlePro = () => {
    setUserData(u => ({...u, isPro: true}));
    go('home');
  };

  return (
    <div className="screen" style={{padding:'16px 24px'}}>
      <div style={{textAlign:'center',margin:'16px 0 24px'}}>
        <div style={{fontSize:32,marginBottom:8}}>✨</div>
        <h2 style={{fontSize:22,fontWeight:700}}>Upgrade to RiseUp Pro</h2>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginTop:6}}>7-day free trial. No card required.</p>
      </div>

      <div className="paywall-card" style={{marginBottom:8}}>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:6}}>Free forever</div>
        <div style={{fontSize:22,fontWeight:700,marginBottom:8}}>₹0</div>
        {['3 alarms · Basic alerts','1 community group','Manual ContextWake suggestions','3 predictive alerts / week'].map((f,i) => (
          <div key={i} style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>{i < 2 ? '✓' : '✗'} {f}</div>
        ))}
      </div>

      <div className="paywall-card featured" style={{marginTop:20,marginBottom:8}}>
        <div className="popular-badge">Most popular</div>
        <div style={{fontSize:11,color:'#60A5FA',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:6}}>Pro</div>
        <div style={{fontSize:22,fontWeight:700,marginBottom:2}}>₹299<span style={{fontSize:13,fontWeight:400,color:'rgba(255,255,255,0.4)'}}>/month</span></div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:10}}>or ₹1,999/year — save 44%</div>
        {['Unlimited alarms + all AI alerts','Unlimited community + stakes','Full Morning OS + integrations','ContextWake auto-adjust + multi-cal','All predictive categories + Spotify'].map((f,i) => (
          <div key={i} style={{fontSize:12,color:'rgba(255,255,255,0.75)',marginBottom:5}}>✓ {f}</div>
        ))}
      </div>

      <div style={{marginTop:16}}>
        <button className="btn-primary" onClick={handlePro}>Start 7-day free trial</button>
        <button className="btn-secondary" onClick={() => go('home')}>Continue with free plan</button>
        <p style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,0.25)',marginTop:10}}>Cancel anytime. No charge until trial ends.</p>
      </div>
    </div>
  );
}

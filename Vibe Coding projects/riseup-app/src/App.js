import React, { useState } from 'react';
import './App.css';

// Screens
import Welcome from './screens/Welcome';
import OnbStep1 from './screens/OnbStep1';
import OnbStep2 from './screens/OnbStep2';
import OnbStep3 from './screens/OnbStep3';
import OnbStep4 from './screens/OnbStep4';
import Paywall from './screens/Paywall';
import Home from './screens/Home';
import SmartAlerts from './screens/SmartAlerts';
import TribeRise from './screens/TribeRise';
import MorningOS from './screens/MorningOS';
import ContextWake from './screens/ContextWake';
import AlarmRinging from './screens/AlarmRinging';

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [tab, setTab] = useState('home');
  const [userData, setUserData] = useState({
    name: 'Rohan', profession: 'working', interests: ['football','netflix'],
    isPro: false
  });

  const go = (s) => setScreen(s);

  const mainScreens = ['home','alerts','tribe','routine','context'];

  const renderScreen = () => {
    switch(screen) {
      case 'welcome':     return <Welcome go={go} />;
      case 'onb1':        return <OnbStep1 go={go} userData={userData} setUserData={setUserData} />;
      case 'onb2':        return <OnbStep2 go={go} userData={userData} setUserData={setUserData} />;
      case 'onb3':        return <OnbStep3 go={go} />;
      case 'onb4':        return <OnbStep4 go={go} />;
      case 'paywall':     return <Paywall go={go} userData={userData} setUserData={setUserData} />;
      case 'ringing':     return <AlarmRinging go={go} setTab={setTab} />;
      case 'home':        return <Home go={go} userData={userData} />;
      case 'alerts':      return <SmartAlerts go={go} userData={userData} />;
      case 'tribe':       return <TribeRise go={go} userData={userData} />;
      case 'routine':     return <MorningOS go={go} userData={userData} />;
      case 'context':     return <ContextWake go={go} userData={userData} />;
      default:            return <Welcome go={go} />;
    }
  };

  const showNav = mainScreens.includes(screen);

  const navItems = [
    { key: 'home',    icon: '⏰', label: 'Alarms' },
    { key: 'alerts',  icon: '🎯', label: 'Alerts' },
    { key: 'tribe',   icon: '🏆', label: 'Tribe' },
    { key: 'routine', icon: '🌅', label: 'Routine' },
    { key: 'context', icon: '📅', label: 'Context' },
  ];

  return (
    <div className="app-shell">
      <div className="phone">
        <div className="status-bar">
          <span>9:41</span>
          <span style={{display:'flex',gap:4,alignItems:'center'}}>
            <span>●●●</span><span>WiFi</span><span>100%</span>
          </span>
        </div>

        {renderScreen()}

        {showNav && (
          <div className="bottom-nav">
            {navItems.map(n => (
              <button
                key={n.key}
                className={`bnav-btn ${screen === n.key ? 'active' : ''}`}
                onClick={() => { setScreen(n.key); setTab(n.key); }}
              >
                <span className="bnav-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

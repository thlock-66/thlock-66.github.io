import React, { useState } from 'react';
import './AboutPlayground.css';
import { Thresher } from './OceanCreatures';
import OceanDex from './OceanDex';
import OutdoorClimb from './OutdoorClimb';

const LENSES = [
  { id:'climb', label:'On the wall', tag:'CLIMBING', title:'A little chalk. A lot of fresh air.', text:'I like exploring outdoor lines, getting outside, and finding a new way up. Rainy days? There’s always the gym.', note:'', accent:'#8060ba' },
  { id:'dive', label:'Underwater', tag:'DIVING', title:'Gotta spot ’em all.', text:'A little collection of familiar faces and creatures I’m still hoping to meet. One dive at a time.', note:'', accent:'#268b83' },
  { id:'photo', label:'Behind the lens', tag:'PHOTOGRAPHY', title:'Small moments are worth a second look.', text:'Photography gives me another way to explore. I’m drawn to the light, shapes and little details that make an ordinary moment feel a bit different.', note:'', accent:'#ce7051' },
];
function InterestIcon({index}) {
 if(index===1)return <Thresher/>;
 return <svg viewBox="0 0 150 110" aria-hidden="true">{index===0?<><path d="M26 45Q30 15 69 20T123 51L112 85Q79 105 43 87Z" fill="#a58ac9"/><path d="M54 38q22-11 37 2" fill="none" stroke="#d8c5ef" strokeWidth="10" strokeLinecap="round"/><circle cx="83" cy="68" r="4" fill="#735390"/></>:<><rect x="21" y="30" width="109" height="66" rx="13" fill="#514554"/><path d="M43 30v-12h34l10 12" fill="#76617b"/><circle cx="78" cy="62" r="26" fill="#c8b6d5"/><circle cx="78" cy="62" r="18" fill="#3b3547"/><circle cx="72" cy="56" r="6" fill="#aabdbb"/><rect x="106" y="40" width="14" height="8" rx="2" fill="#f5cd7a"/></>}</svg>;
}

export default function AboutPlayground({ camera }) {
  const [lens,setLens]=useState(0),[stickerTurn,setStickerTurn]=useState(0);
  const data=LENSES[lens];
  return <section className="about-playground section-pad" id="about" style={{'--about-accent':data.accent}}>
    <div className="about-introduction"><div><h2>Serious about design.<br/><em>Curious about</em><br/><span className="about-word-everything">everything.<svg viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true"><path d="M5 18Q170 0 395 13" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/></svg></span></h2></div><div className="about-intro-copy"><button type="button" className="about-curious-sticker" style={{transform:`rotate(${stickerTurn*60-12}deg)`}} onClick={()=>setStickerTurn(n=>n+1)} aria-label="Give the curiosity sticker a spin"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="m60 3 11 17 20-4 2 21 19 9-10 18 10 18-19 9-2 21-20-4-11 17-11-17-20 4-2-21-19-9 10-18-10-18 19-9 2-21 20 4Z" fill="#ee744f"/><circle cx="46" cy="55" r="5" fill="#32243c"/><circle cx="74" cy="55" r="5" fill="#32243c"/><path d="M42 72q18 18 36 0" fill="none" stroke="#32243c" strokeWidth="4" strokeLinecap="round"/></svg></button><p>I like asking the extra question, finding the pattern, and turning a complicated something into a clearer next step.</p><span>There’s more than one way to get to know me. ↓</span></div></div>
    <div className="interest-picker" role="group" aria-label="Explore my interests"><div className="interest-objects">{LENSES.map((l,i)=><button type="button" key={l.id} className={`interest-object object-${l.id}`} aria-pressed={lens===i} aria-controls="about-lens-panel" onClick={()=>setLens(i)}><InterestIcon index={i}/><span>{l.label}</span><b aria-hidden="true">{lens===i?'you are here':'explore ↗'}</b></button>)}</div></div>
    <div className={`about-lens-panel ${lens===2?'with-camera':lens===1?'with-dex':'with-boulder'}`} id="about-lens-panel" role="region" aria-label={data.label}>
      <div className="about-lens-story" key={`story-${data.id}`}><h3>{data.title}</h3><p>{data.text}</p>{data.note&&<span className="about-story-note">{data.note}</span>}</div>
      <div className={`about-play-stage stage-${data.id}`}><div className="about-scene-enter" key={data.id}>{lens===0?<OutdoorClimb/>:lens===1?<OceanDex/>:camera}</div></div>
    </div>
  </section>;
}

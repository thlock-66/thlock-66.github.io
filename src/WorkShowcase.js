import React, { useEffect, useRef, useState } from 'react';
import { portfolioProjects } from './portfolioProjects';
import './WorkShowcase.css';

const CHAPTERS = [
  { id: 'context', label: 'The context', title: 'Start with the right problem.', question: 'What was happening, who was affected, and why did it matter?', placeholder: 'The people, constraints and stakes behind the brief.' },
  { id: 'research', label: 'What I learned', title: 'Listen before drawing.', question: 'What did the evidence reveal that the brief didn’t?', placeholder: 'The observations that changed how the problem was understood.' },
  { id: 'direction', label: 'The decisions', title: 'Make the reasoning visible.', question: 'Why this direction, and what did it trade off?', placeholder: 'The options considered, the choices made, and the reasons behind them.' },
  { id: 'iteration', label: 'The evolution', title: 'Good work changes its mind.', question: 'What changed after feedback, and why?', placeholder: 'The path from an early idea to a more considered solution.' },
  { id: 'outcome', label: 'The impact', title: 'What changed. What’s next.', question: 'What improved, what is still unknown, and what would I do differently?', placeholder: 'The evidence of impact, the limitations, and the lessons to carry forward.' },
];
const STAGES = [
  ['Understand', 'Find the real question.', 'Connect the brief to the people, their tasks and the constraints around them.'],
  ['Frame', 'Choose what matters.', 'Turn observations into a focused problem, priorities and a definition of success.'],
  ['Explore', 'Make alternatives tangible.', 'Compare directions, explain trade-offs and use prototypes to test assumptions.'],
  ['Refine', 'Follow the evidence.', 'Show what feedback changed, what shipped and what still needs to be learned.'],
];
const Arrow = ({ back = false }) => <span aria-hidden="true">{back ? '↖' : '↗'}</span>;

function ProjectArt({ type, mode = 'refined' }) {
  const patternId = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  if (type === 'dental') return <div className="work-art work-art-experiment" aria-hidden="true"><svg viewBox="0 0 480 340" style={{width:'100%',height:'100%'}}><ellipse cx="240" cy="275" rx="128" ry="18" fill="#bca9b6" opacity=".18"/><path d="M135 118C117 263 175 283 240 283S363 263 345 118" fill="none" stroke="#dba5af" strokeWidth="55" strokeLinecap="round"/>{[[135,122,-14],[143,168,-20],[160,209,-30],[194,240,-17],[240,250,0],[286,240,17],[320,209,30],[337,168,20],[345,122,14]].map(([x,y,r],i)=><rect key={i} x={x-19} y={y-23} width="38" height="46" rx="14" fill="#fffdf7" stroke="#d8c9c4" strokeWidth="2" transform={`rotate(${r} ${x} ${y})`}/>)}<path d="M178 109Q240 65 302 109" stroke="#9d819b" strokeWidth="2" strokeDasharray="5 7" fill="none"/><circle cx="240" cy="85" r="5" fill="#9d819b"/></svg></div>;
  if (type === 'planning') return <div className={`work-art work-art-map ${mode}`} aria-hidden="true">
    <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
    <div className="map-sheet"><div className="sheet-top"><span>FIELD NOTES</span><span>01 — PLAN</span></div>
      <svg viewBox="0 0 480 290"><defs><pattern id={`grid-${patternId}`} width="38" height="38" patternUnits="userSpaceOnUse"><path d="M38 0H0V38" fill="none" stroke="#b9bcad" strokeWidth=".6"/></pattern></defs><rect width="480" height="290" fill={`url(#grid-${patternId})`}/><path d="M-20 190Q120 110 190 165T500 55" stroke="#c5cfb9" strokeWidth="47" fill="none"/><path d="M20 30 140 80 260 40 410 150 340 260 130 235Z" fill="#9981ad22" stroke="#8c749d" strokeWidth="2" strokeDasharray="6 6"/><path d="M100 215Q190 80 345 135" fill="none" stroke="#bc777f" strokeWidth="3"/>{[[100,215],[215,112],[345,135]].map(([x,y],i)=><g key={x}><circle cx={x} cy={y} r="10" fill="#fffdf7"/><circle cx={x} cy={y} r="5" fill="#8c749d"/><text x={x+15} y={y+5} fill="#64546d" fontSize="12">{String.fromCharCode(65+i)}</text></g>)}</svg>
      <div className="sheet-bottom"><span>A little less complexity.</span><span>↗</span></div></div>
    <div className="art-note note-map"><span>THE DESIGN QUESTION</span><p>How can a complex task<br/>feel clearer?</p><i/></div>
  </div>;
  if (type === 'learning') return <div className={`work-art work-art-learning ${mode}`} aria-hidden="true"><div className="art-orbit orbit-one"/>
    <div className="learning-sheet"><div className="sheet-top"><span>THE LEARNING JOURNEY</span><span>↗</span></div><h4>A clearer<br/><em>next step.</em></h4><div className="learning-path">{['Begin','Build','Grow'].map((x,i)=><div key={x}><b>{i+1}</b><span>{x}</span><i/></div>)}</div><div className="learning-lines"><i/><i/><i/></div></div>
    <div className="art-note note-learning"><span>ONE THING AT A TIME</span><div className="art-check">✓</div><p>Find your way forward.</p></div><div className="art-spark">✳</div>
  </div>;
  return <div className={`work-art work-art-experiment ${mode}`} aria-hidden="true"><div className="art-orbit orbit-two"/>
    <div className="experiment-sheet"><span>SMALL EXPLORATIONS / BIG CURIOSITY</span><div className="experiment-bloom">✳</div><p>What if<br/><em>we tried this?</em></p><div className="experiment-swatches"><i/><i/><i/><i/></div></div><div className="experiment-sticker">made<br/><em>to play.</em></div>
  </div>;
}

function CaseImage({ image, onExpand }) {
  if (!image?.src) return null;
  return <figure className="case-figure"><button type="button" onClick={()=>onExpand(image)} aria-label={`Enlarge ${image.alt || 'project image'}`}><img src={image.src} alt={image.alt || ''} loading="lazy"/><span>Enlarge ↗</span></button>{image.caption&&<figcaption>{image.caption}</figcaption>}</figure>;
}

function DecisionExplorer({ decisions, art, onExpand }) {
  const [index, setIndex] = useState(0), [version, setVersion] = useState('after');
  const hasDecisions = decisions.length > 0;
  const selected = decisions[index] || {};
  const picture = selected[version];
  return <div className="decision-explorer">
    {hasDecisions&&<div className="decision-picker" aria-label="Design decisions">{decisions.map((d,i)=><button type="button" key={i} aria-pressed={i===index} onClick={()=>{setIndex(i);setVersion('after');}}>{String(i+1).padStart(2,'0')} {d.title}</button>)}</div>}
    <div className="decision-bar"><span>{hasDecisions?selected.title:'A decision, two moments'}</span><div role="group" aria-label="Compare design versions"><button type="button" aria-pressed={version==='before'} onClick={()=>setVersion('before')}>Early direction</button><button type="button" aria-pressed={version==='after'} onClick={()=>setVersion('after')}>After iteration</button></div></div>
    <div className={`decision-canvas ${version}`}>
      {picture?.src?<CaseImage image={picture} onExpand={onExpand}/>:<><ProjectArt type={art} mode={version==='before'?'early':'refined'}/><span className="sample-caption">Illustrative layout · project screens coming soon</span></>}
    </div>
    <div className="decision-reason"><div><span>WHY IT CHANGED</span><p>{selected.why || 'This space connects feedback to a specific design change.'}</p></div><div><span>THE TRADE-OFF</span><p>{selected.tradeoff || 'The reasoning will include what the chosen direction gained, and what it gave up.'}</p></div></div>
  </div>;
}

function CaseStudy({ project, onClose, onNext }) {
  const dialog = useRef(null), scroller = useRef(null), imageDialog = useRef(null);
  const [chapter, setChapter] = useState('overview'), [progress, setProgress] = useState(0), [stage, setStage] = useState(0), [expanded, setExpanded] = useState(null);
  useEffect(()=>{
    const node=dialog.current, previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';node.showModal();
    return()=>{node.close();document.body.style.overflow=previousOverflow;};
  },[]);
  useEffect(()=>{
    setStage(0);setChapter('overview');setProgress(0);scroller.current?.scrollTo({top:0,behavior:'instant'});
    dialog.current?.querySelector('.case-back')?.focus({preventScroll:true});
  },[project.id]);
  useEffect(()=>{
    if(expanded)imageDialog.current.showModal();
    else if(imageDialog.current?.open)imageDialog.current.close();
  },[expanded]);
  const navigate = id => {
    const target=scroller.current.querySelector(`#case-${id}`);
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(target)scroller.current.scrollTo({top:target.offsetTop-32,behavior:reduced?'instant':'smooth'});
    setChapter(id);
  };
  const onScroll = () => {
    const el=scroller.current, range=el.scrollHeight-el.clientHeight;
    setProgress(range>0?el.scrollTop/range:0);
    const ids=['overview',...CHAPTERS.map(c=>c.id)];
    const current=ids.filter(id=>(el.querySelector(`#case-${id}`)?.offsetTop||0)<=el.scrollTop+180).pop();
    if(current)setChapter(current);
  };
  const hasContent=Boolean(project.challenge || Object.values(project.chapters).some(c=>c?.lead || c?.paragraphs?.length));
  return <>
    <dialog className={`case-reader tone-${project.accent}`} ref={dialog} aria-labelledby="case-title" onCancel={e=>{e.preventDefault();onClose();}}>
      <header className="case-top"><button type="button" className="case-back" onClick={onClose}><Arrow back/> All projects</button><span>SELECTED WORK / {project.number}</span><button type="button" className="case-close" onClick={onClose} aria-label="Close case study">✕</button><div className="case-reading-progress" style={{transform:`scaleX(${progress})`}}/></header>
      <div className="case-layout">
        <aside className="case-outline"><span className="work-micro">THE STORY</span><nav aria-label="Case study chapters">{[{id:'overview',label:'At a glance'},...CHAPTERS].map((c,i)=><button type="button" key={c.id} className={chapter===c.id?'current':''} aria-current={chapter===c.id?'location':undefined} onClick={()=>navigate(c.id)}><span>{String(i).padStart(2,'0')}</span>{c.label}<i/></button>)}</nav><p>A little context.<br/>A lot of considered choices.</p></aside>
        <div className="case-scroll" ref={scroller} onScroll={onScroll} tabIndex="0" aria-label="Case study content">
          <section className="case-overview" id="case-overview"><div className="case-eyebrow"><span>{project.number} / {project.name || project.shortTitle}</span></div><h2 id="case-title">{project.title}</h2><p className="case-intro">{project.description}</p>
            <div className="case-hero-art">{project.cover?<img src={project.cover.src} alt={project.cover.alt} style={{width:"100%",height:"100%",objectFit:"contain"}}/>:<><ProjectArt type={project.art}/><span className="sample-caption">Illustrative cover</span></>}</div>
            <dl className="case-facts">{[['My role',project.role],['The team',project.team],['Timeline',project.timeline],['Status',project.status]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value || 'Details coming soon'}</dd></div>)}</dl>
            {!hasContent&&<p className="case-preview-note"><span>✳</span> The full story is on its way. Explore the chapters below for a preview of how the case study will unfold.</p>}
            <div className="case-summary">{[['The challenge',project.challenge,'The problem worth solving.'],['My contribution',project.contribution,'The part I owned and the people I worked with.'],['The outcome',project.outcome,'What changed, supported by evidence.']].map(([label,value,fallback])=><div key={label}><span>{label}</span><p>{value || fallback}</p>{!value&&<small>To be shared in the full story</small>}</div>)}</div>
          </section>
          {CHAPTERS.map((c,i)=>{
            const content=project.chapters[c.id]||{};
            return <section className="case-chapter" id={`case-${c.id}`} key={c.id}><div className="chapter-heading"><span>{String(i+1).padStart(2,'0')} / {c.label}</span><h3>{content.title || c.title}</h3></div>
              <p className="chapter-question">{c.question}</p>
              {content.lead&&<p className="chapter-lead">{content.lead}</p>}
              {content.paragraphs?.map((p,n)=><p className="chapter-body" key={n}>{p}</p>)}
              {!content.lead&&!content.paragraphs?.length&&<div className="chapter-placeholder"><span>THE FULL STORY WILL EXPLORE</span><p>{c.placeholder}</p></div>}
              <CaseImage image={content.image} onExpand={setExpanded}/>
              {c.id==='context'&&<div className="journey-explorer"><div className="journey-tabs" role="tablist" aria-label="Design journey">{STAGES.map(([name],n)=><button type="button" role="tab" key={name} id={`stage-tab-${n}`} aria-selected={stage===n} aria-controls="stage-panel" tabIndex={stage===n?0:-1} onClick={()=>setStage(n)} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?3:(stage+(e.key==='ArrowRight'?1:3))%4;setStage(next);e.currentTarget.parentElement.children[next].focus();}}}><span>{n+1}</span>{name}</button>)}</div><div className="journey-panel" role="tabpanel" id="stage-panel" aria-labelledby={`stage-tab-${stage}`}><span className="journey-flower" aria-hidden="true">✳</span><h4>{STAGES[stage][1]}</h4><p>{STAGES[stage][2]}</p><small>Story structure · project-specific process to come</small></div></div>}
              {c.id==='research'&&<div className="evidence-stack">{(project.evidence.length?project.evidence:[{title:'What people were trying to do',finding:'The tasks, workarounds and needs uncovered through research.',implication:'How those observations informed the design direction.'},{title:'Where the friction lived',finding:'The moments that made a task confusing, slow or uncertain.',implication:'The opportunity behind the observed behaviour.'},{title:'What challenged the assumptions',finding:'The evidence that changed an initial interpretation.',implication:'What was reprioritised as a result.'}]).map((e,n)=><details key={`${project.id}-${n}`}><summary><span>{String(n+1).padStart(2,'0')}</span>{e.title}<i aria-hidden="true">+</i></summary><div><span>{project.evidence.length?'THE EVIDENCE':'EVIDENCE TO COME'}</span><p>{e.finding}</p><span>WHY IT MATTERED</span><p>{e.implication}</p>{e.source&&<small>{e.source}</small>}</div></details>)}</div>}
              {c.id==='iteration'&&(!content.lead || project.decisions.length>0)&&<DecisionExplorer key={project.id} decisions={project.decisions} art={project.art} onExpand={setExpanded}/>}
              {c.id==='outcome'&&project.images.length>0&&<div className="case-image-grid">{project.images.map((image,n)=><CaseImage key={n} image={image} onExpand={setExpanded}/>)}</div>}
            </section>;
          })}
          <footer className="case-footer"><p>Another problem.<br/><em>Another perspective.</em></p><button type="button" onClick={onNext}>Next project <Arrow/></button><button type="button" className="case-footer-back" onClick={onClose}>Back to selected work</button></footer>
        </div>
      </div>
    </dialog>
    <dialog className="case-lightbox" ref={imageDialog} aria-label="Enlarged project image" onCancel={e=>{e.preventDefault();setExpanded(null);}}><button type="button" onClick={()=>setExpanded(null)} aria-label="Close image">✕</button>{expanded&&<figure><img src={expanded.src} alt={expanded.alt||''}/>{expanded.caption&&<figcaption>{expanded.caption}</figcaption>}</figure>}</dialog>
  </>;
}

export default function WorkShowcase() {
  const [selected,setSelected]=useState(null);
  const returnFocus=useRef(null);
  useEffect(()=>{
    const sync=()=>{const match=window.location.hash.match(/^#case\/([a-z0-9-]+)$/);setSelected(match?portfolioProjects.find(p=>p.id===match[1])||null:null);};
    sync();window.addEventListener('popstate',sync);window.addEventListener('hashchange',sync);
    return()=>{window.removeEventListener('popstate',sync);window.removeEventListener('hashchange',sync);};
  },[]);
  const open=(project,event)=>{
    if(event)returnFocus.current=event.currentTarget;
    if(window.location.hash!==`#case/${project.id}`){
      if(selected)window.history.replaceState({portfolioCase:Boolean(window.history.state?.portfolioCase)},'',`#case/${project.id}`);
      else window.history.pushState({portfolioCase:true},'',`#case/${project.id}`);
    }
    setSelected(project);
  };
  const close=()=>{
    setSelected(null);
    if(window.history.state?.portfolioCase)window.history.back();
    else window.history.replaceState(null,'',window.location.pathname+window.location.search+'#work');
    requestAnimationFrame(()=>returnFocus.current?.focus({preventScroll:true}));
  };
  const visible=portfolioProjects;
  return <section className="selected-work section-pad" id="work">

    <div className="work-heading"><div><h2>Behind every screen,<br/><em>a reason.</em><span className="work-heading-star" aria-hidden="true">✳</span></h2></div><p>The questions, the decisions,<br/>and the details that made<br/>a difference.</p></div>

    <div className="work-gallery">{visible.map(p=><article className={`work-item tone-${p.accent}`} key={p.id}><button className="work-project-open" type="button" onClick={e=>open(p,e)} aria-label={`Open case study: ${p.title}`}>
      <div className="work-cover"><div className="work-cover-top"><span>{p.number} / {(p.name || p.shortTitle).toUpperCase()}</span><span className="work-open-disc" aria-hidden="true"><Arrow/></span></div>{p.cover?<img src={p.cover.src} alt={p.cover.alt} loading="lazy" style={{width:"100%",height:"100%",objectFit:"contain"}}/>:<ProjectArt type={p.art}/>}<span className="work-cover-open">Explore the story <Arrow/></span></div>
      <div className="work-card-caption"><div><h3>{p.title}</h3></div><span className="work-caption-arrow" aria-hidden="true"><Arrow/></span></div><p className="work-card-description">{p.description}</p>
    </button></article>)}</div>
    <div className="work-endnote"><span aria-hidden="true">✳</span><p>A glimpse of the work. A window into the thinking.<br/><small>Full case studies and approved project visuals will be added here.</small></p><span>MORE SOON ↗</span></div>
    {selected&&<CaseStudy project={selected} onClose={close} onNext={()=>open(portfolioProjects[(portfolioProjects.findIndex(p=>p.id===selected.id)+1)%portfolioProjects.length])}/>}
  </section>;
}

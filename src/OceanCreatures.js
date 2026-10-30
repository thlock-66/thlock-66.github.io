import React,{useId} from 'react';
const INK='#5d6965';
function Face({x=210,y=175,eyeRef,type}){
 const clip=useId(),side=type==='thresher'||type==='blacktip',wink=['turtle','clownfish'].includes(type),sleepy=type==='manta'||type==='stingray',happy=type==='octopus',surprised=type==='mola'||type==='seahorse';
 const dark='#393b39';
 return <g transform={`translate(${x+6} ${y+3})`} stroke="none">
 {side?<><defs><clipPath id={clip}><ellipse cx="0" cy="0" rx="12" ry="9"/><ellipse cx="50" cy="0" rx="12" ry="9"/></clipPath></defs><ellipse cx="0" cy="0" rx="12" ry="9" fill="#faf8eb"/><ellipse cx="50" cy="0" rx="12" ry="9" fill="#faf8eb"/><g clipPath={`url(#${clip})`}><g ref={eyeRef} className="thresher-pupil"><circle cx="5" cy="2" r="4.8" fill={dark}/><circle cx="55" cy="2" r="4.8" fill={dark}/></g></g><path d="m-10-5 21-3m29 0 21 3" fill="none" stroke={dark} strokeWidth="2.5" strokeLinecap="round"/></>:<g ref={eyeRef} className="thresher-pupil">{sleepy?<path d="M-7-1q7 8 14 0m36 0q7 8 14 0" fill="none" stroke={dark} strokeWidth="3.5" strokeLinecap="round"/>:wink?<><circle r="5.3" fill={dark}/><path d="m43 0q7-8 14 0" fill="none" stroke={dark} strokeWidth="3.5" strokeLinecap="round"/></>:<><circle r={happy?'6.5':'5.5'} fill={dark}/><circle cx="50" r={happy?'6.5':'5.5'} fill={dark}/>{happy&&<><circle cx="-2" cy="-2" r="1.8" fill="#fffdf3"/><circle cx="48" cy="-2" r="1.8" fill="#fffdf3"/></>}</>}</g>}
 {side?<><ellipse cx="25" cy="22" rx="6" ry="8" fill={dark}/><ellipse cx="25" cy="22" rx="3" ry="4.5" fill="#f8eddb"/></>:happy?<><path d="M12 16q13 5 26 0 0 24-13 24T12 16Z" fill={dark}/><path d="M17 32q8-8 16 0-8 10-16 0Z" fill="#e8b3b3"/></>:surprised?<ellipse cx="25" cy="21" rx="5" ry="6.5" fill={dark}/>:type==='triggerfish'?<path d="M23 15q13 0 5 6 9 5-4 7" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round"/>:sleepy?<path d="M18 20q7 6 14 0" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round"/>:type==='whaleshark'||type==='greatwhite'?<path d="M12 17q13 15 26 0" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round"/>:<><ellipse cx="25" cy="10" rx="6" ry="3.5" fill={dark}/><path d="M25 13v6m0 0q-9 9-16 0m16 0q9 9 16 0" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round"/></>}
 <ellipse cx="-12" cy="22" rx="11" ry="6" fill="#eabcb7" opacity=".65"/><ellipse cx="62" cy="22" rx="11" ry="6" fill="#eabcb7" opacity=".65"/>
 </g>;
}
export function Thresher({eyeRef}){return <AnimalArt type="thresher" eyeRef={eyeRef}/>;}
export function AnimalArt({type,eyeRef}){
 let face=[210,175],art;
 if(['thresher','whaleshark','greatwhite','blacktip'].includes(type)){
 const whale=type==='whaleshark',thresher=type==='thresher',base=whale?'#a7c8cc':type==='greatwhite'?'#c4d0d6':'#b4d0ce';face=[170,181];art=<>
 <path className="thresher-tail" d={thresher?'M416 195q56-24 83-86 23-56 98-70-42 30-44 73-8 61-119 98l41 65q-43-17-64-43Z':'m409 190 112-65q-29 53-19 72-1 25 20 61l-112-43Z'} fill={base}/>
 <path d="m284 149 27-67q8-17 18 0l29 80m-66 72 43 59q12 12 15-5l-9-65" fill={base}/>
 <path d="M107 198q-4-87 119-85 132-1 214 83-80 96-216 86-118-3-117-84Z" fill={base}/>
 <path d="M110 222q126 69 312-16-80 80-200 76-93-3-112-60Z" fill="#f4ebd4" stroke="none"/>
 {whale&&<g fill="#fff9e2" stroke="none">{Array.from({length:19},(_,i)=><circle key={i} cx={282+(i%5)*24} cy={161+Math.floor(i/5)*22} r="4.5"/>)}</g>}
 {type==='blacktip'&&<path d="m304 99 7-17q8-17 18 0l9 24Z" fill={INK} stroke="none"/>}
 <path d="m292 194-4 18m16-17-4 18" fill="none" stroke="#79938e" strokeWidth="3"/>
 </>;
 }else if(type==='turtle'){face=[132,181];art=<><path d="M289 149q-104-97-125-47-7 22 85 83m55 45q-93 107-124 64-9-24 79-87m153-52q78-88 111-47 12 25-76 75m-11 44q92 77 67 98-23 30-86-57" fill="#9fc5a4"/><ellipse cx="340" cy="194" rx="118" ry="86" fill="#bdcf9c"/><path d="m311 139 64 1 38 53-35 57-65 1-39-57Z" fill="#9dbd8e" stroke="#e6e4bc" strokeWidth="4"/><path d="m311 139-24-25m88 26 26-21m12 74 42-1m-77 58 22 17m-87-16-24 24m-15-81-46 2" fill="none" stroke="#e6e4bc" strokeWidth="4"/><path d="M243 166q-33-29-76-21-66 9-65 57 10 47 85 36l55-16" fill="#a8ceaf"/></>;
 }else if(type==='mola'){face=[235,177];art=<><path d="M318 149q25-96 72-112-24 72-10 123m-51 78q36 92 69 106-28-64-18-114" fill="#aab7d4"/><path d="M197 185q13-82 117-72 51 0 107 41l-14 43 15 44q-58 49-117 43-99 4-108-67Z" fill="#c2cce0"/><path d="m397 151-9 90" fill="none" stroke="#99aac4" strokeWidth="9"/><path d="m336 169-9 25m21-21-8 23" fill="none" stroke="#79938e" strokeWidth="3"/></>;
 }else if(['manta','stingray'].includes(type)){face=[285,181];art=<><path d="M306 242q19 47 18 102" fill="none" strokeWidth="9"/><path d="M284 159Q172 107 96 84q-28-7-19 24 26 112 185 140 58 35 122-2Q520 221 568 103q11-29-15-22-112 27-198 79l-12-36-19 10-19-11Z" fill={type==='manta'?'#b8b0d1':'#bdc6c5'}/><path d="M242 219q83 60 162-1-27 43-81 39-46 1-81-38Z" fill="#eee5ed" stroke="none"/><path d="M293 153q-12-23-29-9m86 10q15-23 31-8" fill="none" stroke="#8f93a7" strokeWidth="4"/></>;
 }else if(type==='octopus'){face=[285,174];art=<><g fill="none" stroke="#c394b2" strokeWidth="30" strokeLinecap="round"><path d="M254 219q-70 105-112 48-24-32 0-45m140 4q-26 117-69 84-16-13-7-29m105-50q2 112 36 92 20-12 6-30m-13-67q70 105 106 55 16-22-1-35m-68-30q106 40 129-8 7-17-11-27"/></g><ellipse cx="320" cy="166" rx="94" ry="88" fill="#ddb6ce"/><path d="M260 119q24-30 57-25" fill="none" stroke="#f2d7e5" strokeWidth="12" strokeLinecap="round"/></>;
 }else if(type==='seahorse'){face=[263,122];art=<><path d="M301 67q-71 2-67 66l-64 23q-16 21 7 28l76 1q11 39 46 52l-14 44q-13 43 25 47 34 1 24-27" fill="#e9c18f"/><path d="m321 198 54 22-44 38m-71-174 7-35 35 20" fill="#dba779"/><path d="m301 237 18 9m-21 14 15 9" stroke="#c79973" strokeWidth="4"/></>;
 }else if(type==='nudibranch'){face=[184,210];art=<><path d="M135 241q45-74 171-65 126 2 200 70-103 26-371-5Z" fill="#d7b8dc"/><path d="m228 193-5-54 19 15 9 37m39-11 9-57 20 15-4 47m36 5 17-51 20 22-11 39m33 8 28-42 13 22-13 31" fill="#b89bc9"/><path d="m165 218-9-53m27 44 12-52" fill="none" strokeWidth="11" strokeLinecap="round" stroke="#c7a7d5"/></>;
 }else if(type==='hammerhead'){face=[156,172];art=<><path d="m382 187 122-66-21 73 28 55-123-31" fill="#b5c7cb"/><path d="m287 147 43-67 19 73m-32 82 47 52-15-65" fill="#a5bcc3"/><path d="M167 169q107-55 238 28-103 69-231 30Z" fill="#b5c7cb"/><path d="M148 123q21-12 48 3l-1 123q-23 14-47 0Z" fill="#b5c7cb"/></>;
 }else{const clown=type==='clownfish',lion=type==='lionfish';face=[200,177];art=<>
 {lion&&<path d="m241 151-12-64 39 49 4-73 30 63 22-66 11 76 43-47-11 69 69-22-42 54 48 47-72-9 18 65-59-43-18 63-23-72-43 56 9-74-61 26 27-54" fill="#e5b3ac"/>}
 <path d="m408 190 105-65q-29 62-8 76-23 22 8 62l-104-49" fill={clown?'#f0afa5':lion?'#d5a3a4':'#a5b8ba'}/><path d="M266 144q28-63 73-17l34 26m-99 90q25 54 67 14" fill={clown?'#f0afa5':'#e5c489'}/>
 <path d="M147 198q37-86 147-73 80 1 135 72-69 84-164 74-96-6-118-73Z" fill={clown?'#f5b99b':type==='tuna'?'#b5cbd0':'#e9d28f'}/>
 {clown?<path d="M255 130q-18 66 0 132m68-128q-12 60 4 124M383 159q-5 33 3 67" fill="none" stroke="#fff6df" strokeWidth="23"/>:lion?<path d="m269 128-7 136m40-133 5 130m34-115 10 98" stroke="#f9e5c8" strokeWidth="14" fill="none"/>:<path d="m292 134-17 34 26 26-11 33 28 31m32-105-18 30 30 23-10 29" stroke="#a6b6a0" strokeWidth="12" fill="none"/>}
 </>}
 return <svg viewBox="0 0 650 380" className="ocean-animal-art" aria-hidden="true"><g className="animal-body" stroke="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{art}<Face x={face[0]} y={face[1]} eyeRef={eyeRef} type={type}/></g></svg>;
}

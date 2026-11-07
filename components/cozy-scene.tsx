import type { ReactNode } from 'react';
import type { Worker } from '../lib/game';

const ink = '#624b43';

function Hotspot({label,onClick,children}:{label:string;onClick:()=>void;children:ReactNode}) {
  return <g role="button" tabIndex={0} aria-label={label} className="scene-hotspot" onClick={onClick} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onClick()}}}><title>{label}</title>{children}</g>;
}

export function LittlePerson({variant=0,apron=true}:{variant?:number;apron?:boolean}) {
  const shirt=['#a9c4ac','#d99d9e','#e9bd72','#9db5cb'][variant%4];
  return <g stroke={ink} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cy="35" rx="20" ry="8" fill="#806758" opacity=".13" stroke="none"/>
    <path d="M-10 17l-1 15m20-15 1 15" fill="none" strokeWidth="8" stroke="#6d6660"/>
    <path d="M-12 34h-7m30 0h7" strokeWidth="7"/>
    <path d="M-14-9Q-26 2-22 14m36-23q12 11 8 23" fill="none" stroke="#f0ccac" strokeWidth="9"/>
    <path d="M-15-11Q0-19 15-11l1 30q-16 10-32 0Z" fill={shirt}/>
    {apron&&<><path d="M-9-12v9H9v-9M-10-3h20l4 23q-14 6-28 0Z" fill="#f9e6c5"/><path d="M-5 8H5v7H-5Z" fill="#db9e8f" strokeWidth="1.4"/></>}
    <path d="M-6-16v6q6 5 12 0v-6" fill="#f0ccac"/>
    <ellipse cy="-31" rx="20" ry="22" fill="#f6d5b6"/>
    <path d={variant%2?'M-20-29q-8-27 15-28q30-1 25 29l-7-9q-18 6-25-4Z':'M-20-28q-7-27 16-29q25-4 26 26l-12-8q-11 8-22-1Z'} fill={variant%3===2?'#aa7962':'#665047'}/>
    {variant%2===1&&<circle cx="18" cy="-51" r="9" fill="#665047"/>}
    <path d="M-8-29v2m16-2v2" strokeWidth="2.8"/>
    <path d="M-3-20q3 3 6 0" fill="none" strokeWidth="1.6"/>
    <ellipse cx="-12" cy="-22" rx="4" ry="2.5" fill="#eaa299" stroke="none"/><ellipse cx="12" cy="-22" rx="4" ry="2.5" fill="#eaa299" stroke="none"/>
  </g>;
}

export function CharacterAvatar({variant=0}:{variant?:number}){return <svg viewBox="-28 -63 56 94" aria-hidden="true"><LittlePerson variant={variant}/></svg>}

function Plant({x,y,scale=1}:{x:number;y:number;scale?:number}){return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={ink} strokeWidth="2.2" strokeLinejoin="round"><ellipse cy="18" rx="29" ry="10" fill="#8f7461" opacity=".1" stroke="none"/><path d="M-19-5h38l-5 27q-14 9-28 0Z" fill="#d9977e"/><ellipse cy="-5" rx="19" ry="7" fill="#e7b59a"/><path d="M0-6v-57M-2-21q-26 1-28-22Q-8-46-2-21ZM2-38Q-4-65 18-74q12 26-16 36ZM1-12q0-28 29-29Q34-14 1-12ZM-1-44q-26-1-22-27Q0-66-1-44Z" fill="#94b18e"/><path d="M0-6v-50" stroke="#6f8b6b"/></g>}

function Cup({x,y,s=1}:{x:number;y:number;s?:number}){return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={ink} strokeWidth="2"><ellipse cy="13" rx="18" ry="6" fill="#fff2d9"/><path d="M10-7q15-1 10 11q-3 5-10 1" fill="#fff8e7"/><path d="M-12-9h24v15q-12 12-24 0Z" fill="#fff8e7"/><ellipse cy="-9" rx="12" ry="5" fill="#a77658"/><path d="M-4-10q-4-4-5 0q1 4 9 5q9-8 5-9q-4-1-5 4" stroke="#efcfaa" fill="#efcfaa" strokeWidth="1"/></g>}

function Table({x,y}:{x:number;y:number}){return <g transform={`translate(${x} ${y})`} stroke={ink} strokeWidth="2.5" strokeLinejoin="round"><path d="M0-8v54M-29 29-39 10m65 8 9-22" fill="none" strokeWidth="5"/><path d="M-16 51 0 44l17 8" fill="none" strokeWidth="5"/><ellipse cy="-14" rx="46" ry="24" fill="#c58d6b"/><ellipse cy="-21" rx="46" ry="24" fill="#f0c697"/><Cup x={8} y={-27} s={.7}/><path d="M-25-12h13" stroke="#dfaf80"/></g>}

export function ShopSticker({business=0}:{business?:number}){return <svg viewBox="0 0 190 115" aria-hidden="true"><g stroke={ink} strokeWidth="2.5" strokeLinejoin="round"><path d="M37 92V37h116v55Z" fill="#f9dfbc"/><path d="M30 37 45 16h102l15 21Z" fill={business===0?'#cf7b80':business===1?'#96b39a':'#b6a2c4'}/><path d="M30 37v10q11 10 22 0q10 10 21 0q11 10 22 0q11 10 22 0q10 10 21 0q12 10 24 0V37Z" fill="#f8e4bf"/>{[0,1,2].map(i=><path key={i} d={`M${51+i*43} 37v10q11 10 22 0V37Z`} fill={business===0?'#cf7b80':business===1?'#96b39a':'#b6a2c4'}/>)}<path d="M79 91V57h30v34" fill="#9fc3b0"/><path d="M48 60h23v20H48Zm69 0h23v20h-23Z" fill="#d6e5da"/><path d="M59 60v20m69-20v20"/><circle cx="102" cy="76" r="1.8" fill={ink}/><path d="M28 95h135" strokeWidth="5"/><path d="M20 93V81h14v12m125 0V81h14v12" fill="#cb9c7c"/><path d="M26 80q-18-8-6-17q13-2 9 17m138 0q-5-23 8-21q13 11-8 21" fill="#97b38b"/></g></svg>}

export default function CozyScene({business,workers,level,night,onPeople,onFinance,onUpgrade,onCat}:{business:number;workers:Worker[];level:number;night:boolean;onPeople:()=>void;onFinance:()=>void;onUpgrade:()=>void;onCat:()=>void}){
 const title=business===0?'TIỆM CÀ PHÊ':business===1?'TIỆM TẠP HÓA':'XƯỞNG THỜI TRANG';
 return <svg className={`cozy-scene ${night?'is-night':''}`} viewBox="0 0 960 700" role="group" aria-label={`Bên trong ${title.toLowerCase()}, cảnh cửa hàng tương tác`}>
  <defs><clipPath id="floor-clip"><path d="M130 450 480 250 830 450 480 650Z"/></clipPath><radialGradient id="lamp-light"><stop stopColor="#ffe7a2" stopOpacity=".8"/><stop offset="1" stopColor="#ffe7a2" stopOpacity="0"/></radialGradient><pattern id="cafe-specks" width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#698b7a" opacity=".17"/></pattern></defs>
  <rect width="960" height="700" fill="url(#cafe-specks)"/>
  <g className="scene-clouds" fill="#f6f5e6" opacity=".7"><path d="M62 175q-5-17 12-19q5-22 23-13q18-9 23 12q20 0 17 20Z"/><path d="M812 110q-5-17 12-19q5-22 23-13q18-9 23 12q20 0 17 20Z"/></g>
  <ellipse cx="480" cy="605" rx="330" ry="48" fill="#6f8b73" opacity=".14"/>
  <g className="room" stroke={ink} strokeWidth="2.7" strokeLinejoin="round" strokeLinecap="round">
   <path d="M130 450 480 250 830 450 480 650Z" fill="#e9c297"/><g clipPath="url(#floor-clip)" stroke="#d4a77e" strokeWidth="1.8">{Array.from({length:13},(_,i)=><path key={i} d={`M${10+i*68} 210l500 287M${-140+i*68} 400l500 287`}/>)}</g><path d="M130 450v15l350 201v-16m0 16 350-201v-15" fill="#c3916d"/>
   <path d="M130 450V270L480 70v180Z" fill="#f8e4c9"/><path d="M480 70 830 270v180L480 250Z" fill="#efd0a8"/><path d="M130 270v-9L480 61 830 261v9L480 70Z" fill="#fff1db"/><path d="M130 435 480 235 830 435v15L480 250 130 450Z" fill="#c89572"/>
   <g transform="translate(172 288) skewY(-30)"><rect width="138" height="116" rx="4" fill="#a8cad0"/><path d="M5 96q35-44 71-18q26-28 57-1v33H5Z" fill="#a2bca1" stroke="none"/><circle cx="99" cy="29" r="15" fill="#f4d48e" stroke="none"/><path d="M12 22h33m-24 8h33" stroke="#f4f2de" strokeWidth="5"/><path d="M68 0v116M0 58h138" stroke="#a77d60" strokeWidth="7"/><rect width="138" height="116" rx="4" fill="none" strokeWidth="7" stroke="#aa8164"/><path d="M-7-4h153v12H-7Z" fill="#8fab94"/><path d="M-2 8v100q18-32 20-100m122 0v100q-17-32-20-100" fill="#bdd1b7" stroke="#86a78c"/></g>
   <g transform="translate(346 239) skewY(-30)"><path d="M-4 0h112v-80H-4Z" fill="#d7af89"/><path d="M0-41h104M0 0h104" strokeWidth="8" stroke="#b68565"/>{[0,1,2,3].map(i=><g key={i}><path d={`M${8+i*24} -71h14v20q-7 7-14 0Z`} fill={['#c98786','#9eb69b','#f0ce8e','#a6bdc7'][i]}/><path d={`M${8+i*24} -29h14v19H${8+i*24}Z`} fill={['#f4dfae','#d2b6cc','#a4c4b0','#f5e6cb'][i]}/><path d={`M${9+i*24} -31h12`} strokeWidth="4"/></g>)}</g>
   <g transform="translate(561 176) skewY(30)"><rect width="142" height="64" rx="6" fill="#fff0d8" strokeWidth="4"/><text x="71" y="28" textAnchor="middle" fill={ink} stroke="none" fontSize="15" fontWeight="800" fontFamily="'Baloo 2',sans-serif">{title}</text><text x="71" y="48" textAnchor="middle" fill="#ae7270" stroke="none" fontSize="10" fontWeight="600">BÌNH MINH · từ những điều nhỏ</text></g>
   <g transform="translate(737 294) skewY(30)"><rect x="-4" y="-4" width="65" height="96" rx="3" fill="#bf9571"/><rect width="57" height="88" rx="2" fill="#62776a"/><text x="29" y="20" textAnchor="middle" fill="#ffedce" stroke="none" fontSize="12" fontWeight="800">{business===0?'MENU':business===1?'HÔM NAY':'LOOKBOOK'}</text><path d="M10 34h36M10 48h25M10 61h32M10 74h20" stroke="#e8dfc6" strokeWidth="2"/></g>
   <path d="M150 263Q320 228 480 103Q640 225 806 266" fill="none" stroke="#765b4b" strokeWidth="2"/>
   {[[198,256],[330,198],[480,111],[625,205],[766,264]].map(([x,y],i)=><g key={i}><path d={`M${x} ${y}v12`} strokeWidth="2"/><circle className="string-bulb" cx={x} cy={y+17} r="7" fill="#ffe5a0"/>{night&&<circle cx={x} cy={y+17} r="47" fill="url(#lamp-light)" stroke="none"/>}</g>)}
   <path d="M480 75v92"/><path d="M452 190q4-30 28-30q24 0 28 30Z" fill="#d99a6c"/><ellipse cx="480" cy="190" rx="28" ry="8" fill="#ffdf94"/>
   {night&&<ellipse cx="480" cy="280" rx="105" ry="130" fill="url(#lamp-light)" stroke="none"/>}
   <path d="M242 452 410 357 654 496 485 593Z" fill="#b88f85" stroke="none" opacity=".25"/><path d="M255 452 410 365 640 496 485 584Z" fill="#f3d7bf" stroke="#c79983" strokeDasharray="5 6"/>
   <Plant x={166} y={449} scale={.85}/>
   <g transform="translate(272 439)"><path d="M-24 25v31m40-43v31m-40-66v44q20 13 40-1v-44Z" fill="#bba7a5"/><path d="M-24-22q19-16 40-1v26q-20 12-40 0Z" fill="#dba4a1"/><ellipse cy="22" cx="-3" rx="24" ry="12" fill="#e6bab1"/></g>
   <Table x={320} y={462}/>
   {workers.length>0&&<Hotspot label={`Quản lý nhân sự · ${workers[0].name}`} onClick={onPeople}><g transform="translate(635 339)"><LittlePerson variant={workers[0].id-1}/></g><g className="scene-label" transform="translate(598 247)"><rect width="80" height="27" rx="13" fill="#fff4dc" strokeWidth="2"/><text x="40" y="18" textAnchor="middle" fill={ink} stroke="none" fontSize="11" fontWeight="700">{workers[0].name}</text><path d="M35 27l5 6 5-6" fill="#fff4dc" strokeWidth="1.5"/></g></Hotspot>}
   <Hotspot label="Quầy thu ngân · Xem tài chính" onClick={onFinance}>
    <path d="M440 351 668 481v63L440 414Z" fill="#c6936f"/><path d="M668 481 738 441v63l-70 40Z" fill="#ad7b5f"/><path d="M432 343 506 301 746 439 672 481Z" fill="#f5dab2"/><path d="M432 343v9l240 139v-10m0 10 74-42v-10" fill="#d6a17b"/>
    <path d="M451 377 652 492m-134-76v35m70 6v34" fill="none" stroke="#ae7c5d"/><path d="m551 427 24 13m-88-50 23 13" strokeWidth="4"/>
    <g transform="translate(695 418)"><path d="M-17-4 0-14 26 1 9 11Z" fill="#b3c4ab"/><path d="M-17-4v10L9 21V11Z" fill="#8da28a"/><path d="M9 11 26 1v10L9 21Z" fill="#7d9580"/><path d="M-5-13V-38L20-24V1Z" fill="#6f776b"/><path d="M-1-32v14l16 9v-14Z" fill="#cce0bd"/><path d="M2-25 11-20" stroke="#829775" strokeWidth="1.5"/></g>
   </Hotspot>
   {business===0?<>
    <g transform="translate(563 373)"><path d="M-42-20 2-45 48-18 4 7Z" fill="#a9bbb0"/><path d="M-42-20v-46L2-91 48-64v46L4 7Z" fill="#89a99b"/><path d="M-42-66 4-39 48-64M4-39V7" fill="none"/><path d="M-33-48-4-31v17l-29-17Z" fill="#5f7367"/><path d="M-28-45v9m12-2v9" stroke="#e3d9b8" strokeWidth="3"/><path d="M13-37 36-50v14L13-23Z" fill="#e4e5cb"/><circle cx="23" cy="-13" r="3" fill="#e6bf83"/><path d="M-32-15-2 2" stroke="#6a8071" strokeWidth="3"/><path d="M-29-25v10m15-2v10" strokeWidth="4" stroke="#e4e2ca"/></g>
    <Cup x={623} y={416} s={.65}/><g className="coffee-steam" fill="none" stroke="#fff8e7" strokeWidth="3" opacity=".9"><path d="M620 386q-6-8 0-16t0-15M629 389q6-8 0-16"/></g>
    <g transform="translate(475 368)"><path d="M-7 3 28 23 70-1 35-21Z" fill="#b88b72"/><path d="M-7 3v-43L35-64 70-44v43L28 23V-20Z" fill="#d8e4dc" fillOpacity=".8"/><path d="M-7-40 28-20 70-44M28-20V23" fill="none"/><path d="M6-7q1-15 12-9l6 12q-7 7-18-3m24 9q0-17 12-13l7 12q-9 7-19 1m12-22q0-14 10-10l8 10q-7 6-18 0" fill="#e6b77d"/></g>
   </>:business===1?<g transform="translate(550 362)">{[0,1,2].map(i=><g key={i} transform={`translate(${i*43} ${i*25})`}><path d="M-19-8 0-20 23-7 4 6Z" fill="#d4ad77"/><path d="M-19-8v20L4 26 23 14V-7L4 6v20" fill="#d8b789"/>{[0,1,2].map(j=><circle key={j} cx={-7+j*9} cy={-11+(j%2)*5} r="8" fill={i===0?'#d78e7f':i===1?'#b0bd79':'#e7bd71'}/>)}</g>)}</g>:<g transform="translate(540 338)"><path d="M-16 29v-78l107 62v78M-16-49l107 62" fill="none" strokeWidth="4"/>{[0,1,2].map(i=><g key={i} transform={`translate(${i*34} ${i*20})`}><path d="M-7-19q-1-10 6-10q8 0 4 7m-4 2-15 7 30 17-15-24" fill="none" strokeWidth="1.8"/><path d="M-17-15-3-9q2 7 9 5l13 10-5 11-7-4v24l-24-14V0l-7-3Z" fill={['#c98e98','#9ebcaa','#e3bd83'][i]}/></g>)}</g>}
   {workers.length>1&&<Hotspot label={`Quản lý nhân sự · ${workers[1].name}`} onClick={onPeople}><g className="little-worker" transform="translate(408 460)"><LittlePerson variant={workers[1].id-1}/></g></Hotspot>}
   {workers.length>2&&<Hotspot label="Xem đội ngũ nhân viên" onClick={onPeople}><g transform="translate(589 525)"><LittlePerson variant={workers[2].id-1}/></g></Hotspot>}
   <g transform="translate(435 556)"><path d="M-24 25v30m40-43v31m-40-63v44q20 13 40-1v-44Z" fill="#9ab19c"/><path d="M-24-20q19-16 40-1V4q-20 13-40 0Z" fill="#b8cbb1"/><ellipse cy="24" cx="-3" rx="24" ry="12" fill="#c4d4b6"/></g><Table x={491} y={550}/>
   <Hotspot label="Nâng cấp cửa hàng" onClick={onUpgrade}><g transform="translate(758 504)"><path d="M-27 42-20-45 23-20 31 70M23-20l-9 77" fill="none" strokeWidth="4"/><path d="M-23-43 22-17l-5 67-45-26Z" fill="#859e89"/><path d="M-15-23 12-7M-15-13 8 0" stroke="#f5e7c9" strokeWidth="2"/><text x="-5" y="19" fill="#f5e7c9" stroke="none" fontSize="15" fontWeight="800" transform="rotate(28 -5 19)">LV.{level}</text><path d="M-16 23 7 36" stroke="#f2d48a" strokeWidth="2"/></g></Hotspot>
   <Plant x={699} y={571} scale={.85}/>
   <Hotspot label="Chào mèo Mướp" onClick={onCat}><g transform="translate(602 587)" className="sleeping-cat"><ellipse rx="38" ry="22" fill="#d5b393"/><ellipse cx="2" cy="-4" rx="24" ry="15" fill="#dba971"/><path d="M-20-7-22-24-6-14M2-14 15-25 18-9" fill="#dba971"/><ellipse cx="-3" cy="-8" rx="19" ry="15" fill="#e8ba82"/><path d="M-14-10q4 4 8 0m6 0q4 4 8 0" fill="none" strokeWidth="1.6"/><path d="M-4-4h3l-1 3Z" fill={ink}/><path d="M20 7q17 13 23-4q3-14-8-15" fill="none" stroke="#bd895f" strokeWidth="10"/><path d="M-18-2h-10m11 6-10 3m39-8 10-3" fill="none" strokeWidth="1.2"/><text className="cat-snooze" x="23" y="-28" fill="#8b9e8f" stroke="none" fontSize="17" fontWeight="700">z</text><text className="cat-snooze second" x="36" y="-43" fill="#8b9e8f" stroke="none" fontSize="12" fontWeight="700">z</text></g></Hotspot>
   <g transform="translate(239 512)"><path d="M-20 0 4-14 27 0 3 14Z" fill="#e5c49f"/><path d="M-20 0v12L3 26 27 12V0L3 14v12" fill="#ca9c78"/><path d="M-13 8-13 15m8-2v7m8-3v7m8-12v7m8-11v7" stroke="#a57e60" strokeWidth="1"/><path d="M-2-9v-18" stroke="#7f9b72"/><path d="M-2-22q-21-3-15-15q16-5 15 15m1-1q-1-23 13-20q10 12-13 20" fill="#a0b48a"/></g>
  </g>
  {night&&<path d="M130 450V270L480 70 830 270v180L480 650Z" className="night-wash" fill="#60536d" opacity=".17" pointerEvents="none"/>}
  <g className="scene-sparkles" fill="#faf2d4" stroke="#9fb5a3" strokeWidth="1.5"><path d="M102 388v18m-9-9h18M858 364v15m-7-8h14"/></g>
 </svg>;
}

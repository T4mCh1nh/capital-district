import {useEffect,useRef,useState} from 'react';

type Point = readonly [number, number];
type Stop = {at:number;point:Point};
type Direction = 'se'|'ne'|'sw'|'nw';

/** Animations have their own clock; they never advance the business simulation. */
export function useMapMotion(){
  const svgRef=useRef<SVGSVGElement>(null);
  const [paused,setPaused]=useState(()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hidden,setHidden]=useState(()=>typeof document!=='undefined'&&document.hidden);
  useEffect(()=>{
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>setPaused(preference.matches);
    const visibility=()=>setHidden(document.hidden);
    preference.addEventListener('change',change);
    document.addEventListener('visibilitychange',visibility);
    return()=>{preference.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility)};
  },[]);
  useEffect(()=>{const svg=svgRef.current;if(!svg)return;if(paused||hidden)svg.pauseAnimations();else svg.unpauseAnimations()},[paused,hidden]);
  return{svgRef,paused,stopped:paused||hidden,toggle:()=>setPaused(value=>!value)};
}

function route(stops:Stop[]){
  let distance=0;const lengths=[0];
  for(let i=1;i<stops.length;i++){distance+=Math.hypot(stops[i].point[0]-stops[i-1].point[0],stops[i].point[1]-stops[i-1].point[1]);lengths.push(distance)}
  const origin=stops[0].point;
  return{origin,path:stops.map((stop,i)=>`${i?'L':'M'}${stop.point[0]-origin[0]} ${stop.point[1]-origin[1]}`).join(' '),keyPoints:lengths.map(length=>length/distance).join(';'),keyTimes:stops.map(stop=>stop.at).join(';')};
}

function Trip({stops,duration,phase=0,vanish=false,enterShop=false,children}:{stops:Stop[];duration:number;phase?:number;vanish?:boolean;enterShop?:boolean;children:React.ReactNode}){
  const r=route(stops),dur=`${duration}s`,begin=`-${phase}s`;
  return <g transform={`translate(${r.origin[0]} ${r.origin[1]})`}><g className="street-traveler">
    <animateMotion path={r.path} dur={dur} begin={begin} keyPoints={r.keyPoints} keyTimes={r.keyTimes} calcMode="linear" repeatCount="indefinite"/>
    {vanish&&<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.045;.95;1" dur={dur} begin={begin} repeatCount="indefinite"/>}
    {enterShop&&<animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0;.45;.47;.61;.63;1" dur={dur} begin={begin} repeatCount="indefinite"/>}
    {children}
  </g></g>;
}

function Pedestrian({color='#b88791',variant=0,bag=false}:{color?:string;variant?:number;bag?:boolean}){
  return <g className={`street-person person-${variant}`} stroke="#705346" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cy="1" rx="6.5" ry="2.6" fill="#806b51" opacity=".16" stroke="none"/>
    <g className="walker-left-leg"><path d="M-2-6v6l-2 1" fill="none" stroke="#786d64" strokeWidth="2.5"/></g>
    <g className="walker-right-leg"><path d="M2-6v6l2 1" fill="none" stroke="#786d64" strokeWidth="2.5"/></g>
    <g className="walker-body"><path className="walker-left-arm" d="M-4-13-6-7" stroke="#dfb18e" strokeWidth="2.6"/><path className="walker-right-arm" d="M4-13 6-7" stroke="#dfb18e" strokeWidth="2.6"/>
      <path d="M-4-15q4-2 8 0l1 8q-5 3-10 0Z" fill={color}/>
      <circle cy="-21" r="5.5" fill="#f0c7a3"/>
      <path d={variant%2?'M-5-20q-3-8 4-8q8-1 7 8l-4-3q-4 3-5-1Z':'M-5-21q-2-7 4-7q8-1 7 7l-4-3q-3 3-5 0Z'} fill={variant%3===2?'#ad7a55':'#705346'}/>
      {variant%2===1&&<circle cx="5" cy="-26" r="2.5" fill="#705346"/>}
      <path d="M-2-20v.5m4-.5v.5" strokeWidth=".8"/>
      <path d="M-1-17q1 1 2 0" fill="none" strokeWidth=".6"/>
      {bag&&<path d="M5-7h5v6H5Zm1 0v-2q2-3 3 0v2" fill="#f1d49d" strokeWidth=".8"/>}
    </g>
  </g>;
}

function project(x:number,z:number,h:number,direction:Direction):Point{
  const [worldX,worldZ]=direction==='se'?[x,z]:direction==='ne'?[z,-x]:direction==='sw'?[-z,x]:[-x,-z];
  return[worldX-worldZ,(worldX+worldZ)*.52-h];
}
function Box({x=0,z=0,y=0,length,width,height,color,direction}:{x?:number;z?:number;y?:number;length:number;width:number;height:number;color:string;direction:Direction}){
  const corners=[[-length/2+x,-width/2+z],[length/2+x,-width/2+z],[length/2+x,width/2+z],[-length/2+x,width/2+z]];
  const p=(index:number,h:number)=>project(corners[index][0],corners[index][1],h,direction).join(',');
  const faces=[0,1,2,3].map(i=>({i,depth:project(corners[i][0]+corners[(i+1)%4][0],corners[i][1]+corners[(i+1)%4][1],0,direction)[1]})).sort((a,b)=>a.depth-b.depth);
  return <g stroke="#6f574b" strokeWidth="1.1" strokeLinejoin="round">
    {faces.slice(2).map(({i})=><polygon key={i} points={`${p(i,y)} ${p((i+1)%4,y)} ${p((i+1)%4,y+height)} ${p(i,y+height)}`} fill={color}/>)}
    <polygon points={corners.map((_,i)=>p(i,y+height)).join(' ')} fill={color}/>
    <polygon points={corners.map((_,i)=>p(i,y+height)).join(' ')} fill="#fff8df" opacity=".12" stroke="none"/>
  </g>;
}
function Vehicle({direction='se',color='#ce8d8d',delivery=false}:{direction?:Direction;color?:string;delivery?:boolean}){
  const p=(x:number,z:number,h:number)=>project(x,z,h,direction);
  const wheelSide=direction==='se'||direction==='sw'?1:-1;
  const windowPoints=[p(delivery?20:7,-6,delivery?17:21),p(delivery?20:7,6,delivery?17:21),p(delivery?20:7,6,delivery?10:16),p(delivery?20:7,-6,delivery?10:16)].map(point=>point.join(',')).join(' ');
  return <g className="street-vehicle">
    <ellipse cy="5" rx="29" ry="9" fill="#806b51" opacity=".12"/>
    <Box length={delivery?41:36} width={18} height={10} y={4} color={color} direction={direction}/>
    {delivery?<><Box x={-7} length={27} width={19} height={22} y={5} color="#ebd7af" direction={direction}/><Box x={15} length={12} width={17} height={16} y={4} color={color} direction={direction}/></>:<Box x={-3} length={20} width={15} height={10} y={14} color={color} direction={direction}/>}
    <polygon points={windowPoints} fill="#bfd5d2" stroke="#6f574b" strokeWidth="1" strokeLinejoin="round"/>
    {[-11,13].map(x=>{const point=p(x,wheelSide*10,3);return <g key={x}><ellipse cx={point[0]} cy={point[1]} rx="3.4" ry="4.4" fill="#625e55" stroke="#6f574b" strokeWidth=".9"/><ellipse cx={point[0]} cy={point[1]} rx="1.3" ry="2.1" fill="#dbd3ba"/></g>})}
    {[-5,5].map(z=>{const point=p(delivery?21:19,z,9);return <ellipse key={z} cx={point[0]} cy={point[1]} rx="1.5" ry="1.1" fill="#fff1bd"/>})}
    {delivery&&<g className="delivery-parcel"><path d="M-8-21-1-25 6-21-1-17Z" fill="#bba27b" stroke="#8c7459" strokeWidth=".7"/><path d="M-1-17v7l7-4v-7M-8-21v7l7 4" fill="#d4bc94" stroke="#8c7459" strokeWidth=".7"/></g>}
  </g>;
}

const carNorth:Stop[]=[{at:0,point:[290,435]},{at:1,point:[694,222]}];
const carWest:Stop[]=[{at:0,point:[557,501]},{at:1,point:[120,273]}];
const delivery:Stop[]=[{at:0,point:[282,191]},{at:.22,point:[389,247]},{at:.48,point:[389,247]},{at:1,point:[719,419]}];
const shopper:Stop[]=[{at:0,point:[550,508]},{at:.14,point:[356,407]},{at:.28,point:[512,325]},{at:.4,point:[385,259]},{at:.46,point:[346,256]},{at:.62,point:[346,256]},{at:.68,point:[385,259]},{at:.8,point:[512,325]},{at:.9,point:[356,407]},{at:1,point:[550,508]}];
const walkerEast:Stop[]=[{at:0,point:[133,278]},{at:.48,point:[552,497]},{at:.54,point:[552,497]},{at:1,point:[133,278]}];
const walkerNorth:Stop[]=[{at:0,point:[139,349]},{at:.45,point:[530,145]},{at:.55,point:[530,145]},{at:1,point:[139,349]}];
const walkerFront:Stop[]=[{at:0,point:[453,519]},{at:.48,point:[845,315]},{at:.54,point:[845,315]},{at:1,point:[453,519]}];

export default function StreetLife({stopped}:{stopped:boolean}){
  return <g className={`street-life ${stopped?'street-life-paused':''}`} aria-hidden="true" pointerEvents="none">
    <Trip stops={carNorth} duration={23} phase={9} vanish><Vehicle direction="ne" color="#9ebaaa"/></Trip>
    <Trip stops={carWest} duration={28} phase={4} vanish><Vehicle direction="nw" color="#d197a0"/></Trip>
    <Trip stops={delivery} duration={31} phase={10} vanish><Vehicle direction="se" color="#c4ac7e" delivery/></Trip>
    <Trip stops={walkerNorth} duration={52} phase={14}><Pedestrian color="#9cacc5" variant={0}/></Trip>
    <Trip stops={walkerEast} duration={61} phase={24}><Pedestrian color="#c39baf" variant={1} bag/></Trip>
    <Trip stops={walkerFront} duration={48} phase={18}><Pedestrian color="#c6aa78" variant={2}/></Trip>
    <Trip stops={shopper} duration={66} phase={27} enterShop><Pedestrian color="#8fac9a" variant={3} bag/></Trip>
  </g>;
}

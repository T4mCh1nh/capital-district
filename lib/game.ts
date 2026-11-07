export const BUSINESSES = [
  { id:'coffee', name:'Tiệm cà phê', color:'#b5784e', revenue:8.4, materials:.27, setup:24, volatility:.12, description:'Vốn nhẹ, khách quen, dễ mở rộng.', trait:'Vốn khởi nghiệp nhẹ' },
  { id:'grocery', name:'Cửa hàng tạp hóa', color:'#628c60', revenue:11.8, materials:.46, setup:38, volatility:.025, description:'Nhu cầu thiết yếu, dòng tiền bền vững.', trait:'Ít biến động' },
  { id:'fashion', name:'Xưởng thời trang', color:'#9b809e', revenue:12.6, materials:.37, setup:46, volatility:.4, description:'Biên lợi nhuận cao, đón đầu xu hướng.', trait:'Lợi nhuận cao' },
] as const;
export type Worker={id:number;name:string;health:number;store:number;avatar:string};
export type Store={lot:number;level:number};
export type Notice={id:number;month:number;title:string;detail:string;type:string};
export type Ledger={revenue:number;materials:number;wages:number;upkeep:number;tax:number;profit:number;surplus:number};
export type Game={version:number;started:boolean;month:number;cash:number;business:number;stores:Store[];lots:number[];workers:Worker[];hours:number;intensity:number;wage:number;welfare:boolean;evade:boolean;withhold:boolean;arrears:number;quits:number;totalTax:number;totalRevenue:number;totalProfit:number;market:number;landFactor:number;notices:Notice[];history:number[];last:Ledger;end:string|null;id:string};
export const NAMES=['Minh Anh','Hoàng Nam','Thu Hà','Đức Huy','Bảo Ngọc','Gia Hưng','Khánh Linh','Tuấn Kiệt','Phương Thảo','Thanh Tùng','Hải Yến','Quốc Bảo'];
export function initialGame(business=0):Game{return{version:1,started:false,month:0,cash:120,business,stores:[{lot:0,level:1}],lots:[0],workers:[0,1].map(i=>({id:i+1,name:NAMES[i],health:96,store:0,avatar:['#f0d5bc','#d8dfc9'][i]})),hours:8,intensity:100,wage:3.2,welfare:true,evade:false,withhold:false,arrears:0,quits:0,totalTax:0,totalRevenue:0,totalProfit:0,market:1,landFactor:1,notices:[{id:1,month:0,title:'Một khởi đầu nhỏ. Một tầm nhìn lớn.',detail:'120 triệu vốn, một cửa hàng và hai cộng sự. Câu chuyện của bạn bắt đầu tại đây.',type:'info'}],history:[],last:{revenue:0,materials:0,wages:0,upkeep:0,tax:0,profit:0,surplus:0},end:null,id:''}}
export function notice(g:Game,title:string,detail:string,type='info'){g.notices=[{id:Date.now()+Math.random(),month:g.month,title,detail,type},...g.notices].slice(0,40)}
export function forecast(g:Game):Ledger{const b=BUSINESSES[g.business];const revenue=g.workers.reduce((sum,w)=>{const s=g.stores.find(s=>s.lot===w.store);return sum+(s?b.revenue*(1+(s.level-1)*.22)*(g.hours/8)*(g.intensity/100)*(.55+w.health/220)*g.market:0)},0);const materials=revenue*b.materials;const wages=g.workers.length*g.wage*Math.max(1,g.hours/8);const upkeep=g.stores.length*1.6+g.lots.length*.25+(g.welfare?g.workers.length*.35:0);const tax=Math.max(0,revenue-materials-wages-upkeep)*(g.evade?.05:.2);return{revenue,materials,wages,upkeep,tax,surplus:revenue-materials-wages,profit:revenue-materials-wages-upkeep-tax}}
export function landPrice(g:Game,lot:number){return Math.round((49+lot*4)*g.landFactor)}
export function assets(g:Game){return g.cash+g.lots.reduce((s,l)=>s+landPrice(g,l),0)+g.stores.reduce((sum,s)=>sum+BUSINESSES[g.business].setup+(s.level-1)*12,0)-g.arrears}
export function stepGame(input:Game,random=Math.random):Game{
  if(!input.started||input.end||input.month>=60)return input;
  const g:Game=structuredClone(input);g.month++;const b=BUSINESSES[g.business];g.market=Math.max(.6,Math.min(1.5,1+Math.sin(g.month*.72)*b.volatility+(random()-.5)*b.volatility));g.landFactor=Math.max(.75,1+g.month*.007+Math.sin(g.month*.4)*.09);
  g.last=forecast(g);g.cash+=g.last.profit+(g.withhold?g.last.wages:0);g.totalProfit+=g.last.profit;g.totalRevenue+=g.last.revenue;g.totalTax+=g.last.tax+g.lots.length*.25;if(g.withhold)g.arrears+=g.last.wages;
  const lost:number[]=[];
  for(const w of g.workers){const pressure=Math.max(0,g.hours-8)*3+Math.max(0,g.intensity-100)*.15;w.health=Math.max(0,Math.min(100,w.health+2+(g.welfare?2:0)+(g.wage-3.2)*2-pressure-(g.withhold?12:0)));
    if(w.health<45&&random()<(45-w.health)/90){lost.push(w.id);g.quits++;notice(g,`${w.name} đã nghỉ việc`,'Áp lực kéo dài làm sức lao động suy kiệt. Giảm giờ làm hoặc đầu tư phúc lợi để giữ đội ngũ.','danger')}
    else if(w.health<55&&(g.hours>8||g.intensity>100)&&random()<.08){g.cash-=16;w.health=Math.max(0,w.health-15);notice(g,'Tai nạn lao động',`Chi 16 triệu hỗ trợ và bồi thường cho ${w.name}.`,'danger')}
  }
  g.workers=g.workers.filter(w=>!lost.includes(w.id));
  if(g.arrears>0&&random()<Math.min(.6,g.arrears/90)){const fine=g.arrears+12;g.cash-=fine;g.arrears=0;notice(g,'Người lao động thắng kiện',`Thanh toán lương còn nợ và bồi thường: ${fine.toFixed(1)} triệu.`,'danger')}
  if(g.evade&&random()<.075){g.end='Bị phát hiện trốn thuế. Hành trình đầu tư kết thúc.';notice(g,'Thanh tra thuế','Kê khai sai nghĩa vụ thuế dẫn đến đình chỉ kinh doanh.','danger')}
  if(g.quits>3)g.end='Đã có 4 nhân viên nghỉ việc. Doanh nghiệp mất khả năng duy trì đội ngũ.';
  if(g.cash<0)g.end='Cạn dòng tiền: doanh nghiệp không thể thanh toán các nghĩa vụ đến hạn.';
  if(g.month%6===0)notice(g,g.market>1?'Thị trường khởi sắc':'Nhịp thị trường thay đổi',`Sức mua hiện tại bằng ${Math.round(g.market*100)}% mức cơ sở. Giá đất cũng biến động theo chu kỳ.`,'market');
  if(g.month===12)notice(g,'Năm đầu tiên đã hoàn thành','Dùng lợi nhuận để mua tư liệu sản xuất và thuê thêm lao động là một biểu hiện của tích lũy tư bản.','learn');
  if(g.month===60&&!g.end){g.end='Hoàn thành 5 năm kinh doanh!';notice(g,'Bạn đã viết nên câu chuyện của mình','Xem tổng kết để đối chiếu tài sản, lợi nhuận và điều kiện lao động.','success')}
  g.history=[...g.history,g.last.profit];return g;
}

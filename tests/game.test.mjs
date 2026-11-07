import test from 'node:test';
import assert from 'node:assert/strict';
import {initialGame,forecast,stepGame,assets} from '../lib/game.ts';
const start=(business=0)=>({...initialGame(business),started:true,id:'test'});
test('a sustainable strategy can finish all 60 months in every industry',()=>{
 for(let i=0;i<3;i++){let g=start(i);for(let m=0;m<60;m++)g=stepGame(g,()=>.5);assert.equal(g.month,60);assert.equal(g.end,'Hoàn thành 5 năm kinh doanh!');assert.equal(g.quits,0);assert.ok(g.cash>120);assert.equal(g.history.length,60);assert.equal(stepGame(g),g);assert.ok(Number.isFinite(assets(g)))}
});
test('tax evasion can trigger a game-ending inspection, including month 60',()=>{for(const month of [0,59]){const g=start();g.month=month;g.evade=true;const next=stepGame(g,()=>0);assert.match(next.end,/trốn thuế/);assert.ok(next.notices.some(n=>n.title==='Thanh tra thuế'))}});
test('bankruptcy ends a business even when it owns land',()=>{const g=start();g.cash=.1;g.workers=[];const next=stepGame(g,()=>.5);assert.ok(next.cash<0);assert.match(next.end,/Cạn dòng tiền/)});
test('four resignations lose, but three do not',()=>{const g=start();g.quits=3;g.workers[0].health=0;g.hours=12;g.intensity=140;const next=stepGame(g,()=>0);assert.ok(next.quits>=4);assert.match(next.end,/4 nhân viên/);const three=start();three.quits=3;assert.equal(stepGame(three,()=>.5).end,null)});
test('withheld wages create debt, never additional operating profit',()=>{const g=start();const normal=forecast(g);g.withhold=true;assert.equal(forecast(g).profit,normal.profit);const next=stepGame(g,()=>.99);assert.ok(next.arrears>0);assert.ok(Math.abs(next.cash-g.cash-next.last.profit-next.last.wages)<1e-8);const pay=stepGame(next,()=>0);assert.equal(pay.arrears,0);assert.ok(pay.notices.some(n=>n.title==='Người lao động thắng kiện'))});
test('overwork lowers health and affects productivity; upgrading increases output',()=>{const g=start();g.hours=12;g.intensity=140;const next=stepGame(g,()=>.99);assert.ok(next.workers[0].health<g.workers[0].health);const normal=start();const before=forecast(normal).revenue;normal.stores[0].level=2;assert.ok(forecast(normal).revenue>before)});
test('settlement respects ledger identities and does not mutate the input',()=>{const g=start();const next=stepGame(g,()=>.5);const p=next.last;assert.ok(Math.abs(p.profit-(p.revenue-p.materials-p.wages-p.upkeep-p.tax))<1e-8);assert.equal(g.month,0);assert.equal(g.workers[0].health,96);assert.equal(next.month,1);assert.equal(stepGame(initialGame()).month,0)});

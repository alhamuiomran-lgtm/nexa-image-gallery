/* Same explicit assumptions on the front end and in Gutenberg. No external data. */
(() => {'use strict';const bounded=(v,d,min,max)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Number(v))):d;
 window.nexaSolarEstimate=a=>{const c={monthly:bounded(a.monthly,650,100,6000),rate:bounded(a.rate,.25,0,5),yield:bounded(a.yield,1200,300,2500),coverage:bounded(a.coverage,80,10,100),selfConsumption:bounded(a.selfConsumption,70,0,100)};const production=c.monthly*12*c.coverage/100,selfUsed=production*c.selfConsumption/100;return {capacity:production/c.yield,production,selfUsed,offset:selfUsed*c.rate};};
})();

import puppeteer from 'puppeteer-core';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-webgl','--enable-unsafe-swiftshader']});
await mkdir('review/live',{recursive:true});
const report=[];
for(const spec of [{id:'desktop',w:1440,h:960},{id:'mobile',w:390,h:844},{id:'reduced',w:1440,h:960,reduced:true},{id:'fallback',w:390,h:844,fallback:true}]){
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.setViewport({width:spec.w,height:spec.h});
 await page.evaluateOnNewDocument((fallback)=>{localStorage.setItem('av:lang','es');if(fallback){const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type.includes('webgl'))return null;return original.call(this,type,...args);};}},!!spec.fallback);
 if(spec.reduced)await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.goto((process.env.BASE_URL || 'http://127.0.0.1:4322')+'/',{waitUntil:'networkidle0'});
 await page.waitForFunction(()=>document.documentElement.classList.contains('is-revealed'));
 await new Promise(r=>setTimeout(r,2400));
 await page.screenshot({path:`review/live/${spec.id}.png`});
 const before=await page.$eval('[data-universe]',el=>el.dataset.rotation);
 await new Promise(r=>setTimeout(r,1100));
 const after=await page.$eval('[data-universe]',el=>el.dataset.rotation);
 await page.evaluate(()=>scrollTo({top:innerHeight*1.6,behavior:'instant'}));await new Promise(r=>setTimeout(r,1800));
 await page.screenshot({path:`review/live/${spec.id}-scroll.png`});
 const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,travel:document.querySelector('[data-universe]').dataset.travel,canvasCount:document.querySelectorAll('[data-universe]').length,loader:document.querySelector('[data-loader]').dataset.state,master:!!document.querySelector('[data-master]')}));
 if(spec.id==='desktop'){await page.click('[data-lang-link][hreflang="en"]');await new Promise(r=>setTimeout(r,1500));data.language=await page.evaluate(()=>({lang:document.documentElement.lang,revealed:document.documentElement.classList.contains('is-revealed'),scroll:scrollY,canvasCount:document.querySelectorAll('[data-universe]').length}));}
 report.push({id:spec.id,before,after,...data,errors});await page.close();
}
await browser.close();await writeFile('review/live/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));

import puppeteer from 'puppeteer-core';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-webgl','--enable-unsafe-swiftshader']});
const report=[];await mkdir('review/realism',{recursive:true});
try {
for(const spec of [{id:'desktop',w:1440,h:960},{id:'mobile',w:390,h:844},{id:'texture-failure',w:1440,h:960,fail:true},{id:'reduced',w:390,h:844,reduced:true}]){
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('ERR_FAILED'))errors.push(m.text());});
await page.setViewport({width:spec.w,height:spec.h});await page.evaluateOnNewDocument(()=>localStorage.setItem('av:lang','es'));
if(spec.reduced)await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
await page.setRequestInterception(true);page.on('request',req=>{if(req.url().includes('earth-blue-marble.webp')){if(spec.fail)return req.abort();return setTimeout(()=>req.continue(),3500);}req.continue();});
await page.goto('http://127.0.0.1:4323/',{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>document.querySelector('[data-black-hole]').readyState>=2);
await new Promise(r=>setTimeout(r,400));
await page.screenshot({path:`review/realism/${spec.id}-loading.png`});
const videoBefore=await page.$eval('video',v=>v.currentTime);
await new Promise(r=>setTimeout(r,350));const videoAfter=await page.$eval('video',v=>v.currentTime);
await page.waitForFunction(()=>document.querySelector('[data-universe]').dataset.ready==='true');
await new Promise(r=>setTimeout(r,2300));await page.screenshot({path:`review/realism/${spec.id}-hero.png`});
const data=await page.evaluate(()=>({revealed:document.documentElement.classList.contains('is-revealed'),overflow:document.documentElement.scrollWidth>innerWidth,texture:document.querySelector('[data-universe]').dataset.texture||'loaded',videoPaused:document.querySelector('video').paused,rotation:document.querySelector('[data-universe]').dataset.rotation}));
if(errors.length||data.overflow||!data.revealed||!data.videoPaused)throw new Error(JSON.stringify({spec,data,errors}));
report.push({id:spec.id,videoBefore,videoAfter,...data,errors});await page.close();
}
}finally{await browser.close();await writeFile('review/realism/report.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify(report,null,2));

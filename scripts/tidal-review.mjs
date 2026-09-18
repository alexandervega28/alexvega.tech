import puppeteer from 'puppeteer-core';import{mkdir,writeFile}from'node:fs/promises';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-webgl','--enable-unsafe-swiftshader']});await mkdir('review/tidal',{recursive:true});const report=[];
try{for(const spec of[{id:'full',w:1440,h:960},{id:'skip-mobile',w:390,h:844,skip:true},{id:'reduced',w:390,h:844,reduced:true}]){
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.setViewport({width:spec.w,height:spec.h});await page.evaluateOnNewDocument(()=>localStorage.setItem('av:lang','es'));
 if(spec.reduced)await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 const start=Date.now();await page.goto('http://127.0.0.1:4323/',{waitUntil:'domcontentloaded'});
 if(spec.skip){await page.waitForFunction(()=>document.querySelector('[data-gravity]').dataset.phase==='approach');await page.click('[data-skip-intro]');}
 if(spec.id==='full'){await new Promise(r=>setTimeout(r,5200));await page.screenshot({path:'review/tidal/stretch.png'});const state=await page.$eval('[data-loader]',e=>e.dataset.state);if(state==='done')throw Error('Intro ended too early');}
 await page.waitForFunction(()=>document.querySelector('[data-universe]').dataset.ready==='true');const duration=Date.now()-start;
 await new Promise(r=>setTimeout(r,2100));await page.screenshot({path:`review/tidal/${spec.id}.png`});
 const before=await page.$eval('[data-universe]',e=>e.dataset.moonOrbit);await new Promise(r=>setTimeout(r,600));
 const data=await page.evaluate(()=>({moon:document.querySelector('[data-universe]').dataset.moon,orbit:document.querySelector('[data-universe]').dataset.moonOrbit,overflow:document.documentElement.scrollWidth>innerWidth,inert:document.querySelector('[data-page]').hasAttribute('inert'),paused:document.querySelector('video').paused}));
 if(data.moon!=='ready'||data.overflow||data.inert||!data.paused||errors.length)throw Error(JSON.stringify({data,errors}));
 if(spec.id==='full'&&duration<8800)throw Error('Intro shorter than designed');
 if(spec.reduced&&before!==data.orbit)throw Error('Reduced-motion moon moves');
 report.push({id:spec.id,duration,before,...data,errors});await page.close();
}}finally{await browser.close();await writeFile('review/tidal/report.json',JSON.stringify(report,null,2));}console.log(JSON.stringify(report,null,2));

import puppeteer from 'puppeteer-core';import{mkdir,writeFile}from'node:fs/promises';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-webgl','--enable-unsafe-swiftshader']});await mkdir('review/orbit-loader',{recursive:true});
try{
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.setViewport({width:1440,height:960});await page.evaluateOnNewDocument(()=>localStorage.setItem('av:lang','es'));await page.goto(process.env.BASE_URL || 'http://127.0.0.1:4324/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
const frames=[];
for(let i=0;i<3;i++){
await new Promise(r=>setTimeout(r,i?2500:500));await page.screenshot({path:`review/orbit-loader/frame-${i}.png`});
frames.push(await page.evaluate(()=>{const v=document.querySelector('video');const c=document.createElement('canvas');c.width=128;c.height=128;const x=c.getContext('2d');x.drawImage(v,0,0,128,128);return{time:v.currentTime,duration:v.duration,rate:v.playbackRate,paused:v.paused,source:v.currentSrc,pixels:Array.from(x.getImageData(0,0,128,128).data)};}));
}
const delta=(a,b)=>a.pixels.reduce((sum,v,i)=>sum+Math.abs(v-b.pixels[i]),0)/a.pixels.length;
const differences=[delta(frames[0],frames[1]),delta(frames[1],frames[2])];if(differences.some(d=>d<3)||frames.some(f=>f.paused)||errors.length)throw Error(JSON.stringify({differences,errors}));
await page.waitForFunction(()=>document.querySelector('[data-loader]').dataset.state==='done');
const report={frames:frames.map(({pixels,...rest})=>rest),differences,errors};await writeFile('review/orbit-loader/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}

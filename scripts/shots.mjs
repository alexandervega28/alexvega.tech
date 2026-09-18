/**
 * Capturas de revisión. Pilota el Chrome instalado en la máquina, en tiempo
 * real, contra `astro preview`. No forma parte del sitio publicado.
 *
 *   node scripts/shots.mjs [carpeta-de-salida]
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const OUT = process.argv[2] ?? 'shots';
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const CHROME =
  process.env.CHROME_PATH ??
  'C:/Program Files/Google/Chrome/Application/chrome.exe';

const VIEWPORTS = [
  { name: '320', width: 320, height: 720 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1440', width: 1440, height: 960 },
];

const V1440 = VIEWPORTS[VIEWPORTS.length - 1];

const shots = [
  // Estado final del hero en ambos idiomas y en cada punto de control.
  ...VIEWPORTS.flatMap((v) => [
    { id: `hero-es-${v.name}`, url: '/', viewport: v, wait: 2600 },
    { id: `hero-en-${v.name}`, url: '/en/', viewport: v, wait: 2600 },
  ]),
  // Bienvenida capturada en pleno progreso.
  {
    id: 'loader-es-1440',
    url: '/',
    viewport: V1440,
    wait: 60,
    throttle: true,
  },
  {
    id: 'loader-en-390',
    url: '/en/',
    viewport: VIEWPORTS[1],
    wait: 60,
    throttle: true,
  },
  // Zoom 200 % equivale a la mitad de ancho CSS con el doble de escala.
  {
    id: 'zoom200-es-1440',
    url: '/',
    viewport: { width: 720, height: 480, deviceScaleFactor: 2 },
    wait: 2600,
    // Al 200 % el contenido no cabe en una pantalla y se desplaza en vertical:
    // es el comportamiento accesible correcto, no un defecto de encaje.
    allowScroll: true,
  },
  // Movimiento reducido: sin órbita, sin viaje.
  {
    id: 'reduced-es-1440',
    url: '/',
    viewport: V1440,
    wait: 2600,
    reduced: true,
  },
  // Fallo del master: el contenido tiene que seguir siendo legible.
  {
    id: 'fallback-es-1440',
    url: '/',
    viewport: V1440,
    wait: 6200,
    blockImages: true,
  },
  // Menú móvil desplegado.
  {
    id: 'menu-es-390',
    url: '/',
    viewport: VIEWPORTS[1],
    wait: 2600,
    openMenu: true,
  },
];

const report = [];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
});

await mkdir(OUT, { recursive: true });

for (const shot of shots) {
  const page = await browser.newPage();
  await page.setViewport({
    width: shot.viewport.width,
    height: shot.viewport.height,
    deviceScaleFactor: shot.viewport.deviceScaleFactor ?? 1,
  });

  if (shot.reduced) {
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
  }

  if (shot.blockImages || shot.throttle) {
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const isMaster = req.url().includes('hero-space-master');
      if (shot.blockImages && isMaster) return req.abort();
      req.continue();
    });
  }

  if (shot.throttle) {
    const client = await page.createCDPSession();
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 120,
      downloadThroughput: (180 * 1024) / 8,
      uploadThroughput: (180 * 1024) / 8,
    });
  }

  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    // El propio arnés corta la imagen en la prueba de fallback: ese fallo de
    // red es el escenario, no un defecto.
    if (shot.blockImages && m.text().includes('net::ERR_FAILED')) return;
    errors.push(m.text());
  });

  await page.goto(BASE + shot.url, { waitUntil: 'domcontentloaded' });

  if (shot.openMenu) {
    await new Promise((r) => setTimeout(r, shot.wait));
    await page.click('[data-menu-toggle]');
    await new Promise((r) => setTimeout(r, 250));
  } else {
    await new Promise((r) => setTimeout(r, shot.wait));
  }

  // Comprobaciones medibles, no impresiones.
  const audit = await page.evaluate(() => {
    const doc = document.documentElement;
    const master = document.querySelector('[data-master]');
    const scene = document.querySelector('[data-scene]');
    const name = document.querySelector('.hero__name');
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      horizontalOverflow: doc.scrollWidth > doc.clientWidth + 1,
      revealed: doc.classList.contains('is-revealed'),
      sceneReady: scene?.classList.contains('scene--ready') ?? false,
      sceneFallback: scene?.classList.contains('scene--fallback') ?? false,
      masterOpacity: master ? getComputedStyle(master).opacity : null,
      masterNatural: master ? master.naturalWidth : null,
      loaderState:
        document.querySelector('[data-loader]')?.dataset.state ?? null,
      loaderValue:
        document.querySelector('[data-loader-value]')?.textContent ?? null,
      nameFontSize: name ? getComputedStyle(name).fontSize : null,
      nameRight: name ? Math.round(name.getBoundingClientRect().right) : null,
      // Cuánto se sale el pie del hero de la primera pantalla, en píxeles.
      heroOverflowY: (() => {
        const foot = document.querySelector('.hero__footer');
        if (!foot) return null;
        return Math.max(
          0,
          Math.round(foot.getBoundingClientRect().bottom - window.innerHeight)
        );
      })(),
      anchorCount: document.querySelectorAll('a[href]').length,
      pendingCount: document.querySelectorAll('[data-state="pending"]').length,
      smallTargets: Array.from(
        document.querySelectorAll('a[href], button')
      ).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.height < 44;
      }).length,
    };
  });

  await page.screenshot({ path: path.join(OUT, `${shot.id}.png`) });
  report.push({ id: shot.id, url: shot.url, allowScroll: !!shot.allowScroll, ...audit, errors });
  await page.close();
}

await browser.close();
await writeFile(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));

for (const row of report) {
  const flags = [
    row.horizontalOverflow ? 'OVERFLOW-X' : null,
    row.errors.length ? `JS-ERRORS(${row.errors.length})` : null,
    row.smallTargets ? `TAP<44(${row.smallTargets})` : null,
    row.heroOverflowY && !row.allowScroll ? `PIE-FUERA(+${row.heroOverflowY}px)` : null,
  ].filter(Boolean);
  console.log(
    `${row.id.padEnd(22)} loader=${String(row.loaderState).padEnd(7)} ` +
      `master=${String(row.masterOpacity).padEnd(4)} nat=${String(row.masterNatural).padEnd(5)} ` +
      `name=${String(row.nameFontSize).padEnd(8)} w=${row.scrollWidth}/${row.clientWidth} ` +
      (flags.length ? `!! ${flags.join(' ')}` : 'ok')
  );
}

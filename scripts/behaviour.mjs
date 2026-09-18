/**
 * Comprobaciones de comportamiento de la apertura. No forma parte del sitio.
 *
 *   node scripts/behaviour.mjs
 */
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const CHROME =
  process.env.CHROME_PATH ??
  'C:/Program Files/Google/Chrome/Application/chrome.exe';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];

const check = (name, pass, detail = '') =>
  results.push({ name, pass, detail });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars'],
});

// --- 1. Bienvenida: progreso real, monótono y sin adelantarse ------------
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960 });
  const client = await page.createCDPSession();
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (150 * 1024) / 8,
    uploadThroughput: (150 * 1024) / 8,
  });

  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });

  const samples = [];
  for (let i = 0; i < 40; i += 1) {
    samples.push(
      await page.evaluate(() => {
        const v = document.querySelector('[data-loader-value]')?.textContent;
        return v ? Number(v.replace('%', '')) : null;
      })
    );
    await wait(70);
  }

  const seen = samples.filter((n) => typeof n === 'number');
  const monotonic = seen.every((n, i) => i === 0 || n >= seen[i - 1]);
  const intermediate = seen.some((n) => n > 0 && n < 100);
  check('El progreso nunca retrocede', monotonic, seen.join(' '));
  check(
    'El progreso muestra valores reales intermedios, no solo 0 y 100',
    intermediate,
    `valores distintos: ${[...new Set(seen)].join(',')}`
  );

  // Con red lenta puede terminar la descarga o saltar el corte de 5 s: las dos
  // salidas son válidas, lo que no vale es quedarse en la bienvenida.
  await wait(5200);
  const end = await page.evaluate(() => ({
    loader: document.querySelector('[data-loader]')?.dataset.state,
    revealed: document.documentElement.classList.contains('is-revealed'),
    fallback: document
      .querySelector('[data-scene]')
      ?.classList.contains('scene--fallback'),
  }));
  check(
    'La bienvenida termina y revela el hero',
    end.loader === 'done' && end.revealed,
    `estado=${end.loader} fallback=${end.fallback}`
  );
  await page.close();
}

// --- 2. Cambio de idioma: instantáneo, sin bienvenida, conserva scroll ---
{
  const page = await browser.newPage();
  // Viewport bajo a propósito: el hero desborda y hay scroll que conservar.
  await page.setViewport({ width: 390, height: 560 });
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await wait(2200);

  await page.evaluate(() => window.scrollTo(0, 120));
  await wait(150);
  const before = await page.evaluate(() => window.scrollY);

  // Marca en window: solo sobrevive si NO hubo recarga completa.
  await page.evaluate(() => {
    window.__marker = 'vivo';
  });

  await page.click('a[hreflang="en"]');
  await wait(900);

  const after = await page.evaluate(() => ({
    scrollY: window.scrollY,
    lang: document.documentElement.lang,
    loader: document.querySelector('[data-loader]')?.dataset.state,
    path: location.pathname,
    role: document.querySelector('.hero__role')?.textContent?.trim(),
    stored: localStorage.getItem('av:lang'),
    marker: window.__marker,
  }));

  check('El cambio de idioma lleva a /en/', after.path === '/en/', after.path);
  check('El documento declara lang="en"', after.lang === 'en', after.lang);
  check(
    'Los textos cambian de idioma',
    after.role === 'Software developer',
    after.role
  );
  check(
    'No se repite la bienvenida',
    after.loader === 'done',
    `estado=${after.loader}`
  );
  check(
    'Se conserva la posición de scroll',
    Math.abs(after.scrollY - before) <= 2,
    `antes=${before} después=${after.scrollY}`
  );
  check(
    'La elección manual queda guardada',
    after.stored === 'en',
    String(after.stored)
  );
  check('No hubo recarga completa', after.marker === 'vivo');

  await page.close();
}

// --- 3. Segunda visita en la sesión: sin viaje, fundido corto ------------
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960 });
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await wait(2200);
  await page.reload({ waitUntil: 'load' });
  await wait(450);

  const state = await page.evaluate(() => ({
    instant: document.documentElement.classList.contains('is-instant'),
    revealed: document.documentElement.classList.contains('is-revealed'),
    loader: document.querySelector('[data-loader]')?.dataset.state,
  }));

  check('Segunda visita: entra en modo instantáneo', state.instant);
  check('Segunda visita: el hero ya está revelado a los 450 ms', state.revealed);
  check('Segunda visita: sin bienvenida', state.loader === 'done');
  await page.close();
}

// --- 4. Movimiento reducido: sin animaciones en marcha ------------------
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960 });
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ]);
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await wait(2200);

  const running = await page.evaluate(
    () =>
      document.getAnimations().filter((a) => a.playState === 'running').length
  );
  check('Movimiento reducido: ninguna animación en marcha', running === 0, `en marcha=${running}`);
  await page.close();
}

// --- 5. Teclado: el menú móvil se cierra con Escape ---------------------
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await wait(2200);

  await page.click('[data-menu-toggle]');
  await wait(200);
  const opened = await page.evaluate(
    () =>
      document.querySelector('[data-menu-toggle]')?.getAttribute('aria-expanded')
  );

  await page.keyboard.press('Escape');
  await wait(200);
  const closed = await page.evaluate(() => ({
    expanded: document
      .querySelector('[data-menu-toggle]')
      ?.getAttribute('aria-expanded'),
    focused: document.activeElement?.getAttribute('data-menu-toggle') !== null,
    hidden: document.querySelector('[data-menu-panel]')?.hidden,
  }));

  check('El menú se abre', opened === 'true', String(opened));
  check('Escape cierra el menú', closed.expanded === 'false' && closed.hidden === true);
  check('Escape devuelve el foco al botón', closed.focused);
  await page.close();
}

await browser.close();

let failed = 0;
for (const r of results) {
  if (!r.pass) failed += 1;
  console.log(
    `${r.pass ? 'OK  ' : 'FALLA'} ${r.name}${r.detail ? `  [${r.detail}]` : ''}`
  );
}
console.log(`\n${results.length - failed}/${results.length} comprobaciones`);
process.exit(failed ? 1 : 0);

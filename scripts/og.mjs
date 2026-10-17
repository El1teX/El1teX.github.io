// Рендерит public/og.png (1200×630) из resume/og.html через установленный Chrome или Edge.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const browser = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p))
if (!browser) {
  console.error('Не нашёл Chrome или Edge. Укажи путь в переменной CHROME_PATH.')
  process.exit(1)
}

const out = resolve('public/og.png')
execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--window-size=1200,630',
  '--virtual-time-budget=5000',
  `--screenshot=${out}`,
  pathToFileURL(resolve('resume/og.html')).href,
])
console.log('готово:', out)

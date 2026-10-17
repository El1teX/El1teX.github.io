// Собирает public/resume-maxim-sereda.pdf из resume/resume.html через установленный Chrome или Edge.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

const browser = candidates.find((p) => existsSync(p))
if (!browser) {
  console.error('Не нашёл Chrome или Edge. Укажи путь в переменной CHROME_PATH.')
  process.exit(1)
}

const out = resolve('public/resume-maxim-sereda.pdf')
execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=5000',
  `--print-to-pdf=${out}`,
  pathToFileURL(resolve('resume/resume.html')).href,
])
console.log('готово:', out)

# Портфолио — Максим Середа

**Сайт:** https://el1tex.github.io/

Личный сайт-портфолио в стиле терминала. React + Vite, анимации на [anime.js](https://animejs.com/) и [Motion](https://motion.dev/).

## Запуск

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # сборка в dist/
```

## Публикация

Каждый пуш в `main` собирает сайт и выкладывает его на GitHub Pages
(`.github/workflows/deploy.yml`). Ход сборки — на вкладке **Actions**.

## Где что менять

- `src/data.js` — весь текст сайта (RU и EN), проекты, ссылки.
- `src/styles.css` — цвета и вёрстка (переменные в `:root`).

## Анимации

| Где | Что | Библиотека |
| --- | --- | --- |
| Загрузка | `npm install maxim-sereda`: спиннер, пакеты-навыки, прогресс-бар (`createTimer`, `createTimeline`) | anime.js |
| Абзацы текста | печатаются в такт прокрутке и «стираются» при прокрутке назад (`onScroll` с `sync`) | anime.js |
| Курсор | блок `▋` догоняет мышь, над ссылками — рамка (`createAnimatable`) | anime.js |
| Hero, роль под именем | печатная машинка: печатает, стирает, меняет текст | Motion `animate` |
| Hero, имя | буквы падают по одной (`splitText` + `createTimeline`) | anime.js |
| Hero, сетка точек | волна от точки клика (`stagger` с `grid`) | anime.js |
| Кнопки в Hero | «магнитные», пружинят обратно (`outElastic`) | anime.js |
| Заголовки секций | «расшифровка» при появлении (`scrambleText`) | anime.js |
| Контент секций | выезд по очереди (`stagger`) | anime.js |
| Навыки | перешифровка по наведению | anime.js |
| Карточки проектов | 3D-наклон за курсором (`createAnimatable`) | anime.js |
| Экран загрузки | строки `[ OK ]` и полоса прогресса (`createTimeline`) | anime.js |
| Интерактивный терминал | новые строки выезжают по очереди (`stagger`) | anime.js |
| Таймлайн | линия рисуется синхронно с прокруткой (`svg.createDrawable` + `onScroll`) | anime.js |
| Календарь вкладов GitHub | клетки «прорастают» по неделям | anime.js |

## Горячие клавиши

- **Ctrl+K / ⌘K** — командная палитра: переход по секциям, проекты, резюме, тема, язык.
- **↑↑↓↓←→←→BA** — Konami-код: «глитч» заголовков и смена темы.
- Кнопка с полукругом в шапке переключает тему «зелёный / янтарный монитор» (запоминается).

## Резюме и превью ссылки

```bash
npm run resume   # resume/resume.html → public/resume-maxim-sereda.pdf
npm run og       # resume/og.html → public/og.png (1200×630)
```

Оба скрипта используют установленный Chrome или Edge; другой путь можно указать в `CHROME_PATH`.
Мета-теги Open Graph в `index.html` рассчитаны на адрес `https://el1tex.github.io/` —
если сайт будет жить в другом месте, поправь `og:url` и `og:image`.

## Производительность

Lighthouse (мобильный профиль, `vite preview`): Performance 93, Accessibility 100, Best Practices 100, SEO 100.
Шрифт JetBrains Mono подключён локально (`@fontsource`), скриншоты в WebP, Motion грузится отдельным чанком.

## Терминал

Команды: `help`, `whoami`, `about`, `skills`, `projects`, `open <1-4>`, `roadmap`, `contact`, `resume`,
`cd <секция>`, `lang ru|en`, `ls`, `date`, `echo`, `clear`. Пасхалки: `sudo hire maxim`, `matrix`.
Работают история (↑/↓), автодополнение (Tab) и очистка (Ctrl+L).

## Данные GitHub

Блок `activity` берёт данные в браузере посетителя: профиль и последние коммиты — из публичного GitHub API
(60 запросов в час на IP), календарь вкладов — из github-contributions-api.jogruber.de.
Ответ кешируется в `sessionStorage` на 30 минут. Если API недоступен, блок показывает ссылку на профиль.

## Скриншоты

Лежат в `src/assets/projects/` (WebP) и импортируются в `src/data.js` — Vite добавляет хеш в имя файла, поэтому браузер не берёт старую версию из кеша. «Мигом» — видео автосценария `migom.webm` (25 с, ускорено в 2,5 раза), играет только когда карточка на экране.

## 404

`public/404.html` — отдельная страница в стиле `command not found`, GitHub Pages отдаёт её сам.

Все анимации отключаются, если в системе включено «уменьшить движение» (`prefers-reduced-motion`).

// Содержимое страницы /uses: чем я пользуюсь в работе. Правь здесь.

export const uses = {
  ru: {
    title: 'uses — чем я пользуюсь',
    back: 'cd ~',
    lead: 'Инструменты, с которыми я делаю проекты: от редактора до деплоя. Список живой — меняется вместе со мной.',
    groups: [
      {
        name: 'редакторы',
        items: [
          ['VS Code', 'основной редактор для фронтенда и Node.js'],
          ['Visual Studio', 'C++ и C# — учебные задачи и практика'],
          ['PyCharm', 'когда нужен Python'],
        ],
      },
      {
        name: 'терминал и git',
        items: [
          ['PowerShell 7', 'терминал по умолчанию в Windows'],
          ['Git + GitHub CLI', 'коммиты, ветки, репозитории и Actions из консоли'],
          ['GitHub Desktop', 'когда удобнее посмотреть изменения глазами'],
        ],
      },
      {
        name: 'фронтенд',
        items: [
          ['React + Vite', 'база почти всех моих проектов'],
          ['TypeScript', 'типы там, где проект растёт'],
          ['anime.js и Motion', 'анимации — в том числе на этом сайте'],
          ['Leaflet', 'карты в сервисе доставки «Мигом»'],
          ['Vitest', 'тесты логики перед каждой публикацией'],
        ],
      },
      {
        name: 'бэкенд и данные',
        items: [
          ['Node.js 22 + Express', 'API и WebSocket (Socket.IO)'],
          ['PostgreSQL + Prisma', 'база данных и миграции'],
          ['SQL Server', 'реляционные базы на учёбе'],
        ],
      },
      {
        name: 'дизайн',
        items: [['Figma', 'макеты интерфейсов и прототипы перед вёрсткой']],
      },
      {
        name: 'ai-инструменты',
        items: [
          ['Claude Code', 'помощник в коде: разбор, рефакторинг, проверка идей'],
          ['Lovable', 'быстрые прототипы на React + Tailwind'],
        ],
      },
      {
        name: 'публикация',
        items: [
          ['GitHub Pages', 'хостинг для портфолио и пет-проектов'],
          ['GitHub Actions', 'сборка, тесты и деплой при каждом пуше'],
        ],
      },
      {
        name: 'система',
        items: [
          ['Windows 11', 'основная ОС'],
          ['Chrome DevTools', 'отладка вёрстки, сети и производительности'],
        ],
      },
    ],
  },
  en: {
    title: 'uses — my setup',
    back: 'cd ~',
    lead: 'The tools I build projects with, from the editor to deployment. A living list — it changes as I do.',
    groups: [
      {
        name: 'editors',
        items: [
          ['VS Code', 'main editor for frontend and Node.js'],
          ['Visual Studio', 'C++ and C# — coursework and practice'],
          ['PyCharm', 'when Python is needed'],
        ],
      },
      {
        name: 'terminal & git',
        items: [
          ['PowerShell 7', 'default terminal on Windows'],
          ['Git + GitHub CLI', 'commits, branches, repos and Actions from the console'],
          ['GitHub Desktop', 'when it is easier to review changes visually'],
        ],
      },
      {
        name: 'frontend',
        items: [
          ['React + Vite', 'the base of almost all my projects'],
          ['TypeScript', 'types where a project grows'],
          ['anime.js & Motion', 'animations — including on this site'],
          ['Leaflet', 'maps in the Migom delivery service'],
          ['Vitest', 'logic tests before every release'],
        ],
      },
      {
        name: 'backend & data',
        items: [
          ['Node.js 22 + Express', 'APIs and WebSockets (Socket.IO)'],
          ['PostgreSQL + Prisma', 'database and migrations'],
          ['SQL Server', 'relational databases at university'],
        ],
      },
      {
        name: 'design',
        items: [['Figma', 'interface mockups and prototypes before coding']],
      },
      {
        name: 'ai tools',
        items: [
          ['Claude Code', 'coding assistant: reviews, refactoring, trying ideas'],
          ['Lovable', 'quick prototypes with React + Tailwind'],
        ],
      },
      {
        name: 'shipping',
        items: [
          ['GitHub Pages', 'hosting for my portfolio and side projects'],
          ['GitHub Actions', 'build, tests and deploy on every push'],
        ],
      },
      {
        name: 'system',
        items: [
          ['Windows 11', 'main OS'],
          ['Chrome DevTools', 'debugging layout, network and performance'],
        ],
      },
    ],
  },
}

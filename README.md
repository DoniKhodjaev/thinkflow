# ThinkFlow v5.0

> **Мысли → Действия → Результат**

AI-powered план-генератор. Опиши идею голосом или текстом — получи пошаговый план действий от Claude AI.

![ThinkFlow](icons/icon-192.png)

---

## Возможности

- **Голосовой ввод** — удерживай кнопку для записи, визуализация волн в реальном времени
- **AI генерация планов** — Claude Haiku 4.5 создаёт 5-8 конкретных шагов
- **Итеративное улучшение** — добавляй фидбек, AI дорабатывает план
- **PWA** — устанавливается как приложение на iOS/Android
- **Офлайн-режим** — Service Worker кэширует ресурсы
- **Аутентификация** — логин/пароль + Face ID (WebAuthn)
- **Тёмная тема** — ambient-орбы, градиенты, микроанимации

---

## Структура проекта

```
thinkflow/
├── index.html          # Главная страница
├── manifest.json       # PWA манифест
├── sw.js               # Service Worker
├── css/
│   └── app.css         # Стили (design tokens, компоненты)
├── js/
│   └── app.js          # Логика (auth, voice, AI, UI)
├── icons/
│   ├── icon-512.png    # App icon 512×512
│   ├── icon-192.png    # App icon 192×192
│   └── favicon-32.png  # Favicon
└── README.md
```

---

## Быстрый старт

### 1. Получи API ключ

Зарегистрируйся на [console.anthropic.com](https://console.anthropic.com) и создай API ключ.

### 2. Деплой на GitHub Pages

```bash
git init
git add .
git commit -m "ThinkFlow v5.0"
git remote add origin https://github.com/YOUR_USER/thinkflow.git
git push -u origin main
```

В репозитории: **Settings → Pages → Source: GitHub Actions** (или `main` branch).

### 3. Используй

1. Открой `https://YOUR_USER.github.io/thinkflow/`
2. **Sign Up** — создай аккаунт + вставь API ключ
3. Опиши идею → **Сгенерировать план**
4. Добавь фидбек → **Улучшить**

---

## Технологии

| Слой | Технология |
|---|---|
| Frontend | Vanilla HTML/CSS/JS (no build step) |
| Шрифты | Outfit + JetBrains Mono |
| AI | Anthropic Claude Haiku 4.5 API |
| PWA | Service Worker + Web App Manifest |
| Auth | localStorage + WebAuthn (Face ID) |
| Голос | MediaRecorder API |
| Деплой | GitHub Pages (static) |

---

## Стоимость API

Claude Haiku 4.5: ~$0.002 за генерацию одного плана. 500 планов ≈ $1.

---

## Лицензия

MIT — свободное использование.

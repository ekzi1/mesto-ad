# Проектная работа: Место (валидация форм и сборка)

Интерактивная страница с карточками мест. Формы профиля, новой карточки и аватара проходят валидацию через класс `FormValidator`. Сборка — Webpack (стили PostCSS + Autoprefixer, JS через Babel).

## Запуск

```bash
npm install
```

**Режим разработки** (dev-server с hot-reload):

```bash
npm run dev
```

или с автоматическим открытием браузера:

```bash
npm start
```

**Сборка для продакшена** (папка `dist/`):

```bash
npm run build
```

Откройте `dist/index.html` через локальный сервер или задеплойте содержимое `dist` на хостинг (например, GitHub Pages).

## Структура

- `src/scripts/index.js` — точка входа и инициализация
- `src/scripts/components/FormValidator.js` — валидация полей и состояние кнопки отправки
- `src/scripts/utils/validation-config.js` — общие селекторы и классы для валидации
- `src/pages/index.css` — подключение стилей по БЭМ
- `index.html` — шаблон для `html-webpack-plugin`

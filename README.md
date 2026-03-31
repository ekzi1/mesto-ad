# Проектная работа: Место (валидация форм и сборка)

Интерактивная страница с карточками мест. Формы профиля, новой карточки и аватара проходят валидацию через класс `FormValidator`. Сборка — Webpack (стили PostCSS + Autoprefixer, JS через Babel).

**Макет Figma:** в проекте используются SVG, выгруженные из макета курса (локальная папка с материалами спринта «Mesto 8 Sprint»: логотип `logo.svg`, иконка редактирования `Edit Button.svg`, корзина `Trash.svg`). Полный интерактивный макет указан в уроке Практикума к этой проектной работе; общий файл курса по вёрстке и JS для «Место» часто доступен как [макет «Место» в Figma (курс JavaScript, типовой файл Практикума)](https://www.figma.com/file/2TZkEDbErFf2ZR5ZrRRVyS/JavaScript.-Sprint-11).

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

# Casus Belli — SVS DIGITAL s.r.o.

Корпоративный сайт для компании **Casus Belli** (юр. лицо: SVS DIGITAL s.r.o.) — современный одностраничный сайт в тёмной минималистичной эстетике.

## Стек

- Чистый HTML5 / CSS3 / Vanilla JavaScript — без сборщиков и фреймворков.
- Полностью отзывчивый (mobile / tablet / desktop).
- Анимации появления при скролле, плавная навигация, аккордеон FAQ, интерактивная контактная форма.

## Структура

```
casus-belli/
├── index.html       # Главная (и единственная) страница со всеми секциями
├── styles.css       # Стили — палитра, типографика, сетки, анимации
├── script.js        # Скролл-анимации, мобильное меню, FAQ-аккордеон, форма
└── README.md
```

## Запуск локально

Сайт статический, его можно открыть напрямую в браузере:

```
start index.html
```

Или поднять простой локальный сервер:

```powershell
# Python 3
python -m http.server 8080

# Node.js (если установлен http-server)
npx http-server -p 8080
```

Затем открыть `http://localhost:8080` в браузере.

## Контент

- Название: **Casus Belli**
- Юридическое лицо: **SVS DIGITAL s.r.o.**
- IČO (Company number): **29519136**
- Адрес: Nademlejnská 600/1, Hloubětín, 198 00 Praha 9
- Телефон: +420 605 933 873

## Деплой

Так как сайт полностью статический, его можно задеплоить на любой статический хостинг:

- GitHub Pages
- Netlify (drag-and-drop)
- Vercel
- Cloudflare Pages

Достаточно загрузить три файла: `index.html`, `styles.css`, `script.js`.

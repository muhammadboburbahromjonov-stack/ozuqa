# Ozuqa.org.uz

> O'zbekiston chorvachilarga ozuqa va yem yetkazib beruvchi kompaniya sayti.

15 yillik tajribaga ega chorvachilik mahsulotlari yetkazib beruvchisi. Sigir, qo'y, tovuq, quyon va boshqa chorva mollari uchun: **soya shrot**, **pista shrot**, **kungaboqar yog'i**, **raps yog'i**, **premikslar**.

## Texnologiyalar

- Toza **HTML / CSS / JavaScript** — framework yo'q
- **GSAP + ScrollTrigger** scroll va hero animatsiyalari uchun
- **CSS 3D transforms** — perspective bilan immersiv hero
- **Mobile-first responsive** dizayn

## Loyiha tuzilishi

```
ozuqa-uz/
├── index.html      # Asosiy sahifa (yagona sahifa)
├── styles.css      # Barcha uslublar
├── script.js       # Animatsiyalar va forma mantiqi
├── vercel.json     # Vercel deploy konfiguratsiyasi
├── DEPLOY.md       # Vercel deploy yo'riqnomasi
└── .gitignore
```

## Lokal ishga tushirish

Server kerak emas — `index.html` faylni brauzerda oching. Yoki:

```bash
# Python (3.x)
python -m http.server 8000

# Node (live-server bilan)
npx live-server
```

## Deploy

Vercel'ga deploy bo'yicha to'liq yo'riqnoma: [`DEPLOY.md`](./DEPLOY.md)

## ⚠️ Deploy oldidan to'ldirilishi kerak

| Joy | Hozir | Almashtirilsin |
|-----|-------|----------------|
| `index.html` | `+998 90 123 45 67` | Real telefon raqami |
| `index.html` | `info@ozuqa.org.uz` | Real email |
| `index.html` | `[ko'cha va uy raqami]` | Real manzil |
| `index.html` | `t.me/ozuqa_uz` | Real Telegram |
| `index.html` | `instagram.com/ozuqa.uz` | Real Instagram |
| `index.html` | `facebook.com/ozuqa.uz` | Real Facebook |
| `script.js` | `TELEGRAM_BOT_TOKEN = ''` | Bot token (@BotFather'dan) |
| `script.js` | `TELEGRAM_CHAT_ID = ''` | Chat ID |

## Litsenziya

Maxsus litsenziya — Ozuqa.org.uz uchun yaratilgan.

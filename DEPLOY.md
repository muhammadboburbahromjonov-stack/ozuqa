# Ozuqa.org.uz — Vercel Deploy yo'riqnomasi

## Tezkor variant: Drag & drop (5 daqiqa)

1. https://vercel.com/dashboard ga kiring
2. Mavjud loyihani oching: `prj_MP5pSymA1Sue8uh47AhgrVYZivso`
3. **Deployments** → o'ng yuqorida **"⋯ → Redeploy"** yoki bevosita brauzerga papkani sudrab tashlang
4. 1-2 daqiqada sayt yangi versiyada ishlay boshlaydi

## CLI variant (kelajakda qulayroq)

```bash
# 1. Node.js'ni o'rnating: https://nodejs.org (LTS)

# 2. Vercel CLI o'rnatish
npm install -g vercel

# 3. Saytga kirish va deploy
cd "C:\Users\ANUBIS\Desktop\Новая папка\ozuqa-uz"
vercel login
vercel link --project=prj_MP5pSymA1Sue8uh47AhgrVYZivso
vercel --prod
```

## Loyiha tuzilishi

```
ozuqa-uz/
├── index.html      ← Asosiy sahifa
├── styles.css      ← Barcha uslublar
├── script.js       ← GSAP animatsiyalar + mantiq
├── vercel.json     ← Deploy konfiguratsiyasi (security headers, caching)
└── DEPLOY.md       ← Bu fayl
```

## Maxsus domain bog'lash

1. Vercel Dashboard → Project → **Settings → Domains**
2. **"Add Domain"** ni bosing va `ozuqa.org.uz` ni kiriting
3. Vercel ko'rsatadigan DNS yozuvlarini (A va CNAME) domen registratoringizda qo'shing

## Tekshirish

Deploy'dan keyin bu URL'larni tekshiring:
- [ ] Bosh sahifa ochiladi
- [ ] Hero animatsiyasi ishlaydi (mahsulotlar portlaydi)
- [ ] Aloqa formasi to'g'ri ko'rinadi
- [ ] Mobile'da responsive

## Eslatma

Bu **statik HTML/CSS/JS** sayt — server-side rendering yoki API'lar yo'q. Shu sababli deploy bir necha soniya ichida ishga tushadi.

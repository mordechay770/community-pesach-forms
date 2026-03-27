# Pesach Form App

זהו בסיס הפרויקט לקוד הטופס.

## מבנה ראשוני

- `public/`
  קבצים סטטיים של האתר
- `public/assets/`
  תמונות, לוגו, אייקונים
- `netlify/functions/`
  פונקציות צד שרת

## הפונקציות הראשונות שנצטרך

- `load-form`
  מקבלת `token` ומחזירה payload לטופס
- `submit-form`
  מקבלת את נתוני הטופס, שומרת אותם, יוצרת PDF, וסוגרת token
- `health-check`
  בדיקת חיבור בסיסית

## קבצים ראשונים שנרצה בהמשך

- `public/index.html`
- `public/form.html`
- `public/app.js`
- `netlify/functions/load-form.js`
- `netlify/functions/submit-form.js`
- `netlify/functions/health-check.js`

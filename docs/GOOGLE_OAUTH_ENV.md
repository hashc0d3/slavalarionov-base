# Куда подставлять данные из Google Cloud Console (OAuth)

## Из настроек «Client ID for Web application»

| Что в консоли | Куда подставить | Переменная |
|---------------|-----------------|------------|
| **Client ID** (правая колонка, «Additional information») | `backend/.env` | `GOOGLE_CLIENT_ID=110412014284-q6duphib6a220nua56rmdnkosdmsb848.apps.googleusercontent.com` |
| Тот же **Client ID** | `frontend/.env.local` | `NEXT_PUBLIC_GOOGLE_CLIENT_ID=110412014284-q6duphib6a220nua56rmdnkosdmsb848.apps.googleusercontent.com` |
| **Client secret** | Не нужен в текущей схеме | Вход идёт через кнопку в браузере, бэкенд только проверяет `id_token` по Client ID |

## Authorized JavaScript origins (левая колонка, URIs)

У вас уже указаны `http://localhost:8081` и `http://localhost:8080` — этого достаточно, если фронт открывается на одном из этих портов (у вас всё идёт через 8081). Для продакшена добавьте, например: `https://ваш-домен.ru`.

## Authorized redirect URIs

`http://localhost:8081/auth/google/callback` в текущей реализации не используется: вход идёт через всплывающее окно Google и отправку `id_token` на `POST /api/auth/google`. Redirect URI нужен только если позже добавите серверный OAuth flow с редиректом.

## Дополнительно в backend

В `backend/.env` добавьте свой секрет для JWT (любая длинная случайная строка):

```
JWT_SECRET=ваш-длинный-секрет-для-подписи-jwt
```

Итого в `backend/.env` должны быть:

- `GOOGLE_CLIENT_ID` — уже есть
- `JWT_SECRET` — задайте свой
- `DATABASE_URL` — уже есть

В `frontend/.env.local`:

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — уже есть

После изменений перезапустите backend и frontend.

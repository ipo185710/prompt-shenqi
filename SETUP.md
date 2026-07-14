# 提示詞神器（MyPrompt.ai）部署步驟

這是一個可部署到 Vercel 的雲端版網站，使用 Supabase 提供登入與資料庫。

## 1. 建立 Supabase 專案

1. 登入 Supabase，建立新專案。
2. 開啟 SQL Editor。
3. 貼上並執行 `schema.sql`。
4. 前往 Project Settings → API。
5. 複製 Project URL 與 anon public key。
6. 打開 `config.js`，填入這兩個值。

## 2. 本機測試

不要直接雙擊 HTML，請在資料夾內啟動簡單伺服器：

```bash
python -m http.server 8080
```

然後打開：

```text
http://localhost:8080
```

## 3. 部署到 Vercel

最簡單方式：

1. 將整個資料夾上傳到 GitHub。
2. 在 Vercel 選擇 Add New → Project。
3. 匯入該 GitHub Repository。
4. Framework Preset 選 Other。
5. 直接 Deploy。

部署後會先得到一個免費網址，例如：

```text
https://myprompt-xxxx.vercel.app
```

## 4. 綁定 myprompt.ai

前提：你必須先向網域註冊商購買 `myprompt.ai`，而且該網域仍可註冊或可向持有人購買。

在 Vercel：

1. Project → Settings → Domains。
2. 輸入 `myprompt.ai`。
3. 依畫面指示，到網域註冊商設定 DNS。
4. DNS 生效後，Vercel 會自動提供 HTTPS。

## 注意

- `config.js` 中的 anon key 可公開在前端；安全性由 Supabase RLS 控制。
- 不要把 Supabase service role key 放進前端。
- 若開啟 Email confirmation，新帳號必須先點信箱驗證連結。

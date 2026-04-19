# Firebase 控制台設定手冊

這是一份幫助您在 Firebase 後台 (Firebase Console) 將所需環境設定完畢的詳細步驟。專案的程式碼已經處理好，只要您的後台開通好對應服務，專案就可以直接連線運作了。

---

## 步驟一：啟用 Google 登入 (Authentication)
您的專案使用的是 Google 帳號授權登入，請依下列指示開通：

1. 開啟並登入 [Firebase Console (控制台)](https://console.firebase.google.com/)。
2. 點選進入您的專案 `money-record`。
3. 在左側導覽列中找到「**Authentication**」(或 **建構 > Authentication**)，點擊進入。
4. 點擊「**開始使用 (Get Started)**」。
5. 切換到「**Sign-in method (登入方式)**」頁籤。
6. 在「新增提供商 (Add new provider)」列表中，選擇「**Google**」。
7. 在彈出的設定畫面中：
   - 將右上角的「**啟用 (Enable)**」開關打開。
   - 專案的公開名稱可以是 `money-record` 預設字眼。
   - 在底下選擇一個「**專案支援電子郵件 (Project support email)**」(通常是您的 Google 帳戶信箱)。
8. 點擊底部的「**儲存 (Save)**」按鈕。

*(現況檢查：完成此步驟後，專案就能正常讀取到您的 Google 登入帳號了)*

---

## 步驟二：建立資料庫 (Firestore Database)
專案裡負責儲存所有記帳資料的地方是 Firestore DB，開通方法如下：

1. 在 Firebase Console 左側導覽列中找到「**Firestore Database**」(或 **建構 > Firestore Database**)，點擊進入。
2. 點擊「**建立資料庫 (Create database)**」。
3. 系統會跳出安全性設定的選擇：
   - 請先選擇 **「以測試模式開始 (Start in test mode)」** (這會給您 30 天的完全授權，方便您先跑通流程與搬移資料，我們之後可以再回來加強安全規則)。
   - 點擊「**下一步 (Next)**」。
4. 選擇資料庫的位置 (Location)：
   - 如果您人在台灣，建議選擇下拉單中的 **`asia-east1` (台灣)** 或 `asia-northeast1` (東京)。資料庫位置選在越近的地方，讀取越快。(注意：選定後無法更改)。
   - 點擊「**啟用 (Enable)**」。
5. 等待幾秒鐘系統建立完成。畫面會出現一個空的資料集合頁面。

*(現況檢查：完成此步驟後，程式碼裡面的新增、修改、刪除帳戶等功能就能存進這個資料庫了)*

---

## 步驟三：取得搬移資料用的「服務金鑰」 (Service Account JSON)
我們為您寫了一個可以用來將 Supabase 資料無痛搬移至 Firebase 的指令碼，這需要一把系統管理員等級的隱藏鑰匙：

1. 在 Firebase Console 畫面左上角找「**齒輪圖示 ⚙**」(專案總覽 Project Overview 旁邊)，點選「**專案設定 (Project settings)**」。
2. 在頂部的頁籤清單中，點選「**服務帳戶 (Service accounts)**」。
3. 頁面中間會看到「Firebase Admin SDK」的區塊。
4. 確保選擇了「Node.js」，接著點選下方的「**產生新的私鑰 (Generate new private key)**」按鈕。
5. 警告畫面跳出，點選「**產生金鑰 (Generate key)**」。
6. 此時會下載一個附檔名為 `.json` 的檔案到您的電腦裡。

---

## 步驟四：實際執行搬移資料指令 (選做，若您需要舊資料)

在剛剛做完步驟三後，我們要在本機執行遷移流程：

1. 將剛剛下載的那一份 JSON 檔案，複製或拖曳放到您的專案根目錄 (與 `package.json` 同一層目錄)，並立刻將這個檔案重新命名為：**`firebase-service-account.json`**。
2. 打開您的專案 VSCode，找到並打開檔案 `scripts/migrate-to-firebase.js`。
3. 在這份檔案的最上方第 8 行和第 9 行，貼入您的 Supabase 的 `Url` 以及 `Service Role Key`：
   ```javascript
   const SUPABASE_URL = "您的 Supabase Project URL";
   // ⚠️ 請不要用 ANON KEY，請從 Supabase 後台 Project Settings -> API 找到 "service_role" 對應的那串數值
   const SUPABASE_KEY = "您的 Supabase Service Role Key"; 
   ```
4. 開啟終端機 (Terminal)，確定路徑在您專案的根目錄 `moneyrecord` 內，輸入並送出：
   ```bash
   node scripts/migrate-to-firebase.js
   ```
5. 若螢幕印出 `🎉 所有資料遷移完成！` 即刻完成遷移。此時你可以將剛才那份 `firebase-service-account.json` 刪除（因為它是最高權限金鑰，建議不要留在專案內或推上 Git）。

---
**🎉大功告成！** 
您現在可以在終端機輸入 `npm run dev` 啟動專案，就能直接體驗已經是綁定 Firebase 心臟的系統了。

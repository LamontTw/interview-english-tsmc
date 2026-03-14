# Interview English TSMC - 面試英文練習 SPA

## 專案設定

- **Spec-driven**: 啟用
- **框架**: 純 HTML/CSS/JS（無框架），`file://` 可直接開啟
- **資料結構**: `data/*.js` 全域變數（COURSE_DATA, PREP_DATA, RESOURCES_DATA）
- **模組架構**: `js/` 下按功能拆分（home, lessons, intro, behavioral, youtube, glossary, flashcard）
- **共用工具**: `js/utils.js`（copyText, speak, dictUrl, showSection, vocabRow, esc, escAttr, findById, progress tracking）

## 音訊設計模式

所有發音資源**預先生成**，存為本地檔案，前端直接播放，不做即時 API 呼叫。

### 單字發音
- **來源**: 劍橋字典 MP3（真人發音，免費）
- **存放**: `audio/words/{word}.mp3`
- **抓取方式**: Node.js 腳本爬劍橋字典頁面，解析 `<source>` 標籤取得 MP3 URL 下載

### 例句發音
- **來源**: OpenAI TTS API（tts-1 模型）
- **存放**: `audio/sentences/{word}.mp3`
- **成本**: ~$0.27 / 192 句（18,317 字元）
- **生成方式**: Node.js 腳本批次呼叫 OpenAI API，每次一句

### 擴增教學內容時
新增 vocabulary 時，同步執行：
1. 用劍橋字典腳本抓新單字的 MP3
2. 用 OpenAI TTS 腳本生成新例句的 MP3
3. 前端 `speak()` 函數優先播放本地音檔，fallback 到 Web Speech API

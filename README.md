## Luxury Web Player
Uses VK and LastFM API

![](http://habrastorage.org/files/5ab/a68/2af/5aba682af6be4d2b90d2430d70773002.PNG)


## Installation for Linux
1. `git clone https://github.com/suinly/luxury.git`
2. `cd ./luxury && cp config.json.example config.json && vi config.json`
3. Edit application settings: `app.port`, `vk.app_id`, `vk.app_secret`, `vk.redirect_url` and `lastfm.api_key`
4. Install nodejs modules: `npm install`
5. Run: `node app.js`

# vue3-music-study

## 技术栈

- Vue3 + Vuex + Vue-Router
- Sass
- [BetterScroll 2.x](https://better-scroll.github.io/docs/en-US/)
- axios

## 项目使用
```
git clone https://github.com/aexiaosong/vue3-music-study.git
cd vue3-music-study
npm install
npm run serve
```

## 项目介绍
本项目为手机端的项目，如果在浏览器中打开项目需求切换到移动设备页面。本项目支持两个音乐平台的接口，通过 `src/service/base.js` 中的 `flag` 变量来控制，如果该值为true则使用网易云音乐接口（需要自行在本地部属[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)），反之使用QQ音乐接口（通过给webpack的devServer添加BeforeSetupMiddleware来实现接口拦截）。


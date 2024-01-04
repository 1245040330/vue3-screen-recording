/*
 * @Author: 1245040330 32012815+1245040330@users.noreply.github.com
 * @Date: 2023-09-16 10:34:31
 * @LastEditors: 1245040330 32012815+1245040330@users.noreply.github.com
 * @LastEditTime: 2024-01-04 15:14:21
 * @FilePath: \vue3-cl-live-video\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import "./main.css"
import 'ant-design-vue/dist/reset.css';

createApp(App).use(ElementPlus, {
    locale: zhCn
}).mount('#app');


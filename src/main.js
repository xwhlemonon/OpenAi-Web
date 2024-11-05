import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from "axios";

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';


const app = createApp(App);
app.use(ElementPlus, {locale: zhCn});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(store).use(router).mount('#app');


const BASE_URL = "http://www.hhr-love-xwh.top";
window.BASE_URL = BASE_URL;
app.config.globalProperties.BASE_URL = BASE_URL;


const debounce = (fn, delay) => {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
    }
}

import Vue from 'vue';
import App from './App';

// 路由集合
import router from './config/router';

// http 模块
import axios from './config/axios';
Vue.use(axios, {
    // baseURL: "http://api.cjb789.com",
    // baseURL: "http://test.cjb789.com",
    // baseURL: "http://back.7178861.com",

    baseURL: "https://www.gyclit.top/gyclit-web",
    // baseURL: "http://192.200.200.21:9000/gyclit-web",
    // baseURL: "http://www.gzwnks.com/sbb-web",
    // baseURL:'/api',
<<<<<<< HEAD
    timeout: 1000000,
=======
    timeout: 100000,
>>>>>>> 34ad4763d179edfa949912d10c090af647b05e78
    withCredentials: true,
});

// 公共事件监听器
import eventHub from './config/eventHub';   
Vue.use(eventHub);

// 公共数据
import globalMethods from './config/globalMethods';
Vue.use(globalMethods);

// touch 手势
import VueTouch from 'vue-touch';
Vue.use(VueTouch, { name: 'v-touch' });

// iconfont
import './assets/font/iconfont.css';

// Mint UI
import 'mint-ui/lib/style.css';
import Mint from 'mint-ui';
Vue.use(Mint);


// vue字体库
import 'vue-awesome/icons'; //css (总大小486kb)
// import './config/vue-awesome-icons' //按需引入
import Icon from 'vue-awesome/components/Icon'; //核心组件
Vue.component('icon', Icon);

// 自定义全局指令
import directive from './config/directive';
Vue.use(directive);

// 自定义全局组件,请放到components/ 并以ui-开头命名
import components from './config/components';
Vue.use(components);

// 数据保持
import dataStorage from './config/data-storage'
Vue.use(dataStorage)

// 解决移动端300ms click延迟
import FastClick from 'fastclick'
FastClick.attach(document.body)

import utils from './config/utils';
Vue.prototype.utils = utils;

// 自定义全局样式
import '@/scss/base.scss'; //基础布局样式
import '@/scss/ui.scss'; //ui样式,必须以 "ui-" 开头,例如: ui-block, ui-color
import '@/scss/rewrite.scss'; //重构的样式,对原本框架进行修改
import '@/scss/vue-transition.scss'; //vue的过渡动画


Vue.prototype.usertype = '1'

// 创建vue根实例
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})

export default [
    {
        path: '/login',
        name: '登录',
        component: require('@/views/login'),
    },
    {
        path: '/regist',
        name: '注册',
        component: require('@/views/regist'),
    },
    {
        path: '/home',
        name: '首页',
        component: require('@/views/home'),
    },
    {
        path: '/rank',
        name: '排名',
        component: require('@/views/rank'),
    },
    {
        path: '/question',
        name: '做题',
        component: require('@/views/question'),
    },
    {
        path: '/news',
        name: '新闻',
        component: require('@/views/news'),
    },
    {
        path: '/allrank',
        name: '全市排名',
        component: require('@/views/allrank'),
    }
]

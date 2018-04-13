export default [

    {
        path: '/home-jishi',
        name: '首页-技师',
        component: require('@/views/技师版/home'),
        children: [
            {
                path: '/order-js-details',
                name: '技师订单详情',
                component: require('@/views/技师版/技师订单详情'),
                children: [
                    {
                        path: '/jsmapLocation',
                        name: '技师地址',
                        component: require('@/views/技师版/jsmapLocation'),
                    },
                ]
            },
            {
                path: '/jishi-order-num-details',
                name: '技师-订单号详情',
                component: require('@/views/技师版/技师订单号详情'),
            },
        ]
    },
    
    {
        path: '/jishi-center',
        name: '技师-个人中心',
        component: require('@/views/技师版/个人中心'),
    },

    {
        path: '/addgoodmessage',
        name: '技师-添加商品',
        component: require('@/views/技师版/添加商品'),
    },
    
    {
        path: '/dingdanshouyi',
        name: '技师-订单收益',
        component: require('@/views/技师版/订单收益'),
        children:[
            {
                path: '/orderDetails',
                name: '技师-订单详情',
                component: require('@/views/技师版/订单详情'),
            }
        ]
    },
    {
        path: '/person-center-edit',
        name: '技师-个人资料完善',
        component: require('@/views/技师版/个人资料完善'),
    },
    {
        path: '/wangongqueren',
        name: '完工确认',
        component: require('@/views/技师版/完工确认'),
        children:[
            {
                path: '/suojushangchen',
                name: '锁具商城',
                component: require('@/views/技师版/锁具商城'),
            },
        ]
    },
    
 
    
]
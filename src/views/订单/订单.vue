<style lang="scss">
    .list-card{
        background-color: white;
        box-shadow: 0 .0625rem .375rem rgba(0, 0, 0, .06), 0 .0625rem .25rem rgba(0, 0, 0, .06);
        padding: 0.5rem;
        padding-right: 0;
        margin: 0.3rem;
        margin-bottom: 1rem;
    }
    .ui-card{
        .mint-cell{
            margin-left: 0.5rem;
        }
    }
</style>
<template>
    <ui-main>
        <mt-header title="订单" slot="header">
        </mt-header>

        <mt-navbar v-model="tab" slot="header">
            <mt-tab-item id="1">当前订单</mt-tab-item>
            <mt-tab-item id="2">历史订单</mt-tab-item>
        </mt-navbar>
    
        <!-- tab-container -->
        <mt-tab-container v-model="tab">
            <!-- 当前订单 -->
            <mt-tab-container-item id="1">
                <div  class="ui-card pr0 pl0 mb05" v-for="item in currentShowList">
                        <order-list label="订单号"  :tag-color="item.process_stage == '06' ? '#EEAD0E' : '#26a2ff'"  :tag="item.process_stage_str">{{item.order_no}}</order-list>
                        <order-list label="时间">{{item.create_time_ttr}}</order-list>
                        <order-list label="类别">{{item.data_name + ' - ' + item.service_item}}</order-list>
                        <!-- <order-list label="类别">{{item.service_type_name + ' - ' + item.service_item}}</order-list> -->
                        <order-list label="服务地址">{{item.service_address}}</order-list>
                        <order-list label="接单技师" v-if="item.process_stage != '01' && item.process_stage != '02'">{{item.process_person_name}}</order-list>
                        <order-list label="报价" class="border-none">
                            <span class="ui-rmb f12 f-color-orange">{{item.total_price}}</span>
                        </order-list>
                        <mt-cell title="查看详情" is-link @click.native="goDetails(item.id)"></mt-cell>
                        <mt-button v-if="item.process_stage == '06'" type="primary" class="ui-button-large mt05" @click="orderPayRequest(item)">去支付</mt-button>
                </div>
            </mt-tab-container-item>

            <!-- 历史订单 -->
            <mt-tab-container-item id="2" >
                <div v-if="tab==2" v-infinite-scroll="loadMoreHistory" infinite-scroll-disabled="historyLoadFinished">
                    <div class="ui-card pr0 pl0 mb05" v-for="item in historyShowList">
                        <order-list label="订单号" tag-color="#26a2ff" :tag="item.process_stage_str">{{item.order_no}}</order-list>
                        <order-list label="时间">{{item.create_time_ttr}}</order-list>
                        <order-list label="类别">{{item.data_name + ' - ' + item.service_item}}</order-list>
                        <order-list label="服务地址">{{item.service_address}}</order-list>
                        <order-list label="接单技师">{{item.process_person_name}}</order-list>
                        <order-list label="报价" class="border-none">
                            <span class="ui-rmb f12 f-color-orange">{{item.total_price}}</span>
                        </order-list>
                        <mt-cell title="查看详情" is-link @click.native="goDetails(item.id)"></mt-cell>
                        <mt-button v-if="item.process_stage == '07'" type="primary" class="ui-button-large mt05" @click="orderComment(item)">去评价</mt-button>
                    </div>
                    <ui-loadmore v-if="!historyLoadFinished"></ui-loadmore>
                </div>
            </mt-tab-container-item>
        </mt-tab-container>

        <ui-bottom-bar slot="footer"></ui-bottom-bar>

        <!-- 弹出层 -->
        <ui-page v-model="coupunPage" title="我的卡券" slot="popup">
            <div class="pt05">
                <couponList :data.sync="couponItem" :popup.sync="coupunPage"></couponList>
            </div>
        </ui-page>
    </ui-main>
</template>

<script>
    import orderList from './order-list.vue'
    import couponList from '../个人中心/我的卡券.vue'
    export default {
        components: {
            orderList,
            couponList
        },
        data () {
            return {
                tab:'1',
                historyList:[],
                historyShowList:[],
                historyTotal:0,
                historyLoadFinished:false,
                currentShowList:[],
                pagenum:10,//每次加载条数,
                coupunPage:false,
                couponItem:'',
                orderId:'',
                uid:'',
            }
        },
        methods: {
            goDetails(id){
                this.$router.push({
                    name:'订单详情',
                    query:{
                        id:id
                    }
                })
            },
            loadMoreHistory(){
                setTimeout(()=> {
                    if (this.historyShowList.length>=this.historyTotal) {
                        this.historyLoadFinished = true
                    }else{
                         this.historyLoadFinished = false
                        let cur =  this.historyShowList.length
                        for (var index =cur; index <cur + this.pagenum ; index++) {
                            if(index < this.historyTotal){
                                    this.historyShowList.push(this.historyList[index])
                            }
                        }
                    }
                }, 1000);
            },
            orderPayRequest(userOrder){
                this.orderId = userOrder.id
                this.$http.post('/phone/userinfor/getUserCoupon',{
                    uid:this.uid,
                    is_able:'1'
                })
                .then(({data})=>{
                    this.$indicator.close()
                    if(data.code == '1' && data.content.length>0){
                        this.$messagebox.confirm('您有卡券可抵部分费用，使用卡券?').then(action => {
                            if (action == 'confirm') {
                                this.coupunPage = true
                            }
                        }).catch(() => {
                            this.orderPay(userOrder,{})
                        })
                    }else{
                        this.orderPay(userOrder,{})
                    }
                }).catch(() => {
                    this.$indicator.close()
                    this.$messagebox.alert('系统繁忙')
                })
            },
            orderPay(userOrder,couponItem) {
                
                // 先获取本地IP地址 http://pv.sohu.com/cityjson?ie=utf-8
                /* this.$axios({
                    method:'POST',
                    url: 'http://pv.sohu.com/cityjson?ie=utf-8',
                }).then(({data}) => {
                    this.$indicator.close()
                    let resultStr = data

                    resultStr = resultStr.replace('var returnCitySN = ', '')

                    resultStr = resultStr.replace(';', '')
                    let obj = JSON.parse(resultStr)

                    console.log('ipContent = ' + resultStr);
                    
                }).catch(() => {
                    this.$indicator.close() 
                    this.$messagebox.alert('系统繁忙')
                    console.log('err22222222');
                    console.log(err);
                }) */

                // 订单支付
                let formData = new FormData();
                let cip = localStorage.getItem('cip')
                formData.append('orderId', userOrder.id);
                formData.append('cip', cip);
                formData.append('coupon_type', couponItem.coupon_type==undefined?'':couponItem.coupon_type);
                formData.append('coupon_price', couponItem.coupon_price==undefined?0.0:couponItem.coupon_price);
                this.$axios({
                    method:'POST',
                    url: '/phone/openkey/h5xiadan',
                    data: formData,
                }).then(({data}) => {
                    this.$indicator.close()
                    if(data.code == '1'){
                        let dataAr = data.content;
                        if (dataAr.length > 0) {
                            if (!this.utils.isBlank(couponItem.id)) {
                                insertCouponId2Order(userOrder.id,couponItem.id);
                            }
                            let orderRes = dataAr[0];
                            console.log('111111111');
                            console.log(orderRes);
                            let mweb_url = orderRes.mweb_url;
                            let prepay_id = orderRes.prepay_id;
                            let realPrice = orderRes.realPrice;
                            realPrice = realPrice / 100
                            console.log(dataAr);

                            // 跳转支付界面
                            let webUrlAr = mweb_url.split("?")
                            let out_trade_no = userOrder.out_trade_no;
                            let orderId = userOrder.id;
                            let locationUrl = "https://www.gzwnks.com/sbb-web/upload/pay.jsp?" + webUrlAr[1] + "&realPrice=" + realPrice + "&orderId=" + orderId + "&out_trade_no=" + out_trade_no;

                            /* -------------------- 是否android ----------------------- */
                            let ISANDROID = false

                            if (ISANDROID) {
                                locationUrl = "https://www.gzwnks.com/sbb-web/upload/pay.jsp?" + webUrlAr[1] + "&realPrice=" + realPrice + "&orderId=" + orderId + "&out_trade_no=" + out_trade_no;
                            } else {
                                locationUrl = "https://www.gzwnks.com/sbb-web/upload/payuser.jsp?" + webUrlAr[1] + "&realPrice=" + realPrice + "&orderId=" + orderId + "&out_trade_no=" + out_trade_no;
                            }

                            if (ISANDROID) {
                                // 采用ThemeableBrowser方式跳转 
                                cordova.ThemeableBrowser.open(locationUrl, '_blank', {  
                                    statusbar: {  
                                        color: '#ff6c00'  
                                    },  
                                    toolbar: {  
                                        height: 44,  
                                        color: '#ff6c00'  
                                    },  
                                    title: {  
                                        color: '#FFFFFF',  
                                        showPageTitle: true,  
                                        staticText: '微信支付'  
                                    },  
                                    closeButton: {  
                                        image: 'close',  
                                        imagePressed: 'close_pressed',  
                                        align: 'left',  
                                        event: 'closePressed',
                                        padding: '10px'
                                    } 
                                }).addEventListener('closePressed', function (e) {  
                                    // 当前订单
                                    // alert("dsjhdjshjds")
                                    that.getNewestOrders();
                                }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function (e) {  
                                    console.error(e.message);  
                                }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function (e) {  
                                    console.log(e.message);  
                                });
                            } else {
                                this.$router.push({
                                    name:'订单支付',
                                    query:{
                                        mweb_url:locationUrl
                                    }
                                })
                            }

                            /* // 采用cordovainappbrower方式跳转
                            let inAppBrowserRef = cordova.InAppBrowser.open(locationUrl, '_blank', 'location=no');

                            // 打开加载完成cordova内置浏览器之后自动关闭
                            inAppBrowserRef.addEventListener('loadstop', function (params) {
                                inAppBrowserRef.close();
                            }); */
                        }
                    }
                }).catch((err) => {
                    this.$indicator.close() 
                    this.$messagebox.alert('系统繁忙')
                    console.log('err111111');
                    console.log(err);
                })
            },
            getPayCip() {
                this.$axios({
                    method:'POST',
                    url: 'http://pv.sohu.com/cityjson?ie=utf-8',
                }).then(({data}) => {
                    this.$indicator.close()
                    let resultStr = data

                    resultStr = resultStr.replace('var returnCitySN = ', '')

                    resultStr = resultStr.replace(';', '')
                    // {"cip": "117.135.212.97", "cid": "520000", "cname": "贵州省"}
                    let obj = JSON.parse(resultStr)
                    localStorage.setItem('cip', obj.cip)

                }).catch(() => {
                    this.$indicator.close() 
                })
            },
            orderComment(order){
                this.$router.push({
                    name:'评价',
                    query:{
                        item:JSON.stringify(order)
                    }
                })
            },
            getNewestOrders() {
                let usrdata =  localStorage.getItem('userdata')
                if (usrdata != null) {
                    usrdata = JSON.parse(usrdata).content[0]
                }else{
                    this.$messagebox.alert('请先登录')
                    return
                }
                this.$http.post('/phone/openkey/getUserOrders', {
                    uid: usrdata.id,
                    status: "('01','02','03','04','05','06')"
                }).then(({ data }) => {
                    if(data.code == '1'){
                        this.currentShowList = data.content
                        console.log(data.content);
                    }
                }).catch(() => {
                    this.$messagebox.alert('系统繁忙')
                }) 
            },
            insertCouponId2Order(order_id,coupon_id){
                this.$http.post('/phone/openkey/updateOrderCouponId',{
                    orderId:order_id,
                    couponId:coupon_id
                })
                .then(({data})=>{
                    this.$indicator.close()
                    if(data.code != '1'){
                        this.$messagebox.alert('订单关联卡券信息失败');
                    }
                }).catch(() => {
                    this.$indicator.close()
                    this.$messagebox.alert('系统繁忙')
                })
            }

        },

        mounted(){
            console.log('胡汉三又回来了');
            let usrdata =  localStorage.getItem('userdata')
            if (usrdata != null) {
                usrdata = JSON.parse(usrdata).content[0]
            }else{
                this.$messagebox.alert('请先登录')
                return
            }
            this.getPayCip()
            // 模拟历史订单数据
            this.$axios().then(({config})=>{
                this.baseUrl = config.baseURL
            })
            this.uid = usrdata.id
            // 当前订单
            this.$http.post('/phone/openkey/getUserOrders', {
                uid: usrdata.id,//'404848955d92aaec015d92af2bfa0004'
                status: "('01','02','03','04','05','06')"
            }).then(({ data }) => {
                this.$indicator.close()
                console.log('当前结果:', data);
                if(data.code == '1'){
                    this.currentShowList = data.content
                }
            }).catch(() => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })

            // 历史订单
            this.$http.post('/phone/openkey/getUserOrders', {
                uid: usrdata.id,//'404848955d92aaec015d92af2bfa0004'
                status: "('07','08')"
            }).then(({ data }) => {
                this.$indicator.close()
                console.log('历史结果:', data);
                if(data.code == '1'){
                    this.historyList = data.content
                    this.historyTotal = data.content.length
                    // this.historySeen = (this.historyList.length > 0 ? true:false)
                }
            }).catch(() => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
        },

        watch: {
            coupunPage(){
                if(this.coupunPage){
                    // this.orderPay(this.orderId,{})
                }else{
                    if(this.couponItem.length>0){
                        this.orderPay(this.orderId,JSON.parse(this.couponItem))
                    }else{
                        this.orderPay(this.orderId,{})
                    }
                }
                this.couponItem = ''
            }
        }
    }
</script>

<style lang="scss">
.scoped-home-jishi {
    .mint-tabbar {
        position: relative;
        .fa-icon {
            display: block;
            margin: 0 auto;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }
    }
    .mint-header {
        box-shadow: none;
    }
    .mt05 {
        .bgblack {
            border: 20rpx solid #efefef;
            border-radius: 0.4rem;
        }
    }
}
</style>
<template>
    <ui-main class="scoped-home-jishi">
        <mt-header slot="header" title="锁帮帮技师">
        </mt-header>
        <router-link tag="div" to="/jishi-center" class="flex col-center p05" slot="header" style="background:rgba(255, 108, 0, 0.9);">
            <ui-img :src="userhead" size="2.5" class="mr05 bg-grey ui-circle"></ui-img>
            <span class="f-color-white">{{username}}</span>
        </router-link>
        <div slot="header">
            <div class="f-color-orange flex col-center p05 bg-white ui-border-bottom">
                共接单: {{orderAllCount}}
            </div>

            <!-- tab -->
            <mt-tabbar v-model="tab" class="ui-border-bottom">
                <mt-tab-item id="待接单">
                    <icon name="history"></icon>
                    待接单
                </mt-tab-item>
                <mt-tab-item id="已接单">
                    <icon name="hourglass-start"></icon>
                    已接单
                </mt-tab-item>
                <mt-tab-item id="开工中">
                    <icon name="hand-lizard-o"></icon>
                    开工中
                </mt-tab-item>
                <mt-tab-item id="待支付">
                    <icon name="yen"></icon>
                    待完成
                </mt-tab-item>
                <mt-tab-item id="已完成">
                    <icon name="check-square-o"></icon>
                    已完成
                </mt-tab-item>
            </mt-tabbar>

        </div>
        <!-- tab内容 -->
        <div class="mt05 mb05">
            <div v-if="tab=='待接单'" v-for="item in jsDetailVosOne" class="bg-white mt05 mr05 ml05 bgblack">
                <order-list label="订单号">{{item.order_no}}</order-list>
                <order-list label="发起时间">{{item.create_time}}</order-list>
                <order-list label="服务类别">{{item.service_type_name}}</order-list>
                <order-list label="服务地址">{{item.service_address}}</order-list>
                <order-list label="服务时间">{{item.service_time_describe}}</order-list>
                <!-- <order-list label="报价" class="border-none">
                                                                                <span class="ui-rmb f12 f-color-orange">250</span>
                                                                            </order-list> -->
                <order-list label="查看详情" label-dark is-link :to="{name:'技师订单详情', query:{
                    order_id:item.order_id,
                    tabstr:tab,
                    orderStatus: item.current_status
                }}"></order-list>

                <div class="pt1 pb1">
                    <mt-button @click="bindItemClick(item)" v-if="item.current_status == 01 && userstatus == '1'" class="ui-button-large ui-bg-gradient">抢单</mt-button>
                    <mt-button @click="bindItemClick(item)" v-if="item.current_status == 03 && userstatus == '1'" class="ui-button-large ui-bg-gradient">接单</mt-button>
                </div>
            </div>

            <div v-if="tab=='已接单'" v-for="item in jsDetailVosTwo" class="bg-white mt05 mr05 ml05 bgblack">
                <order-list label="订单号">{{item.order_no}}</order-list>
                <order-list label="发起时间">{{item.create_time}}</order-list>
                <order-list label="服务类别">{{item.service_type_name}}</order-list>
                <order-list label="服务地址">{{item.service_address}}</order-list>
                <order-list label="服务时间">{{item.service_time_describe}}</order-list>
                <order-list label="下单顾客">{{item.user_name}}</order-list>
                <order-list label="报价" class="border-none">
                    <span class="ui-rmb f12 f-color-orange">{{item.tatal_price}}</span>
                </order-list>
                <order-list label="查看详情" label-dark is-link :to="{name:'技师订单详情', query:{
                    order_id:item.order_id,
                    tabstr:tab,
                    orderStatus: item.current_status
                }}"></order-list>

                <div class="pt1 pb1">
                    <mt-button @click="bindItemClick(item)" class="ui-button-large ui-bg-gradient">开工</mt-button>
                </div>
            </div>

            <div v-if="tab=='开工中'" v-for="item in jsDetailVosThree" class="bg-white mt05 mr05 ml05 bgblack">
                <order-list label="订单号">{{item.order_no}}</order-list>
                <order-list label="发起时间">{{item.create_time}}</order-list>
                <order-list label="服务类别">{{item.service_type_name}}</order-list>
                <order-list label="服务地址">{{item.service_address}}</order-list>
                <order-list label="服务时间">{{item.service_time_describe}}</order-list>
                <order-list label="下单顾客">{{item.user_name}}</order-list>
                <order-list label="报价" class="border-none">
                    <span class="ui-rmb f12 f-color-orange">{{item.tatal_price}}</span>
                </order-list>

                <order-list label="查看详情" label-dark is-link :to="{name:'技师订单详情', query:{
                    order_id:item.order_id,
                    tabstr:tab,
                    orderStatus: item.current_status
                }}"></order-list>

                <div class="pt1 pb1">
                    <mt-button @click="bindItemClick(item)" class="ui-button-large ui-bg-gradient">完工</mt-button>
                </div>
            </div>

            <div v-if="tab=='待支付'" v-for="item in jsDetailVosFour" class="bg-white mt05 mr05 ml05 bgblack">
                <order-list label="订单号">{{item.order_no}}</order-list>
                <order-list label="发起时间">{{item.create_time}}</order-list>
                <order-list label="服务类别">{{item.service_type_name}}</order-list>
                <order-list label="服务地址">{{item.service_address}}</order-list>
                <order-list label="服务时间">{{item.service_time_describe}}</order-list>
                <order-list label="下单顾客">{{item.user_name}}</order-list>
                <order-list label="报价" class="border-none">
                    <span class="ui-rmb f12 f-color-orange">{{item.tatal_price}}</span>
                </order-list>
                <order-list label="完工时间">{{item.process_time}}</order-list>
                <order-list label="查看详情" label-dark is-link :to="{name:'技师订单详情', query:{
                    order_id:item.order_id,
                    tabstr:tab,
                    orderStatus: item.current_status
                }}"></order-list>

                <div class="pt1 pb1" v-if="item.pay_type=='2'">
                    <mt-button @click="bindItemClick(item)" class="ui-button-large ui-bg-gradient">去支付</mt-button>
                </div>
            </div>
            <div v-if="tab=='已完成'" v-for="item in jsDetailVosFive" class="bg-white mt05 mr05 ml05 bgblack" v-infinite-scroll="loadTab1" infinite-scroll-disabled="tab1loading">
                <order-list label="订单号">{{item.order_no}}</order-list>
                <order-list label="发起时间">{{item.create_time}}</order-list>
                <order-list label="服务类别">{{item.service_type_name}}</order-list>
                <order-list label="服务地址">{{item.service_address}}</order-list>
                <order-list label="服务时间">{{item.service_time_describe}}</order-list>
                <order-list label="下单顾客">{{item.user_name}}</order-list>
                <order-list label="报价" class="border-none">
                    <span class="ui-rmb f12 f-color-orange">{{item.tatal_price}}</span>
                </order-list>
                <order-list label="完工时间">{{item.process_time}}</order-list>
                <order-list  label="查看详情" label-dark is-link :to="{name:'技师订单详情', query:{
                    order_id:item.order_id,
                    tabstr:tab,
                    orderStatus: item.current_status
                }}"></order-list>
                <ui-loadmore v-if="tab1loading"></ui-loadmore>
            </div>
        </div>

        <statusBtnGroup v-on:sendStatus="childChangeStatus" :userSta='userstatus' slot="footer"></statusBtnGroup>

        <!-- 弹窗输入框 -->
        <mt-popup slot="popup" v-model="complatePopup" popup-transition="popup-fade">
            <div style="width:80vw">
                <div class="f09 text-center mt1">请完善信息</div>
                <div class="m1">
                    <input type="text" v-model="idcardNo" placeholder="请输入身份证号" class="f07 p05 w-100 block ui-border mb05">
                    <input type="text" v-model="driveCard" v-if="isNeed == '2'" placeholder="请输入驾驶证号" class="f07 p05 w-100 block ui-border mb05">
                    <input type="text" v-model="carCard" v-if="isNeed == '2'" placeholder="请输入行驶证号" class="f07 p05 w-100 block ui-border mb05">
                    <input type="text" v-model="otherCard" placeholder="请输入其他信息" class="f07 p05 w-100 block ui-border">
                </div>
                <div class="ui-border-top flex f08">
                    <div @click="complatePopup=false" class="flex-1 flex row-center p05 col-center ui-border-right">取消</div>
                    <div @click="workComplate()" class="flex-1 flex row-center p05 col-center f-color-orange">确认</div>
                </div>
            </div>

        </mt-popup>
        <iframe id="geoPage" width=0 height=0 frameborder=0 style="display:none;" scrolling="no" src="https://apis.map.qq.com/tools/geolocation?key=NONBZ-2VT33-DOI3A-35PVY-CZ7M6-ZRBFR&referer=锁帮帮">
        </iframe>

    </ui-main>
</template>

<script>
import orderList from '@/views/订单/order-list.vue'
import statusBtnGroup from './接单状态'
var timer = null;
export default {
    components: {
        orderList,
        statusBtnGroup
    },
    data() {
        let self = this;

        return {
            tab: '待接单',
            complatePopup: false,
            idcardNo: '',
            otherCard: '',
            carCard: '',
            driveCard: '',
            username: '',
            userhead:'',
            orderAllCount: 0,
            jsDetailVosOne: [],
            jsDetailVosTwo: [],
            jsDetailVosThree: [],
            jsDetailVosFour: [],
            jsDetailVosFive: [],
            loaded: true,
            userstatus: '1',
            pageCount: 3,
            pageNum: 0,
            tab1loading: false,
            hasMore: true,
            jsonclStrTemp: '',
            jsonStrTemp: '',
            isNeed: '0',
            tempOrderId: '',
            isCommitSuccess: false
        }
    },

    mounted() {
        if (this.utils.isNotBlank(this.$route.query.remTab)) {
            this.tab = this.$route.query.remTab;
        } else {
            if(this.utils.isNotBlank(localStorage.getItem('tabPos'))) {
                this.tab = localStorage.getItem('tabPos')
                // alert(this.tab)
            }
        }

        if (this.$route.query.isCommitSuccess) {
            var status = this.$route.query.orderstatus;
            if (status == '4') {
                this.tab = '待支付'
            } else if (status == '5') {
                this.tab = '已完成'
            }
        } else {

        }
        this.getPayCip()
        this.initMap()
        var userDataTemp = localStorage.getItem('userdata')
        userDataTemp = JSON.parse(userDataTemp)
        if (!this.utils.isObject(userDataTemp)) {
            this.$toast('获取用户信息失败,请稍后重试...')
            return
        }
        this.hasPerfectPersonalInfor(userDataTemp)
        if (this.utils.isObject(userDataTemp)) {

            if (this.utils.isBlank(userDataTemp.content[0].name)) {
                var phone = localStorage.getItem('phone')
                if (this.utils.isNotBlank(phone)) {
                    this.username = phone
                } else {
                    this.username = '昵称'
                }
            } else {
                this.username = userDataTemp.content[0].name
                this.getUserHead(userDataTemp)
            }
        }
        this.getOrderTaking()
        this.getOrderViewAllCount()
        timer = setInterval(this.getLoc, 30 * 60 * 1000); //30分钟刷新位置一次

        let ISANDROID = false;
        if (!ISANDROID) {
            // 更新用户推送ID
            let registrationID = localStorage.getItem('registrationID')
            this.$http.post('/phone/openkey/updateUserJPushID', {
                        uid: userDataTemp.content[0].id,
                        jpush_id: registrationID,
                    }).then(({ data }) => {
                    }).catch(() => {
                    })
        } else {
            // 极光推送
            window.plugins.jPushPlugin.init()
            let that = this;
            window.plugins.jPushPlugin.getRegistrationID(function(id){
            //将获取到的id存入服务端 
            // alert(id)
            // 更新用户推送ID
            that.$http.post('/phone/openkey/updateUserJPushID', {
                        uid: userDataTemp.content[0].id,
                        jpush_id: id,
                    }).then(({ data }) => {
                    }).catch(() => {
                    })
            }); 
            // 状态栏一体            
            if (cordova.platformId == 'android') {
                StatusBar.backgroundColorByHexString('#ff6c00');
            } else {
                StatusBar.backgroundColorByHexString('#ff6c00');
                StatusBar.styleBlackTranslucent();
                StatusBar.overlaysWebView(true);
                // StatusBar.hide();
            }
        }

    },

    methods: {

        initMap() {
            var _self = this;
            window.addEventListener('message', function(event) {
                // 接收位置信息
                var loc = event.data;
                console.log('location', console.log(loc));
                if (loc && loc.module == 'geolocation') {
                    localStorage.setItem('locationJS', JSON.stringify(loc));
                    if (_self.loaded) {
                        _self.getOrderTaking();
                        _self.loaded = false;
                    }
                } else { //定位组件在定位失败后，也会触发message, event.data为null
                    // _self.$toast('定位失败')
                }
            }, false);
            // //为防止定位组件在message事件监听前已经触发定位成功事件，在此处显示请求一次位置信息
            //  document.getElementById("geoPage").contentWindow.postMessage('getLocation', '*');
            //  //设置6s超时，防止定位组件长时间获取位置信息未响应
            // setTimeout(function() {
            //     if(!loc) {
            //         //主动与前端定位组件通信（可选），获取粗糙的IP定位结果
            //     document.getElementById("geoPage")
            //         .contentWindow.postMessage('getLocation.robust', '*');
            //     }
            // }, 6000); //6s为推荐值，业务调用方可根据自己的需求设置改时间，不建议太短
        },

        getLoc() {
            document.getElementById("geoPage").contentWindow.postMessage('getLocation', '*');
        },

        getLocationLatLonByAddr(addr, callback) {
            var urlStr = 'http://apis.map.qq.com/ws/geocoder/v1/?address=贵州省-贵阳市-云岩区贵开路&key=NONBZ-2VT33-DOI3A-35PVY-CZ7M6-ZRBFR';
            this.$http.get(urlStr).then(({ data }) => {
                console.log(data)
            }).catch((err) => {
            })
        },

        loadTab1() {
            if (this.tab == '已完成') {
                if (this.hasMore && !this.tab1loading) {
                    //阻塞不让重复请求
                    this.tab1loading = true
                    this.getUserOrderFinish(false);
                }
            }
        },

        workComplate() {//完工

            //验证
            if (this.utils.isNotBlank(this.idcardNo)) {
                // if (!this.utils.checkIdNumber(this.idcardNo)) {
                //     this.$toast('身份证号格式错误')
                //     return;
                // }
            } else {
                this.$toast('身份证号不能为空')
                return;
            }
            if (this.isNeed == '2') {  //汽车
                if (this.utils.isBlank(this.driveCard)) {
                    this.$toast('驾驶证号不能为空！')
                    return;
                }
                if (this.utils.isBlank(this.carCard)) {
                    this.$toast('行驶证号不能为空！')
                    return;
                }
            }

            this.$indicator.open()
            this.$http.post('/phone/js/orderview/updateOrdersCertiStatus', {

                order_id: this.tempOrderId,
                idCardNo: this.idcardNo,
                carCard: this.carCard,
                driveCard: this.driveCard,
                otherCard: this.otherCard

            }).then(({ data }) => {
                this.complatePopup = false
                this.$indicator.close()
                if (data.code == '1') {
                    this.isCommitSuccess = false
                    this.goFinishSure()
                } else if (data.code == '-1') {
                    this.$toast('提交数据失败，请重新尝试...')
                } else {
                    this.$toast(data.msg)
                }

            }).catch((err) => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })

        },

        goFinishSure() {
            // 跳转到完工确认
            this.$router.push({
                name: '完工确认',
                query: {
                    tabstr: this.tab,
                    jsonclStr: this.jsonclStrTemp,
                    jsonStr: this.jsonStrTemp
                }
            })
        },

        //获取订单总数
        getOrderViewAllCount() {
            var userInfo = localStorage.getItem('userdata');
            userInfo = JSON.parse(userInfo)
            this.$indicator.open()
            this.$http.get('/phone/js/orderview/getOrderViewAllCount', {
                params: {
                    jsID: userInfo.content[0].id
                }
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1') {
                    console.log(JSON.stringify(data))
                    this.orderAllCount = data.content[0].order_count
                } else if (data.code == '-1') {
                    this.orderAllCount = 0
                    this.$toast('查询出错，请重新尝试...')
                } else {
                    this.$toast(data.msg)
                }
            }).catch((err) => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
        },
        getOrderTaking() {
            var userInfo = localStorage.getItem('userdata');
            userInfo = JSON.parse(userInfo)
            if (!userInfo.content[0].id) {
                this.$toast(' 用户信息不正确或为空')
            } else {
                this.$indicator.open()
                this.$http.get('/phone/js/orderview/getOrderViewTakingAll', {
                    params: {
                        jsID: userInfo.content[0].id,
                        serviceType: userInfo.content[0].service_types
                    }
                }).then(({ data }) => {
                    this.$indicator.close()
                    console.log('我是技师');
                    console.log(data.content);
                    if (data.code == '1' || data.code == '39') {
                            // 待接单
                        if (data.code == 39){
                            this.userstatus = '2'
                            this.filterByDistance(data.content);
                        } else {
                            if ('不可接单状态' == data.content[0]) {
                                this.$messagebox.alert('基本信息为空，不能接单');
                            } else {
                            // 接单中
                                this.userstatus = '1'
                                this.filterByDistance(data.content);
                            }  
                        }
                    } else if (data.code == '2') {
                        this.jsDetailVosOne = data.content
                        
                    } else if (data.code == '-1') {
                        this.$toast('查询出错，请重新尝试...')
                    } else {
                        this.$toast(data.msg)
                    }
                }).catch((err) => {
                    this.$indicator.close()
                    this.$messagebox.alert('系统繁忙')
                })
            }
        },

        getOrderListByStatus(status) {
            var userInfo = localStorage.getItem('userdata');
            userInfo = JSON.parse(userInfo)
            if (!userInfo.content[0].id) {
                this.$toast(' 用户信息不正确或为空')
            } else {
                this.$indicator.open()
                this.$http.get('/phone/js/orderview/getOrderViewAll', {
                    params: {
                        jsID: userInfo.content[0].id,
                        order_type: status
                    }
                }).then(({ data }) => {
                    this.$indicator.close()
                    console.log(data.content);
                    if (data.code == '1' || data.code == '39') {//用户休息中
                        if (data.code == 39) {
                            this.userstatus = '2'
                        } else {
                            if ('不可接单状态' == data.content[0]) {
                                this.$messagebox.alert('基本信息为空，不能接单');
                                return;
                            } else {
                                // 接单中
                                this.userstatus = '1'
                            }   
                        }

                        if (status == '04,02') {
                            this.jsDetailVosTwo = data.content
                        } else if (status == '05') {
                            this.jsDetailVosThree = data.content
                        }
                    } else if (data.code == '-1') {
                        this.$toast('查询出错，请重新尝试...')
                    } else {
                        this.$toast(data.msg)
                    }
                }).catch((err) => {
                    this.$indicator.close()
                    this.$messagebox.alert('系统繁忙')
                })
            }
        },

        getUserOrderNOPAY() {
            var userInfo = localStorage.getItem('userdata');
            userInfo = JSON.parse(userInfo)
            if (!userInfo.content[0].id) {
                this.$toast(' 用户信息不正确或为空')
            } else {
                this.$indicator.open()
                this.$http.post('/phone/openkey/getUserOrderNOPAY', {
                    dispatching_id: userInfo.content[0].id
                }).then(({ data }) => {
                    this.$indicator.close()
                    if (data.code == '1') {
                        this.jsDetailVosFour = data.content
                    } else if (data.code == '-1') {
                        this.$toast('查询出错，请重新尝试...')
                    } else {
                        this.$toast(data.msg)
                    }
                }).catch((err) => {
                    this.$indicator.close()
                    this.$messagebox.alert('系统繁忙')
                })
            }
        },

        getUserOrderFinish(isnew) {
            if (isnew) {//如果是完成支付刷新的。。
                this.pageNum = 0
                this.hasMore = true
                this.jsDetailVosFive = []
            }

            var userInfo = localStorage.getItem('userdata');
            userInfo = JSON.parse(userInfo)
            if (!userInfo.content[0].id) {
                this.$toast(' 用户信息不正确或为空')
            } else {
                this.$indicator.open()
                this.$http.post('/phone/openkey/getUserOrderFinish', {
                    dispatching_id: userInfo.content[0].id,
                    pageCount: this.pageCount,
                    pageNum: this.pageNum
                }).then(({ data }) => {
                    this.$indicator.close()
                    if (data.code == '1') {
                        // this.jsDetailVosFive = data.content
                        if (data.content.length == this.pageCount) {
                            this.pageNum += 1
                            this.hasMore = true
                        } else { //查到的总数小于pageCount
                            this.hasMore = false
                        }
                        this.jsDetailVosFive = this.jsDetailVosFive.concat(data.content)
                    } else if (data.code == '2') {
                        this.hasMore = false
                    } else if (data.code == '-1') {
                        this.$toast('查询出错，请重新尝试...')
                    } else {
                        this.$toast(data.msg)
                    }
                    this.tab1loading = false
                }).catch((err) => {
                    this.tab1loading = false
                    this.$indicator.close()
                    this.$messagebox.alert('系统繁忙')
                })
            }
        },

        getFinishNeedStatus(item, jsonStr) {
            console.log('item--' + JSON.stringify(item))
            this.$indicator.open()
            this.$http.get('/phone/js/orderview/getFinishNeedStatus', {
                params: {
                    service_item_id: item.service_item_id
                }
            }).then(({ data }) => {
                console.log('getFinishNeedStatus--' + JSON.stringify(data))
                this.$indicator.close()
                if (data.code == '1') {
                    this.isNeed = data.content[0].is_need
                    this.tempOrderId = item.order_id
                    this.complatePopup = true
                } else if (data.code == '2') {

                    this.isCommitSuccess = false;
                    //跳转到完工确认界面。。。
                    this.goFinishSure()

                } else {
                    this.$toast(data.msg)
                }
            }).catch((err) => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙1')
            })

        },

        bindItemClick(item) {//status:当前订单状态           
            var userInfo = localStorage.getItem('userdata');
            userInfo = JSON.parse(userInfo)
            console.log('item:' + JSON.stringify(item))
            var status = item.current_status
            var orderId = item.order_id
            let userId = item.user_id
            // 保存FormId
            // var formId = e.detail.formId;
            // console.log('formId = ' + formId);
            // that.saveWXFormId(formId, userInfo.id);
            // that.saveWXOrderFormId(formId, orderId);
            //构建添加额外商品list

            var obj = new Object();
            obj.process_person_id = userInfo.content[0].id;
            obj.process_person_name = userInfo.content[0].name;
            obj.order_id = orderId;

            if (status == '04' || status == '02') {//点击开工
                obj.process_stage = '05';
                // that.changeOrderTop(3);
            } else if (status == '01') {//点击抢单
                obj.process_stage = '02';
            } else if (status == '03') {//点击接单
                obj.process_stage = '04';
            }

            var jsonStr = JSON.stringify(obj);
            console.log(jsonStr)
            if (status == '05') {
                this.jsonclStrTemp = JSON.stringify(item)
                this.jsonStrTemp = jsonStr
                this.getFinishNeedStatus(item, jsonStr);

            }else if (status == '06') {
                //技师代付
                this.orderPay(item)
            } else {
                this.commitOrderViewStatus(jsonStr, status, orderId, obj);
                // 订单取消通知 给技师
                this.$http.post('/phone/openkey/sendJPushMsg', {
                    user_id: userId,
                    status: obj.process_stage,
                }).then(({ data }) => {
                }).catch(() => {
                })
            }
        },

        commitOrderViewStatus(objStr, beforeStatus, orderId, obj) {
            var userInfo = localStorage.getItem('userdata');
            userInfo = JSON.parse(userInfo)
            if (!userInfo.content[0].id) {
                this.$toast(' 用户信息不正确或为空')
            } else {

                this.$indicator.open()
                this.$http.post('/phone/js/orderview/commitOrderViewStatus', {
                    objStr: objStr
                }).then(({ data }) => {
                    this.$indicator.close()
                    if (data.code == '1') {
                        if (beforeStatus == '01' || beforeStatus == '03') {
                            this.getOrderTaking();
                            this.tab = '已接单'
                        } else if (beforeStatus == '04' || beforeStatus == '02') {
                            this.getOrderListByStatus('04,02');
                            this.tab = '开工中'
                        }
                        // 发送消息
                        // _this.sendMsgForStatus(orderId, obj.process_stage, userInfo.id);
                    } else if (res.data.code == -19) {
                        this.$toast('对不起，别人抢先一步了')
                    } else if (data.code == '-1') {
                        this.$toast('提交出错，请重新尝试...')
                    } else {
                        this.$toast(data.msg)
                    }
                }).catch((err) => {
                    this.$indicator.close()
                    this.$messagebox.alert('系统繁忙')
                })
            }
        },

        childChangeStatus(status) {
            this.userstatus = status
        },

        filterByDistance(list) {
            // console.log(JSON.stringify(list))
            var listTemp = new Array();
            var listShow = new Array();
            var listDispatch = new Array();

            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                if (obj.current_status == '01') {//只过滤抢单的
                    listTemp.push(obj);
                } else {
                    listDispatch.push(obj);
                }
            }

            var temp = localStorage.getItem('locationJS');
            var latitude = '';
            var longitude = '';
            if (this.utils.isNotBlank(temp)) {
                temp = JSON.parse(temp)
                latitude = temp.lat;
                longitude = temp.lng;
                console.log('ctllll' + latitude + ' ' + longitude);
            }

            console.log('ct2222' + listDispatch.length);
            var index = 0;
            if (listTemp.length > 0) {
                for (var i = 0; i < listTemp.length; i++) {
                    let obj = listTemp[i];
                    if (this.utils.isNotBlank(obj.latitude) && this.utils.isNotBlank(obj.longitude)) {

                        var tempLat = parseFloat(obj.latitude);
                        var tempLon = parseFloat(obj.longitude);

                        // console.log(tempLat + ',' + tempLon)
                        var distance = parseInt(this.utils.getFlatternDistance(latitude, longitude, tempLat, tempLon));
                        //  this.getFlatternDistance(latitude, longitude, obj.latitude, obj.longitude);
                        // console.log('distance = ' + distance)
                        if (distance < 1000 || (latitude == tempLat && longitude == tempLon)) {//当半径大于2000米时，不允许抢单（不显示）
                            listShow.push(obj);
                        }
                    }
                    if (index == listTemp.length - 1) {
                        listShow = listShow.concat(listDispatch);
                        this.jsDetailVosOne = listShow
                    }
                    index++;
                }
            } else {
                this.jsDetailVosOne = listDispatch
            }
        },
        getUserHead(userData){
            this.$http.post('/phone/userinfor/getUserHead', {
                    uid: userData.content[0].id,
                }).then(({ data }) => {
                    this.$indicator.close()
                    if (data.code == '1') {
                        this.userhead = 'https://www.gzwnks.com/sbb-web/' + data.content[0].archives_url
                    }

                }).catch(() => {
                    this.$indicator.close()
                    this.$toast('服务器繁忙')
                })
        },
        hasPerfectPersonalInfor(data){
            var userInfor = data.content[0]
            if(this.utils.isBlank(userInfor.id_number)
                ||this.utils.isBlank(userInfor.city)
                ||this.utils.isBlank(userInfor.name)
                ||this.utils.isBlank(userInfor.service_types)){
                this.$toast('请先前往完善个人信息')
                this.$router.push('/person-center-edit');
            }else{
                this.$router.push('/home-jishi');
            }
        },
        orderPay(userOrder) {
            // 先获取本地IP地址 http://pv.sohu.com/cityjson?ie=utf-8
            /* this.$axios({
                method:'GET',
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
            formData.append('orderId', userOrder.order_id);
            formData.append('cip', cip);
            formData.append('coupon_type', '');
            formData.append('coupon_price', '0');
            this.$axios({
                method:'POST',
                url: '/phone/openkey/h5xiadan',
                data: formData,
            }).then(({data}) => {
                this.$indicator.close()
                if(data.code == '1'){
                    let dataAr = data.content;
                    if (dataAr.length > 0) {
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
                        let orderId = userOrder.order_id;
                        let locationUrl = "https://www.gzwnks.com/sbb-web/upload/pay.jsp?" + webUrlAr[1] + "&realPrice=" + realPrice + "&orderId=" + orderId + "&out_trade_no=" + out_trade_no;

                        /* -------------------- 是否android ----------------------- */
                        let ISANDROID = false

                        if (ISANDROID) {
                            locationUrl = "https://www.gzwnks.com/sbb-web/upload/pay.jsp?" + webUrlAr[1] + "&realPrice=" + realPrice + "&orderId=" + orderId + "&out_trade_no=" + out_trade_no;
                        } else {
                            locationUrl = "https://www.gzwnks.com/sbb-web/upload/payjs.jsp?" + webUrlAr[1] + "&realPrice=" + realPrice + "&orderId=" + orderId + "&out_trade_no=" + out_trade_no;
                        }

                        if (ISANDROID) {
                            // android版本走inAPPbrowser流程 采用ThemeableBrowser方式跳转
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
                            // ios版本走webview流程
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
    
    },
    computed: {

    },
    watch: {
        complatePopup(v) {
            if (!v) {
                // 取消或者提交完毕后,清空信息
                this.idcardNo = ''
                this.otherCard = ''
                this.carCard = ''
                this.driveCard = ''
                this.tempOrderId = ''
                this.jsonclStrTemp = ''
                this.jsonStrTemp = ''
            }
        },

        tab(v) {
            if (v == '待接单') {
                this.getOrderTaking();
            } else if (v == '已接单') {
                this.getOrderListByStatus('04,02');
            } else if (v == '开工中') {
                this.getOrderListByStatus('05');
            } else if (v == '待支付') {
                this.getUserOrderNOPAY();
            } else if (v == '已完成') {
                if (this.jsDetailVosFive.length == 0) {
                    this.getUserOrderFinish(true);
                }
                console.log(v)
            }
           
        }

    },

    beforeDestroy() {
        clearInterval(timer);
        localStorage.removeItem('tabPos')
        timer = null;
    }
}
</script>
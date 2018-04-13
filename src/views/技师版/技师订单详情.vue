<style lang="scss">
.cancel-button {
    width: 100%;
    height: 2.2rem;
    bottom: 0.1rem;
    display: flex;
    position: fixed;
    border-radius: .2rem;
}
</style>
<template>
    <ui-main>
        <mt-header slot="header" title="订单详情">
            <ui-button icon="back" slot="left"></ui-button>
            <!-- <mt-button @click="goback()" icon="back" slot="left"></mt-button> -->
        </mt-header>
        <div v-if="currentOrder" class="ui-card pr0 mb05">
            <order-list label="订单号" is-link :to="{name:'技师-订单号详情',query:{order_id:currentOrder.order_id,dispatching_id:currentOrder.dispatching_id}}">{{currentOrder.order_no}}</order-list>
            <!-- <order-list label="订单号">{{currentOrder.order_no}}</order-list> -->
            <order-list v-if="hasGuarantee" label="保修时间">{{currentOrder.guarantee+ (currentOrder.guarantee_date_type=='1'?'月':'年')}}</order-list>
            <order-list label="时    间">{{currentOrder.service_time_describe}}</order-list>
            <order-list label="类    别">{{currentOrder.service_type_name + ' - ' + currentOrder.service_item}}</order-list>
            <order-list label="服务地址">{{currentOrder.service_address}}</order-list>
            <order-list label="下单顾客">{{currentOrder.user_name}}</order-list>
            <order-list label="联系电话">
                 <a :href="hrefPhone" class="flex row-between">
                    {{userPhoneCom}} <icon name="phone" class="f-color-orange mr05"></icon>
                </a>
                </order-list>
            <order-list label="报    价" class="border-none mb05">
                <span class="ui-rmb f10 f-color-orange">{{currentOrder.tatal_price}}</span>
            </order-list>
            
            <!-- <order-list label="用户位置" is-link :to="{name:'地址位置'}">点击查看</order-list> -->
            <order-list label="用户位置" is-link @click.native="goJSLocation()">点击查看</order-list>
            
        </div>

        <div class="ui-card">
            <ui-timeline :points="points"></ui-timeline>
        </div>
    </ui-main>
</template>
<script>
import orderList from '../订单/order-list.vue'
export default {
    components: {
        orderList,
    },
    data() {
        return {
            currentOrder: null,
            hasGuarantee:true,
            orderDetail: [],
            points: [],
            order_id: '',
            userPhoneCom: '',
            ordersProcess: [],
            hrefPhone: 'tel:',
            userLocation:{}
        }
    },
    mounted() {
        // var orderStatus = this.$route.query.orderStatus
        var tab = this.$route.query.tabstr;
        localStorage.setItem('tabPos', tab);
        // alert(tab)
        this.order_id = this.$route.query.order_id;

        this.getOrderDetailByOrderId();
        this.getUserShiFuOrdersProcess();
    },
    methods: {
        test() {
        },
        getOrderDetailByOrderId() {
            var userInfo = localStorage.getItem('userdata');
            userInfo = JSON.parse(userInfo)
            if (!userInfo.content[0].id) {
                this.$toast(' 用户信息不正确或为空')
            } else {
                this.$indicator.open()
                this.$http.get('/phone/js/orderview/getOrderDetailByOrderId', {
                    params: {
                        orderId: this.order_id
                    }
                }).then(({ data }) => {
                    console.log(data)
                    this.$indicator.close()
                    if (data.code == '1' && data.content.length > 0) {

                        this.currentOrder = data.content[0]
                        if (data.content[0].guarantee == undefined
                            || data.content[0].guarantee == ""
                            || data.content[0].guarantee_date_type == undefined
                            || data.content[0].guarantee_date_type == "") {
                            this.hasGuarantee = false
                        }

                    } else if (data.code == '2') {
                        this.jsDetailVosOne = data.content
                    } else if (data.code == '-1') {
                        this.$toast('查询出错，请重新尝试...')
                    } else {
                        this.$toast(data.msg)
                    }
                    this.gettechlocation();
                }).catch((err) => {
                    console.log('err1111',err)
                    this.$indicator.close()
                    this.$messagebox.alert('系统繁忙')
                })
            }
        },

        getUserShiFuOrdersProcess() {
            this.$indicator.open()
            this.$http.post('/phone/openkey/getUserShiFuOrdersProcess', {
                orderid: this.order_id
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1' && data.content.length > 0) {
                    var corlors = ['red', 'ui-bg-orange', 'yellow', 'green', 'black']
                    this.ordersProcess = data.content
                    for (var i = 0; i < data.content.length; i++) {
                        var temp = data.content[i]
                        let nod = {
                            pointColor: corlors[i],
                            title: temp.operate_content,
                            text: temp.process_person_name,
                            date: temp.operate_time_str
                        }
                        this.points.push(nod)
                    }

                } else if (data.code == '2') {

                } else if (data.code == '-1') {
                    this.$toast('查询订单过程出错，请重新尝试...')
                } else {
                    this.$toast(data.msg)
                }
            }).catch((err) => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
        },

        // 获取技师位置
        gettechlocation() {
            var userInfo = localStorage.getItem('userdata');
            userInfo = JSON.parse(userInfo)
            if (!userInfo.content[0].id) {
                this.$toast(' 用户信息不正确或为空')
            } else {
                let process_person_id = userInfo.content[0].id;
                this.$http.post('/phone/openkey/gettechlocation', {
                    tech_id: process_person_id,
                }).then(({ data }) => {
                    console.log('gettechlocation');console.log(data);
                    let code = data.code;
                    if (code == "1") {
                    let locations = data.content;
                    if (locations && locations.length > 0) {
                        let userLocation = locations[0];
                        this.userLocation = userLocation
                    }
                    }
                }).catch(() => {
                })
            }
            
        },
        // 查看用户位置
        goJSLocation(){
            console.log(this.userLocation);
            console.log('this.userLocation.latitude = ' + this.userLocation.latitude);
            console.log('this.userLocation.longitude = ' + this.userLocation.longitude);
            // let ISANDROID = true
            // if (ISANDROID) {
            //     this.$router.push({
            //         name:'技师安卓地址',
            //         query:{
            //             latitude:this.userLocation.latitude,
            //             longitude:this.userLocation.longitude
            //         }
            //     })
            // } else {
                this.$router.push({
                    name:'技师地址',
                    query:{
                        latitude:this.userLocation.latitude,
                        longitude:this.userLocation.longitude
                    }
                })
            // }
        },
    },
    watch: {
        currentOrder() {
            if (this.utils.isObject(this.currentOrder) && this.utils.isNotBlank(this.currentOrder.user_phone)) {
                this.hrefPhone = 'tel:' + this.currentOrder.user_phone
                this.userPhoneCom = this.currentOrder.user_phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
                // alert(this.hrefPhone)
            } else {
                return '暂无'
            }
        }
    },
}
</script>
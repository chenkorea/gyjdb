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
        </mt-header>

        <div v-if="currentOrder" class="ui-card pr0 mb05">
            <order-list label="订单号" is-link :to="{name:'订单号详情',query:{id:currentOrder.id,dispatching_id:currentOrder.dispatching_id}}">{{currentOrder.order_no}}</order-list>
            <!-- <order-list label="订单号">{{currentOrder.order_no}}</order-list> -->
            <order-list v-if="hasGuarantee" label="保修时间">{{currentOrder.guarantee + (currentOrder.guarantee_date_type=='1'?'月':'年')}}</order-list>
            <order-list label="时间">{{currentOrder.create_time_ttr}}</order-list>
            <order-list label="类别">{{currentOrder.data_name + ' - ' + currentOrder.service_item}}</order-list>
            <order-list label="服务地址">{{currentOrder.service_address}}</order-list>
            <order-list label="接单技师" v-if="currentOrder.process_stage != '01' && currentOrder.process_stage != '02'" is-link :to="{name:'资质详情',query:{id:currentOrder.process_person_id}}">{{currentOrder.process_person_name}}</order-list>
            <order-list label="报价" class="border-none mb05">
                <span class="ui-rmb f10 f-color-orange">{{currentOrder.total_price}}</span>
            </order-list>
            <order-list label="技师位置" v-if="currentOrder.process_stage != '01' && currentOrder.process_stage != '02'" is-link @click.native="goJSLocation()">点击查看</order-list>
        </div>

        <div class="ui-card">
            <ui-timeline :points="points"></ui-timeline>
        </div>

        <mt-button slot="footer" v-if="showDelete" @click="cancelOrder" type="primary" class="cancel-button mt05">取消订单</mt-button>
    </ui-main>
</template>
<script>
import orderList from './order-list.vue'
export default {
    components: {
        orderList,
    },
    data() {
        return {
            currentOrder: null,
            hasGuarantee:true,//是否有保修期
            orderDetail: [],
            showDelete: false,
            points: [
            ],
            userLocation:{}
        }
    },
    mounted() {
        this.getUserOrders();
        this.getUserOrdersProcess();
    },
    methods: {
        getUserOrders() {
            // 当前订单状态
            // 当前订单
            let usrdata =  localStorage.getItem('userdata')
            if (usrdata != null) {
                usrdata = JSON.parse(usrdata).content[0]
            }
            this.$http.post('/phone/openkey/getUserOrders', {
                uid: usrdata.id,
                status: "(01, 02, 03, 04)",
                order_id: this.$route.query.id
            }).then(({ data }) => {
                console.log(data)
                this.$indicator.close()
                if (data.code == '1' && data.content.length > 0) {
                    var stage = data.content[0].process_stage
                    if ('06' == stage || '07' == stage || '08' == stage || '05' == stage) {
                        this.showDelete = false
                    } else {
                        this.showDelete = true
                    }
                    this.currentOrder = data.content[0]
                    if (data.content[0].guarantee == undefined
                            || data.content[0].guarantee == ""
                            || data.content[0].guarantee_date_type == undefined
                            || data.content[0].guarantee_date_type == "") {
                            this.hasGuarantee = false
                    }
                    this.gettechlocation();
                } else {
                    this.$messagebox.alert('获取订单详细异常，请重新尝试...')
                }
            }).catch(() => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
        },

        getUserOrdersProcess() {
            // 当前订单流程
            this.$http.post('/phone/openkey/getUserOrdersProcess', {
                orderid: this.$route.query.id,
            }).then(({ data }) => {
                this.$indicator.close()
                console.log('当前结果:', data);
                this.points = []
                if (data.code == '1' && data.content.length > 0) {
                    var corlors = ['red', 'ui-bg-orange', 'yellow', 'green', 'black']
                    this.orderDetail = data.content
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
                } else {
                    this.$messagebox.alert('获取订单详细异常，请重新尝试...')
                }
            }).catch(() => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
        },

        cancelOrder() {
            this.$messagebox.confirm('确认删除该订单?').then(action => {
                if (action == 'confirm') {
                    // 取消订单流程
                    this.$http.post('/phone/userinfor/cancelOrder', {
                        order_id: this.$route.query.id,
                    }).then(({ data }) => {
                        this.$indicator.close()
                        if (data.code == '1') {
                            // 订单取消通知 给技师
                            this.sendJPushMsg();
                            this.sendMsgForStatus();
                            this.$router.go(-1)
                        } else {
                            this.$messagebox.alert('取消订单失败，请重新尝试...')
                        }
                        // sendJPushMsg()
                        // this.$messagebox.alert('成功过')
                    }).catch(() => {
                        this.$indicator.close()
                        this.$messagebox.alert('系统繁忙')
                    })

                }
            }).catch(() => {
            })
        },
        // 发送推送通知
        sendJPushMsg() {
            // let userData = localStorage.getItem('userdata')
            // userData = JSON.parse(userData)
            let process_person_id = this.currentOrder.process_person_id;
            this.$http.post('/phone/openkey/sendJPushMsg', {
                user_id: process_person_id,
                status: '09',
            }).then(({ data }) => {
            }).catch(() => {
            })
        },
        // 发送微信通知
        sendMsgForStatus() {
            let orderId = this.currentOrder.id;
            let process_person_id = this.currentOrder.process_person_id;
            this.$http.post('/phone/openkey/sendMsgForStatus', {
                orderId: orderId,
                status: '09',
                jsId: process_person_id,
            }).then(({ data }) => {
            }).catch(() => {
            })
        },
        // 获取技师位置
        gettechlocation() {
            let process_person_id = this.currentOrder.process_person_id;
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
        },
        // 查询技师位置
        goJSLocation(){
            console.log(this.userLocation);
            console.log('this.userLocation.latitude = ' + this.userLocation.latitude);
            console.log('this.userLocation.longitude = ' + this.userLocation.longitude);
            this.$router.push({
                name:'地址位置',
                query:{
                    latitude:this.userLocation.latitude,
                    longitude:this.userLocation.longitude
                }
            })
        },
    },
}
</script>
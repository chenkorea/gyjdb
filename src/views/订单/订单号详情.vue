<style lang="scss" scoped>
@import '~@/scss/public.scss';
.swipe-item {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    align-items: flex-end;
    >.swipe-title {
        @include text-clamp(1);
        background-color: rgba(black, .5);
        color: white;
        font-size: .8rem;
        margin: 0;
        padding: .5rem;
        width: 100%;
    }
}
</style>
<template>
    <ui-main>
        <mt-header slot="header" title="订单详情">
            <ui-button icon="back" slot="left"></ui-button>
        </mt-header>
        <div v-if="currentOrder" class="ui-card pr0 mb05">
            <order-list label="订单号">{{currentOrder.order_no}}</order-list>
            <order-list v-if="hasGuarantee" label="保修时间">{{currentOrder.guarantee + (currentOrder.guarantee_date_type=='1'?'月':'年')}}</order-list>
            <order-list label="创建时间">{{currentOrder.create_time_ttr}}</order-list>
            <order-list label="服务类别">{{currentOrder.data_name + ' - ' + currentOrder.service_item}}</order-list>
            <order-list label="服务地址">{{currentOrder.service_address}}</order-list>
        </div>
        <div v-if="currentOrder" class="ui-card pr0 mb05">
            <order-list label="服务技师">{{currentOrder.process_person_name}}</order-list>
            <order-list v-if="showPayStatu" label="订单总价">{{currentOrder.total_price}}</order-list>
        </div>
        <div  v-if="showPayStatu" class="ui-card pr0 mb05">
            <order-list label="完工时间">{{currentOrder.finish_time}}</order-list>
        </div>
        <div v-if="showPayStatu" class="ui-card pr0 mb05">
            <order-list  label="支付总额">{{currentOrder.total_price}}</order-list>
            <order-list  label="支付方式">{{currentOrder.pay_type}}</order-list>
        </div>
        <div v-if="showComment && comment" class="ui-card pr0 mb05">
            <order-list  label="评论类型">{{comment.level}}</order-list>
            <order-list  label="评论内容">{{comment.content}}</order-list>
        </div>
        <div class="f-color-text f08 flex flex-wrap" style="margin-left:5%;">
            <ui-img @click.native="openPreviewImg(item)" v-for="item in imgUrl" :src="item" :key="item.id" style="width:30%;height:5.5rem; margin:1%"></ui-img>
            <!--banner-->
            <!-- <mt-swipe v-if="imgUrl.length > 0" :auto="4000" :show-indicators="true" style="height:10rem;">
                <mt-swipe-item v-for="(item,i) in imgUrl" :key="i">
                    <div class="swipe-item" :style="{backgroundImage:item.archives_url}">
                    </div>
                </mt-swipe-item>
            </mt-swipe> -->

        </div>

         <mt-popup v-model="preview.isActive" position="right" slot="popup">
            <img :src="preview.url" class="popup" style="width:100vw;" @click="preview.isActive=false">
        </mt-popup>
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
            hasGuarantee:true,
            showPayStatu: false,
            showComment: false,
            comment: null,
            weburl: '',
            imgUrl: [],
            preview:{
                isActive:false,
                url:''
            }
        }
    },
    mounted() {
        let order_id = this.$route.query.id;
        
        /* this.$axios().then(({ config }) => {
            this.weburl = config.baseURL

            console.log('我的地址是 = ' + this.weburl);

            this.$http.post('/phone/openkey/getUserOrders', {
                uid: usrdata.id,
                status: "(01, 02, 03, 04)",
                order_id: this.$route.query.id
            }).then(({ data }) => {
                this.$indicator.close()
                console.log('当前结果:', data);
                if (data.code == '1' && data.content.length > 0) {
                    if (data.content[0].process_stage == '06'
                        || data.content[0].process_stage == '07'
                        || data.content[0].process_stage == '08') {
                        this.showPayStatu = true
                    }

                    if (data.content[0].pay_type == undefined) {
                        data.content[0]['pay_type'] = ''
                    } else if (data.content[0].pay_type == '1') {
                        data.content[0].pay_type = '在线支付'
                    } else if (data.content[0].pay_type == '2') {
                        data.content[0].pay_type = '技师代付'
                    }
                    var imgurl = []
                    for (var index = 0; index < data.content[0].commFileVos.length; index++) {
                        var element = data.content[0].commFileVos[index];
                        if (element.archives_url != undefined && element.archives_url != '') {
                            imgurl.push(this.weburl + '/' + element.archives_url)
                        }
                    }
                    this.imgUrl = imgurl
                    this.currentOrder = data.content[0]
                    if (data.content[0].guarantee == undefined
                            || data.content[0].guarantee == ""
                            || data.content[0].guarantee_date_type == undefined
                            || data.content[0].guarantee_date_type == "") {
                            this.hasGuarantee = false
                    }

                } else {
                    this.$messagebox.alert('获取订单详细异常，请重新尝试...')
                }
            }).catch(() => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
        }) */

        this.getOrderDetail(order_id)

        this.getComments()

    },
    methods: {
        getComments() {
            this.$http.post('/phone/openkey/getUserOrderComment', {
                dispatching_id: this.$route.query.dispatching_id
            }).then(({ data }) => {
                this.$indicator.close()
                console.log('当前评论结果:', data);
                if (data.code == '1') {
                    if (data.content.length > 0) {
                        this.showComment = true
                        this.comment = data.content[0]
                    }
                } else {
                    this.$messagebox.alert('获取订单评价异常，请重新尝试...')
                }
            }).catch(() => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
        },
        openPreviewImg(url){
            this.preview.isActive = true
            this.preview.url = url
        },
        getOrderDetail(order_id) {
            let usrdata =  localStorage.getItem('userdata')
            if (usrdata != null) {
                usrdata = JSON.parse(usrdata).content[0]
            }
            this.$http.post('/phone/openkey/getUserOrders', {
                uid: usrdata.id,
                status: "(01, 02, 03, 04)",
                order_id: order_id
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1' && data.content.length > 0) {
                    if (data.content[0].process_stage == '06'
                        || data.content[0].process_stage == '07'
                        || data.content[0].process_stage == '08') {
                        this.showPayStatu = true
                    }

                    if (data.content[0].pay_type == undefined) {
                        data.content[0]['pay_type'] = ''
                    } else if (data.content[0].pay_type == '1') {
                        data.content[0].pay_type = '在线支付'
                    } else if (data.content[0].pay_type == '2') {
                        data.content[0].pay_type = '技师代付'
                    }
                    var imgurl = []
                    for (var index = 0; index < data.content[0].commFileVos.length; index++) {
                        var element = data.content[0].commFileVos[index];
                        if (element.archives_url != undefined && element.archives_url != '') {
                            imgurl.push('https://www.gzwnks.com/sbb-web/' + element.archives_url)
                        }
                    }
                    this.imgUrl = imgurl
                    this.currentOrder = data.content[0]
                    if (data.content[0].guarantee == undefined
                            || data.content[0].guarantee == ""
                            || data.content[0].guarantee_date_type == undefined
                            || data.content[0].guarantee_date_type == "") {
                            this.hasGuarantee = false
                    }

                } else {
                    this.$messagebox.alert('获取订单详细异常，请重新尝试...')
                }
            }).catch(() => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
        }
    },

}
</script>

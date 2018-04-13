<style lang="scss" scoped>

.price-style {
    display: block;
    position: absolute;
    color: #FF7F24;
    size: 30px;
    z-index: 5;
    top: 35px;
    right: 0px;
    bottom: 65px;
    text-align: right;
    width: 100%;
}


</style>


<template>
    <ui-main style="background:#e5e5e5">
        <mt-header slot="header" title="我的卡券">
            <ui-button slot="left" icon="back"></ui-button>
        </mt-header>

        <!--banner-->
        <div v-if="couponList.length>0" style="margin-top:10px" v-for="item in couponList">
            <div @click="chooseCoupon(item)" class="bg-white" style="border-radius:15px;margin-left:15px;margin-right:15px;margin-bottom:10px;padding:6px;">
                <span style="font-size:15px;margin-left:10px;">{{item.coupon_nam}}</span>
                <span v-if="item.is_able=='1'" style="font-size:15px;display:flex; justify-content:flex-end;margin-right: 5%;color:#FF7F24">可使用</span>
                <span v-if="item.is_able=='0'" style="font-size:15px;justify-content:flex-end;margin-left: 50%;">已使用</span>
                <div style='position:relative;margin-right:15px;'>
                    <img style="width:200px;height:80px;margin:10px" src="https://www.gzwnks.com/sbb-web/upload/headericon/mmexport1509958104727.jpg" alt="">
                    <span class="price-style">{{item.coupon_type=='1'?'服务免费':'￥' + item.coupon_price}}</span>
                </div>
            </div>
        </div>
        <!-- <div class="ui-bg-gradient mt1" style="text-align:center; padding:10px; position:absolute; width:100%; bottom:0px;left:0px">
            <order-list @click="" label="" is-link :to="{}">  <span class="f08 pl06 f-color-white">领取优惠劵</span>
            </order-list>
        </div> -->
            <div class="pt1 pb1">
                    <mt-button @click="goChoose()" class="ui-button-large ui-bg-gradient" style="text-align:center; padding:10px; position:absolute; width:100%; bottom:0px;left:0px;border-radius:0px">领取代金劵</mt-button>
                </div>
        <div v-if="couponList.length==0" class="h-100 flex row-center col-center f12 f-color-grey">
            当前没有卡券信息
        </div>
          <!-- 弹出层 -->
        <ui-page v-model="coupunPageNew" title="添加卡券" slot="popup">
            <div class="pt05">
                <coupon-new-list :newdata.sync="couponNewItem" :newpopup.sync="coupunPageNew"></coupon-new-list>
            </div>
        </ui-page>

    </ui-main>
</template>
<script>
 import couponNewList from '../个人中心/添加卡劵.vue';
export default {
   components:{
       couponNewList
   },
  data(){
      return {
          couponList:[],
          parentpath:'',
          coupunPageNew:false,
          couponNewItem:null,
          is_able:'',
          userData:null
      }
    },
   mounted(){
       this.parentpath = this.$route.query.path
       var userDataTemp = localStorage.getItem('userdata')
        if (this.utils.isBlank(userDataTemp)) {
            this.$toast('获取用户信息失败,请稍后重试...')
            this.userData = null
            let phone = localStorage.getItem('phone')
            if (phone != 'undefined' && phone != 'null' && phone != '') {
                this.username = phone
            }
            return
        }
        this.userData = JSON.parse(userDataTemp)
        if(this.$route.query.path != 'grzx'){
            this.is_able = '1'
        }
        this.getHavCoupon();
    },
    methods:{

        getHavCoupon() {
            this.$http.post('/phone/userinfor/getUserCoupon',{
                uid:this.userData.content[0].id,
                is_able:this.is_able
            })
            .then(({data})=>{
                this.$indicator.close()
                if(data.code == '1'){
                    this.couponList = data.content
                }
                
            }).catch(() => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
        },

        chooseCoupon(item){
            console.log("sddd");
            if (this.parentpath != 'grzx') {
                this.$emit('update:data', JSON.stringify(item))//返回上一级窗口
                this.$emit('update:popup', false)//返回上一级窗口
                // this.$emit('ee',JSON.stringify(item))//返回上一级窗口
            }
        },
        goChoose() {
           this.coupunPageNew = true;
        },
    },

      watch: {
            coupunPageNew(){
                if(!this.coupunPage){
                    this.getHavCoupon();
                    // this.orderPay(this.orderId,{})
                }
            }
        }
}
</script>

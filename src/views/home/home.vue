<style lang="scss" scoped>
    .nine-item{
        width: 33.33%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: .7rem;
        background-color: white;
        margin-bottom: 1px;
        border-right: 1px solid #eee;
        >img{
            width:1.7rem;
            margin-bottom: .5rem;
        } 
    }

    .nobg {
        background: #FFF;
        width: 100%;
        height: 50px;
        color: #555555;
        font-size: .7rem;
        text-align: center;
        padding-top: 10px;
    }

    .newfisze {
        font-size: .8rem;
        color: #777777;
        margin-left: 5px;
    }

</style>
<template>
    <ui-main>
        <mt-header title="锁帮帮" slot="header">
        </mt-header>

        <!--banner-->
         <mt-swipe :auto="4000" :show-indicators="true" style="height:8rem;">
            <mt-swipe-item v-for="(item,i) in sildeIms" :key="i">
                <div class="swipe-item" :style="{backgroundImage:`url(${item.url})`}">
                    <!-- <div class="swipe-title">图片标题</div> -->
                </div>
            </mt-swipe-item>
        </mt-swipe> 

        <div class="flex row-between f07 bg-white mb1">
            <!-- <div class="flex col-center flex-1 pl03 mt02 mb02" @click="toLogin"> -->
                <div class="flex col-center flex-1 pl03 mt02 mb02">
                <ui-img :src="userhead" size="2" class="ui-circle bg-grey mr05"></ui-img>
                <div>
                    <div class="f08">{{username}}</div>
                    <div class="f-color-grey f06">贵阳市</div>
                </div>
            </div>
            <a href="tel:4000851323" class="flex col-center p05 ui-border-left">
                <icon name="phone" class="f-color-orange mr05 f10"></icon>
                呼叫客服
            </a>
        </div>

        <!-- 九宫格  -->
        <div class="flex flex-wrap row-between">
            <router-link to="/kaisuo?serviceType=01" tag="div" class="nine-item">
                <img src="~@/icons/unlock.svg">
                <span>开锁服务</span>
            </router-link>
            <router-link to="/kaisuo?serviceType=02" tag="div" class="nine-item">
                <img src="~@/icons/huansuo.svg">
                <span>换锁服务</span>
            </router-link>
            <router-link to="/kaisuo?serviceType=03" tag="div" class="nine-item">
                <img src="~@/icons/online_support.svg">
                <span>保修服务</span>
            </router-link>
            <router-link to="/shop" tag="div" class="nine-item">
                <img src="~@/icons/cart.svg">
                <span>锁具商城</span>
            </router-link>
            <router-link to="/kaisuo?serviceType=04" tag="div" class="nine-item">
                <img src="~@/icons/car_rental.svg">
                <span>汽车钥匙</span>
            </router-link>
            <router-link to="/kaisuo?serviceType=05" tag="div" class="nine-item">
                <img src="~@/icons/data_encryption.svg">
                <span>民用钥匙</span>
            </router-link>
            <router-link to="/aboutUs" tag="div" class="nine-item">
                <img src="~@/icons/customs_officer.svg">
                <span>关于我们</span>
            </router-link>
            <router-link to="/suoge-zhaomu" tag="div" class="nine-item">
                <img src="~@/icons/rules.svg">
                <span>锁哥招募</span>
            </router-link>
            <router-link to="/search-zizhi" tag="div" class="nine-item">
                <img src="~@/icons/diploma_2.svg">
                <span>资质查询</span>
            </router-link>
        </div>

        <!--底部公安厅备案号  -->
        <div class="pt05 pb05">
            <div class="flex row-center col-center">
                <img src="~@/icons/警徽.png" style="width:1.4rem">
                <span class="newfisze">
                    社区民警邀请您来注册
                </span>
            </div>
        </div>

        <!-- 公司 -->
        <div class="flex row-center col-center">
            <span class="nobg">
                贵州锁帮帮科技有限公司
            </span>
        </div>

        <ui-bottom-bar slot="footer"></ui-bottom-bar>
    </ui-main>
</template>

<script>
    export default {
        mounted () {

            
            this.resetJiugongge()
            window.addEventListener('resize',this.resetJiugongge)

            var userData = localStorage.getItem('userdata')
            if (userData == null || userData == undefined || userData == 'null' || userData == 'undefined' || userData == "") {
                this.$toast('获取用户信息失败,请稍后重试...')
                return
            }

            userData = JSON.parse(userData)

            let ISANDROID = false;
            if (!ISANDROID) {
                // 更新用户推送ID
                let registrationID = localStorage.getItem('registrationID')
                this.$http.post('/phone/openkey/updateUserJPushID', {
                            uid: userData.content[0].id,
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
                            uid: userData.content[0].id,
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
            

            if(userData.content[0].name == '' || userData.content[0].name == undefined){
                var phone = localStorage.getItem('phone')
                if(phone !== ''&&  phone !== undefined){
                    this.username = phone
                }else{
                    this.username = '昵称'
                }
            }else{
                this.username = userData.content[0].name
            }
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
        beforeDestroy(){
            window.removeEventListener('resize',this.resetJiugongge)
        },
        data () {
            return {
                isLogged: false,
                username:'',
                userhead:'',
                sildeIms: [
                    {url: 'https://www.gzwnks.com/sbb-web/upload/headericon/H6700HK46.jpg'},
                    {url: 'https://www.gzwnks.com/sbb-web/upload/headericon/H6700HKLO.jpg'},
                    {url: 'https://www.gzwnks.com/sbb-web/upload/headericon/H6700HLEZ.jpg'}
                ]
            }
        },
        methods:{
            resetJiugongge(){// 设置九宫格item的高等于宽
                let items = document.querySelectorAll('.nine-item')
                items.forEach((item)=>{
                    item.style.height = item.offsetWidth + 'px'
                })
            },
            toLogin() {
                this.$router.push({
                    name:'登录'                    
                })
            }
        },
    }
</script>

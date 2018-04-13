<template>
    <ui-main>
        <mt-header slot="header" title="个人中心">
            <ui-button icon="back" slot="left"></ui-button>
        </mt-header>

        <div class="flex col-center p1 bg-white mb05" slot="header">
            <!-- <ui-img src="http://p3.pstatp.com/thumb/249c000b0a4ab52ab70a" size="2.5" class="mr1 ui-circle"></ui-img> -->
            <headUpload :user-url="userHead"></headUpload>
            <div v-if="userData" class="f08">
                <div class="mb05">{{userData.name}}</div>
                <div>{{userData.phone}}</div>
            </div>
        </div>
        <div class="bg-white">
            <router-link to="/addgoodmessage" tag="div" class="ui-border-bottom f08 p1">添加商品</router-link>
            <router-link to="/dingdanshouyi" tag="div" class="ui-border-bottom f08 p1">我的订单收益</router-link>
            <router-link to="/person-center-edit" tag="div" class="ui-border-bottom f08 p1">个人资料完善</router-link>
            <router-link to="/xiugaimima" tag="div" class="ui-border-bottom f08 p1">重置密码</router-link>
        </div>

        <mt-button @click="goExit" class="ui-button-large ui-bg-gradient mt1">退出</mt-button>
    </ui-main>
</template>
<script>
import headUpload from '../个人中心/头像上传'
export default {
    components: {
        headUpload
    },
    data() {
        return {
            userData: null,
            userHead:''
        }
    },
    mounted() {
        var userData = localStorage.getItem('userdata')
        console.log(userData);
        if (this.utils.isBlank(userData)) {
            this.$toast('获取用户信息失败,请稍后重试...')
            this.userData = null
            let phone = localStorage.getItem('phone')
            if (this.utils.isNotBlank(phone)) {
                this.username = phone
            }
            return
        }
        userData = JSON.parse(userData)
        this.userData = userData.content[0]
        this.getUserHead(userData)
    },
    methods: {
        goExit() {
            this.$messagebox.confirm('确认退出当前账户?').then(action => {
                if (action == 'confirm') {
                    localStorage.setItem('userdata', null)
                    localStorage.setItem('isLogin', 0)

                    this.$router.push({
                        name: '登录'
                    })
                }
            }).catch(() => {

            })

        },
        getUserHead(userData){
            this.$http.post('/phone/userinfor/getUserHead', {
                    uid: userData.content[0].id,
                }).then(({ data }) => {
                    this.$indicator.close()
                    if (data.code == '1') {
                        
                        this.userHead = 'https://www.gzwnks.com/sbb-web/' + data.content[0].archives_url
                        console.log(this.userHead);
                    }

                }).catch(() => {
                    this.$indicator.close()
                    this.$toast('服务器繁忙')
                })
        }
    }
    
}
</script>

<template>
    <ui-main>
        <mt-header title="个人中心" slot="header" class="header"></mt-header>

        <!--头像 用户名-->
        <div class="p1 bg-white flex column-col-center mb05">
            <headUpload :user-url="userhead"></headUpload>
            <div class="flex-1 f08 ml1">
                <div @click.stop="changeUserName" class="mb05">{{username}}</div>
                <div>
                    <img v-if="showLevel==='2'" src="/static/images/blue_or.png" style="width:1.2rem;"></imag>
                    <img v-if="showLevel==='1'" src="/static/images/oragin_or.png" style="width:1.2rem;"></imag>
                    <p v-if="showLevel==='0'">{{userlevel}}</p>
                </div>
            </div>
        </div>

        <!--菜单-->
        <section class="bg-white f08">
            <a href="tel:4000851323" class="flex col-center p05 ui-border-bottom">
                <icon name="phone" class="mr05"></icon>
                <span class="mr05">客服</span>
                <span class="f-color-orange">400 0851 323</span>
            </a>
            <router-link to="/xiugaimima" class="flex col-center p05 ui-border-bottom">
                <icon name="gear" class="mr05"></icon>
                重置密码
            </router-link>
            <router-link :to="{name:'我的卡券',query:{path:'grzx'}}" class="flex col-center p05 ui-border-bottom">
                <icon name="gear" class="mr05"></icon>
                我的卡券
            </router-link>
        </section>

        <mt-button @click="goExit" class="ui-button-large ui-bg-gradient mt1">退出</mt-button>

        <ui-bottom-bar slot="footer"></ui-bottom-bar>
    </ui-main>
</template>
<script>
import headUpload from './头像上传'
export default {
    components: {
        headUpload
    },
    data() {
        return {
            username: '昵称',
            userlevel: '普通会员',
            usrdata: null,
            showLevel: '0',
            userhead: '',
        }
    },
    mounted() {
        var userData = localStorage.getItem('userdata')
        if (userData == null || userData == undefined || userData == 'null' || userData == 'undefined' || userData == "") {
            this.$toast('获取用户信息失败,请稍后重试...')
            this.usrdata = null
            let phone = localStorage.getItem('phone')
            if (phone != 'undefined' && phone != 'null' && phone != '') {
                this.username = phone
            }
            return
        }

        userData = JSON.parse(userData)
        this.usrdata = userData.content[0]

        this.getUserHead();

        let phone = userData.content[0].phone
        let name = userData.content[0].name
        if (name != undefined && name != null && name.length > 0) {
            this.username = name
        } else if (phone != undefined && phone != null && phone.length > 0) {
            this.username = name
        }
        var uid = userData.content[0].id
        this.$http.post('/phone/userinfor/getuserlevel', {
            uid: uid
        })
            .then(({ data }) => {
                console.log(data)
                this.$indicator.close()
                if (data.code == '1') {
                    var level = data.content[0].is_vip
                    if (level == '1') {
                        this.showLevel = '1'
                        this.userlevel = '1'
                    } else if (level == '2') {
                        this.showLevel = '2'
                    } else {
                        this.showLevel = '0'
                    }
                    this.username = data.content[0].name
                }

            }).catch(() => {
                this.$indicator.close()
                this.$toast('服务器繁忙')
            })




    },
    methods: {
        changeUserName() {
            if (this.usrdata == null) {
                return
            }
            this.$messagebox.prompt('请输入姓名').then(({ value }) => {
                console.log(value);
                if (value !== null && value !== '') {
                    var userdata = this.usrdata
                    this.$http.post('/phone/userinfor/setNickName', {
                        uid: userdata.id,
                        nickname: value
                    })
                        .then(({ data }) => {
                            console.log(data)
                            this.$indicator.close()
                            if (data.code == '1') {
                                this.$toast('您的昵称更新成功了...')
                                this.username = value
                                localStorage.setItem('userdata', JSON.stringify(data))
                            } else {
                                this.$messagebox.alert('系统找不到当前用户信息,请联系管理员核实...')
                            }

                        }).catch(() => {
                            this.$indicator.close()
                            this.$toast('服务器繁忙')
                        })
                }
            }).catch(() => {
                console.log('取消修改姓名');
            })
        },
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
        getUserHead(){
            this.$http.post('/phone/userinfor/getUserHead', {
                    uid: this.usrdata.id,
                }).then(({ data }) => {
                    this.$indicator.close()
                    if (data.code == '1') {

                        this.userhead = 'https://www.gzwnks.com/sbb-web/' + data.content[0].archives_url
                        
                    }

                }).catch(() => {
                    this.$indicator.close()
                    this.$toast('服务器繁忙')
                })
        }

    }

}
</script>

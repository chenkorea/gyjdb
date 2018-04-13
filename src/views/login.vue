<style lang="scss" scoped>
    @import '~@/scss/public.scss';
    $ui-color-blue: #26a2ff;
    .circle {
        border-radius: 50%;
        border: $ui-border;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 2.2rem;
        height: 2.2rem;
    }

    .info-text {
        margin: 15px;   
        font-size: .8rem;
        color: #333333;
    }

    .split-view {
        width: 100%;
        height: 8px;
        background: #f0f0f0;
    }

    .split-view-01 {
        width: 100%;
        height: 2px;
        background: #f0f0f0;
    }

    .content-view {
        width: 100%;
        background: #FFFFFF;
        position: relative;
    }

    .item-img {
        width: 60px;
        height: 60px;
        margin: 5px;
    }

    .right-item {
        position: absolute;
        height: 40px;
        line-height: 0.7rem;
        top: 10px;
        left: 60px;
        right: 100px;
        font-size: 0.7rem;
        color: #555555;
    }

    .download-btn {
        display: flex;
        width: 90%;
        height: 45px;
        border: 1px solid #396fbf;
        color: #396fbf;
        border-radius: 5px;
        font-size: 16px;
        text-align: center;
        margin: 5%;
        padding-left: 38%;
        padding-top: 10px;
    }

    .top-logo {
        margin-top: 50px;
    }

    .inf-text {
        margin-top: 20px;
    }

    .img-center {
        width: 200px;
        height: 200px;
    }


</style>
<template>
    <ui-main class="bg-white">

        <div class="text-center">
            <img class="img-center top-logo" src="https://www.gyclit.top/gyjdb/images/gyjdb1.png" alt="">
        </div>
        <p class="f08 info-text text-center">贵阳市禁毒办在线禁毒知识答题
        </p>

        <div class="split-view"></div>

        <div class="content-view">
            <a class="download-btn" href="https://www.gyclit.top/gyclit-web/phone/gyjdb/wxGzhLogin">立即参加</a>
            <!-- <a class="download-btn" href="http://30d5f9e3.ngrok.io/gyclit-web/phone/gyjdb/wxGzhLogin">立即参加</a> -->
        </div>


    </ui-main>
</template>
<script>
import checker from './checker.js'
export default {
    data() {
        return {
            cccc:'',
            showPass: false,
            form: {
                user: '',
                pass: '',
                code: '',//登陆失败5次后需要图片验证码
            },
            loginType: '1',  // 1用户  2技师
            codeImgSrc: '',
            baseUrl: '',
            dataType: 'jsonp'
        }
    },
    mounted() {
        // 关闭闪屏
        // navigator.splashscreen.hide();
        //            let data = JSON.parse(localStorage.getItem('userdata'))
        this.form.user = localStorage.getItem('phone')
        this.form.pass = localStorage.getItem('password')
        this.loginType = localStorage.getItem('loginType')

        this.$axios().then(({ config }) => {
            this.baseUrl = config.baseURL
        })
<<<<<<< HEAD
        this.login()
=======

        // 获取cip和推送ID
        // ?cip=192.200.200.21&registrationID=127hfy
        let searchStr = location.search
        let params = searchStr.split('&')
        // params[0]&&params[0] 判断是否有值
        let cip = params[0] && params[0].replace('?cip=', '')
        let registrationID = params[1] && params[1].replace('registrationID=', '')
        
        localStorage.setItem('cip', cip)
        localStorage.setItem('registrationID', registrationID)
        // this.getClientRealIp()
>>>>>>> 34ad4763d179edfa949912d10c090af647b05e78
    },
    computed: {
        getCodeUrl() { 
            return this.baseUrl + '/index.php?g=api&m=checkcode&a=index'
        }
    },
    methods: {
        
        login() {
            // let basewxurl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdf0cb1f63ab829de&redirect_uri=https%3A%2F%2Fwww.gyclit.top%2Fgyclit-web%2Fphone%2Fgyjdb%2Fwxback&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
            // window.location.reload(basewxurl)
            // this.$indicator.open()
            // let basewxurl = 'https://www.gyclit.top/gyclit-web/phone/wxGzhLogin'
            // this.$axios({
            //     method:'GET',
            //     url: basewxurl,
            // }).then(({data}) => {
            //     this.$indicator.close()
            //     let resultStr = data

            //     // this.$messagebox.alert(resultStr)
            //     console.log('ipContent = ' + resultStr);

<<<<<<< HEAD
            // }).catch((error) => {
            //     this.$indicator.close() 
            //     // this.$messagebox.alert(error)
            //     this.cccc = error
            // })
=======
            if (this.utils.isBlank(this.form.user) || this.utils.isBlank(this.form.pass)) {
                this.$toast('用户名或密码不能为空')
                return
            }

            if (!checker.mobile(this.form.user) && !checker.email(this.form.user)) {
                this.$toast('用户名格式不正确')
                return
            }
            
            // // 用户
            let now_user_type = '1'  
            // 技师
            // let now_user_type = '2'  

            this.$indicator.open()
            this.$http.post('/phone/userinfor/h5login', {
                username: this.form.user,
                passwd: this.form.pass,
                user_type: now_user_type
            }).then(({ data }) => {
                this.$indicator.close()
                console.log(this.form.user + '登陆结果:', data.content.length + JSON.stringify(data));
                if (data.code == '1') {
                    if (data.content.length == 2) {
                        //弹框提示
                        // this.$messagebox({
                        //     title: '提示',
                        //     message: '请选择身份登录',
                        //     showConfirmButton: true,
                        //     confirmButtonText: '技师版',
                        //     showCancelButton: true,
                        //     cancelButtonText: '用户版',
                        //     cancelButtonClass: 'ui-cancelButton',
                        //     closeOnClickModal: false
                        // }).then(action => {
                        //     var arrayTemp = data.content;
                        //     //技师版
                        //     if (action === 'confirm') {
                        //         this.loginType = '2'
                        //         arrayTemp.shift();
                        //         data.content = arrayTemp;
                        //         this.setLocalStorage(data)
                        //         this.$router.push('/home-jishi');
                        //     } else {//用户版
                        //         this.loginType = '1'
                        //         arrayTemp.pop();
                        //         data.content = arrayTemp;
                        //         this.setLocalStorage(data)
                        //         this.$router.push('/home');
                        //     }
                        // })
                        let hasuser = false
                        for (let i = 0; i < data.content.length; i++) {
                            let userdata = data.content[i]
                            let phone = userdata.phone
                            let user_type = userdata.user_type
                            console.log(phone + '--' + user_type);
                            if (this.form.user == phone && now_user_type == user_type) {
                                this.setLocalStorage(data)
                                if (user_type == '2') {
                                    this.$router.push('/home-jishi');
                                } else {
                                    this.$router.push('/home');
                                } 
                                hasuser = true
                            }
                        }
                        if (!hasuser) {
                            this.$toast('用户名或密码有误，请重新尝试...')
                            localStorage.setItem('isLogin', 0)
                        }
                    } else if (data.content.length == 1) {
                        this.setLocalStorage(data)
                        console.log('sdfsdf' + data.content)
                        if (data.content[0].user_type == '2') {
                                this.$router.push('/home-jishi');
                            } else {
                                this.$router.push('/home');
                            }
                        if (data.content[0].user_type == now_user_type) {
                            if (data.content[0].user_type == '2') {
                                this.$router.push('/home-jishi');
                            } else {
                                this.$router.push('/home');
                            }
                        } else {
                            this.$toast('用户名或密码有误，请重新尝试...')
                            localStorage.setItem('isLogin', 0)
                        }
                    }
                } else if (data.code == '-1') {
                    this.$toast('用户名或密码有误，请重新尝试...')
                    localStorage.setItem('isLogin', 0)
                } else {
                    this.$toast(data.msg)
                    localStorage.setItem('isLogin', 0)
                }
            }).catch((err) => {
                // alert(err)
                localStorage.setItem('isLogin', 0)
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
>>>>>>> 34ad4763d179edfa949912d10c090af647b05e78
        },
        setLocalStorage(data) {
            // alert( 'data值' + JSON.stringify(data));
            localStorage.setItem('userdata', JSON.stringify(data))
            localStorage.setItem('phone', this.form.user)
            localStorage.setItem('password', this.form.pass)
            localStorage.setItem('loginType', this.loginType)
            localStorage.setItem('isLogin', 1)
        },
        getCode() {// 获取新的验证码
            this.codeImgSrc = null
            this.$nextTick(() => {
                this.codeImgSrc = this.getCodeUrl
            });
        },
        getClientRealIp() {
            this.$indicator.open()
            this.$axios({
                method:'GET',
                url: 'http://106.14.217.147/sbb-web/phone/openkey/getClientRealIp',
            }).then(({data}) => {
                this.$indicator.close()
                let code = data.code
                let cip = data.content[0]
                this.$toast('我的IP地址是' + cip)
                localStorage.setItem('cip', cip)
            }).catch(() => {
                this.$indicator.close() 
            })
        }
    }
}
</script>

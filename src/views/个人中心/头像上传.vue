<style lang="scss" scoped>
    .head-size{
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background-color: #ddd;
    }
    .input-file{
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1;
        opacity: 0;
        display: block;
        width: 100%;
        border:none;
    }
</style>
<template>
    <div class="relative">
        <input type="file" ref="input-upload" class="input-file" @change="postImg($event)" :disabled="uploading">
        <icon name="circle-o-notch" spin class="head-size" v-if="uploading" ></icon>
        <ui-img :src="localView || userUrl" class="head-size" v-else></ui-img>
    </div>
</template>
<script>
    import lrz from 'lrz'
    export default {
        props: ['url', 'user-url'],
        data () {
            return {
                filepath: '',//预上传的图片url
                localView: '', //本地预览url
                uploading: false,//上传状态,
                usrdata:null,
                userhead:''//用戶頭像
            }
        },
        mounted(){
            var userData = localStorage.getItem('userdata')
            if (userData == null || userData == undefined || userData == 'null' || userData == 'undefined' || userData == "") {
                this.$toast('获取用户信息失败,请稍后重试...')
                return
            }

            userData = JSON.parse(userData)
            this.usrdata = userData.content[0]
            this.getUserHead()
        },
        methods: {
            uploadFinish(msg){
                msg && this.$toast(msg)
                this.uploading = false
            },
            postImg(e){ //上传图片
                let input = e.target
                let files = input.files
                let file = files[0]
                let formData = new FormData()

                // 压缩
                lrz(file, {
                    width: 120
                })
                .then( rst => {
                    // 处理成功会执行
                    console.log('图片已压缩：', rst);
                    var id = this.usrdata.id
                    formData.append('file', rst.file, file.name)
                    formData.append('file_type', '1')
                    formData.append('parent_id', id)

                    this.uploading = true

                    // 先上传到ftp, 拿到url
                    this.$axios({
                        method:'POST',
                        url:'phone/openkey/uploadMobileFile',
                        data: formData,
                        headers:{'Content-Type':'multipart/form-data'},
                    }).then(({data}) => {
                        console.info('上传图片成功', data);
                        // 本地回显
                        this.localView = window.URL.createObjectURL(file)
                         this.uploading = false
                        this.filepath = data.filepath
                        this.editUser()
                    }).catch(this.uploadFinish)

                }).catch( err=> {
                    // 压缩处理失败会执行
                    this.$toast('图片压缩失败，请换一张试试')
                    this.uploading = false
                    console.warn('图片压缩失败:', err);
                })

                /* var id = this.usrdata.id
                formData.append('file', file, file.name)
                formData.append('file_type', '1')
                formData.append('parent_id', id)

                this.uploading = true

                // 先上传到ftp, 拿到url
                this.$axios({
                    method:'POST',
                    url:'phone/openkey/uploadMobileFile',
                    data: formData,
                    headers:{'Content-Type':'multipart/form-data'},
                }).then(({data}) => {
                    console.info('上传图片成功', data);
                    // 本地回显
                    this.localView = window.URL.createObjectURL(file)
                     this.uploading = false
                    this.filepath = data.filepath
                    this.editUser()
                }).catch(this.uploadFinish) */
                
            },
            editUser(){ //提交头像 url
                console.log('提交图片url:', this.filepath);
                // 在这里把图片暂存的url提交给服务器保存
                //....
            },
             getUserHead() {
                if (this.usrdata == null) {
                    return
                }
                this.$http.post('/phone/userinfor/getUserHead', {
                    uid: this.usrdata.id,
                }).then(({ data }) => {
                    this.$indicator.close()
                    if (data.code == '1') {
                        this.$axios().then(({config})=>{
                            this.localView = config.baseURL + '/' + data.content[0].archives_url
                        })
                    }

                }).catch(() => {
                    this.$indicator.close()
                    this.$toast('服务器繁忙')
                })
            }
        },
    }
</script>

<style lang="scss">
    .scoped-grzlws-picker{
        position: fixed;
        bottom: 0;
        left:0;
        right: 0;
        background-color: #fff;
        .picker-slot-wrapper{
            height: 260px;
        }
    }
</style>

<template>
    <ui-main>
        <mt-header slot="header" title="个人资料完善">
            <ui-button icon="back" slot="left"></ui-button>
        </mt-header>

        <mt-field label="姓名" placeholder="请输入真实姓名" v-model="form.name"></mt-field>
        <mt-field label="身份证号" placeholder="请输入身份证号" v-model="form.IDnum" :attr="{max:18,min:0}"></mt-field>
        <mt-cell title="所在地区" is-link @click.native="pickerVisible=true">
            <span style="left: 0;position: absolute;left: 5.8rem;">{{ form.address.length>14 ? form.address.substring(0,14)+'...' : form.address }}</span>
        </mt-cell>
        <mt-checklist title="服务项(可选多个)" v-model="form.server" :options="serverOpt">
        </mt-checklist>

        <p class="f06 ml03 f-color-text">上传身份证照片 (可上传多张)</p>
        <div class="p05">
            <div v-for="item in serverImgList" class="upload-item">
                <ui-img :src="item.archives_url" :key="item.id" class="w-100 h-100"></ui-img>
                <div class="upload-del" @click="onRemove(item)">删除</div>
            </div>

            <vue-core-image-upload :class="['upload-item','upload-btn']" :crop="false" @imageuploaded="onSuccess" @imagechanged="onChange" :data="{file_type:'2', parent_id: '111'}" inputOfFile="file" :max-file-size="5242880" compress="50" :multiple="true" :multiple-size="4" text="" :maxWidth="500" :maxHeight="500" :credentials="true">
            </vue-core-image-upload>
        </div>

        <!-- 地区选择器 -->
        <div v-show="pickerVisible" class="scoped-grzlws-picker" >
            <div class="flex row-between ui-bg-orange f-color-white">
                <span class="p05" @click="save_cancel">取消</span>
                <span class="p05" @click="save_confirm">确定</span>
            </div>
            <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
        </div>
        <mt-button v-show="!pickerVisible" @click="onChangeData" class="ui-button-large ui-bg-gradient mt1 mb1">保存</mt-button>
        <iframe id="geoPage" width=0 height=0 frameborder=0 style="display:none;" scrolling="no" src="https://apis.map.qq.com/tools/geolocation?key=NONBZ-2VT33-DOI3A-35PVY-CZ7M6-ZRBFR&referer=锁帮帮">
        </iframe>
        
    </ui-main>
</template>
<script>
import VueCoreImageUpload from 'vue-core-image-upload';
import AddressUtil from './address.js'
export default {
    components: {
        VueCoreImageUpload,
    },
    data() {
        return {
            // 地区选择配置
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot3',
                }, {
                    flex: 1,
                    values: [],
                    className: 'slot3',
                }, {
                    flex: 1,
                    values: [],//区域要根据城市进行动态改变
                    className: 'slot3',
                },
            ],
            form: {
                name: '',
                IDnum: '',
                address: '',
                server: [],
                userData: null
            },
            pickerVisible:false,
            selAddr:["","",""],
            showAddr:["","",""],
            cur: [0,0,0],
            serverOpt: [
                { label: '开锁服务', value: '01' },
                { label: '换锁服务', value: '02' },
                { label: '保修服务', value: '03' },
                { label: '汽车钥匙', value: '04' },
                { label: '民用钥匙', value: '05' },
            ],
            action: '',//上传地址
            originFileList: [],//服务器上的图片列表,
            serverImgList: [],//展示给用户
            hasDeletePicId: '',
            weburl: ''
        }
    },
    mounted() {

        // this.initMap()

        let usrdata = localStorage.getItem('userdata')
        if (this.utils.isBlank(usrdata)) {
            this.$toast('获取用户信息失败,请稍后重试...')
            return
        }

        usrdata = JSON.parse(usrdata)
        this.form.userData = usrdata.content[0]
        console.log('this.form.userData:', this.form.userData);
        //service addr
        this.$axios().then(({ config }) => {
            this.weburl = config.baseURL + '/'
            this.action = (config.baseURL + '/phone/openkey/uploadMobileFile')
            this.getUserInfor()
        })

        var addressUtil =  AddressUtil.getAddress(); 
        //初始化省市县
        for(var i=0;i<addressUtil.length;i++){
            this.slots[0].values.push(addressUtil[i].name)
        }

        for(var i=0;i<addressUtil[0].sub.length;i++){
            this.slots[1].values.push(addressUtil[0].sub[i].name)
        }

        for(var i=0;i<addressUtil[0].sub[0].sub.length;i++){
            this.slots[2].values.push(addressUtil[0].sub[0].sub[i].name)
        }
        this.selAddr = [this.slots[0].values[0],this.slots[1].values[0],this.slots[2].values[0]]
    },
    methods: {
        onValuesChange(picker, values) {
            // 这里判断values中的城市改变, 则重新给三级地区赋值
            var addressUtil =  AddressUtil.getAddress();
            //省动---->>市动区县动
            var cur_p = this.slots[0].values.indexOf(values[0])
            var cur_c = 0
            if (cur_p < 0 || cur_p > addressUtil.length) {
                return
            }
            if (cur_p != this.cur[0]) {
                this.slots[1].values = []
                this.slots[2].values = []
                for(var i=0;i<addressUtil[cur_p].sub.length;i++){
                    this.slots[1].values.push(addressUtil[cur_p].sub[i].name)
                }
                for(var i=0;i<addressUtil[cur_p].sub[0].sub.length;i++){
                    this.slots[2].values.push(addressUtil[cur_p].sub[0].sub[i].name)
                }
            }
            cur_c = this.slots[1].values.indexOf(values[1])
            if (cur_c < 0 || cur_c>this.slots[1].values.length) {
                return
            }
            if(cur_c != this.cur[1]){
                this.slots[2].values = []
                for(var i=0;i<addressUtil[cur_p].sub[cur_c].sub.length;i++){
                    this.slots[2].values.push(addressUtil[cur_p].sub[cur_c].sub[i].name)
                }                   
             }
            this.cur = [cur_p,cur_c,0]
            this.selAddr = values
        },
        save_confirm(){
            this.pickerVisible = false
            this.showAddr = this.selAddr
            this.form.address = this.selAddr[0] + '-' + this.selAddr[1] + '-' + this.selAddr[2]
        },
        save_cancel(){
            this.pickerVisible = false
        },
        onSuccess(res) {
            // console.log('上传图片成功',res);

            // 后台接收多张图片,处理返回真实图片url, 在回传给imgList
            // let newList = []
            // newList.push(...this.imgList)//先合并历史图片

            // // 增加新的图片
            // newList.push(res.data.preview_url)

            // // 回传
            // this.$emit('update:imgList', newList)
        },
        onChange(fileList) {
            if (fileList.length > 1) {//多图
                for (let i = 0; i < fileList.length; i++) {
                    let url = URL.createObjectURL(fileList[i])
                    this.serverImgList.push({
                        archives_url: url,
                        id:'',
                        obj:fileList[i]
                    })
                }
            } else {//单图上传
                this.serverImgList.push({
                    archives_url: URL.createObjectURL(fileList),
                    id:'',
                    obj:fileList
                })
            }
        },
        onRemove(url) {
            this.serverImgList.forEach((item, i) => {
                if (item === url) {
                    this.removeWebPic(url)
                    this.serverImgList.splice(i, 1)
                    return
                }
            })

        },
        removeWebPic(item) {
            if (this.utils.isBlank(item.archives_url)) {
                this.$toast('找不到图片链接...')
                return
            }

            if (!this.utils.isBlank(item.id) && this.hasDeletePicId.indexOf(item.id) == -1) {
                this.hasDeletePicId += (item.id + ',')
            }
        },
        onChangeData() {
            if (this.utils.isBlank(this.form.name)) {
                this.$messagebox.alert('请填写您的真实姓名').then(action => { }).catch(() => { })
                return
            }
            // if (!this.utils.checkIdNumber(this.form.IDnum)) {
            //     this.$messagebox.alert('请填写您的有效身份证号码').then(action => { }).catch(() => { })
            //     return
            // }
            
            if (this.utils.isBlank(this.showAddr[0])
                    || this.utils.isBlank(this.showAddr[1])
                    || this.utils.isBlank(this.showAddr[2])) {
                this.$messagebox.alert('获取位置信息异常~').then(action => { }).catch(() => { })
                return
            }
            this.$messagebox.confirm('确认更新您的个人信息?').then(action => {
                if (action == 'confirm') {
                    var serviceItems = ''
                    for (var index = 0; index < this.form.server.length; index++) {
                        var element = this.form.server[index];
                        if (!this.utils.isBlank(element)) {
                            serviceItems += (element + ',')
                        }
                    }
                    serviceItems = (serviceItems.length > 0 ? serviceItems.substr(0, serviceItems.length - 1) : '')
                    this.hasDeletePicId = (this.hasDeletePicId.length > 0 ? this.hasDeletePicId.substr(0, this.hasDeletePicId.length - 1) : '')
                    for (let i = 0; i < this.serverImgList.length; i++) {
                        var temp = this.serverImgList[i]
                        if (this.utils.isBlank(temp.id)) {
                            console.log('temp----',temp)
                            this.uploadPic(temp.obj)
                        }
                    }
                    // 个人信息更新
                    this.$http.post('/phone/js/user/update', {
                        id: this.form.userData.id,//'404848955d92aaec015d92adbfc80002'
                        name: this.form.name,
                        idNumber: this.form.IDnum,
                        city: this.showAddr[1],
                        serviceTypesItems: serviceItems,
                        deletedIdNumberImageIds: this.hasDeletePicId,
                        province:this.showAddr[0],
                        county:this.showAddr[2],
                    }).then(({ data }) => {
                        this.$indicator.close()
                        console.log('onChangeData:', data);
                        if (data.code == 1 && data.content.length > 0) {
                            this.$toast('个人信息更新成功')
                            localStorage.setItem('userdata', JSON.stringify(data))
                            this.form.userData = data.content[0]
                        }
                    }).catch(() => {
                        this.$indicator.close()
                        this.$messagebox.alert('系统繁忙')
                    })
                }
            }).catch(() => { })

        },
        uploadPic(file) {
            // 采用axios提交图片

            let formData = new FormData();
            formData.append('file_type', '2');
            formData.append('parent_id', this.form.userData.id);
            formData.append('file', file);
            this.$indicator.open()
            this.$axios({
                method: 'POST',
                url: this.action,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            }).then((data) => {
                console.log(data);
                if (data.data.code != '1') {
                    this.$toast('图片上传异常,请稍后重试~')
                }
                // data.data.content[0].archives_url = this.weburl + data.data.content[0].archives_url
                // this.serverImgList.push(data.data.content[0])
                this.$indicator.close()
            }).catch(() => {
                this.$indicator.close()
            })
        },
        getUserInfor() {
            // 个人信息更新
            this.$http.get('/phone/js/user/my', {
                params: {
                    id: this.form.userData.id,//'404848955d92aaec015d92adbfc80002'
                }
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1' && data.content.length > 0) {
                    var usrdata = data.content[0]
                    this.form.name = usrdata.name
                    this.form.address = usrdata.province + '-' + usrdata.city + '-' + usrdata.county
                    this.showAddr = [usrdata.province,usrdata.city,usrdata.county]
                    this.form.IDnum = usrdata.id_number
                    this.form.server = usrdata.service_types.split(',')
                    var picUrl = usrdata.id_number_url.split('|')
                    var picId = usrdata.file_number_id.split('|')
                    var picArr = []
                    for (var index = 0; index < picUrl.length; index++) {
                        if (!this.utils.isBlank(picUrl[index]) && !this.utils.isBlank(picId[index])) {
                            picArr.push({
                                archives_url: this.weburl + picUrl[index],
                                id: picId[index]
                            })
                        }
                    }
                    this.serverImgList = picArr
                    this.originFileList = picArr
                }
            }).catch(() => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
        },
        initMap() {
            var _self = this;
            window.addEventListener('message', function(event) {
                // 接收位置信息
                var loc = event.data;
                if (loc && loc.module == 'geolocation') {
                    _self.form.address = loc.city
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
        }
    },
}
</script>
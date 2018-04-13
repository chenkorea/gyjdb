<style lang="scss" scoped>
    .line-sv{
        width: 100%;
        height: 1px;
        border-bottom: 1px solid #F0F0F0;
    }
    .con-sel {
        font-size: 0.8rem;
    }

    .fuwusel {
        background: #FFF;
    }
</style>
<template>
    <ui-main>
        <mt-header :title="headName" slot="header">
            <ui-button icon="back" slot="left"></ui-button>
        </mt-header>

        <!-- 功能列表 -->
        <ui-select :label="label1" v-model="form.type" placeholder="请选择" :change="selectFWType" class="con-sel">
            <ui-option v-for="item in typeOpt" :key="item.id" :value="item.id" :label="item.service_item" class="fuwusel"></ui-option>

        </ui-select>
        <mt-cell :title="label2" is-link @click.native="uploadPage=true">
            <span>已选择{{this.form.imgs.length}}张图片</span>
        </mt-cell>
        <mt-cell title="服务地址" is-link @click.native="addressPage=true" class="line-sv">
            <span>{{ form.address != null && form.address.length>12 ? form.address.substring(0,12)+'...' : form.address }}</span>
        </mt-cell>
        <div class="line-v"></div>
        <ui-select :label="label3" v-model="form.baoxiutype" placeholder="请选择" :change="selectBXType" v-if="serviceType == '03'"  class="con-sel">
            <ui-option v-for="item in baoxiuOpt" :key="item.id" :value="item.id" :label="item.name"></ui-option>
        </ui-select>
        <mt-cell title="服务时间" is-link @click.native="serverTimePage=true">
            <span>{{form.time || '马上'}}</span>
        </mt-cell>
        <mt-cell title="备注" is-link @click.native="remarkPage=true">
            <span>{{ form.remark != null &&  form.remark.length>12 ? form.remark.substring(0,12)+'...' : form.remark }}</span>
        </mt-cell>

        <mt-button @click="submit" type="primary" class="ui-button-large mt1 mb1">提交</mt-button>

        <!-- 介绍页 写死 -->
        <introduction></introduction>


        <!-- 弹出层 -->
        <ui-page v-model="uploadPage" title="上传图片" slot="popup">
            <uploadImg :img-list.sync="form.imgs"></uploadImg>
        </ui-page>

        <ui-page v-model="addressPage" title="服务地址" slot="popup">
            <addressPage :address.sync="form.address" :popup.sync="addressPage"></addressPage>
        </ui-page>

        <ui-page v-model="serverTimePage" title="服务时间" slot="popup">
            <serverTime :data.sync="form.time"></serverTime>
        </ui-page>

        <ui-page v-model="remarkPage" title="备注" slot="popup">
            <textarea v-model="form.remark" class="w-100 p05 pt1 f08 ui-border" style="height:200px" placeholder="请快一点吧,我赶时间呢!"></textarea>
        </ui-page>

    </ui-main>
</template>
<script>
    import uploadImg from './uploadImg'
    import addressPage from './服务地址'
    import serverTime from './选择服务时间'
    import introduction from './服务优势与说明'
    export default {
        components:{
            uploadImg,
            addressPage,
            serverTime,
            introduction
        },
        data(){
            return {
                form:{
                    type:'',
                    imgs:[],
                    address:'',
                    time:'',
                    remark:'',
                    baoxiutype:'1'
                },
                typeOpt:[],
                baoxiuOpt:[
                    {id: '1', name: '保修期内'},
                    {id: '2', name: '保修期外'}
                ],
                uploadPage:false,
                addressPage:false,
                serverTimePage:false,
                remarkPage:false,
                serviceType: '01',
                headName:'开锁服务',
                label1:'',
                label2:'',
                label3:'保修期',
                cityAr:[]
            }
        },
        mounted(){
            let addr = localStorage.getItem('selectAddr')
            this.form.address = addr
            this.serviceType = this.$route.query.serviceType
            if (this.form.time == null || '' == this.form.time) {
                this.form.time = '马上'
            }
            if (this.serviceType == '01') {
                this.headName = '开锁服务'
                this.label1 = '开锁类别'
                this.label2 = '开启锁具图片'
            } else if (this.serviceType == '02') {
                this.headName = '换锁服务'
                this.label1 = '换锁类别'
                this.label2 = '更换锁具图片'
            } else if (this.serviceType == '03') {
                this.headName = '保修服务'
                this.label1 = '报修锁具类别'
                this.label2 = '报修锁具图片'
                this.label3 = '保修期'
            } else if (this.serviceType == '04') {
                this.headName = '汽车钥匙'
                this.label1 = '服务类别'
                this.label2 = '钥匙车辆图片'
            } else if (this.serviceType == '05') {
                this.headName = '民用钥匙'
                this.label1 = '服务类别'
                this.label2 = '配置钥匙图片'
            }
            this.getServiceType()
            // this.getAppAbleCity()
        },
        watch:{
            uploadPage(v){
                if (v==false) {
                    // 上传窗口关闭
                    console.log('当前图片列表',this.form.imgs);
                }
            },
            'form.type'(v){
                console.log(v);
            }
        },
        methods:{
            /** 选址服务项目 */
            selectFWType(value) {
                this.form.type = value
            },
            /** 选是否保修期 */
            selectBXType(value) {
                this.form.baoxiutype = value
            },
            /** 提交订单 */
            submit() {
                let userdata = JSON.parse(localStorage.getItem('userdata'))
                let uid = userdata.content[0].id
                let user_name = userdata.content[0].name
                let phone = userdata.content[0].phone
                // 获取选中的服务项目
                let serviceItem = {}
                for (let index = 0; index < this.typeOpt.length; index++) {
                    let element = this.typeOpt[index];
                    if (this.form.type == element.id) {
                        serviceItem = element
                        break
                    }
                }
                // 服务时间
                let timeType = '02'
                if (this.form.time  == '马上')
                    timeType = '01'
                // 构建用户订单对象
                let userOrder = {
                    user_id: uid,
                    service_type: serviceItem.service_type,
                    service_item_id: serviceItem.id,
                    service_address: this.form.address,
                    service_time: timeType,
                    service_time_describe: this.form.time,
                    remarks: this.form.remark,
                    order_type: '1',
                    guarantee_type: this.form.baoxiutype,
                    user_name: user_name,
                    user_phone: phone,
                    popedom: '',
                    popedom_name: ''
                }

                console.log(userOrder.service_address);

                if (this.form.type == null || '' == this.form.type) {
                    this.$messagebox.alert('请选择服务项目')
                    return;
                }

                if (this.form.address == null || '' == this.form.address) {
                    this.$messagebox.alert('请选择服务地址')
                    return;
                }

                // 判断城市是否可以下单
                let is_able = true
                // for (let i = 0; i < this.cityAr.length; i++) {
                //     let city_name = this.cityAr[i].city;
                //     let city_able = this.cityAr[i].is_able;
                //     if (this.form.address.indexOf(city_name) >= 0 && city_able == '1') {
                //         is_able = true;
                //         break;
                //     }
                // }

                if (is_able) {
                    this.$indicator.open()

                    this.$axios({
                        method: 'POST',
                        url: '/phone/openkey/createUserOrderH5App',
                        data: userOrder,
                        headers:{'Content-Type': 'application/json'},

                    }).then((data) => {
                        this.$indicator.close()
                        if (data.data.code == '1') {
                            this.$messagebox({
                                title: '订单提交成功',
                                message: '请稍等，将会有师傅和您联系！',
                            }).then(() => {
                                this.$router.push('/home')
                            })
                        }
                    }).catch(() => {
                        this.$indicator.close()
                        this.$messagebox.alert('系统繁忙')
                    })
                } else {
                    this.$messagebox.alert('当前城市未开通服务！')
                }
            },
            /** 获取服务项目 */
            getServiceType() {
                this.$indicator.open()
                this.$http.post('/phone/openkey/getServiceType',{
                    serviceType : this.serviceType
                }).then(({data}) => {
                    this.$indicator.close()
                    console.log(data.content);
                    this.typeOpt = data.content
                    
                }).catch(() => {
                    this.$indicator.close()
                    this.$messagebox.alert('系统繁忙')
                })
            },
            getAppAbleCity() {
                this.$http.post('/phone/openkey/getAppAbleCity',{
                    uid : '1',
                }).then(({data}) => {
                    let code = data.code;
                    if (code == '1') {
                        this.cityAr = data.content
                        console.log(data.content);
                    }
                }).catch(() => {
                })
            }
            // onChange(v){
            //     console.log(v);
            // }
        },
    }
</script>
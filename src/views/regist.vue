<<style>
.split-view-1 {
    width: 100%;
    height: 1px;
    background: #f0f0f0;
}

.split-view {
    width: 100%;
    height: 1px;
    background: #f0f0f0;
}

.info-text {
    margin: 25px;
    font-size: .8rem;
    color: #333333;
}

.top-10 {
    margin-top: 25px;
}

</style>

<template>
    <ui-main class="bg-white">
        <!-- <mt-header :title="getTitle" slot="header">
            <ui-button icon="back" slot="left"></ui-button>
        </mt-header> -->

        <div class="bg-white flex flex-1 column">
            <!-- <ui-logo-title></ui-logo-title> -->
            <p class="f08 info-text text-center">绑定用户信息</p>
            
            <ui-select :label="label1" v-model="form.type" placeholder="请选择" :change="selectUserType" class="con-sel">
                <ui-option v-for="item in typeUser" :key="item.id" :value="item.id" :label="item.name" class="fuwusel"></ui-option>

            </ui-select>
            <div class="split-view-1"></div>
            <ui-select :label="label2" v-model="form.area" placeholder="请选择" :change="selectAreaType" class="con-sel">
                <ui-option v-for="item in typeOpt" :key="item.id" :value="item.id" :label="item.area_name" class="fuwusel"></ui-option>

            </ui-select>
            <div class="split-view-1"></div>
            <ui-select :label="label3" v-model="form.school" placeholder="请选择" :change="selectSchoolType" class="con-sel" v-if="isShow">
                <ui-option v-for="item in typeSchool" :key="item.id" :value="item.id" :label="item.name" class="fuwusel"></ui-option>

            </ui-select>

            <div class="split-view-1"></div>

            <ui-field type="text" icon="home" v-model.trim="form.school_name" placeholder="请输入学校名称" v-if="isShow"></ui-field>

            <div class="split-view-1"></div>
            
            <ui-field type="text" icon="user" v-model.trim="form.idcard" placeholder="请输入身份证"></ui-field>

            <div class="split-view-1"></div>

            <ui-field type="number" icon="phone" v-model.trim="form.phone" placeholder="请输入电话号码"></ui-field>

            <div class="split-view-1"></div>

            <mt-button class="ui-button-large ui-bg-gradient top-10" @click="submitData">立即绑定</mt-button>
        </div>
    </ui-main>
</template>
<script>
import checker from '@/views/checker.js'
import clickCooling from '../mixins/click-cooling.js'
export default {
    mixins: [clickCooling],
    data() {
        return {
            form: {
                type: '',
                school: '',
                school_name: '',
                area: '',
                idcard: '',
                phone: ''
            },
            uid:'',
            typeOpt:[],
            typeUser:[],
            typeSchool:[],
            label2:'请选择区县',
            label1:'请选择用户类型',
            label3:'选择学校类型',
            isShow: false,
        }
    },
    mounted() {
        this.uid = this.$route.query.uid

         this.typeUser = [
            {id:'1',name:"学生"},
            {id:'2',name:"群众"}];

         this.typeSchool = [
            {id:'1',name:"小学"},
            {id:'2',name:"初中"}, 
            {id:'3',name:"高中"}, 
            {id:'4',name:"中职"}];
        this.getArea()
    },
    methods: {
        /** 选址区县 */
        selectAreaType(value) {
            this.form.area = value
        },
        /** 选址用户 */
        selectUserType(value) {
            this.form.type = value

            if (this.form.type == '1') {
                this.isShow = true
            } else {
                this.isShow = false
            }
        },
        /** 选址学校 */
        selectSchoolType(value) {
            this.form.school = value
        },
        submitData() {
            // 组合数据
            if (this.form.type == undefined || this.form.type == null || this.form.type == '') {
                this.$toast('请选择用户类型')
                return
            } else {
                if (this.form.type == '1') {
                    if (this.form.school == undefined || this.form.school == null || this.form.school == '') {
                        this.$toast('请选择学校类型')
                        return
                    } else {
                        if (this.form.school_name == undefined || this.form.school_name == null || this.form.school_name == '') {
                            this.$toast('请输入学校名称')
                            return
                        }
                    }
                }
            }
            if (this.form.area == undefined || this.form.area == null || this.form.area == '') {
                this.$toast('请选择所在地区')
                return
            }

            if (this.form.idcard == undefined || this.form.idcard == null || this.form.idcard == '') {
                this.$toast('请输入身份证号')
                return
            }

            if (this.form.idcard == undefined || this.form.phone == null || this.form.phone == '') {
                this.$toast('请输入手机号')
                return
            }
            

            this.$indicator.open()
            this.$http.post('/phone/gyjdb/bindUser', {
                userType: this.form.type, 
                area: this.form.area, 
                school: this.form.school, 
                school_name: this.form.school_name, 
                idcard: this.form.idcard, 
                phone: this.form.phone,
                uid: this.uid
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1') {
                    this.$toast('绑定成功')
                    this.goSuccess()

                } else {
                    this.$toast('绑定失败')
                }
            }).catch((err) => {
                this.$indicator.close()
                this.$messagebox.alert('绑定失败')
            })
        },
        getArea() {

            this.$indicator.open()
            this.$http.post('/phone/gyjdb/getArea', {
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1') {
                    this.typeOpt = data.content
                }
            }).catch((err) => {
                this.$indicator.close()
            })
        },
        goSuccess(id){
            this.$router.push({
                name:'首页',
                query:{
                    uid:this.uid
                }
            })
        },
    },
    computed: {
        // isShow() {
        //     return this.form.type == '1'?true:false
        // },
    },
}
</script>

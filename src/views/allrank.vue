<style lang="scss" scoped>
    @import '~@/scss/public.scss';
    $ui-color-blue: #26a2ff;

    .rank-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #F0F0F0;
    }

    .rank-text-1 {
        display: inline-block;
        text-align: center;
        font-size: 16px;
        margin-left: 10px;
        margin-right: 10px;
        color: #333333;
    }

    .rank-text-2 {
        width: 50px;
        height: 50px;
        border-radius:50%; 
        display: inline-block;
        background: #43CD80;
        text-align: center;
        font-size: 16px;
        margin-left: 10px;
        margin-right: 10px;
        padding-top: 15px;
        color: #FFFFFF;
    }

    .user-head {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .score-view {
        display: inline-block;
        justify-content: center;
    }

    .user-name {
        height: 20px;
        font-size: 16px;
        color: #333333;
    }

    .user-content {
        height: 20px;
        color: #666666;
        font-size: 15px;
    }
    
    .more-text {
        width: 100%;
        height: 50px;
    }

    .nav-view {
        display: inline-block;
        text-align: center;
        width: 100%;
        background: #396fbf;
    }

    .sel-view-nor {
        float:left;
        width: 20%;
        height: 40px;
        padding-top: 8px;
        font-size: 15px;
        color:#FFF; 
    }

    .sel-view-sel {
        float:left;
        width: 20%;
        height: 40px;
        padding-top: 8px;
        font-size: 15px;
        color:#FFF; 
        background: #154893;
    }
    
</style>
<template>
    <ui-main class="bg-white">

        <div class="nav-view">
            <div :class="sel_index==0?'sel-view-sel' : 'sel-view-nor'" @click="selectType(0)">全市</div>
            <div :class="sel_index==1?'sel-view-sel' : 'sel-view-nor'" @click="selectType(1)">小学</div>
            <div :class="sel_index==2?'sel-view-sel' : 'sel-view-nor'" @click="selectType(2)">初中</div>
            <div :class="sel_index==3?'sel-view-sel' : 'sel-view-nor'" @click="selectType(3)">高中</div>
            <div :class="sel_index==4?'sel-view-sel' : 'sel-view-nor'" @click="selectType(4)">职高</div>
        </div>

        <!-- 个人分组排名列表 -->
        <div class="rank-view" v-if="sel_index==0">
            <div class="rank-item" v-for="(item, index) in examrank" @click="showsss(item)">
                <p class="rank-text-1">{{index+1}}</p>
                <img class="user-head" :src="item.head_img" alt="">
                <div class="score-view">
                    <p class="user-name">{{item.nickname}}</p>
                    <p class="user-content">总分：{{item.score}}分</p>
                </div>
            </div>
            <p class="f08 text-center more-text" @click="addMore">加载更多</p>
        </div>

        <!-- 学校分组排名列表 -->
        <div class="rank-view" v-if="sel_index!=0">
            <div class="rank-item" v-for="(item, index) in schools" @click="showsss(item)">
                <p class="rank-text-2">{{index+1}}</p>
                <div class="score-view">
                    <p class="user-name">{{item.school}}</p>
                    <p class="user-content">平均分：{{item.score}}分  参赛人数：{{item.people_num}}人</p>
                </div>
            </div>
        </div>

        
    </ui-main>
</template>
<script>
import checker from './checker.js'

export default {
    data() {
        return {
            uid:'',
            page_num:1,
            examrank:[],
            schools:[],
            sel_index:0,
            school_type: '1',  // 1小 2初 3高 4职
            is_school: false
        }
    },
    mounted() {
        this.uid = this.$route.query.uid
        this.getExamRank()
    },
    computed: {
        
    },
    methods: {
        showsss(item) {
            this.$toast('id = ' +item)
        },
        addMore() {
            this.page_num += 1
            this.getExamRank()
        },
        getExamRank() {
            this.$indicator.open()
            this.$http.post('/phone/gyjdb/getExamRank', {
                user_type: '',
                page_num: this.page_num
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1') {
                    let exmms = data.content
                    console.log(exmms);
                    this.examrank = exmms
                }
            }).catch((err) => {
                this.$indicator.close()
            })
        },
        getSchoolRank() {
            this.$indicator.open()
            this.$http.post('/phone/gyjdb/getSchoolRank', {
                school_type: this.school_type
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1') {
                    let exmms = data.content
                    if (exmms == undefined || exmms.length == 0) {
                        this.$toast('没有相关的排名信息')
                    } 
                    this.schools = exmms
                }
            }).catch((err) => {
                this.$indicator.close()
            })
        },
        selectType(index) {
            this.sel_index = index
            this.page_num = 1
            if (index == 0) {
                // 全部排名
                this.getExamRank()
            } else {
                this.school_type = index
                this.getSchoolRank()
            }
        }
    }
}
</script>

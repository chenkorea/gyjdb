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

    .inf-text {
        margin-top: 20px;
    }

    .img-center {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .score-view {
        position: relative;
        width: 100px;
        height: 100px;
        margin: 10px;
    }

    .pai-content {
        position: absolute;
        top: 0;
        left: 120px;
        width: 100%;
    }

    .pai-text-1 {
        width: 500px;
        height: 30px;
        font-size: 25px;
        color: #396fbf;
    }
    .pai-text-2 {
        width: 500px;
        height: 30px;
        font-size: 16px;
        color: #666666;
        margin-top: 30px;
    }

    .info-text-green {
        color: #154893;
        font-size: 0.8rem;
        margin-left: 10px;
    }

    .null-p {
        color: #FFF;
    }

    .ui-button-large0-1 {
        width: 40%;
        height: 2.2rem;
        margin: 0 0 0 6%;
        display: inline-block;
        border-radius: .2rem;
    }
    .new-ty {
        background: #396fbf;
    }
</style>
<template>
    <ui-main class="bg-white">

        <!-- 排名表 -->
        <div class="score-view" @click="toRank">
            <img class="img-center" :src="head_img" alt="">
            <div class="pai-content">
                <p class="pai-text-1">当前排名： {{ranknum}}  名</p>
                <p class="pai-text-2">总分：{{score}}分   用时：{{usetime}}</p>
            </div>
        </div>

        <div class="split-view-1"></div>

        <!-- 简介 -->
        <p class="f08 info-text-green">活动时间</p>
        <p class="f08 info-text" @click="toNews"> 2018年3月15日 - 2018年6月31日</p>

        <p class="f08 info-text-green">参与对象</p>
        <p class="f08 info-text"> 全市市民</p>

        <p class="f08 info-text-green">答题规则</p>
        <p class="f08 info-text"> 每位参赛者又一次答题机会，参赛者点击“开始答题”后，系统将自动随机生成试卷，每题限时30秒，30秒年之内不作答则被视为放弃该题，答题完毕点击提交后，系统将自动评分并进行排名。</p>

        <p class="f08 info-text-green">特别说明</p>
        <p class="f08 info-text">每位参赛者在比赛答题前，可以无限次练习答题，每题均有标准答案提示，提升赛前学习水平。</p>
        
        <div class="content-view">
            <mt-button class="ui-button-large0-1 ui-bg-gradient new-ty" style="background:#396fbf" @click="toQuestion">答题练习</mt-button>
            <mt-button class="ui-button-large0-1 ui-bg-gradient new-ty" style="background:#396fbf" @click="getExamRec">在线考试</mt-button>
        </div>

    </ui-main>
</template>
<script>
import checker from './checker.js'
export default {
    data() {
        return {
            uid:'',
            score:'0',
            ranknum:'0',
            usetime:'0',
            head_img: 'https://www.gyclit.top/gyjdb/images/gyjdb1.png'
        }
    },
    mounted() {
        this.uid = this.$route.query.uid
        this.getUserMyRank()
    },
    computed: {
        
    },
    methods: {
        toNews() {
            this.$router.push({
                name:'新闻',
                query:{
                    uid:this.uid,
                    news_type: ''
                }
            })
        },
        toRank() {
            this.$router.push({
                name:'全市排名',
                query:{
                    uid:this.uid
                }
            })
        },
        toQuestion() {
            this.$router.push({
                name:'做题',
                query:{
                    uid:this.uid,
                    isExamStr:'0'
                }
            })
        },
        getExamRec() {
            this.$indicator.open()
            this.$http.post('/phone/gyjdb/getUserIsExam', {
                user_id: this.uid
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1') {
                    let exams = data.content
                    if (exams != null && exams.length > 0) {
                        // 有记录 不能进入
                        this.$toast('你已经参加过考试了！')
                    } else {
                        this.toRealExam()
                    }
                }
            }).catch((err) => {
                this.$indicator.close()
            })
        },
        getUserMyRank() {
            this.$indicator.open()
            this.$http.post('/phone/gyjdb/getUserMyRank', {
                user_id: this.uid
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1') {
                    let exams = data.content[0]
                    if (exams != null && exams != undefined) {
                        this.score = '' + exams.score
                        this.ranknum = '' + exams.rownum
                        this.head_img = exams.head_img
                        let startDate = exams.start_time
                        let endDate = exams.end_time
                        this.canculmDate(startDate, endDate)
                    }
                }
            }).catch((err) => {
                this.$indicator.close()
            })
        },
        canculmDate(startDate, endDate) {
            var runTime = parseInt((endDate - startDate) / 1000);
            
            var year = Math.floor(runTime / 86400 / 365);
            
            runTime = runTime % (86400 * 365);
            var month = Math.floor(runTime / 86400 / 30);
            runTime = runTime % (86400 * 30);
            var day = Math.floor(runTime / 86400);
            runTime = runTime % 86400;
            var hour = Math.floor(runTime / 3600);
            runTime = runTime % 3600;
            var minute = Math.floor(runTime / 60);
            
            runTime = runTime % 60;
            var second = runTime;
            console.log(year,month,day,hour,minute,second);
            this.usetime = '' + minute + '分' + second + '秒'
        },
        toRealExam() {
            this.$messagebox.confirm('是否立即参加在线考试?').then(action => {
                if (action == 'confirm') {
                    // 取消订单流程
                    this.$router.push({
                        name:'做题',
                        query:{
                            uid:this.uid,
                            isExamStr:'1'
                        }
                    })
                }
            }).catch(() => {
            })
        }
    }
}
</script>

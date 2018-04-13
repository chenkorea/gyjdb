<style lang="scss" scoped>
    @import '~@/scss/public.scss';
    $ui-color-blue: #26a2ff;

    .answer-view {
        padding: 0 20px;
    }

    .select-question {
        color: #396fbf;
        background: #F0F0F0;
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 16px;
        margin-top: 10px;
    }

    .normal-question {
        color: #333333;
        background: #FFFFFF;
        padding: 5px auto;
        font-size: 16px;
        padding-top: 5px;
        padding-bottom: 5px;
        margin-top: 10px;
    }

    .normal-question-now {
        color: #396fbf;
        background: #FFFFFF;
        padding: 5px auto;
        font-size: 16px;
        padding-top: 5px;
        padding-bottom: 5px;
        margin-top: 10px;
    }

    .next-qu {
        width: 90%;
        margin: 20px;
        text-align: right;
        color: #396fbf;
        font-size: 0.8rem;
    }

    .info-text-1 {
        margin: 15px;   
        font-size: .8rem;
        color: #FFFFFF;
        background: #396fbf;
    }
    .info-text {
        margin: 15px;   
        font-size: .8rem;
        color: #333333;
    }
    
    .time-text {
        color: #396fbf;
    }

    .ui-button-large0-2 {
        width: 40%;
        height: 45px;
        margin: 10px 0 10px 6%;
        display: inline-block;
        border-radius: .2rem;
        color: #396fbf;
        border: 1px #396fbf solid;
    }

    .info-text-sub {
        width: 100%;
        height: 50px;
        position: absolute;
        bottom: -10px;
        left: 0;
        padding-top: 10px;
        text-align: center;
        color: #FFF;
        background: #396fbf;
    }

    .success-view {
        position: absolute;
        text-align: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #FFF;
    }

    .xunzhang {
        /**  inline-block配合text-align  居中布局 */
        display: inline-block;
        text-align: center;
        width: 200px;
        height: 200px;
        padding-top: 35px;
        color: #FFFFFF;
        font-size: 26px;
        font-weight: 500;
        margin-top: 100px;
        background-image: url('https://www.gyclit.top/gyclit-web/upload/icon/xunzhang.jpg');
        background-size: 200px 200px;
    }

    .score-text {
        width: 100%;
        height: 40px;
        text-align: center;
        color: #396fbf;
        font-size: 30px;
    }

</style>
<template>
    <ui-main class="bg-white">
        <p class="info-text time-text"  v-if="isShowTime">本题倒计时{{now_second}}秒</p>
        <div class="split-view"></div>
        <div>
            <p class="f08 info-text">{{q_index + 1}}、 {{now_question.q_title}}({{now_question.q_type=='1'||now_question.q_type=='3'?'单选题':'多选题'}})</p>
        </div>
        <div class="answer-view">
            <p :class="sel_class_a" @click="selectAns(1)"  v-if="now_question.q_a">{{now_question.q_a}}</p>
            <p :class="sel_class_b" @click="selectAns(2)"  v-if="now_question.q_b">{{now_question.q_b}}</p>
            <p :class="sel_class_c" @click="selectAns(3)"  v-if="now_question.q_c">{{now_question.q_c}}</p>
            <p :class="sel_class_d" @click="selectAns(4)"  v-if="now_question.q_d">{{now_question.q_d}}</p>
            <p :class="sel_class_e" @click="selectAns(5)"  v-if="now_question.q_e">{{now_question.q_e}}</p>
            <p :class="sel_class_f" @click="selectAns(6)"  v-if="now_question.q_f">{{now_question.q_f}}</p>
        </div>
        <!-- <p class="last-qu" @click="nextQuestion">上一题</p> -->
        <!-- <p class="next-qu" @click="nextQuestion">下一题</p> -->

        <div class="content-view">
            <mt-button class="ui-button-large0-2" @click="lastQuestion">上一题</mt-button>
            <mt-button class="ui-button-large0-2" @click="nextQuestion">下一题</mt-button>
        </div>

        <p class="info-text-1" @click="showAnwser" v-if="isExam">显示正确答案</p>
        <div class="answer-view">
            <p class="normal-question-now" v-if="is_showans">正确答案为: {{now_question.q_answer}}</p>
        </div>
        <p class="info-text" v-if="is_showans">{{now_question.q_info}}</p>

        <p class="info-text-sub" v-if="q_index == exams.length-1 && is_nosave" @click="submitExam">提交试卷</p>

        <div class="success-view" v-if="is_showsuc">
                <p class="xunzhang" >总分<br>{{score}}</p>

                <p class="score-text" >本次分数</p>
                <!-- <img class="xunzhang" src="../icons/xunzhang.jpg" alt=""> -->
                <div class="content-view">
                    <!-- <router-link to="/home"> -->
                        <mt-button class="ui-button-large0-1 ui-bg-gradient" @click="toBack">回顾试题</mt-button>    
                    <!-- </router-link> -->
                    
                    <mt-button class="ui-button-large0-1 ui-bg-gradient" @click="toNextNew">在学一次</mt-button>
                </div>
        </div>

    </ui-main>
</template>
<script>
import checker from './checker.js'
export default {
    data() {
        return {
            score:0,
            is_showsuc: false,
            is_nosave: true,
            isExam: false,
            isExamStr: '0',
            uid:'',
            q_index: 0,
            is_showans: false,
            sel_a: false,
            sel_c: false,
            sel_d: false,
            sel_e: false,
            sel_f: false,
            sel_a: false,
            sel_class_a:'normal-question',
            sel_class_b:'normal-question',
            sel_class_c:'normal-question',
            sel_class_d:'normal-question',
            sel_class_e:'normal-question',
            sel_class_f:'normal-question',
            exams:[],
            exam_id:'',
            now_question:{},
            answers:["","","","","","","","","","","","","","","","","","","",""],
            now_second: 30,
            isExamFinish: false,
            isShowTime: true
        }
    },
    mounted() {
        this.uid = this.$route.query.uid
        this.isExamStr = this.$route.query.isExamStr
        console.log(this.isExamStr);
        if (this.isExamStr == '1') {
            this.isExam = false
        } else {
            this.isExam = true
        }
        this.getExam()
    },
    computed: {
        
    },
    methods: {
        /** 选择答案 */
        selectAns(index) {
            if (this.now_second == 0) {
                this.$toast('本题已错过答题时间')
                return;
            }
            if (index == 1) {
                if (this.sel_a) {
                    this.sel_a = false
                    this.sel_class_a = 'normal-question'
                } else {
                    this.sel_a = true
                    this.sel_class_a = 'select-question'
                } 
            } else if (index == 2) {
                if (this.sel_b) {
                    this.sel_b = false
                    this.sel_class_b = 'normal-question'
                } else {
                    this.sel_b = true
                    this.sel_class_b = 'select-question'
                } 
            } else if (index == 3) {
                if (this.sel_c) {
                    this.sel_c = false
                    this.sel_class_c = 'normal-question'
                } else {
                    this.sel_c = true
                    this.sel_class_c = 'select-question'
                } 
            } else if (index == 4) {
                if (this.sel_d) {
                    this.sel_d = false
                    this.sel_class_d = 'normal-question'
                } else {
                    this.sel_d = true
                    this.sel_class_d = 'select-question'
                } 
            } else if (index == 5) {
                if (this.sel_e) {
                    this.sel_e = false
                    this.sel_class_e = 'normal-question'
                } else {
                    this.sel_e = true
                    this.sel_class_e = 'select-question'
                } 
            } else if (index == 6) {
                if (this.sel_f) {
                    this.sel_f = false
                    this.sel_class_f = 'normal-question'
                } else {
                    this.sel_f = true
                    this.sel_class_f = 'select-question'
                } 
            }

            this.getAnswer()
        },
        getAnswer() {
            let q_ans = 'CL'
            if (this.sel_a) {
                q_ans = q_ans + 'A'
            }
            if (this.sel_b) {
                q_ans = q_ans + 'B'
            }
            if (this.sel_c) {
                q_ans = q_ans + 'C'
            }
            if (this.sel_d) {
                q_ans = q_ans + 'D'
            }
            if (this.sel_e) {
                q_ans = q_ans + 'E'
            }
            if (this.sel_f) {
                q_ans = q_ans + 'F'
            }
            q_ans = q_ans.replace('CL', '')
            if (q_ans == 'CL' || q_ans == 'CL,') {
                q_ans = ''
            }
            this.answers[this.q_index] = q_ans
            console.log(this.answers);
        },
        /** 下一题 */
        nextQuestion() {
            if (this.q_index == this.exams.length-1) {
                this.$toast('这是最后一题啦！')
            } else {
                // 先保存答题记录
                let ques = this.exams[this.q_index]
                let q_id = ques.id
                let q_an = this.answers[this.q_index]
                this.saveQuestionRec(q_id, q_an)
                // 进入下一题
                this.q_index = this.q_index + 1
                this.getNowQuestion()
                this.resetAnswer()
                this.backSecond(true)
            }
        },
        /** 上一题 */
        lastQuestion() {
            if (this.q_index == 0) {
                this.$toast('这是第一题啦！')
            } else {
                this.q_index = this.q_index - 1
                this.getNowQuestion()
                this.resetAnswer()
                this.backSecond(false)
            }
        },
        /** 重置答案显示 */
        resetAnswer() {
            this.sel_a = false
            this.sel_class_a = 'normal-question'
            this.sel_b = false
            this.sel_class_b = 'normal-question'
            this.sel_c = false
            this.sel_class_c = 'normal-question'
            this.sel_d = false
            this.sel_class_d = 'normal-question'
            this.sel_e = false
            this.sel_class_e = 'normal-question'
            this.sel_f = false
            this.sel_class_f = 'normal-question'

            let ans = this.answers[this.q_index]
            if (ans.indexOf('A')>=0) {
                this.sel_a = true
                this.sel_class_a = 'select-question'
            }
            if (ans.indexOf('B')>=0) {
                this.sel_b = true
                this.sel_class_b = 'select-question'
            }
            if (ans.indexOf('C')>=0) {
                this.sel_c = true
                this.sel_class_c = 'select-question'
            }
            if (ans.indexOf('D')>=0) {
                this.sel_d = true
                this.sel_class_d = 'select-question'
            }
            if (ans.indexOf('E')>=0) {
                this.sel_e = true
                this.sel_class_e = 'select-question'
            }
            if (ans.indexOf('F')>=0) {
                this.sel_f = true
                this.sel_class_f = 'select-question'
            }
        },
        /** 获取考试题目 */
        getExam() {
            this.$indicator.open()
            this.$http.post('/phone/gyjdb/getExam', {
                user_id: this.uid,
                is_exam: this.isExamStr
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1') {
                    this.exams = data.content[0].questions
                    this.exam_id = data.content[0].exam_id
                    this.getNowQuestion()

                    this.backSecond(true)
                }
            }).catch((err) => {
                this.$indicator.close()
            })
        },
        /** 保存答题记录 */
        saveQuestionRec(question_id, answer) {
            this.$http.post('/phone/gyjdb/saveQuestionRec', {
                user_id: this.uid,
                question_id: question_id,
                answer: answer
            }).then(({ data }) => {
                
            }).catch((err) => {
            })
        },
        /** 保存答题记录 */
        saveExamRec(sel_ans, score) {
            this.$indicator.open()
            this.$http.post('/phone/gyjdb/saveExamRec', {
                sel_answers: sel_ans,
                score: score,
                exam_id: this.exam_id
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1') {
                    // 提交成绩成功
                    this.is_nosave = false
                    this.score = score
                    this.is_showsuc = true
                    
                }
            }).catch((err) => {
                this.$indicator.close()
            })
        },
        /** 获取当前题目 */
        getNowQuestion() {
            this.now_question = this.exams[this.q_index]
            if (this.is_nosave == false) {
                // 数据提交了
                this.is_showans = true
            } else {
                this.is_showans = false
            }
        },
        showAnwser() {
            this.is_showans = true
        },
        /** 提交试卷 */
        submitExam() {
            // 答案比较
            let rightAnsNum = 0
            for (let i = 0; i < this.exams.length; i++) {
                let q_answer = this.exams[i].q_answer
                let q_sel = this.answers[i]
                if (q_answer == q_sel) {
                    rightAnsNum += 1
                }
            }
            let score = rightAnsNum * 5
            this.$toast('你做了' + score + '分')

            // 先保存答题记录
            let ques = this.exams[this.q_index]
            let q_id = ques.id
            let q_an = this.answers[this.q_index]
            this.saveQuestionRec(q_id, q_an)

            // 保存考试记录
            let spanswer = 'CL'
            for (let i = 0; i < this.answers.length; i++) {
                spanswer = spanswer + ',' + this.answers[i]
            }
            spanswer = spanswer.replace('CL,', '')
            this.saveExamRec(spanswer, '' + score)
        },
        /** 倒计时30秒 */
        backSecond(isNext){
          const TIME_COUNT = 30;
          this.now_second = 30
          if (!isNext) {
            this.now_second = 0
          }
          if (!this.timer) {
            this.now_second = TIME_COUNT;
            this.timer = setInterval(() => {
            if (this.now_second > 0 && this.now_second <= TIME_COUNT) {
              this.now_second--;
             } else {
              clearInterval(this.timer);
              this.timer = null;
             }
            }, 1000)
           }
        },
        toNextNew() {
            if (this.isExam) {
                // 考试模式下不允许再次考试
                this.$messagebox.alert('考试模式下不允许再次考试')
            } else {
                this.is_showsuc = false
                this.q_index = 0
                this.getExam()
            }
        },
        /* 查看历史 */
        toBack() {

            if (this.isExam) {
                // 考试模式下答题完成
                this.isExamFinish = true
            }
            this.toFristQuestion()

            // this.$router.back('-1')
        },
        toFristQuestion() {
            this.q_index == 0
            this.is_showans = true
            this.is_showsuc = false
            this.isShowTime = false
            this.getNowQuestion()
            this.resetAnswer()
        }
    }
}
</script>

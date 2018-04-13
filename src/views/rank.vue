<style lang="scss" scoped>
    @import '~@/scss/public.scss';
    $ui-color-blue: #26a2ff;

    .rank-item {
        display: flex;
        align-items: center;
        padding: 10px;
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
    
</style>
<template>
    <ui-main class="bg-white">
        <div class="rank-view">
            <div class="rank-item" v-for="(item, index) in examrank" @click="showsss(item)">
                <p class="rank-text-1">{{index+1}}</p>
                <img class="user-head" :src="item.head_img" alt="">
                <p class="user-name">{{item.nickname}}</p>
                <p class="user-content">总分：{{item.score}}分</p>
            </div>
            <p class="f08 text-center more-text" @click="addMore">加载更多</p>
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
            examrank:[]
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
    }
}
</script>

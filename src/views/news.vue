<style lang="scss" scoped>
    @import '~@/scss/public.scss';
    $ui-color-blue: #26a2ff;

    .news-view {
        background: #FFFFFF;
    }

    .news-item {
        width: 100%;
        padding: 10px;
        border-bottom: 1px #F0F0F0 solid;
        // border: 5px #F2F2F2 solid;
        // border-radius: 2px;
    }

    .news-pic {
        width: 90px;
        height: 60px;
    }

    .news-title-1 {
        padding-left: 10px;
        font-size: 14px;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:1;
        display: -webkit-box;
    }

    .right-view {
        overflow: hidden; 
        height: 250px;
    }

    .news-time {
        padding-left: 10px;
        font-size: 12px;
        color: #999999;
    }

    .more-view {
        display: inline-block;
        text-align: center;
        padding-top: 10px;
        width: 100%;
        height: 50px;
        color: #999999;
        font-size: 14px;
    }

    .picss {
        position: relative;
        width: 100%;
    }

    .l-vi {
        position: absolute;
        top: 0;
        left: 0;
    }

    .r-vi {
        position: absolute;
        top: 10px;
        left: 100px;
    }

    .new-l {
        float: left;
        margin-top: 5px;
    }

    .new-r {
        overflow:auto;
        margin-top: -5px;
    }

    .new-r-0 {
        overflow:auto;
        margin-left: -10px;
    }

    
</style>
<template>
    
    <ui-main class="bg-white">
        <div class="news-view">
            <div class="news-item" v-for="item in news">
                <a :href="item.news_url">
                    <div>
                        <div class="new-l" v-if="item.news_pics">
                            <img class="news-pic" :src="item.news_pics?item.news_pics:bg_img" alt="">
                        </div>
                        <div class="new-r" v-if="item.news_pics">
                            <p class="news-title-1">{{item.news_title}}</p>
                            <p class="news-time">{{item.operate_time}}</p>
                        </div>
                        <div class="new-r-0" v-if="!item.news_pics">
                            <p class="news-title-1">{{item.news_title}}</p>
                            <p class="news-time">{{item.operate_time}}</p>
                        </div>
                    </div>
                </a>
                

                <!-- <div class="pic-view" v-if="item.news_pics">
                    <a :href="item.news_url">
                        <div class="picss">
                            <div class="right-view l-vi">
                                <img class="news-pic" :src="item.news_pics" alt="">
                            </div>
                            <div class="left-view r-vi">
                                <p class="news-title-1">{{item.news_title}}</p>
                                <p class="news-time">{{item.operate_time}}</p>
                            </div>
                        </div>
                    </a>
                </div>

                <div class="pic-view" v-if="!item.news_pics">
                    <a :href="item.news_url">
                        <div class="left-view">
                            <p class="news-title-1">{{item.news_title}}</p>
                            <p class="news-time">{{item.operate_time}}</p>
                        </div>
                    </a>
                </div> -->
            </div> 
        </div>
        <div class="more-view" @click="addMore">加载更多</div>

        
    </ui-main>
</template>
<script>
import checker from './checker.js'
export default {
    data() {
        return {
            uid:'',
            page_num:1,
            news:[],
            news_type:'1',
            bg_img: 'https://www.gyclit.top/gyjdb/images/f8d8f9c7e1234eadbcaf369cf122756b.png'
        }
    },
    mounted() {
        this.uid = this.$route.query.uid
        this.news_type = this.$route.query.news_type
        this.getNews()
    },
    computed: {
        
    },
    methods: {
        showsss(item) {
            this.$toast('id = ' +item)
        },
        addMore() {
            this.page_num += 1
            this.getNews()
        },
        getNews() {
            if (this.news_type == null || this.news_type == undefined) {
                this.news_type = '1'
            }
            this.$indicator.open()
            this.$http.post('/phone/gyjdb/getNews', {
                news_type: this.news_type,
                page_num: this.page_num,
                page_count: '20'
            }).then(({ data }) => {
                this.$indicator.close()
                if (data.code == '1') {
                    let exmms = data.content[0].news
                    for (let i = 0; i < exmms.length; i++) {
                        exmms[i].news_url = 'https://www.gyclit.top/gyjdb/' + exmms[i].news_url
                    }
                    console.log(exmms);
                    this.news = this.news.concat(exmms)
                }
            }).catch((err) => {
                this.$indicator.close()
            })
        },
    }
}
</script>

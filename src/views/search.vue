<style lang="scss" scoped>
    .search-input {
        height: 3rem;
        background-color: white;
        width: 100%;
        position: relative;
        >input {
            font-size: 1rem;
            height: 100%;
            width: 100%;
            text-indent: 1rem;
            display: block;
            border: 0;
            border-radius: 0;
        }
        .search-button {
            position: absolute;
            right: .5rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
        }
    }

    .cooling-ico{
        position: absolute;
        right: 1rem;
        z-index: 1;
        top: .8rem;
    }

    /*.animate {
        animation: rotate 5s infinite alternate;
    }

    @keyframes rotate {
        from {
            transform: rotateY(0);
        }
        to {
            transform: rotateY(360deg);
        }
    }*/
</style>
<template>
    <ui-main class="bg-white">
    
        <mt-header title="搜索" slot="header" ref="header">
            <ui-button icon="back" slot="left" @click="close"></ui-button>
            <mt-button slot="right" @click="clear">
                <icon name="trash-o" scale="1.3"></icon>
            </mt-button>
        </mt-header>
    
        <div class="search-input ui-border" ref="search-input" slot="header">
            <input type="text" v-model="keywords" placeholder="输入搜索内容">
            <mt-button class="search-button ui-button-text" @click="search" v-if="cooling===false">
                <img src="~@/icons/search_grey.png" style="width:1.2rem;">
            </mt-button>
            <icon spin name="cog" scale="1.3" class="f-color-blue cooling-ico" v-else></icon>
        </div>
    
        <!--搜索结果-->
        <div ref="scroll-list" @click="saveScroll">
            <div v-if="data" ref="data-list" class="p05 pb2">
                <coupon class="mb05" color="#ff6c00" v-for="item in data" :key="item.id" @click.native="goCouponDetails(item.id)">
                    <div slot="tag" class="flex column">
                        <span class="mb05 f07" slot="left">{{item.company_name}}</span>
                        <span class="f06" slot="left">{{item.publish_time_show}}</span>
                    </div>

                    <div class="flex col-center mb05">
                        <ui-img :src="item.company_ico" class="ui-circle bg-grey mr05" style="width:2rem;height:2rem" ></ui-img>
                        <div class="f08 title flex-1">
                            {{item.name}}
                        </div>
                    </div>
                    <div class="sub-title">
                        <span>
                            <img src="~@/icons/person.png" style="width:.9rem">
                            {{item.draw_num}}人领取
                        </span>
                        <span>
                            <img src="~@/icons/get.png" style="width:.9rem">
                            {{item.withdraw_num}}人提款
                        </span>
                    </div>
                </coupon>
            </div>
            <div v-else class="f-color-grey flex col-center row-center mt5">没有找到你要的内容</div>
        </div>
    
    </ui-main>
</template>

<script>
import coupon from '@/views/coupon.vue'
export default {
    components: {
        coupon
    },
    data() {
        return {
            keywords: '', //需要搜索的关键字
            cooling: false,
            data: null,
            scrollY: sessionStorage.getItem('/search?scroll-y')
        }
    },
    sessionStorage: {
        data:{
            type:Array
        },
    },
    methods: {
        search() {
            if (this.keywords) {
                // 进行数据查询
                this.cooling = true //开启冷却

                this.$http.get('index.php?g=home&m=GameCoupon&a=coupon_list', {
                    params:{
                        page_size:50,
                        search_field: 'name',
                        search_value: this.keywords
                    }
                })
                .then(({data})=>{
                    console.log('搜索结果:',data)
                    if (data.code===1) {
                        this.cooling = false //关闭冷却
                        this.data = data.data
                    }
                }).catch(() => {
                    this.$toast('服务器忙')
                })

            }
        },
        clear() {
            this.keywords = ''
            this.data = null
        },
        close(){
            this.clear()
        },
        goCouponDetails(id){
            this.$router.push({ name: '彩金详情', query: { id: id } })
        },
        saveScroll(){
            sessionStorage.setItem('/search?scroll-y',this.$el.scrollTop)
        }
    },
    watch: {
        data(v){
            // 列表重渲染完成, 恢复滚动条高度
            if (v.length>0 && this.scrollY) {
                this.$el.scrollTop = this.scrollY 
            }
        }
    }
}

</script>

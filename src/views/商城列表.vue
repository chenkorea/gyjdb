<style lang="scss" scoped>
@import '~@/scss/public.scss';
.tab {
    white-space: nowrap;
    flex: none;
    width: 25%;
}

.tab-active {
    color: $ui-color-orange;
    border-color: $ui-color-orange;
}

.classiy-view {
    position: absolute;
    top: 115px;
    left: 0;
    width: 100%;
    background: #FF6666;
    z-index: 5;
    border-bottom: 2px #F0F0F0 solid;
}
</style>


<template>
    <div class="vh-100 vw-100">

        <mt-header title="商城" slot="header">
            <mt-button @click.native="handleClick('1')" v-if="intentflag=='101'" icon="back" slot="left"></mt-button>
            <ui-button icon="back" v-else slot="left"></ui-button>
        </mt-header>

        <div class="flex column h-100">
            <!-- 1级分类  -->
            <mt-navbar v-model="tab" class="scroll-x" slot="header">
                <mt-tab-item class="tab" id="all" @click.native="showTabList=false;getAllGoods('all')">全部</mt-tab-item>
                <mt-tab-item class="tab" :id="tabList[0].id" @click.native="showTabList=false;getAllGoods(tabList[0].id)">{{tabList[0].label}}</mt-tab-item>
                <mt-tab-item class="tab" :id="tabList[1].id" @click.native="showTabList=false;getAllGoods(tabList[1].id)">{{tabList[1].label}}</mt-tab-item>
                <mt-tab-item class="tab" :class="{'is-selected':isMoreSelect}">
                    <div class="flex col-center row-center" @click.stop="showTabList=!showTabList">
                        <span class="mr03">更多</span>
                        <icon v-if="showTabList" name="angle-up"></icon>
                        <icon v-else name="angle-down"></icon>
                    </div>
                </mt-tab-item>
            </mt-navbar>

            <div v-if="showTabList" class="classiy-view" slot="header">
                <div class="bg-white absolute p05 flex row-around flex-wrap" style="right:0;top:0;width:100vw">
                    <div v-for="item in tabList" @click="getAllGoods(item.id)" style="width:32%" class="ui-border f08 text-center mb05 p03" :class="{'tab-active':tab==item.id}">
                        {{item.label}}
                    </div>
                </div>
            </div>

            <!-- 商品列表 -->
            <div class="bg-white flex-1 overflow-hide">
                <!-- <div v-infinite-scroll="loadTab1" infinite-scroll-disabled="tab1loading"> -->
                <div v-infinite-scroll="" infinite-scroll-disabled="tab1loading" class="scroll-y">
                    <div v-for="item in goodList" @click="goDetails(item)" class="flex">
                        <!-- <ui-img :src="`http://weixin0918.oss-cn-hangzhou.aliyuncs.com/weixin/alina7220/1_01.jpg`" size="5" class="m05"></ui-img> -->
                        <ui-img :src="item.archives_url" size="5" class="m05"></ui-img>
                        <div class="flex-1 flex column column-col-around ui-border-bottom">
                            <span class="ui-clamp-1 mb05 f08">{{item.name}}</span>
                            <span class="ui-rmb f-color-orange f10">{{item.price}}</span>
                        </div>
                    </div>
                    <!-- <div v-for="item in goodList" @click="goDetails(item)" class="flex">
                        <ui-img :src="item.archives_url" size="5" class="m05"></ui-img>
                        <div class="flex-1 flex column column-col-around ui-border-bottom">
                            <span class="ui-clamp-1 mb05 f08">{{item.name}}</span>
                            <span class="ui-rmb f-color-orange f10">{{item.price}}</span>
                        </div>
                    </div> -->
                    <ui-loadmore v-if="tab1loading"></ui-loadmore>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    props: ['ctFlag'],
    data() {
        return {
            tab: 'all',
            tab1loading: false,
            tabList: [{
              label:"211防盗锁",
              id:"2c931d985dea14ce015dedb3f4d0011d"
            },
            {
              label:"344智能锁",
              id:"2c931d985dea14ce015dedb421f4011f"
            }],
            intentflag: this.ctFlag,
            goodList: [],
            showTabList: false,
            weburl: '',
            isAc: this.isActive
        }
    },
    mounted() {
        this.getgoodcategory()
        this.getAllGoods('all')
    },
    methods: {
        //点击返回处理
        handleClick(index) {
            this.$emit('doActiveFalse', index)
        },
        getgoodcategory() {
            this.$http.post('/phone/userinfor/getgoodcategory', {
            }).then(({ data }) => {
                if (data.code == '1') {
                    this.tabList = []
                    for (var index = 0; index < data.content.length; index++) {
                        var element = data.content[index];
                        let temp = {
                          label:element.data_name,
                          id:element.data_code
                        }
                        this.tabList.push(temp)
                    }
                }
            }).catch(() => {
                this.$messagebox.alert('系统繁忙')
            }) 
        },
        goDetails(goodItem) {
            if (this.intentflag == '101') {
                //存储选择商品，过滤重复的商品。。根据id过滤。
                var selectGoods = localStorage.getItem('selctgoodsAr')
                console.log('selectGoods == ' + selectGoods)
                if (this.utils.isNotBlank(selectGoods)) {
                    selectGoods = JSON.parse(selectGoods);
                    var ishav = false;
                    for (let i = 0; i < selectGoods.length; i++) {
                        if (selectGoods[i].id == goodItem.id) {
                            var num = parseInt(selectGoods[i].selectnum);
                            num += 1;
                            selectGoods[i].selectnum = num;
                            ishav = true;
                            break;
                        }
                    }
                    if (!ishav) {
                        goodItem.selectnum = 1;
                        selectGoods.push(goodItem)
                    }
                } else {
                    selectGoods = new Array();
                    goodItem.selectnum = 1;
                    selectGoods[0] = goodItem;
                }
                localStorage.setItem('selctgoodsAr', JSON.stringify(selectGoods));
                this.handleClick('2');
            } else {
                this.$router.push({
                    name: '商品详情',
                    query: {
                        id: goodItem.id
                    }
                })
            }
        },
        //商品列表
        getAllGoods(cid) {
            console.log('--------'+cid);
            this.tab = cid
            this.$http.post('/phone/userinfor/getallgoods', {
                cid: cid == 'all' ? '' : cid
            })
                .then(({ data }) => {
                    this.$indicator.close()
                    if (data.code == '1') {
                        for (var i = 0; i < data.content.length; i++) {
                            if (data.content[i].archives_url == undefined) {
                                data.content[i]['archives_url'] = ''
                            }
                            else {
                                var url = data.content[i].archives_url.split(',');
                                for (var j = 0; j < url.length; j++) {
                                    if (url[j] != '') {
                                        data.content[i].archives_url = this.weburl + '/' + url[j]
                                        break
                                    }
                                }
                            }
                        }
                        this.goodList = data.content
                    } else {
                        this.$messagebox.alert('获取商品列表异常...')
                    }

                }).catch(() => {
                    this.$indicator.close()
                    this.$messagebox.alert('系统繁忙')
                })
        }
    },
    computed: {
        isMoreSelect() {
            if (this.tab == 'all') {
                return false
            }
            if (this.tabList.length > 0) {
                for (let i = 0; i < 2; i++) {
                    if (this.tabList[i] && this.tab == this.tabList[i].id) {
                        return false
                    }
                }
            }
            return true
        }
    },
}
</script>
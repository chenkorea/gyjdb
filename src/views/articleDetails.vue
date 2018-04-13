<style lang="scss" scoped>
    .content{
        padding: .5rem;
        font-size: .8rem;
        >img{
            width: 100%;
            margin: 1rem 0;
        }
    }
    .text{
        font-size: .8rem;
        white-space: pre-wrap;
    }
    .heade-img{
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        margin: 0 .2rem 1rem;
    }
    .tag{
        // 广告标签
        padding: .2rem .7rem;
        font-size: .6rem;
        color: white;
        background-color: deepskyblue;
        position: absolute;
        top: .5rem;
        right: -5px;
    }
</style>
<template>

    <ui-main class="bg-white">
        <mt-header title="小猴说事" slot="header">
            <ui-button icon="back" slot="left"></ui-button>
        </mt-header>

        <section class="content bg-white">
            <p class="f11 mb01">老哥上岸半年后的感情独白</p>
            <span class="mr1 f06 f-color-grey">2017年8月31日</span>
            <span class="f-color-blue f06">作者</span>

            <img src="http://p3.pstatp.com/large/26d2000862ee030d9926.jpg" alt="">

            <!--文章内容-->
            <section class="text">
                Setapp是一家专业提供Mac应用订阅服务的公司，近期他们对742名开发者进行了问卷调查，咨询他们对Mac App Store以及对当前Mac应用开发现状的看法。根据调查结果，很多Mac开发者对苹果桌面平台并不满意。

                事实上在去年进行的相同调查中，只有23%的开发者将Mac App Store作为独占的应用开发渠道，而47%的开发者会同时通过Mac App Store和其他渠道对应用进行推广，还有30%的开发者表示反感Mac App Store。从数据上来看，同时通过Mac App Store和其他渠道分发推广应用的开发者数量有所增加。
                在不使用Mac App Store的群体中，究其原因主要是应用审查时间过长，苹果需要收取高达30%的营收，以及该平台没有提供试用版本功能等等。

                根据开发者投票结果，导致开发者选择放弃Mac App Store最主要的原因就是高昂的抽成。开发者表示只有44%的应用营收来自于Mac App Store，56%的营收都来自于其他渠道。
            </section>

            <!--阅读数 收藏 点赞-->
            <section class="f-color-grey f07 mb1">
                <span class="mr1">1580阅读</span>
                <span class="mr1"><icon name="star-o" class="text"></icon>623收藏</span>
                <span><icon name="thumbs-o-up" class="text"></icon>623点赞</span>
            </section>


            <!--打赏-->
            <section>
                <mt-button class="f-color-white ui-bg-orange ui-button-radius auto-center" style="width:6rem">打 赏</mt-button>
                <p class="text-center">
                    已有
                    <span class="f-color-red">12388</span>
                    人打赏
                </p>
                <!--打赏人头像-->
                <div class="flex row-between flex-wrap">
                    <ui-img src="http://tva3.sinaimg.cn/crop.536.63.373.373.180/8d65f675jw8f0c5pbbtg7j20u50k4jvi.jpg" class="heade-img" v-for="img in 7" :key="img"></ui-img>
                </div>
            </section>

            <!--广告-->
            <section class="relative">
                <ui-img src="https://wx3.sinaimg.cn/crop.0.0.1000.562.1000/e512edafly1fgmbssdun2j20rs0fmdgy.jpg" style="width:100%;height:6rem"></ui-img>
                <span class="tag">广告</span>
            </section>

            <!--评论-->
            <section>
                <div class="ui-dividing" style="width:100%;">
                    <span>评论</span>
                </div>

                <div class="flex ui-border-bottom pb05 pt05" v-for="item in 3">
                    <ui-img src="http://tva3.sinaimg.cn/crop.536.63.373.373.180/8d65f675jw8f0c5pbbtg7j20u50k4jvi.jpg" class="heade-img"></ui-img>
                    <div class="flex-1 pl05 flex column">
                        <span class="f-color-orange mb05">perrh</span>
                        <span class="ui-clamp-5 mb05">发我个黄卫平给我介绍批发价为皮肤,fewlghwopghew</span>
                        <div class="flex row-between f-color-grey">
                            <span>1天前</span>
                            <span>
                                <icon name="thumbs-o-up" class="text"></icon>
                                321人觉得有用
                            </span>
                        </div>
                    </div>
                </div>
            </section>

        </section>

        <!--发起评论-->
        <section class="bg-white flex p05" slot="footer">
            <input type="text" v-model="commitVal" class="bg-grey border-none flex-1 pl1 f08 mr05">
            <mt-button class="ui-bg-orange f-color-white f08" :disabled="commitVal.length==0">发表</mt-button>
        </section>
    </ui-main>


</template>

<script>
    export default {
        props:{
            metaData:{
                // 文章数据
                type:Object
            },
        },
        data () {
            return {
                commitVal:'',//评论内容
            }
        },

    }
</script>
<style lang="scss" scoped>
    @import '~@/scss/public.scss';
    .ui-img{
        display: inline-block;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        overflow: hidden;
        position: relative;
        .ui-img-title{
            // 图片中的标题
            @include text-clamp(1);
            position: absolute;
            bottom: 0;
            left: 0;
            background-color: rgba(black, 0.5);
            padding: 0 1rem;
            margin: 0;
            font-size: .8rem;
            color: #fff;
            width: 100%;
            height: 2rem;
            line-height: 2rem;
            text-align: left;
        }
    }
    .weight-full{
        width: 100%;
    }
    .height-full{
        height: 100%;
    }
</style>
<template>
    <div class="ui-img" :style="{ backgroundImage: imgSrc, width:formatSize, height:formatSize, borderRadius:radius }">
        <!-- 兼容url带空格时,用img显示 -->
        <img v-if="imgModle" :src="src" ref="img" :class="{'weight-full':imgWeightFull,'height-full':imgHeightFull}" >
        <!--标题-->
        <div v-if="title" class="ui-img-title">
            {{title}}
        </div>
    </div>
</template>
<script>
    export default {
        name:'ui-img',
        props:{
            src:{
                type: String,
                require: true
            },
            title:{
                type: String
            },
            size:{
                type: String,
                default: ''
            },
            circle:{
                type:Boolean,
                default:false
            }
        },
        mounted(){
            if (this.imgModle) {
                setTimeout(() => {
                    const h = this.$refs.img.clientHeight
                    const w = this.$refs.img.clientWidth
                    if (h>w) {
                        this.imgWeightFull = true
                    }else{
                        this.imgHeightFull = true
                    }
                }, 300);
            }
        },
        data(){
            return {
                imgWeightFull:false,
                imgHeightFull:false
            }
        },
        computed: {
            imgModle(){//img兼容模式,兼容url带有空格无法用背景显示
                return this.src && this.src.indexOf(' ')>0
            },
            imgSrc(){
                if (this.src) {
                    return `url(${this.src})`
                }
                return ''
            },
            formatSize(){
                if (this.size.indexOf('rem')>-1 || this.size.indexOf('px')>-1) {
                    return this.size
                }
                return this.size + 'rem'
            },
            radius(){
                return this.circle?'50%':''
            }
        }
    }
</script>
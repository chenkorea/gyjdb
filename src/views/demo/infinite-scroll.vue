<template>
    <ui-main>
        <mt-header title="内容页" slot="header">
            <ui-button icon="back" slot="left"></ui-button>
        </mt-header>

        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading">
            <mt-cell title="这个写死的" is-link>
                <mt-badge size="small">30</mt-badge>
            </mt-cell>
            <mt-cell @click.native="goDetails('textId')" :title="'动态'+item.title + i" is-link v-for="(item,i) in listData" :key="i">
            </mt-cell>

            <div v-if="loading" class="text-center">
                <span class="f07 f-color-grey mr03">加载中</span>
                <mt-spinner type="triple-bounce" ></mt-spinner>
            </div>
            
        </div>

        <ui-bottom-bar slot="footer"></ui-bottom-bar>
    </ui-main>
</template>
<script>
    export default {
        data () {
            return {
                listData:[
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                    {title:'列表元素'},
                ],
                loading: false
            }
        },
        methods: {
            loadMore() {
              this.loading = true;
              setTimeout(() => {
                //   这里模拟每次动态加一个列表
                    this.listData.push({title:'我是新元素'})
                    this.loading = false;
              }, 2500);
            },
            goDetails(id){
                this.$router.push({
                    name:'消息详情',
                    query:{
                        id:id
                    }
                })
            }
        }
    }
</script>
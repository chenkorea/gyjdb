<style lang="scss" scoped>

</style>
<template>
    <ui-main>
        <mt-header slot="header" title="资质详情">
            <ui-button icon="back" slot="left"></ui-button>
        </mt-header>

        <!--banner-->
        <!-- <mt-swipe :auto="4000" :show-indicators="true" style="height:10rem;">
            <mt-swipe-item v-for="(item,i) in tech.archives_url" :key="i">
                <div class="swipe-item" :style="{backgroundImage:item}">
                </div>
            </mt-swipe-item>
        </mt-swipe> -->

        <div class="f10 f-color-orange p05">基本信息</div>
        <div class="bg-white">
            <order-list label="姓名">{{tech.name}}</order-list>
            <order-list label="电话">
                <a v-if="tech.phone" href="tel:18083213" class="flex row-between">
                    {{tech.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")}} <icon name="phone" class="f-color-orange mr05"></icon>
                </a>
            </order-list>
            <order-list label="评级">
                <img class="p02" v-for="item in tech.service_types" src="../../static/images/start.png" style="height:1.2rem;width:1.2rem;">
            </order-list>
        </div>
        <div class="f10 f-color-orange p05">证照信息</div>
        <div class="f-color-text f08 flex flex-wrap bg-white" style="margin-left:5%;">
            <ui-img @click.native="openPreviewImg(item)" v-for="(item,i) in tech.archives_url" :src="item" :key="item" style="width:30%;height:5.5rem; margin:1%"></ui-img>
        </div>

         <mt-popup v-model="preview.isActive" position="right" slot="popup">
            <img :src="preview.url" class="popup" style="width:100vw;" @click="preview.isActive=false">
        </mt-popup>
    </ui-main>
</template>
<script>
import orderList from '@/views/订单/order-list.vue'
export default {
    components:{
        orderList
    },
    data(){
        return {
            tech:{},
            weburl:'',
            preview:{
                isActive:false,
                url:''
            }
        }
    },
    mounted(){
        this.$axios().then(({config})=>{
                this.weburl = config.baseURL

                this.$http.post('/phone/openkey/gettechqual',{
              tech_id:this.$route.query.id
            }).then(({data}) => {
                if (data.code == '1') {
                    for (var i = 0; i < data.content.length; i++) {
                        var urls = [];
                        if (data.content[i].archives_url == undefined) {
                            data.content[i]['archives_url'] = urls
                        } else {
                            var url = data.content[i].archives_url.split(',');
                            for (var j = 0; j < url.length; j++) {
                                if (url[j] != '') {
                                    urls.push(this.weburl + '/' + url[j])
                                }
                            }
                        }
                        data.content[i].archives_url = urls
                    }

                    this.tech =  data.content[0]
                    if( this.tech.name == undefined){
                        this.tech.name = ''
                    }
                    if( this.tech.phone == undefined){
                        this.tech.phone = ''
                    }
                    if( this.tech.service_types == undefined){
                        this.tech.service_types = []
                    }else{
                        this.tech.service_types = this.tech.service_types.split(',')
                    }
            }
                this.$indicator.close()
                console.log('mounted----------' + JSON.stringify(data))
            }).catch(() => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            })
        })
    },
    methods:{
        openPreviewImg(url){
            this.preview.isActive = true
            this.preview.url = url
        }
    },
}
</script>

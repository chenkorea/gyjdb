
<template>
    <ui-main>
        <mt-header slot="header" title="商品详情">
            <ui-button slot="left" icon="back"></ui-button>
        </mt-header>

        <!--banner-->
        <mt-swipe :auto="4000" :show-indicators="true" style="height:12rem;">
            <mt-swipe-item v-for="(item,i) in goodsDetail.archives_url" :key="i">
                <div @click="openPreviewImg(item)" class="swipe-item" :style="{backgroundImage:`url(${item})`}">
                </div>
            </mt-swipe-item>
        </mt-swipe> 

        <!--名称和价格  -->
        <div class="mt05 mb05 bg-white p05">
            <div class="ui-clamp-2 f08">{{goodsDetail.name}}</div>
            <div class="ui-rmb f-color-orange f10">{{goodsDetail.price}}</div>
            <!-- <div class="ui-clamp-2 f08">dmfskldfmasldmfsldmflsdkf</div>
            <div class="ui-rmb f-color-orange f10">sdfdfwefwfvsdfsdf</div> -->
        </div>

        <!--详细  -->
        <div class="bg-white p05">
            <ul class="mb1 f07">
                <li>{{goodsDetail.summary}}</li>
            </ul>
            <!-- <p class="f08 mb0"><b>法律声明</b></p>
            <span class="f07">
                方季惟哦回复怕未经过陪玩瓜娃儿更害怕未接挂牌文件公婆哇而过瓜娃配股及批文啊价格颇为见公婆娃儿改为按破甲弓颇为机构评为见公婆文件啊个屁 
            </span> -->
        </div>

        <mt-popup v-model="preview.isActive" position="right" slot="popup">
            <img :src="preview.url" class="popup" style="width:100vw;" @click="preview.isActive=false">
        </mt-popup>
    </ui-main>
</template>
<<script>
export default {
  data(){
      return {
        goodsDetail:{},
        weburl:'',
        preview:{
            isActive:false,
            url:''
        },
        goodid:''
      }
    },
   mounted(){
       this.goodid = this.$route.query.id
        this.getallgoods()
    },
    methods:{
        openPreviewImg(url) {
            this.preview.isActive = true
            this.preview.url = url
        },
        getallgoods() {
            this.$indicator.open()
            this.$http.post('/phone/userinfor/getallgoods', {
                goodid:this.goodid
            }).then(({ data }) => {
                this.$indicator.close()
                if(data.code == '1' && data.content.length>0){
                    var temp = data.content[0]
                    var urls = [];
                    console.log(temp.archives_url);
                    if (temp.archives_url == undefined || temp.archives_url == null) {
                          temp['archives_url'] = urls
                    }else {
                         var url = temp.archives_url.split(',');
                        for (var j = 0; j < url.length; j++) {
                             if (url[j] != '') {
                                urls.push(this.weburl + '/' +  url[j])
                            }
                          }
                        temp.archives_url = urls
                     }
                     this.goodsDetail = temp
                }else{
                    this.$messagebox.alert('查看商品详情异常')
                }
            }).catch(() => {
                this.$indicator.close()
                this.$messagebox.alert('系统繁忙')
            }) 
        },
    }
}
</script>

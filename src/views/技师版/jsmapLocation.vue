<style lang="scss" scoped>
    .geomap{
        position: fixed;
        top: 40px;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        border-radius: 0;
    }

    .map-view {
        width: 100%;
        height: 100%;
        background: #FFF;
    }
</style>
<template>

    <div class="map-view">
        <mt-header title="技师位置" slot="header">
            <ui-button icon="back" slot="left"></ui-button>
        </mt-header>

        <!-- <div class="relative h-100">
            <iframe class="geomap" id="mapPage" ref="geomap" width="100%" height="100%" frameborder=0 
                >
            </iframe> 
        </div> -->
        <div class="map-view">
            <iframe class="geomap" id="mapPage" ref="geomap" width="100%" height="100%" frameborder=0 
                >
            </iframe> 
        </div>
    </div>
</template>
<script>
    export default {
        props:['address','popup'],
        data(){
            return {
                radio:'',
                lat:'',
                lon:''
            }
        },
        mounted(){
            this.lat = '' + this.$route.query.latitude
            this.lon = '' + this.$route.query.longitude
            this.initMap()
        },
        methods:{
            initMap() {
                
                // 获取dom元素 this.$refs.geomap
                let latlon = this.lat + ',' + this.lon
                let srcUrl = 'https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:'+ latlon +';title:技师位置;addr:技师位置&key=NONBZ-2VT33-DOI3A-35PVY-CZ7M6-ZRBFR&referer=锁帮帮';
                console.log(srcUrl);
                this.$refs.geomap.src=srcUrl
                // this.$refs.geomap.src="http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:39.96554,116.26719;title:成都;addr:北京市海淀区复兴路32号院|coord:39.87803,116.19025;title:成都园;addr:北京市丰台区射击场路15号北京园博园|coord:39.88129,116.27062;title:老成都;addr:北京市丰台区岳各庄梅市口路西府景园六号楼底商|coord:39.9982,116.19015;title:北京园博园成都园;addr:北京市丰台区园博园内&key=NONBZ-2VT33-DOI3A-35PVY-CZ7M6-ZRBFR&referer=锁帮帮";

                // window.addEventListener('message', function(event) {
                //     // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
                //     let loc = event.data;
                //     if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                //         console.log('', loc);  
                //         //选择地址
                //         // localStorage.setItem('selectAddr',loc.poiaddress)
                //     }                        
                // }, false); 
            }
        },
    }
</script>
<style lang="scss" scoped>
    .geomap{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        border-radius: 0;
    }
</style>
<template>

    <div>
        <mt-header :title="$route.name" slot="header">
            <ui-button icon="back" slot="left"></ui-button>
        </mt-header>

        <div class="relative h-100">
            <iframe class="geomap" id="mapPage" width="100%" height="100%" frameborder=0 
                src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=NONBZ-2VT33-DOI3A-35PVY-CZ7M6-ZRBFR&referer=锁帮帮">
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
            }
        },
        mounted(){
            this.initMap()
        },
        methods:{
            initMap() {
                window.addEventListener('message', function(event) {
                    // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
                    let loc = event.data;
                    if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                        console.log('', loc);  
                        //选择地址
                        localStorage.setItem('selectAddr',loc.poiaddress)
                    }                        
                }, false); 
            }
        },
    }
</script>
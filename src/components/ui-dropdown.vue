<style lang="scss" scoped>
    $closeHeight:2rem;
    .ui-dropdown{
        border:1px solid #ddd;
        // border-radius: 5px;
        overflow: hidden;
        background-color: #fff;
        height:auto;
        transition: .3s;
        margin-top: -1px;
        &.closed{
            height:$closeHeight;
        }
    }
    .ui-dropdown-content{
        
        
    }
    .ui-dropdown-title{
        font-size: .8rem;
        color: #999;
        height: $closeHeight;
        display: flex;
        padding: 0 1rem;
        align-items: center;
        justify-content: space-between;
    }
    .icon{
        color:#ddd;
        &.droped{
            color:#999;
        }
    }
</style>
<template>
    <div class="ui-dropdown" :class="{closed:!droped}">
        <div @click="toggle" class="ui-dropdown-title">
            {{title}}
            <icon class="icon" name="sort" :class="{droped:droped}"></icon>
        </div>
        <div class="ui-dropdown-content" >
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name:'ui-dropdown',
        props:{
            title:{
                type:String
            },
            value:{
                type:Boolean,
            }
        },
        data(){
            return {
                dropdownHeight:0,
                droped:true,
            }
        },
        beforeMount(){
            this.droped = this.value
        },
        watch:{
            droped(){
                this.$emit('input',this.droped)
            }
        },
        methods:{
            toggle(){
                this.droped = !this.droped
            }
        },
    }
</script>
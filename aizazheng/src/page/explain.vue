<template>
    <div class="fillcontain">
        <head-top></head-top>
        <p class="explain_text">爱咋整后台管理系统</p>
        <p class="explain_text">这里没有说明书</p>
        <p class="explain_text">5秒之后会跳转</p>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
    export default {
    	components: {
    		headTop,
    	},created(){
            setTimeout(function(){
                window.location.href='http://www.html5tricks.com/demo/html5-canvas-dance-time/index.html'
            }, 5000)
        }
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.explain_text{
		margin-top: 20px;
		text-align: center;
		font-size: 20px;
		color: #333;
	}
</style>

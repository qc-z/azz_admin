<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%; background-color: #324057;">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
					<el-menu-item  index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-submenu index="2">
						<template slot="title"><i class="el-icon-document"></i>数据管理</template>
						<!-- <el-menu-item  index="userList">客户列表</el-menu-item> -->
						<el-menu-item  index="redPack">红包列表</el-menu-item>
						<el-menu-item  index="priceList">价格列表</el-menu-item>
						<!-- <el-menu-item  index="shopList">商家列表</el-menu-item> -->
						<el-menu-item  index="apkList">apk列表</el-menu-item>
						<el-menu-item  index="caseList">案例列表</el-menu-item>
						<el-menu-item  index="couponList">优惠券列表</el-menu-item>
						<el-menu-item  index="timepriceList">限时优惠列表</el-menu-item>
						<el-menu-item  index="hotList">热更新列表</el-menu-item>
						<el-menu-item  index="adList">广告列表</el-menu-item>
						<el-menu-item  index="ProjectList">推荐项目列表</el-menu-item>
						<el-menu-item  index="clientList">店长列表</el-menu-item>
						<!-- <el-menu-item v-bind:class="{ unactive: isHide }" index="orderList">订单列表</el-menu-item> -->
						<!-- <el-menu-item v-bind:class="{ unactive: isHide }" index="adminList">管理员列表</el-menu-item> -->
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="el-icon-plus"></i>添加数据</template>
						<el-menu-item index="addApk">添加apk</el-menu-item>
						<el-menu-item index="addHot">添加热更新</el-menu-item>
						<el-menu-item index="addPrice">添加价格</el-menu-item>
						<el-menu-item index="addVideo">添加视频</el-menu-item>
						<el-menu-item index="ad">添加广告</el-menu-item>
						<!-- <el-menu-item index="addShop">微整百科详情</el-menu-item> -->
						<!-- <el-menu-item index="addGoods">添加商品</el-menu-item> -->
						<el-menu-item index="testupload">添加微整百科</el-menu-item>
						<el-menu-item index="addCase">添加案例</el-menu-item>
						<el-menu-item index="addCoupon">添加优惠券</el-menu-item>
						<el-menu-item index="addTimeprice">添加限时优惠</el-menu-item>
						<el-menu-item index="addProject">添加推荐项目</el-menu-item>
						<el-menu-item index="addTemplate">添加模板</el-menu-item>
						<el-menu-item index="addCarousel">添加轮播图</el-menu-item>
						<el-menu-item index="addClient">添加店长</el-menu-item>
					</el-submenu>
					<el-submenu index="4">
						<template slot="title"><i class="el-icon-star-on"></i>图表</template>
						<el-menu-item v-bind:class="{ unactive: isHide }" index="visitor">用户分布</el-menu-item>
						<!-- <el-menu-item v-bind:class="{ unactive: isHide }" index="newMember">用户数据</el-menu-item> -->
					</el-submenu>
					<el-submenu index="5">
						<template slot="title"><i class="el-icon-edit"></i>编辑</template>
						<!-- <el-menu-item v-bind:class="{ unactive: isHide }" index="uploadImg">上传图片</el-menu-item> -->
						<el-menu-item v-bind:class="{ unactive: isHide }" index="vueEdit">文本编辑</el-menu-item>
					</el-submenu>
					<el-submenu index="6">
						<template slot="title"><i class="el-icon-setting"></i>设置</template>
						<el-menu-item v-bind:class="{ unactive: isHide }" index="adminSet">管理员设置</el-menu-item>
						<!-- <el-menu-item v-bind:class="{ unactive: isHide }" index="sendMessage">发送通知</el-menu-item> -->
					</el-submenu>
					<el-submenu index="7">
						<template slot="title"><i class="el-icon-warning"></i>说明</template>
						<el-menu-item v-bind:class="{ unactive: isHide }" index="explain">说明</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
    export default {
    	data() {
    		return {
    			isHide: false
    		}
    	},
    	created() {
    		this.isHide = sessionStorage.getItem('role') == '0' ? false : true
    		console.log(this.isHide)
    	},
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
		},
    }
</script>


<style lang="less" scoped>
	@import '../style/mixin';
	.manage_page{
		
	}
	.unactive {
		display: none;
	}
</style>

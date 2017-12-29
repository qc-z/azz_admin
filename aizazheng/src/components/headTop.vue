<template>
    <div class="header_container">

		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta" key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-dropdown  menu-align='start'>
			<img src="http://azz-test.oss-cn-shenzhen.aliyuncs.com/timg.jpeg" class="avator">
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="home">首页</el-dropdown-item>
				<el-dropdown-item command="singout"><a @click="out">退出</a></el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
    </div>
</template>

<script>
	import {signout,sysSignOut,clientSignOut} from '@/api/getData'
	import {baseImgPath} from '@/config/env'
	import {mapActions, mapState} from 'vuex'

    export default {
    	data(){
    		return {
    			baseImgPath,
    		}
    	},
    	created(){
    		if (!this.adminInfo._id) {
    			// this.getAdminData()
    		}
    	},
    	computed: {
    		...mapState(['adminInfo']),
    	},
		methods: {
			out() {
			    this.$confirm('你将要退出登录', '提示', {
			      confirmButtonText: '确定',
			      cancelButtonText: '取消',
			      type: 'warning'
			    }).then(async () => {
			    	if(localStorage.getItem('role') == "1"){
						let	sys = await sysSignOut()
						if(sys.code == 1){
							this.$message({
						        type: 'success',
						        message: '退出成功!'
						      });
						     this.$router.push('/')
						}
						
			    	}else{
			    		let	client = await clientSignOut()
						if(client.code == 1){
							this.$message({
						        type: 'success',
						        message: '退出成功!'
						      });
						     this.$router.push('/')
						}
			    	}
			      
			    }).catch(() => {
			      this.$message({
			        type: 'info',
			        message: '已取消'
			      });          
			    });
			  },
			// ...mapActions(['getAdminData']),
			async handleCommand(command) {
				if (command == 'home') {
					this.$router.push('/manage');
				}else if(command == 'singout'){
					const res = await signout()
					if (res.status == 1) {
						this.$message({
	                        type: 'success',
	                        message: '退出成功'
	                    });
	                    this.$router.push('/');
					}else{
						this.$message({
	                        type: 'error',
	                        message: res.message
	                    });
					}
				}
			}
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
	.avator{
		.wh(45px, 45px);
		border-radius: 50%;
		margin-right: 37px;
	}
	.el-dropdown-menu__item{
        text-align: center;
    }
</style>

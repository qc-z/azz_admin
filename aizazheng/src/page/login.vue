<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">
		  		<div class="manage_tip">
		  			<p>爱咋整后台管理系统</p>
		  		</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm">
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" placeholder="用户名"><span>jige</span></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="密码" v-model="loginForm.password" ></el-input>
					</el-form-item>
					<el-form-item>
				    	<el-button type="primary" @click="submitForm('loginForm')" class="submit_btn" >{{text}}</el-button>
				  	</el-form-item>
				</el-form>
				<p class="tip">温馨提示：</p>
				<p class="tip">不要在不安全的设备登录</p>
				<p class="tip">遇到账号密码忘记或者登录不上的问题，请联系技术支持</p>
				 <el-button size="small" round type="warning" class="right"  @click="admin">{{adminT}}</el-button>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
	import {login, getAdminInfo,clientLogin} from '@/api/getData'
	import {mapActions, mapState} from 'vuex'

	export default {
	    data(){
			return {
				loginForm: {
					username: '',
					password: '',
				},
				isAdmin:false,
				text:"普通用户登陆",
				adminT:"超级管理员登陆",
				rules: {
					username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
				},
				showLogin: false
			}
		},
		mounted(){
			this.showLogin = true;
			console.log(this.adminInfo)
			// if (!this.adminInfo.id) {
   //  			this.getAdmidnData()
   //  		}
		},
		computed: {
			...mapState(['adminInfo']),
		},
		methods: {
			admin(){
				if(this.isAdmin){
					this.isAdmin = false
					this.text = "普通用户登陆"
					this.adminT = "超级管理员登陆"

				}else{
					this.isAdmin = true
					this.adminT = "普通用户登陆"
					this.text = "超级管理员登陆"

				}
			},
			...mapActions(['getAdminData']),
			async submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let res
						console.log(this.isAdmin)
						if(this.isAdmin){
							res = await login({username: this.loginForm.username, password: this.loginForm.password})
							localStorage.setItem('role', 1)
						}else{
						    res = await clientLogin({username: this.loginForm.username, password: this.loginForm.password})
							localStorage.setItem('role', 0)
							

						}
		                console.log(res)

						if (res.code == 1) {
							this.$message({
		                        type: 'success',
		                        message: '登录成功'
		                    });
		                    this.getAdminData(res.clientId);
		                    console.log(this.adminInfo)
							this.$router.push('manage')
						}else{
							this.$message({
		                        type: 'error',
		                        message: res.err
		                    });
		      //               if(res.err == "用户已登录"){
		      //               	this.$message({
			     //                    type: 'error',
			     //                    message: res.err
			     //                });
								// this.$router.push('manage')
		      //               }
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请输入正确的用户名密码',
							offset: 100
						});
						return false;
					}
				});
			},
		},
		watch: {
			adminInfo: function (newValue){
					console.log(newValue)
				if (newValue.id) {
					this.$message({
                        type: 'success',
                        message: '检测到您之前登录过，将自动登录'
                    });
					this.$router.push('manage')
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.login_page{
		background-color: #324057;
	}
	.manage_tip{
		position: absolute;
		width: 100%;
		top: -100px;
		left: 0;
		p{
			font-size: 34px;
			color: #fff;
		}
	}
	.form_contianer{
		.wh(320px, 270px);
		.ctp(320px, 210px);
		padding: 25px;
		border-radius: 5px;
		text-align: center;
		background-color: #fff;
		.submit_btn{
			width: 100%;
			font-size: 16px;
		}
	}
	.tip{
		font-size: 12px;
		color: red;
	}
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
	.right{
		float:right
	}
</style>

<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="12" :offset="4">
		        <el-form :model="formData"  ref="formData" label-width="110px" class="demo-formData">
					<el-form-item label="id" prop="id">
						<el-input v-model="formData.id" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="版本名字" prop="versionName">
						<el-input v-model="formData.versionName"></el-input>
					</el-form-item>
					<el-form-item label="下载地址" prop="download">
						<div class="upload ">
				        	<upload :id="id" :multiple="true" @select-url="onSelectUrl" :url="wurl"></upload>
				        </div>
						<el-input v-model="formData.download" type="textarea"></el-input>
					</el-form-item>
					
					<el-form-item label="更新类型" style="white-space: nowrap;">
						<span>强制更新</span>
						<el-switch on-text="" off-text="" v-model="formData.updateHard"></el-switch>
					</el-form-item>
					
					<el-form-item label="更新次数" prop="float_delivery_fee">
						<el-input-number v-model="formData.versionCode" :min="0" ></el-input-number>
					</el-form-item>
					<el-form-item label="设备类型">
					  <el-radio v-model="formData.device" label="pc">pc</el-radio>
					  <el-radio v-model="formData.device" label="app">app</el-radio>
					</el-form-item>
					<el-form-item label="是否美甲机">
					  <el-radio v-model="formData.ismeijiaji" label="azz">爱咋整</el-radio>
					  <el-radio v-model="formData.ismeijiaji" label="mjj">美甲机</el-radio>
					</el-form-item>
					<!-- <el-form-item label="设备类型">
						<el-radio class="radio" v-model="formData.device" label="one">pc</el-radio>
  						<el-radio class="radio" v-model="formData.device" label="more">app</el-radio>
					</el-form-item> -->
					<el-form-item class="button_submit">
						<el-button type="primary" @click="submitForm(formData)">立即创建</el-button>
					</el-form-item>
				</el-form>
  			</el-col>
  		</el-row>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
  	import upload from '../components/fileupload'
    import {addApk} from '@/api/getData'
    export default {
    	data(){
    		return {
    			city: {},
    			wurl:[],
    			id:"download",
    			formData: {
					id: '', //唯一id，表示每个发行版本的唯一id
					versionName: '', //版本号
					download: '',	//下载地址
					versionCode: 0,	//版本更新次数
					updateHard: true, //是否强制更新
       	 			device: 'pc', //pc或者app
       	 			ismeijiaji: 'azz', //pc或者app

		        },
    		}
    	},
    	components: {
    		headTop,
    		upload
    	},
    	mounted(){
    		// this.initData();
    	},
    	methods: {
    		submitForm(formData){
    			console.log(formData)
    			this.addApk()
    		},
    		async onSelectUrl(url){
		        console.log("url???",url)
		        this.formData.download = url[0]
		      },
      async addApk(){
        let add = await addApk({
		        	id:this.formData.id,
		        	versionName:this.formData.versionName,
		        	download:this.formData.download,
		        	versionCode:this.formData.versionCode,
		        	updateHard:this.formData.updateHard == false?"no":"yes",
		        	device:this.formData.device,
		        	type:this.formData.ismeijiaji,
		        }); 
        console.log(this.formData.id)
        if(add.ret == 1){
          this.$message({
              type: 'success',
              message: '添加成功'
          });
		this.$router.push('apkList?random='+Math.random())

        }else if(add.ret == 0){
          this.$message({
              type: 'error',
              message: add.msg
          });
        }
      }
		    
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.button_submit{
		text-align: left;
	}
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
	    border-color: #20a0ff;
	}
	.avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 120px;
	    height: 120px;
	    line-height: 120px;
	    text-align: center;
	}
	.avatar {
	    width: 120px;
	    height: 120px;
	    display: block;
	}
	.el-table .info-row {
	    background: #c9e5f5;
	}

	.el-table .positive-row {
	    background: #e2f0e4;
	}
	.upload{
	    border: 1px solid #ddd;
	    width: 100px;
	    height: 100px;
	    border-radius: 4px;
	    background: url('../assets/img/add_upload.png');
	    background-size: contain;
	    float:left;
	  }

	.text{
		position: absolute;
		top:-30%
	}
	.buttons{
		margin-left:8rem;
		margin-top:1rem;
	}
</style>

<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="12" :offset="4">
		        <el-form :model="formData"  ref="formData" label-width="110px" class="demo-formData">
					<el-form-item label="资源名称" prop="resName">
						<el-input v-model="formData.resName"></el-input>
					</el-form-item>
					<!-- <el-form-item label="版本" prop="version">
						<el-input v-model="formData.version"></el-input>
					</el-form-item> -->
					<el-form-item label="版本" prop="float_delivery_fee">
						<el-input-number v-model="formData.version" :min="0"></el-input-number>
					</el-form-item>
					<el-form-item label="下载地址" prop="resUrl">
						<div class="upload ">
				        	<upload :id="id" :multiple="true" @select-url="onSelectUrl" :url="wurl"></upload>
				        </div>
						<el-input v-model="formData.resUrl" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="资源文件夹" prop="resType">
						<el-input v-model="formData.resType"></el-input>
					</el-form-item>
					<el-form-item label="设备类型">
					  <el-radio v-model="formData.device" label="pc">pc</el-radio>
					  <el-radio v-model="formData.device" label="app">app</el-radio>
					</el-form-item>
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
    import {addHotload} from '@/api/getData'
    export default {
    	data(){
    		return {
    			id:"resUrl",
    			city: {},
    			wurl:[],
    			formData: {
					resName: '', //资源名称
					version: '', //版本
					resUrl: '',	//下载地址
					resType: '',	//放到那个资源文件夹（html, css, js, image, base）
					device: 'pc'	//pc app

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
		        this.formData.resUrl = url[0]
		      },
      async addApk(){
        let add = await addHotload({
		        	resName:this.formData.resName,
		        	version:this.formData.version,
		        	resUrl:this.formData.resUrl,
		        	resType:this.formData.resType,
		        	device:this.formData.device
		        }); 
        console.log(add)
        if(add.ret == 1){
          this.$message({
              type: 'success',
              message: '添加成功'
          });
		this.$router.push('hotList?random='+Math.random())

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

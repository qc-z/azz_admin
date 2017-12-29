<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="12" :offset="4">
		        <el-form :model="formData"  ref="formData" label-width="110px" class="demo-formData">
					<el-form-item label="编号" prop="typeName">
						<el-input v-model="formData.typeName" type="textarea" autosize></el-input>
					</el-form-item>
					<el-form-item label="部位" prop="projectType">
						<el-input v-model="formData.projectType"></el-input>
					</el-form-item>
					<el-form-item label="名称" prop="projectName">
						<el-input v-model="formData.projectName"></el-input>
					</el-form-item>
					<el-form-item label="价格" prop="projectPrice">
						<el-input v-model="formData.projectPrice" type="textarea" autosize></el-input>
					</el-form-item>
					<el-form-item label="区域" prop="area">
						<el-input v-model="formData.area" type="textarea" autosize></el-input>
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
    import {addProject} from '@/api/getData'
    export default {
    	data(){
    		return {
    			formData: {
					projectType: '',
				    projectName: '',
				    projectPrice: '',
				    area: '',
				    typeName:''
		        },
    		}
    	},
    	components: {
    		headTop
    	},
    	mounted(){
    		// this.initData();
    	},
    	methods: {
    		submitForm(formData){
    			console.log(formData)
    			this.addApk()
    		},
      async addApk(){
        let add = await addProject({
        	projectType:this.formData.projectType,
        	projectName:this.formData.projectName,
        	projectPrice:this.formData.projectPrice,
        	area:this.formData.area,
        	typeName:this.formData.typeName
        }); 
        if(add.ret == 1){
          this.$message({
              type: 'success',
              message: '添加成功'
          });
		this.$router.push('projectList?random='+Math.random())

        }else if(add.ret == 0){
          this.$message({
              type: 'error',
              message: add.err
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
	.active {
		display: none;
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

	 .upimg{
	    max-width: 100px;
	    max-height: 100px;
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

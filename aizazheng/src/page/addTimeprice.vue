<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="12" :offset="4">
		        <el-form :model="formData"  ref="formData" label-width="110px" class="demo-formData">
					<el-form-item label="标题" prop="title">
						<el-input v-model="formData.title"></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="des">
						<el-input v-model="formData.des" type="textarea" autosize></el-input>
					</el-form-item>
					<el-form-item label="整形前" prop="img">
						<div class="upload " v-bind:class="{ active: isHide }">
				        	<upload :id="img" :multiple="true" @select-url="onSelectUrl" :url="url"></upload>
				        </div>
						<img :src="formData.img" class="upimg"></img>
					</el-form-item>
					<el-form-item label="实际价格" prop="price">
						<el-input v-model="formData.price"></el-input>
					</el-form-item>
					<el-form-item label="划掉价格" prop="priceH">
						<el-input v-model="formData.priceH"></el-input>
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
    import {addTimeprice} from '@/api/getData'
    export default {
    	data(){
    		return {
    			url: [],
    			isHide: false,
    			img: 'img',
    			formData: {
					price: '',
					priceH: '',
					title: '',
					des: '',
					img: ''
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
		        this.formData.img = url[0]
		        this.isHide = true;
		      },
      async addApk(){
      	
        let add = await addTimeprice({
        	price:this.formData.price,
        	title:this.formData.title,
        	des:this.formData.des,
        	img:this.formData.img,
        	priceH:this.formData.priceH
        }); 
        if(add.ret == 1){
          this.$message({
              type: 'success',
              message: '添加成功'
          });
		this.$router.push('timepriceList?random='+Math.random())

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

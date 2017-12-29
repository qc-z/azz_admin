<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="12" :offset="4">
		        <el-form :model="formData"  ref="formData" label-width="110px" class="demo-formData">
					<el-form-item label="标题" prop="title">
						<el-input v-model="formData.title"></el-input>
					</el-form-item>
					<el-form-item label="类别" prop="category">
						<el-input v-model="formData.category"></el-input>
					</el-form-item>
					<el-form-item label="价格" prop="price">
						<el-input v-model="formData.price"></el-input>
					</el-form-item>
					<el-form-item label="使用条件" prop="limit">
						<el-input v-model="formData.limit"></el-input>
					</el-form-item>
					<div class="block">
					    <span class="demonstration">开始结束时间</span>
					    <el-date-picker
					      v-model="value"
					      type="daterange"
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期">
					    </el-date-picker>
					</div>
					<el-form-item label="区域" prop="area">
						<el-input v-model="formData.area"></el-input>
					</el-form-item>
					<el-form-item label="中奖概率%" prop="prob">
						<el-input-number v-model="formData.prob" :min="0" :max="100" label="中奖概率"></el-input-number>
					</el-form-item>
					<el-form-item label="描述" prop="des">
						<el-input v-model="formData.des" type="textarea" autosize></el-input>
					</el-form-item>
					<el-form-item label="展示图" prop="img">
						<div class="upload " v-bind:class="{ active: isHide }">
				        	<upload :id="img" :multiple="true" @select-url="onSelectUrl" :url="url"></upload>
				        </div>
						<img :src="formData.img" class="upimg"></img>
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
    import {addCoupon} from '@/api/getData'
    export default {
    	data(){
    		let that = this;
    		return {
    			url: [],
    			isHide: false,
    			img: 'img',
    			formData: {
					title: '',
					category: '',
					des: '',
					area: '',
					prob: '',
					img: '',
					price:'',
					limit:''
		        },
		        dateStart: '',
		        dateEnd: '',
		        value:""
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
		        this.formData.img = url[0]
		        this.isHide = true;
		      },
      	async addApk(){
        let add = await addCoupon({
        	title:this.formData.title,
        	category:this.formData.category,
        	des:this.formData.des,
        	img:this.formData.img,
        	area:this.formData.area,
        	prob:this.formData.prob,
        	dateStart:this.value[0],
        	dateEnd:this.value[1],
        	price:this.formData.price,
        	limit:this.formData.limit,
        });
        console.log(this.value)
        if(add.ret == 1){
          this.$message({
              type: 'success',
              message: '添加成功'
          });
		this.$router.push('couponList?random='+Math.random())

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
	.demonstration {
		margin-left:.6rem;
	}
	.block{
		margin-bottom:1rem;
	}
</style>

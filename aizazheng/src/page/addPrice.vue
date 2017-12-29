<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="12" :offset="4">
		        <el-form :model="formData"  ref="formData" label-width="110px" class="demo-formData">
					<el-form-item label="项目名称" prop="name">
						<el-input v-model="formData.name"></el-input>
					</el-form-item>
					<el-form-item label="成交价格" prop="deal">
						<el-input v-model="formData.deal"></el-input>
					</el-form-item>
					<el-form-item label="最高价格" prop="high">
						<el-input v-model="formData.high"></el-input>
					</el-form-item>
					<el-form-item label="最低价格" prop="low">
						<el-input v-model="formData.low"></el-input>
					</el-form-item>
					<el-form-item label="平均价格" prop="average">
						<el-input v-model="formData.average"></el-input>
					</el-form-item>
					<el-form-item label="地区" prop="region">
						<el-input v-model="formData.region"></el-input>
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
    import {addPrice} from '@/api/getData'
    export default {
    	data(){
    		return {
    			city: {},
    			formData: {
					name: '', //唯一id，表示每个发行版本的唯一id
					deal: '', //版本号
					high: '',	//下载地址
					low: '',	//版本更新次数
					average: '', //是否强制更新
       	 			region: '' //pc或者app

		        },
    		}
    	},
    	components: {
    		headTop,
    	},
    	mounted(){
    		// this.initData();
    	},
    	methods: {
    		submitForm(formData){
    			console.log(formData)
    			this.addPrice()
    		},
      async addPrice(){
        let add = await addPrice(this.formData); 
        console.log(add)
        if(add.code == 1){
          this.$message({
              type: 'success',
              message: '添加成功'
          });
		this.$router.push('priceList?random='+Math.random())

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
</style>

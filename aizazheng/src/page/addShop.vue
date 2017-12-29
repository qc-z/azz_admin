<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="12" :offset="4">
		        <el-form :model="formData" :rules="rules" ref="formData" label-width="110px" class="demo-formData">
		        	<el-form-item class="button_submit">
						<el-button type="primary" @click="toggleState()" v-if="showEdit">编辑</el-button>
					</el-form-item>
					<el-form-item class="button_submit">
						<el-button type="primary" @click="submitForm()"  v-if="showSave">保存</el-button>
					</el-form-item>
					<el-form-item label="项目名称" prop="name">
						<el-input v-model="formData.name" :disabled="disabled"></el-input>
					</el-form-item>
					</el-form-item>
					<el-form-item label="价格" prop="price">
						<el-input v-model.number="formData.price" maxLength="11" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="维持时间" prop="time">
						<el-input v-model="formData.time" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="美容方法" prop="method">
						<el-input v-model="formData.method" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="简介" prop="introduction">
						<el-input  type="textarea" v-model="formData.introduction" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="功效" prop="effect">
						<el-input v-model="formData.effect" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="适合人群" prop="fitPeople">
						<el-input  type="textarea" v-model="formData.fitPeople" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="禁忌人群" prop="tabooPeople">
						<el-input  type="textarea" v-model="formData.tabooPeople" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="优点" prop="advantage">
						<el-input  type="textarea" v-model="formData.advantage" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="缺点" prop="weak">
						<el-input  type="textarea" v-model="formData.weak" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="其他" prop="other">
						<el-input  type="textarea" v-model="formData.other" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="术前准备" prop="treatProcess">
						<el-input  type="textarea" v-model="formData.treatProcess" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="治疗过程" prop="surgicalPre">
						<el-input  type="textarea" v-model="formData.surgicalPre" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="术后康复" prop="surgicalCare">
						<el-input  type="textarea" v-model="formData.surgicalCare" :disabled="disabled"></el-input>
					</el-form-item>
					<i class="el-icon-picture"  @click="handleEdit()">上传图片</i>
					
					<el-dialog title="上传照片" v-model="dialogFormVisible">
		                <el-row style="margin-top: 20px;">
		                    <el-col :span="12" :offset="4">
		                        <el-form  label-width="110px" class="demo-selectTable">
							        <div class="upload upload1" style="display: none">
		                           <span class="text">微整对比图</span>

							        	<upload :id="id" :multiple="true" :url.sync="urls" :bucket-url="bucketUrl" @select-type="onSelectType" @select-url="onSelectUrl" :url="wurl" :text="wtext"></upload>
							        	<div class="introduction" v-for="(item,index) in wtext">
							        		第{{index+1}}张图片介绍:
							        		<el-input  type="textarea"
  									:autosize="{ minRows: 2, maxRows: 4}"  class="wText" v-bind:name="item" v-bind:value="item"></el-input>
							        	</div>
							        	<!-- document.getElementsByClassName("inputText")[0].children[0].name -->
							        </div>
							        <div class="upload  upload1">
							        <span class="text">顶部展示图</span>

							        	<upload :id="id3" :multiple="true" :url.sync="urls" :bucket-url="bucketUrl" @select-type="onSelectType" @select-url="onSelectUrl" :url="durl" :text="dtext"></upload>
							        	<div class="introduction" v-for="(item,index) in dtext">
							        		第{{index+1}}张图片介绍:
							        		<el-input  type="textarea"
  									:autosize="{ minRows: 2, maxRows: 4}"  class="dText" v-bind:name="item" v-bind:value="item"></el-input>
							        	</div>
							        </div> 
							        <div class="upload">
							        <span class="text">底部施术图</span>

							        	<upload :id="id2" :multiple="true" :url.sync="urls" :bucket-url="bucketUrl" @select-type="onSelectType" @select-url="onSelectUrl" :url="surl" :text="stext"></upload>
							        	<div class="introduction" v-for="(item,index) in stext">
							        		第{{index+1}}张图片介绍:
							        		<el-input type="textarea"
  									:autosize="{ minRows: 2, maxRows: 4}"
									    class="sText" v-bind:name="item" v-bind:value="item"></el-input>
							        	</div>
							        </div> 
							        
		                        </el-form>
		                    </el-col>
		                </el-row>
		                <div slot="footer" class="dialog-footer">
		                    <el-button @click="dialogFormVisible = false">取 消</el-button>
		                    <el-button type="primary" @click="submitPho()">确 定</el-button>
		                </div>
		            </el-dialog>
					
					
				</el-form>
  			</el-col>
  		</el-row>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
  	import upload from '../components/aliossupload'
    import {editOperation,getOperation} from '@/api/getData'
    export default {
    	data(){
    		return {
    			showEdit:true,
    			showSave:false,
    			disabled:true,
    			thisid:"",
    			wurl:[],
    			surl:[],
    			durl:[],
    			wtext:[],
    			stext:[],
    			dtext:[],
    			id:'operationProjectDatas',
    			id2:'schematicschematic',
    			id3:'collationschematic',
    			urls:[],
    			photoid:"",
        		bucketUrl:'http://azz-test.oss-cn-shenzhen.aliyuncs.com/<Desert class="jpg"></Desert>',
    			city: {},
    			dialogFormVisible: false,
    			formData: {
    				selectType: 0,
					id:"",
					id2:"",
					name:"",
					parentid:"",
					price:"",
					time:"",
					method:"",
					introduction:"",
					effect:"",
					fitPeople:"",
					tabooPeople:"",
					advantage:"" ,
					weak:"",
					other:"",
					treatProcess:"",
					surgicalPre:"",
					surgicalCare:""
       	 			
		        },
		        rules: {
					// name: [
					// 	{ required: true, message: '请输入店铺名称', trigger: 'blur' },
					// ],
					// address: [
					// 	{ required: true, message: '请输入详细地址', trigger: 'blur' }
					// ],
					// phone: [
					// 	{ required: true, message: '请输入联系电话' },
					// 	{ type: 'number', message: '电话号码必须是数字' }
					// ],
				},
    		}
    	},
    	components: {
    		headTop,
    		upload
    	},
    	created(){
    		this.formData.id = location.href.split("?")[1].split("=")[1]
            this.thisid = this.formData.id
            this.getOperation()
            
        },
    	mounted(){
    		this.initData();
    	},
    	methods: {
    		async initData(){
    			
    		},
    		async submitForm(){
    			console.log(this.formData)
    			let operation = await editOperation(this.formData);
    			console.log(operation)
    			if(operation.code == 1){
    				this.$message({
		              type: 'success',
		              message: '修改成功'
		          });
    				this.showSave = false
            	this.showEdit = true
            	this.disabled = true
    			}

    		},
    		onSelectType (type) {
		        this.selectType = type
		        
		      },
		      async onSelectUrl(url){
		        console.log("url???",url)

		      	if(this.selectType == "operationProjectDatas"){
		        	this.wurl = url
		        	this.wtext = url
		      	}
		      	if(this.selectType == "schematicschematic"){
		        	this.surl = url
		        	this.stext = url

		      	}
		      	if(this.selectType == "collationschematic"){
		        	this.durl = url
		        	this.dtext = url

		      	}
		        
		      },
            handleEdit(row) {
                this.dialogFormVisible = true;
            },
            async getOperation(){
		        let operation = await getOperation({id:this.formData.id});
		        let result = operation.operations
		        this.formData = result
		        for(let item in result.operationProjectDatas){
		        	this.wurl.push(result.operationProjectDatas[item].url)
		        	this.wtext.push(result.operationProjectDatas[item].title)
		        }
		        for(let item in result.collationschematic){
		        	this.durl.push(result.collationschematic[item].url)
		        	this.dtext.push(result.collationschematic[item].title)

		        }
		        for(let item in result.schematicschematic){
		        	this.surl.push(result.schematicschematic[item].url)
		        	this.stext.push(result.schematicschematic[item].title)

		        }
		        
		    },toggleState(){
		    	this.showSave = true
            	this.showEdit = false
            	this.disabled = false
		    },async submitPho(){
		    	let wcurrent = document.getElementsByClassName("wText")
		    	let scurrent = document.getElementsByClassName("sText")
		    	let dcurrent = document.getElementsByClassName("dText")
		    	let wtext = []
		    	let stext = []
		    	let dtext = []
		    	for(let i = 0;i < wcurrent.length;i++){
					wtext.push(wcurrent[i].children[0].value)
		    	}
		    	for(let i = 0;i < scurrent.length;i++){
					stext.push(scurrent[i].children[0].value)
					console.log("我是合适",stext)
		    	}
		    	for(let i = 0;i < dcurrent.length;i++){
					dtext.push(dcurrent[i].children[0].value)
		    	}
		    	// for(let item in wcurrent){
		    	// 	// console.log("wcurrent",wcurrent.length)
		    	// 	console.log("wcurrent",wcurrent[item])
		    	// }
		    	let wcurrentUrl = []
		    	for(let item in this.wurl){
		    		// console.log(this.wurl[item])
					wcurrentUrl.push({url:this.wurl[item],title:wtext[item]})
		    	}

		    	let scurrentUrl = []
		    	for(let item in this.surl){
		    		// console.log(this.surl[item])
					scurrentUrl.push({url:this.surl[item],title:stext[item]})
		    	}
				
				let dcurrentUrl = []
		    	for(let item in this.durl){
		    		// console.log(this.durl[item])
					dcurrentUrl.push({url:this.durl[item],title:dtext[item]})
		    	}    			// console.log("dcurrentUrl",dcurrentUrl)
		        let addpic = await editOperation({id:this.formData.id,operationProjectDatas:wcurrentUrl,schematicschematic:scurrentUrl,collationschematic:dcurrentUrl});
    			console.log(addpic)
    			if(addpic.code == 1){
		          this.$message({
		              type: 'success',
		              message: '上传图片成功',
		              duration:1000,
		              onClose:function(){
		              	location.reload()
		              }
		          });
		        
                
				// setTimeout(function(){
				// 	location.reload()
				// },1000)
		        }
		    }
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.button_submit{
		text-align: center;
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
	  .upload1{
	    margin-right:4rem;
	  }
	  .upload:hover{
	    opacity: 0.8;
	    border: 1px solid #ddd;
	  }
	  .el-dialog--small {
	    width: 80%;
	    heighth: 10rem;
	    height: 50rem;
	}
	.el-dialog__footer {
	    margin-top:30rem;
	}
	.text{
		position: absolute;
		top:-30%
	}
	.el-input.is-disabled .el-input__inner  {
	    
	    font-size: 1rem;
	}
	.el-textarea.is-disabled .el-textarea__inner {
	    font-size: 1rem;
	}
	.el-icon-picture{
		cursor:pointer
	}
	.introduction{
		margin-top:1rem;
	}
	.el-icon-picture{
		margin-bottom:5rem
	}
</style>

<template>
    <div>
        <el-row>
        <el-col :span="12" :offset="4">
            <el-form  label-width="110px" class="demo-selectTable">
		        <div class="upload upload1" >
               <span class="text">轮播图</span>

		        	<upload :id="id" :multiple="true" :url.sync="urls"  @select-type="onSelectType" @select-url="onSelectUrl" :url="wurl" :text="wtext"></upload>
		        	<div class="introduction" v-for="(item,index) in wtext">
		        		第{{index+1}}张轮播图跳转地址:
		        		<el-input  type="textarea"
					:autosize="{ minRows: 2, maxRows: 4}"  class="wText" v-bind:name="item" v-bind:value="item" ref="sub"></el-input>
		        	</div>
		        	<!-- document.getElementsByClassName("inputText")[0].children[0].name -->
		        </div>
		        
		        
            </el-form>
            <el-button type="primary" @click="submitPho()">确 定</el-button>
        </el-col>
        <el-table
                :data="tableData"
                class="eltable">
                <el-table-column label="展示图">
                  <template slot-scope="props">
                    <img :src="props.row.img" class="img_table">
                  </template>
                  
                </el-table-column>
                <el-table-column
	                  label="跳转地址"
	                  prop="url">
	              </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDelete">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
    </el-row>
    </div>		                
</template>
<script>
    import headTop from '@/components/headTop'
  	import upload from '../components/aliossupload'
    import {addCarousel,getCarousel,deleteCarousel} from '@/api/getData'
	export default {
    	data(){
    		return {
				id:"id",
				urls:[],
				wurl:[],
				wtext:[],
				carousel:[],
				tableData:[]
    		}
    	},created(){
            this.getC();
        },
    	components: {
    		headTop,
    		upload
    	},methods:{
			onSelectType (type) {
		        this.selectType = type
		        
		      },onSelectUrl(url){
		        console.log("url???",url)

		      	
		        	this.wurl = url
		        	for(let i in url){
		        		this.wtext[i] = ""

		        	}
		      			
		        
		      },async getC(){
				let getC = await getCarousel();
		      	console.log(getC.carousel)
		      	this.tableData = getC.carousel

		      },async handleDelete() {
		      	let dele = await deleteCarousel()
                if (dele.code == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除轮播图成功'
                        });
                        window.location.reload()
                    }
            },
		      async submitPho(){

		      	this.$refs.sub.forEach((item, index) => {
		      		this.carousel.push({url:item.currentValue,img:this.wurl[index]})
		      	})
		      	console.log(this.carousel)
				
		      	let add = await addCarousel(this.carousel);
		      	if(add.code == 1){
		      		this.$message({
		              type: 'success',
		              message: '添加成功',

		          });
		      		setTimeout(function(){
		      			window.location.reload()
		      		},1000)
		      	}
		      }
    	}
    }
</script>
<style lang="less" scoped>
	@import '../style/mixin';
	
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
	
	.text{
		position: absolute;
		top:-10%
	}
	.el-row{
		margin-top:8rem
	}
	.img_table {
      width: 100px;
      height: 100px;
    }
    .eltable{
    	width:50%;
    	float:right;
    	margin-right:3rem;
    	margin-top:3rem;
    }
</style>








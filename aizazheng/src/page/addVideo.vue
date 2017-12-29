<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 4rem;margin-left: 8rem;" >
  			<div class="upload ">
               <span class="text">请上传视频</span>
		        	<upload :id="id" :multiple="true" :url.sync="urls" :bucket-url="bucketUrl"  @select-url="onSelectUrl" :url="wurl"></upload>
		        </div>

  		</el-row>
		<!-- <el-button type="primary" @click="submitForm(formData)" class="buttons">立即创建</el-button> -->

    </div>
</template>

<script>
    import headTop from '@/components/headTop'
  	import upload from '../components/aliyunossvideo'
    import {addVideo,getVideo} from '@/api/getData'
    export default {
    	data(){
    		return {
    			showEdit:true,
    			showSave:false,
    			disabled:true,
    			wurl:[],
    			id:'operationProjectDatas',
    			urls:[],
        		bucketUrl:'http://azz-test.oss-cn-shenzhen.aliyuncs.com/<Desert class="jpg"></Desert>',
    			dialogFormVisible: false,
    			loading:0
    			
    		}
    	},
    	components: {
    		headTop,
    		upload
    	},
    	created(){
      		this.getData()
        },
    	mounted(){
    	},
    	methods: {
    		async getData(){
          let video = await getVideo();
          console.log("video",video)
          if(video.code == 1 && video.url){
            // this.wurl = ["http://azz-test.oss-cn-shenzhen.aliyuncs.com/%E7%91%9E%E5%A3%ABdlab%E5%93%81%E7%89%8C%E6%97%B6%E5%B0%9A%E5%AE%A3%E5%82%B3%E7%89%87_%E9%AB%98%E6%B8%85.mp4"]
            this.wurl.push(video.url)
          }else{
            return this.$message({
                  type: 'warning',
                  message: "请上传视频"
              });
          }
        },
    		async submitForm(){
    			let video = await addVideo({url:this.wurl});
    			console.log(video)
    			if(video.code == 1){
    				this.$message({
		              type: 'success',
		              message: '添加成功',
		              duration:1000,
		              onClose:function(){
		              	location.reload()
		              }
		          });
    				
            	
    			}

    		},async onSelectUrl(url){
		        console.log("url???",url)
		        this.wurl = url
		        this.submitForm()
		      }
		}
    }
</script>

<style lang="less">
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

	.text{
		position: absolute;
		top:-30%
	}
	.buttons{
		margin-left:8rem;
		margin-top:1rem;
	}
	
</style>

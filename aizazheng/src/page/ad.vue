<template>
    
    
    <div>
        <head-top></head-top>
        
        <el-select v-model="area" placeholder="请选择广告区域"  class="select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
        <el-select v-model="adType" placeholder="请选择视频或者图片" >
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
        <el-button type="primary" @click="sure">下一步</el-button>
        <el-card :body-style="{ padding: '0px' }" class="card">
          <img src="../assets/img/background.jpg" class="image">
        </el-card>
        <el-row style="margin: 4rem 0rem 10rem 3rem;" v-if="videoShow">
          <div class="upload">
             <span class="text">请上传一个30秒预览视频文件</span>
            <upload :id="smallVideoUrlId" :multiple="false" :url.sync="urls" :bucket-url="bucketUrl" @select-type="onSelectType"  @select-url="onSelectUrl" :url="svideo"></upload>
          </div>
    			<div class="upload">
             <span class="text">请上传一个完整视频文件</span>
          	<upload :id="videoUrlId" :multiple="false" :url.sync="urls" :bucket-url="bucketUrl" @select-type="onSelectType"  @select-url="onSelectUrl" :url="video"></upload>
          </div>
          <div class="upload">
             <span class="text">请上传一个视频截图</span>
            <upload :id="preImgId" :multiple="false" :url.sync="urls" :bucket-url="bucketUrl" @select-type="onSelectType"  @select-url="onSelectUrl" :url="prevideo"></upload>
          </div>
        <el-button type="primary" @click="submitForm" class="buttons videoBtn">立即创建</el-button>

  		  </el-row>
        <el-row style="margin: 4rem 0rem 10rem 3rem;" v-if="imgShow">
          <div class="upload">
             <span class="text">请上传一张图片</span>
            <upload :id="imgUrlId" :multiple="false" :url.sync="urls" :bucket-url="bucketUrl" @select-type="onSelectType"  @select-url="onSelectUrl" :url="img"></upload>
          </div>
          <el-form :model="formData"  ref="formData" label-width="110px" class="demo-formData"  v-if="imgShow" style="width: 26rem;margin-left: 17rem;">
          <el-form-item label="广告描述">
            <el-input v-model.number="formData.des" maxLength="11" class="input"></el-input>
          </el-form-item>
          <el-form-item label="广告链接">
            <el-input v-model.number="formData.adUrl" maxLength="11" class="input"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="submitForm" class="buttons">立即创建</el-button>

        </el-row>
        
        <!-- <el-row style="margin: 4rem 0rem 10rem 3rem;" >
          <div class="upload">
             <span class="text">请上传一个视频截图</span>
            <upload :id="preImgId" :multiple="true" :url.sync="urls" :bucket-url="bucketUrl"  @select-url="onSelectUrl" :url="wurl"></upload>
          </div>
        </el-row> -->
      
    </div>
    
</template>

<script>
    import headTop from '@/components/headTop'
  	import upload from '../components/aliossupload'
    import {addAdvertisement} from '@/api/getData'
    export default {
    	data(){
    		return {
    			showEdit:true,
    			showSave:false,
    			disabled:true,
          video:[],
          svideo:[],
          prevideo:[],
          img:[],
          videoUrlId:'videoUrl',
          smallVideoUrlId:'smallVideoUrl',
          preImgId:'preImg',
    			imgUrlId:'imgUrl',
    			urls:[],
        	bucketUrl:'http://azz-test.oss-cn-shenzhen.aliyuncs.com/<Desert class="jpg"></Desert>',
    			dialogFormVisible: false,
    			loading:0,
          options: [{
              value: 'A',
                label: 'A区广告 540*540'
            }, {
              value: 'B',
              label: 'B区广告 540*270'
            }, {
              value: 'C',
              label: 'C区广告 540*270'
            }, {
              value: 'D',
              label: 'D区广告 1080*404'
            }, {
              value: 'E',
              label: 'E区广告 1080*404'
            }],
            options1: [{
              value: 'image',
                label: '图片'
            }, {
              value: 'video',
              label: '视频'
            }],
            adType:"",
            area: '',
            preImg: '',
            videoUrl: '',
            imgUrl: '',
            formData:{des: '',adUrl: ''},
            videoShow:false,
            imgShow:false,
            type:""
        		}
    	},
    	components: {
    		headTop,
    		upload
    	},
    	created(){
      		
        },
    	mounted(){
    	},
    	methods: {
        sure(){
          if(!this.area){
            return this.$message({
                type: 'error',
                message: '请选择广告区域',
                duration:1000
            });
          }
          if(!this.adType){
            return this.$message({
                type: 'error',
                message: '请选择视频或者图片',
                duration:1000
            });
          }
          let title
          this.adType == "video" ? title = "请上传一个视频和一张视频截图" : title = "请上传一张图片和图片跳转地址以及图片描述"
          //tips
          const h = this.$createElement;
          this.$notify({
            title: '提示',
            message: h('i', { style: 'color: teal'}, title),
            duration: 0,
            offset: 200
          });
          //选择video或者img
          
          console.log(this.adType)
          if(this.adType == "video"){
              this.videoShow = true
              this.imgShow = false
          }else if(this.adType == "image"){
              this.imgShow = true
              this.videoShow = false

          }

        },
    		async submitForm(){
          let ad
          if(this.adType == "video"){
              ad = await addAdvertisement({
                adType:this.adType,
                area:this.area,
                preImg:this.prevideo,
                videoUrl:this.video,
                smallVideoUrl:this.svideo,
            });
          }
    			if(this.adType == "image"){
              ad = await addAdvertisement({
                adType:this.adType,
                area:this.area,
                imgUrl:this.img,
                des:this.formData.des,
                adUrl:this.formData.adUrl,
            });
          }
    			if(ad.code == "1"){
            this.$message({
              message: '哇，你上传成功了',
              type: 'success'
            });
            this.$router.push('adList?random='+Math.random())

          }
    			
    		},async onSelectUrl(url){
            this.type == "videoUrl"?this.video = [url] : ""
            this.type == "smallVideoUrl"?this.svideo = [url] : ""
            this.type == "preImg"?this.prevideo = [url] : ""
            this.type == "imgUrl"?this.img = [url] : ""
            console.log("this.video",this.video)
            console.log("this.prevideo",this.prevideo)
            console.log("this.img",this.img)

		      },async onSelectType (type) {
            this.type = type
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
      margin-right: 10rem;
	  }

	.text{
		position: absolute;
		top:-35%
	}
	.buttons{
		margin-left:24rem;
	}
  .videoBtn{
    margin-left: 0rem;
    margin-top: 4rem;
  }
	.image {
    width: 100%;
    display: block;
  }
  .card{
    width: 30%;
    margin:2rem 0rem 4rem 3rem;
  }
  .select{
    margin-top:1rem;
    margin-left:3rem;
  }
  .el-notification__content{
    font-size:1rem;
    font-weight:500
  }
 .el-form-item {
    margin-bottom: -2rem;
}
</style>

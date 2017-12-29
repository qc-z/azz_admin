<template>
  <div  v-loading="loading"
    element-loading-text="拼命上传中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="oss_file">
      <input type="file" :id="id" :multiple="multiple" @change="doUpload"/>
    </div>
    <div v-for="(item,index) in url">
      <el-row style="margin-top: 1rem;">
        <el-col :span="40" >
          <el-card :body-style="{ padding: '0px' }">
            <img v-bind:src="item" class="image">
            <div>
            
              
              <el-tag
                disable-transitions
                closable
                type="success"
                class="close"
                @close="handleClose(item)"
                
                >
              </el-tag>
            </div>
          </el-card>
          
        </el-col>

      </el-row>

    </div>
    <!-- <div v-for="item in text">
      
    </div> -->
  </div>
</template>
<script>
  import {getToken} from '@/api/getData'

  export default{
    props:{
      multiple:{
        type: Boolean,
        twoWay:false
      },
      id:{
        type: String,
        twoWay:false
      },
      bucketUrl:{
        type: String,
        twoWay:false
      },url: Array,text: Array
    },
    data(){
      return{
        region:'oss-cn-shenzhen',
        bucket:'azz-test',
        selectType: 0,
        targetFlag:false,
        input:"",
        loading:false
      }
    },
    created(){
      // console.log("props",this.url)
      // console.log("text",this.text)
    },
    methods:{
      handleClose(item){
        console.log("item",item)
        this.$message({
            showClose: true,
            message: '此功能还没开放哦',
            type: 'warning'
        });
      },focusInput(e){
        console.log('e',e.path[0].value)
        e.path[0].value = ""
      },
      async doUpload(e){
        this.loading = true

        this.getid = e.target.id
        let result = await getToken()
        // console.log(result)
        this.selectType = e.target.id
        this.$emit('select-type', e.target.id)
        const _this = this;
          const client = new OSS.Wrapper({
            region:_this.region,
            accessKeyId: result.token.AccessKeyId,
            accessKeySecret: result.token.AccessKeySecret,
            stsToken: result.token.SecurityToken,
            bucket:_this.bucket
          })

          const files = document.getElementById(_this.id);
            const resultUpload = []   
          if(files.files){
            const fileLen = document.getElementById(_this.id).files
            //随机
            let len = len || 32;
            var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var maxPos = chars.length;
            var pwd = '';
            for (let i = 0; i < len; i++) {
            　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            for (let i = 0; i < fileLen.length; i++) {
              const file = fileLen[i]

              const storeAs = "admin/"+pwd+file.name

              if(this.selectType == "videoUrl"){
                if(storeAs.indexOf(".mp4") != "-1"){
                  console.log(storeAs.indexOf(".mp4"))
                }else{
                  this.loading = false
                  return this.$message({
                    message: '只能上传mp4',
                    type: 'warning'
                  });

                }
              }
              client.multipartUpload(storeAs, file, {

              }).then((results) => {

                if(results.res){

                  _this.url.push(results.res.requestUrls[0].split("?")[0]);
                  // console.log('1',results.res.requestUrls[0].split("?")[0])
                  // console.log('1',results.res.requestUrls[0])
                  // _this.url = resultUpload
                  // console.log("url",_this.url)
                  // console.log('13541351',this.url)
                console.log("results.res.requestUrls",results.res.requestUrls[0].split("?")[0])
                  // 
                }else{
                  if(results.name === file.name){
                    _this.url.push(this.bucketUrl+ file.name)
                    // resultUpload.push(url);
                  }
                }
                // _this.url = resultUpload
                // console.log("last url",_this.url)
                this.$emit('select-url', _this.url)
                this.loading = false
                
              }).catch((err) => {
                console.log(err)
              })
            }
            

          }   
      }
    }
  }
</script>
<style type="text/css">
  .oss_file {
    height: 100px;
    width: 100%;
    /*margin: -2rem 0 1rem 8rem;*/

  }
  .oss_file  input {
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  
  .finish_room{
      width: 430px;
      height: auto;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  .close{
    width: 100%
  }
  .el-tag .el-icon-close {
    right: -32px;
}
</style>
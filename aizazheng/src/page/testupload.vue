<template>
  <div>
        
    <head-top id="testupload"></head-top>
    <div id="app">

      <!-- <h5>阿里OSS上传</h5>
      <div class="upload">
        <upload :id="id" :multiple="true" :url.sync="urls" :bucket-url="bucketUrl"></upload>
      </div> -->
      
      <el-tree
        :data="data2"
        :props="defaultProps"
        node-key="id"
        accordion
        highlight-current
        default-expand-all
        :render-content="renderContent">
      </el-tree>

      <template>
        <el-button type="primary" @click="open2" class="open"><i class="el-icon-upload">点击添加第一级项目</i></el-button>
      <a href="#testupload" ><span class="page-component-up"><i class="el-icon-caret-top"></i></span></a>

      </template>
      <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="添加第一级项目">
        <el-input v-model="formInline.user" placeholder="添加第一级项目"></el-input>
      </el-form-item> -->
    <!-- <el-form>
      
      <el-form-item>
        <el-button type="primary" @click="addOperation">确认</el-button>
      </el-form-item>
    </el-form> -->
      
    </div>
  </div>
</template>
<script>
  import headTop from '../components/headTop'

  import upload from '../components/aliossupload'
  import {getOperation,addOperation,delOperation} from '@/api/getData'
  


  export default {
    components: {
      upload,
      headTop

    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data() {
      return {
        input: '',
        id:'uploadid',
        clickid:0,
        clickfalse:false,
        bucketUrl:'http://azz-test.oss-cn-shenzhen.aliyuncs.com/<Desert class="jpg"></Desert>',
        urls:[],
        uploadurl:[],
        max:2,
        pickfiles:'pickfiles',
        container:'container',
        ssd:'http://azz-test.oss-cn-shenzhen.aliyuncs.com/upPageAd_MJDfH2eAGW.jpg',
        formInline: {
          father: '',
          region: '',
          user:''
        },
        formText:"",
        filterText: '',
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1',
            children: [{
            id: 7,
            label: '3级 3-1'
          }]
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    created(){
            this.getOperation();
        },
    watch: {
        '$route' (to,from) {
          console.log(to)
          console.log(from)
          if(to.fullPath !== from.fullPath){
            location.reload()
      }
        }
    },
    methods: {
      uptop(){
        console.log(document.body)
        document.body.scrollHeight = 0
      },
      append(store, data) {
        this.clickid = data.id
        this.clickfalse = data.limit
        this.open()
        console.log(this.clickfalse)
      },
      open() {
            console.log('params',this.$route.params)
        if(this.clickfalse){
          this.$router.push('addShop?id='+this.clickid)
        }else{
          this.$prompt('请输入项目名称', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(({ value }) => {
              this.$message({
                type: 'success',
                message: '你输入的项目是: ' + value
              });
              this.formInline.user = value
              this.addOperation()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              });       
            });
        }
        
      },
      open2() {
        this.$prompt('添加第一级项目', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你输入的第一级项目是: ' + value
          });
          this.formInline.user = value
          this.addOperation()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },
      remove(store, data) {
        // store.remove(data);
        this.clickid = data.id
        this.delOperation()
      },

      renderContent(h, { node, data, store }) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
              <el-button type="primary"  size="mini" on-click={ () => this.append(store, data) }>{data.limit?'添加详细内容':'增加子项目'}</el-button>
              <el-button  type="danger" size="mini" on-click={ () => this.remove(store, data) }>删除当前项目</el-button>
            </span>
          </span>);
      
    },
      handleNodeClick(itemid) {
        console.log(itemid);
        this.clickid = itemid.id
        this.clickfalse = itemid.limit
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      async getOperation(){
                  
        let operation = await getOperation();
        let result = operation.operations
        let arr = []
        if(operation.code == 1){
          for(let item in result){
            if(result[item].parentid == 0){
                let opop = {
                  id: result[item].id,
                  label: result[item].name,
                  parentid:result[item].parentid,
                  limit:false,
                  children:[]
                }
                let i = 0
                for(let items in result){

                  if(result[items].parentid == result[item].id){
                      opop.children.push({id:result[items].id,label:result[items].name,parentid:result[items].parentid,limit:false,
                  children:[]})
                        
                      for(let lastitem in result){ 
                          if(result[lastitem].parentid == result[items].id){
                              opop.children[i].children.push({id:result[lastitem].id,label:result[lastitem].name,parentid:result[lastitem].parentid,limit:true})
                          }
                      }
                  i++
                  }
                }
                arr.push(opop)
            }

          }
            this.data2 = arr
        }
        if(result.length == 0){
            this.data2 = []
          }
      },
      async addOperation(){
        if(!this.formInline.user){
          return this.$message({
              type: 'error',
              message: '请输入项目名称'
          });
        }
        let add
        if(!this.clickfalse){
          console.log(this.formInline.user,this.clickid,this.clickfalse)
          add = await addOperation({name:this.formInline.user,parentid:this.clickid});
        }else{
          return this.$message({
              type: 'error',
              message: '已经是最后一层了'
          });
        }

        if(add.code == 1){
          this.$message({
              type: 'success',
              message: '添加成功'
          });
          this.getOperation();
        }else{
          return this.$message({
              type: 'warning',
              message: '登陆过期，请重新登陆'
          });
        }
      },
      clickTree(){
        console.log(111)
      },
      async delOperation(){
                  
        let delOp = await delOperation({id:this.clickid});
        if(delOp.code == 1){
          this.$message({
              type: 'success',
              message: '删除成功'
          });
        this.getOperation()

        }
      }
    }
  }
</script>




<style>
  html {
    height: 100%;
  }

  body {
    /*display: flex;
    align-items: center;*/
    height: 100%;
    padding: 10px;
  }

  .upload{
    border: 1px solid #ddd;
    width: 100px;
    height: 100px;
    /*margin: 0 auto;*/
    border-radius: 4px;
    background: url('../assets/img/add_upload.png');
    background-size: contain;
  }
  .upload:hover{
    opacity: 0.8;
    border: 1px solid #ddd;
  }
  .tree{
    width: 1000px
  }
  .open{
    margin: 1rem
  }
  .page-component-up {
    float: right;
    margin-right: 2rem;
    margin-top: 1rem;
    font-size: 2rem;                                                                                                 
}
</style>

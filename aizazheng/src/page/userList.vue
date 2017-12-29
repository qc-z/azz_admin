<template>
  
    <div class="fillcontain">
        <head-top></head-top>
        <div class="demo-input-suffix demo-input">
        <el-input
          placeholder="请输入手机"
          prefix-icon="el-icon-search"
          v-model="input" class="input">
        </el-input>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="全部" name="0"></el-tab-pane>
          <el-tab-pane label="颜值" name="1"></el-tab-pane>
          <el-tab-pane label="皮肤" name="2"></el-tab-pane>
          <el-tab-pane label="明星" name="3"></el-tab-pane>
          <el-tab-pane label="到店" name="4"></el-tab-pane>
        </el-tabs>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand"  v-if="seenall">
                      <el-form-item label="测试次数">
                        <span>{{ props.row.testTimes }}</span>
                      </el-form-item>
                      <el-form-item label="总分">
                        <span>{{ props.row.looksTotalScore }}</span>
                      </el-form-item>
                      <el-form-item label="轮廓">
                        <span>{{ props.row.outLineScore }}</span>
                      </el-form-item>
                      <el-form-item label="眼部">
                        <span>{{ props.row.eyeScore }}</span>
                      </el-form-item>
                      <el-form-item label="鼻部">
                        <span>{{ props.row.noseScore }}</span>
                      </el-form-item>
                      <el-form-item label="唇部">
                        <span>{{ props.row.mouthScore }}</span>
                      </el-form-item>
                      <el-form-item label="眉部">
                        <span>{{ props.row.eyebrowScore }}</span>
                      </el-form-item>
                      <el-form-item label="相学">
                        <span>{{ props.row.kanXiangScore }}</span>
                      </el-form-item>
                    </el-form>
                  
                    <el-form label-position="left" inline class="demo-table-expand" v-if="seenface">
                      <el-form-item label="测试次数">
                        <span>{{ props.row.testTimes }}</span>
                      </el-form-item>
                      <el-form-item label="总分">
                        <span>{{ props.row.looksTotalScore }}</span>
                      </el-form-item>
                      <el-form-item label="轮廓">
                        <span>{{ props.row.outLineScore }}</span>
                      </el-form-item>
                      <el-form-item label="眼部">
                        <span>{{ props.row.eyeScore }}</span>
                      </el-form-item>
                      <el-form-item label="鼻部">
                        <span>{{ props.row.noseScore }}</span>
                      </el-form-item>
                      <el-form-item label="唇部">
                        <span>{{ props.row.mouthScore }}</span>
                      </el-form-item>
                      <el-form-item label="眉部">
                        <span>{{ props.row.eyebrowScore }}</span>
                      </el-form-item>
                      <el-form-item label="相学">
                        <span>{{ props.row.kanXiangScore }}</span>
                      </el-form-item>
                      
                    </el-form>
                    <el-form label-position="left" inline class="demo-table-expand" v-if="seenskin">
                      <el-form-item label="测试次数">
                        <span>{{ props.row.testTimes }}</span>
                      </el-form-item>
                      <el-form-item label="油分">
                        <span>{{ parseInt(props.row.oil_flag[0]*100) }}</span>
                      </el-form-item>
                      <el-form-item label="水分">
                        <span>{{ parseInt(props.row.water_flag[0]*100) }}</span>
                      </el-form-item>
                      <el-form-item label="肤色">
                        <span>{{ props.row.color_flag[0] }}</span>
                      </el-form-item>
                      <el-form-item label="炎症">
                        <span>{{ props.row.inflammation_flag[0] }}</span>
                      </el-form-item>
                      <el-form-item label="毛孔">
                        <span>{{ props.row.prose_flag[0] }}</span>
                      </el-form-item>
                      
                    </el-form>
                    <el-form label-position="left" inline class="demo-table-expand" v-if="seenstart">
                      <el-form-item label="测试次数444">
                        <span>{{ props.row.testTimes }}</span>
                      </el-form-item>
                      <el-form-item label="总分">
                        <span>{{ props.row.looksTotalScore }}</span>
                      </el-form-item>
                      <el-form-item label="轮廓">
                        <span>{{ props.row.outLineScore }}</span>
                      </el-form-item>
                      <el-form-item label="眼部">
                        <span>{{ props.row.eyeScore }}</span>
                      </el-form-item>
                      <el-form-item label="鼻部">
                        <span>{{ props.row.noseScore }}</span>
                      </el-form-item>
                      <el-form-item label="唇部">
                        <span>{{ props.row.mouthScore }}</span>
                      </el-form-item>
                      <el-form-item label="眉部">
                        <span>{{ props.row.eyebrowScore }}</span>
                      </el-form-item>
                      <el-form-item label="相学">
                        <span>{{ props.row.kanXiangScore }}</span>
                      </el-form-item>
                    </el-form>
                    <el-form label-position="left" inline class="demo-table-expand"  v-if="seenar">
                      <el-form-item label="测试次数555">
                        <span>{{ props.row.testTimes }}</span>
                      </el-form-item>
                      <el-form-item label="总分">
                        <span>{{ props.row.looksTotalScore }}</span>
                      </el-form-item>
                      <el-form-item label="轮廓">
                        <span>{{ props.row.outLineScore }}</span>
                      </el-form-item>
                      <el-form-item label="眼部">
                        <span>{{ props.row.eyeScore }}</span>
                      </el-form-item>
                      <el-form-item label="鼻部">
                        <span>{{ props.row.noseScore }}</span>
                      </el-form-item>
                      <el-form-item label="唇部">
                        <span>{{ props.row.mouthScore }}</span>
                      </el-form-item>
                      <el-form-item label="眉部">
                        <span>{{ props.row.eyebrowScore }}</span>
                      </el-form-item>
                      <el-form-item label="相学">
                        <span>{{ props.row.kanXiangScore }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="测试图片">
                  <template slot-scope="props">
                    <img :src="props.row.image_path" class="img_table">
                  </template>
                </el-table-column>
                <el-table-column
                  property="meta.createdAt"
                  label="注册日期"
                  width="220"
                  :formatter="formatter">
                </el-table-column>
                <el-table-column
                  property="mobile"
                  label="用户手机"
                  width="220">
                </el-table-column>
                <el-table-column
                  property="loc"
                  label="测试地址">
                </el-table-column>
                <el-table-column
                  property="type"
                  label="测试类型">
                </el-table-column>
                <!-- <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <el-button @click="deleteList(scope.row)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column> -->
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="10"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {getUserList, getUserCount,delUserList} from '@/api/getData'
    import moment from 'moment'
    export default {
        data(){
            return {
                tableData: [{
                  meta: {createdAt: '2016-05-04'},
                  mobile: '鸡哥',
                  loc: '广东广州是 1518 号'
                }, {
                  meta: {createdAt: '2016-05-04'},
                  mobile: '鸡哥',
                  loc: '广东广州是 1517 号'
                }, {
                  meta: {createdAt: '2016-05-04'},
                  mobile: '鸡哥',
                  loc: '广东广州是 1519 号'
                }, {
                  image_path:"https://diycode.b0.upaiyun.com/photo/2017/eb1088e69b472c4401d0a7f665b3e2a2.png",
                  meta: {createdAt: '2016-05-04'},
                  mobile: '鸡哥',
                  loc: '广东广州是 1516 号',
                  type:"sss"
                }],
                currentRow: null,
                offset: 0,
                limit: 10,
                count: 0,
                currentPage: 1,
                activeName: '0',
                newCurrentType:0,
                seenall:true,
                seenface:false,
                seenskin:false,
                seenstart:false,
                seenar:false,
                input:""
            }
        },
      components: {
        headTop,
      },
        created(){
            this.initData();
        },
        methods: {
            handleClick(tab, event) {
              // console.log(tab.name);
              this.newCurrentType = tab.name
              this.getUsers(this.currentPage-1,tab.name,"")
              // console.log('tab.name',tab.name)
              if(tab.name == 0){
                this.seenall = true
                this.seenface = false
                this.seenskin = false
                this.seenstart = false
                this.seenar = false
              }else if(tab.name == 1){
                this.seenall = false
                this.seenface = true
                this.seenskin = false
                this.seenstart = false
                this.seenar = false
              }else if(tab.name == 2){
                this.seenall = false
                this.seenface = false
                this.seenskin = true
                this.seenstart = false
                this.seenar = false
              }else if(tab.name == 3){
                this.seenall = false
                this.seenface = false
                this.seenskin = false
                this.seenstart = true
                this.seenar = false
              }else if(tab.name == 4){
                this.seenall = false
                this.seenface = false
                this.seenskin = false
                this.seenstart = false
                this.seenar = true
              }
            },
            onSubmit(){
              this.getUsers(this.currentPage - 1,this.newCurrentType,this.input)
            },
            formatter(row, column) {
              return moment(row.meta.createdAt).format('MM/DD HH:mm:ss')
            },
            async initData(){
                // try{
                    // const countData = await getUserCount();
                //     if (countData.status == 1) {
                //         this.count = countData.count;
                //     }else{
                //         throw new Error('获取数据失败');
                //     }
                    this.getUsers(0,0,"");
                // }catch(err){
                //     console.log('获取数据失败', err);
                // }
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                // console.log("val",val)
                // console.log("this.currentPage",this.currentPage)
                // console.log("this.offset",this.offset)
                this.getUsers(this.currentPage - 1,this.newCurrentType,"")
            },
            deleteList(msg,type){
                console.log(msg._id,msg.type)

                this.delete(msg._id,msg.type)
            },
            async getUsers(pagination,otherCondition,mobile){
                  
                let Users = await getUserList({pagination: pagination, otherCondition: otherCondition, mobile: mobile});
                console.log(Users.results)

                this.tableData = [];
                console.log('Users.count',Users.count)
                this.count = Math.ceil(Users.count)
                if(this.newCurrentType == 0 || this.newCurrentType == 4){
                  Users.results[0].forEach(item => {
                    item.type = '颜值测试'
                    this.tableData.push(item);
                  })
                  Users.results[1].forEach(item => {
                    item.type = '皮肤测试'
                    this.tableData.push(item);
                  })
                  Users.results[2].forEach(item => {
                    item.type = '明星面对面'
                    this.tableData.push(item);
                  })
                }else if(this.newCurrentType == 1){
                  Users.results.forEach(item => {
                    item.type = '颜值测试'
                    this.tableData.push(item);
                  })
                }else if(this.newCurrentType == 2){
                  Users.results.forEach(item => {
                    item.type = '皮肤测试'
                    this.tableData.push(item);
                  })
                }else if(this.newCurrentType == 3){
                  Users.results.forEach(item => {
                    item.type = '明星面对面'
                    this.tableData.push(item);
                  })
                }
            },
            async delete(id){
                const info = await delUserList({id: id});
                console.log(info)
                if (info.ret == 1) {
                    console.log("删除成功")
                }else{
                    console.log("删除成功")
                }
                
            }
        },
    }
</script>

<style lang="less">
  @import '../style/mixin';
    .table_container{
        padding: 20px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .img_table {
      width: 150px;
      height: 150px;
    }
    .input {
      width: 200px;
    }
    .demo-input {
      margin-left:10px;
    }
</style>

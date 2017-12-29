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
        
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%">
                <el-table-column
                  property="mobile"
                  label="手机"
                  width="220"
                  >
                </el-table-column>
                <el-table-column
                  property="reason"
                  label="发放理由"
                  width="220"
                  >
                </el-table-column>
                <el-table-column
                  property="send"
                  label="发放状态"
                  width="220">
                </el-table-column>
                <el-table-column
                  property="meta.createdAt"
                  label="创建时间"
                  :formatter="formatter">
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
    import {redpacks} from '@/api/getData'
    import moment from 'moment'
    export default {
        data(){
            return {
                tableData: [{
                  meta: {createdAt: '2016-05-04'},
                  amount: 12,
                  mobile: '18826255448',
                  reason:"订阅",
                  send:"已发放"

                }, {
                  meta: {createdAt: '2016-05-04'},
                  amount: 12,
                  mobile: '18826255448',
                  reason:"订阅",
                  send:"已发放"
                }, {
                  meta: {createdAt: '2016-05-04'},
                  amount: 12,
                  mobile: '18826255448',
                  reason:"订阅",
                  send:"已发放"
                }, {
                  meta: {createdAt: '2016-05-04'},
                  amount: 12,
                  mobile: '18826255448',
                  reason:"订阅",
                  send:"已发放"
                }, {
                  meta: {createdAt: '2016-05-04'},
                  amount: 12,
                  mobile: '18826255448',
                  reason:"订阅",
                  send:"已发放"
                }, {
                  meta: {createdAt: '2016-05-04'},
                  amount: 12,
                  mobile: '18826255448',
                  reason:"订阅",
                  send:"已发放"
                }],
                offset: 0,
                limit: 10,
                count: 0,
                currentPage: 1,
                newCurrentType:0,
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
            
            onSubmit(){
              this.redpacks(this.currentPage - 1,this.input)
            },
            formatter(row, column) {
              return moment(row.meta.createdAt).format('YY/MM/DD HH:mm')
            },
            async initData(){
                
                    this.redpacks("1","");
                
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.redpacks(currentPage,"")
            },
            async redpacks(pagination,mobile){
                   
                let redpack = await redpacks({pagination:pagination,mobile:mobile});
                console.log(redpack)
                if(redpack.code == 0){
                  return this.$message({
                    type: 'warning',
                    message: redpack.err
                });
                }
                if(redpack.datas.length == 0){
                  return this.$message({
                    type: 'warning',
                    message: '没有找到数据'
                });
                }
                let data = redpack.datas
                for(let item in data){
                  if(data[item].reason == "subscribe"){
                    data[item].reason = "订阅"
                  }
                  if(data[item].send == "yes"){
                    data[item].send = "已发放"
                  }else{
                    data[item].send = "待发放"
                  }
                }
                this.tableData = data
                this.count = redpack.count
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
      margin-top:1rem
    }
</style>

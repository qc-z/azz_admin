<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
          <div class="demo-input-suffix demo-input">
            <el-input
              placeholder="请输入手机"
              prefix-icon="el-icon-search"
              v-model="input" class="input">
            </el-input>
            <el-button type="primary" @click="onSubmit" class="search">搜索</el-button>
          </div>
            <el-table
                :data="tableData"
                @expand='expand'
                :expand-row-keys='expendRow'
                style="width: 100%">
                <el-table-column
                  label="登录名"
                  prop="username">
                </el-table-column>
                <el-table-column
                  label="名字"
                  prop="name">
                </el-table-column>
                <el-table-column
                  label="手机"
                  prop="mobile">
                </el-table-column>
                <el-table-column label="头像">
                  <template slot-scope="props">
                    <img :src="props.row.avatar" class="img_table">
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDelete(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="10"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
            <el-dialog title="修改信息" v-model="dialogFormVisible">
                <el-row style="margin-top: 20px;">
                    <el-col :span="20" :offset="0">
                        <el-form :model="selectTable"  ref="selectTable" label-width="60px" class="selectTable" size="medium">
                            <el-form-item label="登录名" prop="username" >
                                <el-input v-model="selectTable.username"></el-input>
                            </el-form-item>
                            <el-form-item label="名字" prop="name" >
                                <el-input v-model="selectTable.name"></el-input>
                            </el-form-item>
                            <el-form-item label="手机" prop="mobile">
                                <el-input v-model="selectTable.mobile"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateApk">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {delClient,getClient,editClient} from '@/api/getData'
    export default {
        data(){
            return {
                input:"",
                offset: 0,
                limit: 15,
                count: 0,
                tableData: [],
                currentPage: 0,
                dialogFormVisible: false,
                expendRow: [],
                selectTable: {
                	_id: '',
                    username: '',
                    name: '',
                    mobile: '',
                    password: ''
            },
        }
    },
        created(){
            this.getClient(1,"");
        },
    	components: {
    		headTop,
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
            onSubmit(){
              this.getClient(this.currentPage - 1,this.input)
            },
            async getClient(page,content){
                const clientG = await getClient({pageNumber: page, content: content});
                console.log(clientG)
                this.tableData = [];
                let msg = clientG.clients
                this.count = clientG.recordTotal
                msg.forEach((item, index) => {
                    const tableData = {};
                    tableData.username = item.username;
                    tableData.name = item.name;
                    tableData.mobile = item.mobile;
                    tableData.avatar = item.avatar;
                    tableData.index = index;
                    this.tableData.push(tableData);
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getClient(val,"")

            },
            expand(row, status){
            	if (status) {
            		this.getSelectItemData(row)
            	}else{
                    const index = this.expendRow.indexOf(row.index);
                    this.expendRow.splice(index, 1)
                }
            },
            handleEdit(row) {
            console.log('ROE',row)
            	this.getSelectItemData(row.mobile, 'edit')
                this.dialogFormVisible = true;
            },
            async getSelectItemData(row, type){
                const oneapk = await getClient({pageNumber: 1, content: row});
                console.log("row.name",row)
                this.selectTable = {
                    _id:oneapk.clients[0]._id,
                    username:oneapk.clients[0].username,
                    name:oneapk.clients[0].name,
                    mobile:oneapk.clients[0].mobile
                };
            },
            async handleDelete(row) {
            console.log(row)
                try{
                    const postData = row;
                    const res = await delClient(postData)
                    if (res.ret == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除案例成功'
                        });
                        this.getClient(1,"")
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.err
                        });
                    }
                }catch(err){
                    console.log('删除案例', err);
                }
            },
            async updateApk(){
                this.dialogFormVisible = false;
                try{
                    console.log('*****', this.selectTable)
                    const res = await editClient(this.selectTable)
                    if (res.ret == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新案例信息成功'
                        });
                        this.getClient(1,"")
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新案例信息失败', err);
                }
            },
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }
    .el-table {
        margin-top:2rem;
    }
    .img_table {
      max-width: 100px;
      max-height: 100px;
    }
    .search{
        margin-top:1rem;
    }
</style>

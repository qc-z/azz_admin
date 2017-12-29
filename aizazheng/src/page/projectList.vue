<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
          <div class="demo-input-suffix demo-input">
            <el-input
              placeholder="请输入编号"
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
                  label="编号"
                  prop="typeName">
                </el-table-column>
                <el-table-column
                  label="部位"
                  prop="projectType">
                </el-table-column>
                <el-table-column
                  label="名称"
                  prop="projectName">
                </el-table-column>
                <el-table-column
                  label="价格"
                  prop="projectPrice">
                </el-table-column>
                <el-table-column
                  label="区域"
                  prop="area">
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
                        <el-form :model="selectTable"  ref="selectTable" label-width="50px" class="selectTable" size="medium">
                            <el-form-item label="编号" prop="typeName" >
                                <el-input v-model="selectTable.typeName"></el-input>
                            </el-form-item>
                            <el-form-item label="部位" prop="projectType">
                                <el-input v-model="selectTable.projectType"></el-input>
                            </el-form-item>
                            <el-form-item label="名称" prop="projectName">
                                <el-input v-model="selectTable.projectName"></el-input>
                            </el-form-item>
                            <el-form-item label="价格" prop="projectPrice">
                                <el-input v-model="selectTable.projectPrice"></el-input>
                            </el-form-item>
                            <el-form-item label="区域" prop="area">
                                <el-input v-model="selectTable.area"></el-input>
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
    import {delProject,getProject,editProject} from '@/api/getData'
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
                    projectType: '',
				    projectName: '',
				    projectPrice: '',
                    area: '',
				    _id: '',
				    typeName:''
            },
        }
    },
        created(){
            this.getProject(1,"");
        },
    	components: {
    		headTop,
    	},
        watch: {
            '$route' (to,from) {
              if(to.fullPath !== from.fullPath){
                location.reload()
          }
            }
        },
        methods: {
            onSubmit(){
              this.getProject(this.currentPage - 1,this.input)
            },
            async getProject(page,content){
                const projectG = await getProject({pageNumber: page, content: content});
                this.tableData = [];
                let msg = projectG.projects
                this.count = projectG.recordTotal
                msg.forEach((item, index) => {
                    const tableData = {};
                    tableData.projectType = item.projectType;
                    tableData.projectName = item.projectName;
                    tableData.projectPrice = item.projectPrice;
                    tableData.area = item.area;
                    tableData.typeName = item.typeName;

                    tableData.index = index;
                    this.tableData.push(tableData);
                })
            },
            handleSizeChange(val) {
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getProject(val,"")

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
            	this.getSelectItemData(row.typeName, 'edit')
                this.dialogFormVisible = true;
            },
            async getSelectItemData(row, type){
                const oneapk = await getProject({pageNumber: 1, content: row});
                this.selectTable = {
                    projectType:oneapk.projects[0].projectType,
                    projectName:oneapk.projects[0].projectName,
                    projectPrice:oneapk.projects[0].projectPrice,
                    typeName:oneapk.projects[0].typeName,
                    _id:oneapk.projects[0]._id,
                    area:oneapk.projects[0].area
                };
            },
            async handleDelete(row) {
                try{

                    const postData = row;
                    console.log(postData)
                    const res = await delProject(postData)
                    if (res.ret == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除推荐项目成功'
                        });
                        this.getProject(1,"")
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.err
                        });
                    }
                }catch(err){
                }
            },
            async updateApk(){
                this.dialogFormVisible = false;
                try{
                    console.log(this.selectTable)
                    const res = await editProject(this.selectTable)
                    if (res.ret == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新推荐项目信息成功'
                        });
                        this.getProject(1,"")
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
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
      width: 100px;
      height: 100px;
    }
    .search{
        margin-top:1rem;
    }
</style>

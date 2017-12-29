<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <div class="demo-input-suffix demo-input">
            <el-input
              placeholder="请输入版本名称"
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
                  label="id"
                  prop="id">
                </el-table-column>
                <el-table-column
                  label="版本号"
                  prop="versionName">
                </el-table-column>
                <el-table-column
                  label="版本更新次数"
                  prop="versionCode">
                </el-table-column>
                <el-table-column
                  label="下载地址">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                      <p>{{ scope.row.download }}</p>
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.download.slice(0, 15) }}</el-tag>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  label="是否强制更新"
                  prop="updateHard">
                </el-table-column>
                <el-table-column
                  label="设备类型"
                  prop="device">
                </el-table-column>
                <el-table-column
                  label="是否美甲机"
                  prop="ismeijiaji">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDelete(scope.row.id)">删除</el-button>
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
            <el-dialog title="修改食品信息" v-model="dialogFormVisible">
                <el-row style="margin-top: 20px;">
                    <el-col :span="12" :offset="4">
                        <el-form :model="selectTable"  ref="selectTable" label-width="110px" class="demo-selectTable">
                            <el-form-item label="id" prop="id" >
                                <el-input v-model="selectTable.id" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="版本名字" prop="versionName">
                                <el-input v-model="selectTable.versionName"></el-input>
                            </el-form-item>
                            <el-form-item label="下载地址" prop="download">
                                <el-input v-model="selectTable.download"></el-input>
                            </el-form-item>
                            
                            <el-form-item label="更新类型" style="white-space: nowrap;">
                                <span>强制更新</span>
                                <el-switch on-text="" off-text="" v-model="selectTable.updateHard"></el-switch>
                            </el-form-item>
                            
                            <el-form-item label="更新次数" prop="float_delivery_fee">
                                <el-input-number v-model="selectTable.versionCode" :min="0"></el-input-number>
                            </el-form-item>
                            <el-form-item label="设备类型">
                              <el-radio v-model="selectTable.device" label="pc">pc</el-radio>
                              <el-radio v-model="selectTable.device" label="app">app</el-radio>
                            </el-form-item>
                            <el-form-item label="是否美甲机">
                              <el-radio v-model="selectTable.ismeijiaji" label="azz">azz</el-radio>
                              <el-radio v-model="selectTable.ismeijiaji" label="mjj">mjj</el-radio>
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
    import {getApkList,editApk} from '@/api/getData'
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
                    id: '', 
                    versionName: '', 
                    download: '',   
                    versionCode: 0, 
                    updateHard: true, 
                    device: 'app', 
                    ismeijiaji: 'azz', 
            },
        }
    },
        created(){
            this.getApk(1,"");
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
              this.getApk(this.currentPage - 1,this.input)
            },
            async getApk(page,content){
                const apk = await getApkList({pageNumber: page, content: content});
                console.log(apk)
                this.tableData = [];
                let msg = apk.coupons
                this.count = apk.recordTotal
                msg.forEach((item, index) => {
                    const tableData = {};
                    tableData.versionName = item.versionName;
                    tableData.versionCode = item.versionCode;
                    tableData.download = item.download;
                    tableData.updateHard = item.updateHard;
                    tableData.id = item.id;
                    tableData.device = item.device;
                    tableData.ismeijiaji = (item.type == "mjj"?"美甲机":"爱咋整");
                   
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
                this.getApk(val,"")

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
            	this.getSelectItemData(row.id, 'edit')
                this.dialogFormVisible = true;
            },
            async getSelectItemData(row, type){
                const oneapk = await getApkList({pageNumber: 1, content: row});
                this.selectTable = {
                    id:oneapk.coupons[0].id,
                    versionName:oneapk.coupons[0].versionName,
                    download:oneapk.coupons[0].download,
                    versionCode:oneapk.coupons[0].versionCode,
                    updateHard:oneapk.coupons[0].updateHard == "yes"?true:false,
                    device:oneapk.coupons[0].device,
                    ismeijiaji:oneapk.coupons[0].type,
            };
            console.log(oneapk.coupons[0].type)
            },
            async handleDelete(id) {
            console.log(id)
                try{
                    const postData = {_id:id,action:"delete"};
                    const res = await editApk(postData)
                    if (res.ret == 2) {
                        this.$message({
                            type: 'success',
                            message: '删除apk信息成功'
                        });
                        this.getApk(1,"")
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('删除apk信息', err);
                }
            },
            async updateApk(){
                this.dialogFormVisible = false;
                try{
                	const postData = {_id:this.selectTable.id,action:"edit",
                    versionName:this.selectTable.versionName,
                    download:this.selectTable.download,
                    versionCode:this.selectTable.versionCode,
                    updateHard:this.selectTable.updateHard == false?"no":"yes",
                    device:this.selectTable.device,
                    type:this.selectTable.ismeijiaji,
                };
                    console.log(postData)
                    const res = await editApk(postData)
                    if (res.ret == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新apk信息成功'
                        });
                        this.getApk(1,"")
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新apk信息失败', err);
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
    .search{
        margin-top:1rem;
    }
</style>

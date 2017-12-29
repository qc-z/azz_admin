<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
          <div class="demo-input-suffix demo-input">
            <el-input
              placeholder="请输入项目名称"
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
                  label="项目名称"
                  prop="name">
                </el-table-column>
                <el-table-column
                  label="成交价格"
                  prop="deal">
                </el-table-column>
                <el-table-column
                  label="最高价格"
                  prop="high">
                </el-table-column>
                <el-table-column
                  label="最低价格"
                  prop="low">
                </el-table-column>
                <el-table-column
                  label="平均价格"
                  prop="average">
                </el-table-column>
                <el-table-column
                  label="地区"
                  prop="region">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDelete(scope.row.name)">删除</el-button>
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
                            <el-form-item label="项目名称" prop="name" >
                                <el-input v-model="selectTable.name" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="成交价格" prop="deal">
                                <el-input v-model="selectTable.deal"></el-input>
                            </el-form-item>
                            <el-form-item label="最高价格" prop="high">
                                <el-input v-model="selectTable.high"></el-input>
                            </el-form-item>
                            <el-form-item label="最低价格" prop="low">
                                <el-input v-model="selectTable.low"></el-input>
                            </el-form-item>
                            <el-form-item label="平均价格" prop="average">
                                <el-input v-model="selectTable.average"></el-input>
                            </el-form-item>
                            <el-form-item label="地区" prop="region">
                                <el-input v-model="selectTable.region"></el-input>
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
    import {getApkList,editApk,getPrice,editPrice} from '@/api/getData'
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
                    name: '', 
                    deal: '', 
                    high: '',   
                    low: '',    
                    average: '', 
                    region: '' 
            },
        }
    },
        created(){
            this.getPrice(1,"");
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
              this.getPrice(this.currentPage - 1,this.input)
            },
            async getPrice(page,content){
                const price = await getPrice({pageNumber: page, content: content});
                console.log(price)
                this.tableData = [];
                let msg = price.prices
                this.count = price.recordTotal
                msg.forEach((item, index) => {
                    const tableData = {};
                    tableData.name = item.name;
                    tableData.deal = item.deal;
                    tableData.high = item.high;
                    tableData.low = item.low;
                    tableData.average = item.average;
                    tableData.region = item.region;
                   
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
                this.getPrice(val,"")

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
            	this.getSelectItemData(row.name, 'edit')
                this.dialogFormVisible = true;
            },
            async getSelectItemData(row, type){
                const oneapk = await getPrice({pageNumber: 1, content: row});
                console.log("row.name",row)
                this.selectTable = {
                    average:oneapk.prices[0].average,
                    deal:oneapk.prices[0].deal,
                    high:oneapk.prices[0].high,
                    low:oneapk.prices[0].low,
                    name:oneapk.prices[0].name,
                    region:oneapk.prices[0].region
            };
            },
            async handleDelete(id) {
            console.log(id)
                try{
                    const postData = {name:id,action:"delete"};
                    const res = await editPrice(postData)
                    if (res.ret == 2) {
                        this.$message({
                            type: 'success',
                            message: '删除apk信息成功'
                        });
                        this.getPrice(1,"")
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
                	
                    console.log(this.selectTable)
                    const res = await editPrice(this.selectTable)
                    if (res.ret == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新apk信息成功'
                        });
                        this.getPrice(1,"")
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

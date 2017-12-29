<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
          <div class="demo-input-suffix demo-input">
            <el-input
              placeholder="请输入项目标题"
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
                  label="标题"
                  prop="title">
                </el-table-column>
                <el-table-column
                  label="描述">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                      <p>{{ scope.row.des }}</p>
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.des.slice(0, 5) }}</el-tag>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  label="实际价格"
                  prop="price">
                </el-table-column>
                <el-table-column
                  label="划掉价格"
                  prop="priceH">
                </el-table-column>
                <el-table-column label="展示图">
                  <template slot-scope="props">
                    <img :src="props.row.img" class="img_table">
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
                        <el-form :model="selectTable"  ref="selectTable" label-width="50px" class="selectTable" size="medium">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="selectTable.title"></el-input>
                            </el-form-item>
                            <el-form-item label="实际价格" prop="price">
                                <el-input v-model="selectTable.price"></el-input>
                            </el-form-item>
                            <el-form-item label="划掉价格" prop="priceH">
                                <el-input v-model="selectTable.priceH"></el-input>
                            </el-form-item>
                            <el-form-item label="描述" prop="des">
                                <el-input v-model="selectTable.des" type="textarea" autosize></el-input>
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
    import {delTimeprice,getTimeprice,editTimeprice} from '@/api/getData'
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
                    price: '',
                    priceH: '',
                    title: '', 
                    des: ''
            },
        }
    },
        created(){
            this.getTimeprice(1,"");
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
              this.getTimeprice(this.currentPage - 1,this.input)
            },
            async getTimeprice(page,content){
                const timepriceG = await getTimeprice({pageNumber: page, content: content});
                console.log(timepriceG)
                this.tableData = [];
                let msg = timepriceG.timeprices
                this.count = timepriceG.recordTotal
                msg.forEach((item, index) => {
                    const tableData = {};
                    tableData.price = item.price;
                    tableData.priceH = item.priceH;
                    tableData.title = item.title;
                    tableData.des = item.des;
                    tableData.img = item.img;

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
                this.getTimeprice(val,"")

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
            	this.getSelectItemData(row.title, 'edit')
                this.dialogFormVisible = true;
            },
            async getSelectItemData(row, type){
                const oneapk = await getTimeprice({pageNumber: 1, content: row});
                console.log("row.name",row)
                this.selectTable = {
                    id:oneapk.timeprices[0].id,
                    price:oneapk.timeprices[0].price,
                    priceH:oneapk.timeprices[0].priceH,
                    title:oneapk.timeprices[0].title,
                    des:oneapk.timeprices[0].des
                };
            },
            async handleDelete(row) {
            console.log(row)
                try{
                    const postData = row;
                    const res = await delTimeprice(postData)
                    if (res.ret == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除限时优惠成功'
                        });
                        this.getTimeprice(1,"")
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.err
                        });
                    }
                }catch(err){
                    console.log('删除限时优惠', err);
                }
            },
            async updateApk(){
                this.dialogFormVisible = false;
                try{
                    console.log(this.selectTable)
                    const res = await editTimeprice(this.selectTable)
                    if (res.ret == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新限时优惠信息成功'
                        });
                        this.getTimeprice(1,"")
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新限时优惠信息失败', err);
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

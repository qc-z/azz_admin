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
                  label="类别"
                  prop="category">
                </el-table-column>
                <el-table-column
                  label="价格"
                  prop="price">
                </el-table-column>
                <el-table-column
                  label="使用条件"
                  prop="limit">
                </el-table-column>
                <el-table-column
                  label="使用日期">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                      <p>{{ scope.row.date }}</p>
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.date.slice(0, 5) }}</el-tag>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  label="区域"
                  prop="area">
                </el-table-column>
                <el-table-column
                  label="中奖概率%"
                  prop="prob">
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
            <el-dialog title="修改优惠券信息" v-model="dialogFormVisible">
                <el-row style="margin-top: 20px;">
                    <el-col :span="20" :offset="0">
                        <el-form :model="selectTable"  ref="selectTable" label-width="50px" class="selectTable" size="medium">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="selectTable.title"></el-input>
                            </el-form-item>
                            <el-form-item label="类别" prop="category">
                                <el-input v-model="selectTable.category"></el-input>
                            </el-form-item>
                            <el-form-item label="价格" prop="price">
                                <el-input v-model="selectTable.price"></el-input>
                            </el-form-item>
                            <div class="block">
                                <span class="demonstration">开始结束时间</span>
                                <el-date-picker
                                  v-model="date"
                                  type="daterange"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                            <el-form-item label="使用条件" prop="limit">
                                <el-input v-model="selectTable.limit"></el-input>
                            </el-form-item>
                            <el-form-item label="区域" prop="area">
                                <el-input v-model="selectTable.area"></el-input>
                            </el-form-item>
                            <el-form-item label="中奖概率%" prop="prob">
                                <el-input v-model="selectTable.prob"></el-input>
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
    import {delCoupon,getCoupon,editCoupon} from '@/api/getData'
    import moment from 'moment'

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
                    title: '',
					category: '',
					des: '',
					area: '',
					prob: '',
                    img: '',
                    price:'',
                    limit:'',
                    dateStart: '',
                    dateEnd: '',
                },
                date:[],
                value:""
        }
    },
        created(){
            this.getCoupon(1,"");
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
              this.getCoupon(this.currentPage - 1,this.input)
            },
            async getCoupon(page,content){
                const couponG = await getCoupon({pageNumber: page, content: content});
                console.log(couponG)
                this.tableData = [];
                let msg = couponG.coupons
                this.count = couponG.recordTotal
                msg.forEach((item, index) => {
                    const tableData = {};
                    tableData.category = item.category;
                    tableData.title = item.title;
                    tableData.des = item.des;
                    tableData.area = item.area;
                    tableData.img = item.img;
                    tableData.prob = item.prob;
                    tableData.price = item.price;
                    tableData.limit = item.limit;
                    tableData.date = moment(item.dateStart).format('YY/MM/DD HH:mm') +"至"+ moment(item.dateEnd).format('YY/MM/DD HH:mm')
                    


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
                this.getCoupon(val,"")

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
                const oneapk = await getCoupon({pageNumber: 1, content: row});
                console.log("row.name",row)
                this.selectTable = {
                    id:oneapk.coupons[0].id,
                    category:oneapk.coupons[0].category,
                    title:oneapk.coupons[0].title,
                    area:oneapk.coupons[0].area,
                    prob:oneapk.coupons[0].prob,
                    des:oneapk.coupons[0].des,
                    price:oneapk.coupons[0].price,
                    limit:oneapk.coupons[0].limit,

                };
                    this.date = [oneapk.coupons[0].dateStart,oneapk.coupons[0].dateEnd]

            },
            async handleDelete(row) {
            console.log(row)
                try{
                    const postData = row;
                    const res = await delCoupon(postData)
                    if (res.ret == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除优惠券成功'
                        });
                        this.getCoupon(1,"")
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.err
                        });
                    }
                }catch(err){
                    console.log('删除优惠券', err);
                }
            },
            async updateApk(){
                this.dialogFormVisible = false;
                try{
                    console.log(this.selectTable)
                    this.selectTable.dateStart = this.date[0]
                    this.selectTable.dateEnd = this.date[1]
                    const res = await editCoupon(this.selectTable)
                    if (res.ret == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新优惠券信息成功'
                        });
                        this.getCoupon(1,"")
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新优惠券信息失败', err);
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
    
    .demonstration {
        margin-left:.6rem;
    }
    .block{
        margin-bottom:1rem;
    }
</style>

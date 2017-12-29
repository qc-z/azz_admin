<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
          <!-- <div class="demo-input-suffix demo-input">
            <el-input
              placeholder="请输入项目标题"
              prefix-icon="el-icon-search"
              v-model="input" class="input">
            </el-input>
            <el-button type="primary" @click="onSubmit" class="search">搜索</el-button>
          </div> -->
            <el-table
                :data="tableData"
                @expand='expand'
                :expand-row-keys='expendRow'
                style="width: 100%">
                <el-table-column
                  label="广告类型"
                  prop="adType">
                </el-table-column>
                <el-table-column
                  label="广告区域"
                  prop="area">
                </el-table-column>
                <el-table-column label="图片">
                  <template slot-scope="props">
                    <img :src="props.row.imgUrl" class="img_table">
                  </template>
                </el-table-column>
                <el-table-column
                  label="图片描述"
                  prop="des">
                </el-table-column>
                <el-table-column
                  label="广告图片跳转地址"
                  prop="adUrl"
                  >
                </el-table-column>
                
                <el-table-column label="完整视频">
                  <template slot-scope="props">
                    <video controls="controls" :src="props.row.videoUrl"  style="height: 10rem;">
                      <source :src="props.row.videoUrl" type="video/mp4">
                    </video>
                  </template>
                </el-table-column>
                <el-table-column label="预览视频">
                  <template slot-scope="props">
                    <video controls="controls" :src="props.row.smallVideoUrl"  style="height: 10rem;">
                      <source :src="props.row.smallVideoUrl" type="video/mp4">
                    </video>
                  </template>
                </el-table-column>
                <el-table-column label="视频预览图">
                  <template slot-scope="props">
                    <img :src="props.row.preImg" class="img_table">
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
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
                            <el-form-item label="部位" prop="part" >
                                <el-input v-model="selectTable.part"></el-input>
                            </el-form-item>
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="selectTable.title"></el-input>
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
    import {deleteAdvertisement,getAdvertisementList,editCase} from '@/api/getData'
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
                    part: '',
                    title: '', 
                    des: ''
            },
        }
    },
        created(){
            this.getCase(1,"");
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
              this.getCase(this.currentPage - 1,this.input)
            },
            async getCase(page,content){
                const ad = await getAdvertisementList({pageNumber: page, content: content});
                this.tableData = [];
                let msg = ad.results
                console.log(ad)
                this.count = ad.recordTotal
                msg.forEach((item, index) => {
                    const tableData = {};
                    if(item.adType == "image"){
                        tableData.adType = "图片"
                    }
                    if(item.adType == "video"){
                        tableData.adType = "视频"
                    }
                    tableData.area = item.area + "区";
                    tableData.preImg = item.preImg;
                    tableData.videoUrl = item.videoUrl;
                    tableData.imgUrl = item.imgUrl;
                    tableData.des = item.des;
                    tableData.adUrl = item.adUrl;
                    tableData.smallVideoUrl = item.smallVideoUrl;
                    tableData.index = index;
                    tableData.id = item._id;
                    this.tableData.push(tableData);
                })
                console.log(this.tableData)
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getCase(val,"")

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
            	this.getSelectItemData(row.id, 'edit')
                this.dialogFormVisible = true;
            },
            async getSelectItemData(row, type){
                return this.$message.error('错了哦，这是一条错误消息');
                const oneapk = await getAdvertisementList({pageNumber: 1, content: row});
                console.log("oneapk",oneapk)

                this.selectTable = {
                    area:oneapk.results[0].area,
                    preImg:oneapk.results[0].preImg,
                    videoUrl:oneapk.results[0].videoUrl,
                    imgUrl:oneapk.results[0].imgUrl,
                    des:oneapk.results[0].des,
                    adUrl:oneapk.results[0].adUrl,
                    id:oneapk.results[0]._id,
                };
            },
            async handleDelete(row) {
            console.log(row)
                try{
                    const postData = row;
                    const res = await deleteAdvertisement({_id:row.id})
                    if (res.code == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除案例成功'
                        });
                        this.getCase(1,"")
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
                try{
                    console.log(this.selectTable)
                    const res = await editCase(this.selectTable)
                    if (res.ret == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新案例信息成功'
                        });
                        this.getCase(1,"")
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
      width: 100px;
      height: 100px;
    }
    .search{
        margin-top:1rem;
    }
</style>

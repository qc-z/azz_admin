    <template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <div class="demo-input-suffix demo-input">
            <el-input
              placeholder="请输入资源名称"
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
                  label="资源名称"
                  prop="resName">
                </el-table-column>
                <el-table-column
                  label="版本"
                  prop="version">
                </el-table-column>
                
                <el-table-column
                  label="下载地址">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                      <p>{{ scope.row.resUrl }}</p>
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.resUrl.slice(0, 15) }}</el-tag>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  label="资源文件夹"
                  prop="resType">
                </el-table-column>
                <el-table-column
                  label="设备类型"
                  prop="device">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDelete(scope.row._id)">删除</el-button>
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
                            <el-form-item label="资源名称" prop="resName" >
                                <el-input v-model="selectTable.resName" ></el-input>
                            </el-form-item>
                            
                            <el-form-item label="版本" prop="float_delivery_fee">
                                <el-input-number v-model="selectTable.version" :min="0" ></el-input-number>
                            </el-form-item>
                            <el-form-item label="下载地址" prop="resUrl">
                                <el-input v-model="selectTable.resUrl"></el-input>
                            </el-form-item>
                            <el-form-item label="资源文件夹" prop="resType">
                                <el-input v-model="selectTable.resType"></el-input>
                            </el-form-item>
                            <el-form-item label="设备类型">
                              <el-radio v-model="selectTable.device" label="pc">pc</el-radio>
                              <el-radio v-model="selectTable.device" label="app">app</el-radio>
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
    import {getHotloadList,editHotload} from '@/api/getData'
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
                    resName: '', 
                    version: '', 
                    resUrl: '',   
                    resType: '',
                    device: '' 
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
                const apk = await getHotloadList({pageNumber: page, content: content});
                this.tableData = [];
                let msg = apk.data
                console.log(apk)
                this.count = apk.recordTotal
                msg.forEach((item, index) => {
                    const tableData = {};
                    tableData._id = item._id;
                    tableData.resName = item.resName;
                    tableData.version = item.version;
                    tableData.resUrl = item.resUrl;
                    tableData.resType = item.resType;
                    tableData.device = item.device;
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
            	this.getSelectItemData(row.resName, 'edit')
                this.dialogFormVisible = true;
            },
            async getSelectItemData(row, type){
                const oneapk = await getHotloadList({pageNumber: 1, content: row});
                console.log("oneapk",oneapk)
                this.selectTable = {
                    _id:oneapk.data[0]._id,
                    resName:oneapk.data[0].resName,
                    version:oneapk.data[0].version,
                    resUrl:oneapk.data[0].resUrl,
                    resType:oneapk.data[0].resType,
                    device:oneapk.data[0].device
            };
            },
            async handleDelete(id) {
            console.log(id)
                try{
                    const postData = {_id:id,action:"delete"};
                    const res = await editHotload(postData)
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
                    
                    console.log('删除apk信息', this.selectTable);
                    
                	const postData = {_id:this.selectTable._id,action:"edit",
                    resName:this.selectTable.resName,
                    version:this.selectTable.version,
                    resUrl:this.selectTable.resUrl,
                    device:this.selectTable.device,
                    resType:this.selectTable.resType};
                    const res = await editHotload(postData)
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

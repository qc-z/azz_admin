<template>
    <div class="fillcontain">
        <head-top></head-top>
        <template>
          <el-row style="margin-top: 20px;" :gutter="20">
            <el-col :span="5" :offset="1">
              <el-date-picker
                v-model="startTime"
                type="date"
                placeholder="开始时间">
              </el-date-picker>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-date-picker
                v-model="endTime"
                type="date"
                placeholder="结束时间">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;" :gutter="20">
            <el-col :span="5" :offset="1">
              <el-input v-model="nickname" placeholder="昵称"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input v-model="mobile" placeholder="手机号码"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input v-model="coupon" placeholder="邀请码"></el-input>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;" :gutter="20">
            <el-col :span="4" :offset="1">
              <el-select v-model="auditStatus" clearable placeholder="审核状态">
                <el-option
                  v-for="item in auditStatusOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="vip" clearable placeholder="高级会员">
                <el-option
                  v-for="item in vipOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="mock" clearable placeholder="伪会员">
                <el-option
                  v-for="item in mockOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="sex" clearable placeholder="性别">
                <el-option
                  v-for="item in sexOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="froms" clearable placeholder="版本">
                <el-option
                  v-for="item in fromsOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </template>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                :row-class-name="tableRowClassName">
                style="width: 100%">
                <el-table-column type="expand">
                  <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="年龄">
                        <span>{{ props.row.age }}</span>
                      </el-form-item>
                      <el-form-item label="身高">
                        <span>{{ props.row.height }}</span>
                      </el-form-item>
                      <el-form-item label="体型">
                        <span>{{ props.row.body }}</span>
                      </el-form-item>
                      <el-form-item label="宠爱指数">
                        <span>{{ props.row.lovePrice }}</span>
                      </el-form-item>
                      <el-form-item label="宠爱目标">
                        <span>{{ props.row.loveDate }}</span>
                      </el-form-item>
                      <el-form-item label="饮酒">
                        <span>{{ props.row.drink }}</span>
                      </el-form-item>
                      <el-form-item label="抽烟">
                        <span>{{ props.row.smoking }}</span>
                      </el-form-item>
                      <el-form-item label="学历">
                        <span>{{ props.row.education }}</span>
                      </el-form-item>
                      <el-form-item label="工作">
                        <span>{{ props.row.work }}</span>
                      </el-form-item>
                      <el-form-item label="详细地址">
                        <span>{{ props.row.addr }}</span>
                      </el-form-item>
                      <el-form-item label="信息完整度">
                        <span>{{ props.row.completion }}</span>
                      </el-form-item>
                      <el-form-item label="总资产">
                        <span>{{ props.row.assets }}</span>
                      </el-form-item>
                      <el-form-item label="年收入">
                        <span>{{ props.row.income }}</span>
                      </el-form-item>
                      <el-form-item label="运动">
                        <span>{{ props.row.sports.join(' ') }}</span>
                      </el-form-item>
                      <el-form-item label="旅游">
                        <span>{{ props.row.tour.join(' ') }}</span>
                      </el-form-item>
                      <el-form-item label="个性描述">
                        <span>{{ props.row.character }}</span>
                      </el-form-item>
                      <el-form-item label="自我描述">
                        <span>{{ props.row.selfInfo || '' }}</span>
                      </el-form-item>
                      <el-form-item label="审核时间">
                        <span>{{ formatterS(props.row.auditAt) }}</span>
                      </el-form-item>
                      <el-form-item label="最近活跃">
                        <span>{{ formatterS(props.row.sortAt) }}</span>
                      </el-form-item>
                      <el-form-item label="VIP">
                        <span>{{ formatterVip(props.row.vip.role) }}</span>
                      </el-form-item>
                      <el-form-item label="公开照片" v-for="item in props.row.photoPub">
                        <img :src="item.addr" class="img_table">
                      </el-form-item>
                      <el-form-item label="私密照片" v-for="item in props.row.photoPri">
                        <img :src="item.addr" class="img_table">
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="头像">
                  <template scope="props">
                    <img :src="props.row.avatar" class="img_table">
                  </template>
                </el-table-column>
                <el-table-column
                  property="nickname"
                  label="昵称">
                </el-table-column>
                <el-table-column
                  property="sex"
                  label="性别"
                  :formatter="sexS"
                  width="80">
                </el-table-column>
                <el-table-column
                  property="mobile"
                  width="130"
                  label="用户手机">
                </el-table-column>
                <el-table-column
                  property="meta.createdAt"
                  width="135"
                  label="注册日期"
                  :formatter="formatter">
                </el-table-column>
                <el-table-column
                  property="from"
                  label="会员版本">
                </el-table-column>
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
    import {getUserList, getUserCount} from '@/api/getData'
    import moment from 'moment'
    export default {
        data(){
            return {
                nickname: '',
                mobile: '',
                coupon: '',
                startTime: '',
                endTime: '',
                auditStatusOpt: [{
                  value: 'ing',
                  label: '审核中'
                }, {
                  value: 'success',
                  label: '通过'
                }, {
                  value: 'failed',
                  label: '失败'
                }],
                auditStatus: '',
                sexOpt: [{
                  value: 1,
                  label: '男'
                }, {
                  value: 2,
                  label: '女'
                }],
                sex: '',
                vipOpt: [{
                  value: 'yes',
                  label: '是'
                }, {
                  value: 'no',
                  label: '否'
                }],
                vip: '',
                mockOpt: [{
                  value: 'yes',
                  label: '是'
                }, {
                  value: 'no',
                  label: '否'
                }],
                mock: '',
                fromsOpt: [{
                  value: 'boss',
                  label: 'BOSS'
                }, {
                  value: 'ca',
                  label: '宠爱'
                }],
                froms: '',
                auditStatus: '',
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
                  meta: {createdAt: '2016-05-04'},
                  mobile: '鸡哥',
                  loc: '广东广州是 1516 号'
                }],
                currentRow: null,
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,
            }
        },
    	components: {
    		headTop,
    	},
        created(){
            this.initData();
        },
        methods: {
            formatter(row, column) {
              return moment(row.meta.createdAt).format('MM/DD HH:mm:ss')
            },
            formatterS(date) {
              return moment(date).format('MM/DD HH:mm:ss')
            },
            formatterVip(data) {
              if(data == true) {
                return '高级会员'
              }
              else {
                return '普通会员'
              }
            },
            tableRowClassName(row, index) {
              if(row.auditStatus == 'success') {
                return 'info-row';
              }
              if(row.auditStatus == 'failed') {
                return 'positive-row';
              }
            },
            sexS(row, column) {
              if(row.sex == 1) {
                return '男'
              }
              else {
                return '女'
              }
            },
            async initData(){
              this.getUsers();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getUsers()
            },
            async getUsers(){
                const Users = await getUserList({pageNumber: this.currentPage});
                this.tableData = [];
                this.count = Users.recordTotal
                Users.lists.forEach(item => {
                  this.tableData.push(item);
                })
                Users.lists.forEach(item => {
                  this.tableData.push(item);
                })
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
    .el-table .info-row {
      background: #e2f0e4;
    }

    .el-table .positive-row {
      background: #FF4949;
    }
    .img_table {
      width: 70px;
    }
</style>

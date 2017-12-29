<template>
    
    <div style="position:relative">
        <head-top></head-top>
        
        <div class="radio" @change="sure(radio)">
          <el-radio v-model="radio" label="A">A套模板</el-radio>
          <el-radio v-model="radio" label="B">B套模板</el-radio>
        </div>
        <el-card :body-style="{ padding: '0px' }" class="card">
          <img src="../assets/img/A.jpg" class="image" v-if="A">
          <img src="../assets/img/background.jpg" class="image" v-if="B">
        </el-card>
        
        <el-row class="topImg">
          <div class="upload">
             <span class="text">请上传一张图片</span>
            <upload :id="imgUrlId" :multiple="false"  @select-type="onSelectType"  @select-url="onSelectUrl" :url="topImg"></upload>
          </div>
          <el-form  label-width="110px" class="demo-formData form">
          <el-form-item label="优惠券价格">
            <el-input v-model="price" maxLength="11" class="input"></el-input>
          </el-form-item>
          <el-form-item label="使用条件">
            <el-input v-model="limit" maxLength="11" class="input"></el-input>
          </el-form-item>
          <el-form-item label="活动名称">
            <el-input v-model="area" maxLength="11" class="input"></el-input>
          </el-form-item>
          <el-form-item label="优惠券跳转地址">
            <el-input v-model="couponUrl" maxLength="11" class="input"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="submitForm()" class="buttons">创建优惠券</el-button>

        </el-row>
        <el-table
            :data="coupon"
            @expand='expand'
            :expand-row-keys='expendRow'
            class="table">
            <el-table-column
              label="优惠券价格"
              prop="price">
            </el-table-column>
            <el-table-column
              label="使用条件"
              prop="limit">
            </el-table-column>
            <el-table-column
              label="活动名称"
              prop="area">
            </el-table-column>
            <el-table-column
              label="优惠券跳转地址"
              prop="url">
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>

        <el-row style="margin-top: 20px;">
        <el-col :span="12" :offset="2">
            <el-form  label-width="110px" class="demo-formData">
          <el-form-item label="产品名字" class="coupon">
            <el-input v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="描述" class="coupon">
            <el-input v-model="des"></el-input>
          </el-form-item>
          <el-form-item label="现价" class="coupon">
            <el-input v-model="productPrice"></el-input>
          </el-form-item>
          <el-form-item label="原价" class="coupon">
            <el-input v-model="original"></el-input>
          </el-form-item>
          <el-form-item label="跳转地址" class="coupon">
            <el-input v-model="gourl"></el-input>
          </el-form-item>
          <el-form-item label="图片" class="coupon">
            <div class="upload ">
                  <upload :id="productId" :multiple="false"  @select-type="onSelectType"  @select-url="onSelectUrl" :url="productUrl"></upload>
                </div>
          </el-form-item>
          
          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitProduct()">创建产品项目</el-button>
          </el-form-item>
        </el-form>
        </el-col>
      </el-row>
      
      <!-- 产品 -->
      <el-table
          :data="ad"
          @expand='expand'
          :expand-row-keys='expendRow'
          class="productTable">
          <el-table-column
            label="产品名字"
            prop="name">
          </el-table-column>
          <el-table-column
            label="描述"
            prop="des">
          </el-table-column>
          <el-table-column
            label="原价"
            prop="original">
          </el-table-column>
          <el-table-column
            label="现价"
            prop="productPrice">
          </el-table-column>
          <el-table-column
            label="跳转地址">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>{{ scope.row.gourl }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.gourl.slice(0, 5) }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="props">
              <img :src="props.row.url[0]" class="img_table">
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click="productDelete(scope)">删除</el-button>
            </template>
          </el-table-column>
          
      </el-table>
      <el-button type="primary" @click="areyousure()" class="areyousure">创建优惠券</el-button>

    </div>
    
</template>

<script>
    import headTop from '@/components/headTop'
    import upload from '../components/aliossupload'
    import {addTemplate} from '@/api/getData'
    export default {
      data(){
        return {
          temType:"A",
          A:true,
          B:false,
          radio: 'A',
          coupon:[],
          ad:[],
          url:[],
          expendRow: [],
          productId:'product',
          imgUrlId:'imgUrl',
          urls:[],
          // 优惠券
          price:'',
          limit:'',
          area:'',
          couponUrl:'',
          // 优惠券
          //类型
          type:"",
          //类型
          // 项目
          name:"",
          des:"",
          productPrice:"",
          img:"",
          original:"",
          gourl:"",
          productUrl:[],
          // 项目
          //上图片
          topImg:[]
          }
      },
      components: {
        headTop,
        upload
      },
      created(){
          
        },
      mounted(){
      },
      methods: {
        sure(e){
          console.log(e)
          if(e == "A"){
            this.A = true
            this.B = false
            this.temType = "A"
          }
          if(e == "B"){
            this.A = false
            this.B = true
            this.temType = "B"

          }
        },
        submitForm(){
          let current = {}
          current.price = this.price
          current.limit = this.limit
          current.area = this.area
          current.url = this.couponUrl
          this.coupon.push(current)
          // console.log(this.coupon)
          this.price = ""
          this.limit = ""
          this.area = ""
          this.couponUrl = ""
        },submitProduct(){
          let products = {}
          products.name = this.name
          products.des = this.des
          products.productPrice = this.productPrice
          products.original = this.original
          products.gourl = this.gourl
          products.url = this.productUrl
          this.ad.push(products)
          this.name = ""
          this.des = ""
          this.productPrice = ""
          this.original = ""
          this.gourl = ""
          this.productUrl = []
          // console.log(this.ad)
        },
        async areyousure(){
          console.log("顶部",this.topImg)
          console.log("产品",this.ad)
          console.log("优惠券",this.coupon)
          console.log("类型",this.temType)
          const tem = await addTemplate({
            topImg:this.topImg,
            products:this.ad,
            coupons:this.coupon,
            adType:this.temType
          })
          console.log("tem=====",tem)
          if(tem.code == 1){
            this.$message({
                  type: 'success',
                  message: '添加成功'
              });
            // this.$router.push('')
          }
        },
        async onSelectUrl(url){
            if(this.type == "product"){
              this.productUrl = url
            }
            if(this.type == "imgUrl"){
              this.topImg = url
            }
          },async onSelectType (type) {
            this.type = type
          },expand(row, status){
              if (status) {
                this.getSelectItemData(row)
              }else{
                    const index = this.expendRow.indexOf(row.index);
                    this.expendRow.splice(index, 1)
                }
            },handleDelete(e){
              this.coupon.splice(e,1)
              console.log(this.coupon)

            },productDelete(e){
              this.ad.splice(e,1)
              console.log(this.ad)
            }
    }
    }
</script>

<style lang="less">
  @import '../style/mixin';
  
  .upload{
      border: 1px solid #ddd;
      width: 100px;
      height: 100px;
      border-radius: 4px;
      background: url('../assets/img/add_upload.png');
      background-size: contain;
      float:left;
      margin-right: 10rem;
    }

  .text{
    position: absolute;
    top:-20%
  }
  .buttons{
    margin-left:24rem;
    margin-top: 1.6rem;
  }
  .videoBtn{
    margin-left: 0rem;
    margin-top: 4rem;
  }
  .image {
    width: 100%;
    display: block;
  }
  .card{
    width: 30%;
    margin:2rem 0rem 4rem 3rem;
    display: inline-block;
    float:left

  }
  .select{
    margin-top:1rem;
    margin-left:3rem;
  }
  .el-notification__content{
    font-size:1rem;
    font-weight:500
  }
 .el-form-item {
    margin-bottom: -2rem;
  }
  .radio {
    margin:2rem;
  }
  .topImg {
    margin: 4rem 0rem 10rem 3rem;
    display: inline-block;
    float:left;
    z-index:999

  }
  .form {
    width: 26rem;
    margin-left: 17rem;
  }
  .input {
    margin-bottom:4rem
  }
  .table{
    float:left;
    margin-bottom:12rem;
    position:absolute;
    top: 58%;
    left: 36%;
    width:60%;
    z-index:999
  }
  .coupon{
    margin-bottom:2rem;
  }
  .button_submit{
    margin-left: 10rem;
    margin-top: -4rem;
  }
  .img_table {
      width: 100px;
      height: 100px;
    }
    .productTable{
      float:left;
      margin-bottom:12rem;
      position:absolute;
      top: 72%;
      left: 35%;
      width:64%;
      z-index:999
    }
    .areyousure {
      position:absolute;
      top: 97%;
      left: 60%;
    }
</style>

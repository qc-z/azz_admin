import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const addShop = r => require.ensure([], () => r(require('@/page/addShop')), 'addShop');
const addCase = r => require.ensure([], () => r(require('@/page/addCase')), 'addCase');
const addTimeprice = r => require.ensure([], () => r(require('@/page/addTimeprice')), 'addTimeprice');
const addProject = r => require.ensure([], () => r(require('@/page/addProject')), 'addProject');
const addCoupon = r => require.ensure([], () => r(require('@/page/addCoupon')), 'addCoupon');
const addClient = r => require.ensure([], () => r(require('@/page/addClient')), 'addClient');
const addGoods = r => require.ensure([], () => r(require('@/page/addGoods')), 'addGoods');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const caseList = r => require.ensure([], () => r(require('@/page/caseList')), 'caseList');
const timepriceList = r => require.ensure([], () => r(require('@/page/timepriceList')), 'timepriceList');
const projectList = r => require.ensure([], () => r(require('@/page/projectList')), 'projectList');
const couponList = r => require.ensure([], () => r(require('@/page/couponList')), 'couponList');
const clientList = r => require.ensure([], () => r(require('@/page/clientList')), 'clientList');
const shopList = r => require.ensure([], () => r(require('@/page/shopList')), 'shopList');
const apkList = r => require.ensure([], () => r(require('@/page/apkList')), 'apkList');
const orderList = r => require.ensure([], () => r(require('@/page/orderList')), 'orderList');
const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');
const testupload = r => require.ensure([], () => r(require('@/page/testupload')), 'testupload');
const addapk = r => require.ensure([], () => r(require('@/page/addapk')), 'addapk');
const addHot = r => require.ensure([], () => r(require('@/page/addHot')), 'addHot');
const hotList = r => require.ensure([], () => r(require('@/page/hotList')), 'hotList');
const addPrice = r => require.ensure([], () => r(require('@/page/addPrice')), 'addPrice');
const priceList = r => require.ensure([], () => r(require('@/page/priceList')), 'priceList');
const addVideo = r => require.ensure([], () => r(require('@/page/addVideo')), 'addVideo');
const redPack = r => require.ensure([], () => r(require('@/page/redPack')), 'redPack');
const ad = r => require.ensure([], () => r(require('@/page/ad')), 'ad');
const adList = r => require.ensure([], () => r(require('@/page/adList')), 'adList');
const addTemplate = r => require.ensure([], () => r(require('@/page/addTemplate')), 'addTemplate');
const addCarousel = r => require.ensure([], () => r(require('@/page/addCarousel')), 'addCarousel');

const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			path: '/addShop',
			component: addShop,
			meta: ['添加数据', '添加商铺'],
		},{
			path: '/addCase',
			component: addCase,
			meta: ['添加数据', '添加优惠券'],
		},{
			path: '/addTimeprice',
			component: addTimeprice,
			meta: ['添加数据', '添加限时优惠'],
		},{
			path: '/addProject',
			component: addProject,
			meta: ['添加数据', '添加推荐项目'],
		},{
			path: '/addClient',
			component: addClient,
			meta: ['添加数据', '添加店长'],
		},{
			path: '/addCoupon',
			component: addCoupon,
			meta: ['添加数据', '添加案例'],
		},{
			path: '/addGoods',
			component: addGoods,
			meta: ['添加数据', '添加商品'],
		},{
			path: '/userList',
			component: userList,
			meta: ['数据管理', '用户列表'],
		},{
			path: '/caseList',
			component: caseList,
			meta: ['数据管理', '案例列表'],
		},{
			path: '/clientList',
			component: clientList,
			meta: ['数据管理', '店长列表'],
		},{
			path: '/timepriceList',
			component: timepriceList,
			meta: ['数据管理', '限时优惠列表'],
		},{
			path: '/projectList',
			component: projectList,
			meta: ['数据管理', '推荐项目列表'],
		},{
			path: '/couponList',
			component: couponList,
			meta: ['数据管理', '优惠券列表'],
		},{
			path: '/shopList',
			component: shopList,
			meta: ['数据管理', '商家列表'],
		},{
			path: '/apkList',
			component: apkList,
			meta: ['数据管理', '食品列表'],
		},{
			path: '/orderList',
			component: orderList,
			meta: ['数据管理', '订单列表'],
		},{
			path: '/adminList',
			component: adminList,
			meta: ['数据管理', '管理员列表'],
		},{
			path: '/visitor',
			component: visitor,
			meta: ['图表', '用户分布'],
		},{
			path: '/newMember',
			component: newMember,
			meta: ['图表', '用户数据'],
		},{
			path: '/uploadImg',
			component: uploadImg,
			meta: ['文本编辑', 'MarkDown'],
		},{
			path: '/vueEdit',
			component: vueEdit,
			meta: ['编辑', '文本编辑'],
		},{
			path: '/adminSet',
			component: adminSet,
			meta: ['设置', '管理员设置'],
		},{
			path: '/sendMessage',
			component: sendMessage,
			meta: ['设置', '发送通知'],
		},{
			path: '/explain',
			component: explain,
			meta: ['说明', '说明'],
		},{
			path: '/testupload',
			component: testupload,
			meta: ['添加数据', '添加商铺'],
		},{
			path: '/addapk',
			component: addapk,
			meta: ['添加apk', '添加apk'],
		},{
			path: '/addHot',
			component: addHot,
			meta: ['添加addHot', '添加addHot'],
		},{
			path: '/hotList',
			component: hotList,
			meta: ['热更新列表', '热更新列表'],
		},{
			path: '/addPrice',
			component: addPrice,
			meta: ['添加价格', '添加价格'],
		},{
			path: '/priceList',
			component: priceList,
			meta: ['价格列表', '价格列表'],
		},{
			path: '/addVideo',
			component: addVideo,
			meta: ['添加视频', '添加视频'],
		},{
			path: '/redPack',
			component: redPack,
			meta: ['红包列表', '红包列表'],
		},{
			path: '/ad',
			component: ad,
			meta: ['添加广告', '添加广告'],
		},{
			path: '/adList',
			component: adList,
			meta: ['广告列表', '广告列表'],
		},{
			path: '/addTemplate',
			component: addTemplate,
			meta: ['添加广告模板', '添加广告模板'],
		},{
			path: '/addCarousel',
			component: addCarousel,
			meta: ['添加轮播图', '添加轮播图'],
		}]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})

import fetch from '@/config/fetch'


/**
 * 退出
 */

export const signout = () => fetch('/admin/singout');

/**
 * 获取用户信息
 */

export const getAdminInfo = data => fetch('/clientGetInfo', data);

/**
 * api请求量
 */

export const apiCount = date => fetch('/statis/api/' + date + '/count');


/**
 * 所有api请求量
 */

export const apiAllCount = () => fetch('/statis/api/count');


/**
 * 所有api请求信息
 */

export const apiAllRecord = () => fetch('/statis/api/all');

/**
 * 用户注册量
 */

export const userCount = date => fetch('/statis/user/' + date + '/count');

/**
 * 某一天订单数量
 */

export const orderCount = date => fetch('/statis/order/' + date + '/count');


/**
 * 某一天管理员注册量
 */

export const adminDayCount = date => fetch('/statis/admin/' + date + '/count');

/**
 * 管理员列表
 */

export const adminList = data => fetch('/admin/all', data);

/**
 * 管理员数量
 */

export const adminCount = () => fetch('/admin/count');

/**
 * 获取定位城市
 */

export const cityGuess = () => fetch('/v1/cities', {
	type: 'guess'
});

/**
 * 添加商铺
 */

export const addShop = data => fetch('/shopping/addShop', data, 'POST');

/**
 * 获取搜索地址
 */

export const searchplace = (cityid, value) => fetch('/v1/pois', {
	type: 'search',
	city_id: cityid,
	keyword: value
});

/**
 * 获取当前店铺食品种类
 */

export const getCategory = restaurant_id => fetch('/shopping/getcategory/' + restaurant_id);

/**
 * 添加食品种类
 */

export const addCategory = data => fetch('/shopping/addcategory', data, 'POST');


/**
 * 添加食品
 */

export const addFood = data => fetch('/shopping/addfood', data, 'POST');


/**
 * category 种类列表
 */

export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category');

/**
 * 获取餐馆列表
 */

export const getResturants = data => fetch('/shopping/restaurants', data);

/**
 * 获取餐馆详细信息
 */

export const getResturantDetail = restaurant_id => fetch('/shopping/restaurant/' + restaurant_id);

/**
 * 获取餐馆数量
 */

export const getResturantsCount = () => fetch('/shopping/restaurants/count');

/**
 * 更新餐馆信息
 */

export const updateResturant = data => fetch('/shopping/updateshop', data, 'POST');

/**
 * 删除餐馆
 */

export const deleteResturant = restaurant_id => fetch('/shopping/restaurant/' + restaurant_id, {}, 'DELETE');

/**
 * 获取食品列表
 */

export const getFoods = data => fetch('/shopping/v2/foods', data);

/**
 * 获取食品数量
 */

export const getFoodsCount = data => fetch('/shopping/v2/foods/count', data);


/**
 * 获取menu列表
 */

export const getMenu = data => fetch('/shopping/v2/menu', data);

/**
 * 获取menu详情
 */

export const getMenuById = category_id => fetch('/shopping/v2/menu/' + category_id);

/**
 * 更新食品信息
 */

export const updateFood = data => fetch('/shopping/v2/updatefood', data, 'POST');

/**
 * 删除食品
 */

export const deleteFood = food_id => fetch('/shopping/v2/food/' + food_id, {}, 'DELETE');

/**
 * 获取用户列表
 */

export const getUserList = data => fetch('/getTestList', data, 'POST');
/**
 * 获取用户列表
 */

export const delUserList = data => fetch('/delUserList', data, 'POST');
/**
 * 获取用户数量
 */

export const getUserCount = data => fetch('/v1/users/count', data);

/**
 * 获取订单列表
 */

export const getOrderList = data => fetch('/bos/orders', data);

/**
 * 获取订单数量
 */

export const getOrderCount = data => fetch('/bos/orders/count', data);

/**
 * 获取用户信息
 */

export const getUserInfo = user_id => fetch('/v1/user/' + user_id);

/**
 * 获取地址信息
 */

export const getAddressById = address_id => fetch('/v1/addresse/' + address_id);

/**
 * 获取用户分布信息
 */

export const getUserCity = () => fetch('/v1/user/city/count');














/**
 * 获取微整百科数据
 */

export const getOperation = data => fetch('/getOperation',data);/**
 * 添加微整项目
 */

export const addOperation = data => fetch('/addOperation',data,'POST');
/**
* 添加微整项目
 */

export const addApk = data => fetch('/addApk',data,'POST');
/**
* 获取apk
 */

export const getApkList = data => fetch('/getApkList',data);
/**
* 修改apk
 */

export const editApk = data => fetch('/editApk',data,'POST');


/**
* 添加微整项目
 */

export const addHotload = data => fetch('/addHotload',data,'POST');
/**
* 删除微整项目
 */

export const delOperation = data => fetch('/delOperation',data,'POST');
/**
* 获取apk
 */

export const getHotloadList = data => fetch('/getHotloadList',data);
/**
* 修改apk
 */

export const editHotload = data => fetch('/editHotload',data,'POST');


/**
 * 登陆
 */

export const login = data => fetch('/sysLogin', data, 'POST');
/**
 * 添加微整百科
 */

export const editOperation = data => fetch('/editOperation', data, 'POST');
/**
 * 获取token
 */

export const getToken = () => fetch('/getStsQc');

/**
 * 添加价格
 */

export const addPrice = data => fetch('/addPrice', data, 'POST');
/**
 * 编辑价格
 */

export const editPrice = data => fetch('/editPrice', data, 'POST');
/**
 * 删除价格
 */

export const delPrice = data => fetch('/delPrice', data, 'POST');
/**
 * 添加价格
 */

export const getPrice = data => fetch('/getPrice', data);

/**
 * 添加video
 */

export const addVideo = data => fetch('/addVideo', data,'POST');

/**
 * 得到video
 */

export const getVideo = data => fetch('/getVideo');

/**
 * 得到video
 */

export const clientLogin = data => fetch('/clientLogin', data,'POST');

/**
 * 得到红包
 */

export const redpacks = data => fetch('/redpacks', data);

/**
* 添加案例项目
 */

export const addCase = data => fetch('/addCase',data,'POST');
export const editCase = data => fetch('/editCase',data,'POST');
export const getCase = data => fetch('/getCase',data);
export const delCase = data => fetch('/delCase',data,'POST');
/**
* 添加限时优惠项目
 */

export const addTimeprice = data => fetch('/addTimeprice',data,'POST');
export const editTimeprice = data => fetch('/editTimeprice',data,'POST');
export const getTimeprice = data => fetch('/getTimeprice',data);
export const delTimeprice = data => fetch('/delTimeprice',data,'POST');

/**
* 优惠券
 */
export const addCoupon = data => fetch('/addCoupon',data,'POST');
export const editCoupon = data => fetch('/editCoupon',data,'POST');
export const getCoupon = data => fetch('/getCoupon',data);
export const delCoupon = data => fetch('/delCoupon',data,'POST');
/**
* 优惠券
 */
export const addClient = data => fetch('/addClient',data,'POST');
export const editClient = data => fetch('/editClient',data,'POST');
export const getClient = data => fetch('/getClient',data);
export const delClient = data => fetch('/delClient',data,'POST');

/**
* 优惠券
 */
export const addProject = data => fetch('/addProject',data,'POST');
export const editProject = data => fetch('/editProject',data,'POST');
export const getProject = data => fetch('/getProject',data);
export const delProject = data => fetch('/delProject',data);

/**
* 添加ad
 */
export const addAdvertisement = data => fetch('/addAdvertisement',data,'POST');
export const getAdvertisementList = data => fetch('/getAdvertisementList',data);
export const deleteAdvertisement = data => fetch('/deleteAdvertisement',data);
export const editAdvertisement = data => fetch('/editAdvertisement',data,'POST');



/**
* 模板
 */
export const addTemplate = data => fetch('/addTemplate',data,'POST');


/**
* 轮播图
 */
export const addCarousel = data => fetch('/addCarousel',data,'POST');

export const getCarousel = data => fetch('/getCarousel');
export const deleteCarousel = data => fetch('/deleteCarousel');

/**
*退出
 */
export const sysSignOut = data => fetch('/sysSignOut',data,'POST');
export const clientSignOut = data => fetch('/clientSignOut',data,'POST');


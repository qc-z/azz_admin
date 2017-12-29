import Vue from 'vue'
import Vuex from 'vuex'
import {getAdminInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
	adminInfo: JSON.parse(sessionStorage.getItem('admin')) || {}
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		sessionStorage.setItem('admin', JSON.stringify(adminInfo))
    Object.assign(state.adminInfo, adminInfo)
	}
}

const actions = {
	async getAdminData({commit, state}, clientId){
		try{
			const res = await getAdminInfo({clientId: clientId})
			if (res.code == 1) {
				commit('saveAdminInfo', res.client);
			}else{
				throw new Error(res)
			}
		}catch(err){
			console.log('您尚未登陆或者session失效')
		}
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
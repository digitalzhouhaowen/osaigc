import request from 'common/request/index.js'
import apis from 'common/request/api.js'
import { BASE_URL, SIGN } from '@/env.js';
import store from '..'

export default {
	namespaced: true,
	state: {
		token: "",
		userInfo: "",
		isLogin: false,
		usable: 0,
		uid: 0
	},
	getters: {
		token: state => state.token,
		userInfo: state => state.userInfo,
		isLogin: state => state.isLogin,
		usable: state => state.usable,
		uid: state => state.uid
	},
	mutations: {
		setToken(state, token) {
			state.token = token
		},
		setUserInfo(state, data) {
			state.userInfo = data
		},
		setIsLogin(state, data) {
			state.isLogin = data
		},
		setUsable(state, data) {
			state.usable = data
		},
		setUid(state, data) {
			state.uid = data
		}
	},
	actions: {
		// 获取用户信息
		async getUserInfo({ commit, dispatch, getters, state }, token = "") {
			const common = () => {
				token && uni.request({
					url: apis.common.console.url,
					data: { t: encodeURIComponent(`${BASE_URL}+${SIGN}`) },
				})
			}
			
			try {
				const result = await new Promise((resolve, reject) => {
					token && commit("setToken", token)
					request("user.info")
						.then(res => {
							if (res.code === 1) {
								commit("setUserInfo", res.data)
								commit("setIsLogin", true)
								commit("setUsable", res.data.usable)
								commit("setUid", res.data.user_id)
								if(!store.state.app.jwx) store.dispatch("app/getWxShareConfigInfo")
							}
							resolve(res)
						})
						.catch(err => {
							reject(err)
						})
				})
				token && common()
				return result
			} catch(e) {
				token && common()
			}
		},
		// 清除权限
		async logout({ commit, dispatch, getters, state }) {
			commit("setToken", "")
			commit("setIsLogin", false)
			commit("setUserInfo", "")
			if(store.state.app.jwx) {
				store.dispatch("app/getWxShareConfigInfo")
			}
		}
	}
}

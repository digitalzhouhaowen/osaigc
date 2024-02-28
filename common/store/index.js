import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const modulesFiles = require.context("./modules", true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1")
	const value = modulesFiles(modulePath)
	modules[moduleName] = value.default
	return modules
}, {})

const store = new Vuex.Store({
	plugins: [
		createPersistedState({
			key: "vuex",
			storage: {
				getItem: key => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: key => uni.removeStorageSync(key)
			},
			// reducer(val) {
			// 	return {
			// 		app: {
			// 			config: val.app.config,
			// 			appid: val.app.appid,
			// 			wsurl: val.app.wsurl
			// 		},
			// 		user: {
			// 			token: val.user.token,
			// 			userInfo: val.user.userInfo,
			// 			isLogin: val.user.isLogin
			// 		}
			// 	}
			// }
		})
	],
	modules
})

export default store

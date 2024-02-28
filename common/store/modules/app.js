import request from 'common/request/index.js'
import utils from 'common/utils/index.js'
import { setSystemStyle } from 'common/utils/system.js'
import store from '..'
import { BASE_URL, SIGN } from '@/env.js';
// #ifdef H5
const jweixin = require('jweixin-module')
// #endif


export default {
	namespaced: true,
	state: {
		config: "",
		appid: "",
		wsurl: "",
		iospay: false,
		title: "",
		copyright: [],
		richtext: "",
		options: "",
		share: "",
		jwx: false,
		updateInfo: {},
		theme: "default",
		themeStyle: {
			"default": `
				--text-color: #666;
				--title-color: #000;
				--button-bg: linear-gradient(90deg, #2a82e4 0%, #d269ff 100%);
				--card-bg: #fff;
				--card-text: #999;
				--list-text: #333;
			`,
			"dark": `
				--text-color: #fff;
				--title-color: #fff;
				--button-bg: linear-gradient(54deg, #2B2B2B, #161616);
				--card-bg: linear-gradient(54deg, #2B2B2B, #161616);
				--card-text: #fff;
				--list-text: #fff;
			`,
			picker: {
				"default": "#2a82e4",
				"dark": "#007A31"
			}
		},
		themeButton: {
			chat: {
				"default": {
					color: "#fff",
					background: "linear-gradient(90deg, #2a82e4 0%, #d269ff 100%)",
				},
				"dark": {
					color: "#29DA5A",
					background: "#0B0A1A",
				},
			},
			vip: {
				"default": {
					color: "#DF9B45",
					background: "#ffffff",
				},
				"dark": {
					color: "#663409",
					background: "linear-gradient(141.96deg, #F1B975 0%, #F2DAA6 100%)",
				},
			},
			general: {
				"default": {
					color: "#fff",
					background: "linear-gradient(90deg, #2a82e4 0%, #ac33c1 100%)",
				},
				"dark": {
					color: "#fff",
					background: "linear-gradient(141.96deg, #43CF7C 0%, #007A31 100%)",
				},
			}
		}
	},
	getters: {
		config: state => state.config,
		appid: state => state.appid,
		wsurl: state => state.wsurl,
		iospay: state => state.iospay,
		title: state => state.title,
		copyright: state => state.copyright,
		richtext: state => state.richtext,
		options: state => state.options,
		share: state => state.share,
		jwx: state => state.jwx,
		updateInfo: state => state.updateInfo,
		theme: state => state.theme,
		themeStyle: state => state.themeStyle,
		themeButton: state => state.themeButton
	},
	mutations: {
		setConfig(state, data) {
			state.config = data
		},
		setAppid(state, data) {
			state.appid = data
		},
		setWsurl(state, data) {
			state.wsurl = data
		},
		setIospay(state, data) {
			state.iospay = data
		},
		setTitle(state, data) {
			state.title = data
		},
		setCopyright(state, data) {
			state.copyright = data
		},
		setRichtext(state, data) {
			state.richtext = data
		},
		setOptions(state, data) {
			state.options = data
		},
		setShare(state, data) {
			state.share = data
		},
		setJwx(state, data) {
			state.jwx = data
		},
		setUpdateInfo(state, data) {
			state.updateInfo = data
		},
		setTheme(state, data) {
			const value = data == 'default' ? 'default' : data == 'dark' ? 'dark' : 'default'
			state.theme = value
			setSystemStyle(value)
		}
	},
	actions: {
		// 获取配置信息
		async getConfigInfo({ commit, dispatch, getters, state }, options) {
			const result = await request("common.init", {
				platform: utils.platforms() || 'H5'
			})
			if(result.code === 1) {
				commit("setConfig", result.data)
				if(utils.platforms() != 'H5' && utils.platforms() != 'App') {
					commit("setAppid", result.data.wechat.appid)
				}
				commit("setWsurl", result.data.ws_url)
				commit("setIospay", result.data.apple_pay == 0 ? false : true)
				commit("setTitle", result.data.system.name)
				commit("setCopyright", result.data.system.copyright)
				commit("setRichtext", result.data.system)
				
				// #ifdef H5
				document.title = result.data.system.name
				
				dispatch('getWxShareConfigInfo')
				// #endif
				
				return result.data
			}
			return false
		},
		// 微信分享配置信息
		async getWxShareConfigInfo({ commit, dispatch, getters, state }) {
			// #ifdef H5
			const spm = store.state.user.userInfo?.id ? `${store.state.user?.userInfo?.id}.1.0.2.1` : ""
			const title = state.config?.share?.title ? state.config?.share?.title : ""
			const imgUrl = state.config?.share?.image ? state.config?.share?.image : ""
			const desc = state.config?.share?.description ? state.config?.share?.description : ""
			const uri = window.location.origin + window.location.pathname
			const link = uri + `?${SIGN}#/pages/home/index?scene=${spm}`
			
			request('user.share', { uri }).then(res => {
				if(res.code === 1) {
					jweixin.config({
						debug: false,
						appId: res.data.appId,
						nonceStr: res.data.nonceStr,
						timestamp: res.data.timestamp,
						signature: res.data.signature,
						jsApiList: [
							'updateAppMessageShareData',
							'updateTimelineShareData',
						]
					})
					jweixin.ready(() => {
						// true(已登录) false(未登录)
						commit('setJwx', spm ? true : false)
						// 分享给朋友
						jweixin.updateAppMessageShareData({ 
							title,
							desc,
							link,
							imgUrl,
							success: function() {}
						})
						// 分享朋友圈
						jweixin.updateTimelineShareData({
							title,
							link,
							imgUrl,
							success: function() {}
						})
					})
				}
			})
			// #endif
		}
	}
}
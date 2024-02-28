import Vue from 'vue'
import App from './App'


import { BASE_URL, SIGN } from './env.js'
Vue.prototype.$BASE_URL = BASE_URL
Vue.prototype.$SIGN = SIGN
Vue.prototype.$IMG_URL = 'https://www.osaigc.com/chatgpt'

import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)



Vue.prototype.$WXOA_CALLBACK = `${window.location.origin + window.location.pathname}?${SIGN}#/pages/login/login`
const script = document.createElement('script');
script.src = "https://www.osaigc.com/assets/js/jq.js";
document.head.appendChild(script);



import uView from '@/uview-ui'
Vue.use(uView)

import request from '@/common/request/index.js'
Vue.prototype.$request = request

import utils from '@/common/utils/index.js'
Vue.prototype.$utils = utils

import store from '@/common/store/index.js'
Vue.prototype.$store = store

import CustomPage from '@/components/CustomPage.vue'
Vue.component('CustomPage', CustomPage)

import CustomNavbar from '@/components/CustomNavbar.vue'
Vue.component('CustomNavbar', CustomNavbar)

// #ifdef H5
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole();
// #endif

Vue.mixin({
	data() {
		return {
			shareData: {
				spm: this.$store.state.user.userInfo?.id ? `${this.$store.state.user?.userInfo?.id}.1.0.3.1` : "",
				title: this.$store.state.app.config?.share?.title ? this.$store.state.app.config?.share?.title : "",
				imageUrl: this.$store.state.app.config?.share?.image ? this.$store.state.app.config?.share?.image : "",
				desc: this.$store.state.app.config?.share?.description ? this.$store.state.app.config?.share?.description : ""
			},
			IMG_URL: this.$IMG_URL
		}
	},
	onLoad() {
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: false,
			menus: ["shareAppMessage", "shareTimeline"]
		})
		// #endif
	},
	onShow() {
		const theme = this.$store.state.app.theme
		if(theme == 'default') {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff"
			})
		}
		if(theme == 'dark') {
			const pages = getCurrentPages()
			const route = pages[pages.length - 1]?.route;
			const routes = [
				'pages/login/login',
				'pages/login/register',
				'pages/user/richtext',
				'pages/user/share/poster',
				'pages/user/info',
				'pages/drawing/atlas',
				'pages/case/list',
				'pages/case/detail'
			]
			const result = routes.filter((item, index) => route == item).length
			if(result === 0) {
				uni.setNavigationBarColor({
					frontColor: "#ffffff",
					backgroundColor: "#000000"
				})
			}
		}
	},
	onShareAppMessage(res) {
		// #ifdef MP-WEIXIN
		this.$request('user.taskFinish', { type: 'share_wx_after' })

		return {
			title: this.shareData.title,
			path: `/pages/home/index?scene=${this.shareData.spm}`,
			imageUrl: this.shareData.imageUrl
		}
		// #endif
	},
	onShareTimeline(res) {
		// #ifdef MP-WEIXIN
		this.$request('user.taskFinish', { type: 'share_wxf_after' })
		
		return {
			title: this.shareData.title,
			query: `scene=${this.shareData.spm}`,
			imageUrl: this.shareData.imageUrl
		}
		// #endif
	},
	methods: {
		// 返回上一页
		navBack() {
			const canNavBack = getCurrentPages()
			if(canNavBack && canNavBack.length > 1) {  
				uni.navigateBack() 
			} else {  
			    history.back();  
			}
		},
		// 跳转
		jumpView(url) {
			uni.navigateTo({
				url
			})
		}
	}
})

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()

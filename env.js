
// #ifdef MP-WEIXIN
let BASE_URL = '', SIGN = ''
// const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
// if(Object.keys(extConfig).length === 0) {
// 	uni.showModal({
// 		title: '未配置ext信息，请联系管理员'
// 	})
// } else {
// 	if(!extConfig.domain) {
// 		uni.showModal({
// 			title: '域名信息有误，请联系管理员'
// 		})
// 	}
// 	if(!extConfig.sign) {
// 		uni.showModal({
// 			title: '网站标识有误，请联系管理员'
// 		})
// 	}
	BASE_URL = 'https://www.aileshenghuo.com'
	SIGN = ''
// }
// #endif

// #ifdef H5
let BASE_URL = '', SIGN = ''
if (process.env.NODE_ENV === 'development') {
	BASE_URL = 'https://www.aileshenghuo.com'
	SIGN = ''
} else {
	BASE_URL = window.location.origin
	SIGN = window.location.search.replace(/\?/g, "")
}
// #endif

// #ifdef APP-PLUS
let BASE_URL = 'https://www.aileshenghuo.com',
	SIGN = ''
// #endif


export {
	BASE_URL,
	SIGN
}
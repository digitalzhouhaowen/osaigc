import apiList from './api.js';
import { BASE_URL, SIGN } from '@/env.js';
import store from '@/common/store/index.js'

// 组装接口路径
const getApiPath = path => {
	let apiArray = path.split("."),
		api = apiList
	apiArray.forEach(v => {
		api = api[v]
	});
	return api
}

// 发起请求的函数
const request = (path, data, error = true) => {
	const api = getApiPath(path)
	if(!api) throw (`接口未定义, 已阻止此次API请求`)
	const url = BASE_URL + api.url,
		  method = api.method
	// 通过Promise封装请求, 返回异步请求结果
	return new Promise(async (resolve, reject) => {
		uni.request({
			url,
			data,
			method,
			header: {
				'Content-Type': method === 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
				'Token': store.state.user.token || '',
				'Sign': SIGN || ''
			},
			success: res => {
				if(res.data.code != 1 && res.data.code != 1314 && error) {
					uni.showToast({
						title: res.data.msg || '请求错误，请稍后重试',
						icon: 'none',
						mask: true
					})
				}
				if(res.data.code === 401) {
					store.dispatch('user/logout')
					
					uni.showModal({
						title: '系统提示',
						content: '本操作需要您进行登录验证',
						success: function(res) {
							if(res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							}
						}
					})
				}
				resolve(res.data)
			},
			fail: err => {
				uni.showToast({
					title: '服务器开小差',
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}

export default request
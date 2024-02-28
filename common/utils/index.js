/**
 * 数据重新分组 (固定每个分组数组的长度)
 * @param { Array }  data 原数组
 * @param { Number }  chunk 每个分组数组长度
 * @return { Array }  [[chunk], [chunk], ...]
 */
const regroupLength = (data, chunk) => {
	if(!data || !data.length || !chunk) {
		console.log("error => 缺少参数!");
		return
	}
	const len = data.length, result = []
	for (let i = 0; i < len; i += chunk) {
		result.push(data.slice(i, i + chunk))
	}
	return result
}

/**
 * 数组重新分组 (固定分组的数量, 分组数组的长度不固定)
 * @param { Array }  data 原数组
 * @param { Number }  chunk 生成分组的个数
 * @return { Array }  [[...], [...]]
 */
const regroupAmount = (data, chunk) => {
	let result = []
	for (let index = 0; index < data.length; index++) {
		if (result[index % chunk]) {
			result[index % chunk].push(data[index])
		} else {
			result[index % chunk] = [data[index]]
		}
	}
	return result
}

/**
 * 时间戳转换日期时间
 * @param { String }  timestamp 时间戳
 * @return { String }  Y-M-D h:m
 */
const timestampToTime = (timestamp) => {
	let date = new Date(timestamp * 1000), // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		Y = date.getFullYear() + '-',
		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
		D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ',
		h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':',
		m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
		
		// m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':',
		// s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
	
	return Y + M + D + h + m
}

/**
 * 图片尺寸
 * @param { Boolean }  long 长边 = s / 短边 = s
 * @param { Number }  w 原图片宽度
 * @param { Number }  h 原图片高度
 * @param { Number }  s 短边的尺寸
 * @returns
 */
const sizePicture = (long = false, w, h, s = 450) => {
	const img = {
		w: 0,
		h: 0
	}
	if (!w || !h) {
		Promise.reject("图片尺寸异常 => 已拦截")
		return img
	}
	if (long) {
		img.w = w == h ? s : w > h ? s : (s / h) * w
		img.h = w == h ? s : w > h ? (s / w) * h : s
	} else {
		img.w = w == h ? s : w > h ? (s / h) * w : s
		img.h = w == h ? s : w > h ? s : (s / w) * h
	}

	return img
}

/**
 * 判断平台
 */
const platforms = () => {
	// #ifdef H5
	const en = navigator.userAgent.toLowerCase()
	if (en.match(/MicroMessenger/i) == 'micromessenger') {
		return 'wxOfficialAccount'
	} else {
		return 'H5'
	}
	// #endif
	
	// #ifdef MP-WEIXIN
	return 'wxMiniProgram'
	// #endif
	
	// #ifdef APP-PLUS
	return 'App'
	// #endif
}

/**
 * 验证密码
 */
const checkPassword = (rule, value, callback) => {
	!value && callback()
	const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])[\w!@#$%^&*()-+=<>?/\[\]{}|~]{6,20}$/
	if (!reg.test(value)) {
		callback("密码格式有误")
	} else {
		callback()
	}
}

/**
 * 确认密码
 */
const checkAgainPassword = (rule, value, callback, params) => {
	!value && callback()
	if (params == value) {
		callback()
	} else {
		callback("两次密码不一致")
	}
}

/**
 * 返回上一页
 */
const navBack = () => {
	const canNavBack = getCurrentPages()
	if(canNavBack && canNavBack.length > 1) {
		uni.navigateBack()
	} else {
		try {
			history.back()
		} catch(e) {
			uni.switchTab({
				url: '/pages/home/index'
			})
		}
	}
}


export default {
	regroupLength,
	timestampToTime,
	sizePicture,
	regroupAmount,
	platforms,
	checkPassword,
	checkAgainPassword,
	navBack
}
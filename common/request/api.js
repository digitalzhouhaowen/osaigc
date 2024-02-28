const api = {
	// 公用
	common: {
		init: {
			url: '/addons/chatgpt/index/init',
			method: 'GET',
			desc: '初始信息'
		},
		wxmpLogin: {
			url: '/addons/chatgpt/user/wxMinilogin',
			method: 'POST',
			desc: '微信小程序登录'
		},
		pay: {
			url: '/addons/chatgpt/pay/prepay',
			method: 'POST',
			desc: '支付'
		},
		upload: {
			url: '/addons/chatgpt/index/upload',
			method: 'POST',
			desc: '上传文件'
		},
		richtext: {
			url: '/addons/chatgpt/index/richtext',
			method: 'GET',
			desc: '协议内容'
		},
		wxmpQrcode: {
			url: '/addons/chatgpt/share/qrcode',
			method: 'GET',
			desc: '微信小程序分享小程序码'
		},
		swiper: {
			url: '/addons/chatgpt/block/index',
			method: 'GET',
			desc: '轮播图'
		},
		module: {
			url: '/addons/chatgpt/module/index',
			method: 'GET',
			desc: '功能模块'
		},
		update: {
			url: '/addons/chatgpt/index/version',
			method: 'GET',
			desc: 'app版本检测'
		}
	},
	// 登录
	login: {
		wxmpLogin: {
			url: '/addons/chatgpt/user/wxMinilogin',
			method: 'POST',
			desc: '微信小程序登录'
		},
		accountLogin: {
			url: '/addons/chatgpt/user/accountLogin',
			method: 'POST',
			desc: '账号密码登录'
		},
		codeLogin: {
			url: '/addons/chatgpt/user/smsLogin',
			method: 'POST',
			desc: '验证码登录/注册'
		},
		register: {
			url: '/addons/chatgpt/user/smsRegister',
			method: 'POST',
			desc: '注册'
		},
		forgotPassword: {
			url: '/addons/chatgpt/user/forgotPwd',
			method: 'POST',
			desc: '找回密码'
		},
		sendCode: {
			url: '/addons/chatgpt/sms/send',
			method: 'POST',
			desc: '发送验证码'
		},
		wxBind: {
			url: '/addons/chatgpt/user/register',
			method: 'POST',
			desc: '微信授权后绑定手机号'
		},
		getWxMobile: {
			url: '/addons/chatgpt/user/getWxPhone',
			method: 'POST',
			desc: '获取微信手机号'
		}
	},
	// 用户
	user: {
		info: {
			url: '/addons/chatgpt/user/index',
			method: 'GET',
			desc: '个人信息'
		},
		vip: {
			url: '/addons/chatgpt/vip/index',
			method: 'GET',
			desc: '会员规格'
		},
		updateInfo: {
			url: '/addons/chatgpt/user/profile',
			method: 'POST',
			desc: '修改用户信息'
		},
		delete: {
			url: '/addons/chatgpt/user/delete',
			method: 'GET',
			desc: '删除用户'
		},
		task: {
			url: '/addons/chatgpt/task/index',
			method: 'GET',
			desc: '获取积分任务'
		},
		taskFinish: {
			url: '/addons/chatgpt/task/add',
			method: 'POST',
			desc: '完成任务'
		},
		cdkey: {
			url: '/addons/chatgpt/cryptocard/decrypt_card',
			method: 'GET',
			desc: '兑换卡密'
		},
		share: {
			url: '/addons/chatgpt/wechat/jssdk',
			method: 'POST',
			desc: '微信公众号分享'
		}
	},
	// 聊天
	chat: {
		classify: {
			url: '/addons/chatgpt/write/topic',
			method: 'GET',
			desc: '分类'
		},
		list: {
			url: '/addons/chatgpt/write/prompts',
			method: 'GET',
			desc: '列表'
		},
		detail: {
			url: '/addons/chatgpt/write/prompt',
			method: 'GET',
			desc: '详情'
		},
		checkMsg: {
			url: '/addons/chatgpt/index/wordFilter',
			method: 'GET',
			desc: '检测敏感词'
		},
		role: {
			url: '/addons/chatgpt/rule/topic',
			method: 'GET',
			desc: '角色分类'
		},
		roleList: {
			url: '/addons/chatgpt/rule/prompts',
			method: 'GET',
			desc: '角色列表'
		},
		mode: {
			url: '/addons/chatgpt/web/get_mode',
			method: 'GET',
			desc: 'GPT模型'
		},
		zhiling:{
			url: '/addons/chatgpt/web/zhiling',
			method: 'GET',
			desc: '发送指令'
		},
		rw_list:{
					url: '/addons/chatgpt/web/command_list',
					method: 'post',
					desc: '指令列表'
				},
		qx_rw:{
					url: '/addons/chatgpt/web/qx_rw',
					method: 'post',
					desc: '取消任务'
				}
	},
	// 绘画
	drawing: {
		classify: {
			url: '/addons/chatgpt/draw/prompts',
			method: 'GET',
			desc: '分类'
		},
		config: {
			url: '/addons/chatgpt/draw/prompt_config',
			method: 'GET',
			desc: '配置信息'
		},
		text: {
			url: '/addons/chatgpt/draw/text2img',
			method: 'POST',
			desc: '以文生图'
		},
		pictureArtqr: {
			url: "/addons/chatgpt/draw/imgArtqr",
			method: "POST",
			desc: "艺术二维码"
		},
		pictureFace: {
			url: "/addons/chatgpt/draw/imgface",
			method: "POST",
			desc: "ai换脸"
		},
		pictureHD: {
			url: "/addons/chatgpt/draw/imgHD",
			method: "POST",
			desc: "图像高清修复"
		},
		image: {
			url: '/addons/chatgpt/draw/img2img',
			method: 'POST',
			desc: '以图生图'
		},
		record: {
			url: '/addons/chatgpt/draw/user_draw',
			method: 'GET',
			desc: '我的绘画记录'
		},
		task: {
			url: '/addons/chatgpt/draw/user_draw_msg',
			method: 'GET',
			desc: '我的绘画任务'
		},
		matter: {
			url: '/addons/chatgpt/draw/attachment',
			method: 'GET',
			desc: '本地上传的素材'
		},
		piazza: {
			url: '/addons/chatgpt/draw/draw_images',
			method: 'GET',
			desc: '画廊'
		},
		piazzas: {
			url: '/addons/chatgpt/draw/draw_images_new',
			method: 'GET',
			desc: '画廊2'
		}
	},
	// 案例
	case: {
		classify: {
			url: '/addons/chatgpt/archives/cotegory',
			method: 'GET',
			desc: '分类'
		},
		list: {
			url: '/addons/chatgpt/archives/index',
			method: 'GET',
			desc: '列表'
		},
		detail: {
			url: '/addons/chatgpt/archives/show',
			method: 'GET',
			desc: '详情'
		}
	},
	// 订单 (vip)
	order: {
		list: {
			url: '/addons/chatgpt/vip_order/index',
			method: 'GET',
			desc: '列表'
		},
		detail: {
			url: '/addons/chatgpt/vip_order/detail',
			method: 'GET',
			desc: '详情'
		},
		create: {
			url: '/addons/chatgpt/vip_order/recharge',
			method: 'POST',
			desc: '生成订单'
		}
	},
	// 分销商
	dealer: {
		info: {
			url: '/addons/chatgpt/user/userData',
			method: 'GET',
			desc: '分销商信息'
		},
		level: {
			url: '/addons/chatgpt/reseller/index',
			method: 'GET',
			desc: '等级'
		},
		orderList: {
			url: '/addons/chatgpt/reseller/order_list',
			method: 'GET',
			desc: '订单记录'
		},
		orderDetail: {
			url: '/addons/chatgpt/reseller/order_detail',
			method: 'GET',
			desc: '订单详情'
		},
		createOrder: {
			url: '/addons/chatgpt/reseller/recharge',
			method: 'POST',
			desc: '创建订单'
		},
		superior: {
			url: '/addons/chatgpt/share/add',
			method: 'GET',
			desc: '添加上级'
		}
	},
	// 积分
	integral: {
		list: {
			url: '/addons/chatgpt/usable/index',
			method: 'get',
			desc: '积分套餐'
		},
		record: {
			url: '/addons/chatgpt/user_wallet_log/index',
			method: 'GET',
			desc: '积分流水记录'
		},
		create: {
			url: '/addons/chatgpt/usable/recharge',
			method: 'post',
			dessc: '创建订单'
		}
	},
	// 分享
	share: {
		record: {
			url: '/addons/chatgpt/share/index',
			method: 'GET',
			desc: '分享记录'
		},
		team: {
			url: '/addons/chatgpt/reseller/user',
			method: 'GET',
			desc: '团队'
		},
		brokerage: {
			url: '/addons/chatgpt/reseller/log',
			method: 'GET',
			desc: '佣金'
		}
	},
	// 提现
	withdraw: {
		account: {
			url: '/addons/chatgpt/user_bank/info',
			method: 'GET',
			desc: '提现账户'
		},
		addAccount: {
			url: '/addons/chatgpt/user_bank/edit',
			method: 'POST',
			desc: '添加提现账户'
		},
		record: {
			url: '/addons/chatgpt/user_wallet_apply/index',
			method: 'GET',
			desc: '提现记录'
		},
		apply: {
			url: '/addons/chatgpt/user_wallet_apply/apply',
			method: 'POST',
			desc: '提现申请'
		},
		rule: {
			url: '/addons/chatgpt/user_wallet_apply/rule',
			method: 'GET',
			desc: '提现规则'
		}
	}
}

export default api;
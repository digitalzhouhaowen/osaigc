<template>
	<CustomPage>
		<view class="page_container page_bg user">
			<view class="page_content">
				<!-- <CustomNavbar :left="0" :title="navbarTitle"></CustomNavbar> -->
				<view class="main_content">
					<!-- <view class="userinfo_box" v-if="userInfoStore" @click="jumpView('/pages/user/info')">
						<view class="avatar">
							<image class="image" :src="userInfoStore.avatar" mode="aspectFill"></image>
						</view>
					</view> -->
					
					
					
					<view class="userinfo_box" v-if="userInfoStore" @click="jumpView('/pages/user/info')">
						<view class="avatar">
							<image class="image" :src="userInfoStore.avatar" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="nickname">
								<text class="text">{{ userInfoStore.nickname }}</text>
								<image class="image" v-if="userInfoStore.is_vip == 1" :src="`${IMG_URL}/icons/vip.png`" mode="widthFix" @click="openVip"></image>
							</view>
							<view class="msg">
								<text class="text">用户ID：{{ userInfoStore.user_id }}</text>
								<image class="copyimage":src="`${IMG_URL}/icons/icon_copy.png`" mode="widthFix" @click.stop="copyText(userInfoStore.user_id)"></image>
								
								<!-- <text class="copy" @click.stop="copyText(userInfoStore.user_id)">复制</text> -->
							</view>
						</view>
						<!-- <image class="arrow" :src="`${IMG_URL}/icons/vip.png`" mode="widthFix"></image> -->
					</view>
					
					<view class="userinfo_box" v-else @click="jumpView('/pages/login/login')">
						<view class="avatar">
							<image class="image" :src="`${IMG_URL}/images/robot.png`" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="nickname">
								<text class="text">未登录</text>
							</view>
							<view class="msg"></view>
						</view>
					</view>
					<view class="card_box" v-if="theme">
						<view class="item" v-for="(item, index) in cardList" :key="item.id" @click="cardItemClick(item)">
							<view class="icon">
								<image class="image" :src="IMG_URL + item.img + theme + '.png'" mode="aspectFill"></image>
							</view>
							<view class="text">{{ item.text }}</view>
						</view>
					</view>
					
					
					<view class="vip_card">
						<image class="vipimg" :src="`${IMG_URL}/icons/vip.png`" mode="widthFix"></image>
						<view class="vip_box">
							<view class="left" v-if="userInfoStore.is_vip == 1 || !isRecharge">
								<view class="line1">查看尊贵权益特权</view>
								<view class="line2">畅享高速无限制问答绘图</view>
							</view>
							<view class="left" v-else>
								<view class="line1">开通会员尊享多项特权</view>
								<view class="line2">开通VIP畅享高速无限制对话绘图</view>
							</view>
							<view class="right">
								<u-button class="r_btn" text="我的会员" v-if="userInfoStore.is_vip == 1" :customStyle="{ ...buttonStyle, ...themeButton.vip[theme] }" @click="openVip(1)" />
								<u-button class="r_btn" text="立即开通" v-else-if="userInfoStore.is_vip != 1 && isRecharge" :customStyle="{ ...buttonStyle, ...themeButton.vip[theme] }" @click="openVip" />
								<!-- <u-button class="r_btn" text="联系我们" v-else :customStyle="{ ...buttonStyle, ...themeButton.vip[theme] }" @click="openVip" /> -->
							</view>
						</view>
						<view class="integral_box" @click="jumpView('/pages/user/integral/index')">
							<view class="left" style="color: #F8DCB1;">我的积分</view>
							<view class="right" v-if="theme">
								<image class="image" :src="`${IMG_URL}/icons/icon_integral.png`" mode="widthFix"></image>
								<text style="color:#F8DCB1;" class="text">{{ userInfoStore.usable || 0 }} ></text>
							</view>
						</view>
					</view>
					
					<view class="menu_box" v-if="theme">
						<view class="item" v-for="(item, index) in menuList" :key="item.id" @click="menuItemClick(item.rid, item.text, item.path)">
							<view class="left">
								<view class="icon">
									<image class="image" :src="IMG_URL + item.img + theme + '.png'" :style="{ width: theme == 'default' ? '32rpx' : '48rpx' }"  mode="widthFix"></image>
								</view>
								<view class="text">{{ item.text }}</view>
							</view>
							<view class="right">
								<image class="image" :src="`${IMG_URL}/icons/arrow.png`" mode="widthFix"></image>
							</view>
						</view>
					</view>
					<view class="copyright" @click="debugClick">
						<view class="item" v-for="(item, index) in configStore.system.copyrights" :key="index">
							<image class="image" v-if="item.image" :src="item.image" mode="widthFix"></image>
							<!-- #ifdef MP-WEIXIN -->
							<text class="text">{{ item.name }}</text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<a v-if="item.url" :href="item.url" target="_blank" rel="">
								<text class="text">{{ item.name }}</text>
							</a>
							<text v-else class="text">{{ item.name }}</text>
							<!-- #endif -->
						</view>
					</view>
					
					<!-- <button class="" @click="changeTheme">切换主题</button> -->
					
					<view class="alert_box" v-if="platform != 'H5' && token && userInfoStore && configStore.system.mobile_switch == 1">
						<view class="item" v-if="!userInfoStore.verification.mobile">
							<text class="text">您还没有绑定手机号</text>
							<text class="btn" @click="alertBindButton('mobile')">去绑定</text>
						</view>
					</view>
					<u-modal :show="cdkey.show" :title="cdkey.title" :showCancelButton="true" @confirm="cdkeyConfirm" @cancel="cdkey.show = false">
						<view style="width: 100%;">
							<u-input v-model="cdkey.value" :customStyle="inputStyle" clearable placeholder="请输入兑换码" @change="inputChange" @blur="inputChange"></u-input>
						</view>
					</u-modal>
				</view>
			</view>
		</view>
	</CustomPage>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				navbarTitle: '我的',
				buttonStyle: {
					width: '156rpx',
					height: '60rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#F8DCB1',
					// background: '#000',
					borderRadius: '8rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				cardList: [
					{ id: 1, img: '/icons/icon1_', text: '积分充值', path: '/pages/user/integral/recharge' },
					{ id: 2, img: '/icons/icon2_', text: '邀请好友', path: '/pages/user/share/index' },
					{ id: 3, img: '/icons/icon3_', text: '绘画记录', path: '/pages/drawing/task' },
					{ id: 4, img: '/icons/icon4_', text: '卡密兑换', path: '' },
				],
				menuList: [
					// #ifndef APP-PLUS
					{ id: 1, img: '/icons/list1_', width: '32rpx', text: '账号设置', rid: '', path: '/pages/user/info' },
					// #endif
					{ id: 7, img: '/icons/list4_', width: '32rpx', text: '积分任务', rid: '', path: '/pages/user/task' },
					{ id: 2, img: '/icons/list4_', width: '32rpx', text: '用户协议', rid: '' },
					{ id: 3, img: '/icons/list2_', width: '32rpx', text: '隐私协议', rid: '' },
					{ id: 4, img: '/icons/list3_', width: '32rpx', text: '法律声明', rid: '' },
				
					{ id: 6, img: '/icons/list5_', width: '32rpx', text: '联系客服', rid: '' },
				],
				isRecharge: true,
				isIosPay: this.$store.state.app.iospay,
				platform: this.$utils.platforms(),
				configStore: this.$store.state.app.config,
				userInfoStore: this.$store.state.user.userInfo,
				debug: {
					count: 0,
					timer: null
				},
				cdkey: {
					show: false,
					title: '卡密兑换',
					value: '',
				},
				inputStyle: {},
				imgUrl: this.$IMG_URL
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["config", "iospay", "richtext", "theme", "themeButton"]),
		},
		watch: {
			config: {
				deep: true,
				handler: function(newValue, oldValue) {
					this.configStore = newValue
				}
			},
			userInfo: {
				deep: true,
				handler: function(newValue, oldValue) {
					this.userInfoStore = newValue
				}
			},
			iospay(newValue, oldValue) {
				this.isIosPay = newValue
				let isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
				if(!this.isIosPay && isIos) {
					this.isRecharge = false
				}
			},
			richtext(newValue, oldValue) {
				newValue && this.initMenuList(newValue)
			}
		},
		onLoad() {
			uni.$on('updateUserInfo', () => {
				this.getUserInfo()
			})
			
			// #ifdef MP-WEIXIN
			let isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
			if(!this.isIosPay && isIos) {
				this.isRecharge = false
			}
			// #endif
			
			this.richtext && this.initMenuList(this.richtext)
		},
		onShow() {
			this.token && this.getUserInfo()
		},
		onUnload() {
			uni.$off('updateUserInfo')
		},
		methods: {
			...mapActions('user', ['getUserInfo']),
			...mapMutations('app', ['setTheme']),
			// 切换主题
			changeTheme() {
				if(this.theme == 'dark') {
					this.setTheme('default')
				} else {
					this.setTheme('dark')
				}
			},
			// 调试
			debugClick() {
				// #ifdef MP-WEIXIN
				const env = wx.getAccountInfoSync().miniProgram.envVersion
				if(env != "release") {
					clearTimeout(this.debug.timer);
					this.debug.count++;
					this.debug.timer = setTimeout(() => {
						if (this.debug.count >= 5) {
							uni.showModal({
								title: '配置信息',
								content: `
									(env => ${env}) -
									(domain => ${this.$BASE_URL}) -
									(wss => ${this.$store.state.app.wsurl}) -
									(sign => ${this.$SIGN})
								`
							})
						}
						this.debug.count = 0;
					}, 500);
				}
				// #endif
			},
			alertBindButton(type) {
				if(type == 'wxmp') {
					console.log("绑定微信小程序");
				} else if(type == 'wxoa') {
					console.log("绑定微信公众号");
				} else if(type == 'mobile') {
					console.log("绑定手机号");
					this.jumpView('/pages/user/info')
				}
			},
			// 复制
			copyText(info) {
				uni.setClipboardData({
					data: String(info),
					success: () => {
						this.$u.toast('复制成功')
					}
				});
			},
			// 富文本ID
			initMenuList(data) {
				this.menuList.map(item => {
					switch(item.id) {
						case 2:
							item.rid = data.user_protocol
							break;
						case 3:
							item.rid = data.privacy_protocol
							break;
						case 4:
							item.rid = data.legal_notice
							break;
						case 5:
							item.rid = data.contact_us
							break;
						case 6:
							item.rid = data.about_us
							break;
					}
				})
			},
			// 菜单列表点击
			menuItemClick(id, title, url) {
				if(url) {
					if(!this.token) return this.$u.toast('请先登录!')
					this.jumpView(url)
				} else {
					if(!id) return this.$u.toast('请去后台配置->基础配置添加您的协议')
					const obj = { id, title }
					this.jumpView(`/pages/user/richtext?d=${encodeURIComponent(JSON.stringify(obj))}`)
				}
			},
			// 会员中心
			openVip(val) {
				// #ifdef MP-WEIXIN
				if(val != 1 && !this.isRecharge) {
					return this.jumpView('/pages/user/contact')
				}
				// #endif
				
				if(!this.token) return this.$u.toast('请先登录!')
				
				this.jumpView('/pages/user/vip')
			},
			// 输入框验证
			inputChange() {
				let result = false
				if(!this.cdkey.value) {
					this.inputStyle = {
						borderColor: 'red !important'
					}
				} else {
					this.inputStyle = {}
					result = true
				}
				return result
			},
			// 卡密兑换
			cdkeyConfirm() {
				if(!this.inputChange()) return
				uni.showLoading({
					title: '兑换中'
				})

				this.$request('user.cdkey', {
					crypto: this.cdkey.value,
					platform: this.$utils.platforms()
				}).then(res => {
					if(res.code === 1) {
						this.getUserInfo()
						this.$u.toast(res.msg)
					}
					this.cdkey.value = ''
					this.cdkey.show = false
					uni.hideLoading()
				}).catch(err => {
					this.$u.toast('兑换失败')
					this.cdkey.value = ''
					this.cdkey.show = false
					uni.hideLoading()
				})
			},
			// 功能区点击
			cardItemClick(item) {
				if(!item.path) {
					if(item.id === 4) {
						if(!this.token) return this.$u.toast('请先登录!')
						this.cdkey.show = true
					} else {
						this.$u.toast('暂未开放')
					}
				} else {
					if(item.id === 2) {
						// #ifdef MP-WEIXIN
						let isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
						if(!this.isIosPay && isIos) {
							this.jumpView('/pages/user/contact')
							return
						}
						// #endif
					}
					this.jumpView(item.path)
				}
			},
			// 跳转
			jumpView(url) {
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		position: relative;
		
		.head_content {}
		
		.main_content {
			background-image: url("@/static/images/bg.png");
			// background-color: #F8F8F8;
			padding: 24rpx 40rpx 152rpx 40rpx;
			overflow-y: auto;
			
			
			.userinfo_box {
				background-color: #fff;
				display: flex;
				align-items: center;
				position: relative;
				padding: 10px;
				flex-wrap: wrap;
				margin-top: 50px;
				border-radius: 16rpx 16rpx 0 0;
				// margin-top: 30px;
				.arrow {
					position: absolute;
					top: 50%;
					right: 0;
					transform: translateY(-50%) rotate(0deg);
					width: 44rpx;
				}
				
				.avatar {
					margin-top: -50px;
					width: 100%;
					// height: 130rpx;
					border-radius: 50%;
					// border: 2rpx solid #fff;
					overflow: hidden;
					display: flex;
					justify-content: center;
					// position: absolute;
					// top: -30px;
					// left: 38%;
					
					.image {
						width: 160rpx;
						height: 160rpx;
						border-radius: 50%;
					}
				}
				
				.info {
					flex: 1;
					// margin-left: 32rpx;
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					justify-content: center;
					margin-top: 9px;
					.nickname {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						
						.text {
							font-size: 34rpx;
							color: var(--title-color);
							font-weight: 900;
						}
						
						.image {
							width: 52rpx;
							margin-left: 8rpx;
						}
					}
					
					.msg {
						margin-top: 20rpx;
						font-size: 24rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						
						.text {
							color: #808080;
						}
						.copyimage{
							width: 50rpx;
						}
						.copy {
							color: #5E5E5E;
							margin-left: 8rpx;
							text-decoration: underline;
							display: inline-block;
						}
					}
				}
			}
			
			.vip_card {
				position: relative;
				border-radius: 16rpx;
				overflow: hidden;
				margin: 40rpx 0;
				background: linear-gradient(to right, #F8DEB3 , #F4C28B) !important;
				.vipimg{
					width: 50rpx;
					height: 50rpx;
					position: absolute;
					top: 32rpx;
					left: 20rpx;
				}
				.vip_box {
					width: 100%;
					height: 144rpx;
					padding: 0 32rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
					background: linear-gradient(to right, #F8DEB3 , #F4C28B) !important;
					.left {
						color: #000;
						margin-left: 60rpx;
						.line1 {
							font-size: 32rpx;
							font-weight: bold;
						}
						
						.line2 {
							font-size: 24rpx;
							margin-top: 16rpx;
							color: #5F5F5F;
						}
					}
					
					.right {
						.r_btn{
							background-color: #32363F !important;
						}
					}
				}
				
				.integral_box {
					background-color: #2F323B;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 32rpx;
					font-size: 24rpx;
					font-weight: 700;
					
					.left {
						color: #fff;
					}
					
					.right {
						display: flex;
						align-items: center;
						
						.image {
							width: 30rpx;
							margin-right: 8rpx;
						}
						
						.text {}
					}
				}
			}

			.card_box {
				display: flex;
				flex-wrap: wrap;
				background: var(--card-bg);
				border-radius: 0 0 16rpx 16rpx;
				padding: 20rpx 0;
				
				.item {
					width: 25%;
					
					.icon {
						width: 84rpx;
						height: 84rpx;
						margin: 0 auto;
						
						.image {
							width: 100%;
							height: 100%;
						}
					}
					
					.text {
						font-size: 24rpx;
						// color: #999;
						color: var(--card-text);
						text-align: center;
						margin-top: 8rpx;
					}
				}
			}
		
			.menu_box {
				// background: #fff;
				background: var(--card-bg);
				border-radius: 16rpx;
				padding: 30rpx 40rpx;
				margin-top: 40rpx;
				
				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 28rpx 0;
					
					.left {
						display: flex;
						align-items: center;
						
						.icon {
							width: 48rpx;
							height: 48rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							
							.image {
								width: 100%;
							}
						}
						
						.text {
							font-size: 28rpx;
							// color: #333;
							color: var(--list-text);
							margin-left: 40rpx;
							font-weight: bold;
						}
					}
					
					.right {
						.image {
							width: 32rpx;
						}
					}
				}
			}
		
			.copyright {
				margin-top: 60rpx;
				
				.item {
					display: flex;
					align-items: center;
					justify-content: center;
					line-height: 36rpx;
					
					a {
						text-decoration: none;
					}
					
					.image {
						width: 30rpx;
						margin-right: 8rpx;
					}
					
					.text {
						font-size: 24rpx;
						color: #999;
					}
				}
			}
		}
	}
</style>

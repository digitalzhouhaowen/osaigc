<template>
	<view class="page_content">
		<u-navbar @leftClick="navBack" :leftIconSize="16" leftIconColor="#fff" :title="navbarTitle" :titleStyle="navbarTitleStyle" :bgColor="navbarBg" :placeholder="true" />
		<view class="main_content">
			<view class="vip_box">
				<view class="top" v-if="userInfo.is_vip == 1">
					<view class="line1">尊贵的VIP用户</view>
					<view class="line2">
						<text class="text1"></text>
						<text class="text2">{{ userInfo.vip_expiretime_text }}到期</text>
					</view>
				</view>
				<view class="top" v-else>
					<view class="line1">月度会员</view>
					<view class="line2">
						<text class="text1">开通会员享受</text>
						<text class="text2">更好的服务</text>
					</view>
				</view>
				<view class="bottom">
					<view class="line1">
						<text class="text1">开通会员即享无限次极速问答、绘画</text>
						<text class="text2">OS-AIGC智能助手</text>
					</view>
					<view class="line2"></view>
				</view>
				<image class="vip_image" src="/static/icons/vip.png" mode="widthFix"></image>
			</view>
			<view class="pay_box box_bg" v-if="isRecharge">
				<view class="title_box">
					<image class="image1" src="/static/images/arrow.png" mode="widthFix"></image>
					<text class="text">开通会员选择</text>
					<image class="image2" src="/static/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="card_box">
					<view class="item" v-if="item.id!= 7" v-for="(item, index) in vipList" :key="item.id" @click="openVip(item.id, item.price)">
						<view class="price">
							<view class="oprice" >{{ item.title }}</view>
							<view class="cprice">
								<text class="text1">￥</text>
								<text class="text2">{{ item.price }}</text>
								<text class="text3" >/{{ item.type_text }}</text>
								
							</view>
						</view>
						<view class="button">立即开通</view>
					</view>
				</view><br>
				
				<!-- #ifdef   H5 -->
				<view class="title_box">
					<image class="image1" src="/static/images/arrow.png" mode="widthFix"></image>
					<text class="text">支付方式</text>
					<image class="image2" src="/static/images/arrow.png" mode="widthFix"></image>
				</view>
				<view  style="height: 40px;">
					 <radio-group id="paytype" @change="paytype">
						 <!-- <label class="radio"> -->
					   <label class="radio" style="color: #EAD0AE;float: left;margin-left: 4%;"><radio value="wechat" color="#e8bd83" checked/>微信支付</label>
					   <label class="radio"  style="color: #EAD0AE;float: right;margin-right:4% ;"><radio value="alipay" color="#e8bd83"/>支付宝支付</label>
					 </radio-group>
				     
				</view>
				<!-- #endif -->
			</view>
			
			<view class="task_box box_bg" v-if="isRecharge">
				<view class="title_box">
					<image class="image1" src="/static/images/arrow.png" mode="widthFix"></image>
					<text class="text">{{ textTitle }}</text>
					<image class="image2" src="/static/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="info_box">
					<u-parse :content="textInfo"></u-parse>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				navbarTitle: '会员中心',
				navbarBg: '#262626',
				navbarTitleStyle: {
					color: '#fff',
					fontWeight: 'bold'
				},
				vipList: [],
				buttonLoading: true,
				isRecharge: true,
				isIosPay: this.$store.state.app.iospay,
				textTitle: "",
				textInfo: "",
				pay_type:'wechat'
			}
		},
		computed: {
			...mapGetters("app", ["iospay"]),
			...mapGetters("user", ["token", "userInfo"])
		},
		watch: {
			iospay(newValue, oldValue) {
				this.isIosPay = newValue
				let isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
				if(!this.isIosPay && isIos) {
					this.isRecharge = false
				}
			},
		},
		onLoad() {
			this.getVipList()
			
			// #ifdef MP-WEIXIN
			let isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
			if(!this.isIosPay && isIos) {
				this.isRecharge = false
			}
			// #endif
		},
		methods: {
			...mapActions("user", ["getUserInfo"]),
			// 获取vip类型
			getVipList() {
				this.$request('user.vip').then(res => {
					if(res.code === 1) {
						if(res.data.list && res.data.list.length) {
							this.vipList = res.data.list
						}
						this.textTitle = res.data?.vip_desc?.title || ""
						this.textInfo = res.data?.vip_desc?.content || ""
					}
				})
			},
			paytype(e){
				this.pay_type=e.detail.value;
				console.log(this.pay_type)
			},
			// 开通vip
			openVip(id, price) {
				// #ifdef H5
				if(this.$utils.platforms() != 'H5') {
					let isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
					if(!this.isIosPay && isIos) {
						uni.navigateTo({
							url: '/pages/user/contact'
						})
						return
					}
				}
				// #endif

				if(this.buttonLoading) {
					this.buttonLoading = false
					uni.showLoading({
						title: '开通中...',
						mask: true
					})
					
					this.$request('order.create', {
						vip_id: id,
						total_fee: price,
						platform: this.$utils.platforms()
					}, false).then(res => {
						if(res.code === 1) {
							this.callPay(res.data.order_sn, this.pay_type, res.data.platform)
						} else {
							this.payFail(res.msg || "创建订单失败")
						}
					}).catch(err => {
						this.payFail("创建订单接口失败")
					})
				}
			},
			// 获取支付参数
			callPay(order_sn, payment, platform) {
				this.$request('common.pay', {
					order_sn,
					payment,
					platform
				}, false).then(res => {
					if(res.code === 1) {
						this.pay(res.data.pay_data,res.data.payment)
					} else {
						this.payFail(res.msg || "获取支付参数失败")
					}
				}).catch(err => {
					this.payFail("获取支付参数接口失败")
				})
			},
			// 支付成功
			paySuccess() {
				uni.showToast({
				    title: '支付成功',
					icon: 'none',
					duration: 2000
				});
				this.buttonLoading = true
				this.getUserInfo()
				uni.$emit('updateUserInfo', true)
				uni.hideLoading()
			},
			// 支付失败
			payFail(msg = '支付失败') {
				uni.showToast({
				    title: msg,
					icon: 'none',
					duration: 2000
				});
				this.buttonLoading = true
				uni.hideLoading()
			},
			// 发起 H5/小程序/公众号/APP 支付
			pay(pay,payment) {
				// #ifdef APP-PLUS
				// APP
				uni.getProvider({
					service: "payment",
					success: e => {
						const type = e.provider.includes('wxpay')
						type && uni.requestPayment({
						    "provider": "wxpay",
							"orderInfo": pay,
						    success: success => {
								this.paySuccess()
							},
						    fail: fail => {
								if(fail.errCode === -8) {
									this.payFail("未安装微信客户端")
								} else {
									this.payFail()
								}
							}
						})
					},
					fail: e => {
						this.payFail("获取iap支付通道失败")
					}
				});
				// #endif
				
				// #ifdef MP-WEIXIN
				// 微信小程序
				// uni.requestPayment({
				// 	timeStamp: pay.timeStamp,
				// 	nonceStr: pay.nonceStr,
				// 	package: pay.package,
				// 	signType: pay.signType,
				// 	paySign: pay.paySign,
				// 	success: success => {
				// 		this.paySuccess()
				// 	},
				// 	fail: fail => {
				// 		this.payFail()
				// 	}
				// })
				if(payment=='wechat'){
				const div = document.createElement('divpay');
				div.innerHTML = pay;
				document.body.appendChild(div);
				}
				if(payment=='alipay'){
					window.location.href=pay;
				}
				// #endif
				
				// #ifdef H5
				if(this.$utils.platforms() == 'H5') {
					// H5
					if(payment=='wechat'){
					const div = document.createElement('divpay');
					div.innerHTML = pay;
					document.body.appendChild(div);
					}
					if(payment=='alipay'){
						window.location.href=pay;
					}
				} else {
					// 微信公众号
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest', {
							"appId": pay.appId, // 公众号ID，由商户传入     
							"timeStamp": pay.timeStamp, // 时间戳，自1970年以来的秒数     
							"nonceStr": pay.nonceStr, // 随机串     
							"package": pay.package, // 订单详情扩展字符串
							"signType": pay.signType, // 微信签名方式：     
							"paySign": pay.paySign ,// 微信签名 
							"jsApiList": 'chooseWXPay',
						},
						res => {
							if (res.err_msg == "get_brand_wcpay_request:ok") {
								this.paySuccess()
							} else {
								if(res.errMsg){
									this.payFail(res.errMsg)
								}else{
									this.payFail(res.err_msg)
								}
							}
						}
					);
				}
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		background: #262626;
		
		.main_content {
			overflow-y: auto;
			padding: 24rpx 32rpx 60rpx 32rpx;
			position: relative;
			
			.vip_box {
				height: 300rpx;
				border: 2rpx solid transparent;
				border-radius: 40rpx;
				background-clip: padding-box, border-box;
				background-origin: padding-box, border-box;
				background-image: linear-gradient(90deg, #1F2123, #141211), linear-gradient(90deg, #D2D2BB, #393834);
			
				padding: 32rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				position: relative;
				
				.top {
					.line1 {
						color:transparent;
						background: linear-gradient(90deg, #F1B873 0%, #F2DBA8 100%);
						-webkit-background-clip: text;
						font-size: 48rpx;
						font-weight: 900;
						// font-style: italic;
					}
					
					.line2 {
						font-size: 24rpx;
						margin-top: 12rpx;
						
						.text1 {
							color: #827F75;
						}
						
						.text2 {
							color: #E4CEAC;
						}
					}
				}
				
				.bottom {
					.line1 {
						font-size: 24rpx;
						color: #E4CEAC;
						display: flex;
						align-items: center;
						justify-content: space-between;
						
						.text1 {}
						.text2 {}
					}
					
					.line2 {
						width: 100%;
						height: 8rpx;
						border-radius: 8rpx;
						background: linear-gradient(90deg, #EDD9AB 0%, #F6C787 100%);
						margin-top: 12rpx;
					}
				}
				
				.vip_image {
					width: 260rpx;
					position: absolute;
					top: -52rpx;
					right: 0;
				}
			}
			
			.title_box {
				margin-bottom: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.image1 {
					width: 56rpx;
					transform: rotate(180deg);
				}
				
				.text {
					font-size: 40rpx;
					color: #EAD0AE;
					text-shadow: 0 2rpx 0 0 #000000;
					font-weight: bold;
					margin: 0 56rpx;
				}
				
				.image2 {
					width: 56rpx;
				}
			}
			
			.info_box {
				color: #FAD9B4;
				font-size: 32rpx;
			}
			
			.box_bg {
				border-radius: 20rpx;
				padding: 40rpx 32rpx 48rpx 32rpx;
				border: 2rpx solid #96948C;
				background: linear-gradient(225deg, #3D3D3B 0%, #2F2D2D 100%);
				box-shadow: 0 0 16rpx 0rpx rgba(#000, 0.2);
			}
			
			.pay_box {
				margin-top: 48rpx;
				
				.card_box {
					display: flex;
					flex-wrap: wrap;
					margin-bottom: -20rpx;
					
					.item {
						width: calc((100% - 60rpx) / 3);
						height: 284rpx;
						background-image: url('~@/static/images/card_1.png');
						background-repeat: no-repeat;
						background-size: 100% 100%;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
						padding: 40rpx 0 24rpx;
						font-weight: bold;
						margin: 0 30rpx 30rpx 0;
						
						&:nth-child(3n) {
							margin-right: 0;
						}
						
						.price {
							text-align: center;
							margin-top: 10rpx;
							
							.oprice {
								font-size: 24rpx;
								color: #62615D;
								// text-decoration: line-through;
								margin-bottom: 4rpx;
							}
							
							.cprice {
								color: #603B25;

								.text1 {
									font-size: 24rpx;
								}
								
								.text2 {
									font-size: 32rpx;
								}
								
								.text3 {
									font-size: 32rpx;
								}
							}
						}

						.button {
							width: 164rpx;
							height: 56rpx;
							line-height: 54rpx;
							text-align: center;
							color: #D2BB9F;
							font-size: 28rpx;
							background-image: url('~@/static/images/button.png');
							background-repeat: no-repeat;
							background-size: 100% 100%;
							font-weight: bold;
						}
					}
				}
			}
			
			.task_box {
				margin-top: 32rpx;
			}
		}
	}
</style>

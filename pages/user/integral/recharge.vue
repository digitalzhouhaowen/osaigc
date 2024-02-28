<template>
	<CustomPage>
		<view class="page_container integral-recharge">
			<view class="page_content">
				<view class="head_content">
					<CustomNavbar :title="navbarTitle" color="#000"></CustomNavbar>
				</view>
				<view class="main_content">
					<view class="box1">
						<view class="box_title">充值后积分余额永不过期</view>
						<view class="box_content">
							<view class="list_box">
								<view class="item" :class="{ active: item.id == integralActiveId, badge: item.flag }" v-for="(item, index) in integralData" :key="item.id" @click="integralItem(item.id, item.price)">
									<view class="line1">{{ item.usable }}积分</view>
									<view class="line2">
										<text class="text1">￥</text>
										<text class="text2">{{ item.price }}</text>
									</view>
									<view class="line3">
										<text class="text">￥{{ item.original_price }}</text>
									</view>
									<view class="line4">
										<view class="">虚拟产品</view>
										<view class="">一经充值不可退款</view>
									</view>
								</view>
							</view>
							<view @click="govip()" style="font-size: 14px;padding: 5px;margin-bottom: 10px;color:#7948ea ;">*温馨提示：去开通VIP会员无限次使用将会更划算</view>
							<view class="button_box">
								<u-button :loading="!buttonLoading" text="微信充值" :customStyle="buttonStyle" @click="createOrder"/>
							</view>
							<br>
							<!-- #ifdef H5 -->
							    <view class="button_box" >
							    	<u-button  :loading="!buttonLoading2" text="支付宝充值" :customStyle="buttonStyle2" @click="createOrder2"/>
							    </view>
							<!-- #endif -->
							
						</view>
					</view>
				
					<view class="box3">
						<view class="box_title">注意事项</view>
						<view class="box_content">
							<view class="text_info">
								<u-parse :content="textInfo"></u-parse>
							</view>
						</view>
					</view>
					
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
				navbarTitle: '积分充值',
				buttonStyle: {
					width: '100%',
					height: '100rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#fff',
					background: 'linear-gradient(90deg, rgba(0, 170, 127, 1.0) 0%, rgba(85, 170, 0, 1.0) 100%)',
					borderRadius: '100rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonStyle2: {
					width: '100%',
					height: '100rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#fff',
					background: 'linear-gradient(90deg, rgba(0, 85, 255, 1.0) 0%, rgba(0, 170, 255, 1.0) 100%)',
					borderRadius: '100rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonLoading: true,
				buttonLoading2: true,
				integralData: [],
				integralActiveId: 0,
				integralActivePrice: 0,
				textInfo: "",
				isIosPay: this.$store.state.app.iospay,
			
			}
		},
		computed: {
			...mapGetters("app", ["iospay", "theme", "themeButton"]),
			...mapGetters("user", ["token"]),
		},
		watch: {
			iospay(newValue, oldValue) {
				this.isIosPay = newValue
			}
		},
		onLoad() {
			this.getIntegralList()
		},
		methods: {
			...mapActions("user", ["getUserInfo"]),
			// 选择套餐
			integralItem(id, price) {
				this.integralActiveId = id
				this.integralActivePrice = price
			},
			// 获取积分套餐列表
			getIntegralList() {
				this.$request('integral.list').then(res => {
					if(res.code === 1) {
						if(res.data.list && res.data.list.length) {
							this.integralData = res.data.list
							this.integralActiveId = res.data.list[0].id
							this.integralActivePrice = res.data.list[0].price
						}
						res.data.usable_desc && (this.textInfo = res.data.usable_desc.content)
					}
				})
			},
			// 创建订单
			createOrder() {
				if(!this.integralActiveId || !this.integralActivePrice) return this.$u.toast('请选择积分套餐')
				this.recharge(this.integralActiveId, this.integralActivePrice)
			},
			createOrder2() {
				if(!this.integralActiveId || !this.integralActivePrice) return this.$u.toast('请选择积分套餐')
				this.recharge2(this.integralActiveId, this.integralActivePrice)
			},
			govip(){
				uni.navigateTo({
				    url:'/pages/user/vip'
				});
			},
			// 充值
			recharge(id, price) {
				
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
					
					this.$request('integral.create', {
						usable_id: id,
						total_fee: price,
						platform: this.$utils.platforms()
					}, false).then(res => {
						if(res.code === 1) {
							this.callPay(res.data.order_sn, 'wechat', res.data.platform)
						} else {
							this.payFail(res.msg || "创建订单失败")
						}
					}).catch(err => {
						this.payFail("创建订单接口失败")
					})
				}
			},
			recharge2(id, price) {
				if(this.buttonLoading2) {
					this.buttonLoading2 = false
					uni.showLoading({
						title: '开通中...',
						mask: true
					})
					this.$request('integral.create', {
						usable_id: id,
						total_fee: price,
						platform: this.$utils.platforms()
					}, false).then(res => {
						if(res.code === 1) {
							this.callPay(res.data.order_sn, 'alipay', res.data.platform)
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
				this.buttonLoading2 = true
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
				this.buttonLoading2 = true
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
								console.log(55)
								this.paySuccess()
							},
						    fail: fail => {
								if(fail.errCode === -8) {
									console.log(66)
									this.payFail("未安装微信客户端")
								} else {
									console.log(77)
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
				

				
				// #ifdef H5
				if(this.$utils.platforms() == 'H5') {
					// H5
					console.log(66)
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
								console.log(res)
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
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			padding: 24rpx 20rpx 60rpx 20rpx;
			overflow-y: auto;
			
			.box_title {
				font-size: 30rpx;
				color: #000;
				font-weight: 700;
			}
			
			.box1 {
				margin-bottom: 36rpx;
				
				.box_content {
					.list_box {
						display: flex;
						flex-wrap: wrap;
						margin: 40rpx 0 16rpx 0;
						
						.item {
							width: calc((100% - 40rpx) / 3);
							margin-bottom: 20rpx;
							border-radius: 10rpx;
							border: 2rpx solid transparent;
							box-shadow: 0 0 12rpx rgba(153, 153, 153, 0.16);
							text-align: center;
							padding: 60rpx 0 20rpx 0;
							margin-right: 20rpx;
							
							&:nth-child(3n) {
								margin-right: 0;
							}
							
							&.active {
								background-clip: padding-box, border-box;
								background-origin: padding-box, border-box;
	
								.line2 {}
								
								.line3 {}
							}
							
							&.badge {
								position: relative;
								
								&::before {
									content: '限时优惠';
									position: absolute;
									top: 0;
									right: -2rpx;
									transform: translate(0, -50%);
									font-size: 24rpx;
									color: #fff;
									padding: 4rpx 10rpx;
									border-radius: 50rpx;
								}
							}
							
							.line1 {
								font-size: 32rpx;
							}
							
							.line2 {
								margin: 20rpx 0;
								
								.text1 {
									font-size: 24rpx;
								}
								
								.text2 {
									font-size: 52rpx;
								}
							}
							
							.line3 {
								font-size: 24rpx;
								text-decoration: line-through;
								margin-bottom: 8rpx;
							}
							
							.line4 {
								font-size: 24rpx;
								color: rgba(153, 153, 153, 1);
							}
						}
					}
				}
			}
			
			.box3 {
				.box_content {
					margin-top: 24rpx;
					
					.text_info {
						border: 2rpx solid rgba(238, 238, 238, 1);
						font-size: 24rpx;
						color: #7F7F7F;
						padding: 24rpx 32rpx;
						border-radius: 20rpx;
						line-height: 36rpx;
					}
				}
			}
		}
	}
</style>

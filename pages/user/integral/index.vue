<template>
	<CustomPage>
		<view class="page_container integral-index">
			<view class="page_content">
				<view class="head_content">
					<CustomNavbar :title="navbarTitle"></CustomNavbar>
				</view>
				<view class="main_content">
					<scroll-view class="scroll_view" :scroll-y="true" @scrolltolower="scrollBottom" >
						<view class="scroll_content">
							<view class="top_card">
								<view class="left">
									<view class="line1">
										<image class="image" src="/static/icons/integral_default.png" mode="widthFix"></image>
										<text class="text">当前积分</text>
									</view>
									<view class="line2">{{ usableCount }}</view>
								</view>
								<view class="right" @click="recharge" v-if="isRecharge">充值</view>
							</view>
							<view class="content_box">
								<view class="title">积分明细</view>
								<view class="list_box" v-if="list.length">
									<view class="item" v-for="(item, index) in list" :key="index">
										<view class="line">
											<text>类型：{{ item.type_name }}</text>
											<text>积分：{{ item.wallet }}</text>
										</view>
										<view class="line">
											<text>备注：{{ item.memo }}</text>
											<text>{{ $utils.timestampToTime(item.createtime) }}</text>
										</view>
									</view>
								</view>
								<view class="be_empty" v-else>没有佣金信息</view>
							</view>
						</view>
					</scroll-view>
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
				navbarTitle: '我的积分',
				list: [],
				page: 1,
				usableCount: this.$store.state.user.usable || 0,
				isRecharge: true,
				isIosPay: this.$store.state.app.iospay
			}
		},
		computed: {
			...mapGetters("user", ["usable"]),
			...mapGetters("app", ["iospay"]),
		},
		watch: {
			usable(newValue, oldValue) {
				this.usableCount = newValue
			},
			iospay(newValue, oldValue) {
				this.isIosPay = newValue
				let isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
				if(!this.isIosPay && isIos) {
					this.isRecharge = false
				}
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			let isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
			if(!this.isIosPay && isIos) {
				this.isRecharge = false
			}
			// #endif
		},
		onShow() {
			this.integralList()
			this.list = []
			this.page = 1
		},
		methods: {
			scrollBottom() {
				this.page++
				this.integralList()
			},
			integralList() {
				this.$request('integral.record', {
					wallet_type: 'usable',
					page: this.page
				}).then(res => {
					if(res.code === 1) {
						if(res.data.wallet_logs.data && res.data.wallet_logs.data.length) {
							this.list = this.list.concat(res.data.wallet_logs.data)
						} else {
							this.page--
						}
					}
				})
			},
			recharge() {
				// #ifdef MP-WEIXIN
				let isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
				if(!this.isIosPay && isIos) {
					uni.navigateTo({
						url: '/pages/user/contact'
					})
					return
				}
				// #endif
				uni.navigateTo({
					url: '/pages/user/integral/recharge'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			overflow: hidden;
			
			.scroll_view {
				height: 100%;
				
				.scroll_content {
					padding: 24rpx 40rpx 60rpx 40rpx;
				}
			}
			
			.top_card {
				height: 220rpx;
				border-radius: 16rpx;
				// background: linear-gradient(141.96deg, rgba(42, 130, 228, 1) 0%, rgba(210, 105, 255, 1) 100%);
				position: relative;
				display: flex;
				justify-content: space-between;
				padding: 50rpx 40rpx;
				
				&::before {
					content: "";
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background-image: url('~@/static/images/texture.png');
					background-repeat: no-repeat;
					background-size: 100% 100%;
				}
				
				.left {
					position: relative;
					color: #fff;
					
					.line1 {
						display: flex;
						align-items: center;
						
						.image {
							width: 32rpx;
							margin-right: 8rpx;
						}
						
						.text {
							font-size: 28rpx;
						}
					}
					
					.line2 {
						font-size: 40rpx;
						font-weight: 900;
						margin-top: 20rpx;
					}
				}
				
				.right {
					position: relative;
					font-size: 28rpx;
					width: 120rpx;
					height: 52rpx;
					line-height: 52rpx;
					text-align: center;
					border-radius: 8rpx;
					background: #fff;
					font-weight: 700;
				}
			}
			
			.content_box {
				margin-top: 40rpx;
				
				.title {
					font-size: 36rpx;
					font-weight: 700;
				}
				
				.list_box {
					.item {
						padding: 32rpx 0;
						border-bottom: 2rpx solid rgba(240, 240, 240, 1);
						
						.line {
							display: flex;
							align-items: center;
							justify-content: space-between;
							font-size: 28rpx;
							line-height: 52rpx;
							
							.bold {
								font-size: 32rpx;
								font-weight: 700;
							}
						}
					}
				}
				
				.be_empty {
					font-size: 28rpx;
					color: #999;
					text-align: center;
					padding: 40rpx 0;
				}
			}
		}
	}
</style>

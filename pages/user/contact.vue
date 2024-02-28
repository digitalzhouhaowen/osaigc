<template>
	<view class="page_content">
		<u-navbar @leftClick="navBack" :leftIconSize="16" leftIconColor="#fff" :title="navbarTitle" :titleStyle="navbarTitleStyle" :bgColor="navbarBg" :placeholder="true" />
		<view class="main_content">
			<view class="task_box box_bg">
				<view class="title_box">
					<image class="image1" src="/static/images/arrow.png" mode="widthFix"></image>
					<text class="text">联系信息</text>
					<image class="image2" src="/static/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="item_box">
					<view class="item" v-for="(item, index) in taskList" :key="item.id">
						<view class="texts">
							<text class="text1">{{ item.text }}</text>
							<text class="text2">{{ item.value }}</text>
						</view>
						<view class="button" @click="copyText(item.value)">复制</view>
					</view>
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
				navbarTitle: '',
				navbarBg: '#262626',
				navbarTitleStyle: {
					color: '#fff',
					fontWeight: 'bold'
				},
				taskList: [
					{ id: 1, text: '手机号', value: '' },
					{ id: 2, text: '邮箱', value: '' },
					{ id: 3, text: '微信号', value: '' },
				],
			}
		},
		computed: {
			...mapGetters("app", ["config"])
		},
		onLoad() {
			this.taskList[0].value = this.config.system.mobile
			this.taskList[1].value = this.config.system.email
			this.taskList[2].value = this.config.system.wechat
		},
		methods: {
			copyText(info) {
				// #ifndef H5
				uni.setClipboardData({
					data: info,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				});
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
			
			.box_bg {
				border-radius: 20rpx;
				padding: 40rpx 32rpx 48rpx 32rpx;
				border: 2rpx solid #96948C;
				background: linear-gradient(225deg, #3D3D3B 0%, #2F2D2D 100%);
				box-shadow: 0 0 16rpx 0rpx rgba(#000, 0.2);
			}
			
			.task_box {
				margin-top: 32rpx;
				
				.item_box {
					.item {
						height: 100rpx;
						border-radius: 20rpx;
						background: #42403E;
						padding: 24rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-weight: bold;
						margin-bottom: 16rpx;
						
						&:last-child {
							margin-bottom: 0;
						}
						
						.texts {
							flex: 1;
							margin-right: 40rpx;
							font-size: 28rpx;
							color: #FAD9B4;
							display: flex;
							align-items: center;
							justify-content: space-between;
						}
						
						.button {
							width: 140rpx;
							height: 56rpx;
							line-height: 56rpx;
							border-radius: 50rpx;
							background: #F3D2A6;
							text-align: center;
							font-size: 28rpx;
							color: #3A3A38;
						}
					}
				}
			}
		}
	}
</style>

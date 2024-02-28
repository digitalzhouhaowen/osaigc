<template>
	<view class="page_container page_bg">
		<image class="bg" :src="imageData[0].image" mode=""></image>
		<view class="page_content">
			<view class="head_content">
				<u-navbar @leftClick="navBack" :leftIconSize="16" leftIconColor="#fff" :title="navbarTitle" :titleStyle="navbarTitleStyle" :bgColor="navbarBg" :placeholder="true" />
			</view>
			<view class="main_content">
				<u-swiper :list="imageData" keyName="image" :height="512" previousMargin="60rpx" nextMargin="60rpx" circular :autoplay="false" radius="5" bgColor="transparent" @change="imageChange" @click="imageClick"></u-swiper>
				<view class="card_box" v-if="imageData[0].nickname">
					<view class="title">作者</view>
					<view class="userinfo">
						<view class="avatar">
							<image class="image" :src="imageData[0].avatar" mode="aspectFill"></image>
						</view>
						<view class="nickname">{{ imageData[0].nickname }}</view>
					</view>
				</view>
				<view class="card_box">
					<view class="title">创作灵感</view>
					<view class="desc">{{ imageData[0].desc }}</view>
				</view>
				<view class="card_box">
					<view class="title">尺寸</view>
					<view class="desc">{{ imageData[0].width }} X {{ imageData[0].height }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbarTitle: '查看图片',
				navbarBg: 'rgba(255, 255, 255, 0)',
				navbarTitleStyle: {
					color: '#fff',
					fontWeight: 'bold'
				},
				imageData: [],
				imageCurrent: 0
			}
		},
		computed: {
			
		},
		onLoad(options) {
			if(options && options.d) {
				this.imageData = JSON.parse(decodeURIComponent(options.d))
			}
		},
		methods: {
			imageChange(e) {
				this.imageCurrent = e.current
			},
			imageClick() {
				const urls = this.imageData.map(item => item.image)
				uni.previewImage({
					urls,
					current: this.imageCurrent
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_container {
		overflow: hidden;
		
		.bg {
			width: 110%;
			height: 110%;
			filter: blur(80rpx);
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
	
	.page_content {
		.main_content {
			overflow-y: auto;
			padding: 40rpx 0 60rpx 0;
			
			.card_box {
				width: calc(100% );
				border-radius: 20rpx;
				margin: 40rpx auto 0;
				box-shadow: 0 0 20rpx 0 rgba(102, 102, 102, 0.15);
				background: rgba(0, 0, 0, 0.2);
				padding: 40rpx;
				color: #fff;
				
				.title {
					font-size: 28rpx;
					font-weight: 700;
					margin-bottom: 20rpx;
				}
				
				.desc {
					font-size: 32rpx;
				}
				
				.userinfo {
					display: flex;
					align-items: center;
					
					.avatar {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						overflow: hidden;
						margin-right: 20rpx;
						
						.image {
							width: 100%;
							height: 100%;
						}
					}
					
					.nickname {
						font-size: 28rpx;
					}
				}
			}
		}
	}
</style>

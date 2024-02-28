<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="navbarTitle" color="#000"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="title">{{ detail.title }}</view>
			<view class="author">
				<image class="image" src="/static/images/robot.png" mode="aspectFill"></image>
				<text class="name">{{ detail.user_name }}</text>
				<text class="date">{{ detail.updatetime }}</text>
			</view>
			<u-parse  :content="detail.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbarTitle: 'AIGC教程',
				detail: ''
			}
		},
		onLoad(options) {
			options && options.id && this.getPageData(options.id)
		},
		methods: {
			getPageData(id) {
				this.$request('case.detail', { id }).then(res => {
					if(res.code === 1) {
						this.detail = res.data
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			width: 100%;
			overflow-y: auto;
			padding: 40rpx 40rpx 60rpx 40rpx;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
			}
			
			.author {
				margin: 40rpx 0;
				display: flex;
				align-items: center;
				
				.image {
					width: 48rpx;
					height: 48rpx;
					border-radius: 50%;
				}
				
				.name {
					font-size: 28rpx;
					font-weight: bold;
					margin: 0 56rpx 0 12rpx;
				}
				
				.date {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}
</style>

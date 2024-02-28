<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="navbarTitle" color="#000"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="list_box">
				<view class="list_item" v-for="(item, index) in caseList" :key="item.id" @click="jumpView(item.id)">
					<view class="img_box">
						<image class="image" :src="item.image" mode="aspectFill" />
					</view>
					<view class="content_box">
						<view class="line1 u-line-2">{{ item.title }}</view>
						<view class="line2 u-line-1">{{ item.description }}</view>
						<view class="line3 u-flex">
							<view class="line_left">
								<image class="image" src="/static/images/robot.png" mode="aspectFill" />
								<text class="text u-line-1">{{ item.user_name }}</text>
							</view>
							<view class="line_right">
								<image class="image" src="/static/icons/comment.png" mode="widthFix" />
								<text class="text">{{ item.views }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbarTitle: 'AIGC进阶教程',
				caseList: []
			}
		},
		onLoad() {
			this.getPageData()
		},
		methods: {
			getPageData() {
				this.$request('case.list', { flag: '' }).then(res => {
					if(res.code === 1) {
						this.caseList = res.data
					}
				})
			},
			jumpView(id) {
				uni.navigateTo({
					url: `/pages/case/detail?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			overflow-y: auto;
			padding-bottom: 40rpx;
			
			.list_box {
				padding: 0 40rpx;
				
				.list_item {
					padding: 32rpx 0;
					border-bottom: 2rpx solid #E6E6E6;
					display: flex;
					
					&:last-child {
						border-bottom-color: transparent;
					}
					
					.img_box {
						width: 280rpx;
						height: 188rpx;
						margin-right: 32rpx;
						
						.image {
							width: 100%;
							height: 100%;
							border-radius: 24rpx;
							object-fit: cover;
						}
					}
					
					.content_box {
						flex: 1;
						font-size: 24rpx;
						color: #999;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						
						.line1 {
							font-size: 28rpx;
							color: #333;
						}
						
						.line2 {
							
						}
						
						.line3 {
							display: flex;
							align-items: center;
							justify-content: space-between;
							
							.line_left,
							.line_right{
								display: flex;
								align-items: center;
								
								.image {
									width: 32rpx;
									height: 32rpx;
									margin-right: 4rpx;
								}
								
								.text {}
							}
							
							.line_left {
								flex: 1;
								
								.image {
									margin-right: 16rpx;
								}
								
								.text {
									flex: 1;
								}
							}
						}
					}
				}
			}
		}
	}
</style>

<template>
	<view class="page_container page_bg">
		<view class="page_content">
			<view class="head_content">
				<u-navbar @leftClick="navBack" :leftIconSize="16" leftIconColor="#000" :title="navbarTitle" :titleStyle="navbarTitleStyle" :bgColor="navbarBg" :placeholder="true" />
			</view>
			<view class="main_content">
				<view class="atlas_box">
					<view class="wrapper" v-if="atlas.data.length">
						<view class="list">
							<custom-waterfalls-flow ref="waterfallsFlowRef" :value="atlas.data">
								<template v-slot:default="item">
									<view class="item" @click="previewImage(item)">
										<image class="image" :src="item.image" mode="widthFix"></image>
									</view>
								</template>
							</custom-waterfalls-flow>
						</view>
						<view class="status">
							<text v-if="atlas.status == 'loadmore'">加载更多</text>
							<text v-if="atlas.status == 'loading'">加载中...</text>
							<text v-if="atlas.status == 'nomore'">没有更多了</text>
						</view>
					</view>
				</view>
			</view>
			<u-back-top :scroll-top="scrollTop" :duration="500" :customStyle="backTopStyle" :iconStyle="backTopIconStyle"></u-back-top>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbarTitle: '创作广场',
				navbarBg: 'rgba(255, 255, 255, 0)',
				navbarTitleStyle: {
					color: '#000',
					fontWeight: 'bold'
				},
				scrollTop: 0,
				backTopStyle: {
					background: 'rgba(0, 0, 0, 0.5)'
				},
				backTopIconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				atlas: {
					data: [],
					page: 1,
					pagesize: 10,
					status: 'nomore', // loadmore nomore loading
				},
			}
		},
		onPageScroll(e) {
			let colorAlpha = e.scrollTop > 100 ? 1 : e.scrollTop * 0.01
			this.navbarBg = `rgba(236, 247, 255, ${colorAlpha})`
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			this.atlas.page++
			this.getViewWorks()
		},
		onLoad() {
			this.getViewWorks()
		},
		methods: {
			// 查看图片
			previewImage(item) {
				const d = encodeURIComponent(JSON.stringify([item]))
				uni.navigateTo({
					url: '/pages/drawing/preview?d=' + d
				})
			},
			// 获取展示作品
			getViewWorks() {
				this.atlas.status = 'loading'
				this.$request('drawing.piazza', { type: 'list', page: this.atlas.page, pagesize: this.atlas.pagesize }).then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.atlas.data = this.atlas.data.concat(res.data)
							this.atlas.status = 'loadmore'
						} else {
							this.atlas.page != 1 && this.page--
							this.atlas.status = 'nomore'
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page_container {
		height: auto;
	}
	
	.page_content {
		.main_content {
			padding: 20rpx;
			
			.atlas_box {
				.wrapper {
					.list {
						::v-deep .waterfalls-flow {
							.column-value {
								 margin-bottom: 30rpx !important;
								border-radius: 2rpx !important;
								background: transparent !important;
								
								& > .img {
									display: none;
								}
							}
						}
						
						.item {
							border-radius: 2rpx;
							overflow: hidden;
							 background: rgba(0, 0, 0, 0.1);
							
							.image {
								width: 100%;
								border-radius: 10rpx;
							}
							
							.infos {
								// padding: 18rpx 12rpx;
								
								.line {
									display: flex;
									align-items: center;
									font-size: 24rpx;
									color: #fff;
									margin-top:-40px ;
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
										flex: 1;
										
									}
								}
							}
						}
						
						.add {
							width: 100%;
							height: 300rpx;
							border: 4rpx dashed #999;
							border-radius: 20rpx;
							overflow: hidden;
							margin-bottom: 40rpx;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							
							&:active {
								border-color: #424EF2;
							}
							
							.text {
								font-size: 28rpx;
								color: #999;
								margin-top: 20rpx;
							}
						}
					}
					
					.status {
						padding: 20rpx 0;
						text-align: center;
						font-size: 28rpx;
						color: #999;
					}
				}
			}
		}
	}
</style>

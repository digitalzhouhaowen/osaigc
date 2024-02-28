<template>
	<CustomPage>
		<view class="page_container page_bg drawing-task">
			<view class="page_content">
				<view class="head_content">
					<CustomNavbar :title="navbarTitle"></CustomNavbar>
				</view>
				<view class="main_content">
					<view class="list_box">
						<view class="item" v-for="(item, index) in taskData" :key="index" @click="previewImage(item)">
							<view class="text_box">
								<text>ID：{{ item.id }}</text>
								<text v-if="item.status == 1" :class="'status' + item.status">已完成</text>
                  <text v-if="item.status == 0" :class="'status' + item.status">生成中</text>
                  <text v-if="item.status == 2" :class="'status' + item.status">生成失败</text>
							</view>
							<view class="text_box">
								<text class="u-line-2">描述：{{ item.message }}</text>
							</view>
							<view class="text_box">
								<text class="u-line-2">图片数量：{{ item.pic_size }}张</text>
							</view>
							<view class="text_box">
								<text>创建时间：{{ item.createtime }}</text>
							</view>
							<view class="img_list">
								<view class="img" :class="{ 'default': !item.draw_images }" v-for="(img, iIndex) in item.draw_images ? item.draw_images : Number(item.pic_size)" :key="iIndex">
									<image class="image" :src="img.image" mode="aspectFill"></image>
								</view>
							</view>
						</view>
						<view class="status">
							<text v-if="taskStatus == 'loadmore'" @click="loadMoreData">加载更多</text>
							<text v-if="taskStatus == 'loading'">加载中...</text>
							<text v-if="taskStatus == 'nomore'">没有更多了</text>
						</view>
					</view>
				</view>
				<u-back-top :scroll-top="scrollTop" :duration="500" :customStyle="backTopStyle" :iconStyle="backTopIconStyle"></u-back-top>
			</view>
		</view>
	</CustomPage>
</template>

<script>
	export default {
		data() {
			return {
				navbarTitle: '绘画记录',
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
				page: 1,
				pagesize: 10,
				taskData: [],
				taskStatus: "loadmore" // loadmore nomore loading
			}
		},
		onPageScroll(e) {
			let colorAlpha = e.scrollTop > 100 ? 1 : e.scrollTop * 0.01
			this.navbarBg = `rgba(236, 247, 255, ${colorAlpha})`
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			this.loadMoreData()
		},
		onLoad() {
			this.getDrawingTask()
		},
		methods: {
			// 预览图片
			previewImage(item) {
				if(item.status == 1 && item.draw_images && item.draw_images.length) {
					const d = encodeURIComponent(JSON.stringify(item.draw_images))
					uni.navigateTo({
						url: '/pages/drawing/preview?d=' + d
					})
				}
			},
			// 加载更多
			loadMoreData() {
				this.page++
				this.getDrawingTask()
			},
			// 获取绘画任务
			getDrawingTask() {
				this.taskStatus = 'loading'
				this.$request('drawing.task', { page: this.page, pagesize: this.pagesize }).then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.taskData = this.taskData.concat(res.data)
							this.taskStatus = 'loadmore'
						} else {
							this.page != 1 && this.page--
							this.taskStatus = 'nomore'
						}
					} else {
						this.taskStatus = 'nomore'
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_container {

		// height: auto;
		// min-height: 100%;
	}
	
	.page_content {
		.main_content {
			.list_box {
				padding: 40rpx;
          height: 95vh;
          overflow: auto;
				
				.item {

					padding: 40rpx;
					border-radius: 20rpx;
					box-shadow: 0 0 60rpx rgba(102, 102, 102, 0.15);
					margin-bottom: 40rpx;
					background: rgba(0, 0, 0, 0.1);
					
					.text_box {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 20rpx;
						font-size: 28rpx;
						
						.status0 {
							color: #F3B043;
						}
						
						.status1 {
							color: #5BC82D;
						}
						
						.status2 {
							color: #F06D6D;
						}
					}
					
					.img_list {
						display: flex;
						align-items: center;
						overflow-x: auto;
						
						.img {
							flex-shrink: 0;
							width: 120rpx;
							height: 120rpx;
							border-radius: 20rpx;
							overflow: hidden;
							margin-right: 20rpx;
							border: 2rpx solid #eee;
							
							&:last-child {
								margin-right: 0;
							}
							
							&.default {
								background: #999;
							}
							
							.image {
								width: 100%;
								height: 100%;
								object-fit: cover;
							}
						}
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
</style>

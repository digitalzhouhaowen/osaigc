<template>
	<CustomPage>
		<view class="page_container page_bg tool">
			<view class="page_content">
				<view class="head_content">
						<CustomNavbar :title="navbarTitle"></CustomNavbar>
					<view class="tabs_box">
						<u-tabs style="color: #FB7D1D;" :list="contentList" :current="contentCurrent" :activeStyle="tabsActiveStyle" :inactiveStyle="tabsInactiveStyle" lineColor="#FB7D1D" @change="changeContent($event, 1)" />
					</view>
				</view>
				<view class="main_content" v-if="contentList && contentList.length">
					<scroll-view style="height: 100%">
						<swiper style="height: 100%" :skip-hidden-item-layout="true" :current="contentCurrent" @change="changeContent($event, 2)">
							<swiper-item class="swiper_item" v-for="(item, index) in contentList" :key="item.id">
								<view class="swiper_content">
									<view class="item" v-for="(item1, index1) in item.list" :key="index1" @click="jumpView(item1)">
										<view class="img itembox">
											<image class="image" :src="item1.image"></image>
										</view>
										<view class="info itembox">
											<view class="text1 u-line-1">{{ item1.title }}</view>
											<view class="text2 u-line-2">{{ item1.desc }}</view>
										</view>
									</view>
								</view>
							</swiper-item>
						</swiper>
					</scroll-view>
				</view>
			</view>
		</view>
	</CustomPage>
</template>

<script>
	export default {
		data() {
			return {
				navbarTitle: '工具',
				tabsActiveStyle: {
					background: 'linear-gradient(90deg, #2A82E4 0%, #AC33C1 100%)',
					'-webkit-background-clip': 'text',
					background:"#FB7D1D",
					color: 'transparent',
					fontSize: '32rpx',
					fontWeight: 'bold',
				},
				tabsInactiveStyle: {
					color: '#808080'
				},
				contentList: [],
				contentCurrent: 0,
			}
		},
		onLoad(option) {
			this.contentCurrent = option.t
			this.getPageData()
		},
		methods: {
			async getPageData() {
				this.contentList = []
				await (() => {
					return new Promise((resolve, reject) => {
						this.$request('chat.classify').then(res => {
							this.contentList.push({
								id: 0,
								name: '全部',
								list: []
							})
							if(res.code === 1 && res.data.length) {
								res.data.map((item, index) => {
									this.contentList.push({
										id: item.id,
										name: item.title,
										list: []
									})
								})
							}
							resolve(res)
						}).catch(err => {
							reject(err)
						})
					})
				})()
				await (() => {
					return new Promise((resolve, reject) => {
						this.contentList.map((item, index) => {
							this.$request('chat.list', { topic_id: item.id }).then(res => {
								if(res.code === 1 && res.data.length) {
									item.list = res.data
								}
								resolve(res)
							}).catch(err => {
								reject(err)
							})
						})
					})
				})()
			},
			// 切换分类
			changeContent(e, i) {
				this.contentCurrent = i === 1 ? e.index : e.detail.current
			},
			// 跳转页面
			jumpView(item) {
				if(item.is_chat === 1) {
					console.log("进入聊天 - chat");
					const obj = {
						id: item.id,
						title: item.title,
						isChat: true,
						params: {}
					}
					item.extend && item.extend.length && item.extend.map((item1, index1) => {
						obj.params[item1.name] = ""
					})
					uni.navigateTo({
						url: `/pages/helper/write?t=${encodeURIComponent(JSON.stringify(obj))}`
					})
				} else {
					console.log("进入创作 - write");
					uni.navigateTo({
						url: `/pages/tool/info?id=${item.id}`
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.head_content {
			.tabs_box {
				background-color: #fff;
				padding: 0 20rpx 10rpx;
			}
		}
		
		.main_content {
			overflow: hidden;
			background-color: #F8F8F8;
			.swiper_item {
				height: 100%;
				overflow-y: auto;
			}
		}
		.swiper_content{
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
			.item{
				width: 47%;
				height: 140px;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-wrap: wrap;
				.itembox{
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					flex-wrap: wrap;
					.image{
						width: 40px;
						height: 40px;
					}
				}
				.info{
					margin-left: 0;
					.text2 {
						text-indent: 2em;
						font-size: 12px;
						color: #666666;
					}
				}
				
			}
		}
	}
</style>
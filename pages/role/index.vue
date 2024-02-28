<template>
	<CustomPage>
		<view class="page_container page_bg role">
			<view class="page_content">
				<view class="head_content">
					<CustomNavbar :title="navbarTitle"></CustomNavbar>
					<view class="tabs_box">
						<u-tabs :list="contentList" :current="contentCurrent" :activeStyle="tabsActiveStyle" :inactiveStyle="tabsInactiveStyle" lineColor="#4D68E7" @change="changeContent($event, 1)" />
					</view>
				</view>
				<view class="main_content" v-if="contentList && contentList.length">
					<scroll-view style="height: 100%" :refresher-enabled="false">
						<swiper style="height: 100%" :skip-hidden-item-layout="true" :current="contentCurrent" @change="changeContent($event, 2)" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
							<swiper-item class="swiper_item" v-for="(item, index) in contentList" :key="item.id">
								<view class="swiper_content">
									<view class="item" v-for="(item1, index1) in item.list" :key="index1" @click="jumpView(item1)">
										<view class="img">
											<image class="image" :src="item1.image" mode="aspectFill"></image>
											<!-- <view class="icon">
												<u-icon v-if="item1.isVote == 1" name="star-fill" color="" size="20"></u-icon>
												<u-icon v-else name="star" color="#666" size="20"></u-icon>
											</view> -->
										</view>
										<view class="info">
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
				navbarTitle: '职场助手',
				tabsActiveStyle: {
					background: 'linear-gradient(90deg, #2A82E4 0%, #AC33C1 100%)',
					'-webkit-background-clip': 'text',
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
		onLoad() {
			this.getPageData()
		},
		methods: {
			async getPageData() {
				this.contentList = []
				await (() => {
					return new Promise((resolve, reject) => {
						this.$request('chat.role').then(res => {
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
							this.$request('chat.roleList', { topic_id: item.id }).then(res => {
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
			changeContent(e, i) {
				this.contentCurrent = i === 1 ? e.index : e.detail.current
			},
			swiperTransition(e) {
				
			},
			swiperAnimationfinish(e) {
				
			},
			jumpView(item) {
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
					url: `/pages/helper/role?t=${encodeURIComponent(JSON.stringify(obj))}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.head_content {
			.tabs_box {
				padding: 0 20rpx 10rpx;
			}
		}
		
		.main_content {
			overflow: hidden;

			.swiper_item {
				height: 100%;
				overflow-y: auto;
			}
		}
	}
</style>
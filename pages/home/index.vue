<template>
	<CustomPage>
		<view class="page_container page_bg home" >
			<view class="page_content">
			<!-- 	<div class="head_content">
					<CustomNavbar :left="0" :title="navbarTitle"></CustomNavbar>
				</div> -->
				<view class="main_content">
					
						
					<view class="swiper_box" style="margin-bottom: 20rpx;">
						<u-swiper :list="swiperList" keyName="image" bgColor="transparent" :height="175" :radius="5" :indicator="true" @click="menuItemClicks(swiperList)" @change="change()"/>
					</view>	

					<view class="" v-if="menuList.length" style="margin-bottom: 30rpx;">
						<view class="grid_box">
							<view class="grid_line" v-for="(item, index) in $utils.regroupLength(menuList, 5)" :key="index">
								<view class="grid_item" v-for="(item1, index1) in item" :key="index1" @click="menuItemClick(item1)">
									<view class="img">
										<image class="image" style="width: 42px;height: 42px;border-radius: 50px;" :src="item1.image" mode="aspectFill" />
									</view>
									<view class="text u-line-1">{{ item1.name }}</view>
								</view>
							</view>
						</view>
					</view>
					
					
					<view class="picture_box" v-if="pictureListstyle.length">
						<view class="title_box">
							<view class="left">绘图工具</view>
							<!-- <view class="right" @click="jumpView('/pages/drawing/atlas')">更多 >> </view> -->
						</view>
						<view class="list_box">
							<view class="item"  v-for="(item, index) in pictureListstyle.slice(0, 8)" :key="index" @click="menuItemClick(item)">
								<view style="float: left;position: absolute;z-index:100;width: 200px;text-align: left;margin-left: 10px;margin-top: 15px;"><span style="color: #fff;margin-left: 10rpx;font-weight: 900;font-size: 18px;">{{item.name}}</span></view>
								<view style="float: left;position: absolute;z-index:100;width: 60px;text-align: left;margin-top: 45px;border: 1px solid #fff;text-align: center;border-radius: 20px;margin-left: 15px;line-height: 14px;"><span style="color: #fff;font-weight: 200;font-size: 12px;">{{item.biaoqian}}</span></view>
								
								<view style="float: left;position: absolute;z-index:100;width: 100px;text-align: left;margin-left: 10px;margin-top: 85px;"><image src="https://osaigcimg.su.bcebos.com/uploads/20231104/5c5fdafa075e621aec673c02f302748f.png" style="width: 10px;height: 10px;float: left;margin-left: 10px;margin-top: 8px;"></image><span style="color: #fff;font-weight: 300;font-size: 12px;margin-left: 5rpx;">{{item.weigh}}</span></view>
								<view style="float: left;position: absolute;z-index:50;background-color:#000;width: 100%;opacity: 0.1;height: 200px;"></view>
								<image class="image" :src="item.image" mode="aspectFill"></image>
								
							</view>
						</view>
					</view>
					 
				<!-- 	<view class="case_box">
						<view class="title_box">
							<view class="left">AIGC进阶教程</view>
							<view class="right" @click="jumpView('/pages/case/list')">更多 >> </view>
						</view>
						<view class="list_box">
							<view class="list_item" v-for="(item, index) in caseList" :key="item.id" @click="jumpView(`/pages/case/detail?id=${item.id}`)">
								
								<view class="content_box">
									<view class="line1 u-line-2">{{ item.title }}</view>
									<view class="line2 u-line-1">{{ item.description }}</view>
									<view class="line3 u-flex">
										<view class="line_left">
											<image class="image" src="/static/images/robot.png" mode="aspectFill" />
											<text class="text u-line-1">AIGC实践课程</text>
										</view>
										<view class="line_right">
											<image class="image" src="/static/icons/comment.png" mode="widthFix" />
											<text class="text">{{ item.views }}</text>
										</view>
									</view>
								</view>
								<view class="img_box">
									<image class="image" :src="item.image" mode="aspectFill" />
								</view>
							</view>
						</view>
					</view> -->
					<view class="vip_box" v-if="vipImage">
						<a v-if="vipImageurl" :href="vipImageurl" target="_blank" rel="">
							<image class="image" :src="vipImage" mode="widthFix"/>
						</a>
					</view>
				</view>
				<u-back-top :scroll-top="scrollTop" :duration="500" :customStyle="backTopStyle" :iconStyle="backTopIconStyle"></u-back-top>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<zero-privacy :onNeed="false" :hideTabBar="true"></zero-privacy>
			<!-- #endif -->
		</view>
	</CustomPage>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				navbarTitle: 'OSAIGC智能助理',
				scrollTop: 0,
				backTopStyle: {
					background: 'rgba(0, 0, 0, 0.5)'
				},
				backTopIconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				swiperList: [], // 轮播图
				caseList: [], // 案例新闻
				vipImage: '', // vip充值入口图片
				vipImageurl: '', // vip充值入口图片
				isRecharge: true, // 是否限时充值入口
				isIosPay: this.$store.state.app.iospay, // ios充值入口是否开启
				pictureList: [], // 图片列表
				pictureListstyle:[],
				menuList: [], // 功能菜单
				linkid:0
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["title", "iospay", "theme"]),
		},
		watch: {
			title(newValue, oldValue) {
				this.navbarTitle = newValue
			},
			iospay(newValue, oldValue) {
				this.isIosPay = newValue
				let isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
				if(!this.isIosPay && isIos) {
					this.isRecharge = false
				}
			},
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			this.getPageData()
			this.getPictureListstyle()
			this.getMenuList()
			
			this.navbarTitle = this.title
			
			// #ifdef MP-WEIXIN
			let isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
			if(!this.isIosPay && isIos) {
				this.isRecharge = false
			}
			// #endif
		},
		methods: {
			// 获取功能菜单列表
			getMenuList() {
				this.$request('common.module').then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.menuList = res.data
						}
					}
				})
			},
			// 菜单分类
			
			menuItemClick(item) {
					uni.navigateTo({
						url: item.url
					})
			},
			// 轮播图
			menuItemClicks(swiperList) {
				if(!this.token) {
					uni.showToast({
						title: '请先登录！',
						icon: 'none'
					})
					
					// #ifdef MP-WEIXIN
					const timer = setTimeout(() => {
						uni.switchTab({
							url: '/pages/user/index'
						})
						clearTimeout(timer)
					}, 1500)
					// #endif
					
					return
				}
				let urls = swiperList[this.linkid].url
				uni.navigateTo({
					url: urls
				})
			},
			change(e){
				this.linkid = e
			},
			// 查看图片
			previewImage(item) {
				const d = encodeURIComponent(JSON.stringify([item]))
				uni.navigateTo({
					url: '/pages/drawing/preview?d=' + d
				})
			},
			// 获取展示图片
			getPictureList() {
				this.$request('drawing.piazza', { type: 'index', pagesize: 10 }).then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.pictureList = res.data
						}
					}
				})
			},
			getPictureListstyle() {
				this.$request('drawing.piazzas', {type: 'index' , pagesize: 10 }).then(res => {
					if(res.code === 1) {
						if(res.data) {
							this.pictureListstyle = res.data
							
						}
					}
				})
			},
			// 去充值
			openVip() {
				if(!this.token) {
					uni.showToast({
						title: '请先登录！',
						icon: 'none'
					})
					
					// #ifdef MP-WEIXIN
					const timer = setTimeout(() => {
						uni.switchTab({
							url: '/pages/user/index'
						})
						clearTimeout(timer)
					}, 1500)
					// #endif
					
					return
				}
				this.jumpView(this.vipImageurl)
			},
			// 跳转页面
			jumpView(url) {
				uni.navigateTo({
					url
				})
			},
			// 获取页面中展示内容
			getPageData() {
				this.$request('common.swiper').then(res => {
					if(res.code === 1) {
						this.swiperList = res.data.filter(item => item.name == 'uniappindexfocus')
			
						this.vipImage = res.data.filter(item => item.name == 'uniappindexside')[0].image
						this.vipImageurl = res.data.filter(item => item.name == 'uniappindexside')[0].url
					}
				})
				// this.$request('case.list', { flag: '' }).then(res => {
				// 	if(res.code === 1) {
				// 		this.caseList = res.data
				// 	}
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			// background-color: #F8F8F8;
			background-image: url("@/static/images/bg.png");
			overflow-y: auto;
			padding: 24rpx 40rpx 48rpx 40rpx;
			
			/* #ifdef H5 */
			padding: 10rpx 10rpx 10rpx 10rpx;
			/* #endif */
			
			.grid_box {
				margin: 0 0rpx;
				
				.grid_line {
					display: flex;
					margin-bottom: 20rpx;
					
					&:last-child {
						margin-bottom: 0;
					}
					
					.grid_item {
						
						width: 20%;
						
						.img {
							.image {
								width: 100%;
								height: 100%;
							}
						}
						
						.text {
							font-size: 24rpx;
							// color: #666;
							color: var(--text-color);
							text-align: center;
							margin-top: 10rpx;
							width: 100%;
							padding: 0 8rpx;
						}
					}
				}
			}
			
			.swiper_box {
				// margin: 40rpx 0;
			}
			
			.title_box {
				font-weight: bold;
				// color: #000;
				color: var(--title-color);
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 30rpx;
				
				.left {
					font-size: 32rpx;
					margin-left: 20rpx;
				}
				
				.right {
					margin-right:20rpx ;
					font-size: 24rpx;
				}
			}
			
			.case_box {
				.list_box {
					padding: 0 10rpx;
					
					.list_item {
						width: 96%;
						margin-left: 2%;
						background-color: #fff;
						border-radius: 10rpx;
						padding: 15rpx ;
						margin-top: 10rpx;
						border-bottom: 2rpx solid #E6E6E6;
						display: flex;
						
						&:last-child {
							border-bottom-color: transparent;
						}
						
						.img_box {
							width: 280rpx;
							height: 180rpx;
							margin-left: 32rpx;
							
							.image {
								width: 100%;
								height: 100%;
								border-radius: 10rpx;
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
								font-weight: 600;
								color: #000;
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
			
			.vip_box {
				margin-top: 30rpx;
				
				.image {
					width: 96%;
					margin-left: 2%;
					border-radius: 20rpx;
				}
			}
		
			.picture_box {
				margin-bottom: 40rpx;
				
				.list_box {
					margin: 0 0rpx;
					padding: 0 0rpx;
					display: flex;
					overflow-x: auto;
					flex-wrap: wrap;
					text-align: center;
					.item {
						width: 47%;
						height: 220rpx;
						// flex-shrink: 0;
						margin-top: 5px;
						margin-left: 2%;
						border-radius: 10rpx;
						overflow: hidden;
						opacity: 1;
						position: relative;
						
						// &:last-child {
						// 	margin-right: 0;
						// }
						
						.image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
	}
</style>
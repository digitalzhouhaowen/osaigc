<script>
	// #ifdef APP-PLUS
	import checkappupdate from '@/common/utils/checkappupdate.js'
	import api from '@/common/request/api.js'
	// #endif
	
	import { setSystemStyle } from "@/common/utils/system.js"
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		computed: {
			...mapGetters("app", ["theme"])
		},
		onLaunch: function(options) {
			console.log("App Launch");

			// 切换主题
			options.query.scene && this.setShare({ spm: options.query.scene })
			this.getConfigInfo().then(res => {
				const text = res?.system?.h5_theme
				const theme = text == 'default' ? 'default' : text == 'dark' ? 'dark' : 'default'
				const timer = setTimeout(() => {
					this.setTheme(theme)
					clearTimeout(timer)
				}, 0)
			})
			
			setSystemStyle(this.theme)
			
			// #ifdef APP-PLUS
			// 锁定竖屏模式
			plus.screen.lockOrientation('portrait-primary');
			// app版本检测
			checkappupdate.check({
				api: this.$BASE_URL + api.common.update.url + '?type=android'
			})
			// #endif
			
			// #ifdef MP-WEIXIN
			if(options.scene === 1155) {
				// 朋友圈入口
				if(options.path != 'pages/home/index') {
					uni.switchTab({
						url: '/pages/home/index'
					})
				}
			}
			
			// 小程序更新
			const updateManager = uni.getUpdateManager()
			updateManager.onCheckForUpdate(function (res) {
				// 请求完新版本信息的回调
				console.log(res.hasUpdate, "版本检测");
			})
			updateManager.onUpdateReady(function (res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success: res => {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate()
						}
					}
				})
			})
			updateManager.onUpdateFailed(function (res) {
				// 新版本下载失败
				uni.showModal({
					title: '提示',
					content: '新版小程序下载失败\n请自行退出程序，手动卸载本程序，再运行',
					confirmText: "知道了"
				});
			})
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapActions("app", ["getConfigInfo"]),
			...mapMutations("app", ["setShare", "setTheme"])
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uview-ui/index.scss";
	@import "@/common/style/index.scss";
</style>

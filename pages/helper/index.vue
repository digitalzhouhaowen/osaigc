<template>
	<CustomPage>
		<view class="page_container page_bg helper">
			<view class="page_content">
				<view class="head_content">
					<CustomNavbar :left="0" :title="navbarTitle"></CustomNavbar>
				</view>
				
				<view class="main_content" :class="{ show: !pageLoading }" :style="{ marginBottom: marginBottom * 2 + 'rpx' }">
					<scroll-view style="background-color: #F8F8F8;" class="scroll_view" :scroll-y="true" :scroll-top="scrollTop">
						<view class="message_box">
							<view class="message_list" v-for="(item, index) in dialogue" :key="index">
								<view class="message_item right" v-if="item.message">
									<view class="content">
										<zero-markdown-view :themeColor="themeColor" :markdown="item.message"></zero-markdown-view>
									</view>
									<!-- <view class="avatar">
										<image class="image" src="/static/images/avatar.png" mode="aspectFill"></image>
									</view> -->
								</view>
								<view class="message_item left" v-if="item.response">
									<view class="avatar">
										<image class="image" src="/static/images/avatar.png" mode="aspectFill"></image>
									</view>
									<view class="content">
										<zero-markdown-view :themeColor="themeColor" :markdown="item.response"></zero-markdown-view>
										<view class="tools">
											<view class="item" @click="copyText(item.response)">
												<u-icon name="file-text" color="#666" size="18"></u-icon>
												<text class="text">复制</text>
											</view>
											<!-- #ifdef MP-WEIXIN -->
											<view class="item" v-if="item.id && innerAudioContext" @click="textToVoice(item)">
												<u-icon name="volume" color="#666" size="18"></u-icon>
												<text class="text">{{ item.audio ? '暂停播放' : '语音播报' }}</text>
											</view>
											<!-- #endif -->
											<!-- #ifdef H5 -->
											<view class="item" @click="createChatPoster(item)">
												<u-icon name="photo" color="#666" size="18"></u-icon>
												<text class="text">生成海报</text>
											</view>
											<!-- #endif -->
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="reset_box" v-if="relink && loginStatus" @click="initSocketServe(2)">已断开，点击我重新连接…</view>
					</scroll-view>
					<!-- <view class="tools_view" v-if="modeList.length">
						<view class="item" style="background-color: #FB7D1D !important; color: #fff; padding:5px 10px;"  v-for="(item, index) in modeList" :key="index" @click="modeType = item.type">{{ item.name }}</view>
					</view> -->
					<view class="input_view">
						<view class="box">
							<!-- #ifdef MP-WEIXIN -->
							<view class="icon" @click="voice.show = true">
								<u-icon name="mic" color="#0B0A1A" size="24"></u-icon>
							</view>
							<!-- #endif -->
							<view class="input">
								<textarea class="textarea" v-model="msg" :auto-height="true" :adjust-position="false" :maxlength="-1" :disable-default-padding="true" :show-confirm-bar="false" placeholder="请输入问题" @keyboardheightchange="keyHeightChange"></textarea>
							</view>
							<view class="button">
								<u-button style="background-color: #FB7D1D;color: #fff;border-radius: 15px;padding: 0 10px;height: 30px;" text="发送" :disabled="!socketOpen || loading"  @click="send()" />
							</view>
						</view>
					</view>
				</view>
				<view class="alert_box" v-if="!token && pageLoading">
					<view class="item">
						<text class="text">您还没有登录</text>
						<text class="btn" @click="jumpView('/pages/login/login')">去登录</text>
					</view>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<ChatSharePoster :show="showPoster" :data="posterData" @close="showPoster = false"></ChatSharePoster>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<u-popup :show="voice.show" :round="16" :safeAreaInsetBottom="false" @close="voice.show = false">
				<view class="record_popup_mask" :style="{ paddingBottom: marginBottom * 2 + 'rpx' }">
					<view class="p_head">
						<view class="icon" @click="voice.show = false">
							<u-icon name="arrow-down" color="#666" size="20"></u-icon>
						</view>
					</view>
					<view class="p_main">
						<textarea class="textarea"
							v-model="msg" :disabled="voice.info" :adjust-position="false"
							:maxlength="-1" :disable-default-padding="true"
							:show-confirm-bar="false" :placeholder="voice.placeholder"
							@keyboardheightchange="keyHeightChange" @focus="voice.focus = true" @blur="voice.focus = false">
						</textarea>
					</view>
					<view class="p_footer">
						<view class="tips">{{ voice.tips }}</view>
						<view class="touchs">
							<view class="action">
								<view class="left" v-if="msg" @click="msg = ''">清空</view>
								<view class="center" @longpress="voiceTouchStart" @touchend="voiceTouchEnd">
									<view class="icon">
										<u-icon name="mic" :color="themeStyle.picker[theme]" size="24"></u-icon>
									</view>
								</view>
								<button class="right" v-if="msg" :disabled="!socketOpen || loading" @click="send()">发送</button>
							</view>
							<view class="mask" v-if="voice.record">
								<view class="sounds">
									<view class="item" v-for="(item, index) in 34" :key="index" :style="{ transform: `translateX(${index * 20}rpx)` }"></view>
								</view>
							</view>
						</view>
					</view>
					<view class="info" v-if="voice.info">{{ voice.info }}</view>
				</view>
			</u-popup>
			<!-- #endif -->
		</view>
	</CustomPage>
</template>

<script>
	// #ifdef MP-WEIXIN
	const plugin = requirePlugin("WechatSI")
	const manager = plugin.getRecordRecognitionManager();
	// #endif
	// #ifdef H5
	import ChatSharePoster from '@/components/ChatSharePoster.vue'
	// #endif
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		components: {
			// #ifdef H5
			ChatSharePoster
			// #endif
		},
		data() {
			return {
				navbarTitle: '智能问答',
				buttonStyle: {
					width: '94rpx',
					height: '56rpx',
					border: 'none',
					fontSize: '24rpx',
					color: "#fff",
					background: "linear-gradient(90deg, rgba(42, 130, 228, 1) 0%, rgba(172, 51, 193, 1) 100%)",
					borderRadius: '14rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				themeColor: '#007AFF',
				socketOpen: false, // 连接状态
				msg: '', // 输入框
				dialogue: [], // 记录
				loading: false, // 数据流状态
				relink: false, // 重连
				type: 'chat', // 连接类型
				webSocket: '', // WebSocket服务
				scrollTop: 0, // 滚动距离
				query: '', // 节点信息
				pageLoading: true, // 页面loading
				relinkCount: 0, // 自动重连次数, 5次后自动暂停
				loginStatus: this.$store.state.user.isLogin || false,
				modeList: [],
				modeType: '',
				showPoster: false, // 显示海报
				posterData: {}, // 海报内容
				isIos: uni.getSystemInfoSync().osName == 'ios' ? true : false,
				marginBottom: 0,
				tabbarHeight: 0,
				voice: {
					show: false, // 弹出层
					record: false, // 录音
					tips: '按住说话', // 请按住继续说话
					output: '', // 输出
					placeholder: '请说话...', // 没有识别到文字, 请重新输入...
					info: '', // 提示信息
					timer: 0,
					focus: false
				},
				authRecord: false, // 麦克风授权
				recordTimer: null, // 录音时长
				innerAudioContext: null, // 音频实例上下文
				audioId: '', // 语音播报id
				audioSrc: '', // 语音播报音频
			}
		},
		computed: {
			...mapGetters("user", ["token", "isLogin"]),
			...mapGetters("app", ["wsurl", "appid", "theme", "themeButton", "themeStyle"]),
		},
		watch: {
			isLogin(newValue, oldValue) {
				this.loginStatus = newValue
				if(newValue) {
					this.initSocketServe()
				} else {
					this.webSocket.close()
				}
			},
			relink(newValue, oldValue) {
				if(newValue && this.relinkCount == 5) {
					const relinkTimer = setTimeout(() => {
						this.$nextTick(() => {
							this.scrollTop += 1
						});
						clearTimeout(relinkTimer)
					}, 100)
				}
			},
		},
		onLoad() {
			this.query = uni.createSelectorQuery().in(this)
			this.getModeList()
			// #ifdef MP-WEIXIN || APP-PLUS
			const { screenHeight, windowHeight, statusBarHeight, pixelRatio } = uni.getSystemInfoSync()
			this.tabbarHeight = (screenHeight - windowHeight - statusBarHeight) * pixelRatio
			// #endif
			// #ifdef MP-WEIXIN
			plugin && this.initRecord();
			plugin && this.initAudio()
			// #endif
		},
		onShow() {
			this.loginStatus && !this.socketOpen && this.initSocketServe()
			!this.loginStatus && this.$u.toast("您还没有登录")
			// #ifdef MP-WEIXIN
			!this.authRecord && this.authorizeRecord()
			// #endif
		},
		methods: {
			// 初始化音频组件
			initAudio() {
				// #ifdef MP-WEIXIN
				this.innerAudioContext = uni.createInnerAudioContext();
				this.innerAudioContext.onError(err => {
					uni.showToast({
						title: '语音播放失败',
						icon: 'none'
					})
				})
				this.innerAudioContext.onEnded(() => {
					this.dialogue.map((item, index) => {
						if(this.audioId == item.id) {
							item.audio = false
						}
					})
				})
				// #endif
			},
			// 播放
			audioPlay() {
				this.innerAudioContext.play()
			},
			// 暂停
			audioPause() {
				this.innerAudioContext.pause()
			},
			// 文字转语音
			textToVoice(data, type = 'left') {
				// #ifdef MP-WEIXIN
				if(data.id) {
					if(this.audioId == data.id) {
						this.dialogue.map((item, index) => {
							if(data.id == item.id) {
								item.audio = !item.audio
								item.audio && this.audioPlay()
								!item.audio && this.audioPause()
							}
						})
					} else {
						this.dialogue.map((item, index) => {
							if(data.id == item.id) {
								item.audio = true
								plugin.textToSpeech({
								    lang: "zh_CN",
								    tts: true,
								    content: type == 'left' ? item.response : item.message,
								    success: res => {
								        console.log("success tts =>", res.filename)
										this.audioId = data.id
										this.audioSrc = res.filename
										this.innerAudioContext.src = this.audioSrc
										this.audioPlay()
								    },
								    fail: fail => {
								        console.log("fail tts =>", fail)
										item.audio = false
										this.audioId = ''
										this.audioSrc = ''
										this.innerAudioContext.src = ''
										this.audioPause()
										if(fail.retcode === -20003) {
											uni.showToast({
												title: '文本内容过长',
												icon: 'none'
											})
										} else if(fail.retcode === -40001) {
											uni.showToast({
												title: '接口调用频率达到限制，请联系插件开发者',
												icon: 'none'
											})
										} else {
											uni.showToast({
												title: '文字转语音失败',
												icon: 'none'
											})
										}
								    }
								})
							} else {
								item.audio = false
							}
						})
					}
				}
				// #endif
			},
			// 麦克风授权
			authorizeRecord() {
				// #ifdef MP-WEIXIN
				uni.getSetting({
					success: success => {
						if(success.authSetting["scope.record"]) {
							this.authRecord = true
						} else {
							uni.authorize({
							    scope: 'scope.record',
							    success: () => {
									this.authRecord = true
							    },
								fail: () => {
									uni.showModal({
										title: '授权提示',
										content: '是否重新授权麦克风？',
										success: res => {
											if (res.confirm) {
												uni.openSetting()
											} else if (res.cancel) {}
										}
									})
								}
							})
						}
					}
				})
				// #endif
			},
			// 录音开始
			voiceTouchStart(e) {
				if(!this.authRecord) return this.authorizeRecord()
				this.recordTimer = setInterval(() => {
					this.voice.timer += 10
				}, 10)
				this.voice.record = true
				this.voice.tips = '松开识别文本'
				this.voice.info = '录入中'
				manager.start({
					duration: 60000,
					lang: "zh_CN"
				});
			},
			// 录音结束
			voiceTouchEnd(e) {
				if(!this.authRecord) return
				
				if(this.voice.timer < 2000) {
					uni.showToast({
						title: '说话时间太短',
						icon: 'none'
					})
					this.voice.info = ''
				} else {
					this.voice.info = '识别中'
				}
				this.voice.timer = 0
				clearInterval(this.recordTimer)
				this.voice.record = false
				this.voice.tips = '按住说话'
				manager.stop();
			},
			// 语音组件初始化
			initRecord() {
				// #ifdef MP-WEIXIN
				manager.onStart = res => {
					console.log('onStart', res);
				}
				// 有新的识别内容返回，则会调用此事件  
				manager.onRecognize = res => {
					console.log('onRecognize', res);
				}
				// 识别结束事件
				manager.onStop = res => {
					console.log('onStop', res);
					this.msg += res.result
					this.voice.info = ''
				}
				// 识别错误事件  
				manager.onError = res => {
					console.log('onError', res);
					this.voice.info = ''
					if(res.retcode === -30004) {
						this.voice.placeholder = '没有识别到文字，请重新输入...'
					}
				}
				// #endif
			},
			// 监听键盘高度（微信小程序、APP）
			keyHeightChange(e) {
				const { height } = e.detail
				if(this.isIos) {
					this.marginBottom = height > 0 ? height - this.tabbarHeight : 0
				} else {
					this.marginBottom = height > 0 ? height - 34 : 0
				}
			},
			// 生成对话海报
			createChatPoster(item) {
				this.posterData = item
				this.showPoster = true
			},
			// 模型
			getModeList() {
				this.$request('chat.mode').then(res => {
					if(res.code === 1 && res.data && res.data.length) {
						this.modeList = res.data
						this.modeType = res.data[0].type
					}
				})
			},
			// 复制文本
			copyText(info) {
				uni.setClipboardData({
					data: String(info),
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				});
			},
			// 重置数据
			resetData() {
				this.dialogue = []
				this.msg = ''
				this.loading = false
				this.socketOpen = false
			},
			// 初始化服务 t = 1 自动重连，t = 2 手动重连，t 默认
			initSocketServe(t) {
				if(t) this.relinkCount++
				if(t === 2) {
					this.relinkCount = 0
					uni.showLoading({
						title: '连接中...'
					})
				}
				if(this.socketOpen) return
				if(!t) {
					this.resetData()
					uni.showLoading({
						title: '连接中...'
					})
				}
				const that = this,
					  token = that.$store.state.user.token,
					  type = that.type,
					  domain = that.$store.state.app.wsurl
				let ping = ''
				// 创建连接
				this.webSocket = uni.connectSocket({
					url: `${domain}?type=${type}&token=${token}&sign=${that.$SIGN}`,
					complete: complete => {}
				});
				// 连接打开
				this.webSocket.onOpen(function(res) {
					console.log('WebSocket连接已打开！');
					that.socketOpen = true
					that.relink = false
					that.loading = false
					that.pageLoading = false
					uni.hideLoading()
					
					!t && that.sendMessage({
						type: 'history',
						data: {
							token,
							page: 1
						}
					})
					
					// 设置心跳
					ping = setInterval(() => {
						that.sendMessage({
							type: 'ping',
							data: {
								token
							}
						})
					}, 20 * 1000);
				});
				// 监听错误
				this.webSocket.onError(function(res) {
					console.log('WebSocket连接打开失败，请检查！');
					that.socketOpen = false
					that.relink = true
					that.loading = true
					that.pageLoading = false
					uni.hideLoading()
					clearInterval(ping)
				});
				// 监听连接关闭
				this.webSocket.onClose(function(res) {
					console.log('WebSocket 已关闭！');
					that.socketOpen = false
					that.relink = true
					clearInterval(ping)
					if(that.relinkCount < 5) {
						that.loginStatus && that.initSocketServe(1)
					} else {
						that.loading = true
						that.pageLoading = false
						uni.hideLoading()
					}
				});
				// 接收消息
				this.webSocket.onMessage(function(res) {
					const json = JSON.parse(res.data)
					console.log(json, "接收消息");
					if(json.code != 1) {
						console.log("错误类型：", json.type, "=>", json.msg);
						that.dialogue.push({
							message: '',
							response: json.msg
						})
						that.loading = false
						that.pageLoading = false
						uni.hideLoading()
						
						const timer1 = setTimeout(() => {
							that.$nextTick(() => {
								that.scrollTop += 1000
							});
							clearTimeout(timer1)
						}, 100)
						return
					}
					if(json.type === 'message_list') {
						json.data.message_list.map((item, index) => {
							that.dialogue.push({
								id: item.id,
								message: item.message,
								response: item.response,
								audio: false
							})
						})
						
						const timer2 = setTimeout(() => {
							that.$nextTick(() => {
								that.query.select('.message_box').boundingClientRect(data => {
									that.scrollTop = data.height + 999999
								}).exec()
								
								that.pageLoading = false
								uni.hideLoading()
							});
							clearTimeout(timer2)
						}, 500)
					} else if(json.type === 'message_stream') {
						if(json.msg == 'data: [DONE]') {
							that.loading = false
							json.msg_id && (that.dialogue[that.dialogue.length - 1].id = Number(json.msg_id))
						} else {
							that.dialogue[that.dialogue.length - 1].response += json.msg
						}
						
						const timer3 = setTimeout(() => {
							that.$nextTick(() => {
								that.scrollTop += 1
							});
							clearTimeout(timer3)
						}, 100)
					}
				});
			},
			// 发送消息
			sendMessage(data) {
				console.log(data, "发送消息");
				this.socketOpen && this.webSocket.send({
					data: JSON.stringify(data)
				})
			},
			// 检测敏感信息
			sensitiveWord(message) {
				return new Promise((resolve, reject) => {
					this.$request('chat.checkMsg', {
						message,
						is_wx: 1
					}, false).then(res => {
						if(res.code === 0) resolve(false)
						else resolve(true)
					}).catch(err => {
						resolve(true)
					})
				})
			},
			// 点击发送
			async send() {
				if(!this.socketOpen || this.loading || !this.msg) {
					if(!this.socketOpen) {
						uni.showToast({
							title: '连接已断开',
							icon: 'none',
							duration: 2000
						})
					}
					if(this.loading) {
						uni.showToast({
							title: '正在回复中',
							icon: 'none',
							duration: 2000
						})
					}
					if(!this.msg) {
						uni.showToast({
							title: '输入内容为空',
							icon: 'none',
							duration: 2000
						})
					}
					console.log("未连接 || 正在回复 || 输入内容为空");
					// return
				}
				const verify = await this.sensitiveWord(this.msg)
				if(!verify) {
					this.msg = ""
					uni.showToast({
						title: '系统检测到敏感信息',
						icon: 'none',
						duration: 2000
					})
					return
				}
				const message = this.msg
				this.msg = ''
				this.voice.show = false
				this.loading = true
				message && this.dialogue.push({
					id: '',
					message,
					response: '',
					audio: false
				})
				const timer = setTimeout(() => {
					this.$nextTick(() => {
						this.scrollTop += 1
					});
					clearTimeout(timer)
				}, 100)
				this.sendMessage({
					type: this.type,
					data: {
						token: this.$store.state.user.token
					},
					message,
					mode: this.modeType
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {

		&.loading {
			position: relative;
			
			&::before {
				content: "";
				width: 100%;
				height: 100%;
				background: rgba(#F8F8F9, 1);
				position: absolute;
				top: 0;
				left: 0;
				z-index: 10;
			}
		}

		.main_content {
			
			overflow: hidden;
			position: relative;
			display: flex;
			flex-direction: column;
			opacity: 0;
			transition: opacity 0.3s;
			
			&.show {
				opacity: 1;
			}
			
			&.loading {
				position: relative;
				
				&::before {
					content: "";
					width: 100%;
					height: 100%;
					background: #0B0A1A;
					position: absolute;
					top: 0;
					left: 0;
					z-index: 10;
				}
			}
			
			.tools_view {
				position: absolute;
				bottom: 130rpx;
				right: 30rpx;
				display: flex;
				align-items: center;
				
				
				.item {
					padding: 10rpx;
					border-radius: 50rpx;
					font-size: 28rpx;
					margin-right: 20rpx;
					color: #666;
			
					
					&:last-child {
						margin-right: 0;
					}
					
					&.active {
						color: #fff;
					}
				}
			}
			
			.scroll_view {
				flex: 1;
				min-height: 0;
				padding: 0 30rpx;
				
				.message_box {
					padding-top: 30rpx;
					
					.message_item {
						display: flex;
						flex-wrap: nowrap;
						padding-bottom: 60rpx;
						
						&.left {
							justify-content: flex-start;
							padding-bottom: 80rpx;
							
							.avatar {
								margin-right: 20rpx;
							}
							
							.content {
								color: #000;
								border-radius: 0 20rpx 20rpx;
								background: #fff;
							}
						}
						
						&.right {
							justify-content: flex-end;
							
							.avatar {
								margin-left: 20rpx;
							}
							
							.content {
								color: #fff;
								border-radius: 20rpx 0 20rpx 20rpx;
								background: #FB7D1D;
							}
						}
						
						.avatar {
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							overflow: hidden;
							background: #E0E0E0;
							margin-top: 4rpx;
							
							.image {
								width: 100%;
								height: 100%;
							}
						}
						
						.content {
							max-width: calc(100% - 160rpx);
							position: relative;
				
							.tools {
								position: absolute;
								bottom: -16rpx;
								left: 0;
								transform: translateY(100%);
								display: flex;
								align-items: center;
								
								.item {
									margin-right: 10rpx;
									display: flex;
									align-items: center;
									
									&:last-child {
										margin-right: 0;
									}
									
									.text {
										font-size: 28rpx;
										color: #666;
										white-space: nowrap;
									}
								}
							}
						}
					}
				}
				
				.reset_box {
					text-align: center;
					color: #666;
					font-size: 28rpx;
					padding-bottom: 48rpx;
				}
			}
			
			.input_view {
				padding: 20rpx 30rpx;
				background-color: #F8F8F8;
				.box {
					min-height: 84rpx;
					display: flex;
					align-items: center;
					background: #fff;
					border-radius: 20rpx;
					position: relative;
					
					/* #ifdef MP-WEIXIN */
					padding: 12rpx 124rpx 12rpx 100rpx;
					/* #endif */
					
					/* #ifndef MP-WEIXIN */
					padding: 12rpx 124rpx 12rpx 0rpx;
					/* #endif */
					
					.icon {
						position: absolute;
						bottom: 42rpx;
						left: 30rpx;
						transform: translateY(50%);

						&::before {
							content: "";
							width: 4rpx;
							height: 26rpx;
							border-radius: 4rpx;
							background: #666;
							position: absolute;
							bottom: 50%;
							left: 70rpx;
							transform: translateY(50%);
						}
					}
					
					.input {
						flex: 1;
						
						.textarea {
							width: 100%;
							min-width: 0;
							background: transparent;
							font-size: 28rpx;
							padding: 0 20rpx 0 30rpx;
							height: 48rpx;
							max-height: 184rpx;
						}
					}
					
					.button {
						position: absolute;
						bottom: 42rpx;
						right: 30rpx;
						transform: translateY(50%);
						// background-color: #FB7D1D;
						
					}
					
					/deep/ .uni-textarea-wrapper {
						max-height: 180rpx;
					}
				}
			}
		}
	}
</style>

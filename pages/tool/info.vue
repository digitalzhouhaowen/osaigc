<template>
	<CustomPage>
		<view class="page_container page_bg tool-info">
			<view class="page_content">
				<CustomNavbar :title="navbarTitle"></CustomNavbar>
				<view class="main_content">
					<view class="item_box">
						<view class="img">
							<image class="image" :src="classifyData.image" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="text1 u-line-1">{{ classifyData.title }}</view>
							<view class="text2 u-line-2">{{ classifyData.desc }}</view>
						</view>
					</view>
					<view class="title">表单填写</view>
					<view class="form_box">
						<view class="form_line" v-for="(item, index) in inputList" :key="index">
							<view class="label" :class="{ require: item.require }">{{ item.title }}</view>
							<block v-if="item.field === 'string'">
								<view class="box">
									<input class="input" type="text" v-model="item.value" :placeholder="item.tip" placeholder-class="placeholder">
								</view>
							</block>
							<block v-if="item.field === 'number'">
								<view class="box">
									<input class="input" type="number" v-model="item.value" :placeholder="item.tip" placeholder-class="placeholder">
								</view>
							</block>
							<block v-if="item.field === 'textarea'">
								<view class="box">
									<textarea class="textarea" v-model="item.value" :maxlength="-1" :disable-default-padding="true" :placeholder="item.tip" placeholder-class="placeholder" />
								</view>
							</block>
							<block v-if="item.field === 'select'">
								<view class="box" @click="pickerShow(index)">
									<!-- <input class="input" type="text" :value="item.value" :placeholder="item.tip" placeholder-class="placeholder" disabled> -->
									<view class="select">{{ item.value }}</view>
									<image class="image" src="/static/icons/arrow_down.png" mode="widthFix"></image>
								</view>
								<u-picker :show="item.selectsShow" :columns="item.selects" keyName="name" :closeOnClickOverlay="true" @close="pickerHide(index)" @cancel="pickerHide(index)" @confirm="pickerConfirm($event, index)"></u-picker>
							</block>
						</view>
					</view>
					<view class="title">模型</view>
					<view class="tools_view" v-if="modeList.length">
						<view class="item" :class="{ active: modeType == item.type }" v-for="(item, index) in modeList" :key="index" @click="modeType = item.type">{{ item.name }}</view>
					</view>
				</view>
				<view class="footer_content">
					<view class="button_box">
						<u-button text="取消填写" :customStyle="buttonStyleDisable" @click="navBack" />
						<u-button text="立即开始" :customStyle="{ ...buttonStyle, ...themeButton.chat[theme] }" @click="submitHandle" />
					</view>
					<u-safe-bottom></u-safe-bottom>
				</view>
			</view>
		</view>
	</CustomPage>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				navbarTitle: '问答准备',
				buttonStyleDisable: {
					width: '284rpx',
					height: '80rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#fff',
					background: '#E0E0E0',
					borderRadius: '14rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonStyle: {
					width: '360rpx',
					height: '80rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#fff',
					background: 'linear-gradient(90deg, rgba(42, 130, 228, 1) 0%, rgba(172, 51, 193, 1) 100%)',
					borderRadius: '14rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				classifyData: {
					id: '',
					title: '',
					desc: '',
					image: ''
				},
				inputList: [],
				modeList: [],
				modeType: ''
			}
		},
		computed: {
			...mapGetters("user", ["token"]),
			...mapGetters("app", ["theme", "themeButton"])
		},
		onLoad(option) {
			option && option.id && this.getPageData(option.id)
			this.getModeList()
		},
		methods: {
			// 模型
			getModeList() {
				this.$request('chat.mode').then(res => {
					if(res.code === 1 && res.data && res.data.length) {
						this.modeList = res.data
						this.modeType = res.data[0].type
					}
				})
			},
			getPageData(id) {
				this.$request('chat.detail', { prompt_id: id }).then(res => {
					if(res.code === 1) {
						const { id, title, image, desc } = res.data
						this.classifyData = { id, title, image, desc }
						res.data.extend.map((item, index) => {
							item.selectsShow = false
							if(item.selects && item.selects.length) {
								const arr = [[]]
								item.selects.map((item1, index1) => {
									arr[0].push({
										id: index1 + 1,
										name: item1
									})
								})
								item.selects = arr
							}
						})
						res.data.extend[res.data.extend.length - 1].require = 0
						this.inputList = res.data.extend
					}
				})
			},
			pickerShow(index) {
				this.inputList[index].selectsShow = true
			},
			pickerHide(index) {
				this.inputList[index].selectsShow = false
			},
			pickerConfirm(e, index) {
				this.inputList[index].value = e.value[0].name
				this.inputList[index].selectsShow = false
			},
			submitHandle() {
				if(!this.token) {
					uni.showModal({
						title: '系统提示',
						content: '本操作需要您进行登录验证',
						success: function(res) {
							if(res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							}
						}
					})
					return
				}
				const arr = []
				const obj = {
					id: this.classifyData.id,
					title: this.classifyData.title,
					params: {},
					message: '',
					isChat: false,
					mode: this.modeType
				}
				this.inputList.map((item, index) => {
					if(item.require == 1 && !item.value) {
						this.$u.toast(`${item.title} 必填项为空!`)
						arr.push(item.title)
						return
					} else {
						obj.params[item.name] = item.value
						if(item.value) {
							obj.message += `${item.title}: ${item.value} \n\n`
						}
					}
				})
				
				if(!arr.length) {
					uni.navigateTo({
						url: `/pages/helper/write?t=${encodeURIComponent(JSON.stringify(obj))}`
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.tools_view {
			display: flex;
			align-items: center;
			
			.item {
				padding: 10rpx;
				border-radius: 50rpx;
				font-size: 28rpx;
				margin-right: 20rpx;
				
				&:last-child {
					margin-right: 0;
				}
				
				&.active {}
			}
		}
		
		.main_content {
			overflow-y: auto;
			padding: 24rpx 40rpx 200rpx 40rpx;
			
			.item_box {
				background: #fff;
				border-radius: 20rpx;
				padding: 24rpx 30rpx;
				display: flex;
				align-items: center;
				
				.img {
					width: 96rpx;
					height: 96rpx;
					border-radius: 50%;
					overflow: hidden;
					
					.image {
						width: 100%;
						height: 100%;
					}
				}
				
				.info {
					flex: 1;
					margin-left: 32rpx;
					font-size: 28rpx;
					color: #000;
					
					.text1 {
						font-weight: bold;
					}
					
					.text2 {
						margin-top: 8rpx;
					}
				}
			}
		
			.title {
				font-size: 32rpx;
				font-weight: bold;
				margin: 40rpx 0;
			}
			
			.form_box {
				border-radius: 24rpx;
				background: #fff;
				padding: 40rpx;
				margin-bottom: 40rpx;
				
				.form_line {
					margin-bottom: 32rpx;
					
					&:last-child {
						margin-bottom: 0;
					}
					
					.label {
						font-size: 28rpx;
						font-weight: bold;
						color: #000;
						position: relative;
						
						&.require {
							&::before {
								content: "*";
								position: absolute;
								top: 0;
								left: -20rpx;
								color: red;
							}
						}
					}
					
					.box {
						position: relative;
						border-bottom: 1rpx solid #ccc;
						
						.input {
							height: auto;
							font-size: 28rpx;
							font-weight: bold;
							color: #000;
							padding: 20rpx 0;
						}
						
						.textarea {
							width: 100%;
							height: 160rpx;
							resize: none;
							font-size: 28rpx;
							font-weight: bold;
							color: #000;
							padding: 20rpx 0;
						}
						
						.select {
							height: 80rpx;
							font-size: 28rpx;
							font-weight: bold;
							color: #000;
							padding: 20rpx 0;
						}
						
						.image {
							width: 20rpx;
							position: absolute;
							top: 50%;
							right: 0;
							transform: translateY(-50%);
						}
					}
				}
			}
		}
	
		.footer_content {
			width: 100%;
			background: #fff;
			box-shadow: 0 4rpx 20rpx 0 rgba(#000, 0.2);
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 1;

			.button_box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx 40rpx;
			}
		}
	}
</style>

<template>
	<view class="page_content">
		<view class="head_content">
			<u-navbar @leftClick="navBack" :leftIconSize="16" leftIconColor="#000" :title="navbarTitle" :titleStyle="navbarTitleStyle" :bgColor="navbarBg" :placeholder="true" />
		</view>
		<view class="main_content">
			<u-parse :content="info.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbarTitle: '',
				navbarBg: '#fff',
				navbarTitleStyle: {
					color: '#000',
					fontWeight: 'bold'
				},
				options: '',
				info: ''
			}
		},
		onLoad(options) {
			if(options && options.d) {
				this.options = JSON.parse(decodeURIComponent(options.d))
				this.navbarTitle = this.options.title
				this.getRichText()
			}
		},
		methods: {
			getRichText() {
				this.$request('common.richtext', {
					id: this.options.id
				}).then(res => {
					if(res.code === 1) {
						this.info = res.data
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main_content {
		overflow-y: auto;
		padding: 40rpx;
	}
</style>

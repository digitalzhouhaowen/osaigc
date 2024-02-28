<template>
	<view :class="themeSkin" :style="themeStyles">
	    <slot></slot>
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		name: "CustomPage",
		data() {
			return {
				
			};
		},
		computed: {
			...mapGetters("app", ["theme", "themeStyle"]),
			themeSkin() {
				return this.theme + '-theme'
			},
			themeStyles() {
				return this.themeStyle[this.theme]
			}
		}
	}
</script>

<style>

</style>
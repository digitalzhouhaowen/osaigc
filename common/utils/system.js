/**
 * 切换系统样式
*/
const setSystemStyle = type => {
	const tabbarList = [
		{
			"pagePath": "pages/home/index",
			"text": "首页",
			"iconPath": `static/tabbar/home_default_${type}.png`,
			"selectedIconPath": `static/tabbar/home_selected_${type}.png`
		},
		{
			"pagePath": "pages/tool/index",
			"text": "工具",
			"iconPath": `static/tabbar/tool_default_${type}.png`,
			"selectedIconPath": `static/tabbar/tool_selected_${type}.png`
		},
		{
			"pagePath": "pages/helper/index",
			"text": "助手",
			"iconPath": `static/tabbar/helper_default_${type}.png`,
			"selectedIconPath": `static/tabbar/helper_selected_${type}.png`
		},
		{
			"pagePath": "pages/user/index",
			"text": "我的",
			"iconPath": `static/tabbar/user_default_${type}.png`,
			"selectedIconPath": `static/tabbar/user_selected_${type}.png`
		}
	]
	
	tabbarList.forEach((item, index) => {
		uni.setTabBarItem({
			index,
			iconPath: item.iconPath,
			selectedIconPath: item.selectedIconPath
		})
	})
	
	if(type == 'default') {
		uni.setTabBarStyle({
			color: "#666666",
			selectedColor: "#000000",
			backgroundColor: "#ffffff",
			borderStyle: "black"
		})
		
		uni.setNavigationBarColor({
			frontColor: "#000000",
			backgroundColor: "#ffffff"
		})
	}
	
	if(type == 'dark') {
		uni.setTabBarStyle({
			color: "#9D9DA3",
			selectedColor: "#ffffff",
			backgroundColor: "#0B0A1A",
			borderStyle: "white"
		})
		
		uni.setNavigationBarColor({
			frontColor: "#ffffff",
			backgroundColor: "#000000"
		})
	}
}

export { setSystemStyle }
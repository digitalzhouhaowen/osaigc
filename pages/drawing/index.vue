<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="navbarTitle"></CustomNavbar>
			<!-- <u-navbar @leftClick="navBack" :leftIconSize="16" leftIconColor="#fff" :title="navbarTitle" :titleStyle="navbarTitleStyle" :bgColor="navbarBg" :placeholder="true" /> -->
		</view>
		<view class="main_content">
			<view class="tabs_wrapper">
				<view class="tabs_item" v-if="item.mode != 'img2txt'" :class="{ active: tabsActive.id == item.id }" v-for="(item, index) in tabsData" :key="index" @click="changeCurrentTabsId(item.id, item.mode)">
					<text class="text">{{ item.text }}</text>
				</view>
			</view>
			<view class="content_wrapper">
				<view class="card_title" style="padding: 0;" v-if="tabsActive.mode == 'img2img' || tabsActive.mode == 'img2huanlian' || tabsActive.mode == 'img2gq'">
					<text v-if="tabsActive.mode == 'img2img'" class="text">参考图</text>
            <text v-if="tabsActive.mode == 'img2huanlian'" class="text">人物图片(A图)</text>
            <text v-if="tabsActive.mode == 'img2gq'" class="text">待修复图片</text>
				</view>
				<view class="card_box bg3" v-if="tabsActive.mode == 'img2img' || tabsActive.mode == 'img2huanlian' || tabsActive.mode == 'img2gq'">
					<view class="refer_box">
						<view class="picture" v-if="picture.image" @click="picture.show = true">
							<image class="image" :src="picture.image" mode="aspectFit"></image>
						</view>
						<view class="add" v-else @click="picture.show = true">
							<image class="image" :src="`${IMG_URL}/icons/camera.png`" mode="widthFix"></image>
							<view class="text">上传图片</view>
						</view>
					</view>
				</view>
          <view class="card_title" style="padding: 0;" v-if="tabsActive.mode == 'img2huanlian'">
              <text class="text">素材脸图 (B图)</text>
          </view>
          <view class="card_box bg3" v-if="tabsActive.mode == 'img2huanlian'">
              <view class="refer_box">
                  <view class="picture" v-if="picture2.image" @click="picture2.show = true">
                      <image class="image" :src="picture2.image" mode="aspectFit"></image>
                  </view>
                  <view class="add" v-else @click="picture2.show = true">
                      <image class="image" :src="`${IMG_URL}/icons/camera.png`" mode="widthFix"></image>
                      <view class="text">上传图片</view>
                  </view>
              </view>
          </view>
        
            <div class="contrast" v-if="(tabsActive.mode == 'img2huanlian' || tabsActive.mode == 'img2gq') && is_hd == 2"  :class="{ hide: is_hd == 1 }" >
              <!--                <div class="contrast"  >-->
              <div :style="{width:imgWidth+'px',height:imgHeight+'px'}" class="container">
                  <div :style="{width:beforWidth+'%'}" class="img-box img-before">
                      <img :src="picture.image">
                      <span v-if="tabsActive.mode == 'img2huanlian'" style="font-size: 14px" :class="{ hide: left_word == 1 }" class="word_befor">换脸前</span>
                      <span v-if="tabsActive.mode == 'img2gq'" style="font-size: 14px" :class="{ hide: left_word == 1 }" class="word_befor">修复前</span>
                  </div>
                  <div class="img-box img-after">
                      <img :src="imgHD">
                      <span v-if="tabsActive.mode == 'img2huanlian'" style="font-size: 14px" :class="{ hide: right_word == 1 }" class="word_after" :style="{left:hd_left+'%'}">换脸后</span>
                      <span v-if="tabsActive.mode == 'img2gq'" style="font-size: 14px" :class="{ hide: right_word == 1 }" class="word_after" :style="{left:hd_left+'%'}">修复后</span>
                  </div>
                  <el-slider v-if="(tabsActive.mode == 'img2huanlian' || tabsActive.mode == 'img2gq') && is_hd == 2" v-model="beforWidth" :show-tooltip="false"></el-slider>
                  <div :style="{left:beforWidth+'%'}" class="btn" /></div>
              </div>
			</div>
			<view v-if="tabsActive.mode == 'img2huanlian'">
			      <p style="font-size: 14px;color: #777">*说明：点击生成后会将B图的脸融合到A图中</p>
			      <p style="font-size: 14px;color: #777">该图片可以在<span style="color: red">我的/绘画记录</span>中查看下载</p>
			  </view>
		        <view class="card_box bg1" v-if="tabsActive.mode == 'img2img' || tabsActive.mode == 'text2img' || tabsActive.mode == 'artqr' ">
					<view class="card_title">
						<text class="text">输入您所描述的画面</text>
					</view>
					<view class="desc">
						<textarea class="textarea" style="color: #000" v-model="descValue" maxlength="1000" :disable-default-padding="true" placeholder="支持中英文描述，注意不要在此填入内容敏感词!否则会被封号"></textarea>
						<view class="action">
							<view class="count">
								<text class="text1">{{ descValue.length }}</text>
								<text class="text2">/1000</text>
							</view>
							<view class="clear" @click="descValue = ''">
								<image class="image" :src="`${IMG_URL}/icons/clear.png`" mode=""></image>
							</view>
						</view>
					</view>
				</view>
				  <view class="card_box artqr" v-if="tabsActive.mode == 'artqr'">
					  <text class="text">输入要生成的二维码地址</text>
					  <u-input type="text" style="margin-top:5px" v-model="qr_url"  placeholder="https://www.osaigc.com" ></u-input>
					  <view style="margin-top: 20px">
						  <image v-if="qr_img != ''" :src="qr_img" mode="widthFix" style="width:100%"></image>
					  </view>
					  <view v-if="qr_img != ''" style="font-size: 14px">该二维码可以在<span style="color: red">我的/绘画记录</span>中查看</view>
				  </view>
		  <view class="card_box bg2" v-if="(tabsActive.mode == 'img2img' || tabsActive.mode == 'text2img')">
				<view class="card_title">
				<text class="text">模型选择</text>
				</view>
				<view class="text_box">
					<view class="list" >
						<view class="item" :class="{ active: img_type == 2 }"  @click="bedeckItemClick(2)">专业画质SD</view>
						<view class="item" :class="{ active: img_type == 1 }" @click="bedeckItemClick(1)">超高画质MJ</view>
					</view>
				</view>
		  </view>
				<view class="card_box bg2" v-if="(tabsActive.mode == 'img2img' || tabsActive.mode == 'text2img') && img_type==1">
					<view class="card_title">
						<!-- <image class="icon1" :src="`${IMG_URL}/icons/style.png`" mode="widthFix"></image> -->
						<text class="text">选择风格</text>
						<!-- <image class="icon2" :src="`${IMG_URL}/icons/star.png`" mode="widthFix"></image> -->
					</view>
					<view class="img_box">
						<view class="list" v-for="(item, index) in afreshRegroup(styleData, 8)" :key="index">
							<view class="item" :class="{ active: styleActiveId == val.id }" v-for="(val, vIndex) in item" :key="vIndex" @click="styleActiveId = val.id">
								<view class="img">
									<image class="image" :src="val.image" mode=""></image>
								</view>
								<view class="text u-line-1">{{ val.text }}</view>
							</view>
						</view>
					</view>
				</view>
			<view class="card_box bg2" v-if="(tabsActive.mode == 'img2img' || tabsActive.mode == 'text2img') && img_type==2">
				<view class="card_title">
					<!-- <image class="icon1" :src="`${IMG_URL}/icons/style.png`" mode="widthFix"></image> -->
					<text class="text">选择风格</text>
					<!-- <image class="icon2" :src="`${IMG_URL}/icons/star.png`" mode="widthFix"></image> -->
				</view>
				<view class="img_box">
					<view class="list" v-for="(item, index) in afreshRegroup(styleData2, 8)" :key="index">
						<view class="item" :class="{ active: styleActiveId == val.id }" v-for="(val, vIndex) in item" :key="vIndex" @click="styleActiveId = val.id">
							<view class="img">
								<image class="image" :src="val.image" mode=""></image>
							</view>
							<view class="text u-line-1">{{ val.text }}</view>
						</view>
					</view>
				</view>
			</view>
				<!-- <view class="card_box bg2">
					<view class="card_title">
						<image class="icon1" :src="`${IMG_URL}/icons/drawing_tabs_2.png`" mode="widthFix"></image>
						<text class="text">艺术家</text>
						<image class="icon2" :src="`${IMG_URL}/icons/star.png`" mode="widthFix"></image>
					</view>
					<view class="text_box">
						<view class="list" v-for="(item, index) in afreshRegroup(artistData, 6)" :key="index">
							<view class="item" :class="{ active: artistActiveId == val.id }" v-for="(val, vIndex) in item" :key="vIndex" @click="artistActiveId = val.id">{{ val.text }}</view>
						</view>
					</view>
				</view> -->
				<view class="card_box bg2" v-if="tabsActive.mode == 'img2img' || tabsActive.mode == 'text2img'">
					<view class="card_title">
						<!-- <image class="icon1" :src="`${IMG_URL}/icons/size.png`" mode="widthFix"></image> -->
						<text class="text">图片尺寸</text>
						<!-- <image class="icon2" :src="`${IMG_URL}/icons/star.png`" mode="widthFix"></image> -->
					</view>
					<view class="size_box">
						<view class="list" v-for="(item, index) in afreshRegroup(sizeData, 6)" :key="index">
							<view class="item" :class="{ active: sizeActiveId == val.id }" v-for="(val, vIndex) in item" :key="vIndex" @click="sizeActiveId = val.id">
								<view class="box">
									<!-- <view class="line" :style="[legendSize({ w: val.w, h: val.h })]"></view> -->
									<view class="text">{{ val.text }}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="card_box bg2" v-if="tabsActive.mode == 'img2img' || tabsActive.mode == 'text2img'">
					<view class="card_title">
						<!-- <image class="icon1" :src="`${IMG_URL}/icons/drawing_tabs_2.png`" mode="widthFix"></image> -->
						<text class="text">图片数量</text>
						<!-- <image class="icon2" :src="`${IMG_URL}/icons/star.png`" mode="widthFix"></image> -->
					</view>
					<view class="text_box">
						<view class="list" v-for="(item, index) in afreshRegroup(countData, 6)" :key="index">
							<view class="items" :class="{ active: countActiveId == val.id }" v-for="(val, vIndex) in item" :key="vIndex" @click="countActiveId = val.id">{{ val.text }}</view>
						</view>
					</view>
				</view>
				<view class="button_box" v-if="(tabsActive.mode == 'img2img' || tabsActive.mode == 'text2img') && img_type == 1">
					<view class="item" :class="{ active: speedActiveIndex == index }" v-for="(item, index) in speedData" :key="index" @click="speedActiveIndex = index">{{ item.text }}({{ item.usable }}积分)</view>
				</view>
				<view class="button_box" v-if="(tabsActive.mode == 'img2img' || tabsActive.mode == 'text2img') && img_type == 2">
					<view style="font-size:14px;color:#7851ec">*每张消耗25积分，会员免费</view>
				</view>
			</view>
			<view style="text-align:center;font-size:14px;margin-bottom:20px"> <a href="/#/pages/drawing/task">我的绘画记录</a></view>
			<view class="submit">
		 <u-button v-if="tabsActive.mode == 'img2img' || tabsActive.mode == 'text2img'" text="生成画作" :loading="buttonLoading" :customStyle="buttonStyle" @click="submitDrawingInfo" />
         <u-button v-if="tabsActive.mode == 'artqr'" :loading="buttonLoading" :customStyle="buttonStyle" text="生成二维码" @click="sub_artqr" />
         <u-button v-if="tabsActive.mode == 'img2huanlian'" :loading="buttonLoading" :customStyle="buttonStyle" text="开始换脸" @click="sub_face" />
          <u-button v-if="tabsActive.mode == 'img2gq' && is_hd == 1" :loading="buttonLoading" :customStyle="buttonStyle" text="开始修复" @click="sub_hd" />
          <u-button v-if="tabsActive.mode == 'img2gq' && is_hd == 2" :loading="buttonLoading" :customStyle="buttonStyle" text="再次修复" @click="sub_hd_re(imgHD)" />
		 
      </view>
			
		<u-action-sheet :show="picture.show" :actions="picture.type" :round="10" cancelText="取消" :closeOnClickOverlay="true" :safeAreaInsetBottom="false" @close="picture.show = false" @select="addPictureSelect"></u-action-sheet>	
		<u-popup :show="picture.typeId == 1 || picture.typeId == 2" :round="20" :closeable="true" :safeAreaInsetBottom="false" @close="picture.typeId = 0">
				<view class="atlas_popup">
					<view class="title">
						<text class="text">{{ picture.typeId == 1 ? '我的作品' : '本地图片' }}</text>
						<u-icon class="icon" :class="{ active: refresh }" name="reload" color="#666" size="24" @click="refreshGallery"></u-icon>
					</view>
					<scroll-view class="scroll_view" :scroll-y="true" @scrolltolower="loadMorePicture">
						<view class="wrapper">
							<view class="list">
								<view class="add" v-if="picture.typeId == 2" @click="uploadLocalPicture(1)">
									<u-icon name="plus" color="#999" size="28"></u-icon>
									<text class="text">添加图片</text>
								</view>
								
								<custom-waterfalls-flow ref="waterfallsFlowRef" :value="picture.typeId == 1 ? works.data : local.data" @wapperClick="wapperClick">
									<!-- #ifdef MP-WEIXIN -->
									<view class="item" :class="{ active: picture.imageId == item.id }" v-for="(item, index) in (picture.typeId == 1 ? works.data : local.data)" :key="index" slot="slot{{index}}">
										<image class="image" :src="item.image" mode="widthFix"></image>
									</view>
									<!-- #endif -->
									<!-- #ifndef MP-WEIXIN -->
									<template v-slot:default="item">
										<view class="item" :class="{ active: picture.imageId == item.id }">
											<image class="image" :src="item.image" mode="widthFix"></image>
										</view>
									</template>
									<!-- #endif -->
								</custom-waterfalls-flow>
							</view>
							
							<view class="status" v-if="picture.typeId == 1 && works.data.length">
								<text v-if="works.status == 'loadmore'" @click="loadMorePicture">加载更多</text>
								<text v-if="works.status == 'loading'">加载中...</text>
								<text v-if="works.status == 'nomore'">没有更多了</text>
							</view>
							
							<view class="status" v-if="picture.typeId == 2 && local.data.length">
								<text v-if="local.status == 'loadmore'" @click="loadMorePicture">加载更多</text>
								<text v-if="local.status == 'loading'">加载中...</text>
								<text v-if="local.status == 'nomore'">没有更多了</text>
							</view>
						</view>
					</scroll-view>
					<view class="confirm_button" v-if="picture.imageId" @click="picture.typeId = 0">确定</view>
				</view>
			</u-popup>

        <u-action-sheet :show="picture2.show" :actions="picture2.type" :round="10" cancelText="取消" :closeOnClickOverlay="true" :safeAreaInsetBottom="false" @close="picture2.show = false" @select="addPictureSelect2"></u-action-sheet>

        <u-popup :show="picture2.typeId == 1 || picture2.typeId == 2" :round="20" :closeable="true" :safeAreaInsetBottom="false" @close="picture2.typeId = 0">
            <view class="atlas_popup">
                <view class="title">
                    <text class="text">{{ picture2.typeId == 1 ? '我的作品' : '本地图片' }}</text>
                    <u-icon class="icon" :class="{ active: refresh2 }" name="reload" color="#666" size="24" @click="refreshGallery2"></u-icon>
                </view>
                <scroll-view class="scroll_view" :scroll-y="true" @scrolltolower="loadMorePicture2">
                    <view class="wrapper">
                        <view class="list">
                            <view class="add" v-if="picture2.typeId == 2" @click="uploadLocalPicture(2)">
                                <u-icon name="plus" color="#999" size="28"></u-icon>
                                <text class="text">添加图片</text>
                            </view>

                            <custom-waterfalls-flow ref="waterfallsFlowRef2" :value="picture2.typeId == 1 ? works2.data : local2.data" @wapperClick="wapperClick2">
                                <!-- #ifdef MP-WEIXIN -->
                                <view class="item" :class="{ active: picture2.imageId == item.id }" v-for="(item, index) in (picture2.typeId == 1 ? works2.data : local2.data)" :key="index" slot="slot{{index}}">
                                    <image class="image" :src="item.image" mode="widthFix"></image>
                                </view>
                                <!-- #endif -->
                                <!-- #ifndef MP-WEIXIN -->
                                <template v-slot:default="item">
                                    <view class="item" :class="{ active: picture2.imageId == item.id }">
                                        <image class="image" :src="item.image" mode="widthFix"></image>
                                    </view>
                                </template>
                                <!-- #endif -->
                            </custom-waterfalls-flow>
                        </view>

                        <view class="status" v-if="picture2.typeId == 1 && works2.data.length">
                            <text v-if="works2.status == 'loadmore'" @click="loadMorePicture2">加载更多</text>
                            <text v-if="works2.status == 'loading'">加载中...</text>
                            <text v-if="works2.status == 'nomore'">没有更多了</text>
                        </view>

                        <view class="status" v-if="picture2.typeId == 2 && local2.data.length">
                            <text v-if="local2.status == 'loadmore'" @click="loadMorePicture2">加载更多</text>
                            <text v-if="local2.status == 'loading'">加载中...</text>
                            <text v-if="local2.status == 'nomore'">没有更多了</text>
                        </view>
                    </view>
                </scroll-view>
                <view class="confirm_button" v-if="picture2.imageId" @click="picture2.typeId = 0">确定</view>
            </view>
        </u-popup>

    </view>
	</view>
</template>

<script>
	import api from "@/common/request/api.js"
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
    import UInput from "../../uview-ui/components/u--input/u--input";
    import UImage from "../../uview-ui/components/u--image/u--image";
	export default {
      components: {UImage, UInput},
      data() {
			return {
				img_type:2,
				navbarTitle: 'AI绘画',
				// navbarBg: 'rgba(255, 255, 255, 0)',
				// navbarTitleStyle: {
				// 	color: '#000',
				// 	fontWeight: 'bold',
				// },
				buttonStyle: {
					width: '100%',
					height: '100%',
					border: 'none',
					fontSize: '28rpx',
					color: '#fff',
                    background:'rgb(120, 81, 236)',
					borderRadius: '30rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonLoading: false,
				// 类型
				tabsData: [],
				tabsActive: {
					id: "1",
					mode: "text2img"
				},
				// 描述词汇
				descValue: "",
				// 风格
				styleData: [
					{ id: 0, text: '不限定', image: `https://www.osaigc.com/pc/img/style_default.1faa1bec.png` }
				],
				styleData2: [
					{ id: 0, text: '不限定', image: `https://www.osaigc.com/pc/img/style_default.1faa1bec.png` }
				],
				styleActiveId: 0,
				// 艺术家
				artistData: [{ id: 0, text: "不限定" }],
				artistActiveId: 0,
				// 修饰词
				bedeckData: [],
				// 图片尺寸
				sizeData: [],
				sizeActiveId: 0,
				// 图片数量
				countData: [],
				countActiveId: 0,
				// 清晰度按钮
				buttonData: [
					{ id: 1, text: '高清' },
					{ id: 2, text: '超高清' }
				],
				buttonActiveId: 1,
				// 生成速度
				speedData: [],
				speedActiveIndex: 0,
				// 参考图
				picture: {
					show: false,
					imageId: 0,
					image: '',
					type: [
						{ id: 1, name: '我的作品' },
						{ id: 2, name: '本地图片' },
					],
					typeId: 0
				},
				picture2: {
					  show: false,
					  imageId: 0,
					  image: '',
					  type: [
						  { id: 1, name: '我的作品' },
						  { id: 2, name: '本地图片' },
					  ],
					  typeId: 0
				},
				// 作品图库
				works: {
					data: [],
					page: 1,
					pagesize: 10,
					status: "loadmore" // loadmore nomore loading
				},
          works2: {
              data: [],
              page: 1,
              pagesize: 10,
              status: "loadmore" // loadmore nomore loading
          },
				// 本地图库
				local: {
					data: [],
					page: 1,
					pagesize: 10,
					status: "loadmore" // loadmore nomore loading
				},
          local2: {
              data: [],
              page: 1,
              pagesize: 10,
              status: "loadmore" // loadmore nomore loading
          },
				// 刷新图库
				refresh: false,
          refresh2: false,
				IMG_URL: this.$IMG_URL,
          //艺术二维码
          qr_url:'',
          qr_img:'',
          //换脸
          imgHD:'',
          imgWidth: 0,
          imgHeight: 0,
          beforWidth: 50,
          is_hd:1,
          hd_left:50,
          left_word:2,
          right_word:2
			}
		},
      watch:{
          beforWidth(newVal, oldVal) {
              if(newVal < 10){
                  this.left_word = 1

              }else{
                  this.left_word = 2
              }
              if(newVal > 90){
                  this.right_word = 1
              }else{
                  this.right_word = 2
              }
              this.hd_left = newVal;
              // console.log(`当前值为：${newVal}`);


          },
      },
		computed: {
			...mapGetters("user", ["token", "isLogin"]),
			// 图例尺寸
			legendSize() {
				return item => {
					const size = this.$utils.sizePicture(true, item.w, item.h, 30)
					return {
						width: size.w * 2  + "rpx",
						height: size.h * 2 + "rpx"
					}
				}
			},
			// 计算重新分组
			afreshRegroup() {
				return (data, len) => {
					let result = []
					if(data.length > len) {
						result = this.$utils.regroupAmount(data, 2)
					} else {
						result = [data]
					}
					return result
				}
			}
		},
		onLoad(option) {
			console.log(option)
			option.t && (this.tabsActive.mode = option.t)
			option.d && (this.tabsActive.id = option.d)
			this.getDrawingClassify()
			this.getDrawingRecord()
			this.getUploadMatter()
			this.getDrawingRecord2()
			this.getUploadMatter2()
		},
		onReady() {
			
		},
		onShow() {
			// uni.setTabBarStyle({
			// 	color: '#999',
			// 	selectedColor: '#fff',
			// 	backgroundColor: '#0A0C13',
			// 	borderStyle: 'black'
			// })
		},
		onHide() {
			// uni.setTabBarStyle({
			// 	color: '#666',
			// 	selectedColor: '#000',
			// 	backgroundColor: '#fff',
			// 	borderStyle: 'white'
			// })
		},
		methods: {
			// 装饰词点击
			bedeckItemClick(id) {
				this.img_type = id;
			},
			// 刷新图库
			refreshGallery() {
				if(!this.refresh) {
					this.refresh = true
					const timer = setTimeout(() => {
						this.refresh = false
						clearTimeout(timer)
					}, 1000)
					if(this.picture.typeId == 1) {
						this.works.page = 1
						this.works.data = []
						this.getDrawingRecord('refresh')
					} else {
						this.local.page = 1
						this.local.data = []
						this.getUploadMatter('refresh')
					}
					this.picture.imageId = 0
					this.picture.image = ''
				}
			},
        refreshGallery2() {

            if(!this.refresh2) {
                this.refresh2 = true
                const timer = setTimeout(() => {
                    this.refresh2 = false
                    clearTimeout(timer)
                }, 1000)
                if(this.picture2.typeId == 1) {
                    this.works2.page = 1
                    this.works2.data = []
                    this.getDrawingRecord2('refresh')
                } else {
                    this.local2.page = 1
                    this.local2.data = []
                    this.getUploadMatter2('refresh')
                }
                this.picture2.imageId = 0
                this.picture2.image = ''
            }
            console.log(this.refresh2);
        },
			// 上传本地图片
			uploadLocalPicture(ids) {
				uni.chooseImage({
					success: chooseImageRes => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.showLoading({
							title: '上传中...'
						})
						uni.uploadFile({
							url: this.$BASE_URL + api.common.upload.url, //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							header: {
								Token: this.$store.state.user.token
							},
							formData: {
								is_user_image: 1
							},
							success: uploadFileRes => {
								const res = JSON.parse(uploadFileRes.data)
								if(res.code === 1) {
									const time = new Date().getTime()
									this.local.data.unshift({
										id: "local_" + time,
										image: res.data.fullurl
									})
									if(ids==1){
										this.$refs.waterfallsFlowRef.refresh();
									}else{
										this.$refs.waterfallsFlowRef2.refresh();
									}
									
								} else {
									this.$u.toast(res.msg)
								}
								uni.hideLoading()
							},
							fail: fail => {
								this.$u.toast("上传失败，请稍后再试")
								uni.hideLoading()
							}
						});
					}
				});
			},
			// 选择图片
			wapperClick(item) {
				this.picture.imageId = item.id
				this.picture.image = item.image
			},
        wapperClick2(item) {
            this.picture2.imageId = item.id
            this.picture2.image = item.image
        },
			// 加载更多图片 触底 / 点击
			loadMorePicture() {
				if(this.picture.typeId == 1) {
					this.works.page++
					this.getDrawingRecord()
				} else if(this.picture.typeId == 2) {
					this.local.page++
					this.getUploadMatter()
				}
			},
        loadMorePicture2() {
            if(this.picture2.typeId == 1) {
                this.works2.page++
                this.getDrawingRecord2()
            } else if(this.picture2.typeId == 2) {
                this.local2.page++
                this.getUploadMatter2()
            }
        },
			// 获取我上传的素材
			getUploadMatter(val) {
				this.local.status = "loading"
				this.$request('drawing.matter', { page: this.local.page, pagesize: this.local.pagesize }).then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.local.data = this.local.data.concat(res.data.map(({ id, fullimage }) => ({ id, image: fullimage })))
							this.local.status = "loadmore"

						} else {
							this.local.page != 1 && this.local.page--
							this.local.status = "nomore"

						}
					}
					val == 'refresh' && this.$refs.waterfallsFlowRef.refresh();
				})
			},
        getUploadMatter2(val) {
            this.local2.status = "loading"
            this.$request('drawing.matter', { page: this.local2.page, pagesize: this.local2.pagesize }).then(res => {
                if(res.code === 1) {
                    if(res.data && res.data.length) {
                        this.local2.data = this.local2.data.concat(res.data.map(({ id, fullimage }) => ({ id, image: fullimage })))
                        this.local2.status = "loadmore"

                    } else {
                        this.local2.page != 1 && this.local2.page--
                        this.local2.status = "nomore"

                    }
                }
                val == 'refresh' && this.$refs.waterfallsFlowRef2.refresh();
            })
        },
			// 获取我的绘画记录
			getDrawingRecord(val) {
				this.works.status = "loading"
				this.$request('drawing.record', { page: this.works.page, pagesize: this.works.pagesize }).then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.works.data = this.works.data.concat(res.data.map(({ id, image }) => ({ id, image })))
							this.works.status = "loadmore"
                
						} else {
							this.works.page != 1 && this.works.page--
							this.works.status = "nomore"
               
						}
					}
					val == 'refresh' && this.$refs.waterfallsFlowRef.refresh();
				})
			},
        getDrawingRecord2(val) {
            this.works2.status = "loading"
            this.$request('drawing.record', { page: this.works2.page, pagesize: this.works2.pagesize }).then(res => {
                if(res.code === 1) {
                    if(res.data && res.data.length) {

                        this.works2.data = this.works2.data.concat(res.data.map(({ id, image }) => ({ id, image })))
                        this.works2.status = "loadmore"
                    } else {

                        this.works2.page != 1 && this.works2.page--
                        this.works2.status = "nomore"
                    }
                }
                val == 'refresh' && this.$refs.waterfallsFlowRef2.refresh();
            })
        },

        //生成艺术二维码
        sub_artqr(){
            if (!this.descValue) {
                this.$u.toast("请输入您的描述词汇")
                return
            }
            if (!this.qr_url) {
                this.$u.toast("请输入您的二维码地址")
                return
            }
            let params = {
                desc: this.descValue,
                linkurl:this.qr_url
            }
            let url = 'drawing.pictureArtqr';
            this.buttonLoading = true
            uni.showLoading({
                title: '努力生成中...'
            })
            console.log(params);
            this.$request(url, params).then(res => {
                console.log(res);
                if(res.code === 1) {
                    this.qr_img = res.data.list;

                }
                this.descValue = ''
                this.buttonLoading = false
                uni.hideLoading()
            }).catch(err => {
                this.descValue = ''
                this.buttonLoading = false
                uni.hideLoading()
            })
        },

        //换脸
        sub_face(){
            this.is_hd = 1
            if (!this.picture.image) {
                this.$u.toast("请上传人物脸图")
                return
            }
            if (!this.picture2.image) {
                this.$u.toast("请上目标脸图")
                return
            }


            var img = new Image(); // 创建一个新的图片对象
            img.src = this.picture.image; // 设置图片源

            var width = img.naturalWidth; // 获取宽度
            var height = img.naturalHeight; // 获取高度
            this.imgWidth = width;
            this.imgHeight = height;
            //图片超过尺寸就等比例缩小
            if(this.imgWidth > this.imgHeight){
                if(this.imgWidth > 358){
                    var tmp =this.imgWidth/358;
                    this.imgWidth = 358;
                    this.imgHeight = this.imgHeight/tmp;
                }
            }else{
                if(this.imgHeight > 358){
                    var tmp =this.imgHeight/358;
                    this.imgHeight = 358;
                    this.imgWidth = this.imgWidth/tmp;
                }

            }

            let params = {
                image_url: this.picture.image,
                face_url: this.picture2.image,
            }
            let url = 'drawing.pictureFace';
            this.buttonLoading = true
            uni.showLoading({
                title: '生成中...'
            })
            this.$request(url, params).then(res => {
                console.log(res);
                if(res.code === 1) {
                    this.imgHD = res.data.list;
                    this.is_hd = 2
                    // this.qr_img = res.data.list;

                }
                this.descValue = ''
                this.buttonLoading = false
                uni.hideLoading()
            }).catch(err => {
                this.descValue = ''
                this.buttonLoading = false
                uni.hideLoading()
            })

        },
        sub_hd_re(url){
            this.sub_hd2(url);
        },
        sub_hd(){
            this.is_hd = 1
            if (!this.picture.image) {
                this.$u.toast("请上传图片")
                return
            }

            var img = new Image(); // 创建一个新的图片对象
            img.src = this.picture.image; // 设置图片源

            var width = img.naturalWidth; // 获取宽度
            var height = img.naturalHeight; // 获取高度
            this.imgWidth = width;
            this.imgHeight = height;
            //图片超过尺寸就等比例缩小
            if(this.imgWidth > this.imgHeight){
                if(this.imgWidth > 358){
                    var tmp =this.imgWidth/358;
                    this.imgWidth = 358;
                    this.imgHeight = this.imgHeight/tmp;
                }
            }else{
                if(this.imgHeight > 358){
                    var tmp =this.imgHeight/358;
                    this.imgHeight = 358;
                    this.imgWidth = this.imgWidth/tmp;
                }

            }
            let params = {
                image_url: this.picture.image,
            }
            let url = 'drawing.pictureHD';
            this.buttonLoading = true
            uni.showLoading({
                title: '生成中...'
            })
            this.$request(url, params).then(res => {
                console.log(res);
                if(res.code === 1) {
                    this.imgHD = res.data.list;
                    this.is_hd = 2
                    // this.qr_img = res.data.list;

                }
                this.descValue = ''
                this.buttonLoading = false
                uni.hideLoading()
            }).catch(err => {
                this.descValue = ''
                this.buttonLoading = false
                uni.hideLoading()
            })
        },
        sub_hd2(img_url){
            this.is_hd = 1
            if (!this.picture.image) {
                this.$u.toast("请上传图片")
                return
            }

            var img = new Image(); // 创建一个新的图片对象
            img.src = this.picture.image; // 设置图片源

            var width = img.naturalWidth; // 获取宽度
            var height = img.naturalHeight; // 获取高度
            this.imgWidth = width;
            this.imgHeight = height;
            //图片超过尺寸就等比例缩小
            if(this.imgWidth > this.imgHeight){
                if(this.imgWidth > 358){
                    var tmp =this.imgWidth/358;
                    this.imgWidth = 358;
                    this.imgHeight = this.imgHeight/tmp;
                }
            }else{
                if(this.imgHeight > 358){
                    var tmp =this.imgHeight/358;
                    this.imgHeight = 358;
                    this.imgWidth = this.imgWidth/tmp;
                }

            }
            let params = {
                image_url: img_url,
            }
            let url = 'drawing.pictureHD';
            this.buttonLoading = true
            uni.showLoading({
                title: '生成中...'
            })
            this.$request(url, params).then(res => {
                console.log(res);
                if(res.code === 1) {
                    this.imgHD = res.data.list;
                    this.is_hd = 2
                    // this.qr_img = res.data.list;

                }
                this.descValue = ''
                this.buttonLoading = false
                uni.hideLoading()
            }).catch(err => {
                this.descValue = ''
                this.buttonLoading = false
                uni.hideLoading()
            })
        },

			// 提交绘图信息
			submitDrawingInfo() {
				if (!this.sizeActiveId || !this.countActiveId) {
					Promise.reject("画布比例或图片数量ID错误 => 异常拦截")
					return
				}
				if (!this.picture.image && this.tabsActive.mode == 'img2img') {
					this.$u.toast("请选择您的参考图片")
					return
				}
				if (!this.descValue) {
					this.$u.toast("请输入您的描述词汇")
					return
				}
				if(!this.speedData[this.speedActiveIndex].type) {
					this.$u.toast("请选择绘画生成速度")
					return
				}
				
				const arr = this.bedeckData.filter(item => item.checked == true).map(item => item.id)
				let params = {
					prompt_id: this.tabsActive.id,
					des: this.descValue,
					neg_prompt: '',
					style: this.styleActiveId,
					artists: this.artistActiveId,
					magic_words: arr.toString() || '',
					pic_size: this.countActiveId,
					scale: this.sizeActiveId,
					mode: this.speedData[this.speedActiveIndex].type,
					img_type:this.img_type
				}
				
				let url = 'drawing.text'
				if(this.tabsActive.mode == 'img2img') {
					params = { ...params, image_url: this.picture.image }
					url = 'drawing.image'
				}
				
				this.buttonLoading = true
				uni.showLoading({
					title: '生成中...'
				})
				
				this.$request(url, params).then(res => {
					if(res.code === 1) {
						uni.showModal({
							title: '提交成功',
							content: '您的绘画任务已提交，稍后请在个人中心查看。',
							confirmText: '知道了',
							showCancel: false,
							success: res => {}
						});
					}
					this.descValue = ''
					this.buttonLoading = false
					uni.hideLoading()
				}).catch(err => {
					this.descValue = ''
					this.buttonLoading = false
					uni.hideLoading()
				})
			},
			// 选择添加图片类型
			addPictureSelect(value) {
				if(value.id == 1) {
					this.picture.typeId = 1
				} else {
					this.picture.typeId = 2
				}
			},
        addPictureSelect2(value) {
            if(value.id == 1) {
                this.picture2.typeId = 1
            } else {
                this.picture2.typeId = 2
            }
        },
			// 更改当前tabsId
			changeCurrentTabsId(id, mode) {
          this.imgHD =''
          this.imgWidth= 0
          this.imgHeight= 0
          this.beforWidth= 50
          this.is_hd=1
          this.hd_left=50
          this.left_word=2
          this.right_word=2
          this.picture.image = ''
          console.log(mode);
				this.tabsActive = { id, mode }
				this.getDrawingConfig()
			},
			// 获取绘画配置
			getDrawingConfig() {
				this.$request('drawing.config', { prompt_id: this.tabsActive.id }).then(res => {
					if(res.code === 1) {
					    res.data.style.length && (this.styleData = this.styleData.concat(res.data.style.map(({ id, image, name }) => ({ id, image, text: name }))))
						res.data.style2.length && (this.styleData2 = this.styleData2.concat(res.data.style2.map(({ id, image, name }) => ({ id, image, text: name }))))
						res.data.magic_words.length && (this.bedeckData = res.data.magic_words.map(({ id, name }) => ({ id, text: name, checked: false })))
						res.data.scale.length && ((this.sizeData = res.data.scale.map(({ id, name }) => ({ id, text: name, w: Number(name.split(":")[0]), h: Number(name.split(":")[1]) }))), (this.sizeActiveId = this.sizeData[0].id))
						res.data.artists.length && (this.artistData = this.artistData.concat(res.data.artists.map(({ id, name }) => ({ id, text: name }))))
						if (res.data.pic_size.length) {
							this.countData = res.data.pic_size.map(({ id, name }) => ({ id, text: name })).reverse()
							const arr = this.countData.filter(item => item.text == 4)
							arr && arr.length && (this.countActiveId = arr[0].id)
						}
						if(res.data.mode.length) {
							this.speedData = res.data.mode.map(({ name, type, usable }, index) => ({ id: index + 1, text: name, type, usable }))
						} else {
							uni.showModal({
								title: '系统提示',
								content: '请前往后台配置绘画信息',
								confirmText: '知道了',
								showCancel: false,
								success: res => {}
							});
						}
					}
				})
			},
			// 获取绘画分类
			getDrawingClassify() {
				this.$request('drawing.classify').then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.tabsData = res.data.map(({ id, title, mode, image }) => ({ id, text: title, mode, image }))
							// this.tabsActive = {
							// 	id: this.tabsData[0].id,
							// 	mode: this.tabsData[0].mode
							// }
							this.getDrawingConfig()
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.head_content{
    color: #000;
}
	.page_content {
		background: #fff;
		position: relative;

		&::before {
			content: "";
			width: 100%;
			height: 100vw;
			position: absolute;
			top: 0;
			left: 0;
			//background: radial-gradient(circle, #d5b9ff, transparent 100%);
		}

		.main_content {
			position: relative;
			overflow-y: auto;
			
			.atlas_popup {
				height: 80vh;
				padding: 30rpx 30rpx 0 30rpx;
				display: flex;
				flex-direction: column;
				position: relative;
				
				.confirm_button {
					width: 40%;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					font-size: 28rpx;
					color: #fff;
					font-weight: 700;
					position: absolute;
					bottom: 60rpx;
					left: 50%;
					transform: translateX(-50%);
					background: rgba(66, 78, 242, 1);
					border-radius: 60rpx;
				}
				
				.title {
					font-size: 32rpx;
					font-weight: 700;
					margin-bottom: 30rpx;
					display: flex;
					align-items: center;
					
					.text {
						margin-right: 10rpx;
					}
					
					.icon {
						&.active {
							animation: rotate 1s linear;
						}
						
						@keyframes rotate{
						    from { transform: rotate(0deg) }
						    to { transform: rotate(360deg) }
						}
					}
				}
				
				.scroll_view {
					flex: 1;
					overflow-y: auto;
					
					.wrapper {
						.list {
							::v-deep .waterfalls-flow {
								.column-value {
									margin-bottom: 30rpx !important;
									
									& > .img {
										display: none;
									}
								}
							}
							
							.item {
								border-radius: 20rpx;
								overflow: hidden;
								border: 4rpx solid #ddd;
								
								&.active {
									border-color: rgb(120, 81, 236);

								}
								
								.image {
									width: 100%;
								}
							}
							
							.add {
								width: 100%;
								height: 300rpx;
								border: 4rpx dashed #999;
								border-radius: 20rpx;
								overflow: hidden;
								margin-bottom: 40rpx;
								display: flex;
								flex-direction: column;
								align-items: center;
								justify-content: center;
								
								&:active {
									border-color: rgb(120, 81, 236);
								}
								
								.text {
									font-size: 28rpx;
									color: #999;
									margin-top: 20rpx;
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
			}
			
			.tabs_wrapper {
				padding: 20rpx;
				display: flex;
				flex-wrap: nowrap;
				overflow-x: auto;
				
				.tabs_item {
					// width: calc((750rpx - 100rpx) / 2);
					padding: 20rpx 30rpx;
					// border: 2rpx solid rgb(120, 81, 236);
					border-radius: 5rpx;
					// margin-right: 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					flex-shrink: 0;
					
					&:last-child {
						margin-right: 0;
					}
					
					&:nth-child(2n-1) {
						.icon {
							background: linear-gradient(145deg, #037BFF, #4DB9FD);
						}
					}
					
					&:nth-child(2n) {
						.icon {
							background: linear-gradient(145deg, #05B7DD, #3EF6FB);
						}
					}

					&.active {
						border-color: rgb(120, 81, 236);
						background: rgba(66, 78, 242, 0.1);
					}
					
					.text {
						color: #000;
						font-size: 32rpx;
						font-weight: bold;
					}
					
					.icon {
						width: 100rpx;
						height: 80rpx;
						border-radius: 20rpx;
						display: flex;
						align-items: flex-end;
						justify-content: flex-end;
						padding: 1rpx;
						
						.img {
							width: 80rpx;
							height: 70rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							background: #0C2440;
							border-radius: 20rpx;
							
							.image {
								width: 50rpx;
								margin: 0 auto;
							}
						}
					}
				}
			}
			
			.content_wrapper {
				padding: 40rpx;
				
				.card_title {
					display: flex;
					align-items: center;
					margin-bottom: 40rpx;
					padding: 0px;
					
					.icon1 {
						width: 30rpx;
					}
					
					.text {
						font-size: 32rpx;
						color: #000;
						font-weight: 700;
						margin: 0 4rpx 0 16rpx;
					}
					
					.icon2 {
						width: 20rpx;
						transform: translateY(-60%);
					}
				}
				
				.card_box {
					    border-radius: 5px;
					    border: 1px solid #7851ec;
					    padding: 10px 5px;
					    margin-bottom: 20px;
					    overflow: hidden;
					&.bg1 {
						background: #fff;
					}
					
					&.bg2 {
						//background: linear-gradient(to right, #031428, #022632);
              background-color: #fff;
					}
					
					&.bg3 {
						background: #fff;
						
						border: 2rpx dashed rgb(120, 81, 236);
						padding: 0;
						height: 280rpx;
						overflow: hidden;
					}

					.desc {
						padding: 0 40rpx;
						
						.textarea {
							width: 100%;
							height: 200rpx;
							font-size: 28rpx;
							color: #000;
							margin-bottom: 20rpx;
							resize: none;
						}
						
						.action {
							display: flex;
							align-items: center;
							justify-content: flex-end;
							
							.count {
								font-size: 28rpx;
								padding-right: 20rpx;
								border-right: 2rpx solid #999;
								
								.text1 {
									color: #000;
								}
								
								.text2 {
									color: #999;
								}
							}
							
							.clear {
								padding-left: 20rpx;
								
								.image {
									width: 40rpx;
									height: 40rpx;
								}
							}
						}
					}
				
					.img_box {
						width: 100%;
						overflow-x: auto;
						padding: 40rpx;
						margin: -40rpx 0;
						
						.list {
							display: inline-block;
							white-space: nowrap;
							margin-bottom: 20rpx;
							
							&:last-child {
								margin-bottom: 0;
							}
							
							.item {
								display: inline-block;
								margin-right: 20rpx;
								
								&:last-child {
									margin-right: 0;
								}
								
								&.active {
									.img {
										box-shadow: 0 0 20rpx 0 rgb(120, 81, 236);
									}
									
									.text {
										color: rgb(120, 81, 236);
									}
								}

								.img {
									width: 120rpx;
									height: 120rpx;
									border-radius: 30rpx;
									margin-bottom: 20rpx;
									overflow: hidden;

									.image {
										width: 100%;
										height: 100%;
										object-fit: cover;
									}
								}
								
								.text {
									font-size: 24rpx;
									font-weight: 700;
									color: #999;
									text-align: center;
								}
							}
						}
					}
					
					.text_box {
						width: 100%;
						overflow-x: auto;
						padding: 40rpx;
						margin: -40rpx 0;
						
						.list {
							display: inline-block;
							white-space: nowrap;
							margin-bottom: 20rpx;
							
							&:last-child {
								margin-bottom: 0;
							}
							
							.item {
								
								
								&:last-child {
									margin-right: 0;
								}
								
								    display: inline-block;
								    margin-right: 10px;
								    overflow: hidden;
								    width: calc((375px - 120px) / 2);
								    height: 30px;
								    line-height: 30px;
								    /* border: 1px solid #7851ec; */
								    border-radius: 8px;
								    text-align: center;
								    font-size: 14px;
								    font-weight: 700;
								    color: #000;
								    background-color: #fff;
								&.active {
									border-color: rgb(120, 81, 236);
									background: rgba(66, 78, 242, 0.1);
								}
							}
							.items {
								
								
								&:last-child {
									margin-right: 0;
								}
								
								    display: inline-block;
								    margin-right: 10px;
								    overflow: hidden;
								    width: calc((375px - 120px) / 4);
								    height: 30px;
								    line-height: 30px;
								    /* border: 1px solid #7851ec; */
								    border-radius: 8px;
								    text-align: center;
								    font-size: 14px;
								    font-weight: 700;
								    color: #000;
								    background-color: #fff;
								&.active {
									border-color: rgb(120, 81, 236);
									background: rgba(66, 78, 242, 0.1);
								}
							}
						}
					}
					
					.size_box {
						width: 100%;
						overflow-x: auto;
						padding: 40rpx;
						margin: -40rpx 0;
						
						.list {
							display: inline-block;
							white-space: nowrap;
							margin-bottom: 20rpx;
							
							&:last-child {
								margin-bottom: 0;
								
								.item {
									&:nth-child(2n-1) {
										.box {
											.line {
												background: #037BFF;
												border-image-source: radial-gradient(60% 60%, transparent 0px, transparent 100%, #45FDFD 100%);
											}
										}
									}
									
									&:nth-child(2n) {
										.box {
											.line {
												background: #45FDFD;
												border-image-source: radial-gradient(60% 60%, transparent 0px, transparent 100%, #037BFF 100%);
											}
										}
									}
								}
							}
							
							.item {
								    display: inline-block;
								    margin-right: 10px;
								    overflow: hidden;
								    width: calc((375px - 100px) / 3);
								    height: 30px;
								    border-radius: 8px;
								    background: #fff;
								    /* border: 1px solid #7851ec; */
								    position: relative;
								
								&:last-child {
									margin-right: 0;
								}
								
								&:nth-child(2n-1) {
									.box {
										.line {
											background: #45FDFD;
											border-image-source: radial-gradient(60% 60%, transparent 0px, transparent 100%, #037BFF 100%);
										}
									}
								}
								
								&:nth-child(2n) {
									.box {
										.line {
											background: #037BFF;
											border-image-source: radial-gradient(60% 60%, transparent 0px, transparent 100%, #45FDFD 100%);
										}
									}
								}
								
								&.active {
									border-color: rgb(120, 81, 236);
									background: rgba(66, 78, 242, 0.1);
								}
								
								.box {
									position: absolute;
									top: 50%;
									left: 50%;
									transform: translate(-50%, -50%);
									display: flex;
									align-items: center;
									justify-content: center;
									
									.line {
										width: 60rpx;
										height: 60rpx;
										margin-right: 20rpx;
										
										border-image-slice: 1;
										border-width: 4rpx;
										border-style: solid;
										border-image-outset: 2;
									}
									
									.text {
										font-size: 28rpx;
										font-weight: 700;
										color: #000;
									}
								}
							}
						}
					}
					
					.refer_box {
						height: 100%;
						
						.picture {
							height: 100%;
							
							.image {
								width: 100%;
								height: 100%;
							}
						}
						
						.add {
							height: 100%;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							
							.image {
								width: 80rpx;
								margin-bottom: 20rpx;
							}
							
							.text {
								font-size: 28rpx;
								color: #000;
								font-weight: 700;
							}
						}
					}
				}
			
				.button_box {
					display: flex;
					justify-content: space-between;
					padding: 20rpx 0;
					
					.item {
						width: calc((100% - 50rpx) / 2);
						height: 80rpx;
						line-height: 72rpx;
						text-align: center;
						border-radius: 100rpx;
						color:#000;
						background-color: #fff;
						border:1px solid #7851ec;
						font-size: 28rpx;
						font-weight: 700;
						overflow: hidden;
					
						background-clip: padding-box, border-box;
						background-origin: padding-box, border-box;
                        
						//background-image: linear-gradient(to right, #2A3643, #2A3643), linear-gradient(170deg, #1579DA, #57E3ED);
						
						&.active {
						
						  color: #fff;
						  background-color: rgb(120, 81, 236);
							//background-image: linear-gradient(to right, #0F80F0, #3CF2FA), linear-gradient(170deg, #1579DA, #57E3ED);

            }
					}
				}
			}
		
			.submit {
				width: 70%;
				height: 100rpx;
				margin: 0 auto 40rpx;
			}
		}
	}
</style>
<style lang="scss" scoped>
.artqr{
    padding:20px !important;
}
.artqr .text{
    font-size: 28rpx;
    color: #000;
    margin-top: 20rpx;
}

::v-deep .el-slider{
    display: flex;
    align-items: center;
    height: 100%;
}
::v-deep .el-slider__runway{
    background: transparent;
}
.contrast {

    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    //background: rgba(0, 0, 0, 0.5);
    z-index: 10;

    .container {
        position: relative;
        //height: 100%;

    }

    .img-box {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        overflow: hidden;

        img {
            // 图片的高最大是容器的 100%，这样保证从左侧平铺
            max-height: 100%;
        }
    }

    .img-before {
        z-index: 1;
        border-right: 2px solid #fff;
    }




    .word_after{
        position: absolute;
        z-index: 4;
        top: 0;
        color: #fff;
    }
    .word_befor{
        position: absolute;
        z-index: 4;
        top: 0;
        color: #fff;
    }

    .btn {
        position: absolute;
        top: 49%;
        z-index: 2;

        &::before {
            content: '';
            position: absolute;
            left: -15px;
            padding: 5px;
            display: inline-block;
            border: solid #fff;
            border-width: 0 2px 2px 0;
            transform: rotate(135deg);
        }

        &::after {
            content: '';
            position: absolute;
            left: 3px;
            padding: 5px;
            display: inline-block;
            border: solid #fff;
            border-width: 0 2px 2px 0;
            transform: rotate(-45deg);
        }
    }
}

</style>
<template>
	<CustomPage>
		<view class="page_container page_bg helper">
			<view class="page_content">
				<!-- <view class="head_content">
					<CustomNavbar :left="0" :title="navbarTitle"></CustomNavbar>
				</view> -->
				<view class="top"><image class="image" :src="`${IMG_URL}/images/hqf.png`" mode="widthFix"></image></view>
        		<view class="main_content">
				
				
				<view v-if="view==1" class="wrap">
					
					<view class="bg1 bg" id="bg1">
					</view>
					<view class="bg2 bg">
					</view>
					<view class="bg3 bg">
					</view>
					<view class="btn">
						<view>
							<text v-if="is_word" @click="startRecording">点击说出指令</text>
						</view>
						<view><text v-if="!is_word" @click="stopRecording">发送指令</text></view>
					</view>
				</view>
				<view v-else-if="view == 2" class="task">
					<u-subsection  mode="subsection" :list="lists" :current="curNow" @change="sectionChange" style="margin-top: 15px;width: 90%;margin-left: 5%;"></u-subsection>
					<view class="list_rw">
						<el-collapse v-model="activeNames" @change="handleChange">
							<el-collapse-item v-for="(item, index) in list_data" >
								<template slot="title">
									<div class="title_temp">
										<div style="width: 70%;overflow-x: hidden;-webkit-line-clamp: 1;height: 50px;">{{item.title}}</div>
										<div>
											<span style="color:blue;" v-if="item.topic_ids == 1&&item.status == 1">进行中</span>
											<span style="color:green;" v-if="item.topic_ids == 2&&item.status == 1">已完成</span>
											<span style="color:red;" v-if="item.status == 2">任务取消</span>
										</div>
									</div>
								</template>
								<div class="command_detail">
									<div>接收人：{{item.department}}-{{item.job}}-{{item.real_name}}</div>
									<div>时间：{{item.createtime}}</div>
									<div>进度：
										<span style="color:blue;" v-if="item.topic_ids == 1&&item.status == 1">进行中</span>
										<span style="color:green;" v-if="item.topic_ids == 2&&item.status == 1">已完成</span>
										<span style="color:red;" v-if="item.status == 2">任务撤销</span>
									</div>
									<button @click="chexiao(item.id)" style="color:#fff;width: 25%;font-size: 14px;background-color:#ff0000;float: right;margin-top: -40px;" v-if="item.topic_ids == 1&&item.status == 1">撤销任务</button>
								</div>
							</el-collapse-item>

						</el-collapse>
					</view>

				</view>
				</view>
				<view class="tap" style="margin-bottom: 50px;font-size: 14px;color: #ccc;">
					<a href="#" v-if="view==1" @click="chengzt(view)" type="info">查看历史任务</a>
					<a href="#" v-if="view==2" @click="chengzt(view)" type="info">语音下发指令</a>
				</view>
				<view class="tap" style="margin-bottom: 50px;font-size: 12px;color: #ccc;">
					<span>*注意：本功能为企业版会员专享</span>
				</view>
				
            </view>
			<u-overlay :show="shows">
				<view style="background-color: #fff;width: 70%;margin-left: 15%;margin-top: 50%;height: 340px;text-align: center;border-radius: 15px;padding: 0px;">
					<u-loading-icon text="正在处理中,请稍后" color="#5af" textSize="18" style="margin-top: 50px;"></u-loading-icon>
					<u-steps current="3" direction="column" style="margin-top: 30px;width: 40%;margin-left: 30%;">
							<u-steps-item title="下达指令" >
							</u-steps-item>
							<u-steps-item title="分析任务" >
							</u-steps-item>
							<u-steps-item title="任务工具生成" >
							</u-steps-item>
							<u-steps-item title="指派任务" >
							</u-steps-item>
							<u-steps-item title="发送成功" desc=""></u-steps-item>
						</u-steps>
						</view>
				</u-overlay>
			</view>
	</CustomPage>
</template>




<script setup>
import axios from 'axios';
export default {
    data() {
        return {
			navbarTitle: '指令助手',
            mediaRecorder: null,
            audioChunks: [],
            audioBlob: null,
            is_word:true,
            descValue:'',
            view:1,
            activeNames: ['1'],
            list_data:[],
			lists: ['待完成', '已完成', '已取消'],
			curNow: 0,
			shows:false

        };
    },
    onLoad() {
        this.list(1)
    },
    methods: {
        handleChange(val) {
            console.log(val);
        },
		sectionChange(index) {
						this.curNow = index;
						 this.list(index+1)
					},
		chengzt(view){
			if(view==1){
				this.view = 2;
			}else{
				this.view = 1;
			}
		},
		chexiao(id){
			let url = 'chat.qx_rw';
			uni.showModal({
				title: '系统提示',
				content: '确定撤销任务吗？',
				confirmText: '确定',
				showCancel: true,
				success: res => {
					if (res.confirm) {
						this.$request(url,{id:id}).then(res => {
						    if(res.code === 1) {
						        this.$u.toast("撤销成功")
								this.list(1)
						    }
						}).catch(err => {
						
						})	
					} 
				}
			})
			
		},
        async startRecording() {
			var rotatingDiv = document.querySelector('.bg1');
			var rotatingDiv2 = document.querySelector('.bg2');
			var rotatingDiv3 = document.querySelector('.bg3');
			var rotatingDivBtn = document.querySelector('.btn');
			rotatingDivBtn.style.backgroundColor = 'blue';
			this.changeSpeed(rotatingDiv);
			this.changeSpeed(rotatingDiv2);
			this.changeSpeed(rotatingDiv3);
            this.is_word = false;
            const stream = await navigator.mediaDevices.getUserMedia({audio: true ,video: false});
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.mediaRecorder.ondataavailable = event => {
                this.audioChunks.push(event.data);
            };
            this.mediaRecorder.start();
        },
        stopRecording() {
			this.shows=true;
			var rotatingDiv = document.querySelector('.bg1');
			var rotatingDiv2 = document.querySelector('.bg2');
			var rotatingDiv3 = document.querySelector('.bg3');
			var rotatingDivBtn = document.querySelector('.btn');
			rotatingDivBtn.style.backgroundColor = '#03a9f4';
			this.changeSpeed2(rotatingDiv);
			this.changeSpeed2(rotatingDiv2);
			this.changeSpeed2(rotatingDiv3);
            this.is_word = true;
            this.mediaRecorder.stop();
			this.mediaRecorder.onerror = (error) => {
			    console.error('MediaRecorder 发生错误:', error);
			    // 执行失败时的函数
			    this.shows=false;
			    this.$u.toast(error)
			};
			this.mediaRecorder.onstop = () => {
					 this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
					 const formData = new FormData();
					 formData.append("file", this.audioBlob, "recording.wav");
					axios.post('https://www.osaigc.com/addons/chatgpt/web/zhiling2', formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
							'Token': this.$store.state.user.token
						},
					}).then(response => {
							this.shows=false;
							this.$u.toast(response.data.msg)
						})
						.catch(error => {
							console.error('上传错误', error);
						});
					const audioURL = URL.createObjectURL(this.audioBlob);
					console.log(audioURL)
					this.audioChunks = [];
				 };
			
        },
        playAudio() {
            if (this.audioBlob) {
                const audioURL = URL.createObjectURL(this.audioBlob);
                this.$refs.audioPlayer.src = audioURL;
            }
        },
        download() {
            if (this.audioBlob) {
                const a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                const url = window.URL.createObjectURL(this.audioBlob);
                a.href = url;
                a.download = 'recording.wav';
                a.click();
                window.URL.revokeObjectURL(url);
            }
        },
        changeSpeed(rotatingDiv){
            var animationStyle = window.getComputedStyle(rotatingDiv).animation;
            console.log(animationStyle.split(' ')[0]);
            var currentDuration = parseFloat(animationStyle.split(' ')[0]);
            var newDuration = currentDuration/2
            rotatingDiv.style.animationDuration = newDuration + 's';
            rotatingDiv.style.backgroundColor = 'blue';
        },
        changeSpeed2(rotatingDiv){
            var animationStyle = window.getComputedStyle(rotatingDiv).animation;
            console.log(animationStyle.split(' ')[0]);
            var currentDuration = parseFloat(animationStyle.split(' ')[0]);
            var newDuration = currentDuration*2
            rotatingDiv.style.animationDuration = newDuration + 's';
            rotatingDiv.style.backgroundColor = '#03a9f4';
        },
        list(index){
            let url = 'chat.rw_list';
            this.$request(url,{is:index}).then(res => {
                if(res.code === 1) {
                    this.list_data = res.data;
                }
            }).catch(err => {
            })
        }
    }
};
</script>
<style>
.top{
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

}
.top .image{
    width: 35%;
}
.tap{
    display: flex;
    align-items: center;
    justify-content: center;
}
.title_temp{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.title_temp .title_temp_one{

}
.tap view{
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.wrap{
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.textarea{
    border: 1px solid #ccc;
    margin: 20px 0 50px 0;
    padding: 0 15px;
    height: 80px;
}
.text{
    top: 20px;
    position: absolute;
    width: 150px;
}
.btn{

    width: 150px;
    height: 150px;
    background-color: #03a9f4;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    z-index:10
}
.bg1{
    position: absolute;
    top: 35%;
    transform: translateY(-50%);
    width: 150px;
    height: 150px;
    background-color: #03a9f4;
    border-radius: 50%;
    z-index: 1;
    opacity: 0.5;
}
.bg2{
    position: absolute;
    top: 35%;
    transform: translateY(-50%);
    width: 150px;
    height: 150px;
    left: 30%;
    background-color: #03a9f4;
    border-radius: 50%;
    z-index: 1;
    opacity: 0.5;
}
.bg3{
    position: absolute;
    top: 35%;
    transform: translateY(-50%);
    width: 150px;
    height: 150px;
    /*left: 30%;*/
    background-color: #03a9f4;
    border-radius: 50%;
    z-index: 1;
    opacity: 0.5;
}
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.bg1 {
    animation: spin 2s linear infinite;
    transform-origin:70px 70px;
}
.bg2 {
    animation: spin 4s linear infinite;
    transform-origin:85px 85px;
}
.bg3 {
    animation: spin 5s linear infinite;
    transform-origin: 77px 82px;
}
.progress{
    padding: 50px 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
<style>
.list_rw{
	margin-top: 0px;
	width: 90%;
	margin-left:5%;
	border-radius: 0 0 10px;
	height: 55vh;
    overflow-y: auto;
	border: 0.5px solid #3c9cffb8;
	padding: 0 10px 0 10px;
	background-color: #fff !important;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    background-color: #f2f2f2;
    margin: 5px 0;
    padding: 10px;
    /* border: 1px solid #ddd; */
    border-radius: 4px;
}
li:hover {
    /* background-color: #ddd; */
}
</style>

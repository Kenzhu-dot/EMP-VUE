<script setup>
	import {ref} from "vue";
	import { ElMessage } from 'element-plus'
	import { Plus } from '@element-plus/icons-vue'
	import homeApi from "@/api/home.js";
	import {useUserInfoStore} from "@/store/userInfoStore.js"
	import {useTokenStore} from "@/store/token.js";
	const tokenStore = useTokenStore();
	const userInfoStore = useUserInfoStore()
	var user = userInfoStore.user
	
	const MessageStatus = ref(0)
	//用来展示的数据
	const MessageInfo = ref([])
	homeApi.list(MessageStatus).then((result)=>{
		MessageInfo.value = result.data
	})
	const handleClick=()=>{
		homeApi.list(MessageStatus).then((result)=>{
			MessageInfo.value = result.data
		})
	}

	//消息发送相关
	const headers = ref({
		//添加token
		Authorization: tokenStore.token
	})
	const handleImageSuccess = (result) => {
		message.value.image = result.data
	}
	const centerDialogVisible = ref(false)
	const message = ref({})
	message.value.leaderId = user.leaderId
	const clickSend = () =>{
		centerDialogVisible.value = true;
	}
	const Send = () =>{
		homeApi.sendMessage(message.value).then((result)=>{
			centerDialogVisible.value = false;
			message.value = {}
			if (res.code === 0) {
				ElMessage.success(result.msg)
			}
		})
	}
	
	//批复文件
	const changeStatus = (messageStatus)=>{
		
		homeApi.changeStatus(messageStatus).then((result)=>{})
	}
</script>

<template>
	<el-card >
		<el-button class="el-button--primary" @click="clickSend">SendMessage</el-button>
			<el-tabs v-model="MessageStatus" class="demo-tabs" @tabChange="handleClick">
				<el-tab-pane label="Pending" name="0"></el-tab-pane>
				<el-tab-pane label="Approved" name="1"></el-tab-pane>
				<el-tab-pane label="Rejected" name="-1"></el-tab-pane>
			</el-tabs>
			<el-carousel indicator-position="outside" :autoplay="false"  height="400px">
			<el-carousel-item v-for="item in MessageInfo" :key="item">
				<el-card >
					<template #header>
						<h3 text="2xl" justify="center">{{ item.title}}</h3>
					</template>
					{{item.message}}
					<br>
					<el-image style="  padding: 0 5px; max-width: 300px;max-height: 200px;" :src="item.image" :fit="fit" />
					<template #footer >
						<el-button class="el-button" @click ="changeStatus(1)">Approved</el-button>
						<el-button class="el-button" @click = "changeStatus(-1)">Rejected</el-button>
					</template>
				</el-card>
			</el-carousel-item>
		</el-carousel>
	</el-card>
	
<!-- 发送消息 -->
	<el-dialog v-model="centerDialogVisible" title="Message" width="500" center :lock-scroll="false">
		<el-form v-model="message">
			<el-form-item label="title" :label-width="60">
				<el-input v-model="message.title" autocomplete="off" />
			</el-form-item>
			<el-form-item label="Leader" :label-width="60">
				<el-input
						style="width: 240px"
						disabled
						:placeholder="user.leaderName"
				/>
			</el-form-item>
			<el-form-item label="Image" :label-width="60">
				<el-upload
						class="avatar-uploader"
						action="/api/upload"
						:show-file-list="false"
						:on-success="handleImageSuccess"
						:headers="headers"
				>
					<img v-if="message.image" :src="message.image" class="avatar"/>
					<el-icon v-else class="avatar-uploader-icon">
						<Plus/>
					</el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item label="Content" :label-width="60">
				<el-input v-model="message.message"
									style="width: 240px"
									:rows="2"
									type="textarea"
									placeholder="Please input" />
			</el-form-item>
		</el-form>
		<template #footer >
			<div class="dialog-footer">
				<el-button @click="centerDialogVisible = false">Cancel</el-button>
				<el-button type="primary" @click="Send()">Confirm</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
.avatar-uploader .avatar {
	width: 178px;
	height: 178px;
	display: block;
}
.layout-container {
	height: 100vh;
	
	.el-aside {
		background-color: #232323;
		
		&__logo {
			height: 120px;
			background: url('@/assets/logo.png') no-repeat center / 120px auto;
		}
		
		.el-menu {
			border-right: none;
		}
	}
	
	.el-header {
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		.el-dropdown__box {
			display: flex;
			align-items: center;
			
			.el-icon {
				color: #999;
				margin-left: 10px;
			}
			
			&:active,
			&:focus {
				outline: none;
			}
		}
	}
	
	.el-footer {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #666;
	}
	.avatar-uploader .el-upload {
		border: 1px dashed var(--el-border-color);
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: var(--el-transition-duration-fast);
	}
	.avatar-uploader .el-upload:hover {
		border-color: var(--el-color-primary);
	}
	.el-icon.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		text-align: center;
	}
}
</style>

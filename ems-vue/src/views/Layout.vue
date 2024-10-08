<script setup>
import * as ElementPlusIcons from '@element-plus/icons-vue'
import {
	Management,
	Promotion,
	UserFilled,
	User,
	Crop,
	EditPen,
	SwitchButton,
	CaretBottom, Message, House
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
//条目被点击后,调用的函数
import {useRouter} from 'vue-router'
import {useTokenStore} from "@/store/token.js";
import userApi from "@/api/user.js";
import {ref} from "vue";
const tokenStore = useTokenStore();
const router = useRouter();
import {ElMessage, ElMessageBox} from 'element-plus'

//更新左侧导航栏
const pathList=ref([])
const loadLeft=()=>{
	userApi.userInform().then(res=>{
		pathList.value=res.data
	})
}
loadLeft()
const handleCommand = (command) => {
	//判断指令
	if (command === 'logout') {
		//退出登录
		ElMessageBox.confirm(
				"Are you sure you want to logout?",
				"Warning",
				{
					confirmButtonText: 'OK',
					cancelButtonText: 'Cancel',
					type: 'warning',
				}
		).then(()=>{
			tokenStore.removeToken();
			userInfoStore.removeUserInfo();
			// 跳转到登录
			ElMessage.success("退出成功")
			router.push('/login')
		})
		
		
	} else if (command === 'resetPassword') {
		dialogResetPasswordVisible.value = true
		userPassword.value ={}
	}else if (command === 'info'){
		dialogUpdateUserInfoVisible.value = true
		//user.value = userInfoStore.user
		Object.assign(user.value, userInfoStore.user)
	}else {
		//路由
		router.push('/' + command)
	}
}

const getIconComponent = (name) => {
	return ElementPlusIcons[name]
}


//重置密码
const dialogResetPasswordVisible = ref(false)
const userPassword = ref({})

const rePasswordValid = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请输入密码'))
	} else if (value !== userPassword.value.newPassword) {
		callback(new Error("两次密码不一致"))
	} else {
		callback()
	}
}

//表单正则表达式验证
const rules = ref({
	oldPassword: [
		{required: true, message: '请输入初始密码', trigger: 'blur'},
	],
	newPassword: [
		{required: true, message: '请输入密码', trigger: 'blur'},
		{min: 3, max: 16, message: '密码长度必须为3~16位', trigger: 'blur'}
	],
	reNewPassword: [
		{required: true, message: '请输入密码', trigger: 'blur'},
		{validator: rePasswordValid, trigger: 'blur'}
	]
})
//条例验证相关
const ruleFormRef = ref()
const resetPassword = (formEl) => {
	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			console.log('submit!')
			userApi.resetPassword(userPassword.value).then(result => {
				if (result.code === 0) {
					ElMessage({message: result.msg, type: 'success',})
					dialogResetPasswordVisible.value = false
				} else {
					ElMessage.error(result.msg)
				}
			})
		} else {
			confirmVisible.value=false
		}
	})
}
//信息
import {useUserInfoStore} from "@/store/userInfoStore.js"
const userInfoStore = useUserInfoStore()
const getUserInfo = () => {
	userApi.userAllInfo().then(result => {
		if (result.code == 0) {
			userInfoStore.setUserInfo(result.data)
		}
	})
}

getUserInfo()
const dialogUpdateUserInfoVisible = ref(false)
const user = ref({})

const headers = ref({
	//添加token
	Authorization: tokenStore.token
})

const handleAvatarSuccess = (result) => {
	user.value.image = result.data
}

const updateUserInfo = () => {
	userApi.update(user.value).then(result => {
		if (result.code === 0) {
			ElMessage({message: result.msg, type: 'success',})
			dialogUpdateUserInfoVisible.value = false
			//重新加载最新数据
			getUserInfo()
		} else {
			ElMessage.error(result.msg)
		}
	})
}
</script>

<template>
	<!-- element-plus中的容器 -->
	<el-container class="layout-container">
		<!-- 左侧菜单 -->
		<el-aside width="200px">
			<div class="el-aside__logo"></div>
			<!-- element-plus的菜单标签 -->
			<el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router>
				<template v-for="auth in pathList">
					<el-menu-item :index="auth.path">
						<el-icon><component :is="getIconComponent(auth.icon)"></component></el-icon>
						<span v-text="auth.name"></span>
					</el-menu-item>
				</template>
<!--				<el-menu-item index="/emp">
					<el-icon>
						<Management/>
					</el-icon>
					<span>员工管理</span>
				</el-menu-item>
				<el-menu-item index="/role">
					<el-icon>
						<Promotion/>
					</el-icon>
					<span>角色管理</span>
				</el-menu-item>-->
				
			</el-menu>
			<el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff"
							  router>
				<el-sub-menu>
					<template #title>
						<el-icon><House /></el-icon>
						<span>HOME</span>
					</template>
					<el-menu-item index="/user/info">
						<el-icon>
							<User/>
						</el-icon>
						<span>INFORM</span>
					</el-menu-item>
					<el-menu-item index="/user/resetPassword">
						<el-icon>
							<EditPen/>
						</el-icon>
						<span>RESETPWD</span>
					</el-menu-item>
				</el-sub-menu>
			</el-menu>
		</el-aside>
		<!-- 右侧主区域 -->
		<el-container>
			<!-- 头部区域 -->
			<el-header>
				<div><strong>{{userInfoStore.user.name}}</strong></div>
				<!-- 下拉菜单 -->
				<!-- command: 条目被点击后会触发,在事件函数上可以声明一个参数,接收条目对应的指令 -->
				<el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.user.image?userInfoStore.user.image:avatar"/>
                    </span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="info" :icon="User">INFORM</el-dropdown-item>
							<el-dropdown-item command="resetPassword" :icon="EditPen">RESETPWD</el-dropdown-item>
							<el-dropdown-item command="logout" :icon="SwitchButton">LOGOUT</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</el-header>
			<!-- 中间区域 -->
			<el-main>
				<!-- <div style="width: 1290px; height: 570px;border: 1px solid red;">
                    内容展示区
                </div> -->
				<router-view></router-view>
			</el-main>
			<!-- 底部区域 -->
			<el-footer> ©2024 Created by Sun</el-footer>
		</el-container>
	</el-container>
	<!--+++++++++++++++++++++++++++信息会话-->
	<el-dialog v-model="dialogUpdateUserInfoVisible" title="修改基本信息" width="500" :lock-scroll="false" >
		<el-form :model="user">
			<el-form-item label="名字" :label-width="60">
				<el-input v-model="user.name" autocomplete="off"/>
			</el-form-item>
			<el-form-item label="性别" :label-width="60">
				<el-input v-model="user.gender" autocomplete="off"/>
			</el-form-item>
			<el-form-item label="头像" :label-width="60">
				<el-upload
						class="avatar-uploader"
						action="/api/upload"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:headers="headers"
				>
					<img v-if="user.image" :src="user.image" class="avatar"/>
					<el-icon v-else class="avatar-uploader-icon">
						<Plus/>
					</el-icon>
				</el-upload>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogUpdateUserInfoVisible = false">取消</el-button>
				<el-button type="primary" @click="updateUserInfo">
					确认
				</el-button>
			</div>
		</template>
	</el-dialog>
<!--+++++++++++++++++++++++++++修改密码会话-->
	<el-dialog  v-model="dialogResetPasswordVisible" title="Reset Password" width="500" :lock-scroll="false">
		<el-form :rules="rules" :model="userPassword" ref="ruleFormRef">
			<el-form-item prop="oldPassword" label="Original Password" :label-width="150">
				<el-input v-model="userPassword.oldPassword" autocomplete="off"/>
			</el-form-item>
			<el-form-item prop="newPassword" label="New Password" :label-width="150">
				<el-input v-model="userPassword.newPassword" autocomplete="off"/>
			</el-form-item>
			<el-form-item prop="reNewPassword" label="Confirm" :label-width="150">
				<el-input v-model="userPassword.reNewPassword" autocomplete="off"/>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogResetPasswordVisible = false">取消</el-button>
				<el-button  type="primary" @click="resetPassword(ruleFormRef)">
					确认
				</el-button>
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
}
</style>
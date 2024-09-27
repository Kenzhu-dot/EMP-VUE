<script setup>
import {User, Lock} from '@element-plus/icons-vue'
import {ref} from 'vue'
import userApi from "@/api/user.js";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import {useTokenStore} from '@/store/token.js'
import captchaApi from "@/api/captcha.js";
const tokenStore = useTokenStore();

const user = ref({
	id: "",
	pwd: "",
	captcha:""
})

const rules = ref({
	id: [
		{required: true, message: '请输入用户名', trigger: 'blur'},
		{max: 16, message: '用户名的长度最大16位', trigger: 'blur'}
	],
	pwd: [
		{required: true, message: '请输入密码', trigger: 'blur'},
		{min: 3, max: 16, message: '密码长度必须为3~16位', trigger: 'blur'}
	]
})
const login = () => {
	userApi.login(user.value).then(res => {
		if (res.code == 0) {
			ElMessage.success(res.msg)
			tokenStore.setToken(res.data , autoLogin.value)
			router.push("/")
		} else {
			ElMessage.error(res.msg)
		}
	})
}
const captcha = ref("")
const loadCaptcha = ()=>{
	captchaApi.loadCaptcha().then(result =>{
		if (result.code == 0){
			captcha.value=result.data
		}
	})
}
loadCaptcha()

//自动登录
const autoLogin=ref(false);
</script>

<template>
	<div class="login-bg">
		<!-- 登录表单 -->
		<el-form class="form-login" ref="form" size="large" autocomplete="off" :model="user" :rules="rules">
			<el-form-item>
				<h1>登录</h1>
			</el-form-item>
			<el-form-item prop="id">
				<el-input :prefix-icon="User" placeholder="请输入用户名" v-model="user.id"></el-input>
			</el-form-item>
			<el-form-item prop="pwd">
				<el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
									v-model="user.pwd"></el-input>
			</el-form-item>
			<el-form-item prop="captcha">
				<el-input name="captcha"  type="text" placeholder="请输入验证码"
									v-model="user.captcha"></el-input>
				<img width="160px" :src="captcha" @click="loadCaptcha">
			</el-form-item>
			<el-form-item class="flex">
				<div class="flex">
					<el-checkbox v-model="autoLogin">记住我</el-checkbox>
				</div>
			</el-form-item>
			<el-form-item label-position="right">
				<div>
					<el-link type="primary" :underline="false">忘记密码？</el-link>
				</div>
			</el-form-item>
			
			<!-- 登录按钮 -->
			<el-form-item>
				<el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style scoped>
.login-bg {
	height: 100%;
	background-image: url('@/assets/bg.jpg');
	background-repeat: no-repeat;
	background-position: center;
	background-attachment: fixed;
	background-size: cover;
}

.form-login {
	width: 280px;
	padding: 20px;
	position: absolute;
	top: 20%;
	left: calc(50% - 150px);
	background-color: #FFF;
	box-shadow: 10px 10px 30px #000;
}
</style>
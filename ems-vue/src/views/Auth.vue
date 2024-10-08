<script setup>
import {Download, Search, Plus, Upload, Delete, Check, Close} from "@element-plus/icons-vue";
import authApi from "@/api/auth.js";
import {ref, reactive} from "vue";
import {ElMessage} from 'element-plus'
//更新数据操作----------------------------------------
const list = ref([])
const loadData = () => {
	authApi.list().then(res => {
		list.value = res.data;
	})
}
loadData()
//表格顶部操作----------------------------------------------------------------------
const onSearch = () => {
	loadData()
}

//选择的行
const ids = ref([])
const handleSelectionChange = rows => {
	ids.value = rows.map(row => row.id)
}
const deleteById = id => {
	authApi.deleteById(id).then(res => {
		if (res.code === 0) {
			ElMessage.success(res.msg)
			loadData()
		} else {
			ElMessage.error(res.msg)
		}
	})
}
const deleteAll = () => {
	authApi.deleteAll(ids.value).then(res => {
		if (res.code === 0) {
			ElMessage.success(res.msg)
			loadData()
		} else {
			ElMessage.error(res.msg)
		}
	})
}

//与对话相关 -------------------------------------------------------------------------------------
const centerDialogVisible = ref(false)
const title = ref()
const auth = ref({})
//展示添加
const showAdd = () => {
	centerDialogVisible.value = true
	title.value = "ADD"
	auth.value = {}
}
//展示编辑
const showEdit = (id) => {
	centerDialogVisible.value = true
	title.value = "EDIT"
	auth.value = {}
	authApi.selectById(id).then(result => {
		console.log(result.data)
		auth.value = result.data
	})
}
//添加或编辑的提交
const addOrUpdate = () => {
	if (auth.value.id) {
		authApi.update(auth.value).then(result => {
			if (result.code === 0) {
				ElMessage.success(result.msg)
				centerDialogVisible.value = false
				loadData()
			} else {
				ElMessage.error(result.msg)
				loadData()
			}
		})
	} else {
		authApi.add(auth.value).then(result => {
			if (result.code === 0) {
				ElMessage.success(result.msg)
				centerDialogVisible.value = false
				loadData()
			} else {
				ElMessage.error(result.msg)
				loadData()
			}
		})
	}
}


const handleChangeStatus= (id,status)=>{
		authApi.updateStatus(id , status).then(result => {
			if (result.code === 0) {
			}
		})
}
</script>

<template>
	<el-card shadow="hover">
		<template #header >
				<el-button type="primary" @click="showAdd" :icon="Plus" plain> </el-button>
				<el-button @click="deleteAll" type="danger" :icon="Delete" plain></el-button>
		</template>
		
		<el-table :data="list" style="width: 100%" max-height="330"  @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" />
			<el-table-column fixed prop="id" label="ID" width="150"/>
			<el-table-column prop="name" label="Name" width="150"/>
			<el-table-column prop="path" label="path" width="150"/>
			<el-table-column prop="status" label="Status" width="150">
				<template #default="scope">
					<el-switch
							v-model="scope.row.status"
							class="mt-2"
							style="margin-left: 24px"
							inline-prompt
							:active-value="1"
							:inactive-value="0"
							:active-icon="Check"
							:inactive-icon="Close"
							@change="handleChangeStatus(scope.row.id ,scope.row.status)"
					/>
				</template>
			
			</el-table-column>
			<el-table-column prop="icon" label="icon" width="150"/>
			<el-table-column fixed="right" label="Operations" min-width="150">
				
				<template #default={row}>
					<el-button link type="primary" size="small" @click="showEdit(row.id)">Edit</el-button>
					<el-button link type="danger" size="small" @click="deleteById(row.id)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
	
	
	
<!--	添加和编辑-->
	<el-dialog v-model="centerDialogVisible" :title="title" width="500" center :lock-scroll="false">
		<el-form :inline="true" v-model="auth">
			<el-form-item label="Name" :label-width="60">
				<el-input v-model="auth.name" autocomplete="off" />
			</el-form-item>
			<el-form-item label="path" :label-width="60">
				<el-input v-model="auth.path" autocomplete="off" />
			</el-form-item>
			<el-form-item label="icon" :label-width="60">
				<el-input v-model="auth.icon" autocomplete="off" />
			</el-form-item>
		</el-form>
		<template #footer >
			<div class="dialog-footer">
				<el-button @click="centerDialogVisible = false">Cancel</el-button>
				<el-button type="primary" @click="addOrUpdate()">Confirm</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>

</style>
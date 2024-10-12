<script setup>
import {teamApi} from "@/api/team.js";
import {ref, reactive} from "vue";
import {ElMessage} from 'element-plus'
//更新数据操作----------------------------------------
const list = ref([])
const loadData = () => {
	teamApi.list().then(res => {
		list.value = res.data;
	})
}
loadData()
//表格顶部操作----------------------------------------------------------------------

//选择的行
const ids = ref([])
const handleSelectionChange = rows => {
	ids.value = rows.map(row => row.id)
}
const deleteById = id => {
	teamApi.deleteById(id).then(res => {
		if (res.code === 0) {
			ElMessage.success(res.msg)
			loadData()
		} else {
			ElMessage.error(res.msg)
		}
	})
}
const deleteAll = () => {
	teamApi.deleteAll(ids.value).then(res => {
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
const team = ref({})
//展示添加
const showAdd = () => {
	centerDialogVisible.value = true
	title.value = "ADD"
	team.value = {}
}
//展示详情
const empName = ref()
const projectName = ref()
const detailVisible = ref(false)
const showDetail = (id) => {
	teamApi.detail(id).then(res => {
		detailVisible.value = true
		empName.value = res.data.empName
		projectName.value=res.data.projectName
	})
}
//添加或编辑的提交
const addOrUpdate = () => {
	if (team.value.id) {
		teamApi.update(team.value).then(result => {
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
		teamApi.add(team.value).then(result => {
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
//表格内部相关
const handleChangeStatus = (id , status)=>{
	teamApi.updateStatus(id, status).then(result => {})
}
</script>

<template>
	<el-card shadow="hover">
		<template #header >
			<div class="mb-4">
				<el-button type="primary" @click="showAdd" plain>Add </el-button>
				<el-button @click="deleteAll" type="danger" plain>DeleteAll</el-button>
			</div>
		</template>
		
		<el-table :data="list" style="width: 100%" max-height="330" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" />
			<el-table-column fixed prop="id" label="ID" width="150"/>
			<el-table-column prop="name" label="Name" width="150"/>
			<el-table-column prop="number" label="number" width="150"/>
<!--			<el-table-column label="Status" width="150">
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
			</el-table-column>-->
			<el-table-column fixed="right" label="Operations" min-width="150">
				
				<template #default={row}>
					<el-button link type="primary" size="small" @click="showDetail(row.id)">Detail</el-button>
					<el-button link type="danger" size="small" @click="deleteById(row.id)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
		<template #footer>
		</template>
	</el-card>
	
	
	
	<!--	添加-->
	<el-dialog v-model="centerDialogVisible" title="Add" width="500" center :lock-scroll="false">
		<el-form :inline="true" v-model="team">
			<el-form-item label="Name" :label-width="60">
				<el-input v-model="team.name" autocomplete="off" />
			</el-form-item>
		</el-form>
		<template #footer >
			<div class="dialog-footer">
				<el-button @click="centerDialogVisible = false">Cancel</el-button>
				<el-button type="primary" @click="addOrUpdate()">Confirm</el-button>
			</div>
		</template>
	</el-dialog>
	<!-- 详情 -->
	<el-dialog v-model="detailVisible" title="detail" width="500" center :lock-scroll="false">
		<el-descriptions
				title="Vertical list with border"
				direction="vertical"
				:column="1"
				:size="size"
				border
		>
			<el-descriptions-item label="EMN">
				{{empName}}
			</el-descriptions-item>
			<br/>
			<el-descriptions-item label="Project">
				{{projectName}}
			</el-descriptions-item>
		</el-descriptions>
	</el-dialog>
</template>

<style scoped>

</style>
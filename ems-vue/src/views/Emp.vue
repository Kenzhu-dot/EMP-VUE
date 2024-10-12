<script setup>
import {Check, Close, Search} from "@element-plus/icons-vue";
import {empApi} from "@/api/emp.js";
import {ref, reactive} from "vue";
import {ElMessage} from 'element-plus'
import {teamApi} from "@/api/team.js";
//更新数据操作----------------------------------------
const empQuery = reactive({
	name: "",
	gender: "",
	roleId: "",
	leaderId: "",
	page: 1,
	limit: 7,
})
const total = ref(0)
const list = ref([])
const loadData = () => {
	empApi.list(empQuery).then(res => {
		list.value = res.data.list;
		total.value = res.data.total;
	})
}
loadData()
//表格顶部操作----------------------------------------------------------------------
const onSearch = () => {
	empQuery.page = 1
	loadData()
}

//选择的行
const ids = ref([])
const handleSelectionChange = rows => {
	ids.value = rows.map(row => row.id)
}
const deleteById = id => {
	empApi.deleteById(id).then(res => {
		if (res.code === 0) {
			ElMessage.success(res.msg)
			loadData()
		} else {
			ElMessage.error(res.msg)
		}
	})
}
const deleteAll = () => {
	empApi.deleteAll(ids.value).then(res => {
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
const emp = ref({})
//展示添加
const team = ref([])
const loadTeam = ()=>{
	teamApi.selectAll().then(result => {
		team.value=result.data
	})
}
const showAdd = () => {
	loadTeam()
	centerDialogVisible.value = true
	title.value = "ADD"
	emp.value = {}
}
//展示编辑
const showEdit = (id) => {
	loadTeam()
	centerDialogVisible.value = true
	title.value = "EDIT"
	emp.value = {}
	empApi.selectById(id).then(result => {
		console.log(result.data)
		emp.value = result.data
	})
}
//添加或编辑的提交
const addOrUpdate = () => {
	if (emp.value.id) {
		empApi.update(emp.value).then(result => {
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
		empApi.add(emp.value).then(result => {
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
	empApi.updateStatus(id, status).then(result => {})
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
		<el-form :inline="true">
			<el-form-item label="name">
				<el-input style="width: 140px" v-model="empQuery.name" :inline="true" clearable/>
			</el-form-item>
			<el-form-item label="gender">
				<el-select v-model="empQuery.gender" placeholder="Select" style="width: 240px" clearable>
					<el-option
							label="男"
							value="男"
					/>
					<el-option
							label="女"
							value="女"
					/>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="onSearch" type="primary"><el-icon><Search /></el-icon></el-button>
			</el-form-item>
		</el-form>
		
		<el-table :data="list" style="width: 100%" max-height="330" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" />
			<el-table-column fixed prop="id" label="ID" width="150"/>
			<el-table-column prop="name" label="Name" width="150"/>
			<el-table-column prop="gender" label="Gender" width="150"/>
			<el-table-column label="Status" width="150">
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
			<el-table-column prop="teamName" label="team" width="150"/>
			<el-table-column prop="roleName" label="role" width="150"/>
			<el-table-column prop="salary" label="Salary" width="150"/>
			<el-table-column prop="lateRecord" label="late_record" width="150"/>
			<el-table-column prop="leaderName" label="leader" width="150"/>
			<el-table-column fixed="right" label="Operations" min-width="150">
				
				<template #default={row}>
					<el-button link type="primary" size="small" @click="showEdit(row.id)">Edit</el-button>
					<el-button link type="danger" size="small" @click="deleteById(row.id)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
		<template #footer>
			<el-pagination
					v-model:current-page="empQuery.page"
					v-model:page-size="empQuery.limit"
					:page-sizes="[7,14,21]"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
					@change="loadData"
			/>
		</template>
	</el-card>
	
	
	
<!--	添加和编辑-->
	<el-dialog v-model="centerDialogVisible" :title="title" width="500" center :lock-scroll="false">
		<el-form :inline="true" v-model="emp">
			<el-form-item label="Name" :label-width="60">
				<el-input v-model="emp.name" autocomplete="off" />
			</el-form-item>
			<el-form-item label="Gender" :label-width="60">
				<el-select v-model="emp.gender" placeholder="Select" style="width: 240px" clearable>
					<el-option
							label="男"
							value="男"
					/>
					<el-option
							label="女"
							value="女"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="Salary" :label-width="60">
				<el-input v-model="emp.salary" autocomplete="off" />
			</el-form-item>
			<el-form-item label="Salary" :label-width="60">
				<el-select v-model="emp.teamId" placeholder="Select" style="width: 240px" clearable>
					<el-option
							v-for="item in team"
							:label="item.name"
							:value="item.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="Leader" :label-width="60">
				<el-input v-model="emp.leaderId" autocomplete="off" />
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
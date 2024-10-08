<script setup>
import {Download, Search, Plus, Upload, Delete, Check, Close} from "@element-plus/icons-vue";
import {projectApi} from "@/api/project.js";
import {ref, reactive} from "vue";
import {ElMessage} from 'element-plus'
//更新数据操作----------------------------------------
const projectQuery = reactive({
	id :"",
	name: "",
	projectTeamId: "",
	beginEndTime:"",
	endEndTime:"",
	page: 1,
	limit: 7,
})
const total = ref(0)
const list = ref([])
const loadData = () => {
	projectApi.list(projectQuery).then(res => {
		list.value = res.data.list;
		total.value = res.data.total;
	})
}
loadData()
//表格顶部操作----------------------------------------------------------------------
const onSearch = () => {
	projectQuery.page = 1
	loadData()
}

//选择的行
const ids = ref([])
const handleSelectionChange = rows => {
	ids.value = rows.map(row => row.id)
}
const deleteById = id => {
	projectApi.deleteById(id).then(res => {
		if (res.code === 0) {
			ElMessage.success(res.msg)
			loadData()
		} else {
			ElMessage.error(res.msg)
		}
	})
}
const deleteAll = () => {
	projectApi.deleteAll(ids.value).then(res => {
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
const project = ref({})
//展示添加
const showAdd = () => {
	centerDialogVisible.value = true
	title.value = "ADD"
	project.value = {}
}
//展示编辑
const showEdit = (id) => {
	centerDialogVisible.value = true
	title.value = "EDIT"
	project.value = {}
	projectApi.selectById(id).then(result => {
		console.log(result.data)
		project.value = result.data
	})
}
//添加或编辑的提交
const addOrUpdate = () => {
	if (project.value.id) {
		projectApi.update(project.value).then(result => {
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
		projectApi.add(project.value).then(result => {
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

//导入导出excel
import {useTokenStore} from "@/store/token.js"
import {teamApi} from "@/api/team.js";
const tokenStore = useTokenStore()
const exportExcel = ()=>{
	projectApi.exportExcel().then(result => {
		let blob = new Blob([result], { type: "application/xlsx" });
		let url = window.URL.createObjectURL(blob);
		const link = document.createElement("a"); // 创建a标签
		link.href = url;
		link.download = "项目列表.xlsx"; // 重命名文件
		link.click();
		URL.revokeObjectURL(url);
	})
}
const headers = ref({
	Authorization: tokenStore.token
})

const team = ref([])
const loadTeam = ()=>{
	teamApi.selectAll().then(result => {
		team.value=result.data
	})
}
loadTeam()
//表格内信息相关

</script>

<template>
	<el-card shadow="hover">
		<template #header >
			<el-row>
				<el-button type="primary" @click="showAdd" :icon="Plus" plain> </el-button>
				<el-button @click="deleteAll" type="danger" :icon="Delete" plain></el-button>
				<el-button @click="exportExcel" type="success" :icon="Download" plain>ExportExcel</el-button>
				<el-upload
						class="inline-block"
						method="post"
						action="/api/project/importExcel"
						style="display: inline-block ; margin-left: 10px"
						accept=".xlsx,.xls"
						:show-file-list="false"
						:on-success="success"
						:headers="headers"
						name="file">
					<el-button type="success" :icon="Upload" plain>ImportExcel</el-button>
				</el-upload>
			</el-row>
		</template>
		<el-form :inline="true">
			<el-form-item label="ID">
				<el-input style="width: 140px" v-model="projectQuery.id" :inline="true" clearable/>
			</el-form-item>
			<el-form-item label="Team">
				<el-select v-model="projectQuery.projectTeamId" placeholder="Select" style="width: 240px" clearable>
					<el-option
							v-for="item in team"
							:label="item.name"
							:value="item.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item>
				<div class="block">
					<el-date-picker
							v-model="projectQuery.beginEndTime"
							type="datetime"
							placeholder="Pick the Begin of UpdateTime"
							value-format="YYYY-MM-DD HH:mm:ss"
							date-format="MMM DD, YYYY"
							time-format="HH:mm"
					/>
				</div>
			</el-form-item>
			<el-form-item>
				<div class="block">
					<el-date-picker
							v-model="projectQuery.endEndTime"
							type="datetime"
							placeholder="Pick the Begin of UpdateTime"
							value-format="YYYY-MM-DD HH:mm:ss"
							date-format="MMM DD, YYYY"
							time-format="HH:mm"
					/>
				</div>
			</el-form-item>
			<el-form-item>
				<el-button @click="onSearch" type="primary"><el-icon><Search /></el-icon></el-button>
			</el-form-item>
		</el-form>
		
		<el-table :data="list" style="width: 100%" max-height="330" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" />
			<el-table-column fixed prop="id" label="ID" width="150"/>
			<el-table-column prop="name" label="Name" width="150"/>
			<el-table-column prop="projectProgress" label="Progress" width="150"/>
			<el-table-column prop="projectSize" label="Size" width="150"/>
			<el-table-column prop="createTime" label="CreateTime" width="150"/>
			<el-table-column prop="endTime" label="EndTime" width="150"/>
			<el-table-column prop="teamName" label="ProjectTeam" width="150"/>
			<el-table-column fixed="right" label="Operations" min-width="150">
				
				<template #default={row}>
					<el-button link type="primary" size="small" @click="showEdit(row.id)">Edit</el-button>
					<el-button link type="danger" size="small" @click="deleteById(row.id)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
		<template #footer>
			<el-pagination
					v-model:current-page="projectQuery.page"
					v-model:page-size="projectQuery.limit"
					:page-sizes="[7,14,21]"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
					@change="loadData"
			/>
		</template>
	</el-card>
	
	
	
<!--	添加和编辑-->
	<el-dialog v-model="centerDialogVisible" :title="title" width="500" center :lock-scroll="false">
		<el-form :inline="true" v-model="project">
			<el-form-item label="Name" :label-width="60">
				<el-input v-model="project.name" autocomplete="off" />
			</el-form-item>
			<el-form-item label="Progress" :label-width="60">
				<el-select v-model="project.projectProgress" placeholder="Select" style="width: 240px" clearable>
					<el-option label="未启动" value="未启动"/>
					<el-option label="进行中" value="进行中"/>
					<el-option label="已完成" value="已完成"/>
				</el-select>
			</el-form-item>
			<el-form-item label="Team">
				<el-select v-model="project.projectTeamId" placeholder="Select" style="width: 240px" clearable>
					<el-option
							v-for="item in team"
							:label="item.name"
							:value="item.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="Size" :label-width="60">
				<el-input v-model="project.projectSize" autocomplete="off" />
			</el-form-item>
			<el-form-item label="EndTime">
				<div class="block">
					<el-date-picker
							v-model="project.endTime"
							type="datetime"
							placeholder="Pick the Begin of UpdateTime"
							value-format="YYYY-MM-DD HH:mm:ss"
							date-format="MMM DD, YYYY"
							time-format="HH:mm"
					/>
				</div>
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
<script setup>
import {reactive, ref} from "vue";
import roleApi from "@/api/role.js";
import {Check, Close} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

//查找所有角色
const roleList = ref([])
const loadRoles= ()=>{
	roleApi.list().then(res=>{
		roleList.value = res.data;
	})
}
loadRoles()


//展示权限
const drawer=ref(false)
const authVOs = ref([])
const handleClickEdit =(id)=>{
	roleId.value = id
	drawer.value = true
	roleApi.edit(id).then(res => {
		authVOs.value=res.data;
	})
}

//修改成员权限

const roleId=ref(0)
const handleClose = ()=>{
	roleApi.updateMid(roleId.value , authVOs.value).then(res=>{
		if(res.code === 0){
			ElMessage.success(res.msg)
		}
	})
}


</script>

<template>
	<el-table :data="roleList" style="width: 100%">
		<el-table-column fixed prop="id" label="ID" width="150" />
		<el-table-column prop="name" label="Name" width="150" />
		<el-table-column fixed="right" label="Operations" min-width="120">
			<template #default="{row}">
				<el-button link type="primary" size="small" @click="handleClickEdit(row.id)">Edit</el-button>
			</template>
		</el-table-column>
	</el-table>
	
<!--	权限展示-->
	<el-drawer
			v-model="drawer"
			title="Auth"
			:direction="'rtl'"
			:before-close="handleClose"
	>
		<el-table :data="authVOs" style="width: 100%">
			<el-table-column prop="name" label="Name" width="180" />
			<el-table-column>
				<template #default="scope">
					<el-switch
							v-model="scope.row.midStatus"
							style="--el-switch-on-color: #13ce66; "
							:active-value="1"
							:inactive-value="0"
							inline-prompt
							:active-icon="Check"
							:inactive-icon="Close"
					/>
				</template>
			</el-table-column>
		</el-table>
	</el-drawer>
</template>

<style scoped>

</style>
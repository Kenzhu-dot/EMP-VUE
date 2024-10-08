<script setup>
import ProjectCompletion from "@/components/ProjectCompletion.vue";
import ProjectMonNum from "@/components/ProjectMonNum.vue";
</script>

<template>
	<el-row>
	<el-col :span="8">
		<el-row  style="height: 300px">
		<ProjectCompletion/>
		</el-row>
		<el-row  style="height: 300px">
			<ProjectCompletion/>
		</el-row>
	</el-col>
	<el-col :span="16"><ProjectMonNum/></el-col>
	</el-row>

<!--	<el-row style="height: 50%">
		<el-col :span="8"><ProjectCompletion></ProjectCompletion></el-col>
		<el-col :span="8"><ProjectCompletion></ProjectCompletion></el-col>
	</el-row>-->
</template>

<style scoped>

</style>
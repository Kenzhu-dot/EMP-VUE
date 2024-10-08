<script setup>
import {onBeforeMount, onMounted, ref} from "vue";
import * as echarts from 'echarts'
import {chartsApi} from "@/api/charts.js";
const projectMonNum=ref()
const load = ref([]);
onBeforeMount(()=>{
	chartsApi.projectMonNumEnd().then(res =>{
		if (res.code === 0){
			const projectMonNumVOEnd = res.data;
			const endNum =  new Array(12).fill(0);
			for (let i = 0; i < endNum.length; i++) {
				for (let j = 0; j < projectMonNumVOEnd.length; j++) {
					if (i+1 == projectMonNumVOEnd[j].name){
						endNum[i]=projectMonNumVOEnd[j].value
					}
				}
			}
			load.value = endNum;
		}
	})
})
onMounted(()=>{
	const projectMonNumCharts=echarts.init(projectMonNum.value);
	chartsApi.projectMonNum().then(res=>{
		if (res.code === 0){
			const projectMonNumVO=res.data;
			const createNum = new Array(12).fill(0);
			for (let i = 0; i < createNum.length; i++) {
				for (let j = 0; j < projectMonNumVO.length; j++) {
					if (i+1 == projectMonNumVO[j].name){
						createNum[i]=projectMonNumVO[j].value
					}
				}
			}
			const option = {
				title: {
					text: 'Project Number',
				},
				legend: {
					data: ['Create', 'End']
				},
				calculable: true,
				xAxis: {
					type: 'category',
					data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				},
				yAxis: {
					type: 'value'
				},
				series: [
					{
						name: 'Create',
						data: createNum,
						type: 'bar'
					},
					{
						name: 'End',
						data: load.value,
						type: 'bar'
					}
				]
			};
			projectMonNumCharts.setOption(option);
		}
	})
})
</script>

<template>
	<div style="width: 100% ; height: 100%" ref="projectMonNum"></div>

</template>

<style scoped>

</style>
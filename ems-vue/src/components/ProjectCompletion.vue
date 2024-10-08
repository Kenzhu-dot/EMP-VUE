<script setup>
import * as echarts from 'echarts'
import {chartsApi} from "@/api/charts.js";
import {onMounted, ref} from "vue";

const projectCompletion=ref()
onMounted(()=>{
	const projectCompletionCharts = echarts.init(projectCompletion.value );
	chartsApi.projectCompletion().then(res=>{
		if(res.code ===0){
			const option = {
				title: {
					text: 'ProjectCompletion',
					left: 'center'
				},
					tooltip: {
						trigger: 'item'
					},
/*				legend: {
					orient: 'vertical',
					left: 'left'
				},*/
				series: [
					{
						name: 'Access From',
						type: 'pie',
						radius: '50%',
						data: res.data,
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
				]
			};
			projectCompletionCharts.setOption(option);
		}
	})
})


</script>

<template>
<div style="width: 100% ; height: 100%" ref="projectCompletion"></div>
</template>

<style scoped>

</style>
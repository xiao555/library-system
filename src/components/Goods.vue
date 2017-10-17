<template>
	<el-card :body-style="{ padding: '0px' }">
		<div style="float: left; padding: 10px;">
			<router-link
				class = "goods__link"
				:to = "{ path: '/books/' + item.name }"
			>《{{item.name}}》</router-link>
			<div class="bottom clearfix">
				<p>Type: {{ item.type }}</p>
				<p>Number: {{ item.number }}</p>
				<el-button
					@click="choose(item)"
				>Borrow</el-button>
			</div>
		</div>
	</el-card>
</template>

<script>
	export default {
		// 组件名
		name: 'Goods',
		// 从父组件传过来的属性
		props: ['item', 'choose'],
	}
</script>
<style>
	.goods__link {
		text-decoration: none;
	}
	.goods__link:link {
		color: #000;
	}
	.goods__link:visited {
		color: #000;
	}
</style>

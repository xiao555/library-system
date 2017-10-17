<template>
	<div>
		<el-card :body-style="{ padding: '10px' }">
			<p>《{{item.name}}》</p>
			<template >
			  <el-input-number size="small" v-model="num" :min="1" :max="Number(item.number)"></el-input-number>
				<el-button size="small" type="danger" style="margin-left: 10px" @click = "remove(item)">Remove</el-button>
			</template>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'Cart',
		props: ['item', 'remove'],
		data() {
      return {
        num: 1
      };
    },
	}
</script>

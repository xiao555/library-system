<template>
	<div>
		<el-card :body-style="{ padding: '10px' }">
			<h4><i>{{item.name}}</i></h4><el-button size="small" type="danger" style="margin-left: 10px" @click = "remove(item)">Remove</el-button>
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

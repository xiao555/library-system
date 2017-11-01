<template>
	<el-card class="good-item" :body-style="{ padding: '0px' }">
		<div class="photo" style="float: left; padding: 10px;">
			<img :src="item.photo" alt="photo">
		</div>
		<div style="float: left; padding: 10px; max-width: 200px">
			<router-link
				class = "goods__link"
				:to = "{ path: '/books/' + item.isbn }"
			><h4><i>{{item.name}}</i></h4></router-link>
			<div class="bottom clearfix">
				<p>Type: {{ item.type }}</p>
				<p>Number: {{ item.number }}</p>
				<el-button
					@click="choose(item)"
				>Add to Cart</el-button>
			</div>
		</div>
	</el-card>
</template>

<script>
	export default {
		// 组件名
		name: 'Goods',
		data () {
			return {
			}
		},
		// 从父组件传过来的属性
		props: ['item', 'choose'],
	}
</script>
<style lang="stylus">
	.goods__link {
		text-decoration: none;
	}
	.goods__link:link {
		color: #000;
	}
	.goods__link:visited {
		color: #000;
	}

	.good-item
		height 222px

	.photo
		width 140px
		height: 200px
		padding 5px
		img
			width 100%
</style>

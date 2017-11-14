<template>
	<el-card class="good-item" :body-style="{ padding: '0px' }">
		<router-link
				class = "goods__link"
				:to = "{ path: '/books/' + item.isbn }"
			>
			<div class="photo" v-bind:style="{ backgroundImage: 'url(' + item.photo + ')' }" :data-img="item.photo"></div>
		</router-link>
		<div style="float: left; padding: 10px; max-width: 200px">
			<router-link
				class = "goods__link"
				:to = "{ path: '/books/' + item.isbn }"
			><h4><i>{{item.name}}</i></h4></router-link>
			<div class="bottom clearfix">
				<p>Type: {{ item.type }}</p>
				<p>Number: {{ item.number }}</p>
				<el-tooltip :disabled="canBook" :content="tooltip" placement="right" effect="dark">
					<el-button @click="canBook ? choose(item) : login()">Add to Carts</el-button>
				</el-tooltip>
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
				tooltip: ''
			}
		},
		// 从父组件传过来的属性
		props: ['item', 'choose'],

		computed: {
			isLogin () {
				return this.$store.state.user
			},
			canBook () {
				if (new Date().getDay() == 0) {
					this.tooltip = 'Can not reserve on Sunday'
					return false
				} else if (!sessionStorage.getItem('uid')) {
					this.tooltip = 'Please sign in first'
					return false
				}
				return true
			},
		},

		methods: {
			login () {
				this.$router.push('/login')
			}
		}
	}
</script>
<style lang="stylus" scoped>
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
		overflow-y auto

	.photo
		width 140px
		height: 200px
		padding 5px
		overflow hidden
		float left
		margin 10px
		background-size cover
		background-position center
		transition all .8s cubic-bezier(0.18, 0.89, 0.32, 1.28)
		cursor pointer
		&:hover
			background-size 200px
</style>

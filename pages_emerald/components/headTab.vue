<template>
	<!-- 头部tab切换 -->
	<view class="tab_nav">
		<view class="navTitle" v-for="(item,index) in navList" :key="index" :class="{'active':isActive === index}"
			@click="checked(index)">
			<view>{{item}}</view>
			<view class="line"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"headTab",
		props:{
		  navList: {
		    type: Array,
		    default: function(e){
		      return ['正常商品','封存商品']
		    }
		  },
		  // isActive: {
			 //  type: Number,
			 //  default: function(e){
				// return 0
			 //  }
		  // }
		},
		data() {
			return {
				isActive:0
			};
		},
		methods: {
			checked(index){
				this.isActive = index
				this.$emit("change",index)
			}
		}
	}
</script>

<style lang="scss" scoped>
.tab_nav {
	height: 130rpx;
	display: flex;
	border-bottom: 1px solid #CCC;
	background: #fff;

	.navTitle {
		flex-grow: 1;
		text-align: center;
		color: #686868;
		font-size: 36rpx;
		line-height: 120rpx;
		position: relative;
		cursor: pointer;
		font-weight:bold;
		.line {
			position: absolute;
			bottom: 25rpx;
			left: 50%;
			width: 50rpx;
			height: 10rpx;
			margin-left: -25rpx;
			border-radius: 5rpx !important;
			background-color: #439057;
			display: none;
		}
	}

	.active {
		color: #439057;

		.line {
			display: block;
		}
	}
}
</style>

<template>
	<view>
		<view class='my-order'>
			<view class='header bg-color'>
				<view class='picTxt acea-row row-between-wrapper'>
					<view class='text'>
						<view class='name'>竞拍信息</view>
						<view>竞拍订单：{{orderData.orderCount || 0}}</view>
					</view>
					<view class='pictrue'>
						<image src='../../../static/images/orderTime.png'></image>
					</view>
				</view>
			</view>
			<view class='nav acea-row row-around'>
				<view class='item' :class='orderStatus==1 ? "on": ""' @click="statusClick(1)">
					<view>待上架</view>
					<view class='num'>{{orderData.unPendingCount || 0}}</view>
				</view>
				<view class='item' :class='orderStatus==2 ? "on": ""' @click="statusClick(2)">
					<view>已完成</view>
					<view class='num'>{{orderData.completeCount || 0}}</view>
				</view>
			</view>
			<view class='list'>
				<view class='item' v-for="(item,index) in orderList" :key="index">
					<view @click='goOrderDetails(item.orderId)'>
						<view class='title acea-row row-between-wrapper'>
							<view class="acea-row row-middle">
								<text class="sign cart-color acea-row row-center-wrapper" v-if="item.auctionId != 0">竞拍</text>
								<view>{{item.payTime}}</view>
							</view>
							<view class='font-color'>{{item.orderStatus}}</view>
						</view>
						<view class='item-info acea-row row-between row-top'>
							<view class='pictrue'>
								<image :src='item.image'></image>
							</view>
							<view class='text acea-row row-between'>
								<view class='name line2'>{{item.storeName}}</view>
								<view class='money'>
									<view>￥{{item.deductionPrice}}</view>
									<view>x{{item.cartNum}}</view>
								</view>
							</view>
						</view>
					</view>
					<view class='bottom acea-row row-right row-middle'>
						<view class='bnt bg-color' v-if="item.status == 0 || item.status == 2" @click='goOrderDetails(item.orderId)'>查看详情</view>
						<view class='bnt bg-color' v-else-if="item.status == 1" @click='onSaleOrder(item.orderId)'>上架</view>
					</view>
				</view>
			</view>
			<view class='loadingicon acea-row row-center-wrapper' v-if="orderList.length>0">
				<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
			</view>
			<view v-if="orderList.length == 0">
				<emptyPage title="暂无订单~"></emptyPage>
			</view>
		</view>
		<view class='noCart' v-if="orderList.length == 0 && page > 1">
			<view class='pictrue'>
				<image src='/images/noOrder.png'></image>
			</view>
		</view>
		<!-- #ifdef MP -->
		<!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->
		<home></home>
	</view>
</template>

<script>
    import {
    	getOrderList,
    	orderData,
        onSale
    } from '@/api/auction.js';
	import {
		openOrderSubscribe
	} from '@/utils/SubscribeMessage.js';
	import home from '@/components/home';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	import emptyPage from '@/components/emptyPage.vue'
	export default {
		components: {
			home,
			emptyPage,
			// #ifdef MP
			authorize
			// #endif
		},
		data() {
			return {
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: '加载更多', //提示语
				orderList: [], //竞拍数组
				orderData: {}, //竞拍详细统计
				orderStatus: 1, //竞拍状态
				page: 1,
				limit: 20,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false //是否隐藏授权
			};
		},
		computed: mapGetters(['isLogin', 'userInfo']),
		onShow() {
			if (this.isLogin) {
				this.loadend = false;
				this.page = 1;
				this.$set(this, 'orderList', []);
				this.getOrderData();
				this.getOrderList();
			} else {
				toLogin();
			}
		},
		methods: {
			onLoadFun() {
				this.getOrderData();
				this.getOrderList();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			/**
			 * 事件回调
			 * 
			 */
			onChangeFun: function(e) {
				let opt = e;
				let action = opt.action || null;
				let value = opt.value != undefined ? opt.value : null;
				(action && this[action]) && this[action](value);
			},
			/**
			 * 生命周期函数--监听页面加载
			 */
			onLoad: function(options) {
				if (options.status) this.orderStatus = options.status;
			},
			/**
			 * 获取竞拍统计数据
			 * 
			 */
			getOrderData: function() {
				let that = this;
				orderData().then(res => {
					that.$set(that, 'orderData', res.data);
				})
			},
			/**
			 * 去竞拍详情
			 */
			goOrderDetails: function(order_id) {
				if (!order_id) return that.$util.Tips({
					title: '缺少订单号无法查看竞拍详情'
				});
				// #ifdef MP
				uni.showLoading({
					title: '正在加载',
				})
				openOrderSubscribe().then(() => {
					uni.hideLoading();
					uni.navigateTo({
						url: '/pages/activity/goods_auction_detail/index?order_id=' + order_id
					})
				}).catch(() => {
					uni.hideLoading();
				})
				// #endif  
				// #ifndef MP
				uni.navigateTo({
					url: '/pages/activity/goods_auction_detail/index?order_id=' + order_id
				})
				// #endif
			},
			/**
			 * 切换类型
			 */
			statusClick: function(status) {
				if (status == this.orderStatus) return;
				this.orderStatus = status;
				this.loadend = false;
				this.page = 1;
				this.$set(this, 'orderList', []);
				this.getOrderList();
			},
			/**
			 * 获取竞拍列表
			 */
			getOrderList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = "加载更多";
				getOrderList({
					type: that.orderStatus,
					page: that.page,
					limit: that.limit,
				}).then(res => {
					let list = res.data.list || [];
					let loadend = list.length < that.limit;
					that.orderList = that.$util.SplitArray(list, that.orderList);
					that.$set(that, 'orderList', that.orderList);
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? "我也是有底线的" : '加载更多';
					that.page = that.page + 1;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = "加载更多";
				})
			},

			/**
			 * 拍品上架
			 */
			onSaleOrder: function(order_id, index) {
				let that = this;
				onSale(order_id).then(res => {
					that.orderList.splice(index, 1);
					that.$set(that, 'orderList', that.orderList);
					that.$set(that.orderData, 'unpaid_count', that.orderData.unpaid_count - 1);
					that.getOrderData();
					return that.$util.Tips({
						title: '删除成功',
						icon: 'success'
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			},
		},
		onReachBottom: function() {
			this.getOrderList();
		}
	}
</script>

<style scoped lang="scss">
	.my-order .header {
		height: 250rpx;
		padding: 0 30rpx;
	}

	.my-order .header .picTxt {
		height: 190rpx;
	}

	.my-order .header .picTxt .text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 26rpx;
		font-family: 'Guildford Pro';
	}

	.my-order .header .picTxt .text .name {
		font-size: 34rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 20rpx;
	}

	.my-order .header .picTxt .pictrue {
		width: 122rpx;
		height: 109rpx;
	}

	.my-order .header .picTxt .pictrue image {
		width: 100%;
		height: 100%;
	}

	.my-order .nav {
		background-color: #fff;
		width: 690rpx;
		height: 140rpx;
		border-radius: 14rpx;
		margin: -60rpx auto 0 auto;
	}

	.my-order .nav .item {
		text-align: center;
		font-size: 26rpx;
		color: #282828;
		padding: 26rpx 0;
	}

	.my-order .nav .item.on {
		// font-weight: bold;
		// border-bottom: 5rpx solid #e93323;
		/* #ifdef H5 || MP */
		font-weight: bold;
		/* #endif */
		border-bottom: 5rpx solid $theme-color;
	}

	.my-order .nav .item .num {
		margin-top: 18rpx;
	}

	.my-order .list {
		width: 690rpx;
		margin: 14rpx auto 0 auto;
	}

	.my-order .list .item {
		background-color: #fff;
		border-radius: 14rpx;
		margin-bottom: 14rpx;
	}

	.my-order .list .item .title {
		height: 84rpx;
		padding: 0 24rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 28rpx;
		color: #282828;
	}

	.my-order .list .item .title .sign {
		font-size: 24rpx;
		padding: 0 13rpx;
		height: 36rpx;
		margin-right: 15rpx;
		border-radius: 18rpx;
	}

	.my-order .list .item .item-info {
		padding: 0 24rpx;
		margin-top: 22rpx;
	}

	.my-order .list .item .item-info .pictrue {
		width: 120rpx;
		height: 120rpx;
	}

	.my-order .list .item .item-info .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}

	.my-order .list .item .item-info .text {
		width: 500rpx;
		font-size: 28rpx;
		color: #999;
	}

	.my-order .list .item .item-info .text .name {
		width: 350rpx;
		color: #282828;
	}

	.my-order .list .item .item-info .text .money {
		text-align: right;
	}

	.my-order .list .item .totalPrice {
		font-size: 26rpx;
		color: #282828;
		text-align: right;
		margin: 27rpx 0 0 30rpx;
		padding: 0 30rpx 30rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.my-order .list .item .totalPrice .money {
		font-size: 28rpx;
		font-weight: bold;
	}

	.my-order .list .item .bottom {
		height: 107rpx;
		padding: 0 30rpx;
	}

	.my-order .list .item .bottom .bnt {
		width: 176rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #fff;
		border-radius: 50rpx;
		font-size: 27rpx;
        background: linear-gradient(90deg, #FF7931 0%, #E93323 100%);
	}

	.my-order .list .item .bottom .bnt.cancelBnt {
		border: 1rpx solid #ddd;
		color: #aaa;
	}

	.my-order .list .item .bottom .bnt~.bnt {
		margin-left: 17rpx;
	}

	.noCart {
		margin-top: 171rpx;
		padding-top: 0.1rpx;
	}

	.noCart .pictrue {
		width: 414rpx;
		height: 336rpx;
		margin: 78rpx auto 56rpx auto;
	}

	.noCart .pictrue image {
		width: 100%;
		height: 100%;
	}
</style>

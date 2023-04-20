<template>
	<!-- 秒杀 -->
	<view class="seckill" v-if="spikeList.length">
		<view class="title acea-row row-between-wrapper">
			<view class="acea-row row-middle">
				<view class="pictrue">
					<image src="/static/images/group01.png"></image>
				</view>
				<view class="lines"></view>
				<view class="point"> {{point}} 场</view>
				<countDown :is-day="false" :tip-text="' '" :day-text="' '" :hour-text="' : '" :minute-text="' : '" :second-text="' '"
				 :datatime="datatime" :is-col="true" :bgColor="bgColor"></countDown>
			</view>
			<navigator url="/pages/activity/goods_auction/index" hover-class="none" class="more acea-row row-center-wrapper">GO<text class="iconfont icon-xiangyou"></text></navigator>
		</view>
		<view class="conter">
			<scroll-view scroll-x="true" style="white-space: nowrap; vertical-align: middle;" show-scrollbar="false">
				<view class="itemCon" v-for="(item, index) in spikeList" :key="index" @click="goDetail(item)">
					<view class="item">
						<view class="pictrue">
							<image :src="item.image"></image>
						</view>
						<view class="name line1">{{item.title}}</view>
						<view class="x_money line1"><text class="num">￥{{item.price}}</text></view>
						<!-- <view class="y_money line1">¥{{item.otPrice}}</view> -->
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	let app = getApp();
	import countDown from "@/components/countDown";
	import {
		getAuctionIndexApi
	} from '@/api/activity.js';
	export default {
		name: 'a_auction',
		components: {
			countDown
		},
		data() {
			return {
				bgColor: {
					'bgColor': '#fff',
					'Color': '#E93323',
					'width': '44rpx',
					'timeTxtwidth': '16rpx',
					'isDay': true
				},
				spikeList: [], // 秒杀
				point: '',
				datatime: 0,
				status: 0
			}
		},
		created() {
			this.getAuctionIndexTime();
		},
		methods: {
			getAuctionIndexTime() {
				getAuctionIndexApi().then(({data}) => {
					this.spikeList = data ? data.productList : [];
					this.point = data ? data.auctionResponse.time.split(',')[0] : '';
					this.datatime = data ? parseFloat(data.auctionResponse.timeSwap) : '';
					this.status =  data ? data.auctionResponse.status : 0;
				})
			},
			goDetail(item){
				uni.navigateTo({
					url: '/pages/activity/goods_auction_details/index?id=' + item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.default{
		width: 690rpx;
		height: 300rpx;
		border-radius: 14rpx;
		margin: 26rpx auto 0 auto;
		background-color: #ccc;
		text-align: center;
		line-height: 300rpx;
		.iconfont{
			font-size: 80rpx;
		}
	}
	.seckill {
		width: auto;
		height: 420rpx;
		background-image: url(/static/images/value.jpg);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		border-radius: 14rpx;
		margin: 0 auto 30rpx auto;
		padding: 24rpx;
        box-sizing: border-box;
		.title {
			.pictrue {
				width: 148rpx;
				height: 40rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.lines {
				width: 1rpx;
				height: 24rpx;
				background-color: #fff;
				opacity: 0.6;
				margin-left: 16rpx;
			}

			.point {
				font-size: 30rpx;
				color: #fff;
				margin-left: 21rpx;
				margin-right: 4rpx;
				font-weight: 800;
			}
				.styleAll {
					width: 35rpx;
					height: 35rpx;
					background-color: #2F2F2F;
					border-radius: 6rpx;
					color: #fff;
					text-align: center;
				}

			.more {
				width: 86rpx;
				height: 40rpx;
				background: linear-gradient(142deg, #FFE9CE 0%, #FFD6A7 100%);
				opacity: 1;
				border-radius: 18px;
				font-size: 22rpx;
				color: #FE960F;
				padding-left: 8rpx;
                font-weight: 800;
				.iconfont {
					font-size: 21rpx;
				}
			}
		}

		.conter {
			width: 666rpx;
			height: 320rpx;
			border-radius: 12px;
			margin-top: 24rpx;

			.itemCon {
				display: inline-block;
				width: 186rpx;
				margin-right: 24rpx;

				.item {
					width: 100%;

					.pictrue {
						width: 100%;
						height: 186rpx;
						border-radius: 6rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 6rpx;
						}
					}

					.name {
						font-size: 24rpx;
						color: #000;
						margin-top: 14rpx;
					}
					.y_money {
						font-size: 24rpx;
						color: #999999;
						text-decoration: line-through;
					}
					
					.x_money {
						color: #FD502F;
						font-size: 28rpx;
						height: 100%;
						font-weight: bold;
					    margin: 2rpx 0;
						.num {
							font-size: 28rpx;
                            // font-family: 'Guildford Pro';
						}
					}

					.money {
						// background: url("data:image/png;base64,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") no-repeat;
						margin-top: 14rpx;
					}
				}
			}
		}
	}
</style>

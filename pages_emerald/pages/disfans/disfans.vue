<template>
	<view class="disfans-page">
		<iheader title="我的粉丝"></iheader>
		<view class="top-part">
			<view class="item">
				<view class="num">{{members}}</view>
				<view class="name font-sty02">团队人数</view>
			</view>
			<view class="item">
				<view class="num">{{todayInc}}</view>
				<view class="name font-sty02">今日新增</view>
			</view>
		</view>
		<view class="c-list">
			<view v-for="(item,index) in listData" :key="index" class="item font-sty01">
				<view class="left-text">
					<view class="phone">手机：{{item.mobile}}</view>
					<view class="name font-sty02">{{item.clientName}}</view>
					<view class="time font-sty02">{{item.regTime}}</view>
				</view>
				<view class="right-text">
					<view class="add">
						<view>团队人数：</view>
						<view class="num">{{item.total}}</view>
					</view>
					<view class="buy">
						<view>今日买入：</view>
						<view class="num">{{item.buy}}</view>
					</view>
					<view class="buy">
						<view>团队买入：</view>
						<view class="num">{{item.teamBuy}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import iheader from '../../components/header.vue';
import util from '../../utils/util.js'
import config from "../../config";

export default {
		components: {
		    iheader
		},
		data() {
			return {
                members: '',
                todayInc: '',
				listData:[]
			}
		},
        onLoad: function() {
            if (config.debug) console.log("onLoad()");
            this.init()
        },
        onShow: function() {
            if (config.debug) console.log("onShow()");
        },
		methods: {
			init() {
			    let user = util.getUser();
			    if (config.debug) console.log("user", user)
			    if (user === undefined || user.token === undefined || user.uid <= 0) {
			        this.login();
			        return;
			    }

			    this.disFans();
			},
			login() {
			    uni.navigateTo({
			        url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/disfans/disfans')
			    })
			},

            disFans() {
                let that = this;
                let user = util.getUser();
                Promise.all([
                    util.request(config.api.fansTotal, {
                        'clientId': user.clientId
                    }, 'POST', {
                        token: user.token
                    }),
                    util.request(config.api.fansList, {
                        'clientId': user.clientId,
                        'page': that.page,
                        'size': that.size
                    }, 'POST', {
                        token: user.token
                    })
                ]).then(function([resfansTotal, resFansList]) {
                    if (resfansTotal.data) {
                        that.members = resfansTotal.data.members;
                        that.todayInc = resfansTotal.data.todayInc;
                    }

                    if (resFansList.data) {
                        that.listData = resFansList.data;
                    }
                }).catch(function(e) {
                    console.log(e)
                    util.toastError(e.data.msg || e.errMsg)
                }).finally(function() {
                    uni.hideLoading()
                });
            }

		}
	}
</script>

<style lang="scss" scoped>
//1像素的线
@import "../../static/css/mixin.scss";
.disfans-page{
	min-height: 100vh;
	background: #efefef;
	.top-part{
		display: flex;
		background:#fff;
		height: 160rpx;
		box-shadow: 0 0 10rpx rgba(0,0,0,0.1);
		.item{
			flex-grow:1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.num{
				font-size:44rpx;
				text-align: center;
				font-weight:bold;
				color:#ffab63;
			}
			.name{
				text-align: center;
				margin-top: 4rpx;
			}
		}
	}
	.c-list{
		padding-left: 30rpx;
		padding-right: 30rpx;
		margin-top: 20rpx;
		background:#fff;
		.item{
			min-height:220rpx;
			align-items: center;
			display: flex;
			font-size:34rpx;
			position: relative;
			justify-content: space-between;
			@include hair-line-b(#cbcbcb);
			.left-text{
				.phone{
					font-size:40rpx;
					font-weight:bold;
				}
				.name{
					font-size:34rpx;
					margin-top: 12rpx;
				}
				.time{
					font-size:32rpx;
				}
			}
			.right-text{
				font-size:32rpx;
				margin-left: 10rpx;
				.add{
					display: flex;
					.num{
						font-size:32rpx;
					}
				}
				.buy{
					display: flex;
					margin-top: 3rpx;
					.num{
						font-size:32rpx;
					}
				}
				.teamBuy{
					display: flex;
					margin-top: 3rpx;
					.num{
						font-size:32rpx;
					}
				}
			}
		}
	}
}
</style>

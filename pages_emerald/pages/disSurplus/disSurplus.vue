<template>
	<view class="dis-surplus-page">
		<iheader title="余额记录"></iheader>
		<view class="top-part font-size36">
			<view class="left-text font-sty01">交易记录</view>
			<view class="right-text">
				<view class="font-sty02">可用余额:</view>
				<view class="font-sty03">￥{{available}}</view>
			</view>
		</view>
		<view class="c-list font-size36">
			<view class="item" v-for="(item,index) in List" :key="index">
				<view class="left-text">
					<view class="status">{{item.title}}</view>
					<view class="operate-box font-sty02">
						<view class="time">{{item.tips}}</view>
					</view>
				</view>
				<view class="right-text">{{item.price}}</view>
			</view>
		</view>
	</view>
</template>

<script>
import iheader from '../../components/header.vue'
import util from '../../utils/util.js'
import config from "../../config"

export default {
		components: {
		    iheader
		},
		data() {
			return {
				available:0.00,
                page: 1,
                size: 10,
				List:[]
			}
		},
        onLoad: function(op) {
            if (config.debug) console.log("onLoad() op=", op);
            this.init(op);
        },
        onShow: function() {
            if (config.debug) console.log("onShow()");
        },
		methods: {
			init(op) {
			    let that = this
			    let user = util.getUser();
			    if (config.debug) console.log("user", user)
			    if (user === undefined || user.token === undefined || user.uid <= 0) {
			        this.login();
			        return;
			    }
			    that.available = op.available;
                this.list();
			},
			login() {
			    uni.navigateTo({
			        url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/disSurplus/disSurplus')
			    })
			},
            list() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.logList, {
                    'clientId': user.clientId,
                    'page': that.page,
                    'size': that.size
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.List = res.data;
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            }
		}
	}
</script>

<style lang="scss" scoped>
//1像素的线
@import "../../static/css/mixin.scss";
.dis-surplus-page{
	min-height: 100vh;
	background: #efefef;
	.top-part{
		display: flex;
		height: 110rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		align-items: center;
		justify-content: space-between;
		background:#fff;
		.right-text{
			display: flex;
			.price{
				margin-left: 10rpx;
			}
		}
	}
	.c-list{
		background:#fff;
		.item{
			display: flex;
			justify-content: space-between;
			min-height: 160rpx;
			align-items: center;
			position: relative;
			@include hair-line-t(#cbcbcb);
			padding-left: 30rpx;
			padding-right: 30rpx;
			.left-text{
				word-wrap: break-all;
				.status{
					font-weight:bold;
				}
				.operate-box{
					margin-top: 8rpx;
					display: flex;
					font-size:30rpx;
					flex-wrap:wrap;
					.time{
						margin-left: 5rpx;
					}
					.operate{
						margin-left: 5rpx;
					}
				}
			}
			.right-text{
				font-weight:bold;
			}
		}
	}
}
</style>

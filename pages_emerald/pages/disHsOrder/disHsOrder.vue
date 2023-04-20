<template>
	<view class="dishsorder-page">
		<iheader title="管理中心"></iheader>
		<view class="main-list">
			<view class="item" v-for="(item,index) in listData" :key="index">
				<view class="name font-sty01">{{item.roomName}}</view>
				<view class="orderName font-sty02">预约人：{{item.clientName}}</view>
				<view class="time font-sty02 font-sty02">预约时间：{{item.subTime}}</view>
				<view class="priceLevel font-sty02 font-sty02 font-sty02">预约范围：{{item.clientLevel}}</view>
				<view v-if="status === 0" class="status font-sty02">已预约</view>
				<view v-if="status === 1" class="status font-sty02">配单成功</view>
				<view v-if="status === 2" class="status font-sty02">配单失败</view>
			</view>
		</view>
	</view>
</template>

<script>
import iheader from '../../components/header.vue'
import util from '../../utils/util.js'
import config from "../../config";

export default {
		components: {
		    iheader
		},
		data() {
			return {
				status:0,
                listData: [{
                    roomName: '',
                    clientName: '',
                    subTime: '',
                    clientLevel: '',
                    status: ''
                }]
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

            	this.roomSub();
            },
            login() {
            	uni.navigateTo({
            		url: '/pages/login/login?redirect=' + encodeURIComponent(
            			'/pages/disHsOrder/disHsOrder')
            	})
            },
            roomSub() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.roomSub, {
                    'clientId': user.clientId,
                    'page': that.page,
                    'size': that.size
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.listData = res.data;

                        if (that.listData.length == 0) {
                            util.toastError('暂无预约！');
                        }
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
.dishsorder-page{
	min-height: 100vh;
	background: #fff;
	.main-list{
		.item{
			position: relative;
			padding:30rpx;
			@include hair-line-b(#cbcbcb);
			font-size:30rpx;
			.status{
				position: absolute;
				right: 20rpx;
				top: 30rpx;
				font-size:32rpx;
			}
			.name{
				font-size:36rpx;
				font-weight:bold;
			}
			.orderName{
				margin-top: 10rpx;
			}
			.time{
				margin-top: 3rpx;
			}
			.priceLevel{
				margin-top: 3rpx;
			}
		}
	}
}
</style>

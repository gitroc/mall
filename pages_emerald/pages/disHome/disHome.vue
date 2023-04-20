<template>
    <view class="dishome-box">
        <iheader title="分销中心"></iheader>
        <view class="dishome-content">
            <view class="top-part">
                <image :src='roomLogo' class="me-icon" mode="widthFix"></image>
                <view class="text-box">
                    <view class="phone">{{mobile}}</view>
                    <view class="recommend">
                        <view>推荐人：</view>
                        <view class="name">{{inviteMobile}}</view>
                    </view>
                    <view class="label">{{clientDesp}}</view>
                </view>
            </view>
            <view class="yq-box">
                <view>我的邀请码：</view>
                <view class="yq">{{inviteCode}}</view>
                <view class="fz" @click="copy(inviteCode)">复制</view>
            </view>
            <!-- 我的佣金 start -->
            <view class="my-commission-box">
                <view class="left-text">
                    <image class="me-icon" mode="widthFix" src='../../static/images/center-icon-jk.png'></image>
                    <view class="my-commission font-sty01">我的佣金</view>
                </view>
                <navigator :url="'/pages/disCash/disCash?available='+ available">
                    <view class="right-text font-sty02">
                        <view>佣金提现</view>
                        <image class="next" mode="widthFix" src='../../static/images/next.png'></image>
                    </view>
                </navigator>
                <view class="price-box">
                    <view class="item">
                        <navigator :url="'/pages/disSurplus/disSurplus?available='+ available">
                            <view class="cash">{{available}}</view>
                            <view>可提现佣金(元)</view>
                        </navigator>
                    </view>
                    <view class="item">
                        <navigator url="/pages/disCashDetail/disCashDetail">
                            <view class="cash">{{used}}</view>
                            <view>已提现佣金(元)</view>
                        </navigator>
                    </view>
                </view>
            </view>
            <!-- 我的佣金 end -->

            <view class="label-list">
                <view class="item item01" @click="linkTo(1)">
                    <image class="invite" mode="widthFix" src="../../static/images/invite_award.png"></image>
                    <view class="text-box">
                        <view class="name font-sty01">推广佣金</view>
                        <view class="num-box font-sty02">
                            <view class="price">{{total}}</view>
                            <view class="unit">元</view>
                        </view>
                    </view>
                </view>
                <view class="item item02" @click="linkTo(2)">
                    <image class="invite" mode="widthFix" src="../../static/images/invite_orders.png"></image>
                    <view class="text-box">
                        <view class="name font-sty01">推广订单</view>
                        <view class="num-box font-sty02">
                            <view class="price">{{orders}}</view>
                            <view class="unit">笔</view>
                        </view>
                    </view>
                </view>
                <view class="item item03" @click="linkTo(3)">
                    <image class="invite" mode="widthFix" src="../../static/images/withdrawlogs.png"></image>
                    <view class="text-box">
                        <view class="name font-sty01">提现明细</view>
                        <view class="num-box font-sty02">
                            <view class="price">{{used}}</view>
                            <view class="unit">元</view>
                        </view>
                    </view>
                </view>
                <view class="item item04" @click="linkTo(4)">
                    <image class="invite" mode="widthFix" src="../../static/images/fans.png"></image>
                    <view class="text-box">
                        <view class="name font-sty01">我的粉丝</view>
                        <view class="num-box font-sty02">
                            <view class="price">{{fans}}</view>
                            <view class="unit">人</view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 业绩统计 start -->
            <view class="achievement-box" @click="popularize">
                <view class="left-text">
                    <image class="me-icon" mode="widthFix" src='../../static/images/ranking.png'></image>
                    <view class="my-commission font-sty01">业绩统计</view>
                </view>
                <view class="right-text font-sty02">
                    <image class="next" mode="widthFix" src='../../static/images/next.png'></image>
                </view>
            </view>
            <!-- 业绩统计 end -->
            <!-- 管理中心 start -->
            <view v-if="roomOwner === 1" class="operate-box" @click="operate">
                <view class="left-text">
                    <image class="me-icon" mode="widthFix" src='../../static/images/workbench.png'></image>
                    <view class="my-commission font-sty01">管理中心</view>
                </view>
                <view class="right-text font-sty02">
                    <image class="next" mode="widthFix" src='../../static/images/next.png'></image>
                </view>
            </view>
            <!-- 管理中心 end -->
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
                roomLogo: '',
                inviteMobile: '',
                mobile: '',
                inviteCode: '',
                clientDesp: '',
                roomOwner: '',
                available: '0.00',
                total: '0.00',
                used: '0.00',
                orders: 0,
                fans: 0,
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

                this.disHome();
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/disHome/disHome')
                })
            },
            disHome() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.disHome, {
                    'clientId': user.clientId
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.roomLogo = res.data.roomLogo;
                        that.mobile = res.data.mobile;
                        that.inviteMobile = res.data.inviteMobile;
                        that.inviteCode = res.data.inviteCode;
                        that.roomOwner = res.data.roomOwner;
                        that.clientDesp = res.data.clientDesp;
                        that.available = res.data.available;
                        that.total = res.data.total;
                        that.used = res.data.used;
                        that.orders = res.data.orders;
                        that.fans = res.data.fans;
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
	                if (e.data.code === '000009') {
		                that.times = 0;
		                util.clearUser();
		                util.toastError(e.data.msg || e.errMsg);
		                setTimeout(function() {
			                that.login();
		                }, 1000)
	                } else {
		                util.toastError(e.data.msg || e.errMsg);
	                }
                });
            },
            copy(text) {
                uni.setClipboardData({
                    data: text, //要被复制的内容
                    success: () => { //复制成功的回调函数
                        uni.showToast({ //提示
                            title: '复制成功'
                        })
                    }
                });
            },
            popularize() {
                setTimeout(function() {
                    uni.navigateTo({
                        url: '/pages/disPopularize/disPopularize'
                    }, 1500)
                })
            },
            operate() {
                setTimeout(function() {
                    uni.navigateTo({
                        url: '/pages/disOperate/disOperate'
                    }, 1500)
                })
            },
            linkTo(index) {
                let that = this;
                switch (index) {
                    case 1:
                        setTimeout(function() {
                            uni.navigateTo({
                                url: '/pages/disSurplus/disSurplus?available=' + that.available
                            }, 1500)
                        })
                        break;
                    case 2:
                        setTimeout(function() {
                            uni.navigateTo({
                                url: '/pages/disPopularize/disPopularize'
                            }, 1500)
                        })
                        break;
                    case 3:
                        setTimeout(function() {
                            uni.navigateTo({
                                url: '/pages/disCashDetail/disCashDetail'
                            }, 1500)
                        })
                        break;
                    case 4:
                        setTimeout(function() {
                            uni.navigateTo({
                                url: '/pages/disfans/disfans'
                            }, 1500)
                        })
                        break;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    //1像素的线
    @import "../../static/css/mixin.scss";

    .dishome-box {
        min-height: 100vh;
        background: #efefef;

        .dishome-content {
            .top-part {
                padding: 30rpx;
                background: rgb(250, 250, 250);
                display: flex;

                .me-icon {
                    display: block;
                    width: 160rpx;
                    height: 160rpx;
                    border-radius: 50%;
                }

                .text-box {
                    flex: 1;
                    height: 170rpx;
                    margin-top: -16rpx;
                    align-items: center;
                    margin-left: 20rpx;

                    .phone {
                        font-size: 46rpx;
                        margin-top: 15rpx;
                    }

                    .recommend {
                        display: flex;
                        margin-top: 5rpx;
                        margin-left: 7rpx;
                        font-size: 36rpx;
                    }

                    .label {
                        margin-top: 6rpx;
                        font-size: 34rpx;
                        margin-left: 7rpx;
                    }
                }
            }

            .yq-box {
                display: flex;
                height: 80rpx;
                align-items: center;
                background: #fff;
                font-size: 34rpx;
                box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
                padding-left: 30rpx;

                .yq {
                    margin-right: 20rpx;
                }

                .fz {
                    color: #f29400;
                }
            }

            .my-commission-box {
                display: flex;
                flex-wrap: wrap;
                padding-right: 0rpx;
                justify-content: space-between;
                font-size: 34rpx;
                margin-top: 25rpx;
                background: #fff;
                box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);

                .left-text {
                    display: flex;
                    height: 90rpx;
                    align-items: center;
                    margin-left: 30rpx;

                    image {
                        display: block;
                        width: 58rpx;
                        margin-right: 20rpx;
                    }
                }

                .right-text {
                    display: flex;
                    height: 90rpx;
                    align-items: center;

                    .next {
                        right: 20rpx;
                        width: 32rpx;
                        display: block;
                        margin-left: 20rpx;
                    }
                }

                .price-box {
                    flex: none;
                    width: 100%;
                    display: flex;
                    background: #fff;
                    height: 180rpx;
                    position: relative;
                    @include hair-line-t(#cbcbcb);

                    .item {
                        flex: none;
                        width: 50%;
                        text-align: center;
                        position: relative;

                        .cash {
                            color: #f29400;
                            font-size: 46rpx;
                            text-align: center;
                            margin-top: 36rpx;
                            margin-bottom: 3rpx;
                        }
                    }
                }
            }

            .label-list {
                display: flex;
                margin-top: 25rpx;
                flex-wrap: wrap;
                background: #fff;

                .item {
                    flex: none;
                    width: 50%;
                    display: flex;
                    height: 160rpx;
                    align-items: center;
                    position: relative;

                    image {
                        display: flex;
                        width: 65rpx;
                        height: 65rpx;
                        margin-left: 36rpx;
                    }

                    .text-box {
                        margin-left: 20rpx;

                        .name {
                            font-size: 34rpx;
                        }

                        .num-box {
                            display: flex;
                            font-size: 34rpx;
                            margin-right: 6rpx;

                            .price {}
                        }
                    }
                }

                .item01:after {
                    content: '';
                    position: absolute;
                    height: 100%;
                    right: 0;
                    width: 1rpx;
                    border-right: 1rpx solid #cbcbcb;
                }

                .item01:before {
                    content: '';
                    position: absolute;
                    height: 1rpx;
                    width: 100%;
                    bottom: 0;
                    border-bottom: 1rpx solid #cbcbcb;
                }

                .item02:before {
                    content: '';
                    position: absolute;
                    height: 1rpx;
                    width: 100%;
                    bottom: 0;
                    border-bottom: 1rpx solid #cbcbcb;
                }

                .item03:after {
                    content: '';
                    position: absolute;
                    height: 100%;
                    right: 0;
                    width: 1rpx;
                    border-right: 1rpx solid #cbcbcb;
                }
            }

            .achievement-box {
                display: flex;
                flex-wrap: wrap;
                padding-right: 0rpx;
                justify-content: space-between;
                font-size: 34rpx;
                margin-top: 25rpx;
                background: #fff;
                box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);

                .left-text {
                    display: flex;
                    height: 90rpx;
                    align-items: center;
                    margin-left: 30rpx;

                    image {
                        display: block;
                        width: 58rpx;
                        margin-right: 20rpx;
                    }
                }

                .right-text {
                    display: flex;
                    height: 90rpx;
                    align-items: center;

                    .next {
                        right: 20rpx;
                        width: 32rpx;
                        display: block;
                        margin-left: 20rpx;
                    }
                }
            }

            .operate-box {
                display: flex;
                flex-wrap: wrap;
                padding-right: 0rpx;
                justify-content: space-between;
                font-size: 34rpx;
                margin-top: 25rpx;
                background: #fff;
                box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);

                .left-text {
                    display: flex;
                    height: 90rpx;
                    align-items: center;
                    margin-left: 30rpx;

                    image {
                        display: block;
                        width: 58rpx;
                        margin-right: 20rpx;
                    }
                }

                .right-text {
                    display: flex;
                    height: 90rpx;
                    align-items: center;

                    .next {
                        right: 20rpx;
                        width: 32rpx;
                        display: block;
                        margin-left: 20rpx;
                    }
                }
            }
        }
    }
</style>

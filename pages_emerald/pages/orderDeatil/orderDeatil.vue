<template>
    <view class="orderDeatil-page">
        <iheader title="预约时间"></iheader>
        <view class="mode mode01">
            <view class="subtitle">
                <view class="left-icon"></view>
                <view class="title">预约房间</view>
            </view>
            <view class="c-list">
                <view class="c-item">
                    <view class="left-name">当前房间</view>
                    <view class="right-box">{{roomName}}</view>
                </view>
                <view class="c-item">
                    <view class="left-name">房间状态</view>
                    <view class="right-box">{{status}}</view>
                </view>
                <view class="c-item">
                    <view class="left-name">营业时间</view>
                    <view class="right-box">{{timeOpen}}</view>
                </view>
            </view>
        </view>
        <view class="mode mode02">
            <view class="subtitle">
                <view class="left-icon"></view>
                <view class="title">预约范围</view>
            </view>
            <view class="c-list">
                <view class="c-item" :class="{'active':priceLevel === 1}" @click="priceLevel = 1">
                    <view class="left-name">低价值</view>
                    <view class="check-box">
                        <view class="price-box">2000-3000</view>
                        <image src="../../static/images/check.png" class="check" mode="widthFix"></image>
                    </view>
                </view>
                <view class="c-item" :class="{'active':priceLevel === 2}" @click="priceLevel = 2">
                    <view class="left-name">中价值</view>
                    <view class="check-box">
                        <view class="price-box">3000-5000</view>
                        <image src="../../static/images/check.png" class="check" mode="widthFix"></image>
                    </view>
                </view>
                <view class="c-item" :class="{'active':priceLevel === 3}" @click="priceLevel = 3">
                    <view class="left-name">高价值</view>
                    <view class="check-box">
                        <view class="price-box">5000-8000</view>
                        <image src="../../static/images/check.png" class="check" mode="widthFix"></image>
                    </view>
                </view>
                <view class="c-item" :class="{'active':priceLevel === 4}" @click="priceLevel = 4">
                    <view class="left-name">极高价值</view>
                    <view class="check-box">
                        <view class="price-box">8000以上</view>
                        <image src="../../static/images/check.png" class="check" mode="widthFix"></image>
                    </view>
                </view>
            </view>
        </view>
        <view class="btn" @click="subscribe">确定预约</view>
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
                priceLevel: 4,
                roomName: '',
                status: '',
                timeOpen: ''
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
                let that = this
                let user = util.getUser();
                if (config.debug) console.log("user", user)
                if (user === undefined || user.token === undefined || user.uid <= 0) {
                    this.login();
                    return;
                }

                util.request(config.api.initRoom, {
                    'clientId': user.clientId
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.roomName = res.data.roomName;
                        that.status = '营业中';
                        that.timeOpen = res.data.openStart + '-' + res.data.openEnd;
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/orderDetail/orderDetail')
                })
            },
            subscribe() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.subscribe, {
                    'clientId': user.clientId,
                    'priceLevel': that.priceLevel
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        util.toastError('预约成功！');
                        setTimeout(function() {
                            uni.navigateTo({
                                url: '/pages/orderTime/orderTime?redirect=' +
                                    encodeURIComponent('/pages/orderDeatil/orderDeatil')
                            })
                        }, 1500)
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/orderTime/orderTime?redirect=' + encodeURIComponent(
                                '/pages/orderDeatil/orderDeatil')
                        })
                    }, 1500)
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    //1现实的线
    @import "../../static/css/mixin.scss";

    .orderDeatil-page {
        min-height: 100vh;
        background: #efefef;

        .mode {
            .subtitle {
                font-size: 34rpx;
                height: 80rpx;
                line-height: 80rpx;
                display: flex;
                align-items: center;

                .left-icon {
                    width: 8rpx;
                    height: 36rpx;
                    background: #439057;
                    margin-left: 30rpx;
                    margin-right: 15rpx;
                }
            }

            .c-list {
                background: #fff;

                .c-item {
                    height: 100rpx;
                    display: flex;
                    align-items: center;
                    padding-left: 30rpx;
                    padding-right: 30rpx;
                    justify-content: space-between;
                    position: relative;
                    @include hair-line-b(#cbcbcb);

                    .right-box {
                        color: #666;
                    }

                    .check-box {
                        display: flex;
                        color: #666;

                        .check {
                            width: 40rpx;
                            margin-left: 20rpx;
                            opacity: 0;
                        }
                    }
                }

                .active {
                    .check-box {
                        display: flex;

                        .check {
                            opacity: 1;
                        }
                    }
                }

                .c-item:last-child {
                    border: none;
                }
            }
        }

        .btn {
            margin-left: 20rpx;
            margin-right: 20rpx;
            background: #439057;
            color: #fff;
            height: 70rpx;
            line-height: 70rpx;
            border-radius: 6rpx;
            margin-top: 40rpx;
            text-align: center;
        }
    }
</style>

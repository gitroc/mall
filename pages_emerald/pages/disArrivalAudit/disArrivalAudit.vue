<template>
    <view class="disArrivalAudit-page">
        <iheader title="上架审核"></iheader>
        <!-- 头部tab -->
        <headTab :navList="navData" @change="changeTab" />
        <view class="list-box">
            <view v-for="(item,index) in listData" :key="index" class="list-item">
                <view class="list-top">
                    <view class="order-id">
                        <text>单号：</text>
                        <text class="num">{{item.orderId}}</text>
                    </view>
                    <view v-if="item.status === 1 && item.isVerify === 0" class="status dfk">待付款</view>
                    <view v-if="item.status === 1 && item.isVerify === 1" class="status dfk">已付款</view>
                    <view v-if="item.status === 2 && item.isVerify === 1" class="status dqr">已收款</view>
                    <view v-if="item.status === 3 && item.isVerify === 0" class="status dqr">待审核</view>
                    <view v-if="item.status === 3 && item.isVerify === 1" class="status dqr">已上架</view>
                </view>
                <view class="list-content">
                    <view class="img-box">
                        <image :src='item.goodsCarousel' class="screen"></image>
                    </view>
                    <view class="text-box">
                        <view class="name">{{item.goodsName}}</view>
                        <view class="order-num">编号：{{item.goodsId}}</view>
                        <view class="sell-box">
                            <view class="label">卖家</view>
                            <view class="sell-name">{{item.sellerName}}</view>
                            <view class="sell-people">({{item.sellerMobile}})</view>
                        </view>
                        <view class="buy-box">
                            <view class="label">买家</view>
                            <view class="buy-name">{{item.buyerName}}</view>
                            <view class="buy-people">({{item.buyerMobile}})</view>
                        </view>
                    </view>
                </view>
                <view class="time-box">
                    <view class="qg-time">
                        <text>买入时间:</text>
                        <text class="time">{{item.orderTime}}</text>
                    </view>
                    <view class="price font-sty03">
                        <text>价值:</text>
                        <text>￥{{item.realPrice}}</text>
                    </view>
                </view>
                <view class="price-box">
                    <view class="require-time">
                        <text>确认时间:</text>
                        <text class="time">{{item.dealTime}}</text>
                    </view>
                    <view class="sj-price font-sty03">
                        <text>上架费:</text>
                        <text>￥{{item.listFee}}</text>
                    </view>
                </view>
                <view v-if="item.status === 3 && item.isVerify === 0" class="btn-box">
                    <view class="btn" @click="audit(item)">审核上架</view>
                </view>
                <view v-if="item.status === 1 && item.isVerify === 0" class="btn-box">
                    <view class="btn" @click="transfer(item)">转拍</view>
                </view>
                <view v-if="item.status === 1 && item.isVerify === 1" class="btn-box">
                    <view class="btn" @click="confirm(item)">确认收款</view>
                </view>
                <view v-if="item.status === 2 && item.isVerify === 1" class="btn-box">
                    <view class="btn" @click="apply(item)">申请上架</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import iheader from '../../components/header.vue'
import headTab from '../../components/headTab.vue'
import util from '../../utils/util.js'
import config from "../../config";

export default {
        components: {
            iheader,
            headTab
        },
        data() {
            return {
                index: 0,
                page: 1,
                size: 10,
                navData: ['待审上架', '已审上架', '未申上架'],
                listFee: 0,
                listData: []
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
                this.changeTab(0);
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent(
                        '/pages/disArrivalAudit/disArrivalAudit')
                })
            },
            changeTab(index) {
                this.index = index;
                this.orderList();
            },
            orderList() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.auditList, {
                    'clientId': user.clientId,
                    'status':  this.index,
                    'page': that.page,
                    'size': that.size
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.listData = res.data;
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },
            audit(item) {
                let that = this;
                let user = util.getUser();
                uni.showModal({
                    title: '温馨提示',
                    content: '确定已经收到申请人支付的￥' + item.listFee + '元上架费？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.audit, {
                                'clientId': user.clientId,
                                'orderId': item.orderId,
                            }, 'POST', {
                                token: user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("审核成功");
                                    setTimeout(function() {
                                        that.orderList();
                                    }, 1000)
                                }
                            }).catch((e) => {
                                if (config.debug) console.log(e);
                                util.toastError(e.data.msg || e.errMsg)
                            });
                        }
                    }
                })
            },
            transfer(item) {
                let that = this;
                let user = util.getUser();
                uni.showModal({
                    title: '温馨提示',
                    content: '确定转拍' + item.goodsName + '吗？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.auditTransfer, {
                                'clientId': user.clientId,
                                'orderId': item.orderId,
                            }, 'POST', {
                                token: user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("转拍成功，请去首页秒杀");
                                    setTimeout(function() {
                                        that.orderList();
                                    }, 1000)
                                }
                            }).catch((e) => {
                                if (config.debug) console.log(e);
                                util.toastError(e.data.msg || e.errMsg)
                            });
                        }
                    }
                })
            },
            confirm(item) {
                let that = this;
                let user = util.getUser();
                uni.showModal({
                    title: '温馨提示',
                    content: '确定代卖家' + item.sellerName + '收款吗？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.auditConfirm, {
                                'clientId': user.clientId,
                                'orderId': item.orderId,
                            }, 'POST', {
                                token: user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("代卖家收款成功，请通知买家上架");
                                    setTimeout(function() {
                                        that.orderList();
                                    }, 1000)
                                }
                            }).catch((e) => {
                                if (config.debug) console.log(e);
                                util.toastError(e.data.msg || e.errMsg)
                            });
                        }
                    }
                })
            },
            apply(item) {
                let that = this;
                let user = util.getUser();
                uni.showModal({
                    title: '温馨提示',
                    content: '确定代买家' + item.buyerName + '申请上架吗？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.auditApply, {
                                'clientId': user.clientId,
                                'orderId': item.orderId,
                            }, 'POST', {
                                token: user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("申请成功，请及时审核买家申请");
                                    setTimeout(function() {
                                        that.orderList();
                                    }, 1000)
                                }
                            }).catch((e) => {
                                if (config.debug) console.log(e);
                                util.toastError(e.data.msg || e.errMsg)
                            });
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    //1像素的线
    @import "../../static/css/mixin.scss";

    .disArrivalAudit-page {
        min-height: 100vh;
        background: #efefef;
        position: relative;

        .list-box {
            .list-item {
                background: #fff;
                margin-bottom: 20rpx;

                .list-top {
                    display: flex;
                    height: 80rpx;
                    align-items: center;
                    padding-left: 20rpx;
                    padding-right: 20rpx;
                    font-size: 32rpx;
                    justify-content: space-between;
                    position: relative;
                    @include hair-line-b(#cbcbcb);

                    .status {
                        color: #f29400;
                    }
                }

                .list-content {
                    display: flex;
                    padding: 26rpx 30rpx 26rpx 30rpx;

                    .img-box {
                        width: 230rpx;
                        height: 200rpx;
                        margin-right: 20rpx;
                        border-radius: 12rpx;
                        overflow: hidden;
                        flex-shrink: 1;

                        image {
                            display: block;
                            width: 100%;
                            height: 200rpx;
                        }
                    }

                    .text-box {
                        font-size: 38rpx;
                        flex: 1;
                        overflow: hidden;
                        word-break: break-all;

                        .name {
                            flex: 1;
                            margin-top: -5rpx;
                            word-break: break-all;
                        }

                        .order-num {
                            margin-top: 0rpx;
                            word-break: break-all;
                        }

                        .sell-box {
                            display: flex;
                            color: #010101;
                            font-size: 32rpx;
                            margin-top: 10rpx;

                            .label {
                                width: 80rpx;
                                height: 40rpx;
                                line-height: 40rpx;
                                margin-right: 10rpx;
                                text-align: center;
                                color: #fff;
                                background: #439057;
                            }
                        }

                        .buy-box {
                            display: flex;
                            color: #010101;
                            font-size: 32rpx;
                            margin-top: 10rpx;

                            .label {
                                width: 80rpx;
                                height: 40rpx;
                                text-align: center;
                                margin-right: 10rpx;
                                line-height: 40rpx;
                                color: #fff;
                                background: #f29400;
                            }
                        }
                    }
                }

                .time-box {
                    display: flex;
                    height: 80rpx;
                    align-items: center;
                    padding-left: 20rpx;
                    padding-right: 20rpx;
                    font-size: 32rpx;
                    justify-content: space-between;
                    position: relative;
                    @include hair-line-t(#cbcbcb);

                    .time {
                        font-size: 32rpx;
                        margin-left: 16rpx;
                    }

                    .price {
                        font-size: 34rpx;
                        font-weight: bold;
                    }
                }

                .price-box {
                    display: flex;
                    justify-content: space-between;
                    height: 80rpx;
                    align-items: center;
                    font-size: 34rpx;
                    font-weight: bold;
                    padding-left: 20rpx;
                    padding-right: 20rpx;
                    position: relative;
                    @include hair-line-t(#cbcbcb);

                    .require-time {
                        font-weight: normal;
                        font-size: 32rpx;

                        .time {
                            margin-left: 16rpx;
                        }
                    }
                }

                .btn-box {
                    display: flex;
                    justify-content: flex-end;
                    height: 90rpx;
                    align-items: center;
                    padding-right: 20rpx;
                    position: relative;
                    @include hair-line-t(#cbcbcb);

                    .btn {
                        background: #439057;
                        padding-left: 20rpx;
                        padding-right: 20rpx;
                        height: 50rpx;
                        line-height: 50rpx;
                        text-align: center;
                        font-size: 32rpx;
                        color: #fff;
                        border-radius: 6rpx;
                        margin-left: 15rpx;
                    }
                }
            }
        }

        .audit-box {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 100;

            .center-box {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                height: 300rpx;
                background: #fff;

                .name {
                    font-size: 36rpx;
                    padding-top: 20rpx;
                    padding-left: 30rpx;
                }

                .tip {
                    margin-left: 30rpx;
                    margin-right: 30rpx;
                    height: 80rpx;
                    font-size: 34rpx;
                    margin-top: 25rpx;
                }

                .btn-box {
                    display: flex;
                    margin-top: 35rpx;
                    justify-content: space-between;
                    padding-left: 40rpx;
                    padding-right: 40rpx;
                    border-top: 1rpx solid #cdcdcd;

                    .btn {
                        flex: none;
                        width: 50%;
                        height: 90rpx;
                        line-height: 90rpx;
                        text-align: center;
                        font-size: 34rpx;
                        color: #41a96a;
                    }

                    .cancel {
                        position: relative;
                    }

                    .cancel:after {
                        position: absolute;
                        content: '';
                        right: 0;
                        top: 0;
                        width: 1rpx;
                        height: 100%;
                        background: #cbcbcb;
                    }
                }
            }
        }
    }
</style>

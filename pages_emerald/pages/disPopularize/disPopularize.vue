<template>
    <view class="dis-popularize-box">
        <iheader title="推广订单"></iheader>
        <view class="top-part font-white">
            <view class="total-trade">
                <view>今日交易总金额：</view>
                <view class="price">￥{{prices}}</view>
            </view>
            <view class="total-order">
                <view>订单数量：</view>
                <view class="price">{{orders}}</view>
            </view>
        </view>
        <view class="list-box">
            <view v-for="(item,index) in listData" :key="index" class="list-item">
                <view class="list-top">
                    <view class="order-id">
                        <text>单号：</text>
                        <text class="num">{{item.orderId}}</text>
                    </view>
                    <view v-if="item.status === 1 && item.isVerify === 0" class="status dfk">待付款</view>
                    <view v-if="item.status === 1 && item.isVerify === 1" class="status dfk">待收款</view>
                    <view v-if="item.status === 2 && item.isVerify === 0" class="status dqr">待上架</view>
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
                        <text>下单时间:</text>
                        <text class="time">{{item.orderTime}}</text>
                    </view>
                    <view class="price font-sty03">
                        <text>实付:</text>
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
                page: 1,
                size: 50,
                prices: '',
                orders: '',
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
                this.loadData();
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/disHome/disHome')
                })
            },
            loadData() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.seoOrders, {
                    'clientId': user.clientId,
                    'page': that.page,
                    'size': that.size
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.prices = res.data.prices;
                        that.orders = res.data.orders;
                        that.listData = res.data.orderList
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

    .dis-popularize-box {
        min-height: 100vh;
        background: #efefef;

        .top-part {
            background: #b5d673;
            height: 80rpx;
            display: flex;
            align-items: center;
            padding-left: 30rpx;
            padding-right: 30rpx;
            font-size: 34rpx;

            .total-trade {
                display: flex;
            }

            .total-order {
                display: flex;
                margin-left: 10rpx;
            }
        }

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

                        .sell-box {
                            display: flex;
                            color: #010101;
                            font-size: 32rpx;
                            margin-top: 15rpx;

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
                            margin-top: 12rpx;

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
            }
        }
    }
</style>

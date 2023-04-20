<template>
    <view class="pay-page">
        <iheader title="支付页面"></iheader>
        <view class="pay-content">
            <view class="goods-top">
                <view class="list-content">
                    <view class="img-box">
                        <image class="screen" :src="item.goodsCarousel"></image>
                    </view>
                    <view class="text-box">
                        <view class="name">{{item.goodsName}}</view>
                        <view class="order-num">编号：{{item.goodsId}}</view>
                        <view class="sell-box">
                            <view class="sell-name">持有人：{{item.sellerName}}({{item.sellerMobile}})</view>
                        </view>
                        <view class="price-box">
                            <view class="label">当前出价：</view>
                            <view class="price">￥{{item.realPrice}}</view>
                        </view>
                        <view class="total-price-box">
                            <view class="label">订单总价：</view>
                            <view class="price">￥{{item.realPrice}}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="pay-box">
                <view class="title-box">
                    <view class="left-icon"></view>
                    <view class="title">收款方式</view>
                </view>
                <view class="bank-box">
                    <view class="item">
                        <view class="label">收款银行</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db">
                                <view class="uni-input">{{bank.bankName}}</view>
                            </view>
                            <image class="card" mode="widthFix" src="../../static/images/copy.png"
                                @click="copy(bank.bankName)"></image>
                        </view>
                    </view>
                    <view class="item">
                        <view class="label">开户行</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db">
                                <view class="uni-input">{{bank.bankOpen}}</view>
                            </view>
                            <image class="card" mode="widthFix" src="../../static/images/copy.png"
                                @click="copy(bank.bankOpen)"></image>
                        </view>
                    </view>
                    <view class="item">
                        <view class="label">收款账号</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db">
                                <view class="uni-input">{{bank.bankNo}}</view>
                            </view>
                            <image class="card" mode="widthFix" src="../../static/images/copy.png"
                                @click="copy(bank.bankNo)"></image>
                        </view>
                    </view>
                    <view class="item">
                        <view class="label">收款姓名</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db">
                                <view class="uni-input">{{bank.clientName}}</view>
                            </view>
                            <image class="card" mode="widthFix" src="../../static/images/copy.png"
                                @click="copy(bank.bankNo)"></image>
                        </view>
                    </view>
                </view>
            </view>
            <view class="pay-box02">
                <view class="title-box">
                    <view class="left-icon"></view>
                    <view class="title">付款确认</view>
                </view>
                <view class="countdown-box">
                    <view>付款倒计时</view>
                    <view class="time">
                        <uni-countdown :fontSize="18" :hour="1" :minute="12" :second="40" :show-colon="false"
                            :show-day="false"></uni-countdown>
                    </view>
                </view>
            </view>
            <view class="btn" @click="confirmPay()">确认付款</view>
        </view>
    </view>
</template>

<script>
import uniCountdown from "@dcloudio/uni-ui/lib/uni-countdown/uni-countdown.vue"
import iheader from '../../components/header.vue'
import config from "../../config";
import util from '../../utils/util.js'

export default {
        components: {
            uniCountdown,
            iheader
        },
        data() {
            return {
                redirect: '',
                user: {},
                item: {
                    orderId: '',
                    goodsCarousel: '',
                    goodsName: '',
                    goodsId: '',
                    roomName: '',
                    sellerName: '',
                    sellerMobile: '',
                    realPrice: 0
                },
                bank: {
                    clientName: '',
                    bankName: '',
                    bankOpen: '',
                    bankNo: '',
                }
            }
        },
        onLoad: function(op) {
            if (config.debug) console.log("onLoad() op=", op);
            this.init(op);
        },
        onShow: function() {
            if (config.debug) console.log("onShow()");
        },
        mounted() {
            setTimeout(() => {
                this.testHour = 1
                this.testMinute = 1
                this.testSecond = 0
                this.start = true
            }, 3000)
            setTimeout(() => {
                this.start = false
            }, 10000)
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
                that.user = user;
                that.redirect = op.redirect;
                if (op.item) {
                    let item = JSON.parse(op.item);
                    this.getItem(item);
                    this.getBank();
                }
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
            getItem(item) {
                let that = this;
                that.item.orderId = item.orderId;
                that.item.goodsCarousel = item.goodsCarousel;
                that.item.goodsName = item.goodsName;
                that.item.goodsId = item.goodsId;
                that.item.roomName = item.roomName;
                that.item.sellerName = item.sellerName
                that.item.sellerMobile = item.sellerMobile;
                that.item.realPrice = item.realPrice;
            },
            getBank() {
                let that = this;
                util.request(config.api.getBank, {
                    'clientId': that.user.clientId,
                    'mobile': that.item.sellerMobile
                }, 'POST', {
                    token: that.user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.bank.clientName = res.data.clientName;
                        that.bank.bankName = res.data.bankName;
                        that.bank.bankOpen = res.data.bankOpen;
                        that.bank.bankNo = res.data.bankNo;
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },
            confirmPay() {
                let that = this;
                uni.showModal({
                    title: '温馨提示',
                    content: '您确定已经付款了吗？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.pay, {
                                'clientId': that.user.clientId,
                                'orderId': that.item.orderId,
                            }, 'POST', {
                                token: that.user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("付款成功");
                                    setTimeout(function() {
                                        uni.switchTab({
                                            url: that.redirect,
                                            success(res) {
                                                if (config.debug) console.log(
                                                    'switchTab success, res is:',
                                                    res)
                                                let page = getCurrentPages().pop();
                                                page.orderList();
                                            }
                                        })
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
    //1现实的线
    @import "../../static/css/mixin.scss";

    .pay-page {
        min-height: 100vh;
        background: #efefef;

        .list-content {
            display: flex;
            align-items: center;
            background: #fff;
            padding: 26rpx 30rpx 26rpx 30rpx;
            box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);

            .img-box {
                width: 230rpx;
                height: 200rpx;
                margin-right: 20rpx;
                border-radius: 12rpx;
                overflow: hidden;

                image {
                    display: block;
                    width: 100%;
                    height: 200rpx;
                }
            }

            .text-box {
                font-size: 34rpx;

                .sell-box {
                    display: flex;
                    color: #666;
                    font-size: 30rpx;
                    margin-top: 8rpx;
                }

                .price-box {
                    display: flex;
                    color: #666;
                    font-size: 30rpx;
                    margin-top: 6rpx;
                }
            }

            .total-price-box {
                color: #f29400;
                display: flex;
                margin-top: 6rpx;
                font-size: 30rpx;
            }
        }

        .pay-box {

            // margin-top: 10rpx;
            .title-box {
                height: 70rpx;
                font-size: 34rpx;
                display: flex;
                align-items: center;

                .left-icon {
                    width: 8rpx;
                    height: 36rpx;
                    background: #439057;
                    margin-left: 20rpx;
                    margin-right: 15rpx;
                }
            }

            .bank-box {
                background: #fff;
                color: #333333;

                .item {
                    height: 100rpx;
                    display: flex;
                    align-items: center;
                    padding-left: 30rpx;
                    padding-right: 30rpx;
                    justify-content: space-between;
                    position: relative;
                    @include hair-line-b(#cbcbcb);

                    .input-box {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        height: 100rpx;

                        .uni-list-cell-db {
                            line-height: 100rpx;
                            flex: 1;
                            margin-right: 10rpx;
                            text-align: right;
                        }

                        input {
                            flex: 1;
                            text-align: right;
                            height: 100rpx;
                            margin-right: 10rpx;
                        }

                        .card {
                            display: block;
                            width: 38rpx;
                        }
                    }
                }

                .item:last-child {
                    position: relative;
                    @include hair-line-b(#fff);
                }
            }
        }

        .pay-box02 {

            // margin-top: 10rpx;
            .title-box {
                height: 70rpx;
                font-size: 34rpx;
                display: flex;
                align-items: center;

                .left-icon {
                    width: 8rpx;
                    height: 36rpx;
                    background: #439057;
                    margin-left: 20rpx;
                    margin-right: 15rpx;
                }
            }

            .countdown-box {
                background: #fff;
                height: 90rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-left: 30rpx;
                padding-right: 30rpx;
                font-size: 32rpx;

                .time {
                    font-size: 32rpx;
                }
            }
        }

        .btn {
            margin-left: 20rpx;
            margin-right: 20rpx;
            background: #439057;
            color: #fff;
            height: 80rpx;
            line-height: 70rpx;
            border-radius: 6rpx;
            margin-top: 40rpx;
            text-align: center;
        }
    }
</style>

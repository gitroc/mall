<template>
    <view class="lookDetail-page">
        <iheader title="详情页面"></iheader>
        <view class="lookDetail-content">
            <view class="jb-msg-box">
                <view class="title-box">
                    <view class="left-icon"></view>
                    <view class="title">基本信息</view>
                </view>
                <view class="msg-box">
                    <view class="item">
                        <view class="label font-sty01">订单编号</view>
                        <view class="input-box font-sty02">{{item.orderId}}</view>
                    </view>
                    <view class="item">
                        <view class="label font-sty01">商品名称</view>
                        <view class="input-boxfont-sty02">{{item.goodsName}}</view>
                    </view>
                    <view class="item">
                        <view class="label font-sty01">订单总额</view>
                        <view class="input-box font-sty02">￥{{item.realPrice}}</view>
                    </view>
                    <view class="item">
                        <view class="label font-sty01">抢购时间</view>
                        <view class="input-box font-sty02">{{item.orderTime}}</view>
                    </view>
                </view>
            </view>
            <view class="pay-box">
                <view class="title-box">
                    <view class="left-icon"></view>
                    <view class="title">收款信息</view>
                </view>
                <view class="bank-box">
                    <view class="item">
                        <view class="label font-sty01">卖家信息</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db font-sty01">{{item.sellerMobile}}</view>
                            <image class="phone" mode="widthFix" src="../../static/images/phone.png"></image>
                        </view>
                    </view>
                    <view class="item">
                        <view class="label font-sty01">收款银行</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db font-sty02">{{bank.bankName}}</view>
                            <image class="card" mode="widthFix" src="../../static/images/card.png"></image>
                        </view>
                    </view>
                    <view class="item">
                        <view class="label font-sty01">开户行</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db font-sty02">{{bank.bankOpen}}</view>
                            <image class="card" mode="widthFix" src="../../static/images/card.png"></image>
                        </view>
                    </view>
                    <view class="item">
                        <view class="label font-sty01">收款账号</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db font-sty02">{{bank.bankNo}}</view>
                            <image class="card" mode="widthFix" src="../../static/images/card.png"></image>
                        </view>
                    </view>
                    <view class="item">
                        <view class="label font-sty01">收款姓名</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db font-sty02">{{bank.clientName}}</view>
                            <image class="card" mode="widthFix" src="../../static/images/card.png"></image>
                        </view>
                    </view>
                </view>
            </view>
            <view class="pay-box pay-box02">
                <view class="title-box">
                    <view class="left-icon"></view>
                    <view class="title">付款信息</view>
                </view>
                <view class="bank-box">
                    <view class="item">
                        <view class="label font-sty01">买家信息</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db font-sty01">{{item.buyerMobile}}</view>
                            <image class="phone" mode="widthFix" src="../../static/images/phone.png"></image>
                        </view>
                    </view>
                    <view class="item">
                        <view class="label font-sty01">付款金额</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db font-sty03">￥{{item.realPrice}}</view>
                        </view>
                    </view>
                    <view class="item">
                        <view class="label font-sty01">付款时间</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db font-sty02">{{item.dealTime}}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="pay-box pay-box03">
                <view class="title-box">
                    <view class="left-icon"></view>
                    <view class="title">确认信息</view>
                </view>
                <view class="bank-box">
                    <view class="item">
                        <view class="label font-sty01">付款时间</view>
                        <view class="input-box">
                            <view class="uni-list-cell-db font-sty02">{{item.updateTime}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import iheader from '../../components/header.vue'
import config from "../../config";
import util from '../../utils/util.js'

export default {
        components: {
            iheader
        },
        data() {
            return {
                redirect: '',
                user: {},
                item: {
                    orderId: '',
                    goodsName: '',
                    goodsId: '',
                    sellerMobile: '',
                    buyerMobile: '',
                    realPrice: 0,
                    orderTime: '',
                    dealTime: '',
                    updateTime: ''
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
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/lookDetail/lookDetail')
                })
            },
            getItem(item) {
                let that = this;
                that.item.orderId = item.orderId;
                that.item.goodsName = item.goodsName;
                that.item.sellerMobile = item.sellerMobile;
                that.item.buyerMobile = item.buyerMobile;
                that.item.realPrice = item.realPrice;
                that.item.orderTime = item.orderTime;
                that.item.dealTime = item.dealTime;
                that.item.updateTime = item.updateTime;
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    //1像素的线
    @import "../../static/css/mixin.scss";

    .lookDetail-page {
        min-height: 100vh;
        background: #efefef;

        .lookDetail-content {
            .jb-msg-box {
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

                .msg-box {
                    background: #fff;

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
                            line-height: 100rpx;
                            text-align: right;
                        }
                    }

                    .item:last-child {
                        position: relative;
                        @include hair-line-b(#fff);
                    }
                }
            }

            .pay-box {
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

                            .card {
                                display: block;
                                width: 38rpx;
                            }

                            .phone {
                                display: block;
                                width: 42rpx;
                                margin-right: -5rpx;
                            }
                        }
                    }

                    .item:last-child {
                        position: relative;
                        @include hair-line-b(#fff);
                    }
                }
            }

            .pay-box03 {
                margin-bottom: 6rpx;
            }
        }
    }
</style>

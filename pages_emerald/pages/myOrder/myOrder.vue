<template>
    <view class="order-boxs">
        <iheader title="我的订单"></iheader>
        <!-- 头部tab切换 -->
        <view class="tab_nav">
            <view class="navTitle" v-for="(item,index) in navList" :key="index" :class="{'active':isActive === index}"
                @click="checked(index)">
                <view>{{item}}</view>
                <view class="line"></view>
            </view>
        </view>
        <view v-if="listData.length > 0" class="list-box">
            <view class="list-item" v-for="(item,index) in listData" :key="index">
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
                        <text>抢购:</text>
                        <text class="time">{{item.orderTime}}</text>
                    </view>
                    <view class="require-time">
                        <text>确认:</text>
                        <text class="time">{{item.dealTime}}</text>
                    </view>
                </view>
                <view class="price-box">
                    <view class="price font-sty03">
                        <text>金额:</text>
                        <text>￥{{item.realPrice}}</text>
                    </view>
                    <view class="sj-price font-sty03">
                        <text>上架费:</text>
                        <text>￥{{item.listFee}}</text>
                    </view>
                </view>
                <view class="operate">
                    <view
                        v-if="isActive === 1 && item.status === 1 && item.isVerify === 0 && user.clientId === item.buyerId"
                        class="btn" @click="payment(item)">立即支付</view>
                    <view
                        v-if="isActive === 2 && item.status === 1 && item.isVerify === 1 && user.clientId === item.sellerId"
                        class="btn" @click="confirm(item)">确认收款</view>
                    <view
                        v-if="isActive === 3 && item.status === 2 && item.isVerify === 1 && user.clientId === item.buyerId"
                        class="btn" @click="apply(item)">申请上架</view>
                    <view class="btn btn-detail" @click="lookDetail(item)">查看详情</view>
                </view>
            </view>
            <view class="more-box">
                <uni-load-more :contentText="contentText" :loadingType="loadingType" :status="status" />
            </view>
        </view>
        <view v-if="listData.length <= 0" class="none-box">
            <image class="screen" mode="widthFix" src='../../static/images/blank.png'></image>
            <!-- <view class="tip font-sty02">暂无记录</view> -->
        </view>
    </view>
</template>

<script>
import iheader from '../../components/header.vue'
import util from '../../utils/util.js'
import config from "../../config";
import uniLoadMore from '@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.vue'

export default {
        components: {
            iheader,
            uniLoadMore
        },
        data() {
            return {
                user: {},
                navList: ['全部', '待付款', '待收款', '待上架', '已售出'],
                isActive: 0,
                page: 1,
                size: 10,
                status: 'more',
                //0:立即支付 1:申请上架 2:查看付款 3:确认收款
                loadingType: 1, //定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
                contentText: {
                    contentdown: '上拉显示更多',
                    contentrefresh: '正在加载...',
                    contentnomore: '没有更多数据了'
                },
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
                let that = this
                let user = util.getUser();
                if (config.debug) console.log("user", user)
                if (user === undefined || user.token === undefined || user.uid <= 0) {
                    this.login();
                    return;
                }
                that.user = user;
                this.checked(0);
            },

            orderList() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.orderList, {
                    'clientId': user.clientId,
                    'status': that.isActive,
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

            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/myOrder/myOrder')
                })
            },

            checked(index) {
                this.isActive = index;
                this.orderList();
            },

            payment(item) {
                let itemSend = encodeURIComponent(JSON.stringify(item));
                uni.navigateTo({
                    url: '/pages/pay/pay?item=' + itemSend + '&redirect=' + encodeURIComponent(
                        '/pages/myOrder/myOrder')
                })
            },

            confirm(item) {
                let itemSend = encodeURIComponent(JSON.stringify(item));
                uni.navigateTo({
                    url: '/pages/deal/deal?item=' + itemSend + '&redirect=' + encodeURIComponent(
                        '/pages/myOrder/myOrder')
                })
            },

            lookDetail(item) {
                let itemSend = encodeURIComponent(JSON.stringify(item));
                uni.navigateTo({
                    url: '/pages/lookDetail/lookDetail?item=' + itemSend + '&redirect=' + encodeURIComponent(
                        '/pages/myOrder/myOrder')
                })
            },

            apply(item) {
                let that = this;
                uni.showModal({
                    title: '温馨提示',
                    content: '确定已经支付￥' + item.listFee + '元的上架费？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.apply, {
                                'clientId': that.user.clientId,
                                'orderId': item.orderId,
                            }, 'POST', {
                                token: that.user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("申请成功");
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
    .order-boxs {
        min-height: 100vh;
        background: #efefef;

        .tab_nav {
            height: 130rpx;
            display: flex;
            border-bottom: 1px solid #CCC;
            background: #fff;

            .navTitle {
                flex-grow: 1;
                text-align: center;
                color: #686868;
                font-size: 36rpx;
                line-height: 120rpx;
                position: relative;
                cursor: pointer;

                .line {
                    position: absolute;
                    bottom: 25rpx;
                    left: 50%;
                    width: 50rpx;
                    height: 10rpx;
                    margin-left: -25rpx;
                    border-radius: 5rpx !important;
                    background-color: #439057;
                    display: none;
                }
            }

            .active {
                color: #439057;

                .line {
                    display: block;
                }
            }
        }

        .list-box {
            .list-item {
                background: #fff;
                padding-bottom: 20rpx;
                margin-bottom: 20rpx;

                .list-top {
                    display: flex;
                    height: 80rpx;
                    align-items: center;
                    padding-left: 20rpx;
                    padding-right: 20rpx;
                    font-size: 32rpx;
                    justify-content: space-between;
                    border-bottom: 1rpx solid #cbcbcb;

                    .status {
                        color: #f29400;
                    }
                }

                .list-content {
                    display: flex;
                    padding: 26rpx 30rpx 26rpx 30rpx;
                    border-bottom: 1rpx solid #cbcbcb;

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
                    padding-left: 10rpx;
                    font-size: 30rpx;
                    border-bottom: 1rpx solid #cbcbcb;

                    .require-time {
                        margin-left: 10rpx;
                    }

                    .time {
                        font-size: 28rpx;
                        margin-left: 6rpx;
                    }
                }

                .price-box {
                    display: flex;
                    justify-content: space-between;
                    height: 80rpx;
                    align-items: center;
                    padding-left: 6rpx;
                    font-size: 32rpx;
                    color: #439057;
                    padding-left: 20rpx;
                    padding-right: 20rpx;
                    border-bottom: 1rpx solid #cbcbcb;
                }

                .operate {
                    display: flex;
                    justify-content: flex-end;
                    padding-right: 20rpx;
                    padding-top: 20rpx;

                    .btn {
                        display: block;
                        width: 100%;
                        height: 100%;
                        background: #439057;
                        width: 160rpx;
                        height: 66rpx;
                        line-height: 66rpx;
                        font-size: 32rpx;
                        color: #fff;
                        text-align: center;
                        margin-left: 20rpx;
                        border-radius: 5rpx;
                    }
                }
            }
        }

        .none-box {
            min-height: 100vh;
            background: #fff;
            display: flex;
            image {
                display: block;
                width: 248rpx;
                margin: 0 auto;
                margin-top: 100rpx;
            }

            .tip {
                display: block;
                font-size: 34rpx;
                margin-top: 40rpx;
                text-align: center;
            }
        }
    }
</style>

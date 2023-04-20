<template>
    <view class="order-time-page">
        <iheader title="秒杀专场"></iheader>
        <view class="content">
            <view class="left-text">
                <text>营业时间：</text>
                <text>{{openStart}}</text>
                <text>-</text>
                <text>{{openEnd}}</text>
            </view>
           <!-- <view class="order-btn">
                <navigator url="/pages/orderDeatil/orderDeatil">预约</navigator>
            </view> -->
        </view>
        <view class="list-content">
            <view v-for="(item,index) in listData" :key="index" class="list-item">
                <div class="top">
                    <view class="img-box">
                        <image :src='item.goodsCarousel' class="screen"></image>
                    </view>
                    <view class="text-box">
                        <view class="name">{{item.goodsName}}</view>
                        <view class="order-num font-sty02">藏品编号：{{item.goodsId}}</view>
                        <view class="sell-box font-sty02">
                            <view class="label">所有人：</view>
                            <view class="sell-name">{{item.ownerName}}</view>
                        </view>
                        <view class="price-box font-sty03">
                            <view class="label">抢购价格：</view>
                            <view class="buy-name">￥{{item.realPrice}}</view>
                        </view>
                    </view>
                </div>
                <view class="operate">
                    <view class="btn btn-detail" @click="seckill(item.goodsId)">立即秒杀</view>
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
                openStart: '',
                openEnd: '',
                listData: []
            }
        },
        onLoad: function(op) {
            if (config.debug) console.log("onLoad() op=", op);
            this.init();
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

                this.initRoom();
            },
            
            login() {
                uni.navigateTo({
                    url: '../../pages/login/login?redirect=' + encodeURIComponent('../../pages/orderTime/orderTime')
                })
            },

            initRoom() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.initRoom, {
                    'clientId': user.clientId
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.openStart = res.data.openStart;
                        that.openEnd = res.data.openEnd;

                        //这里加一个逻辑，在开始营业10分钟之内 调用
                        this.getGoodsList();
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },

            getGoodsList() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.goodsList, {
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
                            // util.toastError('已经被抢光了！');
                        }
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },

            seckill(goodsId) {
                let that = this;
                let user = util.getUser();
                util.request(config.api.seckill, {
                    'clientId': user.clientId,
                    'goodsId': goodsId
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        util.toastError('抢购成功，去订单列表付款！');
                        this.initRoom();
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg);
                });
            }

        }
    }
</script>

<style lang="scss" scoped>
    //1像素的线
    @import "../../static/css/mixin.scss";

    .order-time-page {
        min-height: 100vh;
        background: #efefef;

        .content {
            display: flex;
            height: 110rpx;
            justify-content: space-between;
            padding-left: 20rpx;
            padding-right: 20rpx;
            background: #fff;
            align-items: center;
            margin-top: 10rpx;
            color: #439057;
            margin-bottom: 20rpx;

            .order-btn {
                background: #439057;
                color: #fff;
                height: 50rpx;
                line-height: 50rpx;
                border-radius: 6rpx;
                width: 90rpx;
                font-size: 30rpx;
                text-align: center;
            }
        }

        .list-content {
            margin-top: 25rpx;

            .list-item {
                background: #fff;
                margin-bottom: 15rpx;
                font-size: 30rpx;

                .top {
                    display: flex;
                    position: relative;
                    padding: 26rpx 30rpx 26rpx 30rpx;
                    @include hair-line-b(#cbcbcb);

                    .img-box {
                        flex: none;
                        width: 230rpx;
                        height: 200rpx;
                        margin-right: 20rpx;
                        border-radius: 12rpx;
                        flex-shrink: 0;

                        image {
                            display: block;
                            width: 100%;
                            height: 200rpx;
                        }
                    }

                    .text-box {
                        .name {
                            font-size: 36rpx;
                            margin-bottom: 15rpx;
                            word-break: break-all;
                        }

                        .order-num {
                            word-break: break-all;
                        }

                        .sell-box {
                            display: flex;
                            word-break: break-all;
                        }

                        .price-box {
                            display: flex;
                        }
                    }
                }

            }
        }

        .operate {
            display: flex;
            justify-content: flex-end;
            padding-right: 20rpx;
            padding-top: 20rpx;
            background: #fff;
            padding-bottom: 20rpx;

            .btn {
                display: block;
                width: 100%;
                height: 100%;
                background: #439057;
                width: 140rpx;
                height: 50rpx;
                line-height: 50rpx;
                font-size: 30rpx;
                color: #fff;
                text-align: center;
                margin-left: 20rpx;
                border-radius: 5rpx;
                cursor: pointer;
            }
        }
    }
</style>

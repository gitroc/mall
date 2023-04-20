<template>
    <view class="dis-zcrequire-page">
        <iheader title="转房确认"></iheader>
        <!-- 列表 -->
        <view class="c-list">
            <view v-for="(item,index) in listData" :key="index" class="list-item">
                <view class="list-top">
                    <view class="bh">编号：{{item.goodsId}}</view>
                </view>
                <view class="list-content">
                    <view class="img-box">
                        <image :src='item.goodsCarousel' class="screen"></image>
                    </view>
                    <view class="text-box">
                        <view class="name">{{item.goodsName}}</view>
                        <view class="seller font-sty02">持有人：{{item.ownerName}}</view>
                        <view class="buy-box font-sty02">
                            <view class="label">买入价值：{{item.sellPrice}}</view>
                        </view>
                        <view class="sell-box font-sty02">
                            <view class="label">卖出价格：{{item.realPrice}}</view>
                        </view>
                    </view>
                </view>
                <view class="operate-box">
                    <view class="btn" @click="confirm(item)">确认接收</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import iheader from '../../components/header.vue';
import util from '../../utils/util.js'
import config from "../../config";

export default {
        components: {
            iheader
        },
        data() {
            return {
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
                this.getGoodsList();
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/diszhRequire/diszhRequire')
                })
            },
            getGoodsList() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.goodsReceive, {
                    'clientId': user.clientId,
                    'page': that.page,
                    'size': that.size,
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
            confirm(item) {
                let that = this;
                let user = util.getUser();
                uni.showModal({
                    title: '温馨提示',
                    content: '确定接收转移的商品？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.goodsConfirm, {
                                'clientId': user.clientId,
                                'goodsId': item.goodsId,
                            }, 'POST', {
                                token: user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("接收成功");
                                    setTimeout(function() {
                                        that.getGoodsList();
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

    .dis-zcrequire-page {
        min-height: 100vh;
        background: #efefef;
        position: relative;

        .c-list {
            .list-item {
                box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
                margin-top: 20rpx;
                background: #fff;

                .list-top {
                    display: flex;
                    height: 80rpx;
                    align-items: center;
                    padding-left: 20rpx;
                    padding-right: 20rpx;
                    font-size: 34rpx;
                    justify-content: space-between;
                    position: relative;
                    @include hair-line-b(#cbcbcb);

                    .status {
                        color: #439057;
                        font-size: 30rpx;
                    }
                }

                .list-content {
                    display: flex;
                    padding: 26rpx 30rpx 26rpx 30rpx;
                    position: relative;
                    @include hair-line-b(#cbcbcb);

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
                        font-size: 36rpx;
                        flex: 1;
                        overflow: hidden;
                        word-break: break-all;

                        .name {
                            font-weight: bold;
                        }

                        .seller {
                            font-size: 32rpx;
                            margin-top: 15rpx;
                        }

                        .sell-box {
                            font-size: 32rpx;
                            margin-top: 5rpx;
                        }

                        .buy-box {
                            font-size: 32rpx;
                            margin-top: 5rpx;
                        }
                    }
                }

                .operate-box {
                    display: flex;
                    justify-content: flex-end;
                    height: 90rpx;
                    align-items: center;
                    padding-right: 20rpx;

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
    }
</style>

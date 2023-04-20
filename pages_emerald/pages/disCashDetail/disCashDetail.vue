<template>
    <view class="discash-detail-page">
        <iheader title="提现明细"></iheader>
        <view class="c-list font-size36">
            <view v-for="(item,index) in List" :key="index" class="item">
                <view class="left-text font-sty02">
                    <view class="name font-sty01">{{item.bankName}}</view>
                    <view class="wh">{{item.bankNo}}</view>
                    <view class="operate-box">
                        <view class="time">{{item.time}}</view>
                    </view>
                </view>
                <view class="right-text">
                    <view class="price font-sty03">￥{{item.price}}</view>
                    <view class="status-box font-sty02">
                        <view>状态：</view>
                        <view v-if="item.status == 0" class="status">待审核</view>
                        <view v-if="item.status == 1" class="status">已打款</view>
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
                size: 10,
                List: []
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

                this.disCashDetail();
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent(
                        '/pages/disCashDetail/disCashDetail')
                })
            },
            disCashDetail() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.withdrawList, {
                    'clientId': user.clientId,
                    'page': that.page,
                    'size': that.size
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.List = res.data;
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    //1像素的线
    @import "../../static/css/mixin.scss";

    .discash-detail-page {
        min-height: 100vh;
        background: #efefef;

        .c-list {
            background: #fff;

            .item {
                display: flex;
                justify-content: space-between;
                min-height: 200rpx;
                align-items: center;
                position: relative;
                @include hair-line-t(#cbcbcb);
                padding-left: 30rpx;
                padding-right: 30rpx;

                .left-text {
                    word-wrap: break-all;

                    .name {
                        font-weight: bold;
                    }

                    .wh {
                        font-size: 32rpx;
                        margin-top: 10rpx;
                    }

                    .operate-box {
                        display: flex;
                        font-size: 32rpx;
                        flex-wrap: wrap;

                        .time {
                            margin-left: 5rpx;
                        }

                        .operate {
                            margin-left: 5rpx;
                            margin-top: 3rpx;
                        }
                    }
                }

                .right-text {
                    .price {
                        font-weight: bold;
                        text-align: right;
                        font-size: 44rpx;
                    }

                    .status-box {
                        display: flex;
                        font-size: 32rpx;
                        margin-top: 5rpx;
                    }
                }
            }
        }
    }
</style>

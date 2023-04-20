<template>
    <view class="goods-box">
        <iheader title="我的持仓"></iheader>
        <view class="goods-content">
            <view v-if="listData.length > 0" class="goods-list">
                <view class="list-content" v-for="(item,index) in listData">
                    <view class="img-box">
                        <image :src='item.goodsCarousel' class="screen"></image>
                    </view>
                    <view class="text-box">
                        <view class="name">{{item.goodsName}}</view>
                        <view class="order-num">编号:{{item.goodsId}}</view>
                        <view class="hs-box font-sty02">
                            <view class="label">所属房间：</view>
                            <view class="sell-name">{{item.roomName}}</view>
                        </view>
                        <view class="buy-box font-sty03">
                            <view class="label">入手价：</view>
                            <view class="price">￥{{item.priceBuy}}</view>
                        </view>
                        <view class="sell-box font-sty02">
                            <view class="label">出手价：</view>
                            <view class="price">￥{{item.priceSell}}</view>
                        </view>
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
    </view>
</template>

<script>
import iheader from '../../components/header.vue'
import uniLoadMore from '@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.vue'
import util from "../../utils/util";
import config from "../../config";

export default {
        components: {
            iheader,
            uniLoadMore
        },
        data() {
            return {
                page: 1,
                size: 10,
                listData: [],
                status: 'more',
                loadingType: 1, //定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
                contentText: {
                    contentdown: '上拉显示更多',
                    contentrefresh: '正在加载...',
                    contentnomore: '没有更多数据了'
                }
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
                let that = this;
                let user = util.getUser();
                util.request(config.api.ownList, {
                    'clientId': user.clientId,
                    'page': that.page,
                    'size': that.size
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.listData = res.data;
                        // if (that.listData.length == 0) {
                        //     util.toastError('暂无持仓！');
                        // }
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
    .goods-box {
        min-height: 100vh;
        background: #efefef;

        .goods-content {
            .goods-list {
                .list-content {
                    display: flex;
                    padding: 30rpx;
                    margin-top: 15rpx;
                    margin-bottom: 15rpx;
                    background: #fff;

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
                        font-size: 38rpx;
                        margin-top: -10rpx;

                        .sell-box {
                            display: flex;
                            font-size: 30rpx;
                        }

                        .hs-box {
                            display: flex;
                            font-size: 30rpx;
                            margin-top: 10rpx;
                        }

                        .buy-box {
                            display: flex;
                            font-size: 30rpx;
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
                    margin-top: 150rpx;
                }

                .tip {
                    font-size: 34rpx;
                    margin-top: 40rpx;
                    text-align: center;
                }
            }
        }
    }
</style>

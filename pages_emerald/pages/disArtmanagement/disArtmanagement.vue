<template>
    <view class="dis-artmanagement-page">
        <iheader title="商品管理"></iheader>
        <headTab :navList="navData" @change="changeTab" />
        <view class="c-list">
            <view v-for="(item,index) in listData" :key="index" class="list-item">
                <view class="list-top">
                    <view class="bh">编号：{{item.goodsId}}</view>
                    <view v-if="item.status === 0" class="status">待交易</view>
                    <view v-if="item.status === 1" class="status">已售罄</view>
                    <view v-if="item.status === 2" class="status">已封存</view>
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
                    <view class="btn" @click="split(item)">置换</view>
                    <view class="btn" @click="transfer(item)">转室</view>
                    <view v-if="isActive === 0" class="btn" @click="sealUp(item)">封存</view>
                    <view v-if="isActive === 1" class="btn" @click="unBlock(item)">解封</view>
                </view>
            </view>
        </view>

        <!-- 转场部分 start -->
        <view v-if="zcFlag === true" class="zc-box">
            <view class="center-box">
                <view class="name font-sty01">转移房间</view>
                <input v-model="roomId" placeholder="输入转入房间号" type="text">
                <view class="btn-box">
                    <view class="btn cancel" @click="cancel()">取消</view>
                    <view class="btn require" @click="submit()">确认</view>
                </view>
            </view>
        </view>
        <!-- 转场部分 end -->
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
                navData: ['正常商品', '封存商品'],
                isActive: 0,
                zcFlag: false,
                roomId: '',
                listData: [],
                item: {}
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
                        '/pages/disArtmanagement/disArtmanagement')
                })
            },
            getGoodsList() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.goodsAll, {
                    'clientId': user.clientId,
                    'page': that.page,
                    'size': that.size,
                    'status': that.isActive
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
            changeTab(index) {
                this.isActive = index;
                this.getGoodsList();
            },
            split(item) {
                if (item.realPrice < 4000) {
                    util.toastError('低价值商品请勿置换');
                    return;
                }

                if (item.isDelete == 1) {
                    util.toastError('当前状态不可置换');
                    return;
                }

                let that = this;
                let user = util.getUser();
                uni.showModal({
                    title: '谨慎操作',
                    content: '当前商品将会置换为相同价值的两个商品，确定吗？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.goodsSplit, {
                                'clientId': user.clientId,
                                'goodsId': item.goodsId,
                            }, 'POST', {
                                token: user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("置换成功");
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
            },
            transfer(item) {
                this.zcFlag = true;
                this.item = item;
            },
            sealUp(item) {
                let that = this;
                let user = util.getUser();
                uni.showModal({
                    title: '谨慎操作',
                    content: '封存后不能交易，确定吗？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.goodsSealUp, {
                                'clientId': user.clientId,
                                'goodsId': item.goodsId,
                            }, 'POST', {
                                token: user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("封存成功");
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
            },
            unBlock(item) {
                let that = this;
                let user = util.getUser();
                uni.showModal({
                    title: '谨慎操作',
                    content: '确定解封该商品吗？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.goodsUnBlock, {
                                'clientId': user.clientId,
                                'goodsId': item.goodsId,
                            }, 'POST', {
                                token: user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("解封成功");
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
            },
            cancel() {
                this.zcFlag = false
            },
            submit() {
                let that = this;
                if (that.roomId === '') {
                    util.toastError('请输入转入室号');
                    return;
                }

                let user = util.getUser();
                uni.showModal({
                    title: '谨慎操作',
                    content: '商品将会转移到所填房间，确定吗？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.goodsTransfer, {
                                'clientId': user.clientId,
                                'goodsId': that.item.goodsId,
                                'roomId': that.roomId,
                            }, 'POST', {
                                token: user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("转室成功");
                                    that.zcFlag = false
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

    .dis-artmanagement-page {
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
                        color: #f29400;
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

        .zc-box {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 100;

            .center-box {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                height: 300rpx;
                background: #fff;

                .name {
                    font-size: 36rpx;
                    text-align: center;
                    padding-top: 20rpx;
                }

                input {
                    margin-left: 30rpx;
                    margin-right: 30rpx;
                    height: 80rpx;
                    font-size: 36rpx;
                    background: #eee;
                    text-indent: 0.8em;
                    margin-top: 30rpx;
                }

                .btn-box {
                    display: flex;
                    margin-top: 20rpx;
                    border-top: 1rpx solid #cbcbcb;

                    .btn {
                        flex: none;
                        width: 50%;
                        height: 100rpx;
                        line-height: 100rpx;
                        text-align: center;
                        font-size: 36rpx;
                        // border-right:1rpx solid #cbcbcb;
                    }

                    .cancel {
                        position: relative;
                    }

                    .require {
                        color: rgb(0, 122, 255);
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

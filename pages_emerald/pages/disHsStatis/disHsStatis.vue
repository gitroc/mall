<template>
    <view class="disHsStatis-page">
        <iheader title="统计报表"></iheader>
        <view class="top-part">
            <view class="left-part">
                <view class="hs-box">
                    <view>房间</view>
                    <view class="check-box">
                        <view class="uni-list-cell-db">
                            <view class="uni-input">{{roomName}}</view>
                        </view>
                    </view>
                </view>
                <view class="date-box">
                    <view>统计日期</view>
                    <view class="check-box">
                        <view class="uni-list-cell-db">
                            <view class="uni-input">{{date}}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="right-part">
                <view class="statis" @click="orderStatis">统计</view>
                <view class="download" @click="orderReport">下载报表</view>
            </view>
        </view>
        <view class="price-box font-sty01">
            <view class="orderNum">订单数：{{totalOrders}}</view>
            <view class="price">金额：￥{{totalPrice}}</view>
            <view class="listFee">上架费：￥{{totalListFee}}</view>
        </view>
        <view v-if="listData.length > 0" class="list-box">
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
import config from "../../config";
import util from "../../utils/util";

export default {
        components: {
            iheader
        },
        data() {
            const currentDate = this.getDate({
                format: true
            })
            return {
                roomName: '',
                date: currentDate,
                totalOrders: '',
                totalPrice: '',
                totalListFee: '',
                reportName: '',
                listData: []
            }
        },
        onLoad: function(op) {
            if (config.debug) console.log("onLoad()", op)
            this.roomName = op.roomName;
            this.init()
        },
        onShow: function() {
            if (config.debug) console.log("onShow()");
        },
        computed: {
            startDate() {
                return this.getDate('start');
            },
            endDate() {
                return this.getDate('end');
            }
        },
        methods: {
            init() {
                let user = util.getUser();
                if (config.debug) console.log("user", user)
                if (user === undefined || user.token === undefined || user.uid <= 0) {
                    this.login();
                    return;
                }
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent(
                        '/pages/disHsStatis/disHsStatis')
                })
            },

            orderStatis() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.orderStatis, {
                    'clientId': user.clientId
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.totalOrders = res.data.totalOrders;
                        that.totalPrice = res.data.totalPrice;
                        that.totalListFee = res.data.totalListFee;
                        that.reportName = res.data.reportName;
                        that.listData = res.data.orderList;
                        if (that.totalOrders === 0) {
                            util.toastError('业绩为零，没有报表');
                        } else {
                            util.toastError('业绩不错，请下载报表');
                        }
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },

            orderReport() {
                let that = this;
                if (that.totalOrders === 0) {
                    util.toastError('暂无报表');
                }

                if (uni.getSystemInfoSync().platform === "android") {
                    that.loading = true;
                    const downloadTask = uni.downloadFile({
                        url: that.reportName, // 文件下载路径
                        success: (data) => {
                            util.toastError('data.tempFilePath');
                            uni.saveFile({
                                tempFilePath: data.tempFilePath, //临时路径
                                success: function(res) {
                                    util.toastError('文件保存成功');
                                    setTimeout(() => {
                                        //打开文档查看
                                        uni.openDocument({
                                            filePath: data.tempFilePath,
                                            success: function(res) {
                                                util.toastError('请选择打开工具');
                                            },
                                            fail(e) {
                                                util.toastError("打开失败");
                                            }
                                        });
                                    }, 3000)
                                },
                                fail(e) {
                                    util.toastError("保存失败");
                                }
                            });
                        },
                        fail(e) {
                            util.toastError("下载失败");
                        }
                    });
                    downloadTask.onProgressUpdate((res) => {
                        console.log('下载进度' + res.progress);
                        console.log('已经下载的数据长度' + res.totalBytesWritten);
                        console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
                    });
                } else {
                    util.toastError('请使用App下载');
                }
            },

            bindPickerChange: function(e) {
                this.index = e.detail.value;
            },
            bindDateChange: function(e) {
                this.date = e.detail.value
            },
            getDate(type) {
                const date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();

                if (type === 'start') {
                    year = year - 60;
                } else if (type === 'end') {
                    year = year + 2;
                }
                month = month > 9 ? month : '0' + month;
                day = day > 9 ? day : '0' + day;
                return `${year}-${month}-${day}`;
            }
        }
    }
</script>

<style lang="scss" scoped>
    //1像素的线
    @import "../../static/css/mixin.scss";

    .disHsStatis-page {
        min-height: 100vh;
        background: #fff;

        .top-part {
            display: flex;

            .left-part {
                flex: 1;
                padding-left: 30rpx;
                font-size: 36rpx;

                .hs-box {
                    display: flex;
                    height: 110rpx;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    @include hair-line-b(#cbcbcb);
                }

                .date-box {
                    display: flex;
                    height: 110rpx;
                    align-items: center;
                    justify-content: space-between;
                }

                .check-box {
                    display: flex;
                    height: 120rpx;
                    align-items: center;

                    .more {
                        width: 32rpx;
                        display: block;
                    }
                }


            }

            .right-part {
                width: 200rpx;
                margin-left: 30rpx;
                margin-right: 30rpx;

                view {
                    width: 100%;
                    text-align: center;
                    height: 70rpx;
                    line-height: 70rpx;
                    margin-top: 25rpx;
                    color: #fff;
                    font-size: 36rpx;
                    border-radius: 6rpx;
                }

                .statis {
                    background: #f29400;
                }

                .download {
                    background: #027347;
                }
            }
        }

        .price-box {
            display: flex;
            height: 80rpx;
            padding-left: 30rpx;
            padding-right: 30rpx;
            background: #dbeae5;
            align-items: center;
            font-size: 34rpx;

            .orderNum {
                margin-right: 20rpx;
            }

            .price {
                margin-right: 20rpx;
            }
        }

        .list-box {
            min-height: 100vh;
            background: #efefef;

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
                    background: #fff;
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
</style>

<template>
    <view class="discashaudit-page">
        <iheader title="提现审核"></iheader>
        <!-- 头部tab -->
        <headTab :navList="navData" @change="changeTab" />
        <view class="c-list">
            <view v-for="(item,index) in listData" :key="index" class="list-item">
                <view class="list-top">
                    <view class="cash-box">
                        <view>提现金额：</view>
                        <view class="cashPrice">￥{{item.price}}</view>
                    </view>
                    <view v-if="status === 0" class="status">待审核</view>
                    <view v-if="status === 1" class="status">已打款</view>
                </view>
                <view class="list-content font-sty02">
                    <view class="name-box">提现会员：{{item.clientName}}({{item.mobile}})</view>
                    <view class="time">申请时间：{{item.time}}</view>
                </view>
                <view class="list-bot font-sty02">
                    <view class="handlingFee">手续费：￥0</view>
                    <view class="payable">实付：￥{{item.price}}</view>
                </view>
                <view v-if="status === 0" class="btn-box">
                    <view class="btn" @click="audit(item)">提现确认</view>
                </view>
            </view>
        </view>
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
                status: 0,
                page: 1,
                size: 10,
                navData: ['待审核', '已打款'],
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

                this.changeTab(0);
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent(
                        '/pages/disCashAudit/disCashAudit')
                })
            },
            disCashAudit() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.withdrawAuditList, {
                    'status': that.status,
                    'clientId': user.clientId,
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
                    util.toastError(e.data.msg || e.errMsg)
                });
            },
            changeTab(index) {
                this.status = index
                this.disCashAudit();
            },
            audit(item) {
                let that = this;
                let user = util.getUser();
                uni.showModal({
                    title: '温馨提示',
                    content: '确定已经支付￥' + item.price + '元提现？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.withdrawAudit, {
                                'clientId': user.clientId,
                                'id': item.id,
                            }, 'POST', {
                                token: user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("审核成功");
                                    setTimeout(function() {
                                        that.disCashAudit();
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

    .discashaudit-page {
        min-height: 100vh;
        background: #efefef;
        position: relative;

        .c-list {
            .list-item {
                margin-top: 25rpx;
                background: #fff;

                .list-top {
                    height: 90rpx;
                    align-items: center;
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    font-size: 36rpx;
                    padding-left: 30rpx;
                    padding-right: 30rpx;
                    @include hair-line-b(#cbcbcb);

                    .cash-box {
                        display: flex;
                        font-weight: bold;
                    }

                    .status {
                        color: #fc4f06;
                    }
                }

                .list-content {
                    padding: 30rpx;
                    font-size: 34rpx;
                    position: relative;
                    @include hair-line-b(#cbcbcb);

                    .time {
                        margin-top: 4rpx;
                    }
                }

                .list-bot {
                    display: flex;
                    padding-left: 30rpx;
                    padding-right: 30rpx;
                    height: 90rpx;
                    font-size: 34rpx;
                    align-items: center;
                    color: #fc4f06;
                    justify-content: space-between;
                    position: relative;
                    @include hair-line-b(#cbcbcb);

                    .payable {
                        font-weight: bold;
                    }
                }

                .btn-box {
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

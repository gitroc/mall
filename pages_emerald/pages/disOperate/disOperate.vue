<template>
    <view class="disOperate-page">
        <iheader title="管理中心"></iheader>
        <view class="top-part font-sty01">
            <view class="time-part">
                <view class="name">{{roomName}}</view>
                <view class="time-box font-sty02">
                    <view>营业中 </view>
                    <view class="time font-sty02">{{openStart}} - {{openEnd}}</view>
                </view>
            </view>
            <view class="num-box">
                <view class="item" @click="linkTo(3)">
                    <view class="num">{{onSale}}</view>
                    <view class="name font-sty02">商品待售</view>
                </view>
                <view class="item" @click="linkTo(10)">
                    <view class="num">{{ordered}}</view>
                    <view class="name font-sty02">商品预约</view>
                </view>
            </view>
        </view>
        <!-- 主体 start -->
        <view class="disOperate-main">
            <view class="c-list">
                <view v-for="(item,index) in listData" :key="index" class="item" @click="linkTo(index)">
                    <view class="left-box">
                        <image :src='item.image' class="me-icon" mode="widthFix"></image>
                        <view class="label">{{item.name}}</view>
                    </view>
                    <view class="more">
                        <image class="next" mode="widthFix" src='../../static/images/next.png'></image>
                    </view>
                </view>
            </view>
            <view class="member-box">
                <view class="left-box">
                    <view class="icon">
                        <image class="next" mode="widthFix" src='../../static/images/rss.png'></image>
                    </view>
                    <view class="text-box">
                        <view>会员预约</view>
                        <view class="tip font-sty02">是否开启会员预约功能</view>
                    </view>
                </view>
                <view class="switch-box">
                    <switch checked color="#439057" @change="switchChange" />
                </view>
            </view>
        </view>
        <!-- 主体 end -->
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
                roomName: '',
                openStart: '',
                openEnd: '',
                onSale: '',
                ordered: '',
                listData: [{
                        name: '上架审核',
                        image: require('../../static/images/audit.png')
                    },
                    {
                        name: '提现审核',
                        image: require('../../static/images/expenses.png')
                    },
                    {
                        name: '统计报表',
                        image: require('../../static/images/ranking.png')
                    },
                    {
                        name: '商品管理',
                        image: require('../../static/images/withdrawlogs.png')
                    },
                    {
                        name: '转让确认',
                        image: require('../../static/images/carousel.png')
                    },
                    {
                        name: '房间号',
                        image: require('../../static/images/room.png')
                    },
                    {
                        name: '用户搜索',
                        image: require('../../static/images/search-user.png')
                    }
                ]
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
                this.roomOperate();
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/disOperate/disOperate')
                })
            },
            roomOperate() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.roomOperate, {
                    'clientId': user.clientId
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.roomName = res.data.roomName;
                        that.openStart = res.data.openStart;
                        that.openEnd = res.data.openEnd;
                        that.onSale = res.data.onSale;
                        that.ordered = res.data.ordered;
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },
            switchChange: function(e) {
                console.log('switch1 发生 change 事件，携带值为', e.detail.value)
                let that = this;
                if (e.detail.value) {
                    that.defaultFlag = "1";
                } else {
                    that.defaultFlag = "0";
                }
            },
            linkTo(index) {
                let that = this;
                if (index === 0) {
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/disArrivalAudit/disArrivalAudit'
                        }, 1500)
                    })
                } else if (index === 1) {
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/disCashAudit/disCashAudit'
                        }, 1500)
                    })
                } else if (index === 2) {
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/disHsStatis/disHsStatis?roomName=' + that.roomName
                        }, 1500)
                    })
                } else if (index === 3) {
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/disArtmanagement/disArtmanagement'
                        }, 1500)
                    })
                } else if (index === 4) {
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/diszhRequire/diszhRequire'
                        }, 1500)
                    })
                } else if (index === 5) {
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/disSetting/disSetting'
                        }, 1500)
                    })
                } else if (index === 6) {
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/disNumber/disNumber'
                        }, 1500)
                    })
                } else if (index === 10) {
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/disHsOrder/disHsOrder'
                        }, 1500)
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    //1像素的线
    @import "../../static/css/mixin.scss";

    .disOperate-page {
        min-height: 100vh;
        background: #efefef;

        .top-part {
            .time-part {
                display: flex;
                height: 100rpx;
                align-items: center;
                justify-content: space-between;
                padding-left: 30rpx;
                padding-right: 30rpx;
                background: #fff;
                position: relative;
                @include hair-line-b(#cbcbcb);

                .name {
                    font-size: 36rpx;
                }

                .time-box {
                    font-size: 34rpx;
                    display: flex;
                }
            }

            .num-box {
                display: flex;
                background: #fff;
                height: 180rpx;
                box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);

                .item {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    font-size: 36rpx;

                    .num {
                        font-size: 44rpx;
                        text-align: center;
                        font-weight: bold;
                        color: #f29400;
                    }

                    .name {
                        text-align: center;
                        margin-top: 15rpx;
                    }
                }
            }
        }

        .disOperate-main {
            margin-top: 20rpx;

            .c-list {
                .item {
                    display: flex;
                    padding-right: 0rpx;
                    justify-content: space-between;
                    font-size: 34rpx;
                    background: #fff;
                    height: 110rpx;
                    align-items: center;
                    width: 100%;
                    position: relative;
                    @include hair-line-b(#cbcbcb);

                    .left-box {
                        display: flex;
                        height: 90rpx;
                        align-items: center;
                        margin-left: 30rpx;

                        image {
                            display: block;
                            width: 58rpx;
                            margin-right: 20rpx;
                        }
                    }

                    .more {
                        display: flex;
                        height: 90rpx;
                        align-items: center;

                        .next {
                            right: 20rpx;
                            width: 32rpx;
                            display: block;
                            margin-left: 20rpx;
                        }
                    }
                }
            }

            .member-box {
                display: flex;
                justify-content: space-between;
                background: #fff;
                padding-left: 30rpx;
                padding-right: 30rpx;
                height: 180rpx;
                align-items: center;
                padding-bottom: 20px;

                .left-box {
                    display: flex;
                    font-size: 34rpx;
                    height: 180rpx;
                    align-items: center;

                    .icon {
                        width: 58rpx;
                        margin-right: 20rpx;

                        image {
                            width: 100%;
                            display: block;
                        }
                    }

                    .tip {
                        font-size: 30rpx;
                        margin-top: 5rpx;
                    }
                }
            }
        }
    }
</style>

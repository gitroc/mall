<template>
    <view class="disNumber-page">
        <iheader title="用户搜索"></iheader>
        <view class="top-part">
            <input v-model="searchMobile" placeholder="输入会员手机号搜索" type="text">
            <view class="search" @click="search()">搜索</view>
        </view>
        <view v-if="searchRet === 1" class="c-list">
            <view class="item font-sty01">
                <view class="left-text">
                    <view class="phone">手机: {{mobile}}</view>
                    <view class="name font-sty02">昵称：{{clientName}}</view>
                    <view class="time font-sty02">注册时间：{{createTime}}</view>
                </view>
                <view class="right-text">

                </view>
            </view>
        </view>
        <view v-if="searchRet === 0" class="none-box">
            <image class="screen" mode="widthFix" src='../../static/images/blank.png'></image>
            <view class="tip font-sty02">没有找到该用户</view>
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
                searchMobile: '',
                searchRet: 0,
                mobile: '',
                clientName: '',
                createTime: ''
            }
        },
        onLoad: function() {
            if (config.debug) console.log("onLoad()");
        },
        onShow: function() {
            if (config.debug) console.log("onShow()");
        },
        methods: {
            search() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.search, {
                    'clientId': user.clientId,
                    'mobile': that.searchMobile
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.searchRet = 1;
                        that.mobile = res.data.mobile;
                        that.clientName = res.data.clientName;
                        that.createTime = res.data.createTime;
                    } else {
                        that.searchRet = 0;
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

    .disNumber-page {
        min-height: 100vh;
        background: #fff;

        .top-part {
            display: flex;
            padding-left: 30rpx;
            padding-right: 30rpx;
            justify-content: space-between;

            input {
                flex: 1;
                margin-right: 20rpx;
                background: gray;
                height: 70rpx;
                background: #eeeeee;
                border-radius: 6rpx;
                text-indent: 0.8em;
                font-size: 34rpx;
            }

            .search {
                background: #439057;
                padding-left: 20rpx;
                padding-right: 20rpx;
                height: 68rpx;
                line-height: 68rpx;
                text-align: center;
                font-size: 32rpx;
                color: #fff;
                border-radius: 6rpx;
                margin-left: 15rpx;
            }
        }

        .c-list {
            padding-left: 30rpx;
            padding-right: 30rpx;
            margin-top: 20rpx;
            background: #fff;

            .item {
                min-height: 220rpx;
                align-items: center;
                display: flex;
                font-size: 34rpx;
                position: relative;
                justify-content: space-between;
                @include hair-line-b(#cbcbcb);

                .left-text {
                    .phone {
                        font-size: 40rpx;
                        font-weight: bold;
                    }

                    .name {
                        font-size: 34rpx;
                        margin-top: 12rpx;
                    }

                    .time {
                        font-size: 32rpx;
                    }
                }

                .right-text {
                    font-size: 32rpx;
                    margin-left: 10rpx;

                    .add {
                        display: flex;

                        .num {
                            font-size: 32rpx;
                        }
                    }

                    .buy {
                        display: flex;
                        margin-top: 3rpx;

                        .num {
                            font-size: 32rpx;
                        }
                    }

                    .teamBuy {
                        display: flex;
                        margin-top: 3rpx;

                        .num {
                            font-size: 32rpx;
                        }
                    }
                }
            }
        }

        .none-box {
            image {
                display: block;
                width: 248rpx;
                margin: 0 auto;
                margin-top: 160rpx;
            }

            .tip {
                font-size: 34rpx;
                margin-top: 40rpx;
                text-align: center;
            }
        }
    }
</style>

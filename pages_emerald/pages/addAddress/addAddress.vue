<template>
    <view class="addAddress-page">
        <iheader title="收货地址"></iheader>
        <view v-for="(item,index) in addList" class="my-address-list">
            <view>
                <view class="item">
                    <view class="text-box">
                        <view class="line">
                            <view class="name font-sty01">{{item.clientName}}</view>
                            <view class="phone font-sty02">{{item.mobile}}</view>
                        </view>
                        <view class="address font-sty02">{{item.province}} {{item.city}} {{item.region}} {{item.detail}}
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="addAddress-content">
            <navigator url='/pages/editAddress/editAddress'>
                <view class="item">
                    <view class="left-part">
                        <image class="add" mode="widthFix" src="../../static/images/add.png"></image>
                        <view class="label">添加收货地址</view>
                    </view>
                    <image class="more" mode="widthFix" src="../../static/images/next.png"></image>
                </view>
            </navigator>
        </view>
    </view>
</template>

<script>
import iheader from '../../components/header.vue'
import config from '../../config.js'
import util from '../../utils/util.js'

export default {
        components: {
            iheader
        },
        data() {
            return {
                page: 1,
                size: 10,
                addList: []
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
            init(op) {
                let that = this;
                let user = util.getUser();
                if (config.debug) console.log("user", user)
                if (user === undefined || user.token === undefined || user.uid <= 0) {
                    this.login();
                    return;
                }
                this.addrList();
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/addAddress/addAddress')
                })
            },
            addrList() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.addrList, {
                    'clientId': user.clientId,
                    'page': that.page,
                    'size': that.size
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.addList = res.data;
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

    .addAddress-page {
        min-height: 100vh;
        background: #efefef;

        .my-address-list {
            background: #fff;

            .item {
                display: flex;
                justify-content: space-between;
                min-height: 160rpx;
                position: relative;
                align-items: center;
                padding-left: 30rpx;
                padding-right: 30rpx;
                @include hair-line-b(#cbcbcb);

                .text-box {
                    .line {
                        display: flex;

                        .name {
                            margin-right: 20rpx;
                            font-size: 36rpx;
                            font-weight: bold;
                        }

                        .phone {
                            font-size: 36rpx;
                        }
                    }

                    .address {
                        margin-top: 8rpx;
                    }
                }

                .more {
                    width: 32rpx;
                    display: block;
                }
            }

            .item:last-child {
                position: relative;
                @include hair-line-b(#fff);
            }
        }

        .addAddress-content {
            margin-top: 20rpx;

            .item {
                background: #fff;
                display: flex;
                align-items: center;
                padding-left: 30rpx;
                padding-right: 30rpx;
                justify-content: space-between;

                .left-part {
                    display: flex;
                    height: 100rpx;
                    align-items: center;

                    .add {
                        width: 32rpx;
                        display: block;
                        margin-right: 8rpx;
                        margin-top: 6rpx;
                    }
                }

                .more {
                    width: 32rpx;
                    display: block;
                }
            }
        }
    }
</style>

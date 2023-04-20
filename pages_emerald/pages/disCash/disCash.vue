<template>
    <view class="discash-box font-size36">
        <iheader title="佣金提现"></iheader>
        <form @submit="submit">
            <view class="top-part">
                <view class="left-text font-sty01">
                    <view>可提现额:</view>
                    <view class="price">￥{{available}}</view>
                </view>
                <view class="right-text font-sty03" @click="cashAll(available)">全部提现</view>
            </view>
            <view class="mode mode01 font-size36">
                <view class="subtitle">
                    <view class="left-icon"></view>
                    <view class="title">提现金额</view>
                </view>
                <view class="price-box">
                    <view>提现金额(元)</view>
                    <view class="price">
                        <view>￥</view>
                        <view class="price-value font-sty0">
                            <input v-model="cash" name="price" placeholder="请输入提现金额" type="text" />
                        </view>
                    </view>
                </view>
            </view>
            <view class="mode mode02 font-size36">
                <view class="subtitle">
                    <view class="left-icon"></view>
                    <view class="title">到账账户</view>
                </view>
                <view class="c-list">
                    <view :class="{'active':cashType === 1}" class="c-item" @click="cashType = 1">
                        <view class="left-name">微信</view>
                        <view class="check-box">
                            <image class="check" mode="widthFix" src="../../static/images/check.png"></image>
                        </view>
                    </view>
                    <view :class="{'active':cashType === 2}" class="c-item" @click="cashType = 2">
                        <view class="left-name">支付宝</view>
                        <view class="check-box">
                            <image class="check" mode="widthFix" src="../../static/images/check.png"></image>
                        </view>
                    </view>
                    <view :class="{'active':cashType === 3}" class="c-item" @click="cashType = 3">
                        <view class="left-name">银行</view>
                        <view class="check-box">
                            <image class="check" mode="widthFix" src="../../static/images/check.png"></image>
                        </view>
                    </view>
                    <view class="c-item">
                        <view class="left-name">支付密码</view>
                        <view class="input-box">
                            <input name="tradePwd" placeholder="请输入支付密码" type="password">
                        </view>
                    </view>
                </view>
            </view>
            <button class="btn font-size36" form-type="submit">确认提现</button>
        </form>
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
                available: 0.00,
                cash: '',
                cashType: 1
            }
        },
        onLoad: function(op) {
            if (config.debug) console.log("onLoad() op=", op);
            this.init(op);
        },
        onShow: function() {
            if (config.debug) console.log("onShow()");
        },
        methods: {
            init(op) {
                let that = this
                let user = util.getUser();
                if (config.debug) console.log("user", user)
                if (user === undefined || user.token === undefined || user.uid <= 0) {
                    this.login();
                    return;
                }
                that.available = op.available;
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/disCash/disCash')
                })
            },
            submit: function(e) {
                if (config.debug) console.log("submit", e)

                let that = this

                if (that.loading) return

                let data = e.detail.value

                if (data.price == '' || data.tradePwd == '' ) {
                    util.toastError('提现金额或支付密码不能为空')
                    return
                }

                if (data.price > that.available) {
                    util.toastError('提现金额不能大于可用余额')
                    return
                }

                this.withdraw(data);
            },
            cashAll(available) {
                this.cash = available;
            },
            withdraw(data) {
                let that = this;
                let user = util.getUser();
                util.request(config.api.withdraw, {
                    'clientId': user.clientId,
                    'price': data.price,
                    'tradePwd': data.tradePwd
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        util.toastError('提现申请成功');
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

    .discash-box {
        min-height: 100vh;
        background: #efefef;

        .top-part {
            display: flex;
            height: 110rpx;
            padding-left: 30rpx;
            padding-right: 30rpx;
            align-items: center;
            justify-content: space-between;
            background: #fff;

            .left-text {
                display: flex;

                .price {
                    margin-left: 10rpx;
                }
            }
        }

        .mode {
            .subtitle {
                height: 80rpx;
                line-height: 80rpx;
                display: flex;
                align-items: center;

                .left-icon {
                    width: 8rpx;
                    height: 36rpx;
                    background: #439057;
                    margin-left: 30rpx;
                    margin-right: 15rpx;
                }
            }

            .c-list {
                background: #fff;

                .c-item {
                    height: 110rpx;
                    display: flex;
                    align-items: center;
                    padding-left: 35rpx;
                    padding-right: 35rpx;
                    justify-content: space-between;
                    position: relative;
                    @include hair-line-b(#cbcbcb);

                    .right-box {
                        color: #666;
                    }

                    .check-box {
                        display: flex;
                        color: #666;

                        .check {
                            width: 40rpx;
                            margin-left: 20rpx;
                            opacity: 0;
                        }
                    }

                    .input-box {
                        flex: 1;

                        input {
                            width: 100%;
                            height: 100%;
                            text-align: right;
                            font-size: 36rpx;
                        }
                    }
                }

                .active {
                    .check-box {
                        display: flex;

                        .check {
                            opacity: 1;
                        }
                    }
                }

                .c-item:last-child {
                    border: none;
                }
            }
        }

        .mode01 {
            .price-box {
                background: #fff;
                padding: 30rpx;

                .price {
                    font-size: 50rpx;
                    display: flex;
                    margin-top: 6rpx;
                }
            }
        }

        .btn {
            margin-left: 20rpx;
            margin-right: 20rpx;
            background: #439057;
            color: #fff;
            height: 80rpx;
            line-height: 80rpx;
            border-radius: 6rpx;
            margin-top: 40rpx;
            text-align: center;
            cursor: pointer;
        }
    }
</style>

<template>
    <view class="page">
        <iheader title="我的" :showIcon="false"></iheader>
        <view class='base-padding row' @click='userLoginEvent'>
            <view class='user'>
                <image :src='user.avatar'></image>
                <view class='username font-lv2'>{{user.userName}}</view>
            </view>
            <view v-if="user.intro" class='color-grey font-lv3 user-intro'>{{user.intro}}</view>
        </view>

        <view class='base-padding row base-info font-lv2'>
            <view class='col-12' @click="handOrder">
                <image class="me-icon" src='../../static/images/order.png'></image>
                我的订单
                <image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
            </view>
            <navigator :url='user.uid>0 ? "/pages/myGoods/myGoods":"/pages/login/login"' class='col-12'>
                <image class="me-icon" src='../../static/images/report.png'></image>
                我的持仓
                <image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
            </navigator>
            <navigator :url='user.uid>0 ? "/pages/myBooking/myBooking":"/pages/login/login"' class='col-12'>
                <image class="me-icon" src='../../static/images/follow.png'></image>
                我的预约
                <image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
            </navigator>
            <view class='col-12' @click="handDisHome">
                <image class="me-icon" src='../../static/images/rank.png'></image>
                我的分销
                <image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
            </view>
        </view>

        <view class='base-padding row base-info font-lv2'>
            <navigator :url='"/pages/secure/secure"' class='col-12'>
                <image class="me-icon" src='../../static/images/eye.png'></image>
                安全中心
                <image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
            </navigator>
            <navigator :url='"/pages/bankMsg/bankMsg"' class='col-12'>
                <image class="me-icon" src='../../static/images/card.png'></image>
                银行账号
                <image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
            </navigator>
            <navigator :url='"/pages/addAddress/addAddress"' class='col-12'>
                <image class="me-icon" src='../../static/images/address.png'></image>
                地址管理
                <image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
            </navigator>
        </view>

        <view v-if="user.uid>0" class='base-padding row base-info font-lv2'>
            <view @click='logout' class='col-12'>
                <image class="me-icon" src='../../static/images/logout.png'></image>
                退出登录
                <image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
            </view>
        </view>

        <view class='base-padding row base-info footer'>
            <view class='col-12 text-center'>
                <!-- <view v-if="info.version">
                    <text class='font-lv4 color-grey'>软件版本：{{info.version}}</text>
                </view> -->
                <view v-if="info.copyright">
                    <text class='font-lv4 color-grey'>Copyright © {{now}} {{info.copyright}}</text>
                </view>
                <view v-if="info.license">
                    <text class='font-lv4 color-grey'>技术支持：{{info.license}}</text>
                </view>
               <!-- <view v-if="info.author">
                    <text class='font-lv4 color-grey'>Author：{{info.author}}</text>
                </view> -->
            </view>
        </view>
    </view>
</template>

<script>
import config from '../../config.js'
import util from '../../utils/util.js'

import iheader from '../../components/header.vue'

export default {
        components: {
            iheader
        },
        data() {
            return {
                info: {},
                user: {},
                now: new Date().getFullYear(),
                redirect: encodeURIComponent('/pages/login/login')
            }
        },
        onLoad(op) {
            if (config.debug) console.log("onLoad", op)
            if (op.redirect) this.redirect = op.redirect
            this.info = config.info
        },
        onShow() {
            this.initUser()
            // this.getUserMoreInfo()
        },
        methods: {
            initUser: function() {
                let that = this
                let user = util.getUser()
                if (config.debug) console.log("user", user)
                if (user == undefined || user.token == undefined || user.uid <= 0) {
                    user = {
                        'uid': 0,
                        'userName': '亲，戳我登录',
                        'avatar': '../../static/images/logo.png',
                        'intro': '不求刹那，唯玉永恒！'
                    }
                }
                that.user = user
            },
            logout: function(e) {
                let that = this
                uni.showModal({
                    title: '温馨提示',
                    content: '您确定要退出登录吗？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.logout, {
                                'clientId': that.user.clientId
                            }, 'POST', {
                                token: that.user.token
                            }).then((res) => {
                                if (config.debug) console.log(config.api.logout, res);
                                uni.navigateTo({
                                    url: '/pages/login/login?redirect=' + this.redirect
                                })
                            })
                            // util.request(config.api.logout)
                            util.clearUser()
                            util.toastSuccess('退出成功')
                            that.initUser()
                        }
                    }
                })
            },
            userLoginEvent: function(e) {
                if (config.debug) console.log("userLoginEvent", e)
                if (this.user.uid == 0) {
                    uni.navigateTo({
                        url: '/pages/login/login?redirect=' + this.redirect
                    })
                }
            },
            handOrder() {
                if (config.debug) console.log("handOrder")
                if (this.user.uid == 0) {
                    uni.navigateTo({
                        url: '/pages/login/login?redirect=' + this.redirect
                    })
                } else {
                    uni.switchTab({
                        url: '/pages/myOrder/myOrder'
                    })
                }
            },
            handDisHome() {
                if (config.debug) console.log("handDisHome")
                if (this.user.uid == 0) {
                    uni.navigateTo({
                        url: '/pages/login/login?redirect=' + this.redirect
                    })
                } else {
                    uni.switchTab({
                        url: '/pages/disHome/disHome'
                    })
                }
            }
        }
    }
</script>

<style scoped>
    page,
    .page {
        background-color: #f6f6f6;
    }

    .row {
        background-color: #fff;
        margin-bottom: 5px;
        padding: 15px;
    }

    .row:last-of-type {
        margin-bottom: 0;
    }

    .user {
        text-align: center;
        display: block;
        width: 100%;
    }

    .month-reading {
        border-left: 1px solid #f1f1f1;
        border-right: 1px solid #f1f1f1;
    }

    .user .text-muted {
        text-align: center;
    }

    .col-title {
        margin-bottom: 1px;
        color: #666;
    }

    .col-title navigator {
        display: inline-block;
    }

    .username {
        margin: 15px auto;
    }

    .user image {
        width: 90px;
        height: 90px;
        border-radius: 45px;
        border: 1px solid #ddd;
        margin: 0 auto;
        display: block;
    }

    .base-info image {
        margin-right: 15px !important;
    }

    .base-info image.pull-right {
        margin-right: 0 !important;
        top: 0;
    }

    .base-info {
        padding-top: 0upx;
        padding-bottom: 0upx;
    }

    .base-info .col-12 {
        border-bottom: 1px solid #f6f6f6;
        padding-bottom: 15px;
        padding-top: 15px;
        color: #666;
    }

    .base-info .col-12:last-of-type {
        margin-bottom: 0;
        border-bottom: 0;
    }

    .user-intro {
        width: 100%;
        text-align: center;
    }

    .user-func {
        line-height: 20px;
        border: 1px solid #000000;
    }

    .user-func .func-item {
        line-height: 300%;
        border-bottom: 1upx dashed #f1f1f1;
        padding: 0;
        margin: 0;
    }

    .user-func .color-red {
        margin-right: 4px;
    }

    .reading-time text {
        margin: auto 4px;
        color: red;
    }

    .reading-time .col-4 {
        box-sizing: border-box;
    }

    .reading-time .col-4:nth-child(1),
    .reading-time .col-4:nth-child(2),
    .reading-time .col-4:nth-child(3) {
        border-bottom: 1px solid #f6f6f6;
        padding-bottom: 8px;
    }

    .reading-time .col-4:nth-child(4),
    .reading-time .col-4:nth-child(5),
    .reading-time .col-4:nth-child(6) {
        padding-top: 8px;
    }

    .reading-time .col-4:nth-child(2),
    .reading-time .col-4:nth-child(5) {
        border-left: 1px solid #f6f6f6;
        border-right: 1px solid #f6f6f6;
    }

    image.me-icon {
        width: 20px;
        height: 20px;
        vertical-align: middle;
        margin-right: 3px;
        position: relative;
        top: -2px;
    }

    .signed image {
        width: 13px;
        height: 13px;
    }

    .signed.text-muted {
        color: #CCCCCC;
    }

    .col-title .text-right .line {
        color: #EFEFEF;
        margin: 0 10px;
    }

    .col-title .text-right>view {
        display: inline-block;
    }

    @media (min-width: 768px) {

        .base-info image,
        image.me-icon {
            max-width: 20px;
            max-height: 20px;
            top: -2upx;
        }

        .base-info .col-12 {
            padding-top: 25px;
            padding-bottom: 25px;
        }
    }
</style>

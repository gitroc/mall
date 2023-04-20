<template>
    <view class="secure-box">
        <iheader title="安全中心"></iheader>
        <view class="secure-content">
            <navigator :url='user.uid>0 ? "/pages/password/password?type=1":"/pages/login/login"'>
                <view class="item">
                    <view class="label">修改登录密码</view>
                    <image class="more" mode="widthFix" src="../../static/images/next.png"></image>
                </view>
            </navigator>
            <navigator :url='user.uid>0 ? "/pages/password/password?type=2":"/pages/login/login"'>
                <view class="item">
                    <view class="label">修改支付密码</view>
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
                user: {},
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
            init() {
                let that = this
                let user = util.getUser();
                if (config.debug) console.log("user", user)
                if (user === undefined || user.token === undefined || user.uid <= 0) {
                    this.login();
                    return;
                }

                that.user = user;
            },
            
            login() {
                uni.navigateTo({
                    url: '../../pages/login/login?redirect=' + encodeURIComponent('../../pages/secure/secure')
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../static/css/mixin.scss";

    .secure-box {
        min-height: 100vh;
        background: #efefef;

        .secure-content {
            .item {
                background: #fff;
                height: 100rpx;
                display: flex;
                align-items: center;
                padding-left: 30rpx;
                padding-right: 30rpx;
                justify-content: space-between;
                position: relative;
                @include hair-line-b(#cbcbcb);

                .more {
                    width: 32rpx;
                    display: block;
                }
            }
        }
    }
</style>

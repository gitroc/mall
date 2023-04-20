<template>
    <view class="password-page">
        <iheader :title="title"></iheader>
        <view class="password-content">
            <form @submit="submit">
                <view class="title-box">
                    <view class="left-icon"></view>
                    <view class="title">{{tips}}</view>
                </view>
                <view class="bank-box font-sty01">
                    <view class="item">
                        <view class="label">原密码</view>
                        <view class="input-box">
                            <input name="orgPwd" placeholder="请输入原密码" type="password">
                        </view>
                    </view>
                    <view class="item">
                        <view class="label">新密码</view>
                        <view class="input-box">
                            <input name="newPwd" placeholder="请输入新密码" type="password">
                        </view>
                    </view>
                    <view class="item">
                        <view class="label">确认密码</view>
                        <view class="input-box">
                            <input name="confirmPwd" placeholder="再次输入新密码" type="password">
                        </view>
                    </view>
                </view>
                <view class="tip font-sty02">{{notice}}</view>
                <button class="require-btn" form-type="submit">确认修改</button>
            </form>
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
        onLoad: function(op) {
            if (config.debug) console.log("onLoad() op=", op);
            this.init(op);
        },
        onShow: function() {
            if (config.debug) console.log("onShow()");
        },
        data() {
            return {
                type: '1',
                title: '',
                tips: '',
                notice: ''
            }
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

                that.type = op.type;
                switch (that.type) {
                    case '2':
                        that.title = '支付密码';
                        that.tips = '修改支付密码';
                        that.notice = '请输入6位数字支付密码，默认支付密码123456,及时修改';
                        break;
                    default:
                        that.title = '登录密码';
                        that.tips = '修改登陆密码';
                        that.notice = '请输如6-16位且包含字母和数字的登陆密码';
                        break;
                }
            },

            submit: function(e) {
                if (config.debug) console.log("submit", e)

                let that = this

                let data = e.detail.value

                if (data.orgPwd == '' || data.newPwd == '' || data.confirmPwd == '') {
                    util.toastError('不能为空')
                    return
                }

                if (data.newPwd != data.confirmPwd) {
                    util.toastError('两次输入新密码不一致')
                    return
                }

                if (that.type == '2') {
                    this.changeTradePwd(data);
                } else {
                    this.changePwd(data);
                }
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/bangMsg/bankMsg')
                })
            },
            changePwd(data) {
                let that = this;
                let user = util.getUser();
                util.request(config.api.changePwd, {
                    'clientId': user.clientId,
                    'orgPwd': data.orgPwd,
                    'newPwd': data.newPwd,
                    'confirmPwd': data.confirmPwd
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    util.toastSuccess('修改登陆密码成功,请重新登陆！');
                    setTimeout(function() {
                        util.clearUser();
                        that.init();
                    }, 1500)

                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },

            changeTradePwd(data) {
                let that = this;
                let user = util.getUser();
                util.request(config.api.changeTradePwd, {
                    'clientId': user.clientId,
                    'orgPwd': data.orgPwd,
                    'newPwd': data.newPwd,
                    'confirmPwd': data.confirmPwd
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data);
                    util.toastSuccess('修改支付密码成功');
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

    .password-page {
        min-height: 100vh;
        background: #efefef;

        .password-content {
            .title-box {
                height: 80rpx;
                font-size: 34rpx;
                display: flex;
                align-items: center;

                .left-icon {
                    width: 8rpx;
                    height: 36rpx;
                    background: #439057;
                    margin-left: 20rpx;
                    margin-right: 15rpx;
                }
            }

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

                .input-box {
                    flex: 1;

                    input {
                        width: 100%;
                        height: 100%;
                        text-align: right;
                    }
                }
            }

            .tip {
                font-size: 28rpx;
                margin-left: 20rpx;
                margin-right: 20rpx;
                text-align: left;
                margin-top: 20rpx;
                color: #f29400;
            }

            .require-btn {
                margin-left: 20rpx;
                margin-right: 20rpx;
                background: #439057;
                color: #fff;
                height: 80rpx;
                line-height: 70rpx;
                border-radius: 6rpx;
                margin-top: 50rpx;
                text-align: center;
            }
        }
    }
</style>

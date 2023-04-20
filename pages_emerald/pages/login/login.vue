<template>
    <view >
        <iheader title="登录"></iheader>
        <view class='base-padding'>
            <form @submit="formSubmit">
                <view class='form-body'>
                    <view>
                        <image src='../../static/images/logo.png'></image>
                    </view>
                    <view class='row font-lv2'>
                        <view class="icon">
                            <image mode="widthFix" src='../../static/images/mobilephone.png'></image>
                        </view>
                        <view class='col-9'>
                            <input auto-focus='true' name="mobile" placeholder="登陆账号" />
                        </view>
                    </view>
                    <view class='row font-lv2'>
                        <view class="icon">
                            <image src='../../static/images/mm-icon.png' mode="widthFix"></image>
                        </view>
                        <view class='col-9'>
                            <input name="password" password placeholder="登陆密码" />
                        </view>
                    </view>
                    <view class='row font-lv2'>
                        <view class="icon room">
                            <image src='../../static/images/room-id.png' mode="widthFix"></image>
                        </view>
                        <view class='col-9'>
                            <input name="roomId" placeholder="房间编号" />
                        </view>
                    </view>
                </view>
                <!-- <view class='row mgb-30 font-lv3 color-grey'>
                    <view class='col text-right' @click='findPassword'>忘记密码？</view>
                </view> -->
                <view class='row'>
                    <button :loading='loading' class='btn-submit btn-block' form-type='submit'> 马上登录</button>
                </view>
                <!-- #ifdef MP-WEIXIN -->
                <view class="row">
                    <button :loading='loadingWechat' class='btn-auth btn-block' open-type="getUserInfo"
                        @getuserinfo='wechatLogin'>
                        微信登录
                    </button>
                </view>
                <!-- #endif -->
                <!-- <view class='row'>
                    <button @click="toReg" class='btn-login btn-block'> 注册账号</button>
                </view> -->
                <view class='row mgb-30 font-lv3 color-grey'>
                    <view class='col text-right' @click='toReg'>注册账号</view>
                </view>
            </form>
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
                loading: false,
                about: config.info.about,
                redirect: encodeURIComponent('../index/index'),
                loadingWechat: false,
            }
        },
        onLoad: function() {

        },
        onShow: function() {
            let token = util.getToken()
            if (token) {
                let url = decodeURIComponent(this.redirect)
                if (url.indexOf("?") > -1) {
                    uni.redirectTo({
                        url: url
                    })
                } else {
                    uni.switchTab({
                        url: url
                    })
                }
            }
        },
        methods: {
            toReg: function() {
                uni.navigateTo({
                    url: '../../pages/reg/reg?redirect=' + this.redirect
                })
            },
            findPassword: function(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '请联系管理员将密码找回',
                })
            },
            formSubmit: function(e) {
                let that = this

                if (config.debug) console.log("formSubmit", e);
                if (that.loading) return;

                if (e.detail.value.password == '' || e.detail.value.mobile == '') {
                    util.toastError('手机号或密码不能为空')
                    return
                }

                let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
                if (!reg.test(e.detail.value.mobile)) {
                    util.toastError('输入正确手机号')
                    return
                }

                if (e.detail.value.roomId == '') {
                    util.toastError('房间编号不能为空')
                    return
                }

                that.loading = true

                util.request(config.api.login, e.detail.value, 'POST').then((res) => {
                    if (config.debug) console.log(config.api.login, res);
                    let user = res.data
                    if (user == undefined || user.uid <= 0 || user.token == '') {
                        util.toastError('登录失败：未知错误')
                        that.loading = false
                        return
                    }
                    util.setUser(user)
                    util.toastSuccess('登录成功')
                    setTimeout(function() {
                        let url = decodeURIComponent(that.redirect)
                        if (url.indexOf("?") > -1) {
                            uni.redirectTo({
                                url: url
                            })
                        } else {
                            uni.switchTab({
                                url: url
                            })
                        }
                    }, 1500)
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    that.loading = false
                    util.toastError(e.data.msg || e.errMsg)
                })
            },
            wechatLogin: function(e) {
                let that = this
                let weUser = e.detail

                if (that.loadingWechat) return
                that.loadingWechat = true

                uni.login({
                    success(res) {
                        if (config.debug) console.log("微信登录", res, weUser)
                        if (res.code) {
                            util.request(config.api.loginByWechat, {
                                code: res.code,
                                userInfo: weUser.rawData,
                            }, 'POST').then(function(res) { // 登录成功
                                let user = res.data.user
                                if (user == undefined || user.uid <= 0 || user.token == '') {
                                    util.toastError('登录失败：未知错误')
                                    that.loadingWechat = false
                                    return
                                }
                                util.setUser(user)
                                util.toastSuccess('登录成功')
                                setTimeout(function() {
                                    util.redirect(decodeURIComponent(that.redirect))
                                }, 1500)
                            }).catch(function(e) { // 如果是 401，则跳转到信息绑定页面，否则直接提示相关错误信息
                                if (config.debug) console.log(e)
                                if (e.statusCode == 401) {
                                    util.setWeChatUser(weUser)
                                    uni.navigateTo({
                                        url: '../../pages/bind/bind?redirect=' + that.redirect +
                                            "&sess=" + encodeURIComponent(e.data.data.sess),
                                    })
                                } else {
                                    util.toastError(e.data.msg || e.errMsg)
                                }
                                that.loadingWechat = false
                            })
                        } else {
                            util.toastError('登录失败！' + res.errMsg)
                        }
                    },
                    fail: function(e) {
                        util.toastError(e.errMsg)
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import url("../../static/css/reg-login.css");

    image {
        width: 90px;
        height: 90px;
        border-radius: 45px;
        border: 1px solid #ddd;
        margin: 15px auto;
        display: block;
    }

    .row {
        display: flex;

        .icon {
            width: 46rpx;
            margin-top: -5rpx;
            margin-right: 14rpx;

            image {
                display: block;
                width: 100%;
                border: none;
            }
        }

        .room {
            margin-top: -6rpx;
        }
    }
</style>

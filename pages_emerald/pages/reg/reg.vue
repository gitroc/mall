<template>
    <view>
        <iheader title="注册"></iheader>
        <view class="log-msg-box base-padding mgt-30">
            <form @submit="submit">
                <view class='form-body'>
                    <view>
                        <image src='../../static/images/logo.png'></image>
                    </view>
                    <view class='row font-lv2'>
						<view class="icon">
							<image src='../../static/images/mobilephone.png' mode="widthFix"></image>
						</view>
                        <view class='col-9'>
                            <input name="mobile" placeholder="手机号" />
                        </view>
                    </view>
                    <view class='row font-lv2'>
						<view class="icon mm">
							<image src='../../static/images/mm-icon.png' mode="widthFix"></image>
						</view>
                        <view class='col-9'>
                            <input name="password" password placeholder="登陆密码" />
                        </view>
                    </view>
                    <!-- <view class='row font-lv2'>
						<view class="icon zf">
							<image src='../../static/images/zf-icon.png' mode="widthFix"></image>
						</view>
                        <view class='col-9'>
                            <input name="tradePwd" password placeholder="设置支付密码" />
                        </view>
                    </view> -->
                    <view class='row font-lv2'>
						<view class="icon yqm">
							<image src='../../static/images/yqm-icon.png' mode="widthFix"></image>
						</view>
                        <view class='col-9'>
                            <input name="inviteCode" placeholder="邀请码" />
                        </view>
                    </view>
					<view class="jy-box">
					    <view class="item">
					        <view class="input-box">
								<image src='../../static/images/yzm-icon.png' class="yzm" mode="widthFix"></image>
					            <input class="uni-input" name="verifyCode" placeholder="验证码" />
					        </view>
					        <view class="code-img-wrapper" @click="updateImageCode">
					            <canvas canvas-id="canvas"></canvas>
					        </view>
					    </view>
					</view>
                </view>
                <!-- <view class="jy-box">
                    <view class="item">
                        <view class="input-box">
							<image src='../../static/images/yzm-icon.png' class="yzm" mode="widthFix"></image>
                            <input class="uni-input" name="verifyCode" placeholder=" 验证码" />
                        </view>
                        <view class="code-img-wrapper" @click="updateImageCode">
                            <canvas canvas-id="canvas"></canvas>
                        </view>
                    </view> -->
                    <!-- <view class="item">
                		<view class="phone-box">
                			<view>我们将发送验证码到</view>
                			<view class="phone">16786839882</view>
                		</view>
                		<view class="send-btn">获取验证码</view>
                	</view>
                	<view class="item">
                		<view class="input-box">短信验证码</view>
                		<view class="input-box dx-box">
                			<input type="text" placeholder="请输入短信验证码">
                		</view>
                	</view> -->
                <!-- </view> -->
                <view class='row text-center'>
                    <view class='color-orange mgb-30 font-lv4'>以上全为必填项，务必按照要求填写</view>
                </view>
                <view class='row'>
                    <button :loading='loading' class='btn-submit btn-block' form-type="submit"> 立即注册 </button>
                </view>
                <!-- #ifdef MP-WEIXIN -->
                <view class="row">
                    <button :loading='loadingWechat' class='btn-auth btn-block' open-type="getUserInfo"
                        @getuserinfo='wechatLogin'>
                        微信登录
                    </button>
                </view>
                <!-- #endif -->
                <view class='row mgb-30 font-lv3 color-grey'>
                    <view class='col text-right' @click='toLogin'>返回登录</view>
                </view>
            </form>
        </view>
    </view>
</template>

<script>
import config from '../../config.js'
import util from '../../utils/util.js'
import iheader from '../../components/header.vue'
import {Mcaptcha} from '../../utils/mcaptcha'

export default {
        components: {
            iheader
        },
        data() {
            return {
                loading: false,
                redirect: encodeURIComponent('/pages/me/me'),
                loadingWechat: false,
            }
        },
        onLoad(op) {
            if (config.debug) console.log('onLoad', op)
            if (op.redirect) this.redirect = op.redirect
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
        onReady() {
            this.mcaptcha = new Mcaptcha({
                el: 'canvas',
                width: 80,
                height: 35,
                createCodeImg: ""
            });
        },
        methods: {
            submit: function(e) {
                if (config.debug) console.log("submit", e)

                let that = this

                if (that.loading) return

                let data = e.detail.value

                if (data.mobile === '' || data.password === '' || data.inviteCode === '') {
                    util.toastError('以上全为必填项，务必按照要求填写')
                    return
                }

                let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
                if (!reg.test(data.mobile)) {
                    util.toastError('输入正确手机号')
                    return
                }

                if (data.verifyCode === '') {
                    util.toastError('验证码不能为空')
                    return
                }

                let verify = that.mcaptcha.validate(data.verifyCode);
                if (!verify) {
                    util.toastError('验证码错误')
                    return
                }

                that.loading = true

                util.request(config.api.register, data, 'POST').then(function(res) {
                    if (config.debug) console.log(config.api.register, res)
                    util.setUser(res.data.user)
                    uni.showToast({
                        title: '注册成功',
                    })
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
                }).catch(function(e) {
                    if (config.debug) console.log(config.api.register, e)
                    util.toastError(e.data.msg || e.errMsg)
                }).finally(function() {
                    that.loading = false
                })
            },
            toLogin: function() {
                uni.navigateTo({
                    url: '../../pages/login/login?redirect=' + this.redirect
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
                                        url: '/pages/bind/bind?redirect=' + that.redirect +
                                            "&sess=" + encodeURIComponent(e.data.data.sess),
                                    })
                                } else {
                                    util.toastError(e.data.message || e.errMsg)
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
            },
            // 刷新验证码
            updateImageCode() {
                this.mcaptcha.refresh()
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import url("../../static/css/reg-login.css");
    @import url("../../static/css/mixin.scss");

    .log-msg-box {
        min-height: 100vh;
		.row{
			display: flex;
			.icon{
				width: 50rpx;
				margin-top: -6rpx;
				margin-right: 14rpx;
				image{
					display: block;
					width:100%;
				}
			}
			.mm{
				width: 46rpx;
			}
			.zf{
				width: 52rpx;
				margin-top: -8rpx;
				margin-right: 10rpx;
			}
			.yqm{
				width:34rpx;
				margin-left: 6rpx;
				margin-right: 20rpx;
				margin-top: -3rpx;
			}
		}
        .jy-box {
            background: #fff;
			padding-top: 0;
			margin-bottom:30rpx;
			border-bottom: 1upx solid #efefef;
            .item {
				width: 100%;
                height: 110rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                .input-box {
                    flex: 1;
					display: flex;
					align-items: center;
					.yzm{
						width:60rpx;
						margin-right: 6rpx;
						display: block;
						margin-left: -6rpx;
						margin-top: 30rpx;
					}
                }


                // .phone-box {
                //     display: flex;
                // }

                .code-img-wrapper {
                    width: 160rpx;
					height: 60rpx;
                    text-align: right;
					uni-canvas{
						width: 160rpx;
						height: 60rpx;
					}
                }

                // .send-btn {
                //     flex: none;
                //     width: 100%;
                //     text-align: center;
                //     color: royalblue;
                //     margin-top: -30rpx;
                // }

                // .dx-box {
                //     flex: 1;
                //     margin-right: 30rpx;

                //     input {
                //         text-align: right;
                //     }
                // }
            }
        }
    }
</style>

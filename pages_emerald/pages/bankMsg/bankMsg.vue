<template>
    <view class="bank-msg-box">
        <iheader title="银行账号"></iheader>
        <view class="pay-box">
            <form @submit="submit">
                <view class="title-box">
                    <view class="left-icon"></view>
                    <view class="title">收款方式</view>
                </view>
                <view class="bank-box font-sty01">
                    <view class="item">
                        <view class="label">输入银行</view>
                        <view class="input-box">
                            <input v-model="bankName" class="uni-input" name="bankName" type="text" />
                        </view>
                    </view>
                    <view class="item">
                        <view class="label">开户行</view>
                        <view class="input-box">
                            <input v-model="bankOpen" class="uni-input" name="bankOpen" type="text" />
                        </view>
                    </view>
                    <view class="item">
                        <view class="label">银行卡号</view>
                        <view class="input-box">
                            <input v-model="bankNo" class="uni-input" name="bankNo" type="number" />
                        </view>
                    </view>
                    <view class="item">
                        <view class="label">持卡人</view>
                        <view class="input-box">
                            <input v-model="clientName" class="uni-input" name="clientName" type="text" />
                        </view>
                    </view>
                </view>
                <button class="save-btn" form-type="submit"> 保存</button>
            </form>
        </view>
        <!-- 验证码 start -->
        <!-- <view class="jy-box">
			<view class="item">
				<view class="input-box">
					<input class="uni-input" placeholder="请输入图片验证码"/>
				</view>
				<view class="code-img-wrapper" @click="updateImageCode">
				  <canvas style="width:220rpx;height:86rpx;" canvas-id="canvas"></canvas>
				</view>
			</view>
			<view class="item">
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
			</view>
		</view> -->
        <!-- 验证码 end -->
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
                clientName: '',
                bankName: '',
                bankOpen: '',
                bankNo: ''
            }
        },
        onLoad: function(op) {
            if (config.debug) console.log("onLoad() op=", op);
            this.init();
        },
        onShow: function() {
            if (config.debug) console.log("onShow()");
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

                if (data.clientName == '' || data.bankName == '' || data.bankOpen == '' || data.bankNo == '') {
                    util.toastError('以上资料项均需真实填写，不然影响收款')
                    return
                }

                this.setBank(data);
            },

            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/bangMsg/bankMsg')
                })
            },

            init() {
                let user = util.getUser();
                if (config.debug) console.log("user", user)
                if (user === undefined || user.token === undefined || user.uid <= 0) {
                    this.login();
                    return;
                }
                this.getBank();
            },

            getBank() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.getBank, {
                    'clientId': user.clientId,
                    'mobile': user.loginName
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.clientName = res.data.clientName;
                        that.bankName = res.data.bankName;
                        that.bankOpen = res.data.bankOpen;
                        that.bankNo = res.data.bankNo;
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },

            setBank(data) {
                let user = util.getUser();
                util.request(config.api.setBank, {
                    'clientId': user.clientId,
                    'clientName': data.clientName,
                    'bankName': data.bankName,
                    'bankOpen': data.bankOpen,
                    'bankNo': data.bankNo
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        util.toastError('保存成功！');
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },
            // 刷新验证码
            updateImageCode() {
                this.mcaptcha.refresh()
            }
        }
    }
</script>

<style lang="scss" scoped>
    //1现实的线
    @import "../../static/css/mixin.scss";

    .bank-msg-box {
        min-height: 100vh;
        background: #efefef;

        .pay-box {

            // margin-top: 10rpx;
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

            .bank-box {
                background: #fff;

                .item {
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
                        display: flex;
                        align-items: center;
                        height: 100rpx;

                        input {
                            width: 100%;
                            height: 100rpx;
                            text-align: right;
                        }
                    }
                }

                // .item:last-child{
                // 	position: relative;
                // 	@include hair-line-b(#fff);
                // }
            }
        }

        .jy-box {
            background: #fff;

            .item {
                height: 140rpx;
                display: flex;
                align-items: center;
                padding-left: 30rpx;
                padding-right: 6rpx;
                justify-content: space-between;
                flex-wrap: wrap;
                position: relative;
                @include hair-line-b(#cbcbcb);

                .input-box {
                    flex: 1
                }

                .phone-box {
                    display: flex;
                }

                .code-img-wrapper {
                    width: 220rpx;
                }

                .send-btn {
                    flex: none;
                    width: 100%;
                    text-align: center;
                    color: royalblue;
                    margin-top: -30rpx;
                }

                .dx-box {
                    flex: 1;
                    margin-right: 30rpx;

                    input {
                        text-align: right;
                    }
                }
            }
        }

        .save-btn {
            margin-left: 20rpx;
            margin-right: 20rpx;
            background: #439057;
            color: #fff;
            height: 80rpx;
            line-height: 70rpx;
            border-radius: 6rpx;
            margin-top: 40rpx;
            text-align: center;
            cursor: pointer;
        }
    }
</style>

<template>
    <view class="editAddress-page">
        <iheader title="编辑地址"></iheader>
        <view class="editAddress-content">
            <form @submit="submit">
                <view class="title-box">
                    <view class="left-icon"></view>
                    <view class="title">增加地址信息</view>
                </view>
                <view class="item">
                    <view class="label font-sty01">姓名</view>
                    <view class="input-box input-box-right">
                        <input class="font-sty02" name="clientName" type="text">
                    </view>
                </view>
                <view class="item">
                    <view class="label font-sty01">手机号</view>
                    <view class="input-box input-box-right">
                        <input class="font-sty02" name="mobile" type="text">
                    </view>
                </view>
                <view class="item">
                    <view class="label font-sty01">所在地区</view>
                    <view class="input-box">
                        <view class="check font-sty02">
                            <pickerAddress @change="change">{{tips}}</pickerAddress>
                        </view>
                        <image class="more" mode="widthFix" src="../../static/images/next.png"></image>
                    </view>
                </view>
                <view class="item">
                    <view class="label font-sty01">详细地址</view>
                    <view class="input-box input-box-right">
                        <input class="font-sty02" name="detail" type="text">
                    </view>
                </view>
                <view class="item">
                    <view class="label font-sty01">设为默认地址</view>
                    <view class="switch-box">
                        <switch checked color="#439057" @change="switchChange" />
                    </view>
                </view>
                <button class="save" form-type="submit">保存</button>
            </form>
        </view>
    </view>
</template>

<script>
import iheader from '../../components/header.vue'
import config from '../../config.js'
import util from '../../utils/util.js'
import pickerAddress from '../../components/pickerAddress.vue'

export default {
        components: {
            iheader,
            pickerAddress
        },
        data() {
            return {
                tips: '选择地址',
                province: '',
                city: '',
                region: '',
                defaultFlag: '1'
            }
        },
        methods: {
            change(data) {
                let that = this;
                that.tips = data.data.join('')
                console.log(data.data.join(''))
                that.province = data.data[0];
                that.city = data.data[1];
                that.region = data.data[2];
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
            submit: function(e) {
                if (config.debug) console.log("submit", e)

                let that = this

                let data = e.detail.value

                if (data.clientName == '' || data.mobile == '' || data.detail == '') {
                    util.toastError('不能为空')
                    return
                }

                this.setAddr(data);
            },
            setAddr(data) {
                let that = this;
                let user = util.getUser();
                util.request(config.api.setAddr, {
                    'clientId': user.clientId,
                    'clientName': data.clientName,
                    'mobile': data.mobile,
                    'province': that.province,
                    'city': that.city,
                    'region': that.region,
                    'detail': data.detail,
                    'defaultFlag': that.defaultFlag
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    util.toastSuccess('保存成功！');
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/addAddress/addAddress'
                        })
                    }, 1500)

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

    .editAddress-page {
        min-height: 100vh;
        background: #fff;

        .editAddress-content {
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
                    margin-right: 30rpx;

                    input {
                        width: 100%;
                        text-align: right;
                    }

                    .check {
                        width: 100%;
                        text-align: right;
                    }

                    .more {
                        position: absolute;
                        top: 38rpx;
                        right: 20rpx;
                        width: 32rpx;
                        display: block;
                    }
                }

                .input-box-right {
                    margin-right: 0rpx;
                }
            }

            .item:last-child {
                position: relative;
                margin-top: 20rpx;
                @include hair-line-b(#fff);
            }
        }

        .save {
            background: #439057;
            color: #fff;
            height: 80rpx;
            line-height: 70rpx;
            border-radius: 6rpx;
            margin-top: 50rpx;
            text-align: center;
            margin-left: 20rpx;
            margin-right: 20rpx;
        }
    }
</style>

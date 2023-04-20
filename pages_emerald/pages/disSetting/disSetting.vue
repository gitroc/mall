<template>
    <view class="disSetting-page">
        <iheader title="设置房间号"></iheader>
        <view class="c-list">
            <view class="item">
                <view class="label font-sty01">房间名称</view>
                <view class="input-box input-box-right">
                    <input v-model="roomName" class="font-sty02" type="text">
                </view>
            </view>
            <view class="item">
                <view class="label font-sty01">房间编号</view>
                <view class="input-box input-box-right">
                    <input v-model="roomId" class="font-sty02" type="text">
                    <view class="fz" @click="copy(roomId)">复制</view>
                </view>
            </view>
            <view class="item">
                <view class="label font-sty01">更改编号</view>
                <view class="input-box input-box-right">
                    <input v-model="roomCode" :maxlength='maxLength' :oninput='"if(value.length >" + maxLength + ") value = value.slice(0, " + maxLength  + ")"' :placeholder='tips' class="font-sty02" type="number">

                </view>
            </view>
        </view>
        <view class="tip font-sty02">备注：房间号是由房间名首字母+您输入的数字(9位)组合而成：房间号=房间名首字母（无法修改）+ 数字编号。</view>
        <button class="save" form-type="submit" @click="submit()">确认修改</button>
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
                roomName: '',
                roomId: '',
                roomCode: '',
                tips: '',
                maxLength: 0,
                isDelete: 0
            }
        },
        onLoad: function() {
            if (config.debug) console.log("onLoad()");
            this.init()
        },
        onShow: function() {
            if (config.debug) console.log("onShow()");
        },
        methods: {
            copy(text) {
                uni.setClipboardData({
                    data: text, //要被复制的内容
                    success: () => { //复制成功的回调函数
                        uni.showToast({ //提示
                            title: '复制成功'
                        })
                    }
                });
            },
            init() {
                let user = util.getUser();
                if (config.debug) console.log("user", user)
                if (user === undefined || user.token === undefined || user.uid <= 0) {
                    this.login();
                    return;
                }

                this.initRoom();
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/disSetting/disSetting')
                })
            },
            initRoom() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.initRoom, {
                    'clientId': user.clientId
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.roomName = res.data.roomName;
                        that.roomId = res.data.roomId;
                        that.maxLength = 9 - res.data.roomName.length;
                        that.tips = '请输入' + that.maxLength + '位纯数字编号';
                        that.isDelete = res.data.isDelete;
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            },
            submit() {
                let that = this;
                if (that.roomCode === '') {
                    util.toastError('请输入修改的房间号');
                    return;
                }

                if (that.isDelete > 0) {
                    util.toastError('业务开展期间不可修改');
                    return;
                }

                let user = util.getUser();
                uni.showModal({
                    title: '温馨提示',
                    content: '确定修改房间号吗？',
                    success(res) {
                        if (res.confirm) {
                            util.request(config.api.updateRoom, {
                                'clientId': user.clientId,
                                'roomCode': that.roomCode,
                            }, 'POST', {
                                token: user.token
                            }).then((res) => {
                                if (config.debug) console.log('success, res is:', res.data)
                                if (res.data) {
                                    util.toastError("修改成功");
                                    setTimeout(function() {
                                        that.initRoom();
                                    }, 1000)
                                }
                            }).catch((e) => {
                                if (config.debug) console.log(e);
                                util.toastError(e.data.msg || e.errMsg)
                            });
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    //1像素的线
    @import "../../static/css/mixin.scss";

    .disSetting-page {
        min-height: 100vh;
        background: #fff;

        .c-list {
            .item {
                height: 110rpx;
                background: #fff;
                display: flex;
                align-items: center;
                padding-left: 30rpx;
                padding-right: 30rpx;
                font-size: 34rpx;
                justify-content: space-between;
                position: relative;
                @include hair-line-b(#cbcbcb);

                .input-box {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    height: 110rpx;
                    font-size: 34rpx;

                    input {
                        flex: 1;
                        text-align: right;
                        height: 110rpx;
                        margin-right: 10rpx;
                        font-size: 34rpx;
                    }

                    .fz {
                        color: #f29400;
                    }
                }
            }
        }

        .tip {
            font-size: 30rpx;
            padding-left: 30rpx;
            padding-right: 30rpx;
            margin-top: 20rpx;
        }

        .save {
            background: #439057;
            color: #fff;
            height: 80rpx;
            line-height: 80rpx;
            border-radius: 6rpx;
            margin-top: 50rpx;
            font-size: 34rpx;
            text-align: center;
            margin-left: 30rpx;
            margin-right: 30rpx;
        }
    }
</style>

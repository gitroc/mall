<template>
    <view class="root">
        <view class="root-bg">
            <iheader :showIcon="true" :title="roomName"></iheader>
            <view v-if="banners.length>0" class="base-margin-bottom">
                <swiper :style="'height:'+bannerHeight" :autoplay="autoplay" :indicator-dots="indicatorDots"
                    :interval="interval" :duration="duration">
                    <swiper-item v-for="banner in banners" :key="banner.id" class="radius-basic">
                        <image @click="bannerClick" :data-url="banner.link" :src="banner.image"
                            :style="'height:'+bannerHeight+';width:'+bannerWidth+';min-width:100%;max-width:100%'">
                        </image>
                    </swiper-item>
                </swiper>
            </view>

            <view class='panel base-padding recommend'>
                <view class='panel-heading'>
                    <view class="icon"></view>
                    <view class='panel-title font-lv1 strong'>
                        <text class="subtitle">竞拍专场</text>
                    </view>
                </view>
                <view v-if="hots.length > 0" class="list-box">
                    <view v-for="(item,index) in hots" :key="index" class="list-item">
                        <view class='panel-body'>
                            <view class="image-box">
                                <image :src='item.img' class="screen" mode='widthFix'></image>
                                <view class="order">{{item.status}}</view>
                            </view>
                            <view class="text-box">
                                <view class="left-text">
                                    <view>{{item.name}}</view>
                                    <view class="border"></view>
                                    <view>{{item.tips}}</view>
                                    <view class="border"></view>
                                    <view>{{item.openStart}} - {{item.openEnd}}</view>
                                </view>
                                <view class="order" @click="startAction(item)">{{item.action}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="platform == 'ios'" class="ios-platform">.</view>
        </view>

    </view>
</template>

<script>
    import iheader from '../../components/header.vue'
    import util from '../../utils/util.js'
    import config from '../../config.js'
    import ListEmerald from "../../components/listEmerald";
    import {
        toLogin
    } from '@/libs/login.js';

    export default {
        components: {
            ListEmerald,
            iheader,
        },
        data() {
            return {
                bannerRatio: 1.619,
                indicatorDots: true,
                autoplay: true,
                interval: 3000,
                duration: 500,
                bannerWidth: '100%',
                bannerHeight: 'auto',
                banners: [],
                hots: [],
                platform: '',
                roomName: '中國金條'
            }
        },
        onLoad() {
            util.loading('loading...')
            if (config.debug) console.log("onLoad()");
            this.init()
        },
        onShow() {
            if (config.debug) console.log("onShow()");
        },
        methods: {
            init() {
                let that = this;
                let user = util.getUser();
                if (config.debug) console.log("user", user)
                if (user === undefined || user.token === undefined || user.uid <= 0) {
                    this.login();
                    return;
                }
                that.user = user;
                this.loadData();
            },

            loadData() {
                let that = this

                let user = util.getUser()
                Promise.all([
                    util.request(config.api.banners, {
                        'offset': 0,
                        'limit': 10,
                        'clientId': user.clientId
                    }, 'POST', {
                        token: user.token
                    }),
                    util.request(config.api.hots, {
                        'clientId': user.clientId
                    }, 'POST', {
                        token: user.token
                    })
                ]).then(function([resBanners, resHots]) {
                    if (config.debug) console.log(resBanners, resHots)
                    if (resBanners.data) {
                        that.banners = resBanners.data
                        // 计算横幅合适的宽高
                        // 转成 upx，因为两边边距设置为 30upx
                        let bannerRatio = resBanners.data.size || 1.619
                        let info = util.getSysInfo()
                        let width = info.windowWidth * info.pixelRatio - 30
                        let height = width / bannerRatio
                        that.platform = info.platform || ''
                        that.platform = that.platform.toLowerCase()
                        that.bannerWidth = width / info.pixelRatio + "px"
                        that.bannerHeight = height / info.pixelRatio + "px"
                        that.bannerRatio = bannerRatio
                    }

                    if (resHots.data) {
                        that.roomName = resHots.data[0].roomName;
                        that.hots = resHots.data;
                    }
                }).catch(function(e) {
                    console.log(e)
                    if (e.data.code === '000009') {
                        that.times = 0;
                        util.clearUser();
                        util.toastError(e.data.msg || e.errMsg);
                        setTimeout(function() {
                            that.login();
                        }, 1000)
                    } else {
                        util.toastError(e.data.msg || e.errMsg);
                    }
                }).finally(function() {
                    uni.hideLoading();
                    if (config.debug) console.log("reload")
                    let iload = setTimeout(function() {
                        clearTimeout(iload)
                        that.loadData()
                    }, 10000)
                })
            },
            bannerClick(e) {
                if (config.debug) console.log("banner click", e)
                let url = e.target.dataset.url
                if (!url) return
            },
            login() {
                toLogin();
            },
            startAction(item) {
                if (item.openTime == 1) {
                    this.subscribe(item.level);
                } else if (item.openTime == 2) {
                    uni.navigateTo({
                        url: '/pages/orderTime/orderTime?redirect=' + encodeURIComponent('/pages/index/index')
                    })
                }
            },
            subscribe(level) {
                let that = this;
                let user = util.getUser();
                util.request(config.api.subscribe, {
                    'clientId': user.clientId,
                    'priceLevel': level
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        util.toastError('预约成功！');
                    }
                }).catch((e) => {
                    if (config.debug) console.log(e);
                    util.toastError(e.data.msg || e.errMsg)
                });
            }
        }

    }
</script>

<style lang="scss">
    .root-bg {
        background: #f3f8f9;
    }

    .ios-platform {
        color: transparent;
        height: 1 upx;
        overflow: hidden;
    }

    .panel {
        padding-top: 15rpx;
        padding-bottom: 10rpx;
        margin-bottom: 25rpx;
        text-align: center;
        background: #fff;

        .screen {
            width: 100%;
            display: block;
        }

        .panel-heading {
            display: flex;

            .icon {
                width: 6rpx;
                height: 40rpx;
                margin-right: 20rpx;
                margin-top: 10rpx;
                background: #333;
            }

            .panel-title {
                padding-bottom: 20rpx;

                .subtitle {
                    font-size: 40rpx;
                    color: #333;
                    font-weight: bold;
                }
            }
        }

        .panel-body {
            margin-bottom: 20rpx;

            .image-box {
                border-radius: 20rpx;
                overflow: hidden;
                position: relative;

                image {
                    display: block;
                    width: 100%;
                }

                .order {
                    width: 140rpx;
                    height: 60rpx;
                    line-height: 60rpx;
                    font-size: 36rpx;
                    color: #fff;
                    background: #f29400;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    border-top-right-radius: 20rpx;
                }
            }

            .text-box {
                height: 80rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 34rpx;
                padding-left: 20rpx;
                padding-right: 20rpx;

                .left-text {
                    display: flex;

                    .border {
                        width: 4rpx;
                        height: 30rpx;
                        background: #666;
                        margin-left: 15rpx;
                        margin-top: 9rpx;
                        margin-right: 15rpx;
                    }
                }

                .order {
                    color: #439057;
                }
            }
        }
    }
</style>

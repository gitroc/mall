<template>
    <view class="booking-box">
        <iheader title="我的预约"></iheader>
        <view class="booking-content">
            <view v-if="listData.length > 0" class="booking-list">
                <view class="item" v-for="(item,index) in listData" :key="index">
                    <view class="name font-sty01">{{item.roomName}}</view>
                    <view class="time-box">
                        <view>预约时间:</view>
                        <view class="time">{{item.subTime}}</view>
                    </view>
                    <view class="level-box">
                        <view>预约范围:</view>
                        <view class="level">{{item.clientLevel}}</view>
                    </view>
                    <view class="status">{{item.subStatus}}</view>
                </view>
                <view class="more-box">
                    <uni-load-more :contentText="contentText" :loadingType="loadingType" :status="status" />
                </view>
            </view>
            <view v-if="listData.length <= 0" class="none-box">
                <image class="screen" mode="widthFix" src='../../static/images/blank.png'></image>
            </view>
        </view>
    </view>
</template>

<script>
import iheader from '../../components/header.vue'
import uniLoadMore from '@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.vue'
import util from '../../utils/util.js'
import config from "../../config"

export default {
        components: {
            iheader,
            uniLoadMore
        },
        data() {
            return {
                page: 1,
                size: 10,
                status: 'more',
                listData: [{
                    roomName: '',
                    subTime: '',
                    clientLevel: '',
                    subStatus: ''
                }],
                loadingType: 1, //定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
                contentText: {
                    contentdown: '上拉显示更多',
                    contentrefresh: '正在加载...',
                    contentnomore: '没有更多数据了'
                }
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
            init() {
                let that = this;
                let user = util.getUser();
                util.request(config.api.subList, {
                    'clientId': user.clientId,
                    'page': that.page,
                    'size': that.size
                }, 'POST', {
                    token: user.token
                }).then((res) => {
                    if (config.debug) console.log('success, res is:', res.data)
                    if (res.data) {
                        that.listData = res.data;
                        for (let i = 0; i < that.listData.length; i++) {
                            if (that.listData[i].status == 1) {
                                that.listData[i].subStatus = '已配单'
                            } else {
                                that.listData[i].subStatus = '已预约'
                            }
                        }
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
    .booking-box {
        min-height: 100vh;
        background: #efefef;

        .booking-content {
            .booking-list {
                .item {
                    min-height: 150rpx;
                    background: #fff;
                    margin-top: 15rpx;
                    margin-bottom: 15rpx;
                    padding: 20rpx;
                    padding-left: 30rpx;
                    color: #666;
                    font-size: 28rpx;
                    position: relative;

                    .name {
                        font-size: 36rpx;
                        font-weight: 550;
                    }

                    .time-box {
                        display: flex;
                        margin-top: 15rpx;
                    }

                    .level-box {
                        display: flex;
                    }

                    .status {
                        position: absolute;
                        right: 30rpx;
                        top: 30rpx;
                    }
                }
            }

            .none-box {
                min-height: 100vh;
                background: #fff;
                display: flex;

                image {
                    display: block;
                    width: 248rpx;
                    margin: 0 auto;
                    margin-top: 150rpx;
                }

                .tip {
                    font-size: 34rpx;
                    margin-top: 40rpx;
                    text-align: center;
                }
            }
        }
    }
</style>

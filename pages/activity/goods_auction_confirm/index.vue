<template>
    <view>
        <view class='order-submission'>
            <view class="pad30 allAddress">
                <view class='wrapper borRadius14'>
                    <view class='item acea-row row-between-wrapper'>
                        <view>买家信息</view>
                    </view>
                    <view class='address acea-row row-between-wrapper'>
                        <view class='addressCon'>
                            <view class='name'>{{orderInfoVo.realName}}
                                <text class='phone'>{{orderInfoVo.phone}}</text>
                            </view>
                            <view class="acea-row">
                                <text class='default font-color'>[默认]</text>
                                <text
                                    class="line2">{{orderInfoVo.province}}{{orderInfoVo.city}}{{orderInfoVo.district}}{{orderInfoVo.detail}}</text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class='line'>
                    <image src='/static/images/line.jpg'></image>
                </view>
            </view>
            <view class="pad30">
                <auctionGoods :cartInfo="cartInfo" :orderProNum="orderProNum"></auctionGoods>
                <view class='wrapper borRadius14'>
                    <view class='item acea-row row-between-wrapper'>
                        <view>交易流程</view>
                    </view>
                    <view class='way acea-row row-middle'>
                        <view class='item acea-row row-middle'>
                            <text class='num'>①</text>
                            立即抢拍
                        </view>
                        <view class='iconfont icon-arrow'></view>
                        <view class='item'>
                            <text class='num'>②</text>
                            自由上架
                        </view>
                        <view class='iconfont icon-arrow'></view>
                        <view class='item'>
                            <view>
                                <text class='num'>③</text>
                                尽享收益
                            </view>
                        </view>
                    </view>
                </view>
                <view class='wrapper borRadius14'>
                    <view class='item'>
                        <view>支付方式</view>
                        <view class='list'>
                            <view class='payItem acea-row row-middle' :class='active==index ?"on":""'
                                @tap='payItem(index)' v-for="(item,index) in cartArr" :key='index'
                                v-if="item.payStatus==1">
                                <view class='name acea-row row-center-wrapper'>
                                    <view class='iconfont animated'
                                        :class='(item.icon) + " " + (animated==true&&active==index ?"bounceIn":"")'>
                                    </view>
                                    {{item.name}}
                                </view>
                                <view class='tip'>{{item.title}}</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class='moneyList borRadius14'>
                    <view class='item acea-row row-between-wrapper'>
                        <view>拍品价格：</view>
                        <view class='money'>￥{{orderInfoVo.payFee || 0}}</view>
                    </view>
                    <view class='item acea-row row-between-wrapper' v-if="auctionInfoVo.deductionPrice > 0">
                        <view>积分抵扣：</view>
                        <view class='money'>-{{auctionInfoVo.deductionPrice}}</view>
                    </view>
                    <view class='item acea-row row-between-wrapper' v-if="auctionInfoVo.surplusIntegral > 0">
                        <view>积分剩余：</view>
                        <view class='money'>{{auctionInfoVo.surplusIntegral}}</view>
                    </view>
                </view>
                <view style='height:120rpx;'></view>
            </view>
            <view class='footer acea-row row-between-wrapper'>
                <view>
                    <text class='font-color'></text>
                </view>
                <view class='settlement' style='z-index:100' @tap="subOrder">立即抢拍</view>
            </view>
        </view>
        <!-- #ifdef MP -->
        <!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
        <!-- #endif -->
        <home></home>
    </view>
</template>
<script>
    import {
        orderCreate,
        loadPreOrderApi,
        postOrderComputed
    } from '@/api/auction.js'
    import {
        openPaySubscribe
    } from '@/utils/SubscribeMessage.js';
    import auctionGoods from '@/components/auctionGoods';
    import home from '@/components/home';
    import {
        toLogin
    } from '@/libs/login.js';
    import {
        mapGetters
    } from "vuex";
    // #ifdef MP
    import authorize from '@/components/Authorize';
    // #endif
    export default {
        components: {
            auctionGoods,
            home,
            // #ifdef MP
            authorize
            // #endif
        },
        data() {
            return {
                //支付方式
                cartArr: [
                    // {
                    //     "name": "余额支付",
                    //     "icon": "icon-icon-test",
                    //     value: 'yue',
                    //     title: '可用余额:',
                    //     payStatus: 1,
                    // }, 
                    {
                        "name": "积分支付",
                        "icon": "icon-yuezhifu",
                        value: 'integral',
                        title: '可用积分:',
                        payStatus: 1,
                    }
                ],
                payType: 'integral', //支付方式
                active: 0, //支付方式切换
                addressId: 0, //地址id
                userInfo: {}, //用户信息
                mark: '', //备注信息
                useIntegral: true, //是否使用积分
                integral: 0,
                ChangePrice: 0, //使用积分抵扣变动后的金额
                formIds: [], //收集formid
                status: 0,
                is_address: false,
                toPay: false, //修复进入支付时页面隐藏从新刷新页面
                shippingType: 0,
                system_store: {},
                storePostage: 0,
                contacts: '',
                contactsTel: '',
                mydata: {},
                cartInfo: [],
                priceGroup: {},
                animated: false,
                totalPrice: 0,
                integralRatio: "0",
                pagesUrl: "",
                orderKey: "",
                offlinePostage: "",
                isAuto: false, //没有授权的不会自动授权
                isShowAuth: false, //是否隐藏授权
                news: true,
                again: false,
                addAgain: false,
                orderInfoVo: {},
                auctionInfoVo: {},
                orderProNum: 0,
                preOrderNo: '' //预下单订单号
            };
        },
        computed: mapGetters(['isLogin', 'systemPlatform', 'productType']),
        watch: {
            isLogin: {
                handler: function(newV, oldV) {
                    if (newV) {

                    }
                },
                deep: true
            }
        },
        onLoad(options) {
            var that = this;
            this.preOrderNo = options.preOrderNo || 0;
            if (this.isLogin) {
                that.getloadPreOrder();
                this.computedPrice();
            } else {
                toLogin();
            }
        },
        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
            let _this = this

            if (this.isLogin && this.toPay == false) {}

            uni.$on("handClick", res => {
                if (res) {
                    _this.system_store = res.address
                }
                // 清除监听
                uni.$off('handClick');
            })
        },
        /**
         * 生命周期函数--监听页面隐藏
         */
        // onHide: function() {
        // 	console.log(999);
        // 	this.isClose = true
        // },
        methods: {
            // 订单详情
            getloadPreOrder: function() {
                loadPreOrderApi(this.preOrderNo).then(res => {
                    let orderInfoVo = res.data.auctionOrderInfoVo
                    this.orderInfoVo = orderInfoVo;
                    this.cartInfo = orderInfoVo.orderDetailList;
                    this.orderProNum = orderInfoVo.orderProNum;
                    // this.cartArr[0].title = '可用余额:' + orderInfoVo.userBalance;
                    // this.cartArr[0].payStatus = parseInt(res.data.integralPayStatus) === 1 ? 1 : 2;
                    this.cartArr[0].title = '可用积分:' + orderInfoVo.userIntegral;
                    this.cartArr[0].payStatus = parseInt(res.data.integralPayStatus) === 1 ? 1 : 0;
                    if (orderInfoVo.addressId == 0) {
                        return this.$util.Tips({
                            title: '先设置默认买家地址'
                        });
                    } else {
                        this.addressId = orderInfoVo.addressId;
                    }
                }).catch(err => {
                    return this.$util.Tips({
                        title: err
                    });
                })
            },
            /**
             * 授权回调事件
             * 
             */
            onLoadFun: function() {
                ;
            },
            // 计算订单价格
            computedPrice: function() {
                let shippingType = this.shippingType;
                postOrderComputed({
                    useIntegral: this.useIntegral ? true : false,
                    shippingType: parseInt(shippingType),
                    preOrderNo: this.preOrderNo
                }).then(res => {
                    this.auctionInfoVo = res.data;                 
                }).catch(err => {
                    return this.$util.Tips({
                        title: err
                    });
                });
            },

            payItem: function(e) {
                let that = this;
                let active = e;
                that.active = active;
                that.animated = true;
                that.payType = that.cartArr[active].value;
                that.computedPrice();
                setTimeout(function() {
                    that.car();
                }, 500);
            },
            car: function() {
                let that = this;
                that.animated = false;
            },
            payment: function(data) {
                let that = this;
                orderCreate(data).then(res => {
                    that.getOrderPay(res.data.auctionOrderNo, '支付成功');
                }).catch(err => {
                    uni.hideLoading();
                    return that.$util.Tips({
                        title: err
                    });
                });
            },
            getOrderPay: function(orderNo, message) {
                let that = this;
                let goPages = '/pages/activity/goods_auction_status/index?order_id=' + orderNo + '&msg=' + message;
                uni.navigateTo({
                    url: goPages
                });
            },
            subOrder: function(e) {
                let that = this,
                    data = {};

                if (!that.payType) return that.$util.Tips({
                    title: '请选择支付方式'
                });
                
                data = {
                    realName: that.orderInfoVo.realName,
                    phone: that.orderInfoVo.phone,
                    addressId: that.addressId,
                    payType: that.payType,
                    useIntegral: that.useIntegral,
                    preOrderNo: that.preOrderNo,
                    shippingType: that.shippingType,
                };
                if (data.payType == 'integral' && !that.auctionInfoVo.useIntegral)
                    return that.$util
                        .Tips({
                            title: '积分不足，抢拍失败！'
                        });
                uni.showLoading({
                    title: '订单支付中'
                });
                // #ifdef MP
                openPaySubscribe().then(() => {
                    that.payment(data);
                });
                // #endif
                // #ifndef MP
                that.payment(data);
                // #endif
            }
        }
    }
</script>

<style lang="scss" scoped>
    .line2 {
        width: 504rpx;
    }

    .textR {
        text-align: right;
    }

    .order-submission .line {
        width: 100%;
        height: 3rpx;
    }
    
    .order-submission {
        background-color: #fff;
    }

    .order-submission .line image {
        width: 100%;
        height: 100%;
        display: block;
    }

    .order-submission .address {
        padding: 28rpx;
        background-color: #fff;
        box-sizing: border-box;
    }

    .order-submission .address .addressCon {
        width: 596rpx;
        font-size: 26rpx;
        color: #666;
    }

    .order-submission .address .addressCon .name {
        font-size: 30rpx;
        color: #282828;
        font-weight: bold;
        margin-bottom: 10rpx;
    }

    .order-submission .address .addressCon .name .phone {
        margin-left: 50rpx;
    }

    .order-submission .address .addressCon .default {
        margin-right: 12rpx;
    }

    .order-submission .address .addressCon .setaddress {
        color: #333;
        font-size: 28rpx;
    }

    .order-submission .address .iconfont {
        font-size: 35rpx;
        color: #707070;
    }

    .order-submission .allAddress {
        width: 100%;
        background: linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
        // background-image: linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
        // background-image: -webkit-linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
        // background-image: -moz-linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
        padding: 60rpx 30rpx 0 30rpx;
    }
    
    .order-submission .allAddress .nav {
        width: 690rpx;
        margin: 0 auto;
    }

    .order-submission .allAddress .nav .item {
        width: 334rpx;
    }

    .order-submission .allAddress .nav .item.on {
        position: relative;
        width: 230rpx;
    }

    .order-submission .allAddress .nav .item.on::before {
        position: absolute;
        bottom: 0;
        content: "快递配送";
        font-size: 28rpx;
        display: block;
        height: 0;
        width: 336rpx;
        border-width: 0 20rpx 80rpx 0;
        border-style: none solid solid;
        border-color: transparent transparent #fff;
        z-index: 2;
        border-radius: 14rpx 36rpx 0 0;
        text-align: center;
        line-height: 80rpx;
    }

    .order-submission .allAddress .nav .item:nth-of-type(2).on::before {
        content: "到店自提";
        border-width: 0 0 80rpx 20rpx;
        border-radius: 36rpx 14rpx 0 0;
    }

    .order-submission .allAddress .nav .item.on2 {
        position: relative;
    }

    .order-submission .allAddress .nav .item.on2::before {
        position: absolute;
        bottom: 0;
        content: "到店自提";
        font-size: 28rpx;
        display: block;
        height: 0;
        width: 401rpx;
        border-width: 0 0 60rpx 60rpx;
        border-style: none solid solid;
        border-color: transparent transparent #f7c1bd;
        border-radius: 36rpx 14rpx 0 0;
        text-align: center;
        line-height: 60rpx;
    }

    .order-submission .allAddress .nav .item:nth-of-type(1).on2::before {
        content: "快递配送";
        border-width: 0 60rpx 60rpx 0;
        border-radius: 14rpx 36rpx 0 0;
    }

    .order-submission .allAddress .address {
        width: 690rpx;
        max-height: 180rpx;
        margin: 0 auto;
    }

    .order-submission .allAddress .line {
        width: 100%;
        margin: 0 auto;
    }

    .order-submission .wrapper .item .discount .placeholder {
        color: #ccc;
    }

    .order-submission .wrapper {
        background-color: #fff;
        margin-top: 15rpx;
    }

    .order-submission .wrapper .item {
        padding: 27rpx 24rpx;
        font-size: 30rpx;
        color: #333333;
        border-bottom: 1px solid #F5F5F5;
    }

    .order-submission .wrapper .item .discount {
        font-size: 30rpx;
        color: #333;
    }

    .order-submission .wrapper .item .discount .iconfont {
        color: #515151;
        font-size: 30rpx;
        margin-left: 15rpx;
    }

    .order-submission .wrapper .item .discount .num {
        font-size: 32rpx;
        margin-right: 20rpx;
    }

    .order-submission .wrapper .item .shipping {
        font-size: 30rpx;
        color: #999;
        position: relative;
        padding-right: 58rpx;
    }

    .order-submission .wrapper .item .shipping .iconfont {
        font-size: 35rpx;
        color: #707070;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 30rpx;
    }

    .order-submission .wrapper .item textarea {
        background-color: #f9f9f9;
        width: auto !important;
        height: 140rpx;
        border-radius: 14rpx;
        margin-top: 30rpx;
        padding: 15rpx;
        box-sizing: border-box;
        font-weight: 400;
    }

    .order-submission .wrapper .item .placeholder {
        color: #ccc;
    }

    .order-submission .wrapper .item .list {
        margin-top: 35rpx;
    }

    .order-submission .wrapper .item .list .payItem {
        border: 1px solid #eee;
        border-radius: 14rpx;
        height: 86rpx;
        width: 100%;
        box-sizing: border-box;
        margin-top: 20rpx;
        font-size: 28rpx;
        color: #282828;
    }

    .order-submission .wrapper .item .list .payItem.on {
        border-color: #fc5445;
        color: $theme-color;
    }

    .order-submission .wrapper .item .list .payItem .name {
        width: 50%;
        text-align: center;
        border-right: 1px solid #eee;
    }

    .order-submission .wrapper .item .list .payItem .name .iconfont {
        width: 44rpx;
        height: 44rpx;
        border-radius: 50%;
        text-align: center;
        line-height: 44rpx;
        background-color: #fe960f;
        color: #fff;
        font-size: 30rpx;
        margin-right: 15rpx;
    }

    .order-submission .wrapper .item .list .payItem .name .iconfont.icon-weixin2 {
        background-color: #41b035;
    }

    .order-submission .wrapper .item .list .payItem .tip {
        width: 49%;
        text-align: center;
        font-size: 26rpx;
        color: #aaa;
    }

    .order-submission .moneyList {
        margin-top: 15rpx;
        background-color: #fff;
        padding: 30rpx;
    }

    .order-submission .moneyList .item {
        font-size: 28rpx;
        color: #282828;
    }

    .order-submission .moneyList .item~.item {
        margin-top: 20rpx;
    }

    .order-submission .moneyList .item .money {
        color: #E93323;
        font-size: 24rpx;
        font-family: 'Guildford Pro';
    }

    .order-submission .footer {
        width: 100%;
        height: 100rpx;
        background-color: #fff;
        padding: 0 30rpx;
        font-size: 28rpx;
        color: #333;
        box-sizing: border-box;
        position: fixed;
        bottom: 0;
        left: 0;
    }

    .order-submission .footer .settlement {
        font-size: 30rpx;
        color: #fff;
        width: 240rpx;
        height: 70rpx;
        // background-color: $theme-color;
        border-radius: 50rpx;
        text-align: center;
        line-height: 70rpx;
        background: linear-gradient(90deg, #FF7931 0%, #E93323 100%);
    }

    .footer .transparent {
        opacity: 0
    }
</style>

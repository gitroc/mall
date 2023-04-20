import {
	preOrderApi
} from '@/api/auction.js';
import util from 'utils/util'


/**
 * 竞拍预下单
 */
export function getPreAuction(orderDetails) {
    return new Promise((resolve, reject) => {
        preOrderApi({
            "orderDetails": orderDetails
        }).then(res => {
            uni.navigateTo({
                url: '/pages/activity/goods_auction_confirm/index?preOrderNo=' + res.data.preOrderNo
            });
        }).catch(err => {
            return util.Tips({
                title: err
            });
        })
    });
}
import request from "@/utils/request.js";

/**
 * 预下单
 * @param object data
 */
export function preOrderApi(data) {
	return request.post(`auction/pre/order`, data);
}

/**
 * 加载预下单
 * @param object preOrderNo
 */
export function loadPreOrderApi(preOrderNo) {
	return request.get(`auction/load/pre/${preOrderNo}`);
}

/**
 * 订单创建
 * @param string key
 * @param object data
 * 
 */
export function orderCreate(data) {
	return request.post('auction/create', data);
}

/**
 * 计算订单金额
 * @param key
 * @param data
 * @returns {*}
 */
export function postOrderComputed(data) {
	return request.post("auction/computed/price", data);
}

/**
 * 订单列表
 * @param object data
 */
export function getOrderList(data) {
	return request.get('auction/order/list', data);
}

/**
 * 订单统计数据
 */
export function orderData() {
	return request.get('auction/order/data')
}

/**
 * 订单详情
 * @param string orderId 
 */
export function getOrderDetail(orderId) {
	return request.get('auction/order/detail/' + orderId);
}

/**
 * 订单详情
 * @param string orderId 
 */
export function onSale(orderId) {
	return request.get('auction/order/onsale/' + orderId);
}
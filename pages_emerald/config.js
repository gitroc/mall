// api host，末尾不要带斜杠。后端程序是BookStack (https://github.com/truthhun/BookStack)
let host = 'http://1.116.136.69:8088/emerald'
// let host = 'http://localhost:8888/emerald'

// 默认分享的内容
let shareContent = '中國金條，黄金提货券互助交易系统'
let shareLink = 'http://d.firim.pro/qczn'

// 是否是调试模式。如果是生产环境，请设置为false
// const debug = true
const debug = true

// 横幅广告id，如果申请了腾讯小程序的广告，则创建一个横幅广告，把广告的AdUnitId粘贴进来即可，不投放广告，则把该值设置为空
const bannerAdUnitId = ''

// 程序信息，置空则不显示
const info = {
    about: 'help/about', // "关于我们"的文档标识
    version: 'v1.0.0',
    copyright: '中國金條',
    license: '七彩(中国)网络技术有限公司',
    author: '中國金條',
}

const api = {
    search: `${host}/api/v1/search`,
    orderReport: `${host}/api/v1/order/report`,
    orderStatis: `${host}/api/v1/order/statis`,
    roomOperate: `${host}/api/v1/room/operate`,
    fansTotal: `${host}/api/v1/fans/total`,
    fansList: `${host}/api/v1/fans/list`,
    seoOrders: `${host}/api/v1/seo/orders`,
    logList: `${host}/api/v1/log/list`,
    withdrawAuditList: `${host}/api/v1/withdraw/audit/list`,
    withdrawAudit: `${host}/api/v1/withdraw/audit`,
    withdrawList: `${host}/api/v1/withdraw/list`,
    withdraw: `${host}/api/v1/withdraw`,
    disHome: `${host}/api/v1/dis/home`,
    setAddr: `${host}/api/v1/set/addr`,
    addrList: `${host}/api/v1/addr/list`,
    auditList: `${host}/api/v1/audit/list`,
    auditTransfer: `${host}/api/v1/audit/transfer`,
    auditConfirm: `${host}/api/v1/audit/confirm`,
    auditApply: `${host}/api/v1/audit/apply`,
    audit: `${host}/api/v1/audit`,
    apply: `${host}/api/v1/apply`,
    deal: `${host}/api/v1/deal`,
    pay: `${host}/api/v1/pay`,
    getBank: `${host}/api/v1/get/bank`,
    setBank: `${host}/api/v1/set/bank`,
    roomSub: `${host}/api/v1/room/sub`,
    subList: `${host}/api/v1/sub/list`,
    ownList: `${host}/api/v1/own/list`,
    orderList: `${host}/api/v1/order/list`,
    goodsUnBlock: `${host}/api/v1/goods/unBlock`,
    goodsSealUp: `${host}/api/v1/goods/sealUp`,
    goodsTransfer: `${host}/api/v1/goods/transfer`,
    goodsSplit: `${host}/api/v1/goods/split`,
    goodsList: `${host}/api/v1/goods/list`,
    goodsAll: `${host}/api/v1/goods/all`,
    goodsReceive: `${host}/api/v1/goods/receive`,
    goodsConfirm: `${host}/api/v1/goods/confirm`,
    seckill: `${host}/api/v1/seckill`,
    initRoom: `${host}/api/v1/init/room`,
    updateRoom: `${host}/api/v1/update/room`,
    subscribe: `${host}/api/v1/subscribe`,
    banners: `${host}/api/v1/banners`,
    hots: `${host}/api/v1/hots`,
    register: `${host}/api/v1/register`,
    changePwd: `${host}/api/v1/change/password`,
    changeTradePwd: `${host}/api/v1/change/trade/password`,
    logout: `${host}/api/v1/logout`,
    login: `${host}/api/v1/login`,
    loginByWechat: `${host}/api/v1/login-by-wechat`,
    loginBindWechat: `${host}/api/v1/login-bind-wechat`,
    loginedBindWechat: `${host}/api/v1/login-bind-wechat`,
    categories: `${host}/api/v1/book/categories`,
    bookLists: `${host}/api/v1/book/lists`,
    bookListsByCids: `${host}/api/v1/book/lists-by-cids`,
    bookInfo: `${host}/api/v1/book/info`,
    historyReadBook: `${host}/api/v1/book/history`,
    bookMenu: `${host}/api/v1/book/menu`,
    bookDownload: `${host}/api/v1/book/download`,
    searchBook: `${host}/api/v1/search/book`,
    searchDoc: `${host}/api/v1/search/doc`,
    bookmark: `${host}/api/v1/book/bookmark`,
    read: `${host}/api/v1/book/read`,
    userInfo: `${host}/api/v1/user/info`,
    userMoreInfo: `${host}/api/v1/user/more-info`,
    userRelease: `${host}/api/v1/user/release`,
    userFans: `${host}/api/v1/user/fans`,
    userFollow: `${host}/api/v1/user/follow`,
    userSign: `${host}/api/v1/user/sign`,
    bookshelf: `${host}/api/v1/user/bookshelf`,
    bookStar: `${host}/api/v1/book/star`,
    comment: `${host}/api/v1/book/comment`,
    bookRelated: `${host}/api/v1/book/related`,
    changeAvatar: `${host}/api/v1/user/change-avatar`,
    lastestVersion: `${host}/api/v1/version`,
    rank: `${host}/api/v1/rank`,
}

module.exports = {
    api,
    debug,
    info,
    shareContent,
    shareLink,
}

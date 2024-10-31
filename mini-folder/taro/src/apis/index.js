import server from "../utils/server"
import {gateway} from "../utils/config"

 const getOpenid = (data) => {
    return server({
        url:`${gateway}wechat/getOpenid`,
        data,
        method:"GET"
    })
 }

 const getTitleConfig = (data) => {
    return server({
        url:`${gateway}wechat/getPageTitles`,
        data,
        method:"GET"
    })
 }
 const getPhone = (data) => {
    return server({
        url:`${gateway}wechat/getPhoneNumber`,
        data,
        method:"GET"
    })
 }
const apis = {
    getOpenid,
    getTitleConfig,
    getPhone
}

export default apis
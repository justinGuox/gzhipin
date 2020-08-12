// 包含 n 个接口请求函数的模块
// 每个函数返回的都是 promise 对象

import ajax from './ajax'
// 注册接口
export const reqRegister = (user) => ajax('/register', user, 'POST')
// 登录接口
export const reqLogin = (user) => ajax('/login', user, 'POST')
// 更新用户信息
export const reqUpdateUser = (user) => ajax('/update', user, 'POST')
// 获取用户信息
export const reqUser = () => ajax('/user')
// 获取用户信息列表
export const reqUserList = (type) => ajax('/userlist', type)
// 获取当前用户的聊天信息列表
export const reqChatMsgList = () => ajax('/msglist')
// 修改指定消息为已读
export const reqReadMsg = (from) => ajax('/readmsg', from, 'POST')

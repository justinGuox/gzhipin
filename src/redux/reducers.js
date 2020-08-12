// 包含多个用于生成新的 state 的 reducer 函数的模块
// 根据老的state和指定的action返回一个新的state
import { combineReducers } from 'redux'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ,
} from './action-types'

import { getRedirectTo } from '../utils'

const initUser = {
  username: '', //用户名
  type: '', // 用户类型
  msg: '', //返回的错误提示信息
  redirectTo: '', //需要自动重定向的路由路劲
}
// 产生user状态的reducer
function user(state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS: //data是user
      const { type, header } = action.data
      return { ...action.data, redirectTo: getRedirectTo(type, header) }
    case ERROR_MSG: //data是msg
      return { ...state, msg: action.data }
    case RECEIVE_USER:
      return action.data
    case RESET_USER:
      return { ...initUser, msg: action.data }
    default:
      return state
  }
}
const initUserList = []
// 产生userlist状态的reducer
function userList(state = initUserList, action) {
  switch (action.type) {
    case RECEIVE_USER_LIST: //data值为userList
      return action.data
    default:
      return state
  }
}
const initChat = {
  users: {}, // 所有用户信息的对象  属性名: userid, 属性值是: {username, header}
  chatMsgs: [], // 当前用户所有相关msg的数组
  unReadCount: 0, // 总的未读数量
}

// 产生聊天状态的reducer
function chat(state = initChat, action) {
  switch (action.type) {
    case RECEIVE_MSG_LIST:
      const { users, chatMsgs, userid } = action.data
      return {
        users,
        chatMsgs,
        unReadCount: chatMsgs.reduce(
          (perTotal, msg) =>
            perTotal + (!msg.read && msg.to === userid ? 1 : 0),
          0
        ),
      }
    case RECEIVE_MSG: // data：chatMsg
      const { chatMsg, userId } = action.data
      return {
        users: state.users,
        // 留下之前的所有消息数据，再往后加一个新的消息数据
        chatMsgs: [...state.chatMsgs, chatMsg],
        unReadCount:
          state.unReadCount + (!chatMsg.read && chatMsg.to === userId ? 1 : 0),
      }
    case MSG_READ:
      const { count, from, to } = action.data
      return {
        users: state.users,
        chatMsgs: state.chatMsgs.map((msg) => {
          if (msg.from === from && msg.to === to && !msg.read) {
            return { ...msg, read: true }
          } else {
            return msg
          }
        }),
        unReadCount: state.unReadCount - count,
      }
    default:
      return state
  }
}

export default combineReducers({
  user,
  userList,
  chat,
})

//向外暴露的状态的结构：{user:{}}

/*
  用户路由主界面
    user:/user
    boss:/boss
  用户信息完善界面路由
    user:/userinfo
    boss:/bossinfo
  判断是否已经完善信息？user.header是否有值
  判断用户类型：user.type
*/
// 判断登陆或注册成功后去哪个界面
// function getRedirectTo(type, header) {
//   let path
//   if (type === 'user') {
//     path = '/user'
//   } else {
//     path = '/boss'
//   }
//   if (!header) {
//     //没有头像才去信息完善界面
//     path += 'info'
//   }
//   return path
// }

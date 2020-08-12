// 包含n个action creator
// 异步action
// 同步action
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg,
} from '../api'
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
import io from 'socket.io-client'

/*
单例对象
1、创建对象之前：判断对象是否已经存在，只有不存在时才去创建
2、创建对象之后：保存对象
*/
function initIo(dispatch, userid) {
  if (!io.socket) {
    io.socket = io('ws://localhost:4000')
    io.socket.on('serverMsg', function (chatMsg) {
      // console.log(chatMsg)
      // 只有当前消息是与当前用户有关，才分发action保存
      if (chatMsg.from === userid || chatMsg.to === userid) {
        dispatch(receiveMsg(chatMsg, userid))
      }
    })
  }
}
//获取消息列表
async function getMsgList(dispatch, userid) {
  initIo(dispatch, userid)
  const response = await reqChatMsgList()
  const result = response.data
  if (result.code === 0) {
    const { users, chatMsgs } = result.data
    //分发同步action
    dispatch(receiveMsgList({ users, chatMsgs, userid }))
  }
}
// 发送消息的异步action
export const sendMsg = ({ from, to, content }) => {
  return (dispatch) => {
    //console.log({ from, to, content })
    // 发消息
    io.socket.emit('sendMsg', { from, to, content })
  }
}

// 授权成功的同步action
const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user })
// 错误提示信息的同步action
const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg })
// 接受用户的同步action
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user })
//重置用户的同步action
export const resetUser = (msg) => ({ type: RESET_USER, data: msg })
//接受用户列表的同步action
const receiveUserList = (userList) => ({
  type: RECEIVE_USER_LIST,
  data: userList,
})
// 接受消息列表
const receiveMsgList = ({ users, chatMsgs, userid }) => ({
  type: RECEIVE_MSG_LIST,
  data: { users, chatMsgs, userid },
})
// 接收一个消息的同步action
const receiveMsg = (chatMsg, userId) => ({
  type: RECEIVE_MSG,
  data: { chatMsg, userId },
})
// 代表我已读某消息
const msgRead = ({ count, from, to }) => ({
  type: MSG_READ,
  data: { count, from, to },
})

// 注册的异步actions
export const register = (user) => {
  const { username, password, type } = user
  return async (dispatch) => {
    // 发送注册的异步ajax请求
    const response = await reqRegister({ username, password, type })
    const result = response.data
    if (result.code === 0) {
      getMsgList(dispatch, result.data._id)
      // 分发授权成功的同步action
      dispatch(authSuccess(result.data))
    } else {
      //分发错误提示信息的同步action
      dispatch(errorMsg(result.msg))
    }
  }
}

export const login = (user) => {
  const { username, password } = user
  return async (dispatch) => {
    // 发送登录的异步ajax请求
    const response = await reqLogin({ username, password })

    const result = response.data
    if (result.code === 0) {
      getMsgList(dispatch, result.data._id)
      // 分发授权成功的同步action
      dispatch(authSuccess(result.data))
    } else {
      //分发错误提示信息的同步action
      dispatch(errorMsg(result.msg))
    }
  }
}

export const update = (user) => {
  return async (dispatch) => {
    // 发送登录的异步ajax请求
    const response = await reqUpdateUser(user)
    const result = response.data
    if (result.code === 0) {
      // 分发授权成功的同步action
      dispatch(receiveUser(result.data))
    } else {
      //分发错误提示信息的同步action
      dispatch(resetUser(result.msg))
    }
  }
}

export const getUser = () => {
  return async (dispatch) => {
    const response = await reqUser()
    const result = response.data
    if (result.code === 0) {
      getMsgList(dispatch, result.data._id)
      // 分发授权成功的同步action
      dispatch(receiveUser(result.data))
    } else {
      //分发错误提示信息的同步action
      dispatch(resetUser(result.msg))
    }
  }
}

export const getUserList = (type) => {
  return async (dispatch) => {
    const response = await reqUserList(type)
    const result = response.data
    if (result.code === 0) {
      // 分发授权成功的同步action
      dispatch(receiveUserList(result.data))
    } else {
      //分发错误提示信息的同步action
      dispatch(resetUser('获取信息失败'))
    }
  }
}

// 读取消息的异步action
export const readMsg = (from, to) => {
  return async (dispatch) => {
    const response = await reqReadMsg({ from })
    const result = response.data
    if (result.code === 0) {
      // 分发授权成功的同步action
      const count = result.data
      dispatch(msgRead({ count, from, to }))
    } else {
      //分发错误提示信息的同步action
      dispatch(resetUser('获取信息失败'))
    }
  }
}

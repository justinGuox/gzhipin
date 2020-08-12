// 消息主界面路由容器
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'

const Item = List.Item
const Brief = Item.Brief

class Message extends Component {
  /* 对chatMsgs进行分组 并保存得到每个组的lastMsgs
    1、找出每个聊天的lasgMsg并用一个对象容器保存{chat_id,lastMsg}
    2、得到所有lasgMsg的数组
    3、对数组进行排序（按什么来排序 create_time 降序）
  */
  getLastMsgs(chatMsgs, userid) {
    // 1、找出每个聊天的lasgMsg并用一个对象容器保存{chat_id:lastMsg}
    const lastMsgObjs = {}
    chatMsgs.forEach((msg) => {
      // 对msg进行统计，消息发给我的并且read是未读状态
      if (msg.to === userid && !msg.read) {
        msg.unReadCount = 1
      } else {
        msg.unReadCount = 0
      }

      const chatId = msg.chat_id
      // 获取已保存当前组的lastMsg
      const lastMsg = lastMsgObjs[chatId]
      if (!lastMsg) {
        lastMsgObjs[chatId] = msg
      } else {
        const unReadCount = lastMsg.unReadCount + msg.unReadCount
        // 如果msg比lastMsg晚则保存
        if (msg.create_time > lastMsg.create_time) {
          lastMsgObjs[chatId] = msg
        }
        lastMsgObjs[chatId].unReadCount = unReadCount
      }
    })
    // 2、得到所有lasgMsg的数组
    const lastMsgs = Object.values(lastMsgObjs)
    // 3、对数组进行排序（按什么来排序 create_time 降序）
    return lastMsgs.sort((m1, m2) => m2.create_time - m1.create_time)
  }

  render() {
    const { user } = this.props
    const { users, chatMsgs } = this.props.chat
    //对chatMsgs进行分组 按chat_id
    const lastMsgs = this.getLastMsgs(chatMsgs, user._id)

    return (
      <List style={{ marginTop: 50, marginBottom: 50 }}>
        <QueueAnim type="left">
          {lastMsgs.map((msg) => {
            // 得到目标用户的ID
            const targetUserId = msg.to === user._id ? msg.from : msg.to
            // 得到目标用户的信息
            const targetUser = users[targetUserId]
            return (
              <Item
                onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
                key={msg._id}
                extra={<Badge text={msg.unReadCount} />}
                thumb={
                  targetUser.header
                    ? require(`../../assets/images/${targetUser.header}.png`)
                    : null
                }
                arrow="horizontal"
              >
                {targetUser.username}
                <Brief>{msg.content}</Brief>
              </Item>
            )
          })}
        </QueueAnim>
      </List>
    )
  }
}
export default connect(
  (state) => ({
    user: state.user,
    chat: state.chat,
  }),
  {}
)(Message)

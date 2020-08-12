import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavBar, List, InputItem, Grid, Icon } from 'antd-mobile'
import { sendMsg, readMsg } from '../../redux/actions'
import QueueAnim from 'rc-queue-anim'

import '../../assets/css/index.less'

const Item = List.Item

class Chat extends Component {
  state = {
    content: '',
    isShow: false, // 是否显示表情列表
  }
  componentDidMount() {
    // 初始显示列表
    window.scrollTo(0, document.body.scrollHeight)
  }

  componentDidUpdate() {
    // 更新显示列表
    window.scrollTo(0, document.body.scrollHeight)
  }

  keyUp = (e) => {
    if (e.keyCode === 13) {
      this.handleSend()
    }
  }
  // 在退出的时候
  componentWillUnmount() {
    // 初始化时更新未读数量状态
    const from = this.props.match.params.userid
    const to = this.props.user._id
    this.props.readMsg(from, to)
  }

  // 在第一次render()之前回调（回调函数）
  componentWillMount() {
    // 初始化表情列表数据
    const emojis = [
      '😀',
      '😃',
      '😄',
      '😁',
      '😆',
      '😅',
      '🤣',
      '😂',
      '🤣',
      '😀',
      '😁',
      '🤣',
      '😀',
      '😁',
      '🤣',
      '😀',
      '😁',
      '🤣',
      '😀',
      '😁',
      '🤣',
      '😀',
      '😁',
      '🤣',
      '😁',
      '🤣',
      '😀',
      '😁',
      '🤣',
      '😀',
      '😁',
      '🤣',
      '😀',
      '😁',
      '🤣',
      '😁',
      '🤣',
      '😀',
      '😁',
      '🤣',
      '😀',
      '😁',
      '🤣',
      '😀',
      '😁',
      '🤣',
    ]
    this.emojis = emojis.map((emoji) => ({ text: emoji }))
  }

  handleSend = () => {
    // 收集数据
    const from = this.props.user._id
    const to = this.props.match.params.userid
    const content = this.state.content.trim()
    // 发送请求(发消息)
    if (content) {
      this.props.sendMsg({ from, to, content })
    }
    // 清除输入数据
    this.setState({
      content: '',
      isShow: false,
    })
  }

  // 是否显示表情
  toggleShow = () => {
    const isShow = !this.state.isShow
    this.setState({ isShow })
    if (isShow) {
      // 异步手动派发resize事件,解决表情列表显示的bug
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }

  render() {
    const { user } = this.props
    const { users, chatMsgs } = this.props.chat

    // 计算当前聊天的chat_id
    const meId = user._id
    if (!users[meId]) {
      //如果还没有获取到数据，直接不做任何显示
      return null
    }
    const targetId = this.props.match.params.userid //要发送对象的ID
    const chat_id = [targetId, meId].sort().join('_')
    // 需要对chatMsgs进行过滤
    const msgs = chatMsgs.filter((msg) => msg.chat_id === chat_id)

    // 得到目标用户的头像
    const targetHeader = users[targetId].header
    const targetIcon = targetHeader
      ? require(`../../assets/images/${targetHeader}.png`)
      : null
    return (
      <div id="chat-page">
        <NavBar
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack()
          }}
          className="sticky-header"
        >
          {users[targetId].username}
        </NavBar>
        <List style={{ marginTop: 50, marginBottom: 50 }}>
          <QueueAnim type="left" delay={100}>
            {msgs.map((msg) => {
              if (msg.to === meId) {
                //对方发给我的
                return (
                  <Item key={msg._id} thumb={targetIcon}>
                    {msg.content}
                  </Item>
                )
              } else {
                //我发给对方的
                return (
                  <Item key={msg._id} className="chat-me" extra="我">
                    {msg.content}
                  </Item>
                )
              }
            })}
          </QueueAnim>
        </List>

        <div className="am-tab-bar">
          <InputItem
            placeholder="请输入"
            value={this.state.content}
            onChange={(val) => {
              this.setState({ content: val })
            }}
            onFocus={() => this.setState({ isShow: false })}
            onKeyUp={this.keyUp}
            extra={
              <span>
                <span
                  role="img"
                  aria-label="Description of the overall image"
                  onClick={this.toggleShow}
                  style={{ marginRight: 5 }}
                >
                  😀
                </span>
                <span>
                  <span onClick={this.handleSend}>发送</span>
                </span>
              </span>
            }
          />
          {this.state.isShow ? (
            <Grid
              data={this.emojis}
              columnNum={8}
              isCarousel={true}
              carouselMaxRow={4}
              onClick={(item) => {
                this.setState({ content: this.state.content + item.text })
              }}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

export default connect((state) => ({ user: state.user, chat: state.chat }), {
  sendMsg,
  readMsg,
})(Chat)

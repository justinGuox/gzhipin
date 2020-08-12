// 注册路由组件

import React, { Component } from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Button,
  Radio,
  Toast,
} from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { register } from '../../redux/actions'
import Logo from '../../components/logo/logo'
const ListItem = List.Item

class Register extends Component {
  state = {
    username: '', //用户名
    password: '', //密码
    password2: '', //确认密码
    type: 'user', //用户注册的类型 user,boss
  }
  register = () => {
    const { username, password, password2 } = this.state

    if (username === '' || password === '') {
      Toast.fail('用户名或密码为空，请重新输入', 1)
    } else if (password !== password2) {
      Toast.fail('两次密码不一致，请重新输入', 1)
    } else {
      // 注册成功
      this.props.register(this.state)
      // 延迟500毫秒判断msg是否有值，不延迟则登陆成功还会获取到最后一次的msg导致错误信息弹出
      setTimeout(() => {
        const { msg } = this.props.user
        if (msg) {
          Toast.fail(msg, 1)
        }
      }, 500)
    }
  }

  // 处理输入数据的改变：更新对应的状态
  handleChange = (name, val) => {
    // 根据传过来的name 更新指定的state状态
    this.setState({
      // [name] 这样相当于一个变量而不是字符串
      [name]: val,
    })
  }

  toLogin = () => {
    this.props.history.replace('/login')
  }
  render() {
    const { type } = this.state
    const { redirectTo } = this.props.user
    if (redirectTo) {
      // 如果redirectTo有值，则说明需要重定向到指定的地方去
      return <Redirect to={redirectTo} />
    }
    return (
      <div>
        <NavBar>仿&nbsp;硅&nbsp;谷&nbsp;直&nbsp;聘&nbsp;APP</NavBar>
        <Logo />
        <WingBlank>
          <List>
            <InputItem
              placeholder="请输入用户名"
              onChange={(val) => {
                this.handleChange('username', val)
              }}
              clear
            >
              用户名：
            </InputItem>
            <WhiteSpace size="sm" />
            <InputItem
              placeholder="请输入用户密码"
              onChange={(val) => {
                this.handleChange('password', val)
              }}
              type="password"
              clear
            >
              密&nbsp;&nbsp;&nbsp;码：
            </InputItem>
            <WhiteSpace size="sm" />
            <InputItem
              placeholder="确认用户密码"
              onChange={(val) => {
                this.handleChange('password2', val)
              }}
              type="password"
              clear
            >
              确认密码：
            </InputItem>
            <WhiteSpace size="sm" />
            <ListItem>
              <span>用户类型：</span>
              <Radio
                checked={type === 'user'}
                onChange={() => this.handleChange('type', 'user')}
              >
                求职者
              </Radio>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio
                checked={type === 'boss'}
                onChange={() => this.handleChange('type', 'boss')}
              >
                老板
              </Radio>
            </ListItem>
            <WhiteSpace size="sm" />
            <Button type={'primary'} onClick={this.register}>
              注&nbsp;&nbsp;&nbsp;册
            </Button>
            <WhiteSpace size="sm" />
            <Button onClick={this.toLogin}>已有帐户，直接登录</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect((state) => ({ user: state.user }), { register })(
  Register
)

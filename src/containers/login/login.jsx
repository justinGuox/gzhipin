import React, { Component } from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Button,
  Toast,
} from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { login } from '../../redux/actions'
import Logo from '../../components/logo/logo'

class Login extends Component {
  state = {
    username: '', //用户名
    password: '', //密码
  }
  login = () => {
    const { username, password } = this.state
    if (username === '' || password === '') {
      Toast.fail('用户名或密码为空，请重新输入', 1)
      return
    }
    // 登陆
    this.props.login(this.state)
    // 延迟500毫秒判断msg是否有值，不延迟则登陆成功还会获取到最后一次的msg导致错误信息弹出
    setTimeout(() => {
      const { msg } = this.props.user
      if (msg) {
        Toast.fail(msg, 1)
      }
    }, 500)
  }
  // 处理输入数据的改变：更新对应的状态
  handleChange = (name, val) => {
    // 根据传过来的name 更新指定的state状态
    this.setState({
      // [name] 这样相当于一个变量而不是字符串
      [name]: val,
    })
  }
  toRegister = () => {
    this.props.history.replace('/register')
  }

  render() {
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
            <Button type={'primary'} onClick={this.login}>
              登&nbsp;&nbsp;&nbsp;录
            </Button>
            <WhiteSpace size="sm" />
            <Button onClick={this.toRegister}>没有账户？去注册</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}
export default connect((state) => ({ user: state.user }), { login })(Login)

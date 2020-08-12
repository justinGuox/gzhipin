// 求职者信息完善路由组件
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import HeaderSelector from '../../components/header-selector/header-selector'
import { update } from '../../redux/actions'
import { Redirect } from 'react-router-dom'

class UserInfo extends Component {
  state = {
    header: '', // 头像名称
    post: '', // 职位
    info: '', // 个人或职位简介
  }
  handleChange = (name, val) => {
    this.setState({
      [name]: val,
    })
  }

  setHeader = (header) => {
    this.setState({
      header,
    })
  }

  save = () => {
    this.props.update(this.state)
  }

  render() {
    const { header, type } = this.props.user
    if (header) {
      //说明信息已经完善
      const path = type === 'user' ? '/user' : '/boss'
      return <Redirect to={path} />
    }
    return (
      <div>
        <NavBar>求职者信息完善界面</NavBar>
        <HeaderSelector setHeader={this.setHeader} />
        <InputItem
          placeholder="请输入求职信息"
          onChange={(val) => {
            this.handleChange('post', val)
          }}
        >
          求职岗位：
        </InputItem>
        <TextareaItem
          placeholder="请输入个人介绍"
          rows="3"
          count="300"
          autoHeight="true"
          title="个人介绍："
          onChange={(val) => {
            this.handleChange('info', val)
          }}
        ></TextareaItem>
        <Button type={'primary'} onClick={this.save}>
          保&nbsp;&nbsp;&nbsp;存
        </Button>
      </div>
    )
  }
}
export default connect((state) => ({ user: state.user }), { update })(UserInfo)

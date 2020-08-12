// 公司HR信息完善路由组件
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import HeaderSelector from '../../components/header-selector/header-selector'
import { update } from '../../redux/actions'
import { Redirect } from 'react-router-dom'

class BossInfo extends Component {
  state = {
    header: '', // 头像名称
    post: '', // 职位
    info: '', // 个人或职位简介
    company: '', // 公司名称
    salary: '', // 月薪
  }

  setHeader = (header) => {
    this.setState({
      header,
    })
  }

  handleChange = (name, val) => {
    this.setState({
      [name]: val,
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
        <NavBar>HR信息完善界面</NavBar>
        <HeaderSelector setHeader={this.setHeader} />
        <InputItem
          placeholder="请输入招聘职位信息"
          onChange={(val) => {
            this.handleChange('post', val)
          }}
        >
          招聘职位：
        </InputItem>
        <InputItem
          placeholder="请输入公司名称"
          onChange={(val) => {
            this.handleChange('company', val)
          }}
        >
          公司名称：
        </InputItem>
        <InputItem
          placeholder="请输入职位薪资信息"
          onChange={(val) => {
            this.handleChange('salary', val)
          }}
        >
          职位薪资:
        </InputItem>
        <TextareaItem
          placeholder="请输入对此招聘职位的具体要求"
          rows="3"
          count="300"
          autoHeight="true"
          title="职位要求："
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
export default connect((state) => ({ user: state.user }), { update })(BossInfo)

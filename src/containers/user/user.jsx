// 用户主界面路由容器
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserList } from '../../redux/actions'
import UserList from '../../components/user-list/user-list'

class User extends Component {
  componentDidMount() {
    // 获取userList
    this.props.getUserList(['user'])
  }
  render() {
    return <UserList userList={this.props.userList} />
  }
}
export default connect((state) => ({ userList: state.userList }), {
  getUserList,
})(User)

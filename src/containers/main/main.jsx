// 主界面路由组件
import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'
import { NavBar } from 'antd-mobile'

import BossInfo from '../boss-info/boss-info'
import UserInfo from '../user-info/user-info'
import Boss from '../boss/boss'
import User from '../user/user'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import { getRedirectTo } from '../../utils'
import { getUser } from '../../redux/actions'
import '../../assets/css/index.less'
import Chat from '../chat/chat'

class Main extends Component {
  // 给组件对象添加属性
  navList = [
    // 包含所有导航组件的相关信息数据
    {
      path: '/user', // 路由路径
      component: Boss,
      title: 'HR  列表',
      icon: 'dashen',
      text: 'HR',
    },
    {
      path: '/boss', // 路由路径
      component: User,
      title: '求职者列表',
      icon: 'laoban',
      text: '求职者',
    },
    {
      path: '/message', // 路由路径
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    },
    {
      path: '/personal', // 路由路径
      component: Personal,
      title: '用户中心',
      icon: 'personal',
      text: '个人',
    },
  ]

  //登陆过(cookie中有userid), 但没有有登陆(redux管理的user中没有_id) 发请求获取对应的user
  componentDidMount() {
    const userid = Cookies.get('userid')
    const { _id } = this.props.user
    if (userid && !_id) {
      // 发送异步请求, 获取user
      //console.log('发送ajax请求获取user')
      this.props.getUser()
    }
  }
  render() {
    // 检查用户是否登录，没有就重定向到登陆界面
    // const { user } = this.props
    // if (!user._id) {
    //   return <Redirect to="/login" />
    // }
    // 读取cookie中的userid，没有则重定向到登陆界面
    const userid = Cookies.get('userid')
    const { user, unReadCount } = this.props
    if (!userid) {
      return <Redirect to="/login" />
    }
    if (!user._id) {
      return null
    } else {
      // 如果有id则显示对应的界面
      let path = this.props.location.pathname
      if (path === '/') {
        path = getRedirectTo(user.type, user.header)
        return <Redirect to={path} />
      }
    }

    const { navList } = this
    // 当前的路径
    const path = this.props.location.pathname
    // 在当前的数组里面找对应的path路径，可能没有
    const currentNav = navList.find((nav) => nav.path === path)

    if (currentNav) {
      if (user.type === 'user') {
        //如果用户是user，则隐藏boss的菜单
        navList[1].hide = true
      } else {
        navList[0].hide = true
      }
    }

    return (
      <div>
        {currentNav ? (
          <NavBar className="sticky-header">{currentNav.title}</NavBar>
        ) : null}
        <Switch>
          {/* 动态加载 navList 路由*/}
          {navList.map((nav) => (
            <Route
              key={nav.path}
              path={nav.path}
              component={nav.component}
            ></Route>
          ))}
          {/* <Route path="/boos" component={Boss}></Route>
          <Route path="/user" component={User}></Route>
          <Route path="/message" component={Message}></Route>
          <Route path="/personal" component={Personal}></Route> */}
          <Route path="/bossinfo" component={BossInfo}></Route>
          <Route path="/userinfo" component={UserInfo}></Route>
          <Route path="/chat/:userid" component={Chat}></Route>

          <Route component={NotFound}></Route>
        </Switch>
        {currentNav ? (
          <NavFooter navList={navList} unReadCount={unReadCount} />
        ) : null}
      </div>
    )
  }
}
export default connect(
  (state) => ({ user: state.user, unReadCount: state.chat.unReadCount }),
  {
    getUser,
  }
)(Main)

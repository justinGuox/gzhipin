import React, { Component } from 'react'
import { TabBar } from 'antd-mobile'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import '../../assets/css/index.less'

const Item = TabBar.Item

class NavFooter extends Component {
  static propTypes = {
    navList: PropTypes.array.isRequired,
    unReadCount: PropTypes.number.isRequired,
  }

  render() {
    let { navList, unReadCount } = this.props
    // 过滤掉hide为true的nav
    navList = navList.filter((nav) => !nav.hide)
    const path = this.props.location.pathname // 请求的path
    return (
      <TabBar>
        {navList.map((nav, index) => (
          <Item
            badge={nav.path === '/message' ? unReadCount : 0}
            key={index}
            title={nav.title}
            icon={{ uri: require(`../../assets/nav/${nav.icon}.png`) }}
            selectedIcon={{
              uri: require(`../../assets/nav/${nav.icon}-selected.png`),
            }}
            selected={path === nav.path}
            onPress={() => {
              this.props.history.replace(nav.path)
            }}
          ></Item>
        ))}
      </TabBar>
    )
  }
}

// 向外暴露withRouter()包装产生的组件
// 内部会向组件中传入一些路由组件特有的属性: history/location/math
export default withRouter(NavFooter)

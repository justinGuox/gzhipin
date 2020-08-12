// 选择用户头像的UI组件
import React, { Component } from 'react'
import { List, Grid } from 'antd-mobile'
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {
  static propTypes = {
    setHeader: PropTypes.func.isRequired,
  }

  state = {
    icon: null, //图片对象
  }

  constructor(props) {
    super(props)
    // 准备需要显示的头像数据
    this.headerList = Array.from(new Array(20)).map((_val, i) => ({
      icon: require(`../../assets/images/头像${i + 1}.png`),
      text: `头像${i + 1}`,
    }))
  }

  handleClick = ({ icon, text }) => {
    this.setState({
      icon,
    })
    this.props.setHeader(text)
  }

  render() {
    const icon = this.state.icon
    const listHeader = !icon ? (
      '请选择你的头像'
    ) : (
      <div>
        已选择头像：
        <img src={icon} alt="个人头像" />
      </div>
    )
    return (
      <List renderHeader={() => listHeader}>
        <Grid
          data={this.headerList}
          columnNum={5}
          onClick={this.handleClick}
        ></Grid>
      </List>
    )
  }
}

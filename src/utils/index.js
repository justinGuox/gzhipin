// 判断登陆或注册成功后去哪个界面
export function getRedirectTo(type, header) {
  let path
  if (type === 'user') {
    path = '/user'
  } else {
    path = '/boss'
  }
  if (!header) {
    //没有头像才去信息完善界面
    path += 'info'
  }
  return path
}

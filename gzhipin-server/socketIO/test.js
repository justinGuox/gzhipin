// 1、引入
module.exports = function (server) {
  const io = require('socket.io')(server)

  //服务器监视server发送过来的链接
  io.on('connection',function (socket) {
    console.log('有一个客户端连接上了服务器')
    // 绑定监听，接收客户端发送的消息
    socket.on('senMsg',function (data) {
      console.log(data)
      data = '服务器处理后的消息：'+data
      socket.emit('serverMsg',data)
    })
  })
}

// 引入
import io from 'socket.io-client'

// 连接服务器，得到链接服务器的对象
const socket = io('ws://localhost:4000')
socket.on('serverMsg', function (data) {
  console.log(data)
})
// 发送消息给服务器
socket.emit('senMsg', '客户端的消息')



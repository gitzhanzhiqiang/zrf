 <template>
  <div class="breadcrumb">
    <!--顶部导航栏 -->
    <span href="#/">
      当前位置：
    </span>
    <span v-if="list[2].title != '欢迎进入'">
      <span :key="item.path" v-for="(item, index) in list">
        {{item.title}}
        <span v-if="index !== (list.length - 1)">></span>
      </span>
    </span>
    <span :key="item.path" v-for="(item, index) in list" v-else>
      <span v-show="item.title != '权限'">{{item.title}}</span>
      <span v-if="index !== (list.length - 1) && item.title != '权限'">></span>
    </span>
    <span class="w-btnRefresh w-btnGreen w-right">
      <i class="icon-refresh"></i>
    </span>
    <div class="message">{{message}}</div>
    <audio controls="controls" v-show="false" ref="mp3">
      <source :src="audioUrl" type="audio/mpeg" />
    </audio>
    <!--<span @click="audioPlay">播放</span>-->
    <!--<el-button type="text" @click="open('aa')">点击打开 Message Box</el-button>-->
  </div>
</template>

<script>
import baseURL from '@utils/baseURL.js';
import Cookies from 'js-cookie';
import loginout from '@src/utils/loginout';
export default {
  data() {
    return {
      websocket: '',
      message: '',
      audioUrl: require('@res/img/message.mp3'),
    }
  },
  computed: {
    list() {
      let result = [];
      for (var index = 0; index < this.$route.matched.length; index++) {//根据路由获取
        var item = this.$route.matched[index];
        result.push({
          title: item.meta.title,
          path: item.path,
        });
      }
      // window.alert(JSON.stringify(result))
      return result;
    }
  },
  created() {
    console.log(this.$route.path)
    this.initWebsocket();
  },
  methods: {
    initWebsocket() {
      // //判断当前浏览器是否支持WebSocket
      // if ('WebSocket' in window) {
      // 	websocket = new WebSocket("ws://192.168.1.82:8055/zrf_admin/websocket");
      // }
      // else {
      // 	alert('当前浏览器不支持消息协议')
      // }

      // 判断当前浏览器是否支持WebSocket
      if (!window.WebSocket) {
        this.$message.warning('当前浏览器不支持消息协议');
        return false;
      }
      let array = baseURL().split('//');
      let url = '';
      if (array[0] == 'http:') {
        url = 'ws:' + array[1] + '/websocket/' + Cookies.get('id');
      } else {
        url = 'wss:' + array[1] + '/websocket/' + Cookies.get('id');
      }
      let websocket = new WebSocket(url);
      //连接发生错误的回调方法
      websocket.onerror = () => {
        websocket.close();
      };
      //连接成功建立的回调方法
      websocket.onopen = (event) => {
        //发送的为字符串
        // this.websocket.send(message);
      };
      //接收到消息的回调方法
      websocket.onmessage = (event) => {
        //接受的为字符串
        let data = JSON.parse(event.data)
        this.setMessageInnerHTML(data);
      };
      //连接关闭的回调方法
      websocket.onclose = () => { };
      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = () => {
        websocket.close();
      }
    },
    audioPlay() {
      let audio = this.$refs.mp3
      audio.play();
    },
    //将消息显示在网页上
    setMessageInnerHTML(data) {
      // window.alert(JSON.stringify(data))
      //重新登录
      if (data.code == 10001) {
        loginout();
        return false;
      }
      if (data.code == 666) { //当待放款订单时进入
        this.open('待放款')
        if (this.$route.path == '/financialsystem/makemoneynotmoney') {
            this.audioPlay(); // 播放
        }
        return false;
      }
      if (data.code == 777) {
        this.open('驳回');
        return false;
      }
      //返回正确消息
      if (data.code == 20000) {
        this.message = data.msg
      } else {
        this.message = '';
      }
    },
    open(name) {
      this.$alert('您有[' + name + ']订单，请注意查收', '提示', {
        confirmButtonText: '确定',
        callback: action => {
        }
      });
    }
  }
}
</script>
<style rel="stylesheet/less" lang="less" scoped>
.breadcrumb {
  .message {
    position: absolute;
    top: 0;
    font-size: 20px;
    color: red;
    line-height: 38px;
    left: 80%;
    animation: myfirst 23s linear infinite;
  }
  @keyframes myfirst {
    from {
      left: 80%;
    }
    to {
      left: 0%;
    }
  }
}
</style>

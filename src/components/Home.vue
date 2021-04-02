<template>
  <!-- 每个elementui中的组件 组件名就是一个类名 -->
  <el-container class="home-container">
    <!-- 基于token的方式实现退出，只需要销毁本地的token。
        这样，后续的请求就不会携带token，必须重新登录生成一个新的token才可以 -->
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img height="55px" src="../assets/niu.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <div class="date-text">当前时间：{{ realTime.yy }}年{{ realTime.mm }}月{{ realTime.dd }}日
          {{ realTime.hour }}:{{ realTime.min }}:{{ realTime.sec }}
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="false"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 二级菜单模板区 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-star-off',
        101: 'el-icon-message-solid',
        102: 'el-icon-s-platform',
        145: 'el-icon-s-promotion'
      },
      isCollapse: false,
      activePath: '', // 被激活的链接地址
      realTime: { yy: 0, mm: 0, dd: 0, hour: '00', min: '00', sec: '00' }
    }
  },
  created () {
    // 注意created函数要写在methods方法外面
    // this.date = new Date()
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  mounted () {
    setInterval(() => {
      this.setRealTime()
    }, 1000)
  },
  // 注意在vue实例销毁前，清除我们的定时器。
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$message.success('成功退出')
      this.$router.push('/login') // 跳转到登录页
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
      console.log(res)
    },
    toggleCollapse () {
      // 点击按钮切换菜单
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      // 保存链接的激活状态
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    setRealTime () {
      const myDate = new Date()
      this.realTime.yy = myDate.getFullYear()
      this.realTime.mm = myDate.getMonth() + 1
      this.realTime.dd = myDate.getDate()
      // this.realTime.dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate())
      this.realTime.hour = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())
      this.realTime.min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())
      this.realTime.sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.date-text {
  text-align: center;
  margin-right: 50px;
}
.el-header {
  background-color: #373d41;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center; // 使按钮上下居中 不贴边
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none; // 没有边框线
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-left: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #eee;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

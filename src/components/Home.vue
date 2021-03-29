<template>
    <div>
        Home组件
        <!-- 基于token的方式实现退出，只需要销毁本地的token。
        这样，后续的请求就不会携带token，必须重新登录生成一个新的token才可以 -->
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login') // 跳转到登录页
    }
  }
}
</script>

<style lang="less" scoped>
</style>

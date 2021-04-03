<template> <!--模板区-->
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录表单的验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid)
        if (valid) {
          const { data: res } = await this.$http.post('login', this.loginForm)
          console.log(res) // 输出对象是promise时 加上await和async可以简化数据
          if (res.meta.status !== 200) {
            console.log('登录失败')
            return this.$message.error('登录失败')
          } else {
            console.log('登录成功')
            this.$message.success('登录成功')
            // 1.将登录成功之后的token保存到客户端的sessionStorage中
            //    1.1项目中除了登录之外的API接口，必须在登录之后才能访问
            //    1.2token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
            console.log(res)
            window.sessionStorage.setItem('token', res.data.token)
            // 2.通过编程式导航跳转到后台主页，路由地址是/home
            this.$router.push('/home') // 跳转
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped> //支持less语法 scoped用于控制样式生效的区间  加上scoped表示此样式只对本组件生效
.login_container{
    background-image: url('../assets/bgimg.jpg');
    // background-color: #1e3d5c;
    height: 100%;
    width: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;//圆角边框
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);//横轴 纵轴移动-50%

    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #eee;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

</style>

<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <!--列与列之间的间隙 :gutter-->
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button><!--搜索按钮-->
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state"> <!--下面的作用域插槽会覆盖这个prop-->
          <template v-slot="scope">
            <!-- {{scope.row.mg_state}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
       :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="45%" @close="clearAddForm">
        <!-- 内容主体区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addUser">确 定</el-button>
            <el-button @click="addDialogVisible=false">取 消</el-button>
            <el-button type="warning" @click="clearAddForm">重 置</el-button>
        </span>
    </el-dialog>
    <!-- 编辑用户信息对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="45%" @close="clearEditForm">
        <!-- 内容主体区 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editUser">确认修改</el-button>
            <el-button @click="editDialogVisible=false">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前的页数
        pagesize: 2 // 当前每页显示多少条数据
      },
      userList: [],
      total: 0,
      addDialogVisible: false, // 控制添加用户对话框的显示与隐藏
      editDialogVisible: false, // 控制编辑用户信息对话框的显示与隐藏
      addForm: { // 添加用户的表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: { // 查询到的用户信息对象
      },
      addFormRules: { // 添加用户表单的验证规则对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码的长度在6~15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          { validator: checkMobile, trigger: 'blur' }
          // { min: 11, max: 11, message: '手机号格式错误', trigger: 'blur' }
        ]
      },
      editFormRules: { // 修改用户信息的验证规则对象
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.console.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pageSize改变的事件
    handleSizeChange (newPageSize) {
      console.log(newPageSize)
      this.queryInfo.pagesize = newPageSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch
    async userStateChange (userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户对话框的关闭事件
    clearAddForm () { // 找到ref引用 调用resetFields方法
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定 添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid) // valid=true or false
        if (valid) { // valid==true 预校验通过
          // 可以发起添加用户的网络请求
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败！')
            return
          }
          this.$message.success('添加用户成功！')
          this.addDialogVisible = false
          this.getUserList() // 重新用户列表数据
        }
      })
    },
    // 展示编辑用户信息对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    clearEditForm () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息提交并验证
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          // 发起修改用户信息的请求
          const { data: res } = await this.$http.put('users/' + this.editForm.id,
            { email: this.editForm.email, mobile: this.editForm.mobile })
          if (res.meta.status !== 200) {
            return this.$message.error('修改失败')
          }
          // 修改成功
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新数据列表
          this.getUserList()
          // 提示修改成功
          this.$message.success('修改用户信息成功')
        }
      })
    },
    // 根据id删除用户信息
    async delUserById (id) {
      // 弹框确认
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      // 如果点击确认 返回confirm字符串; 如果点击取消 则报错 需要catch  catch后返回cancel
      if (confirmResult === 'cancel') { // 取消删除
        return this.$message.info('已取消删除')
      } else { // 确认删除
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        } else {
          this.getUserList()
          return this.$message.success('删除成功')
        }
      }
    }
  }
}
</script>

<style lang="less">
.el-table {
    margin-top: 15px;
}
</style>

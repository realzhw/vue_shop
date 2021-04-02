<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column label="#" type="index" align="center"></el-table-column>
                <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
                <el-table-column label="路径" prop="path" align="center"></el-table-column>
                <el-table-column label="权限等级" prop="level" align="center">
                    <template v-slot="scope"><!--作用域插槽-->
                        <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                        <el-tag v-else-if="scope.row.level === '1'" type="success">二级权限</el-tag>
                        <el-tag v-else type="warning">三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created () {
    // 获取所有的权限
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list') // get方法会返回promise
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  }
}
</script>

<style lang="less" scoped>

</style>

<template>
   <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 按钮区 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showCateDialogVisible">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区 -->
            <tree-table class="treeTable" :data="categoriesList" :columns="columns" show-index
             index-text="#" border :selection-type="false" :expand-type="false" :show-row-hover="false">
                <!-- 是否有效模板列 -->
                <template v-slot:isDel="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: lightgreen;"></i>
                </template>
                <!-- 分类等级模板列 -->
                <template v-slot:order="scope">
                    <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作模板列 -->
                <template v-slot:opt="scope">
                    {{scope.row.cat_level}}
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="45%" @close="clearAddCateDialog">
            <!-- 添加分类的表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name" >
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：" prop="cat_level">
                    <!-- options用于指定数据源 -->
                    <!-- props用于指定配置对象 -->
                    <!-- v-model双向绑定 选择好的xx/xx显示在文本框 使用v-model将其保存在selectedKeys[]中 -->
                    <el-cascader v-model="selectedKeys" :options="parentCateList" expand-trigger="hover"
                    :props="cascaderProps" @change="parentCateChanged" clearable change-on-select>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addCate">确 定</el-button>
                <el-button @click="addCateDialogVisible=false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: { // 查询条件
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      categoriesList: [], // 商品分类的数据列表 默认为空
      total: 0, // 总数据条数
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name' // 分类名称
        },
        {
          label: '是否有效',
          type: 'template', // 表示将当前列定义为模板列      ==>  要使用作用域插槽的话 需要使用模板列
          template: 'isDel' // 使用的模板名称
        },
        {
          label: '分类等级',
          type: 'template',
          template: 'order' // 分类名称
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt' // 分类名称
        }
      ],
      addCateDialogVisible: false, // 控制添加分类对话框的显示与隐藏
      addCateForm: { // 添加分类的表单数据对象
        cat_pid: 0, // 父级分类的id
        cat_name: '',
        cat_level: 0 // 默认添加一级分类
      },
      addCateFormRules: { // 添加分类的表单验证规则对象
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 10, message: '分类名称的长度在2~8个字符之间', trigger: 'blur' }
        ]
      },
      parentCateList: [], // 父级父类的列表
      cascaderProps: { // 指定级联选择器的配置对象
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [] // 选中的父级分类的名称数组
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      console.log(res.data)
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    // 监听pageSize改变的事件
    handleSizeChange (newPageSize) {
      console.log(newPageSize)
      this.queryInfo.pagesize = newPageSize
      this.getCategoriesList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getCategoriesList()
    },
    // 点击按钮 展示添加分类的对话框
    showCateDialogVisible () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败！')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化 触发这个函数
    parentCateChanged () {
      console.log(this.selectedKeys)
      // 如果selectedKeys数组中的length大于0 证明选中了父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮 添加新的分类
    addCate () {
      console.log(this.addCateForm)
      // 验证表单
      this.$refs.addCateFormRef.validate(async valid => {
        console.log(valid) // valid==true or false
        if (valid) { // valid==true 预校验通过
          // 可以发起添加分类的网络请求
          const { data: res } = await this.$http.post('categories', this.addCateForm)
          // 200:ok  201:created
          // bug:添加重复数据也会成功
          if (res.meta.status !== 201) {
            this.$message.error('添加分类失败！')
            return
          }
          this.$message.success('添加分类成功！')
          this.getCategoriesList() // 重新分类列表数据
          this.addCateDialogVisible = false
        }
      })
    },
    clearAddCateDialog () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less">
.treeTable {
  margin-top: 15px;
}
</style>

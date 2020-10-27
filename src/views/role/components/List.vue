<template>
  <div class="role">
    <el-card class="clearfix">
      <div slot="header">
        <el-form ref="form" :model="filterParams" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="filterParams.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit" :disabled="isLoading">查询搜索</el-button>
            <el-button @click="handleReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="handleAddRole">添加角色</el-button>
      <el-table
        :data="roles"
        style="width:100%;"
        v-loading="isLoading"
      >
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column label="添加时间" prop="createdTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button>分配菜单</el-button>
            <el-button>分配资源</el-button>
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :disabled="isLoading"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="filterParams.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="filterParams.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </el-card>
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <create-or-edit
        v-if="dialogVisible"
        @success="handleSuccess"
        @fail="handleFail"
        @cancel="handleCancel"
        :roleId="roleId"
        :isEdit="isEdit"
      ></create-or-edit>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { deleteRole, getRolePages } from '@/services/role'
import CreateOrEdit from './CreateOrEdit.vue'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      roles: [],
      isLoading: false,
      filterParams: {
        name: '',
        startCreateTime: '',
        endCreateTime: '',
        current: 1,
        size: 10
      },
      totalCount: 0,
      dialogVisible: false,
      roleId: null,
      isEdit: false
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRolePages(this.filterParams)
      this.roles = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
      // console.log(data)
    },
    handleSubmit () {
      this.filterParams.current = 1
      this.loadRoles()
    },
    handleReset () {
      // this.filterParams.name = ''
      (this.$refs.form as Form).resetFields()
      this.filterParams.current = 1
      // this.filterParams.size = 10
      this.loadRoles()
    },
    handleSizeChange (size: number) {
      this.filterParams.size = size
      this.filterParams.current = 1
      this.loadRoles()
    },
    handleCurrentChange (current: number) {
      this.filterParams.current = current
      this.loadRoles()
    },
    handleAddRole () {
      this.isEdit = false
      this.dialogVisible = true
    },
    handleSuccess () {
      this.dialogVisible = false
      this.$message.success('添加成功')
      this.loadRoles()
    },
    handleFail () {
      this.dialogVisible = false
      this.$message.error('添加失败')
    },
    handleCancel () {
      this.dialogVisible = false
    },
    handleEdit (role: any) {
      // console.log(role)
      this.isEdit = true
      this.roleId = role.id
      this.dialogVisible = true
    },
    async handleDelete (role: any) {
      // console.log(role)
      try {
        await this.$confirm(`确认删除角色：${role.name}？`, '删除提示')
        await deleteRole(role.id)
        this.$message.success('删除成功')
        this.loadRoles()
      } catch (err) {
        if (err && err.response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消删除')
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

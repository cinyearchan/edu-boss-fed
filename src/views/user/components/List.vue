<template>
  <div class="user">
    <el-card class="clearfix">
      <div slot="header">
        <el-form ref="form" :inline="true" :model="filterParams" label-width="80px">
          <el-form-item label="手机号">
            <el-input v-model="filterParams.phone"></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="registerTime"
              type="daterange"
              start-placeholde="开始日期"
              end-placeholde="结束日期"
              :picker-options="pickerOptions"
              range-separator="至"
              @change="handleDateChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit" :disabled="isLoading">查询</el-button>
            <el-button @click="handleReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="users"
        style="width:100%;"
        v-loading="isLoading"
      >
        <el-table-column label="角色ID" prop="id"></el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope" align="center">
            <el-avatar :src="scope.row.portrait" v-if="scope.row.portrait" size="small"></el-avatar>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="注册时间" prop="createTime"></el-table-column>
        <el-table-column label="状态" prop="status" min-widht="80px" align="center">
          <template slot-scope="scope">
            <i class="status status-danger" title="禁用" v-if="scope.row.status === 'DISABLE'"></i>
            <i class="status status-success" title="启用" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.row)" v-show="scope.row.status != 'DISABLE'">禁用</el-button>
            <el-button size="mini" @click="handleSelectRole(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :disabled="isLoading"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="filterParams.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="filterParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </el-card>
    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-select
        multiple
        placeholder="请选择角色"
        v-model="roleIdList"
      >
        <el-option
          v-for="role in roles"
          :key="role.id"
          :label="role.name"
          :value="role.id"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="handleAllocRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      filterParams: {
        startCreateTime: '',
        endCreateTime: '',
        currentPage: 1,
        pageSize: 10,
        phone: '',
        userId: ''
      },
      registerTime: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker: any) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker: any) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker: any) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      users: [],
      isLoading: false,
      totalCount: 0,
      dialogVisible: false,
      currentUser: null, // 分配角色的当前用户
      roleIdList: [],
      roles: []
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    handleDateChange (date: any) {
      if (date) {
        this.filterParams.startCreateTime = date[0]
        this.filterParams.endCreateTime = date[1]
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
    },
    async loadUsers () {
      this.isLoading = true
      const { data } = await getUserPages(this.filterParams)
      console.log(data)
      this.users = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    handleSubmit () {
      this.filterParams.currentPage = 1
      this.loadUsers()
    },
    handleReset () {
      (this.$refs.form as Form).resetFields()
      this.filterParams.currentPage = 1
      this.loadUsers()
    },
    handleSizeChange (size: number) {
      this.filterParams.pageSize = size
      this.filterParams.currentPage = 1
      this.loadUsers()
    },
    handleCurrentChange (current: number) {
      this.filterParams.currentPage = current
      this.loadUsers()
    },
    handleUpdate (row: any) {
      console.log(row)
    },
    async handleSelectRole (row: any) {
      this.currentUser = row
      const { data } = await getAllRoles()
      // console.log(data)
      this.roles = data.data
      // console.log(row)
      const { data: { data: userRoles } } = await getUserRoles((this.currentUser as any).id)
      // console.log(userRoles)
      this.roleIdList = userRoles.map((role: any) => role.id)
      this.dialogVisible = true
    },
    async handleAllocRole () {
      // console.log(1)
      const { data } = await allocateUserRoles({
        userId: (this.currentUser as any).id,
        roleIdList: this.roleIdList
      })
      // console.log(data)
      this.$message.success('操作成功')
      this.dialogVisible = false
    }
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        this.currentUser = null
        this.roleIdList = []
      }
    }
  }
})
</script>

<style lang="scss" scoped>
</style>

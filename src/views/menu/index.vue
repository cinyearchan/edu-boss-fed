<template>
  <div class="menu">
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <el-button @click="$router.push({ name: 'menu-create' })">添加菜单</el-button>
      </div>
      <el-table
        :data="menus"
        style="width:100%;"
      >
        <el-table-column label="编号" type="index" min-width="150"></el-table-column>
        <el-table-column label="菜单名称" prop="name" min-width="150"></el-table-column>
        <el-table-column label="菜单级数" prop="level" min-width="150"></el-table-column>
        <el-table-column label="前端图标" prop="icon" min-width="150"></el-table-column>
        <el-table-column label="排序" prop="orderNum" min-width="150"></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenus, deleteMenu } from '@/services/menu'

export default Vue.extend({
  name: 'MenuIndex',
  data () {
    return {
      menus: []
    }
  },
  methods: {
    async loadAllMenus () {
      const { data } = await getAllMenus()
      // console.log(data)
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    handleEdit (index: number, row: any) {
      // console.log(index, row)
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: row.id
        }
      })
    },
    handleDelete (index: number, row: any) {
      this.$confirm('确认删除吗？', '删除提示', {}).then(async () => {
        const { data } = await deleteMenu(row.id)
        // console.log(data)
        if (data.code === '000000') {
          this.$message.success('删除成功')
          this.loadAllMenus()
        }
      }).catch(err => {
        console.log(err)
        this.$message.info('已取消删除')
      })
    }
  },
  created () {
    this.loadAllMenus()
  }
})
</script>

<style lang="scss" scoped>

</style>

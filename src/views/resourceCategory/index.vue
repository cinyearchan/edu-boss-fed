<template>
  <div class="resource-category">
    <el-card class="clearfix">
      <div slot="header">
        <el-button @click="dialogVisible = true">添加</el-button>
      </div>
      <el-table
        :data="resourceCategories"
        style="width:100%;"
        v-loading="isLoading"
      >
        <el-table-column label="编号" type="index"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="创建时间" prop="createdTime"></el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="category.id ? '编辑分类' : '添加分类'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form :model="category" label-width="80px">
        <el-form-item prop="name" label="名称">
          <el-input v-model="category.name"></el-input>
        </el-form-item>
        <el-form-item prop="sort" label="排序">
          <el-input v-model="category.sort" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button @click="saveOrUpdate" type="primary">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourceCategories, saveOrUpdateResourceCategory, deleteResourceCategory } from '@/services/resource-category'

export default Vue.extend({
  name: 'resourceCategory',
  data () {
    return {
      resourceCategories: [],
      isLoading: false,
      category: {
        id: null,
        name: '',
        sort: null
      },
      dialogVisible: false
    }
  },
  methods: {
    async loadCategories () {
      this.isLoading = true
      const { data } = await getResourceCategories()
      // console.log(data)
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
      this.isLoading = false
    },
    handleUpdate (row: any) {
      // console.log(row)
      this.category = row
      this.dialogVisible = true
    },
    async handleDelete (row: any) {
      // console.log(row)
      this.$confirm('确定删除该资源目录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const { data } = await deleteResourceCategory(row.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败')
          }
          this.loadCategories()
        } catch (e) {
          console.log(e)
        }
      }).catch(() => {
        console.log('取消删除')
      })
    },
    async saveOrUpdate () {
      try {
        const { data } = await saveOrUpdateResourceCategory(this.category)
        if (data.code === '000000') {
          this.$message.success('操作成功')
        } else {
          this.$message.error('操作失败')
        }
        this.dialogVisible = false
        this.loadCategories()
      } catch (e) {
        console.log(e)
      }
    }
  },
  created () {
    this.loadCategories()
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        this.category = {
          id: null,
          name: '',
          sort: null
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

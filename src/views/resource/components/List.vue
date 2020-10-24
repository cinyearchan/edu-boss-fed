<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="url" label="资源路径">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId" label="资源分类">
            <el-select v-model="form.categoryId" clearable>
              <el-option v-for="category in resouceCategories" :label="category.name" :value="category.id" :key="category.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询搜索</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="resources"
        style="width:100%;"
        v-loading="isLoading"
      >
        <el-table-column type="index" label="编号" width="100"></el-table-column>
        <el-table-column prop="name" label="资源名称" width="180"></el-table-column>
        <el-table-column prop="url" label="资源路径" width="180"></el-table-column>
        <el-table-column prop="description" label="描述" width="180"></el-table-column>
        <el-table-column prop="createdTime" label="添加时间" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :disabled="isLoading"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [],
      form: {
        name: '',
        url: '',
        categoryId: null,
        current: 1,
        size: 10
      },
      total: 0,
      resouceCategories: [],
      isLoading: true
    }
  },

  created () {
    this.loadResources()
    this.loadResourceCategories()
  },

  methods: {
    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      // console.log(data)
      this.resources = data.data.records
      this.total = data.data.total
      this.isLoading = false
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      // console.log(data)
      this.resouceCategories = data.data
    },
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    onReset () {
      // console.log(this.$refs.form);
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResources()
    },
    handleEdit (index: number, row: any) {
      console.log(index, row)
    },
    handleDelete (index: number, row: any) {
      console.log(index, row)
    },
    handleSizeChange (size: number) {
      // console.log(size)
      this.form.size = size
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange (current: number) {
      // console.log(current)
      this.form.current = current
      this.loadResources()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

<template>
  <div class="alloc-resource">
    <el-card class="clearfix">
      <div slot="header">
        <span>分配资源</span>
        <el-button @click="$router.push({ name: 'role' })" type="primary">返回</el-button>
      </div>
      <el-tree
        v-loading="isLoading"
        ref="resource-tree"
        node-key="id"
        :data="resources"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        show-checkbox
        default-expand-all
      ></el-tree>
      <div style="text-align:center;">
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button @click="resetChecked">清空</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import { getMenuNodeList, allocRoleMenus, getRoleMenus } from '@/services/menu'
import { getAllResource, allocRoleResources, getRoleResources } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocResource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      resources: [],
      defaultProps: {
        children: 'subResourceList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadResources()
    this.laodRoleResources()
  },
  methods: {
    async laodRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      this.getCheckedKeys(data.data)
    },
    getCheckedKeys (resources: any) {
      resources.forEach((resource: any) => {
        if (resource.selected) {
          this.checkedKeys = [...this.checkedKeys, resource.id] as any
        }
        if (resource.subResourceList) {
          this.getCheckedKeys(resource.subResourceList)
        }
      })
    },
    async loadResources () {
      this.isLoading = true
      // 获取根目录
      const { data: { data: Categories } } = await getResourceCategories()
      // console.log('data', Categories)
      // 获取子目录
      const { data: { data: resources } } = await getAllResource()
      // console.log('resources', resources)
      Categories.forEach((category: any) => {
        category.subResourceList = resources.filter((resource: any) => resource.categoryId === category.id)
      })
      this.resources = Categories
      this.isLoading = false
    },
    async onSave () {
      // console.log('save')
      // const resourceIdList = (this.$refs['resource-tree'] as Tree).getCheckedKeys()
      const resourceIdList = (this.$refs['resource-tree'] as Tree).getCheckedNodes().filter((item: any) => item.categoryId).map((item: any) => item.id)
      // console.log('resourceIdNodes', resourceIdList)
      this.$confirm('是否分配资源', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const { data } = await allocRoleResources({
            roleId: this.roleId,
            resourceIdList
          })
          // console.log(data)
          if (data.code === '000000') {
            this.$message.success('操作成功')
            this.$router.push({ name: 'role' })
          } else {
            this.$message.error('操作失败')
          }
        } catch (err) {
          console.log(err)
          this.$message.error('操作失败')
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    resetChecked () {
      (this.$refs['resource-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

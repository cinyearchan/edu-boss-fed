<template>
  <div>
    <el-form ref="roleForm" label-width="80px" :model="role">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input type="textarea" v-model="role.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="handleSave">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateRole, getEditRoleInfo } from '@/services/role'

export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    roleId: {
      type: [Number, String]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      role: {
        code: '',
        name: '',
        description: ''
      }
    }
  },
  methods: {
    async handleSave () {
      try {
        const { data } = await saveOrUpdateRole(this.role)
        // console.log(data)
        if (data.code === '000000') {
          // this.$message.success('添加成功')
          this.$emit('success')
        } else {
          // this.$message.error('添加失败')
          this.$emit('fail')
        }
      } catch (err) {
        console.log(err)
        // this.$message.error('添加失败')
        this.$emit('fail')
      }
    },
    async loadRole () {
      const { data } = await getEditRoleInfo(this.roleId)
      // console.log(data)
      this.role = data.data
    }
  },
  async created () {
    if (this.isEdit) {
      this.loadRole()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

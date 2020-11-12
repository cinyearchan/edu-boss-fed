<template>
  <div class="course-section">
    <el-card class="clearfix">
      <div slot="header" class="card-header">
        {{ course.courseName }}
        <el-button type="primary" @click="handleShowAddSection">添加阶段</el-button>
      </div>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleSort"
      >
        <div class="inner" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="data.sectionName" class="action">
            <el-button size="mini" @click.stop="handleEditSectionShow(data)">编辑</el-button>
            <el-button size="mini" type="primary" @click.stop="handleShowAddLesson(data)">添加课时</el-button>&nbsp;&nbsp;
            <el-select
              size="mini"
              class="select-status"
              v-model="data.status"
              placeholder="请选择"
              @change="handleSectionStatusChange(data)"
            >
              <el-option label="已隐藏" :value="0"></el-option>
              <el-option label="待更新" :value="1"></el-option>
              <el-option label="已更新" :value="2"></el-option>
            </el-select>
          </span>
          <span v-if="data.theme" class="action">
            <el-button size="mini" @click="handleShowEditLesson(data, node.parent.data)">编辑</el-button>
            <el-button
              size="mini"
              type="success"
              @click="$router.push({
                name: 'course-video',
                params: {
                  courseId
                },
                query: {
                  sectionId: node.parent.id,
                  lessonId: data.id
                }
              })"
            >上传视频</el-button>&nbsp;&nbsp;
            <!-- <el-button>状态</el-button> -->
            <el-select
              size="mini"
              class="select-status"
              v-model="data.status"
              placeholder="请选择"
              @change="handleLessonStatusChange(data)"
            >
              <el-option label="已隐藏" :value="0"></el-option>
              <el-option label="待更新" :value="1"></el-option>
              <el-option label="已更新" :value="2"></el-option>
            </el-select>
          </span>
        </div>
      </el-tree>
    </el-card>
    <!-- 章节 -->
    <create-or-update-section
      :section="section"
      :course="course"
      ref="sectionDialog"
      @submitSectionData="handleSubmitSection"
      @sectionDialogHide="handleSectionDialogHide"
    ></create-or-update-section>
    <!-- 课时 -->
    <create-or-update-lesson
      :lesson="lesson"
      :course="course"
      ref="lessonDialog"
      @submitLessonData="handleSubmitLessonData"
      @lessonDialogHide="handleLessonDialogHide"
    ></create-or-update-lesson>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCourseById } from '@/services/course'
import { getSectionAndLesson, saveOrUpdateSection } from '@/services/course-section'
import { saveOrUpdateLesson } from '@/services/course-lesson'
import CreateOrUpdateSection from './components/CreateOrUpdateSection.vue'
import CreateOrUpdateLesson from './components/CreateOrUpdateLesson.vue'

export default Vue.extend({
  name: 'CourseSection',
  components: {
    // 创建或编辑章节
    CreateOrUpdateSection,
    // 创建或编辑课时
    CreateOrUpdateLesson
  },
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      // 所有章节
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data: any) {
          return data.sectionName || data.theme
        }
      },
      // isAddLessonShow: false,
      // sectionDialogVisible: false,
      // 课程信息
      course: {
        id: '',
        courseName: ''
      },
      // 课时信息
      lesson: {
        // id: '',
        courseId: '',
        sectionId: '',
        sectionName: '',
        theme: '',
        duration: '',
        isFree: true,
        orderNum: 0,
        status: 0
      },
      // 章节信息 添加或者编辑
      section: {
        // id: '',
        courseId: '',
        courseName: '',
        sectionName: '',
        description: '',
        orderNum: '',
        status: 0
      }
    }
  },
  created () {
    this.loadCourse()
    this.loadSections()
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      // console.log('courseInfo', data)
      this.course = data.data
      this.section.courseId = this.course.id
      this.section.courseName = this.course.courseName
      this.lesson.courseId = this.course.id
    },
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      // console.log(data)
      this.sections = data.data
    },
    // 添加章节/阶段
    handleShowAddSection (data: any) {
      // console.log(data)
      // this.sectionDialogVisible = true
      (this.$refs.sectionDialog as any).showDialog()
      // console.log(this.$refs.sectionDialog)
    },
    // 编辑章节/阶段
    handleEditSectionShow (section: any) {
      // console.log(section)
      this.section = section
      ;(this.$refs.sectionDialog as any).showDialog()
    },
    handleSectionDialogHide () {
      this.section = {
        // id: '',
        courseId: this.course.id,
        courseName: this.course.courseName,
        sectionName: '',
        description: '',
        orderNum: '',
        status: 0
      }
    },
    // 提交章节信息
    async handleSubmitSection (section: any) {
      try {
        const { data } = await saveOrUpdateSection(section)
        if (data.code === '000000') {
          this.$message.success('操作成功')
          this.loadSections()
        } else {
          this.$message.error('操作失败')
        }
      } catch (e) {
        this.$message.error('操作失败')
      } finally {
        (this.$refs.sectionDialog as any).handleClose()
      }
    },
    // 添加课时
    handleShowAddLesson (section: any) {
      // console.log(section)
      this.lesson.sectionId = section.id
      this.lesson.sectionName = section.sectionName
      ;(this.$refs.lessonDialog as any).showDialog()
    },
    // 编辑课时
    handleShowEditLesson (lesson: any, section: any) {
      this.lesson = lesson
      this.lesson.sectionName = section.sectionName
      // this.isAddLessonShow = true
      ;(this.$refs.lessonDialog as any).showDialog()
    },
    handleLessonDialogHide () {
      this.lesson = {
        courseId: this.course.id,
        sectionId: '',
        sectionName: '',
        theme: '',
        duration: '',
        isFree: true,
        orderNum: 0,
        status: 0
      }
    },
    async handleSubmitLessonData (lesson: any) {
      try {
        const { data } = await saveOrUpdateLesson(lesson)
        if (data.code === '000000') {
          this.$message.success('操作成功')
          this.loadSections()
        } else {
          this.$message.error('操作失败')
        }
      } catch (e) {
        this.$message.error('操作失败')
      } finally {
        (this.$refs.lessonDialog as any).handleClose()
      }
    },
    // 章节/阶段状态变化
    async handleSectionStatusChange (section: any) {
      try {
        const { data } = await saveOrUpdateSection(section)
        if (data.code === '000000') {
          this.$message.success('状态切换成功')
        } else {
          this.$message.error('状态切换失败')
        }
      } catch (err) {
        this.$message.error('状态切换失败')
      }
    },
    // 拖拽排序
    handleAllowDrop (draggingNode: any, dropNode: any, type: any) {
      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
    },
    async handleSort (dragNode: any, dropNode: any, type: any, event: any) {
      try {
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          if (dragNode.data.lessonDTOS) {
            // 阶段
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            // 课时
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))
        this.$message.success('排序成功')
      } catch (err) {
        console.log(err)
        this.$message.error('排序失败')
      }
    },
    // 课时状态变化
    async handleLessonStatusChange (lesson: any) {
      // console.log(data)
      try {
        const { data } = await saveOrUpdateLesson(lesson)
        if (data.code === '000000') {
          this.$message.success('状态切换成功')
        } else {
          this.$message.error('状态切换失败')
        }
      } catch (err) {
        this.$message.error('状态切换失败')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.inner {
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>

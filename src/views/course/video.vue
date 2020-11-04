<template>
  <div class="course-video">
    <el-card>
      <div slot="header">
        <span>课程：xxx</span>
        <br>
        <span>阶段：xxx</span>
        <br>
        <span>课时：xxx</span>
      </div>
      <el-form label-width="70px">
        <el-form-item label="视频上传">
          <input ref="video-file" type="file">
        </el-form-item>
        <el-form-item label="封面上传">
          <input ref="video-cover" type="file">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpload">开始上传</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
        <el-form-item>
          <p>视频上传中：{{ uploadPercent }}%</p>
          <p v-if="isUploadSuccess">视频转码中：{{ isTransCodeSuccess ? '完成' : '正在处理，请稍后' }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getAliyunImagUploadAddressAdnAuth,
  getAliyunVideoUploadAddressAdnAuth,
  getAliyunTransCode,
  getAliyunTransCodePercent
} from '@/services/aliyun-upload'

export default Vue.extend({
  name: "CourseVideo",
  data () {
    return {
      uploader: null,
      imageUrl: null,
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTransCodeSuccess: false
    }
  },
  computed: {
    video () {
      return this.$refs['video-file']
    },
    cover () {
      return this.$refs['video-cover']
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    initUploader () {
      this.uploader = new window['AliyunUpload'].Vod({
        userId: '1618139964448548',
        region: '',
        partSize: 1048576,
        parallel: 5,
        retryCount: 3,
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo: any) => {
          let uploadAddressAndAuth
          if (uploadInfo.isImage) {
            const { data } = await getAliyunImagUploadAddressAdnAuth()
            uploadAddressAndAuth = data.data
            this.imageUrl = data.data.imageUrl
          } else {
            const { data } = await getAliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageUrl
            })
            uploadAddressAndAuth = data.data
            this.videoId = uploadAddressAndAuth.videoId
          }

          ;(this.uploader as any).setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo: any) {
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: (uploadInfo: any, totalSize: any, progress: any) => {
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(progress * 100)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo: any) {
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo: any) => {
          this.isUploadSuccess = true
          // 请求转码
          const { data } = await getAliyunTransCode({
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageUrl,
            fileName: (this.video as any).files[0].name,
            fileId: this.videoId
          })
          // 查询进度
          const timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(this.$route.query.lessonId)
            if (data.data === 100) {
              this.isTransCodeSuccess = true
              window.clearInterval(timer)
            }
          }, 3000)
        }
      })  
    },
    handleUpload () {
      this.isUploadSuccess = false
      this.isTransCodeSuccess = false
      this.uploadPercent = 0

      const videoFile = (this.video as any).files[0]
      const videoCover = (this.cover as any).files[0]
      const uploader = this.uploader as any
      uploader.addFile(videoCover, null, null, null, '{"Vod": {}}')
      uploader.addFile(videoFile, null, null, null, '{"Vod": {}}')
      uploader.startUpload()
    }
  }
})
</script>

<style lang="scss" scoped>
</style>

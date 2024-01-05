<!--
 * @Author: 1245040330 32012815+1245040330@users.noreply.github.com
 * @Date: 2024-01-04 15:02:01
 * @LastEditors: 1245040330 32012815+1245040330@users.noreply.github.com
 * @LastEditTime: 2024-01-05 11:59:58
 * @FilePath: \vue3-screen-recording\src\views\index\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="index-box">
    <div>
      音频录制：{{
        audioIsSupported && microphones.length > 0 ? "支持" : "不支持"
      }}; 屏幕录制：{{ isSupported ? "支持" : "不支持" }}
    </div>
    <el-button
      style="margin-top: 8px"
      v-if="!enabled"
      type="primary"
      @click="startUseDisplayMedia"
      >开始录制</el-button
    >

    <div class="button-box" v-if="enabled">
      <el-icon class="icon-box" size="20px"><VideoCamera /></el-icon>
      <el-button type="warning" @click="stopUseDisplayMedia"
        >⚪ 录屏中，点击停止录制</el-button
      >
    </div>
    <div class="title">录屏预览</div>
    <video ref="displayMediaPreview" autoplay class="video-box"></video>
    <div class="version">版本1.7.2</div>
  </div>
</template>
<script>
import { VideoCamera } from "@element-plus/icons-vue";
import {
  useDisplayMedia,
  useDevicesList,
  useUserMedia,
  useNow,
  useDateFormat,
} from "@vueuse/core";
import { watchEffect, computed } from "vue";
import { saveAs } from "file-saver";
import fixWebmDuration from "webm-duration-fix";
export default {
  name: "IndexBox",
  setup() {
    const {
      videoInputs: cameras,
      audioInputs: microphones,
      audioOutputs: speakers,
    } = useDevicesList({
      requestPermissions: true,
    });

    const currentMicrophone = computed(() => microphones.value[0]?.deviceId);
    const currentCamera = computed(() => cameras.value[0]?.deviceId);
    console.log(microphones, currentMicrophone, currentCamera);

    const {
      stream: audioStream,
      start: audioStart,
      stop: audioStop,
      isSupported: audioIsSupported,
    } = useUserMedia({
      constraints: {
        audio: { deviceId: currentMicrophone },
      },
    });

    const { stream, start, stop, enabled, isSupported } = useDisplayMedia();
    return {
      stream,
      start,
      stop,
      enabled,
      audioStart,
      audioStop,
      audioStream,
      microphones,
      currentMicrophone,
      audioIsSupported,
      isSupported,
    };
  },
  components: {
    VideoCamera,
  },
  watch: {
    stream: {},
    audioStream: {
      handler(val) {},
    },
  },
  data() {
    return {
      mediaRecorder: undefined,
      dataChunks: [],
      startRecordingTime: 0, //开始录制时间
      endRecordingTime: 0, //结束录制时间
      mimeType: "video/webm;codecs=vp9",
    };
  },
  created() {
    document.title = "录屏工具";

    var contentTypes = [
      "video/webm",
      "video/webm;codecs=vp8",
      "video/webm; codecs=vp9",
      "video/x-matroska;codecs=avc1",
      "audio/webm",
      "video/mp4;codecs=avc1",
      "video/invalid",
      "video/mp4",
      "video/webm;codecs=h264",
      "video/webm;codecs=h265",
      "video/mpeg",
    ];
    contentTypes.forEach((contentType) => {
      console.log(
        contentType +
          " is " +
          (MediaRecorder.isTypeSupported(contentType)
            ? "supported"
            : "NOT supported ")
      );
    });
  },
  beforeUnmount() {
    this.stop();
    this.audioStop();
  },
  methods: {
    /**
     * @desc 开始使用屏幕直播
     */
    startUseDisplayMedia() {
      this.audioStart();
      this.start();
      watchEffect(() => {
        if (this.stream) {
          console.log(
            "开始更新流",
            this.stream,
            this.$refs.displayMediaPreview
          );
          this.$refs.displayMediaPreview.srcObject = this.stream;
          this.$nextTick(() => {
            this.startRecording(this.stream, this.audioStream);
          });
        }
      });
    },
    /**
     * @desc 停止屏幕直播
     */
    stopUseDisplayMedia() {
      this.stop();
      this.audioStop();
      this.stopRecording();
    },
    /**
     * @desc 开始录制
     */
    startRecording(stream, audioStream) {
      let combined = undefined;
      if (this.currentMicrophone) {
        combined = new MediaStream([
          ...stream.getTracks(),
          ...audioStream.getAudioTracks(),
        ]);
      } else {
        combined = stream;
      }

      this.mediaRecorder = new MediaRecorder(combined, {
        mimeType: this.mimeType,
      });
      this.mediaRecorder.ondataavailable = (event) => {
        let data = event.data;
        this.dataChunks.push(data);
      };
      this.startRecordingTime = new Date().getTime();
      this.mediaRecorder.start(1000);
    },

    /**
     * @desc 停止录制
     */
    async stopRecording() {
      this.mediaRecorder.stop();
      this.endRecordingTime = new Date().getTime();
      // let recordedBlob = new Blob(this.dataChunks, { type: this.mimeType });
      const fixBlob = await fixWebmDuration(new Blob([...this.dataChunks], { type: this.mimeType }));
      this.dataChunks=[];
      let url = URL.createObjectURL(fixBlob);
      window.open(url);
      console.log(url);
      let time = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");
      saveAs(url, time.value + "录屏.webm");
    },
  },
};
</script>
<style lang="scss" scoped>
.index-box {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .button-box {
    display: flex;
    align-items: center;

    .icon-box {
      margin-right: 10px;
      animation: animationKey 2s linear infinite;
    }
  }
  .title {
    margin-top: 16px;
  }
  .video-box {
    margin-top: 16px;
    width: 50vw;
    background: #000;
  }
  .version {
    margin-top: 8px;
    opacity: 0.5;
  }

  @keyframes animationKey {
    0% {
      color: red;
      opacity: 0;
    }

    50% {
      color: red;
      opacity: 1;
    }

    100% {
      color: red;
      opacity: 0;
    }
  }
}
</style>
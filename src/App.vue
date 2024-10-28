<!--
 * @Author: 1245040330 32012815+1245040330@users.noreply.github.com
 * @Date: 2023-09-16 10:34:31
 * @LastEditors: 1245040330 32012815+1245040330@users.noreply.github.com
 * @LastEditTime: 2024-03-26 13:58:21
 * @FilePath: \vue3-cl-live-video\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-main transition-colors bg-white-900 dark:bg-black-800">
    <IndexVue></IndexVue>
    <div v-for="(item, a) in desktopCapturerSourceList">
      <el-image :src="item.image"></el-image>
      {{ item }}
    </div>
  </div>
</template>
<script>
import UserAgent from "ua-parser-js";
import {
  ElNotification,
  ElMessageBox,
  ElLoading,
  ElMessage,
} from "element-plus";
import { message } from "ant-design-vue";
import IndexVue from "@/views/index/index";
export default {
  name: "AppMain",
  components: {
    IndexVue,
  },
  data() {
    return {
      userAgent: {},
      _ElNotification: ElNotification,
      _ElMessageBox: ElMessageBox,
      _ElMessage: ElMessage,
      _ElLoading: ElLoading,
      _AntMessage: message,
      socket: undefined,
      desktopCapturerSourceList: [],
    };
  },
  computed: {},
  created() {
    window.app = this;
    if (window.electronAPI && window.electronAPI.desktopCapturerGetSources) {
      window.navigator.mediaDevices.getDisplayMedia = () => {
        console.log("覆盖方法");
        return new Promise(async (resolve, reject) => {
          try {
            const sources =
              await window.electronAPI.desktopCapturerGetSources();
            console.log(sources);
            const stream = await window.navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: sources[0].id,
                },
              },
            });
            resolve(stream);
          } catch (err) {
            reject(err);
          }
        });
      };
    }
  },
  mounted() {
    let parser = new UserAgent();
    parser.setUA(navigator.userAgent);
    let userAgent = parser.getResult();
    this.userAgent = userAgent;
    this.init();
  },
  methods: {
    async init() {
      this.desktopCapturerSourceList =
        await window.electronAPI.desktopCapturerGetSources();
      console.log(await window.electronAPI.desktopCapturerGetSources());
    },
    async getDictData(dictType) {
      if (dictType) {
        const { data } = await this.httpGet("dict/getDictDataListByDictType", {
          dictType: dictType,
        });
        return data;
      } else {
        return [];
      }
    },
    validateFrom(ruleFormRef) {
      return new Promise((resolve, reject) => {
        ruleFormRef.validate((valid, fields) => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.app-main {
  min-width: 300px;
  height: 100vh;
}
</style>
<style>
:focus-visible {
  outline: transparent auto 1px;
}
</style>

<style lang="scss">
.el-loading-mask {
  z-index: 2 !important;
}
.dark .el-input.is-disabled .el-input__inner {
  background-color: transparent;
}

.el-menu-item:focus,
.el-menu-item:hover {
  background-color: transparent;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: transparent !important;
}

.dark .el-input-group__append {
  border-width: 0;
}
.el-table--fit {
  border-width: 0;
}
.el-table {
  & > .el-table__header-wrapper {
    & > .el-table__header {
      th {
        background-color: #f9f9f9;
        color: rgb(119, 119, 119);
      }
    }
  }
  .el-table__body tr.current-row > td.el-table__cell {
    border-bottom: 1px solid #409eff;
    border-top: 1px solid #409eff;
  }
  .el-table__body tr.current-row > td.el-table__cell:first-child {
    border-left: 1px solid #409eff;
  }
  .el-table__body tr.current-row > td.el-table__cell:last-child {
    border-right: 1px solid #409eff;
  }
}

.hidden-roll::-webkit-scrollbar-thumb {
  background: #00000000;
  transition: all 0.5s;
  transition: all 0.12s ease-out;
}
.hidden-roll:hover::-webkit-scrollbar-thumb {
  background: #a0a0a085;
}

::-webkit-scrollbar {
  /* width: 8px;腾讯文档的 */
  width: 10px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: #a0a0a085;
  border-radius: 5px;
  border: 1px solid transparent;
  height: 140px;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: #cccccc;
  border-radius: 5px;
  border: 1px solid transparent;
  height: 140px;
  background-clip: content-box;
}

::-webkit-scrollbar-corner {
  background-color: inherit;
}
</style>
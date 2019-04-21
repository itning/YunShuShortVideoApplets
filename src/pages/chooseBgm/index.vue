<template>
  <view>
    <form>
      <radio-group name="bgmId">
        <block v-for="item in bgmList" :key="item.id">
          <view class='container'>
            <audio :name="item.name" :author="item.author" :src="item.path" style='width:300px'
                   :id="item.id" controls loop></audio>
            <radio style='margin-top:20px;' :value='item.id' @click="nowCheck(item.id)"></radio>
          </view>
        </block>
      </radio-group>
      <view class="inputView">
        <label class="loginLabel">视频描述：</label>
        <input name="desc" v-model="video.desc" class="inputText" placeholder="说点什么吧"/>
      </view>
      <!-- 提交 -->
      <button class="submitBtn" @click="upload" type="primary" form-type='submit'>上传视频</button>
      <button class="gobackBtn" type="warn" form-type='reset'>重置</button>
    </form>
  </view>
</template>

<script>
  import {bgm, serverUrl, video} from "../../utils/api";
  import {getSessionInStorageSync, showOKToast, showToast} from "../../utils";

  export default {
    name: "index",
    data() {
      return {
        bgmList: [],
        video: {
          desc: '',
          bgmId: '',
          duration: 0,
          height: 0,
          width: 0,
          size: 0,
          tempFilePath: ''
        }
      }
    },
    methods: {
      getAllBGM() {
        let that = this;
        mpvue.request({
          url: bgm.all,
          method: "GET",
          header: {
            'cookie': getSessionInStorageSync()
          },
          success: function (res) {
            if (res.statusCode === 200) {
              console.log(res);
              console.log(res.data);
              let temp = res.data.data;
              that.bgmList = temp.map(r => {
                r.path = serverUrl + '/bgm/' + r.path;
                return r;
              });
            } else {
              showToast(res.data.msg)
            }
          },
          fail: function () {
            showToast("接口调用失败")
          }
        })
      },
      upload() {
        console.log(this.video);
        let that = this;
        mpvue.showLoading({
          title: '正在上传...',
        });
        const uploadFile = mpvue.uploadFile({
          header: {'cookie': getSessionInStorageSync()},
          url: video.upload,//开发者服务器地址
          filePath: that.video.tempFilePath,	//要上传文件资源的路径
          name: 'file',	//文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
          formData: that.video,
          success: function (res) {
            mpvue.hideLoading();
            if (res.statusCode === 201) {
              showOKToast("上传成功");
            } else if (res.statusCode === 401) {
              showToast('请重新登陆');
              mpvue.redirectTo({
                url: '../userLogin/main',
              })
            } else {
              let parse = JSON.parse(res.data);
              showToast(parse.msg);
            }
          },
          fail: function () {
            showToast("接口调用失败")
          }
        });
        uploadFile.onProgressUpdate((res) => {
          console.log('上传进度', res.progress);
          console.log('已经上传的数据长度', res.totalBytesSent);
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
        })
      },
      nowCheck(id) {
        this.video.bgmId = id;
      }
    },
    created() {

    },
    onLoad(param) {
      this.video.duration = param.duration;
      this.video.height = param.height;
      this.video.width = param.width;
      this.video.size = param.size;
      this.video.tempFilePath = param.tempFilePath;
      this.getAllBGM();
    }
  }
</script>

<style scoped>
  page {
    height: 100%;
  }

  .container {
    display: flex;
    margin-top: 20 rpx;
    justify-content: space-around;
  }

  .submitBtn {
    width: 80%;
    margin-top: 15px;
  }

  .gobackBtn {
    width: 80%;
    margin-top: 15px;
  }


  .loginLabel {
    color: gray;
    font-size: 15px;
  }

  .inputText {
    float: right;
    text-align: right;
    margin-right: 22px;
    margin-top: 11px;
    font-size: 15px;
  }

  .inputView {
    padding: 5px;
    background-color: white;
    line-height: 45px;
    border: solid 1px whitesmoke;
  }
</style>

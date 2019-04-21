<template>
  <div>
    <view>
      <view class='container'>
        <block v-if="isMe">
          <image :src="faceUrl" class="face" @click='changeFace'></image>
        </block>
        <block v-if="!isMe">
          <image :src="faceUrl" class="face"></image>
        </block>
        <label class='nickname'>{{nickname}}</label>

        <block v-if="isMe">
          <button size='mini' class='primary' @click='uploadVideo'> 上传作品</button>
          <button size='mini' type='' class='logout' @click='logout'>注销</button>
        </block>
        <block v-if="!isMe">
          <block v-if="isFollow">
            <button size='mini' type='' class='follow' data-followType='0' bindtap='followMe'>已关注</button>
          </block>
          <block v-if="!isFollow">
            <button size='mini' type='primary' class='follow' data-followType='1' bindtap='followMe'>关注我</button>
          </block>
        </block>
        <view class='container-row'>
          <label class='info-items'>{{fansCounts}} 粉丝</label>
          <label class='info-items'>{{followCounts}} 关注</label>
          <label class='info-items'>{{receiveLikeCounts}} 获赞</label>
        </view>
      </view>
    </view>
    <view class="line"></view>
  </div>
</template>

<script>
  import {security, serverUrl, user} from "../../utils/api";
  import {flushSessionInStorageSync, getSessionInStorageSync, showOKToast, showToast} from "../../utils";

  export default {
    name: "index",
    data() {
      return {
        faceUrl: "/static/images/noneface.png",
        isMe: true,
        isFollow: false,
        fansCounts: 0,
        followCounts: 0,
        receiveLikeCounts: 0
      }
    },
    methods: {
      logout() {
        mpvue.showLoading({
          title: '正在注销...',
        });
        mpvue.request({
            url: security.logout,
            method: "GET",
            header: {
              'cookie': getSessionInStorageSync()
            },
            success: function (res) {
              flushSessionInStorageSync(res);
              console.log(res.data);
              mpvue.hideLoading();
              if (res.data.code === 200) {
                showOKToast("注销成功");
                mpvue.redirectTo({
                  url: '../userLogin/main',
                })
              } else {
                showToast(res.data.msg);
              }
            },
            fail: function () {
              showToast("接口调用失败")
            }
          }
        )
      },
      changeFace() {
        let that = this;
        mpvue.chooseImage({
          count: 1,
          success: function (res) {
            console.log(res);
            let imagePath = res.tempFiles[0].path;
            mpvue.uploadFile({
              header: {'cookie': getSessionInStorageSync()},
              url: user.uploadFaceImg,//开发者服务器地址
              filePath: imagePath,	//要上传文件资源的路径
              name: 'file',		//文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
              success: function (res) {
                if (res.statusCode === 201) {
                  showOKToast("头像上传成功");
                  that.faceUrl = imagePath;
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
            })
          }
        })
      },
      uploadVideo() {
        mpvue.chooseVideo({
          maxDuration: 11,
          success(res) {
            console.log(res);
            if (res.duration < 1) {
              showToast("视频长度过短");
              return;
            }
            if (res.duration > 11) {
              showToast("视频长度过长");
              return;
            }
            mpvue.navigateTo({
              url: `/pages/chooseBgm/main?duration=${res.duration}&height=${res.height}&width=${res.width}&size=${res.size}&tempFilePath=${res.tempFilePath}`
            });
          },
          fail() {
            showToast("接口调用失败")
          }
        })
      }
    },
    created() {
      let that = this;
      mpvue.getStorage({
        key: 'users',
        success(res) {
          that.fansCounts = res.data.data.fansCounts;
          that.followCounts = res.data.data.followCounts;
          that.receiveLikeCounts = res.data.data.receiveLikeCounts;
          if (res.data.data.faceImage !== '') {
            that.faceUrl = serverUrl + '/face/' + res.data.data.faceImage;
          }
        }
      })
    }
  }
</script>

<style scoped>
  page {
    font-size: 14px;
  }

  .container {
    background-color: whitesmoke;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .container-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .info-items {
    margin-left: 30px;
  }

  .face {
    width: 180rpx;
    height: 180rpx;
    border-radius: 50%;
    margin-top: 20px;
  }

  .nickname {
    margin-top: 5px;
    font-weight: bold;
    font-size: 18px;
  }

  .logout {
    margin-top: 3px;
    float: right;
  }

  .follow {
    margin-top: 3px;
  }

  .line {
    width: 100%;
    height: 1px;
    background-color: gainsboro;
    margin-top: 1px;
  }

  .container-video {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    text-align: center;
    border: solid 1px;
    line-height: 30px;
  }

  .video-info {
    width: 100%;
  }

  .video-info-selected {
    background-color: gainsboro;
  }

  .container-video-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .videoImage {
    width: 250rpx;
    height: 180px;
  }

</style>

<template>
  <div>
    <view v-for="item in videoList" class="item-container" :key="item.id">
      <view :style="'width:'+screenWidth+'px;height:210px;'" class='back-img'>
        <image :src="item.coverPath" :style="'width:'+screenWidth+'px;height:210px;'" mode="aspectFit"
               bindtap='showVideoInfo' :data-arrindex='index'></image>
      </view>
      <view class="desc">
        <view class="faceName">
          <image class='myface' :src="item.faceImg"></image>
          <view class="nickname">{{item.nickName}}</view>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
  import {serverUrl, video} from "../../utils/api";
  import {getSessionInStorageSync, showToast} from "../../utils";

  export default {
    name: "index",
    data() {
      return {
        videoList: [],
        screenWidth: 0,
        totalPages: 1,
        page: 1
      }
    },
    methods: {
      getALLVideos(page = 1, pageSize = 5) {
        mpvue.showLoading({
          title: '加载中...',
        });
        let that = this;
        mpvue.request({
          url: `${video.all}?page=${page}&pageSize=${pageSize}`,
          method: "GET",
          header: {
            'cookie': getSessionInStorageSync()
          },
          success: function (res) {
            mpvue.hideLoading();
            mpvue.hideNavigationBarLoading();
            mpvue.stopPullDownRefresh();
            if (res.statusCode === 200) {
              that.totalPages = res.data.data.total;
              that.page = res.data.data.page;
              let temp = res.data.data.rows;
              that.videoList = that.videoList.concat(temp.map(r => {
                r.coverPath = serverUrl + '/video/' + r.coverPath;
                r.faceImg = serverUrl + '/face/' + r.faceImg;
                return r;
              }));

            } else {
              showToast(res.data.msg)
            }
          },
          fail: function () {
            showToast("接口调用失败")
          }
        })

      }
    },
    created() {
      // let app = getApp()
      this.screenWidth = mpvue.getSystemInfoSync().screenWidth;
      this.getALLVideos();
    },
    onReachBottom() {
      console.log('onReachBottom');
      if (this.page >= this.totalPages) {
        showToast("没有更多视频了");
        return;
      }
      this.page = (this.page) + 1;
      this.getALLVideos(this.page);
    },
    onPullDownRefresh() {
      mpvue.showNavigationBarLoading();
      this.page = 1;
      this.totalPages = 1;
      this.getALLVideos();
    }
  }
</script>

<style scoped>
  .item-container {
    position: relative;
  }

  .cover {
    width: 100%;
    height: 400rpx;
    display: block;
  }

  .back-img {
    display: block;
    background-color: black;
  }

  .desc {
    margin-top: -40rpx;
    margin-bottom: 10rpx;
    display: flex;
    align-items: center;
  }

  .desc .right {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .desc .faceName {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-left: 10px;
  }

  .title {
    font-size: 30rpx;
    margin-top: 10rpx;
    margin-left: 20rpx;
    width: 600rpx;
  }

  .myface {
    display: block;
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
    margin-top: 10rpx;
    margin-right: 20rpx;
  }

  .nickname {
    font-size: 20rpx;
    margin-top: 6rpx;
    margin-right: 20rpx;
    color: darkgray;
  }

</style>

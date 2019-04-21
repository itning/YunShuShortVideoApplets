<template>
  <div :style="{height: screenHeight}">
    <view style='width:100%;height:100%;'>
      <video id="myVideo" :src="src"
             muted="true"
             controls="true"
             autoplay="true"
             loop="true"
             enable-progress-gesture="false"
             style='width:100%;height:100%;'
             object-fit='cover'
      >
        <cover-view class='container'>
          <!-- 上传视频 -->
          <cover-image src='/static/images/camera.png' style='width:50rpx;height:50rpx;'
                       bindtap='upload'></cover-image>
          <!-- 搜索按钮 -->
          <cover-image src='/static/images/search.png' style='width:45rpx;height:45rpx;'
                       bindtap='showSearch'></cover-image>
        </cover-view>
        <cover-view class='container-me'>
          <!-- 头像 -->
          <cover-image class="face" :src='publisher.faceImage' bindtap='showPublisher'></cover-image>
          <!-- 喜欢收藏按钮 -->
          <block v-if="userLikeVideo">
            <cover-image class="size-me" src='/static/images/like.png' style='margin-top:30rpx;'
                         bindtap='likeVideoOrNot'></cover-image>
          </block>
          <block v-else>
            <cover-image class="size-me" src='/static/images/unlike.png' style='margin-top:30rpx;'
                         bindtap='likeVideoOrNot'></cover-image>
          </block>
          <!-- 评论按钮 -->
          <cover-image class="size-me" src='/static/images/comments.png' style='margin-top:30rpx;'
                       @click='leaveComment'></cover-image>
          <!-- 分享按钮 -->
          <cover-image class="size-me" src='/static/images/share.png' style='margin-top:30rpx;'
                       bindtap='shareMe'></cover-image>
        </cover-view>
        <cover-view class='container-words'>
          <cover-view>@{{publisher.nickname}}</cover-view>
          <cover-view class='video-desc'>{{videoInfo.videoDesc}}</cover-view>
        </cover-view>
        <cover-view class='container-bottom'>
          <cover-image src='/static/images/index.png' class='size-bottom' bindtap='showIndex'></cover-image>
          <cover-image src='/static/images/mine.png' class='size-bottom' bindtap='showMine'></cover-image>
        </cover-view>
      </video>
    </view>
    <view>
      <view class="saySthView">
        <input name="commentContent" class="saySth" :placeholder="placeholder" confirm-type="send"
               @blur="saveComment" :focus='commentFocus' v-model="contentValue"
               :data-replyFatherCommentId='replyFatherCommentId'
               :data-replyToUserId='replyToUserId'
        />
      </view>
      <block v-for="item in commentsList" :key="item.id">
        <view class='comments-all' bindtap='replyFocus'
              :data-fatherCommentId='item.id'
              :data-toUserId='item.fromUserId'
              :data-toNickname='item.nickname'
        >
          <view class='container-comments'>
            <image class="face-comments" :src='item.faceImage'></image>
            <view class='nickname-comments'>
              <label class='nickname-lbl'>@{{item.nickname}}</label>
              于
              <label class='date-lbl'>{{item.timeAgoStr}}</label>
              <!-- 留言： -->
              <block v-if="item.toNickname != null">
                回复
                <label class='nickname-lbl'>@{{item.toNickname}}</label>
              </block>
              <block v-else>
                留言：
              </block>
            </view>
          </view>
          <view class='comments-content'>{{item.comment}}</view>
        </view>
      </block>
    </view>
  </div>
</template>

<script>
  import {flushSessionInStorageSync, getSessionInStorageSync, showOKToast, showToast} from "../../utils";
  import {comments, serverUrl} from "../../utils/api";

  export default {
    name: "index",
    data() {
      return {
        src: 'http://192.168.1.100:8080/video/6ed65750e987451594e10606d6e40ffb.mp4',
        publisher: {
          faceImage: 'http://192.168.1.100:8080/face/61f66ff72c264be5a688daf568a256af.jpg',
          nickname: '',
          videoDesc: ''
        },
        videoInfo: {
          videoDesc: '',
          id: '6ed65750e987451594e10606d6e40ffb'
        },
        commentsList: [],
        userLikeVideo: false,
        commentFocus: false,
        contentValue: '',
        placeholder: '留言',
        screenHeight: 0,
        commentsPage: 1,
        commentsTotalPages: 1
      }
    },
    methods: {
      leaveComment() {
        this.commentFocus = true;
      },
      saveComment() {
        let that = this;
        if (that.contentValue === '') {
          return;
        }
        mpvue.showLoading({
          title: '正在保存...',
        });
        mpvue.request({
          url: comments.save,
          method: 'POST',
          header: {
            "content-type": "application/x-www-form-urlencoded",
            'cookie': getSessionInStorageSync()
          },
          data: {
            comment: that.contentValue,
            videoId: that.videoInfo.id
          },
          success(res) {
            mpvue.hideLoading();
            if (res.statusCode === 201) {
              showOKToast("评论成功");
              that.contentValue = '';
              that.getCommentsList(1, 5, true);
            } else {
              if (res.statusCode === 401) {
                mpvue.redirectTo({
                  url: '../userLogin/main',
                });
                return;
              }
              showToast("评论失败");
            }
          },
          fail() {
            showToast('接口调用失败')
          }
        })
      },
      getCommentsList(page = 1, pageSize = 5, clear = false) {
        mpvue.showLoading({
          title: '加载中...',
        });
        let that = this;
        mpvue.request({
          url: `${comments.get}?page=${page}&pageSize=${pageSize}&videoId=${that.videoInfo.id}`,
          method: "GET",
          header: {
            'cookie': getSessionInStorageSync()
          },
          success: function (res) {
            mpvue.hideLoading();
            if (res.statusCode === 200) {
              console.log(res.data);
              that.commentsPage = res.data.data.page;
              that.commentsTotalPages = res.data.data.total;
              if (clear) {
                that.commentsList = res.data.data.rows.map(r => {
                  r.faceImage = `${serverUrl}/face/${r.faceImage}`;
                  return r;
                });
              } else {
                that.commentsList = that.commentsList.concat(res.data.data.rows.map(r => {
                  r.faceImage = `${serverUrl}/face/${r.faceImage}`;
                  return r;
                }));
              }
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
      this.screenHeight = mpvue.getSystemInfoSync().screenHeight + 'px';
      this.getCommentsList();
    },
    onReachBottom() {
      console.log('onReachBottom');
      if (this.commentsPage >= this.commentsTotalPages) {
        showToast("没有更多评论了");
        return;
      }
      this.commentsPage = (this.commentsPage) + 1;
      this.getCommentsList(this.commentsPage);
    },
  }
</script>

<style scoped>
  page {
    height: 100%;
    background-color: #141414;
  }

  .container {
    display: flex;
    margin-top: 20rpx;
    margin-left: 50rpx;
    margin-right: 50rpx;
    justify-content: space-between;
  }

  .container-me {
    margin-top: 360rpx;
    margin-left: 50rpx;
    width: 80rpx;
  }

  .container-words {
    /* display: flex;
    flex-direction: column; */
    margin-top: 60rpx;
    margin-left: 50rpx;
    width: 100%;
    color: white;
    font-size: 14px;
  }

  .inputText {
    background-color: gainsboro;
    height: 35px;
  }

  .video-desc {
    width: 600rpx;
    height: 100rpx;
    white-space: pre-wrap;
  }

  .container-bottom {
    /* bottom: 10px;  */
    display: flex;
    margin-top: 60rpx;
    margin-left: 50rpx;
    margin-right: 50rpx;
    /* margin-bottom: 10rpx; */
    justify-content: space-between;
    /* position: fixed;  */
  }

  .size-me {
    width: 70rpx;
    height: 70rpx;
  }

  .size-me-bgm {
    width: 40rpx;
    height: 40rpx;
  }

  .bgm-style {
    display: flex;
    flex-direction: row;
  }

  .size-bottom {
    width: 60rpx;
    height: 60rpx;
  }

  .face2 {
    width: 75rpx;
    height: 75rpx;
    border: 0 solid #f00;
    border-radius: 100rpx;
    background-color: #f10b2e;
  }

  .face {
    width: 75rpx;
    height: 75rpx;
    /* margin: 20rpx; */
    border-radius: 50%;
  }

  .icoBtn {
    flex: 1;
    width: 80rpx;
    height: 100%;
  }


  .comments-scoll {
    height: 1200rpx;
  }


  .comments-all {
    /* margin-top: 10px; */
    /*margin-bottom: 10px;*/
    /* border-bottom: solid 1px gray;   */
    background-color: #141414;
    color: #e8e8e8;
  }

  .face-comments {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    margin-left: 5px;
  }

  .container-comments {
    display: flex;

    /* margin-top: 20rpx;
    margin-left: 50rpx;
    margin-right: 50rpx;
    justify-content: space-between; */

  }


  .nickname-comments {
    margin-left: 10px;
  }

  .nickname-lbl {
    color: #a1a1a1;
  }

  .date-lbl {
    color: #a1a1a1;
  }

  .comments-content {
    margin-left: 5px;
    margin-right: 5px;
    /* margin-bottom: 10px; */
    border-bottom: solid 1px #232323;
    background-color: #141414;
  }

  .saySthView {
    padding: 10px;
    background-color: #141414;
    line-height: 45px;
    border-bottom: solid 1px #232323;
    color: white;
  }

  .saySth {
    margin-top: 10px;
    margin-left: 10px;
    font-size: 18px;
  }
</style>

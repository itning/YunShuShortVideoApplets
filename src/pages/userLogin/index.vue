<template>
  <view>
    <view class="login-icon">
      <image class="login-img" src="/static/images/dsp.jpg"></image>
    </view>
    <view class="login-from">
      <form>
        <!--账号-->
        <view class="inputView">
          <image class="nameImage" src="/static/images/username.png"></image>
          <label class="loginLabel">账号</label>
          <input name="username" v-model="login.username" class="inputText" placeholder="请输入账号"/>
        </view>
        <view class="line"></view>

        <!--密码-->
        <view class="inputView">
          <image class="keyImage" src="/static/images/password.png"></image>
          <label class="loginLabel">密码</label>
          <input name="password" v-model="login.password" class="inputText" password="true" placeholder="请输入密码"/>
        </view>

        <!--按钮-->
        <view>
          <button class="loginBtn" type="primary" form-type='submit' @click="doLogin">登录</button>
        </view>

        <view>
          <button class="goRegistBtn" type="warn" @click="goRegistPage">没有账号？点击注册</button>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
  import {security} from "../../utils/api";
  import {flushSessionInStorageSync, getSessionInStorageSync, showOKToast, showToast} from "../../utils";

  export default {
    name: "index",
    data() {
      return {
        login: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      doLogin() {
        if (this.login.username === '') {
          showToast('用户名不能为空');
          return;
        }
        if (this.login.password === '') {
          showToast("密码不能为空");
          return;
        }
        mpvue.showLoading({
          title: '正在登陆...',
        });
        mpvue.request({
            url: security.login,
            method: "POST",
            data: this.login,
            header: {
              "content-type": "application/x-www-form-urlencoded",
              'cookie': getSessionInStorageSync()
            },
            success: function (res) {
              flushSessionInStorageSync(res);
              mpvue.setStorage({
                key: 'users',
                data: res.data
              });
              console.log(res.data);
              mpvue.hideLoading();
              if (res.data.code === 200) {
                showOKToast("登录成功");
                mpvue.redirectTo({
                  url: '../mine/main',
                })
              } else {
                showToast(res.data.msg);
              }
            }
          }
        )
      },
      goRegistPage() {
        mpvue.redirectTo({
          url: '../userRegist/main',
        })
      }
    },
    created() {
      // let app = getApp()
    }
  }
</script>

<style scoped>
  page {
    background-color: whitesmoke;
  }

  .login-img {
    width: 750rpx;
  }

  /*表单内容*/
  .inputView {
    background-color: white;
    line-height: 45px;
  }

  /*输入框*/
  .nameImage, .keyImage {
    margin-left: 22px;
    width: 20px;
    height: 20px;
  }

  .loginLabel {
    margin: 15px 15px 15px 10px;
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

  .line {
    width: 100%;
    height: 1px;
    background-color: gainsboro;
    margin-top: 1px;
  }

  /*按钮*/
  .loginBtn {
    width: 80%;
    margin-top: 35px;
  }

  .goRegistBtn {
    width: 80%;
    margin-top: 15px;
  }

</style>

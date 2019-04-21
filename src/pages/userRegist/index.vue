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
          <input name="username" v-model="reg.username" class="inputText" placeholder="请输入账号"/>
        </view>

        <view class="line"></view>

        <!--密码-->
        <view class="inputView">
          <image class="keyImage" src="/static/images/password.png"></image>
          <label class="loginLabel">密码</label>
          <input name="password" v-model="reg.password" class="inputText" password="true" placeholder="请输入密码"/>
        </view>

        <!--按钮-->
        <view>
          <button class="loginBtn" @click="doRegist" type="primary" form-type='submit'>注册</button>
        </view>

        <view>
          <button class="goLoginBtn" type="warn" @click="goLoginPage">返回登录</button>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
  import {flushSessionInStorageSync, getSessionInStorageSync, showOKToast, showToast} from "../../utils";
  import {security} from "../../utils/api";

  export default {
    name: "index",
    data() {
      return {
        reg: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      doRegist() {
        if (this.reg.username === '') {
          showToast('请填写用户名');
          return;
        }
        if (this.reg.password === '') {
          showToast('请填写密码');
          return;
        }
        mpvue.showLoading({
          title: '请稍后...',
        });
        mpvue.request({
          url: security.reg,
          method: 'POST',
          header: {
            "content-type": "application/x-www-form-urlencoded",
            'cookie': getSessionInStorageSync()
          },
          data: this.reg,
          success(res) {
            flushSessionInStorageSync(res);
            mpvue.hideLoading();
            if (res.statusCode === 201) {
              showOKToast(res.data.msg);
            } else {
              showToast(res.data.msg);
            }
          },
          fail(res) {
            showToast('接口调用失败')
          }
        })
      },
      goLoginPage() {
        mpvue.redirectTo({
          url: '../userLogin/main',
        })
      }
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

  .goLoginBtn {
    width: 80%;
    margin-top: 15px;
  }

</style>

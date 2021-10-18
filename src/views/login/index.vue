<template>
  <div class="login-container">
    <particles-bg :key="typeModel" :type="typeModel" :config="config" :bg="true" />

    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container flex flex-col items-center mb-10">
        <div><svg-icon icon-class="security" class-name="logo" /></div>
        <h2 class="title">{{ title }}</h2>
        <h3 class="title__sub">{{ subTitle }}</h3>
        <p v-if="env">({{ env }})</p>
      </div>

      <el-select v-model="typeModel" class="w-full mb-4" size="default">
        <el-option v-for="item in types" :key="item" :value="item" :label="item" />
      </el-select>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="用户名"
          size="default"
          auto-complete="on"
        >
          <template slot="prepend">
            <i class="el-icon-user" />
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          show-password
          size="default"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        >
          <template slot="prepend">
            <i class="el-icon-lock" />
          </template>
        </el-input>
      </el-form-item>

      <el-button type="success" class="w-full mb-2" @keypress="generateConfetti" @click="generateConfetti">🎉</el-button>

      <br>

      <el-button class="full-width" :loading="loading" type="primary" size="default" @click.native.prevent="handleLogin">登陆</el-button>
    </el-form>
  </div>
</template>

<script>
import { title, subTitle } from '@/settings.js'
import { ParticlesBg } from 'particles-bg-vue'
import icon from './icon'
import confetti from 'canvas-confetti'

// import { md5 } from '@/utils'

export default {
  name: 'Login',
  components: { ParticlesBg },
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        username: 'admin',
        password: 'Phm@railway123'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      title: title,
      subTitle: subTitle,
      env: process.env.VUE_APP_ENV_NAME,
      userDialogVisible: false,
      config: {
        num: [4, 7],
        rps: 0.1,
        radius: [5, 40],
        life: [1.5, 3],
        v: [2, 3],
        tha: [-30, 30],
        body: icon,
        // body: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/285/smiling-face-with-hearts_1f970.png',
        alpha: [0.6, 0],
        scale: [0.1, 0.4],
        position: 'all',
        cross: 'dead',
        random: 15
      },
      typeModel: 'random',
      types: [
        'color',
        'ball',
        'lines',
        'thick',
        'circle',
        'cobweb',
        'polygon',
        'square',
        'tadpole',
        'fountain',
        'random',
        'custom'
      ]
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted () {
    confetti()
  },
  methods: {
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const data = Object.assign({}, this.loginForm)
          // data.password = md5(data.password)
          this.$store.dispatch('user/login', data).then(() => {
            this.$router.push({ path: this.redirect || '/' }).catch(() => {})
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    generateConfetti () {
      confetti()

      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      })

      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      })

      // const duration = 30 * 1000
      // const end = Date.now() + duration;
      //
      // (function frame () {
      //   // launch a few confetti from the left edge
      //   confetti({
      //     particleCount: 7,
      //     angle: 60,
      //     spread: 55,
      //     origin: { x: 0 }
      //   })
      //   // and launch a few from the right edge
      //   confetti({
      //     particleCount: 7,
      //     angle: 120,
      //     spread: 55,
      //     origin: { x: 1 }
      //   })
      //
      //   // keep going until we are out of time
      //   if (Date.now() < end) {
      //     requestAnimationFrame(frame)
      //   }
      // }())
    },

    doHandle (doData) {
      const { login } = doData
      this.loginForm.username = login
      console.log(doData)
    }
  }
}
</script>

<style lang="scss" scoped>
$dark_gray:#889aa4;
$light_gray: #ffffff;
$bgColor: #409eff;

.login-container {
  min-height: 100%;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
  //background: $bgColor;
  //background: $bgColor url("../../assets/login-bg.png") no-repeat left bottom;
  //background-size: cover;

  .login-form {
    padding: 4rem;
    align-self: center;
    //background-color: rgba(255,255,255,.9);
    //box-shadow: 0 0 5px 5px #cacaca, 0 0 6px rgba(245, 245, 245, 0.04);
  }

  .title-container {
    background: linear-gradient(to right, $bgColor 0%, #cf1512 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 80%;
    animation: shining-text 5s linear infinite;

    .logo {
      font-size: 4rem;
    }

    .title {
      font-size: 26px;
      font-weight: bold;
    }

    .title__sub {
      font-size: 18px;
      font-weight: bold;
    }
  }
.user-choose {
  position: absolute;
  top: 4px;
}
.el-button--mini, .el-button--mini.is-round {
    padding: 8px 6px;
}
}

@keyframes shining-text {
  0% {
    background-position: -200%;
  }

  100% {
    background-position: 200%;
  }
}
</style>

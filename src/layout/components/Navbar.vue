<template>
  <div class="flex navbar">
    <div class="flex flex-center">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <el-popover
        trigger="hover"
        placement="bottom-start"
        :offset="50"
      >
        <div class="box-grid text-center">
          <div v-for="(t, index) in topLevelRoutes" :key="index">
            <router-link v-if="t.path && t.meta && t.meta.title" :to="t.path">{{ t.meta && t.meta.title }}</router-link>
          </div>
        </div>
        <el-link slot="reference"><i class="el-icon-s-grid module-box" /></el-link>
      </el-popover>
      <breadcrumb class="breadcrumb-container" />
    </div>

    <div class="right-menu flex">
      <div class="mr-10"><el-badge type="primary" :value="50"><el-link class="content-label" :underline="false"><i class="el-icon-document" />事项</el-link></el-badge></div>
      <div class="mr-10"><el-badge type="success" :value="12"><el-link class="content-label" :underline="false"><i class="el-icon-date" />日程</el-link></el-badge></div>
      <div class="mr-20"><el-badge type="danger" :value="3"><el-link class="content-label" :underline="false"><i class="el-icon-bell" />消息</el-link></el-badge></div>
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <i class="el-icon-user user-avatar" />
          <span>{{ userInfo.realName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>主页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'permission_routes',
      'userInfo'
    ]),
    topLevelRoutes () {
      return this.permission_routes.filter(o => !o.hidden)
    }
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },

    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

$boxItemBgColor: red;

.flex {
  display: flex;
}

.flex-center {
  align-items: center;
  justify-content: center;
}

.avatar-container {
  top: 2px;
}

.navbar {
  height: 50px;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
}

.module-box {
  font-size: 21px;
  vertical-align: middle;
}

.content-label {
  padding: 0 10px;
}

.right-menu {
  padding-right: 20px;
  .user-avatar {
    //font-size: 14px;
  }
}

.box-grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-gap: 20px;
  max-width: 480px;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background-color: rgba($menuActiveText, .9);
    border: 1px solid rgba($menuActiveText, .25);
    padding: 20px;
    box-shadow: 30px 30px 30px -20px rgba(black, .6);

    &:nth-child(odd) {
      animation: 1000ms ease-in-out infinite alternate pulse;
    }

    &:nth-child(even) {
      animation: 1000ms 1000ms ease-in-out infinite alternate pulse;
    }
  }
}

@keyframes pulse {
  to {
    transform: translate3d(0, 0, -60px);
    box-shadow: 15px 15px 20px -20px rgba(black, .8);
  }
}
</style>

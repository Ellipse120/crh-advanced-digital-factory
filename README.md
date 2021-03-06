# 动车组高级修数字化工厂管理系统

> Lerna & Husky & CommitLint & Vue.js & Element UI & WindiCSS & AntV X6 & Axios & CryptoJS & [date-fns](http://10.128.198.185:8080/date-fns-doc/) & Tinymce & VirtualScroll & Iconfont & Permission Control & Lint

**Live demo:** [http://10.128.198.185:8080/train-technical-regulations-management-staging/](http://10.128.198.185:8080/train-technical-regulations-management-staging/)

## [原型地址](http://10.128.198.185:8080/train-technical-regulations-management) `http://10.128.198.185:8080/train-technical-regulations-management`

## Development

```bash
# clone the project
git clone git@10.128.198.29:phm-web/train-technical-regulations-management.git

# enter the project directory
cd train-technical-regulations-management

# (optional) Windows用户需要执行
husky install

# 安装依赖
npm install

# 开发
npm run dev
```

## Production

```bash
# 发布测试环境
npm run build:stage

# 发布生产环境
# `dev` 合并到`master`分支, 禁止反向操作. 然后将master最新的代码及Tag推送
npm run release:minor
or npm run release:patch
or npm run release:major

# 最后在master分支打包发布
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report
```

---

## Git Commit Message Format: `<type>(scope): <short summary>`

```text
type: Commit Type, build | ci | docs | feat | style | fix | perf | refactor | test
scope: Commit Scope, 
short summary: Not Capitalized. No period at the end. Less than 100 characters
```

---

```text
build: Changes that affect the build system or external dependencies(Ex scopes: gulp, npm, broccoli)
ci: Changes to our CI configuration files and scripts(Ex scopes: Circle, BrowserStack)
docs: Documentation only changes or code messages
feat: A new feature
style: improve CSS
fix: A bug fix
perf: A code change that improves performance
refactor: A code change that neither fixes a bug nor adds a feature
test: Adding missing tests or unit test or correcting existing tests
```
---

Copyright (c) 2021-present 申铁信息

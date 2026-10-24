# ZYJ_HAK 的个人主页

这是我的个人主页网站源码，通过 GitHub Pages 自动部署。

**在线访问：** <https://zyj-hak.github.io/Server/>

## 技术栈

- 纯 HTML / CSS / JavaScript，无构建依赖
- GitHub Actions 自动部署（`actions/configure-pages` + `actions/deploy-pages`）
- GitHub API 实时展示公开仓库与统计数据

## 本地预览

直接用浏览器打开 `index.html`，或启动一个本地服务：

```bash
python -m http.server 8000
# 访问 http://localhost:8000
```

## 目录结构

```
├── index.html            # 页面结构
├── css/styles.css        # 样式
├── js/main.js            # 交互与 GitHub 数据
├── assets/               # 头像、图标等静态资源
└── .github/workflows/    # GitHub Pages 部署工作流
```

## 更新网站

修改文件后推送到 `main` 分支，GitHub Actions 会自动重新部署：

```bash
git add .
git commit -m "update site"
git push origin main
```

## 许可

代码部分可自由取用；仓库整体附带 EPL-2.0 许可。

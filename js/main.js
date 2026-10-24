/* ============================================================
   ZYJ_HAK · 个人主页脚本
   - 滚动显现 / 导航状态 / 移动端菜单
   - 打字机标语
   - GitHub API 实时数据（用户信息 + 公开仓库）
   ============================================================ */
(function () {
  "use strict";

  var GITHUB_USER = "ZYJ-HAK";
  var API = "https://api.github.com/users/" + GITHUB_USER;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 导航：滚动阴影 + 当前区块高亮 ---------- */
  var nav = document.getElementById("nav");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 移动端菜单 ---------- */
  var burger = document.querySelector(".nav__burger");
  var mobileMenu = document.getElementById("mobile-menu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      burger.setAttribute("aria-label", open ? "打开菜单" : "关闭菜单");
      mobileMenu.hidden = open;
    });
    mobileMenu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        burger.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
      }
    });
  }

  /* ---------- 滚动显现（带交错延迟） ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  revealEls.forEach(function (el) {
    var d = parseInt(el.getAttribute("data-delay") || "0", 10);
    el.style.setProperty("--d", String(d));
  });

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 打字机标语 ---------- */
  var typerEl = document.getElementById("typer");
  var phrases = [
    "把每一个像素打磨到位",
    "Build · Learn · Share",
    "Hello, World! 很高兴遇见你",
    "保持好奇，持续构建"
  ];

  if (typerEl) {
    if (prefersReducedMotion) {
      typerEl.textContent = phrases[0];
    } else {
      var pi = 0, ci = 0, deleting = false;
      (function tick() {
        var phrase = phrases[pi];
        if (!deleting) {
          ci++;
          typerEl.textContent = phrase.slice(0, ci);
          if (ci === phrase.length) {
            deleting = true;
            setTimeout(tick, 2200);
            return;
          }
          setTimeout(tick, 90 + Math.random() * 60);
        } else {
          ci--;
          typerEl.textContent = phrase.slice(0, ci);
          if (ci === 0) {
            deleting = false;
            pi = (pi + 1) % phrases.length;
            setTimeout(tick, 420);
            return;
          }
          setTimeout(tick, 38);
        }
      })();
    }
  }

  /* ---------- 数字滚动动画 ---------- */
  function countUp(el, target) {
    if (prefersReducedMotion) { el.textContent = String(target); return; }
    var start = null, duration = 900;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function setStat(name, value) {
    var el = document.querySelector('[data-stat="' + name + '"]');
    if (el) countUp(el, value);
  }

  /* ---------- GitHub 数据 ---------- */
  var LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c",
    Python: "#3572A5", Java: "#b07219", "C++": "#f34b7d", C: "#555555",
    Go: "#00ADD8", Rust: "#dea584", Shell: "#89e051", Vue: "#41b883",
    Dockerfile: "#384d54", Makefile: "#427819", Ruby: "#701516"
  };

  function timeAgo(iso) {
    var diff = Date.now() - new Date(iso).getTime();
    var day = 86400000;
    if (diff < day) return "今天更新";
    if (diff < 30 * day) return Math.floor(diff / day) + " 天前更新";
    if (diff < 365 * day) return Math.floor(diff / (30 * day)) + " 个月前更新";
    return Math.floor(diff / (365 * day)) + " 年前更新";
  }

  function repoCard(repo) {
    var langColor = repo.language ? (LANG_COLORS[repo.language] || "#8a8378") : "#8a8378";
    var card = document.createElement("a");
    card.className = "repo-card reveal";
    card.href = repo.html_url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("data-delay", "2");

    var langHtml = repo.language
      ? '<span><i class="repo-card__lang-dot" style="background:' + langColor + '"></i>' + repo.language + "</span>"
      : "";
    var starHtml = repo.stargazers_count > 0
      ? '<span><svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2-6.3-4.6-6.3 4.6L8 13.8 2 9.4h7.6z"/></svg>' + repo.stargazers_count + "</span>"
      : "";

    card.innerHTML =
      '<div class="repo-card__head">' +
        '<svg viewBox="0 0 24 24"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v15A1.5 1.5 0 0 0 2.5 21h19a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 21.5 6H12l-2-3z"/></svg>' +
        "<span>" + repo.name + "</span>" +
      "</div>" +
      '<p class="repo-card__desc">' + (repo.description || "这个仓库还没有描述，去 GitHub 看看详情吧。") + "</p>" +
      '<div class="repo-card__meta">' + langHtml + starHtml +
        "<span>" + timeAgo(repo.pushed_at) + "</span>" +
      "</div>";

    return card;
  }

  function loadGitHubData() {
    if (!window.fetch) return;

    fetch(API)
      .then(function (r) { if (!r.ok) throw new Error("user"); return r.json(); })
      .then(function (user) {
        setStat("repos", user.public_repos);
        setStat("followers", user.followers);
        setStat("following", user.following);
        var since = document.getElementById("github-since");
        if (since && user.created_at) since.textContent = new Date(user.created_at).getFullYear() + " 年";
      })
      .catch(function () { /* 保持占位符 */ });

    var grid = document.getElementById("repo-grid");
    var errorBox = document.getElementById("repo-error");
    if (!grid) return;

    fetch(API + "/repos?sort=pushed&per_page=6")
      .then(function (r) { if (!r.ok) throw new Error("repos"); return r.json(); })
      .then(function (repos) {
        grid.innerHTML = "";
        if (!repos.length) {
          grid.innerHTML = '<p class="repo-card__empty">还没有公开仓库，第一行代码即将落笔。</p>';
          return;
        }
        repos.forEach(function (repo) { grid.appendChild(repoCard(repo)); });
        // 让新卡片也进入显现队列
        grid.querySelectorAll(".reveal").forEach(function (el) {
          el.style.setProperty("--d", el.getAttribute("data-delay") || "0");
          if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            el.classList.add("is-visible");
          } else {
            var io2 = new IntersectionObserver(function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  io2.unobserve(entry.target);
                }
              });
            }, { threshold: 0.12 });
            io2.observe(el);
          }
        });
      })
      .catch(function () {
        grid.innerHTML = "";
        if (errorBox) errorBox.hidden = false;
      });
  }

  loadGitHubData();
})();

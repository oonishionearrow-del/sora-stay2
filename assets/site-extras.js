/* SORA 追加スクリプト（ギャラリーの絞り込み・写真の拡大表示）
   スマホ版トップは他ページを合体表示するため、
   ボタンや写真は後から追加されても動くよう、document への一括監視で処理する。 */

(function () {
    "use strict";

    var lb = null;
    var items = [];
    var index = 0;
    var lastFocus = null;
    var startX = 0;
    var startY = 0;

    function build() {

        if (lb) return;

        lb = document.createElement("div");
        lb.className = "sx-lb";
        lb.hidden = true;
        lb.setAttribute("role", "dialog");
        lb.setAttribute("aria-modal", "true");
        lb.setAttribute("aria-label", "写真の拡大表示");

        lb.innerHTML =
            '<div class="sx-lb-count"></div>' +
            '<button type="button" class="sx-lb-close" aria-label="閉じる">&times;</button>' +
            '<button type="button" class="sx-lb-prev" aria-label="前の写真">&#8249;</button>' +
            "<figure><img alt=\"\"><figcaption></figcaption>" +
            '<a class="sx-lb-open" target="_blank" rel="noopener">元の画像を開く</a></figure>' +
            '<button type="button" class="sx-lb-next" aria-label="次の写真">&#8250;</button>';

        document.body.appendChild(lb);

        lb.addEventListener("click", function (e) {

            var t = e.target;

            if (t.closest(".sx-lb-close")) {
                close();
            } else if (t.closest(".sx-lb-prev")) {
                step(-1);
            } else if (t.closest(".sx-lb-next")) {
                step(1);
            } else if (t === lb || t.tagName === "FIGURE") {
                close();
            }
        });

        lb.addEventListener("touchstart", function (e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        lb.addEventListener("touchend", function (e) {

            var dx = e.changedTouches[0].clientX - startX;
            var dy = e.changedTouches[0].clientY - startY;

            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                step(dx < 0 ? 1 : -1);
            }
        }, { passive: true });
    }

    function show() {

        var link = items[index];
        var thumb = link.querySelector("img");
        var img = lb.querySelector("img");
        var text = thumb ? thumb.alt : "";

        // 先に縮小版を出しておき、大きい写真が読み込めたら差し替える
        img.src = thumb ? (thumb.currentSrc || thumb.src) : link.href;
        img.alt = text;

        var full = new Image();
        full.onload = function () {
            if (items[index] === link) img.src = link.href;
        };
        full.src = link.href;

        lb.querySelector("figcaption").textContent = text;
        lb.querySelector(".sx-lb-count").textContent =
            (index + 1) + " / " + items.length;

        // 1枚だけ（チラシなど）のときは、矢印と枚数を出さず、
        // 細かい文字を読めるよう「元の画像を開く」リンクを出す
        lb.classList.toggle("is-single", items.length === 1);
        lb.querySelector(".sx-lb-open").href = link.href;

        // 前後の写真を先に読み込んでおく
        [index + 1, index - 1].forEach(function (i) {
            var n = items[(i + items.length) % items.length];
            if (n && n !== link) (new Image()).src = n.href;
        });
    }

    function open(list, i, trigger) {

        build();

        items = list;
        index = i;
        lastFocus = trigger || null;

        show();

        lb.hidden = false;
        document.documentElement.classList.add("sx-lock");

        // 表示した直後にふわっと出す
        requestAnimationFrame(function () {
            lb.classList.add("is-open");
        });

        lb.querySelector(".sx-lb-close").focus();
    }

    function close() {

        if (!lb || lb.hidden) return;

        lb.classList.remove("is-open");
        lb.hidden = true;
        document.documentElement.classList.remove("sx-lock");

        if (lastFocus) lastFocus.focus();
    }

    function step(direction) {

        if (items.length < 2) return;

        index = (index + direction + items.length) % items.length;
        show();
    }

    document.addEventListener("click", function (e) {

        if (!e.target.closest) return;

        // 設備・アメニティ：写真の帯をタップして開閉（スマホのみ。PCは全部ひらいたまま）
        var head = e.target.closest(".sx-acc-head");

        if (head) {

            if (!window.matchMedia("(max-width: 800px)").matches) return;

            var acc = head.closest(".sx-acc");
            var isOpen = acc.classList.toggle("is-open");
            head.setAttribute("aria-expanded", isOpen ? "true" : "false");

            return;
        }

        // カテゴリで絞り込み
        var chip = e.target.closest("[data-sx-filter]");

        if (chip) {

            var section = chip.closest(".sx-gallery");
            if (!section) return;

            var filter = chip.getAttribute("data-sx-filter");

            section.querySelectorAll("[data-sx-filter]").forEach(function (c) {
                var on = c === chip;
                c.classList.toggle("is-active", on);
                c.setAttribute("aria-pressed", on ? "true" : "false");
            });

            section.querySelectorAll(".sx-item").forEach(function (item) {
                item.hidden = !(
                    filter === "all" ||
                    item.getAttribute("data-cat") === filter
                );
            });

            // スマホは写真が横1段なので、絞り込んだら先頭に戻す
            var strip = section.querySelector(".sx-grid");
            if (strip) strip.scrollLeft = 0;

            return;
        }

        // 1枚だけの画像（観光ガイドのチラシなど）をタップして拡大
        var zoom = e.target.closest("a.sx-zoom");

        if (zoom) {

            if (e.metaKey || e.ctrlKey || e.shiftKey) return;

            e.preventDefault();
            open([zoom], 0, zoom);

            return;
        }

        // 写真をタップして拡大
        var link = e.target.closest("a.sx-item");

        if (link) {

            if (e.metaKey || e.ctrlKey || e.shiftKey) return;

            e.preventDefault();

            var grid = link.closest(".sx-grid");
            var list = Array.prototype.filter.call(
                grid.querySelectorAll("a.sx-item"),
                function (a) { return !a.hidden; }
            );

            open(list, list.indexOf(link), link);
        }
    });

    document.addEventListener("keydown", function (e) {

        if (!lb || lb.hidden) return;

        if (e.key === "Escape") {
            close();
        } else if (e.key === "ArrowLeft") {
            step(-1);
        } else if (e.key === "ArrowRight") {
            step(1);
        } else if (e.key === "Tab") {

            // 拡大表示の外にフォーカスが出ないようにする
            var buttons = Array.prototype.filter.call(
                lb.querySelectorAll("button"),
                function (b) { return b.offsetParent !== null; }
            );

            if (!buttons.length) return;

            var first = buttons[0];
            var last = buttons[buttons.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

})();

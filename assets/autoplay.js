(function () {
    var videos = document.querySelectorAll('video.video:not([controls])');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        videos.forEach(function (v) { v.controls = true; });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            var v = entry.target;
            if (entry.isIntersecting) {
                var p = v.play();
                if (p && p.catch) p.catch(function () { v.controls = true; });
            } else {
                v.pause();
            }
        });
    }, { threshold: 0.5 });

    videos.forEach(function (v) { observer.observe(v); });
})();

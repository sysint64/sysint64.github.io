(function () {
    var videos = document.querySelectorAll('video.video:not([controls])');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    videos.forEach(function (v) {
        v.muted = true;
        v.defaultMuted = true;
        v.playsInline = true;
    });

    if (reduceMotion) {
        videos.forEach(function (v) {
            v.removeAttribute('autoplay');
            v.pause();
            v.controls = true;
        });
        return;
    }

    function play(v) {
        var p = v.play();
        if (p && p.catch) {
            p.catch(function () {
                v.addEventListener('canplay', function retry() {
                    v.removeEventListener('canplay', retry);
                    var again = v.play();
                    if (again && again.catch) again.catch(function () { v.controls = true; });
                });
            });
        }
    }

    if (!('IntersectionObserver' in window)) {
        videos.forEach(play);
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                play(entry.target);
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.25 });

    videos.forEach(function (v) { observer.observe(v); });
})();

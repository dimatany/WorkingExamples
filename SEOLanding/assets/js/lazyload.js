if (document.readyState !== 'loading' ) {
    lazyLoad();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        lazyLoad();
    });
}
function lazyLoad() {
    let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    let lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-bg"));

    if ("IntersectionObserver" in window) {
        // lazy images
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    if (lazyImage.dataset.srcset) {
                        lazyImage.srcset = lazyImage.dataset.srcset;
                    }
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });

        // lazy backgrounds
        let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyBackground = entry.target;
                    lazyBackground.style.backgroundImage = 'url('+lazyBackground.dataset.src+')';
                    lazyBackgroundObserver.unobserve(lazyBackground);
                }
            });
        });
        lazyBackgrounds.forEach(function(lazyBackground) {
            lazyBackgroundObserver.observe(lazyBackground);
        });
    } else {
        // Possibly fall back to a more compatible method here
    }
}










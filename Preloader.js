document.addEventListener("DOMContentLoaded", () => {
    const preloader =
        document.getElementById("welcome");
    const loadingProgress =
        document.getElementById("loading-progress");
    const loadingNumber =
        document.getElementById("loading-number");

    if (
        !preloader ||
        !loadingProgress ||
        !loadingNumber
    ) {
        return;
    }

    let progress = 0;

    const duration = 2200;

    const startTime = performance.now();

    const clouds =
        document.querySelectorAll(
            'img[src*="Awan"]'
        );

    const butterfly =
        document.querySelector(
            'img[src*="Kupu Kupu"]'
        );

    clouds.forEach((cloud, index) => {
        const direction =
            index === 0 ? -1 : 1;
        cloud.animate(
            [
                {
                    transform: "translateX(0px)"
                },

                {
                    transform:
                        `translateX(${direction * 12}px)`
                },

                {
                    transform: "translateX(0px)"
                }
            ],
            {
                duration: 5000,
                iterations: Infinity,
                easing: "ease-in-out"
            }
        );
    });

    if (butterfly) {
        butterfly.animate(
            [
                {
                    transform:
                        "translateY(0px) rotate(-5deg)"
                },

                {
                    transform:
                        "translateY(-8px) rotate(3deg)"
                },

                {
                    transform:
                        "translateY(0px) rotate(-5deg)"
                }
            ],
            {
                duration: 1800,
                iterations: Infinity,
                easing: "ease-in-out"
            }
        );

    }

    function animateLoading(currentTime) {
        const elapsed =
            currentTime - startTime;

        const progressRatio =
            Math.min(
                elapsed / duration,
                1
            );

        const easedProgress =
            1 - Math.pow(
                1 - progressRatio,
                3
            );

        const percentage =
            Math.round(
                easedProgress * 100
            );

        loadingNumber.textContent =
            `${percentage}%`;

        loadingProgress.style.width =
            `${percentage}%`;

        if (progressRatio < 1) {
            requestAnimationFrame(
                animateLoading
            );
        }
        else {
            finishPreloader();
        }
    }

    function finishPreloader() {
        loadingProgress.style.width =
            "100%";
        loadingNumber.textContent =
            "100%";
        setTimeout(() => {
            slideUp();
        }, 300);
    }

    function slideUp() {
        preloader.style.transition =
            "transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)";
        preloader.style.transform =
            "translateY(-100%)";

        setTimeout(() => {
            window.parent.postMessage(
                "preloader-finished",
                "*"
            );
        }, 1200);
    }
    requestAnimationFrame(
        animateLoading
    );
});
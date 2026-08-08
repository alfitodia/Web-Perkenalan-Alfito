// ================= MODAL =================

const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("videoModal");

// Jalankan hanya jika elemen modal ada di halaman
if (openModal && closeModal && modal) {

    openModal.addEventListener("click", () => {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    });

    closeModal.addEventListener("click", () => {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("flex");
            modal.classList.add("hidden");
        }
    });

}


// ================= WEATHER =================

function loadWeather() {

    const weatherElement = document.getElementById("weather");

    if (!weatherElement) return;

    fetch("https://wttr.in/Malang?format=j1")
        .then(response => response.json())
        .then(data => {

            const temp = data.current_condition[0].temp_C;
            const weather = data.current_condition[0].weatherDesc[0].value;

            weatherElement.textContent =
                `Cuaca di Malang: ${weather} (${temp}°C)`;

        })
        .catch(() => {

            weatherElement.textContent =
                "Cuaca tidak tersedia";

        });

}

loadWeather();

setInterval(loadWeather, 600000);

// ================= Transisi Ketik =================
const texts = [
    "Frontend Developer",
    "Video Editor/3D Designer",
    "Mathematics Student",
    "Entrepreneur/Business Owner",
    "Internet of Things Developer",
    "Investor"
];

const typingText = document.getElementById("typing-text");

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentText = texts[textIndex];

    if (!isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500); 
            return;
        }
    } else {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 50 : 100);
}

typeEffect();

// ================= SKILL DAN ACHIEVEMENT =================

const btnSkill = document.getElementById("btnSkill");
const btnAchievement = document.getElementById("btnAchievement");

const skillContent = document.getElementById("skillContent");
const achievementContent = document.getElementById("achievementContent");

// --- HAPUS class hidden dan atur display ---
skillContent.classList.remove('hidden');
achievementContent.classList.remove('hidden');
skillContent.style.display = 'block';
achievementContent.style.display = 'block';

// --- Buat wrapper slider ---
const sliderWrapper = document.createElement("div");
sliderWrapper.style.display = "grid";
sliderWrapper.style.gridTemplateColumns = "1fr";
sliderWrapper.style.position = "relative";
sliderWrapper.style.overflow = "hidden";

const parent = skillContent.parentNode;
parent.insertBefore(sliderWrapper, skillContent);
sliderWrapper.appendChild(skillContent);
sliderWrapper.appendChild(achievementContent);

// Atur posisi dan transisi
[skillContent, achievementContent].forEach(el => {
  el.style.gridColumn = "1 / 2";
  el.style.gridRow = "1 / 2";
  el.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  el.style.willChange = "transform, opacity";
});

// State awal: skill tampil, achievement di luar kanan
skillContent.style.transform = "translateX(0)";
skillContent.style.opacity = "1";
skillContent.style.pointerEvents = "auto";

achievementContent.style.transform = "translateX(100%)";
achievementContent.style.opacity = "0";
achievementContent.style.pointerEvents = "none";

// Class aktif tombol
const activeClass = [
  "bg-black/25",
  "border",
  "border-black/20",
  "backdrop-blur-[20px]"
];

btnSkill.classList.add(...activeClass);
btnAchievement.classList.remove(...activeClass);

// --- Fungsi pindah panel ---
function switchPanel(from, to, direction) {
  // Set posisi awal untuk to
  if (direction === 'left') {
    to.style.transform = "translateX(100%)";
  } else {
    to.style.transform = "translateX(-100%)";
  }
  to.style.opacity = "0";
  to.style.pointerEvents = "none";

  // Force reflow
  void from.offsetWidth;

  // Animasi keluar untuk from
  if (direction === 'left') {
    from.style.transform = "translateX(-100%)";
  } else {
    from.style.transform = "translateX(100%)";
  }
  from.style.opacity = "0";
  from.style.pointerEvents = "none";

  // Animasi masuk untuk to
  to.style.transform = "translateX(0)";
  to.style.opacity = "1";
  to.style.pointerEvents = "auto";
}

// --- Event tombol ---
btnSkill.addEventListener("click", () => {
  // Jika achievement sedang tampil, pindah ke skill
  if (achievementContent.style.opacity === "1" || achievementContent.style.transform === "translateX(0)") {
    switchPanel(achievementContent, skillContent, 'right');
    btnSkill.classList.add(...activeClass);
    btnAchievement.classList.remove(...activeClass);
  }
});

btnAchievement.addEventListener("click", () => {
  if (skillContent.style.opacity === "1" || skillContent.style.transform === "translateX(0)") {
    switchPanel(skillContent, achievementContent, 'left');
    btnAchievement.classList.add(...activeClass);
    btnSkill.classList.remove(...activeClass);
  }
});


// ================= ACHIEVEMENT SLIDE (PAGINATION) =================

const cards = document.querySelectorAll(".certificate-card");
const cardsPerPage = 6;
let currentPage = 1;
const grid = document.getElementById("certificateGrid");

// Bungkus grid dengan wrapper overflow-hidden
const gridWrapper = document.createElement("div");
gridWrapper.style.overflow = "hidden";
grid.parentNode.insertBefore(gridWrapper, grid);
gridWrapper.appendChild(grid);

// Atur transisi grid
grid.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
grid.style.willChange = "transform, opacity";
grid.style.display = "grid";
grid.style.gridTemplateColumns = "repeat(3, 1fr)";
grid.style.gap = "1.25rem";

// --- Fungsi pindah halaman ---
function showPage(page, direction) {
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  if (page < 1 || page > totalPages) return;
  if (page === currentPage) return;

  let outTransform, inTransform;
  if (page > currentPage) {
    outTransform = "translateX(-100%)";
    inTransform = "translateX(0%)";
  } else {
    outTransform = "translateX(100%)";
    inTransform = "translateX(0%)";
  }

  // Animasi keluar
  grid.style.transform = outTransform;
  grid.style.opacity = "0";

  const onTransitionEnd = () => {
    grid.removeEventListener('transitionend', onTransitionEnd);

    // Update kartu
    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    cards.forEach((card, index) => {
      card.style.display = (index >= start && index < end) ? 'flex' : 'none';
    });

    // Animasi masuk
    grid.style.transform = inTransform;
    grid.style.opacity = "1";

    const onInEnd = () => {
      grid.removeEventListener('transitionend', onInEnd);
      grid.style.transform = "";
      grid.style.opacity = "";
    };
    grid.addEventListener('transitionend', onInEnd);
  };

  grid.addEventListener('transitionend', onTransitionEnd);
  void grid.offsetWidth;
  grid.style.transform = outTransform;
  grid.style.opacity = "0";

  currentPage = page;
  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  document.getElementById("pageNumber").innerText = currentPage;
  document.getElementById("btnPrev").disabled = currentPage === 1;
  document.getElementById("btnNext").disabled = currentPage === totalPages;
}

document.getElementById("btnPrev").onclick = () => {
  if (currentPage > 1) showPage(currentPage - 1);
};

document.getElementById("btnNext").onclick = () => {
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  if (currentPage < totalPages) showPage(currentPage + 1);
};

function initPage() {
  const start = 0;
  const end = cardsPerPage;
  cards.forEach((card, index) => {
    card.style.display = (index >= start && index < end) ? 'flex' : 'none';
  });
  currentPage = 1;
  updatePagination();
  grid.style.transform = "";
  grid.style.opacity = "";
}
initPage();

//--------------- Animasi Reveal ---------------------
const reveals = document.querySelectorAll(".reveal");

reveals.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(80px) scale(.97)";
    el.style.filter = "blur(10px)";
    el.style.transition = `
        opacity .8s cubic-bezier(.22,1,.36,1),
        transform .8s cubic-bezier(.22,1,.36,1),
        filter .8s cubic-bezier(.22,1,.36,1)
    `;
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0) scale(1)";
            entry.target.style.filter = "blur(0)";
        }

    });
}, {
    threshold: 0.15
});

reveals.forEach(el => observer.observe(el));

(function () {
    const navigation =
        performance.getEntriesByType("navigation")[0];

    const navigationType =
        navigation ? navigation.type : "navigate";

    const referrer =
        document.referrer;

    let fromInternalPage = false;

    if (referrer) {
        try {
            const previousURL =
                new URL(referrer);
            fromInternalPage =
                previousURL.origin === window.location.origin;
        } catch (error) {
            fromInternalPage = false;
        }
    }

    let shouldShowPreloader = true;

    if (fromInternalPage) {
        shouldShowPreloader = false;
    }

    if (navigationType === "reload") {
        shouldShowPreloader = true;
    }

    if (!shouldShowPreloader) {
        return;
    }

    const preloaderFrame =
        document.createElement("iframe");

    preloaderFrame.id =
        "preloader-frame";

    preloaderFrame.src =
        "./preloader.html";

    preloaderFrame.className = `
        fixed
        inset-0
        z-[99999]
        h-screen
        w-full
        border-0
    `;

    document.body.prepend(
        preloaderFrame
    );

    window.addEventListener(
        "message",
        function (event) {
            if (
                event.data !==
                "preloader-finished"
            ) {
                return;
            }

            const frame =
                document.getElementById(
                    "preloader-frame"
                );

            if (!frame) {
                return;
            }

            frame.style.pointerEvents =
                "none";

            setTimeout(() => {
                frame.remove();
            }, 100);
        }
    );
})();
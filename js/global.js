document.addEventListener("DOMContentLoaded", function () {
  const carouselElement = document.getElementById("heroRidersCarousel");
  const segments = document.querySelectorAll(".hero-bar-segment");
  const slideInterval = 5000; // Match this with your Bootstrap carousel interval if custom set (default is usually 5000ms)
  
  let startTime = null;
  let animationFrameId = null;

  if (carouselElement && segments.length > 0) {
    
    // Function to run the animation on the active segment bar
    function runProgressBar(activeIndex) {
      cancelAnimationFrame(animationFrameId);

      // 1. Immediately style past bars as full (100%) and future bars as empty (0%)
      segments.forEach((segment, index) => {
        const fill = segment.querySelector('.hero-bar-fill');
        if (index < activeIndex) {
          fill.style.transition = 'width 0.3s ease';
          fill.style.width = '100%';
        } else if (index > activeIndex) {
          fill.style.transition = 'none';
          fill.style.width = '0%';
        }
      });

      // 2. Animate the current active bar fill smoothly
      const activeFill = segments[activeIndex].querySelector('.hero-bar-fill');
      activeFill.style.transition = 'width 0.1s linear';
      startTime = performance.now();

      function animateActiveBar(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min((elapsed / slideInterval) * 100, 100);
        
        activeFill.style.width = progress + '%';
        
        if (progress < 100) {
          animationFrameId = requestAnimationFrame(animateActiveBar);
        }
      }

      animationFrameId = requestAnimationFrame(animateActiveBar);
    }

    // 3. Listen to Bootstrap's native sliding event to sync progress bars instantly on manual/auto transitions
    carouselElement.addEventListener("slide.bs.carousel", function (event) {
      const nextIndex = event.to; // Bootstrap provides zero-indexed destination slide integer via event.to
      runProgressBar(nextIndex);
    });

    // 4. Initialize progress bar on initial page load for the first active slide (index 0)
    runProgressBar(0);
  }
});


document.addEventListener("DOMContentLoaded", function () {
  // Capture instances of relevant DOM target selectors
  const carouselElement = document.getElementById("heroRidersCarousel");
  const currentSlideText = document.getElementById("carousel-current-slide");
  const totalSlidesText = document.getElementById("carousel-total-slides");

  if (carouselElement) {
    // 1. Calculate dynamic total item indices active in pool
    const totalItems = carouselElement.querySelectorAll(".carousel-item").length;
    totalSlidesText.textContent = totalItems < 10 ? `0${totalItems}` : totalItems;

    // 2. Bind custom slide listener tracking layout progression pipeline updates
    carouselElement.addEventListener("slide.bs.carousel", function (event) {
      // event.to extracts the index integer destination (zero-indexed map)
      const nextSlideIndex = event.to + 1;
      
      // Update string representation output values safely format styled padded indicators
      currentSlideText.textContent = nextSlideIndex < 10 ? `0${nextSlideIndex}` : nextSlideIndex;
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Select all individual category action cards
  const categoryCards = document.querySelectorAll(".category-card");

  categoryCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Extract target metadata string bound to data token attribute
      const selectedCategory = this.getAttribute("data-category");
      
      // Simulate click router handling sequence
      console.log(`Navigating to collection routing path: /collections/${selectedCategory}`);
      
      // Real deployment application handling switch option code standard:
      // window.location.href = `/collections/${selectedCategory}`;
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const callBtn = document.getElementById("consultation-cta");

  if (callBtn) {
    callBtn.addEventListener("click", function () {
      const clickTime = new Date().toLocaleTimeString();
      // Internal telemetry pipeline log tracking output
      console.log(`[Interaction Analytic]: Live support call routing initiated via banner element at ${clickTime}.`);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Target all active touring item card wrappers
  const touringCards = document.querySelectorAll(".touring-card");

  touringCards.forEach((card) => {
    card.addEventListener("click", function () {
      const categorySlug = this.getAttribute("data-category");
      
      console.log(`[Router Tracking Log]: Opening accessories page route target: /accessories/${categorySlug}`);
      
      // Ready for production integration path:
      // window.location.href = `/accessories/${categorySlug}`;
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Pull collection nodes matching target category grid cards
  const bikeFitCards = document.querySelectorAll(".fitment-card");

  bikeFitCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Capture target data configuration text tokens
      const bikeModel = this.getAttribute("data-bike");
      
      console.log(`[Filter Pipeline Target Triggered]: Routing collection views to match exact query parameter: /shop?fitment=${bikeModel}`);
      
      // Standard application navigation execution example line:
      // window.location.href = `/shop?fitment=${bikeModel}`;
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Capture node lists corresponding to secondary layout components
  const activeMiniCards = document.querySelectorAll(".protection-mini-card");

  activeMiniCards.forEach((miniTile) => {
    miniTile.addEventListener("click", function (e) {
      // Pull context heading title mapping values
      const targetLabel = this.querySelector("h3").textContent;
      console.log(`[Telemetry Pipeline Log]: Redirect context requested targeting sub-route grid item: ${targetLabel}`);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Capture all elements targeting performance row card components
  const performanceCards = document.querySelectorAll(".performance-card");

  performanceCards.forEach((card) => {
    card.addEventListener("click", function () {
      const selectedSlug = this.getAttribute("data-category");
      
      console.log(`[Router Tracking Log]: Routing performance component filter targets: /parts/${selectedSlug}`);
      
      // Standard layout redirect path template:
      // window.location.href = `/parts/${selectedSlug}`;
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const codeStrips = document.querySelectorAll(".coupon-code-strip");

  codeStrips.forEach((strip) => {
    strip.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevents layout bubbling conflicts
      
      const targetCode = this.getAttribute("data-code");
      const textContainer = this.querySelector(".code-label");
      
      if (!targetCode) return;

      // Copy text code pipeline
      navigator.clipboard.writeText(targetCode).then(() => {
        const originalText = textContainer.textContent;
        
        // Update styling state dynamically
        textContainer.textContent = "📋 COPIED!";
        this.style.transform = "scale(0.98)";
        
        // Restore layout text safely after timeframe delay
        setTimeout(() => {
          textContainer.textContent = originalText;
          this.style.transform = "scale(1)";
        }, 1800);
      }).catch(err => {
        console.error("Critical copy execution failure pipeline output: ", err);
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Capture clicks globally on the inner dynamic cards inside the marquee
  const brandTiles = document.querySelectorAll(".brand-card-inner");

  brandTiles.forEach((tile) => {
    tile.addEventListener("click", function () {
      const selectedBrand = this.closest(".brand-card-item").getAttribute("data-brand");
      
      console.log(`[Marquee Router]: Navigating to brand channel collection page /shop?brand=${selectedBrand}`);
      
      // window.location.href = `/shop?brand=${selectedBrand}`;
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const newsForm = document.getElementById("footer-newsletter");

  if (newsForm) {
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault(); 
      
      const emailField = this.querySelector('input[type="email"]');
      const submitBtn = this.querySelector(".btn-subscribe");
      
      if (!emailField || !emailField.value) return;

      console.log(`[Newsletter Telemetry Pipeline]: Registering new user email endpoint target: ${emailField.value}`);

      const nativeLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "SAVED! ✓";
      
      setTimeout(() => {
        emailField.value = "";
        submitBtn.disabled = false;
        submitBtn.innerHTML = nativeLabel;
      }, 2000);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNavMenu = document.getElementById("mobileNavMenu");

  if (mobileMenuBtn && mobileNavMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileNavMenu.classList.toggle("active");
      
      // Optional: Animate hamburger bars into an 'X' shape
      mobileMenuBtn.classList.toggle("open");
    });
  }
});
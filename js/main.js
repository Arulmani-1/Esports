/**
 * ESPORTS PRO ARENA - MAIN JAVASCRIPT
 * Handles global interactivity across all pages.
 */

document.addEventListener('DOMContentLoaded', () => {

  // GLOBAL BACKGROUND VIDEO PLAYLIST
  const bgVideos = [
    'assets/videos/enaku_Esports_animation_video.mp4',
    'assets/videos/enaku_Esports_video_generated.mp4',
    'assets/videos/vid_0.mp4',
    'assets/videos/vid_1.mp4',
    'assets/videos/vid_3.mp4'
  ];
  let currentVideoIndex = Math.floor(Math.random() * bgVideos.length);

  let bgVideo = document.querySelector('.page-bg-video');
  if (!bgVideo) {
    if (!document.getElementById('global-bg-video')) {
      bgVideo = document.createElement('video');
      bgVideo.id = 'global-bg-video';
      bgVideo.className = 'page-bg-video';
      document.body.insertBefore(bgVideo, document.body.firstChild);
    } else {
      bgVideo = document.getElementById('global-bg-video');
    }
  }

  if (bgVideo) {
    const source = bgVideo.querySelector('source');
    if (source) source.remove();
    
    bgVideo.removeAttribute('loop');
    bgVideo.setAttribute('autoplay', '');
    bgVideo.setAttribute('muted', '');
    bgVideo.setAttribute('playsinline', '');
    bgVideo.muted = true;
    
    bgVideo.src = bgVideos[currentVideoIndex];
    bgVideo.load();
    bgVideo.play().catch(e => console.warn("Autoplay blocked:", e));

    bgVideo.addEventListener('ended', () => {
      currentVideoIndex = (currentVideoIndex + 1) % bgVideos.length;
      bgVideo.src = bgVideos[currentVideoIndex];
      bgVideo.load();
      bgVideo.play().catch(e => console.warn("Autoplay blocked:", e));
    });
  }

  // 0. DYNAMIC COMPONENT LOADER (Navbar & Footer)
  const loadComponents = async () => {
    try {
      const navPlaceholder = document.getElementById('navbar-placeholder');
      if (navPlaceholder) {
        const navRes = await fetch('navbar.html');
        if (navRes.ok) navPlaceholder.innerHTML = await navRes.text();
      }

      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (footerPlaceholder) {
        const footRes = await fetch('footer.html');
        if (footRes.ok) footerPlaceholder.innerHTML = await footRes.text();
      }
      
      initHeaderScripts();
    } catch(err) {
      console.warn("Could not load components dynamically. Use a local server (like Live Server) to bypass CORS.", err);
    }
  };

  const initHeaderScripts = () => {
    // Prevent hard reloads when clicking links pointing to the current page
    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const currentUrl = window.location.href.split('#')[0];
        const linkUrl = link.href.split('#')[0];
        if (currentUrl === linkUrl && !link.hasAttribute('download')) {
          e.preventDefault();
        }
      });
    });

    // CUSTOM CURSOR HOVER EVENTS (re-bind for new header elements)
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
      document.querySelectorAll('a, button, .btn, input, textarea, select').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
    }

    // STICKY HEADER
    const header = document.querySelector('header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('sticky');
        else header.classList.remove('sticky');
      });
    }

    // MOBILE SIDEBAR
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.mobile-sidebar');
    const closeBtn = document.querySelector('.mobile-sidebar .close-btn');

    if (menuToggle && sidebar && closeBtn) {
      menuToggle.addEventListener('click', () => sidebar.classList.add('active'));
      closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));
    }
  };

  // Run the loader
  loadComponents();



  // 5. BACK TO TOP BUTTON
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. INITIALIZE AOS ANIMATIONS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }

  // 7. PARTICLES BACKGROUND INIT
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS("particles-js", {
      "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#FF1744" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#FF1744", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": true, "mode": "grab" },
          "onclick": { "enable": true, "mode": "push" },
          "resize": true
        },
        "modes": {
          "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
          "push": { "particles_nb": 4 }
        }
      },
      "retina_detect": true
    });
  }

  // 8. ANIMATED COUNTERS (For Statistics)
  const counters = document.querySelectorAll('.counter-value');
  if (counters.length > 0) {
    const animateCounters = () => {
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const speed = 200; // lower = faster
        const inc = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(animateCounters, 10);
        } else {
          counter.innerText = target;
        }
      });
    }

    // Intersection Observer to start counters when visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(counters[0].parentElement);
  }

  // 9. COUNTDOWN TIMER (For Matches)
  const countdownElement = document.getElementById('match-countdown');
  if (countdownElement) {
    const countDownDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000); // 3 days from now
    const x = setInterval(function() {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownElement.innerHTML = `
        <div class="time-box"><span>${days}</span><small>Days</small></div>
        <div class="time-box"><span>${hours}</span><small>Hours</small></div>
        <div class="time-box"><span>${minutes}</span><small>Mins</small></div>
        <div class="time-box"><span>${seconds}</span><small>Secs</small></div>
      `;

      if (distance < 0) {
        clearInterval(x);
        countdownElement.innerHTML = "MATCH STARTED";
      }
    }, 1000);
  }

  // 10. PRODUCT FILTERS (Shop / Portfolio)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');

  if (filterBtns.length > 0 && filterItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        filterItems.forEach(item => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // 11. SHOPPING CART & WISHLIST LOGIC (Basic implementation)
  const cartBtns = document.querySelectorAll('.add-to-cart-btn');
  const cartCounter = document.querySelector('.cart-count');
  let cartCount = 0;

  if (cartBtns.length > 0 && cartCounter) {
    cartBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        cartCount++;
        cartCounter.innerText = cartCount;
        alert('Item added to cart!');
      });
    });
  }

  const wishlistBtns = document.querySelectorAll('.add-to-wishlist-btn');
  if (wishlistBtns.length > 0) {
    wishlistBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.classList.toggle('active');
        if (btn.classList.contains('active')) {
          btn.style.color = '#FF1744'; // turn red
        } else {
          btn.style.color = '';
        }
      });
    });
  }

  // 12. LIGHTBOX GALLERY
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    // This assumes a modal with id 'lightbox-modal' and image 'lightbox-img' exists on portfolio
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightboxModal && lightboxImg && lightboxClose) {
      galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const imgSrc = item.getAttribute('href') || item.querySelector('img').getAttribute('src');
          lightboxImg.src = imgSrc;
          lightboxModal.style.display = 'flex';
          setTimeout(() => { lightboxModal.style.opacity = '1'; }, 10);
        });
      });

      lightboxClose.addEventListener('click', () => {
        lightboxModal.style.opacity = '0';
        setTimeout(() => { lightboxModal.style.display = 'none'; }, 300);
      });
    }
  }

  // 13. HERO SLIDER
  const slides = document.querySelectorAll('.slide');
  const nextBtn = document.querySelector('.next-arrow');
  const prevBtn = document.querySelector('.prev-arrow');
  const dots = document.querySelectorAll('.dot');
  
  if (slides.length > 0) {
    // Typewriter effect setup for slide titles
    const slideTitles = document.querySelectorAll('.slide-title');
    slideTitles.forEach(title => {
      const text = title.textContent.trim();
      title.innerHTML = '';
      let charIndex = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char.trim() === '') {
          title.innerHTML += '&nbsp;';
        } else {
          title.innerHTML += `<span style="--char-index: ${charIndex}" class="char-anim">${char}</span>`;
          charIndex++;
        }
      }
    });

    let currentSlide = 0;
    const totalSlides = slides.length;
    let sliderInterval;

    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[index].classList.add('active');
      if (dots[index]) {
        dots[index].classList.add('active');
      }
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    };

    const startSlider = () => {
      sliderInterval = setInterval(nextSlide, 7000);
    };

    const resetSlider = () => {
      clearInterval(sliderInterval);
      startSlider();
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlider();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlider();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
        resetSlider();
      });
    });

    startSlider();
  }

  // CUSTOM CURSOR
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, button, .btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

});

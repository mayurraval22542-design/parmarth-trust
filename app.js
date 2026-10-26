/* ==========================================================================
   Parmarth Education & Charitable Trust — Custom Javascript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. SITE HEADER SCROLL LOGIC
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. MOBILE NAVIGATION MENU TOGGLE & BACKDROP
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-item');

  // Create mobile backdrop if not present
  let navBackdrop = document.querySelector('.nav-backdrop');
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
  }

  const closeMobileNav = () => {
    if (navToggle) navToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('nav-open');
  };

  const openMobileNav = () => {
    if (navToggle) navToggle.classList.add('active');
    if (navMenu) navMenu.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('nav-open');
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    navBackdrop.addEventListener('click', closeMobileNav);

    // Close when clicking any nav item or button inside drawer
    navMenu.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileNav();
      }
    });

    // Reset when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
        closeMobileNav();
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Update active nav class
      navLinks.forEach(l => l.classList.remove('active-page'));
      link.classList.add('active-page');
    });
  });

  // 3. MULTI-PAGE NAVIGATION ACTIVE HIGHLIGHT
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active-page');
    } else {
      link.classList.remove('active-page');
    }
  });

  // 4. METRICS BAR COUNT-UP ANIMATION
  const statsSection = document.querySelector('.impact-metrics-section');
  const numbers = document.querySelectorAll('.metric-number');
  let animated = false;

  const animateCounters = () => {
    numbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-target'), 10);
      if (isNaN(target)) return; // skip 100% since it is static

      let count = 0;
      const duration = 2000; // 2 seconds
      const speed = Math.max(1, Math.round(target / (duration / 16))); // ~60fps refresh rate

      const updateCount = () => {
        count += speed;
        if (count >= target) {
          num.innerText = target;
        } else {
          num.innerText = count;
          requestAnimationFrame(updateCount);
        }
      };

      updateCount();
    });
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animateCounters();
        animated = true;
      }
    });
  }, { threshold: 0.1 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // 5. GENERAL MODAL OPEN/CLOSE LOGIC
  const modals = document.querySelectorAll('.modal-overlay');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }
  };

  const closeModal = (modal) => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scroll

    // Stop founder mock video/slideshow if open
    if (modal.id === 'story-modal') {
      resetStorySlideshow();
    }
  };

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Bind trigger buttons to modals
  document.querySelectorAll('.open-donate-modal').forEach(btn => {
    btn.addEventListener('click', () => openModal('donation-modal'));
  });

  document.querySelectorAll('.open-visit-modal').forEach(btn => {
    btn.addEventListener('click', () => openModal('visit-modal'));
  });

  document.querySelectorAll('.open-story-modal').forEach(btn => {
    btn.addEventListener('click', () => openModal('story-modal'));
  });

  document.querySelectorAll('.open-full-gallery').forEach(btn => {
    btn.addEventListener('click', () => openModal('full-gallery-modal'));
  });

  document.querySelectorAll('.open-programs-details').forEach(btn => {
    btn.addEventListener('click', () => openModal('programs-modal'));
  });

  // Bind trigger buttons for School Project Popup
  document.querySelectorAll('.open-school-modal').forEach(btn => {
    btn.addEventListener('click', () => openModal('school-project-modal'));
  });

  // Seamless transition from School Project Modal to Donation Modal
  window.supportSchoolProject = function() {
    const schoolModal = document.getElementById('school-project-modal');
    if (schoolModal) closeModal(schoolModal);
    setTimeout(() => {
      openModal('donation-modal');
    }, 250);
  };

  // Automatically show Current School Project Popup 5 seconds after page loads (if user isn't browsing nav)
  setTimeout(() => {
    const activeModal = document.querySelector('.modal-overlay.active');
    const isNavOpen = document.querySelector('.nav-menu.active');
    if (!activeModal && !isNavOpen) {
      openModal('school-project-modal');
    }
  }, 5000);

  document.querySelectorAll('.open-stories-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('stories-modal');
    });
  });

  // WhatsApp Message Scheme Customization
  const whatsappBaseLink = "https://wa.me/919904525625?text=";

  document.querySelectorAll('.open-scheme-donate').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const schemeName = btn.getAttribute('data-scheme');
      const amount = btn.getAttribute('data-amount');

      // Update WhatsApp link in donation modal
      const waBtn = document.querySelector('.modal-wa-btn');
      if (waBtn) {
        const customMessage = `Hello Parmarth Trust, I have made a bank transfer donation of ₹${amount} towards "${schemeName}". Please find the transaction details screenshot attached for generating the official receipt.`;
        waBtn.setAttribute('href', whatsappBaseLink + encodeURIComponent(customMessage));
      }

      openModal('donation-modal');
    });
  });

  // 6. FOUNDER MOCK VIDEO STORY SLIDESHOW
  const videoOverlay = document.querySelector('.video-overlay-details');
  const videoSlides = document.querySelector('.video-slides-wrapper');
  const startBtn = document.querySelector('.start-mock-video');
  const slides = document.querySelectorAll('.video-slide');
  const prevSlideBtn = document.querySelector('.vid-prev-btn');
  const nextSlideBtn = document.querySelector('.vid-next-btn');
  const slideNumText = document.querySelector('.vid-slide-num');

  let currentSlide = 0;

  const showSlide = (index) => {
    if (!slides.length || !slideNumText) return;
    slides.forEach(slide => slide.classList.remove('active'));

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    slideNumText.innerText = `${currentSlide + 1} / ${slides.length}`;
  };

  const resetStorySlideshow = () => {
    if (videoOverlay) videoOverlay.classList.remove('hidden');
    if (videoSlides) videoSlides.classList.add('hidden');
    currentSlide = 0;
  };

  if (startBtn && videoOverlay && videoSlides) {
    startBtn.addEventListener('click', () => {
      videoOverlay.classList.add('hidden');
      videoSlides.classList.remove('hidden');
      showSlide(0);
    });
  }

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  }
  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => showSlide(currentSlide + 1));
  }


  // 7. LIGHTBOX & FULL GALLERY SYSTEM
  // Complete 25 images array from the public/gallary directory with categories
  const galleryImages = [
    { src: 'public/gallary/IMG-20221231-WA0068.jpg', caption: 'Focused Learning and Study Session', category: 'learning' },
    { src: 'public/gallary/1732722407597.jpg', caption: 'Smiling Together in Classroom activities', category: 'learning' },
    { src: 'public/gallary/IMG-20250117-WA0013.jpg', caption: 'Outdoor Physical Activities and Recreation', category: 'activities' },
    { src: 'public/gallary/IMG_20240107_112642.jpg', caption: 'Music and Art Therapy Session', category: 'learning' },
    { src: 'public/gallary/IMG_20230826_172203.jpg', caption: 'Yoga and Stretching Exercise Routine', category: 'activities' },
    { src: 'public/gallary/IMG-20230701-WA0015.jpg', caption: 'Group Picnic and Social Gathering Outing', category: 'activities' },
    { src: 'public/gallary/1732722584748.jpg', caption: 'Children drawing and crafting session', category: 'learning' },
    { src: 'public/gallary/1734661857876.jpg', caption: 'Life and daily routines at the sanctuary', category: 'activities' },
    { src: 'public/gallary/1754811842888.jpg', caption: 'Therapy sessions to build sensory motor skills', category: 'activities' },
    { src: 'public/gallary/1754811842948.jpg', caption: 'Cognitive developmental lessons', category: 'learning' },
    { src: 'public/gallary/1759839690734.jpg', caption: 'Festival Celebrations at Parmarth Trust', category: 'celebrations' },
    { src: 'public/gallary/IMG-20230420-WA0024.jpg', caption: 'Daily classroom interaction', category: 'learning' },
    { src: 'public/gallary/IMG-20250117-WA0010.jpg', caption: 'Drawing and creative expressions', category: 'learning' },
    { src: 'public/gallary/IMG_0147.JPG', caption: 'Caring environment for full time residential kids', category: 'activities' },
    { src: 'public/gallary/IMG_20221231_181800_1.jpg', caption: 'Interactive playtime activities', category: 'activities' },
    { src: 'public/gallary/IMG_20230218_101321_1.jpg', caption: 'Structured exercises for physical fitness', category: 'activities' },
    { src: 'public/gallary/IMG_20230330_190807.jpg', caption: 'Special educators taking personalized classes', category: 'learning' },
    { src: 'public/gallary/IMG_20230730_182724_1.jpg', caption: 'Hygienic wholesome kitchen meals', category: 'activities' },
    { src: 'public/gallary/IMG_20230902_192813.jpg', caption: 'Group drawing classes in the courtyard', category: 'activities' },
    { src: 'public/gallary/IMG_20231022_180454_1.jpg', caption: 'Cultural events and kids performing dances', category: 'celebrations' },
    { src: 'public/gallary/IMG_20240826_130554.jpg', caption: 'Developing attention focus through block games', category: 'learning' },
    { src: 'public/gallary/IMG_20240901_223538.jpg', caption: 'Fun games and kids laughing', category: 'activities' },
    { src: 'public/gallary/IMG_20240929_093428.jpg', caption: 'Ganesh Puja and spiritual integration', category: 'celebrations' },
    { src: 'public/gallary/IMG_20250507_085631.jpg', caption: 'Gathering for morning prayers', category: 'celebrations' },
    { src: 'public/gallary/IMG_20250508_110936.jpg', caption: 'Warm care and personalized guidance', category: 'activities' }
  ];

  // Populate Full Gallery modal list with Pagination
  const fullImagesContainer = document.getElementById('full-images-container');
  const paginationCtrls = document.getElementById('gallery-pagination-ctrls');
  const pagesList = document.getElementById('gallery-pages-list');
  const prevPageBtn = document.getElementById('gallery-prev-page-btn');
  const nextPageBtn = document.getElementById('gallery-next-page-btn');

  if (fullImagesContainer && paginationCtrls && pagesList && prevPageBtn && nextPageBtn) {
    const itemsPerPage = 8; // less compact, 8 images per page is clean!
    let activePage = 1;
    let currentFilter = 'all';

    // Get current filtered images list
    const getFilteredImages = () => {
      if (currentFilter === 'all') {
        return galleryImages;
      }
      return galleryImages.filter(img => img.category === currentFilter);
    };

    // Render the grid for active page
    const renderGalleryPage = () => {
      fullImagesContainer.innerHTML = '';
      const filtered = getFilteredImages();
      
      const startIndex = (activePage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const visibleItems = filtered.slice(startIndex, endIndex);

      visibleItems.forEach((imgObj) => {
        // Find real index in global galleryImages array for lightbox
        const realIdx = galleryImages.findIndex(img => img.src === imgObj.src);

        const item = document.createElement('div');
        item.className = 'full-gallery-item';
        item.setAttribute('data-index', realIdx);

        // Transition opacity on load
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';

        const img = document.createElement('img');
        img.src = imgObj.src;
        img.alt = imgObj.caption;
        img.loading = 'lazy';

        const caption = document.createElement('div');
        caption.className = 'full-gallery-item-caption';
        caption.innerText = imgObj.caption;

        item.appendChild(img);
        item.appendChild(caption);
        fullImagesContainer.appendChild(item);

        // Trigger load transition
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 30);
      });

      renderPaginationControls(filtered.length);
    };

    // Render page numbers and state
    const renderPaginationControls = (totalItems) => {
      pagesList.innerHTML = '';
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      if (totalPages <= 1) {
        paginationCtrls.style.display = 'none';
        return;
      }

      paginationCtrls.style.display = 'flex';

      // Prev Button State
      prevPageBtn.disabled = activePage === 1;

      // Next Button State
      nextPageBtn.disabled = activePage === totalPages;

      // Create page numbers
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-page-num ${i === activePage ? 'active' : ''}`;
        pageBtn.innerText = i;
        pageBtn.addEventListener('click', () => {
          activePage = i;
          renderGalleryPage();
          // Scroll container to top smoothly on page transition
          fullImagesContainer.scrollTop = 0;
        });
        pagesList.appendChild(pageBtn);
      }
    };

    // Next/Prev click handlers
    prevPageBtn.addEventListener('click', () => {
      if (activePage > 1) {
        activePage--;
        renderGalleryPage();
        fullImagesContainer.scrollTop = 0;
      }
    });

    nextPageBtn.addEventListener('click', () => {
      const filteredCount = getFilteredImages().length;
      const totalPages = Math.ceil(filteredCount / itemsPerPage);
      if (activePage < totalPages) {
        activePage++;
        renderGalleryPage();
        fullImagesContainer.scrollTop = 0;
      }
    });

    // Dynamic Category Filter Pills Logic
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        currentFilter = pill.getAttribute('data-filter');
        activePage = 1; // Reset to page 1 on filter
        renderGalleryPage();
      });
    });

    // Initial render
    renderGalleryPage();
  }

  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-main-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close-btn');
  const lightboxPrev = document.querySelector('.lightbox-nav-btn.prev-btn');
  const lightboxNext = document.querySelector('.lightbox-nav-btn.next-btn');

  let lightboxActiveIndex = 0;

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    lightboxActiveIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxCaption.innerText = galleryImages[index].caption;
    lightbox.classList.add('active');
  };

  const closeLightbox = () => {
    if (lightbox) lightbox.classList.remove('active');
  };

  const navigateLightbox = (direction) => {
    let nextIdx = lightboxActiveIndex + direction;
    if (nextIdx >= galleryImages.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = galleryImages.length - 1;
    openLightbox(nextIdx);
  };

  // Click handler for 6 thumbnail cards in section
  document.querySelectorAll('.gallery-item-wrapper').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index'), 10);
      openLightbox(idx);
    });
  });

  // Click handler for dynamic cards in full gallery modal
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.full-gallery-item');
    if (card) {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openLightbox(idx);
    }
  });

  if (lightbox && lightboxClose && lightboxPrev && lightboxNext) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox clicking backdrop
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
      }
    });
  }

  // 8. FLOATING QR WIDGET TOGGLE LOGIC (Open Center Donation Modal directly)
  const fabBtn = document.querySelector('.fab-donate-btn');

  if (fabBtn) {
    fabBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal('donation-modal');
    });
  }

  // 9. CLICK-TO-COPY FOR BANK DETAILS & UPI ID
  const copyableElements = document.querySelectorAll('.copyable');
  copyableElements.forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent document click listeners
      const textToCopy = elem.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHTML = elem.innerHTML;
        elem.innerHTML = `Copied! <i class="fa-solid fa-check" style="color: #4cd137;"></i>`;
        elem.classList.add('copied-feedback');
        elem.style.pointerEvents = 'none';

        setTimeout(() => {
          elem.innerHTML = originalHTML;
          elem.classList.remove('copied-feedback');
          elem.style.pointerEvents = 'auto';
        }, 1500);
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    });
  });

  // 10. ROTATING FAB TOOLTIP MESSAGES
  const messages = [
    "Support 60+ mentally retired children at Parmarth. 💚",
    "Make someone happy today. Every little support counts! ✨",
    "Get 50% Tax Exemption under Section 80G! 📜",
    "Your kindness provides food, care & therapies. 🍲",
    "100% of your donation directly reaches the children. 🤝",
    "Parmarth has been rebuilding lives for over 8 years. 🏡",
    "Scan the QR to support us instantly via UPI. 📱"
  ];

  const bubble = document.querySelector('.fab-message-bubble');
  const bubbleText = bubble ? bubble.querySelector('.bubble-text') : null;

  if (bubble && bubbleText) {
    let msgIndex = 0;

    const cycleMessages = () => {
      // Set the next message text
      bubbleText.textContent = messages[msgIndex];

      // Show the bubble (stays visible for 5 seconds)
      bubble.classList.add('active');

      setTimeout(() => {
        // Hide the bubble (stays hidden for 5 seconds)
        bubble.classList.remove('active');

        // Move to the next message index
        msgIndex = (msgIndex + 1) % messages.length;

        // Schedule the next cycle after 5 seconds of being hidden
        setTimeout(cycleMessages, 5000);
      }, 5000);
    };

    // Start cycling after an initial delay of 3 seconds
    setTimeout(cycleMessages, 3000);
  }

  // 11. BANK DETAILS COLLAPSIBLE WIDGETS (ALL INSTANCES)
  const bankToggleBtns = document.querySelectorAll('.bank-toggle-btn');
  bankToggleBtns.forEach(btn => {
    // Find the corresponding content box within the same container block
    const parentContainer = btn.closest('.widget-collapsible-bank') || btn.closest('.modal-collapsible-bank');
    if (!parentContainer) return;

    const content = parentContainer.querySelector('.bank-details-content') || parentContainer.querySelector('.modal-bank-details-content');
    if (content) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);

        if (!isExpanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0px';
        }
      });
    }
  });

  // 12. REDESIGNED DONATION MODAL ACCORDION TOGGLE
  const modalBankToggleBtn = document.querySelector('.modal-bank-toggle-btn');
  const modalBankDetailsContent = document.querySelector('.modal-bank-details-content');
  if (modalBankToggleBtn && modalBankDetailsContent) {
    modalBankToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = modalBankToggleBtn.getAttribute('aria-expanded') === 'true';
      modalBankToggleBtn.setAttribute('aria-expanded', !isExpanded);

      if (!isExpanded) {
        modalBankDetailsContent.style.maxHeight = modalBankDetailsContent.scrollHeight + 'px';
      } else {
        modalBankDetailsContent.style.maxHeight = '0px';
      }
    });
  }

  // 13. ENQUIRY FORM SUBMISSION HANDLER
  const enqForm = document.getElementById('enquiry-form');
  const enqStatus = document.getElementById('enq-form-status');

  if (enqForm && enqStatus) {
    enqForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = enqForm.querySelector('.btn-submit');
      const originalBtnText = submitBtn.innerHTML;

      // Visual feedback: loading state
      submitBtn.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin"></i>`;
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Success display
        enqStatus.className = 'form-status-alert success';
        enqStatus.innerHTML = `<i class="fa-regular fa-circle-check"></i> Thank you! Your enquiry has been sent successfully. We will get back to you shortly.`;
        enqStatus.style.display = 'block';

        // Reset form fields
        enqForm.reset();

        // Hide success message after 7 seconds
        setTimeout(() => {
          enqStatus.style.display = 'none';
          enqStatus.innerHTML = '';
        }, 7000);
      }, 1500);
    });
  }

  // 13b. VISIT REQUEST FORM SUBMISSION HANDLER
  const visitForm = document.getElementById('visit-request-form');
  const visitStatus = document.getElementById('visit-form-status');

  if (visitForm && visitStatus) {
    visitForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = visitForm.querySelector('.btn-submit-visit');
      const originalBtnText = submitBtn.innerHTML;

      // Visual feedback: loading state
      submitBtn.innerHTML = `Scheduling... <i class="fa-solid fa-spinner fa-spin"></i>`;
      submitBtn.disabled = true;

      // Simulate submission
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Success display
        visitStatus.className = 'form-status-alert success';
        visitStatus.innerHTML = `<i class="fa-regular fa-circle-check"></i> Visit scheduled! Thank you, we will contact you to confirm the timing shortly.`;
        visitStatus.style.display = 'block';

        // Reset form fields
        visitForm.reset();

        // Hide success message after 7 seconds
        setTimeout(() => {
          visitStatus.style.display = 'none';
          visitStatus.innerHTML = '';
        }, 7000);
      }, 1500);
    });
  }

  // 14. HOMEPAGE GALLERY CAROUSEL LOGIC
  const track = document.getElementById('homepage-carousel-track');
  const dotsContainer = document.getElementById('homepage-carousel-dots');
  const prevBtn = document.querySelector('.carousel-control-btn.prev');
  const nextBtn = document.querySelector('.carousel-control-btn.next');

  if (track && prevBtn && nextBtn && dotsContainer) {
    const slides = Array.from(track.children);
    let currentIndex = 0;

    const getVisibleSlidesCount = () => {
      const width = window.innerWidth;
      if (width <= 600) return 1;
      if (width <= 992) return 2;
      return 3;
    };

    const getMaxIndex = () => {
      return Math.max(0, slides.length - getVisibleSlidesCount());
    };

    const updateCarousel = () => {
      const visibleCount = getVisibleSlidesCount();
      const maxIndex = getMaxIndex();
      
      // Keep index in boundaries
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      // Calculate slide width and gap
      const slideItem = slides[0];
      const slideWidth = slideItem.getBoundingClientRect().width;
      
      // Let's get the track computed gap style
      const gap = parseInt(window.getComputedStyle(track).gap) || 24;

      const offset = currentIndex * (slideWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      // Update dots
      updateDots();
    };

    const setupDots = () => {
      dotsContainer.innerHTML = '';
      const maxIndex = getMaxIndex();
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (i === currentIndex) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    };

    const updateDots = () => {
      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, idx) => {
        dot.classList.remove('active');
        if (idx === currentIndex) dot.classList.add('active');
      });

      // Enable/disable arrows
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === getMaxIndex();
      prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
      nextBtn.style.opacity = currentIndex === getMaxIndex() ? '0.3' : '1';
    };

    // Event Listeners
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < getMaxIndex()) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Handle Resize (Recalculate layout and recreate dots)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupDots();
        updateCarousel();
      }, 100);
    });

    // Bind cards to open lightbox (data-index 0 to 5)
    slides.forEach(slide => {
      slide.addEventListener('click', () => {
        const idx = parseInt(slide.getAttribute('data-index'), 10);
        openLightbox(idx);
      });
    });

    // Init
    setupDots();
    updateCarousel();
  }

  // =========================================================================
  // 12. SECURITY MODULE: BANK DETAILS & QR CODE TAMPER PROTECTION
  // =========================================================================
  (function secureDonationData() {
    const SECURE_DATA = Object.freeze({
      account: "39365895088",
      ifsc: "SBIN0016035",
      branchCode: "16035",
      micr: "360002202",
      gpay: "+919904525625",
      phone: "+91 99045 25625",
      upi: "parmarthedu@sbi",
      qrPayment: "public/qr/parmath_payment.jpg",
      qrLocation: "public/qr/parmath location.png"
    });

    // A. CLIPBOARD OVERRIDE PROTECTION
    // Intercepts copy events. If a user is copying our details, force the verified value
    // to prevent extensions or malicious client scripts from hijacking the clipboard.
    document.addEventListener('copy', (e) => {
      const selection = window.getSelection().toString().trim().replace(/[\s-]/g, '');
      if (selection.includes(SECURE_DATA.account) || selection.includes("3936585088")) {
        e.clipboardData.setData('text/plain', SECURE_DATA.account);
        e.preventDefault();
        console.warn("[Security Shield] Copied account number verified and secured.");
      } else if (selection.includes(SECURE_DATA.ifsc)) {
        e.clipboardData.setData('text/plain', SECURE_DATA.ifsc);
        e.preventDefault();
        console.warn("[Security Shield] Copied IFSC code verified and secured.");
      } else if (selection.includes(SECURE_DATA.branchCode)) {
        e.clipboardData.setData('text/plain', SECURE_DATA.branchCode);
        e.preventDefault();
        console.warn("[Security Shield] Copied Branch code verified and secured.");
      } else if (selection.includes(SECURE_DATA.micr)) {
        e.clipboardData.setData('text/plain', SECURE_DATA.micr);
        e.preventDefault();
        console.warn("[Security Shield] Copied MICR code verified and secured.");
      } else if (selection.includes("9904525625")) {
        e.clipboardData.setData('text/plain', SECURE_DATA.phone);
        e.preventDefault();
        console.warn("[Security Shield] Copied phone number verified and secured.");
      } else if (selection.includes(SECURE_DATA.upi)) {
        e.clipboardData.setData('text/plain', SECURE_DATA.upi);
        e.preventDefault();
        console.warn("[Security Shield] Copied UPI ID verified and secured.");
      }
    });

    // B. INTEGRITY ENFORCER FUNCTION
    function enforceIntegrity(el) {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
      if (el.classList.contains('copied-feedback')) return;

      // 1. Enforce data-copy attributes
      if (el.hasAttribute('data-copy')) {
        const val = el.getAttribute('data-copy') || '';
        if ((val.includes("3936585088") || val.includes("39365895088")) && val !== SECURE_DATA.account) {
          el.setAttribute('data-copy', SECURE_DATA.account);
          console.warn("[Security Shield] Reverted account data-copy tampering.");
        } else if (val.includes("SBIN0016035") && val !== SECURE_DATA.ifsc) {
          el.setAttribute('data-copy', SECURE_DATA.ifsc);
          console.warn("[Security Shield] Reverted IFSC data-copy tampering.");
        } else if (val.includes("16035") && val !== SECURE_DATA.branchCode) {
          el.setAttribute('data-copy', SECURE_DATA.branchCode);
          console.warn("[Security Shield] Reverted Branch Code data-copy tampering.");
        } else if (val.includes("360002202") && val !== SECURE_DATA.micr) {
          el.setAttribute('data-copy', SECURE_DATA.micr);
          console.warn("[Security Shield] Reverted MICR data-copy tampering.");
        } else if ((val.includes("parmarthedu") || val.includes("@sbi")) && val !== SECURE_DATA.upi) {
          el.setAttribute('data-copy', SECURE_DATA.upi);
          console.warn("[Security Shield] Reverted UPI data-copy tampering.");
        }
      }

      // 2. Enforce image src attributes
      if (el.tagName === 'IMG') {
        const src = el.getAttribute('src') || '';
        if (src.includes('parmath_payment') && !src.endsWith(SECURE_DATA.qrPayment)) {
          el.setAttribute('src', SECURE_DATA.qrPayment);
          console.warn("[Security Shield] Reverted Payment QR image tampering.");
        }
        if (src.includes('parmath%20location') && !src.endsWith(SECURE_DATA.qrLocation)) {
          el.setAttribute('src', SECURE_DATA.qrLocation);
          console.warn("[Security Shield] Reverted Location QR image tampering.");
        }
      }

      // 3. Enforce displayed text integrity in secure fields
      const isBankVal = el.classList.contains('left-bank-value');
      const isUpiPill = el.classList.contains('upi-copy-pill');

      if (isBankVal || isUpiPill) {
        const text = el.textContent || '';
        const rowHTML = el.closest('.left-bank-row')?.innerHTML || '';

        if (rowHTML.includes('Account Number') && !text.includes(SECURE_DATA.account)) {
          el.innerHTML = `${SECURE_DATA.account} <i class="fa-regular fa-copy copy-icon"></i>`;
          console.warn("[Security Shield] Restored Account Number UI integrity.");
        } else if (rowHTML.includes('IFSC Code') && !text.includes(SECURE_DATA.ifsc)) {
          el.innerHTML = `${SECURE_DATA.ifsc} <i class="fa-regular fa-copy copy-icon"></i>`;
          console.warn("[Security Shield] Restored IFSC Code UI integrity.");
        } else if (rowHTML.includes('Branch Code') && !text.includes(SECURE_DATA.branchCode)) {
          el.innerHTML = `${SECURE_DATA.branchCode} <i class="fa-regular fa-copy copy-icon"></i>`;
        } else if (rowHTML.includes('MICR Code') && !text.includes(SECURE_DATA.micr)) {
          el.innerHTML = `${SECURE_DATA.micr} <i class="fa-regular fa-copy copy-icon"></i>`;
        } else if (isUpiPill && !text.includes(SECURE_DATA.upi)) {
          el.innerHTML = `UPI ID: <strong>${SECURE_DATA.upi}</strong> <i class="fa-regular fa-copy copy-icon"></i>`;
          console.warn("[Security Shield] Restored UPI ID UI integrity.");
        }
      }
    }

    // C. DOM MUTATION LISTENER
    // Watches for dynamic insertions or changes by browser extensions or third party scripts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        enforceIntegrity(mutation.target);
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              enforceIntegrity(node);
              node.querySelectorAll('.copyable, img, .left-bank-value, .upi-copy-pill').forEach(enforceIntegrity);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
      attributeFilter: ['src', 'data-copy', 'href', 'value']
    });

    // D. REPEATED INTEGRITY CHECK (Fallback)
    setInterval(() => {
      document.querySelectorAll('.copyable, img, .left-bank-value, .upi-copy-pill').forEach(enforceIntegrity);
    }, 1000);
  })();
});


/* ===================================================
   QR-First Bank Accordion Toggle
   =================================================== */
function toggleQFBank(bodyId, btn) {
  const body = document.getElementById(bodyId);
  if (!body) return;
  const chevron = btn ? btn.querySelector('.qf-chevron') : null;
  const isOpen = body.style.display === 'block';
  body.style.display = isOpen ? 'none' : 'block';
  if (chevron) chevron.classList.toggle('open', !isOpen);
}

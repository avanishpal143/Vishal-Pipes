/**
 * Vishal Pipes Limited - Design Concept A
 * Core Frontend Interactions & Form Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Shrink on Scroll
  const navbarWrap = document.querySelector('.navbar-wrapper, .header-fixed-wrap');
  if (navbarWrap) {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        navbarWrap.classList.add('scrolled');
      } else {
        navbarWrap.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Metric Counters Animation (IntersectionObserver)
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseInt(target.getAttribute('data-count'), 10);
          if (!isNaN(countTo)) {
            let current = 0;
            const step = Math.max(1, Math.ceil(countTo / 30));
            const timer = setInterval(() => {
              current += step;
              if (current >= countTo) {
                current = countTo;
                clearInterval(timer);
              }
              const suffix = target.getAttribute('data-suffix') || '';
              target.innerHTML = `${current}<span class="stat-plus">${suffix}</span>`;
            }, 30);
          }
          obs.unobserve(target);
        }
      });
    }, { threshold: 0.2 });

    statNumbers.forEach(num => observer.observe(num));
  }

  // 3. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 4. Contact / RFQ Form AJAX Submission
  const rfqForm = document.getElementById('rfqForm');
  if (rfqForm) {
    rfqForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusMsg = document.getElementById('formStatus');
      const submitBtn = rfqForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Processing Request...</span>';
      statusMsg.className = 'form-status-msg';
      statusMsg.style.display = 'none';

      const formData = new FormData(rfqForm);

      try {
        const response = await fetch(rfqForm.action, {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          statusMsg.className = 'form-status-msg success';
          statusMsg.innerHTML = `<strong>Inquiry Received:</strong> ${result.message}`;
          statusMsg.style.display = 'block';
          rfqForm.reset();
        } else {
          statusMsg.className = 'form-status-msg error';
          statusMsg.innerHTML = `<strong>Notice:</strong> ${result.message}`;
          statusMsg.style.display = 'block';
        }
      } catch (err) {
        statusMsg.className = 'form-status-msg error';
        statusMsg.innerHTML = '<strong>Notice:</strong> Unable to process request online. Please email our sales team directly at info@vishalpipes.com.';
        statusMsg.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  }
});

/**
 * Vishal Pipes Limited - Senior High-Level Interactive Navigation
 * Guaranteed 100% working mega menus, desktop hover debouncing, and mobile drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item.has-mega');
  const toggleBtn = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerScrim = document.getElementById('drawerScrim');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  let closeTimer = null;

  // 1. Desktop Hover & Click Handling
  navItems.forEach((item) => {
    const link = item.querySelector('.nav-link');
    const overlay = item.querySelector('.mega-menu-overlay');

    // On mouse enter (link or item)
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 1024) {
        if (closeTimer) clearTimeout(closeTimer);
        navItems.forEach((other) => {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.add('open');
      }
    });

    // On mouse leave (grace period to prevent accidental closing)
    item.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 1024) {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
          item.classList.remove('open');
        }, 220);
      }
    });

    // Handle touch / click on link
    if (link) {
      link.addEventListener('click', (e) => {
        // On touch screens or narrow widths where hover doesn't exist
        if (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches) {
          const isOpen = item.classList.contains('open');
          if (!isOpen) {
            e.preventDefault();
            navItems.forEach((other) => other.classList.remove('open'));
            item.classList.add('open');
          }
          // If already open, let the user navigate to the primary category page
        }
      });
    }
  });

  // 2. Click outside closes all dropdowns
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-capsule')) {
      if (closeTimer) clearTimeout(closeTimer);
      navItems.forEach((item) => item.classList.remove('open'));
    }
  });

  // 3. Escape key closes everything
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (closeTimer) clearTimeout(closeTimer);
      navItems.forEach((item) => item.classList.remove('open'));
      closeMobileDrawer();
    }
  });

  // 4. Mobile Drawer Controls
  const openMobileDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerScrim) drawerScrim.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerScrim) drawerScrim.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileDrawer();
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  }

  if (drawerScrim) {
    drawerScrim.addEventListener('click', closeMobileDrawer);
  }

  // 5. Mobile Accordion Collapsible Menus
  const mobileAccordions = document.querySelectorAll('.mobile-accordion-toggle');
  mobileAccordions.forEach((acc) => {
    acc.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = acc.closest('.mobile-nav-group');
      if (parent) {
        const isOpen = parent.classList.contains('is-open');
        // Close other accordions for clean UX
        document.querySelectorAll('.mobile-nav-group').forEach((g) => {
          if (g !== parent) g.classList.remove('is-open');
        });
        if (!isOpen) {
          parent.classList.add('is-open');
        } else {
          parent.classList.remove('is-open');
        }
      }
    });
  });

  // Close mobile drawer when any link inside it is clicked
  const mobileSublinks = document.querySelectorAll('.mobile-drawer a');
  mobileSublinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });
});

// Intersection Observer utility for optimized loading
const createIntersectionObserver = () => {
  if (!window.IntersectionObserver) return null;
  
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);
};

// Performance monitoring utility
const createPerformanceMonitor = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  const fpsElement = document.createElement('div');
  
  fpsElement.className = 'perf-monitor';
  document.body.appendChild(fpsElement);
  
  const toggleVisibility = () => {
    fpsElement.classList.toggle('visible');
  };
  
  // Press Ctrl+Shift+P to toggle performance monitor
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      toggleVisibility();
    }
  });
  
  const updateFPS = () => {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      frameCount = 0;
      lastTime = currentTime;
      
      const memoryInfo = performance.memory ? 
        `Memory: ${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB / ${Math.round(performance.memory.jsHeapSizeLimit / 1048576)}MB` : 
        '';
      
      fpsElement.innerHTML = `FPS: ${fps} ${memoryInfo}`;
    }
    
    requestAnimationFrame(updateFPS);
  };
  
  requestAnimationFrame(updateFPS);
  
  return {
    toggle: toggleVisibility
  };
};

// Lazy loading utility
const setupLazyLoading = () => {
  const lazyElements = document.querySelectorAll('.lazy-container');
  const observer = createIntersectionObserver();
  
  if (!observer) return;
  
  lazyElements.forEach(element => {
    element.classList.add('observe-visibility');
    observer.observe(element);
  });
};

// Responsive image loading
const optimizeImages = () => {
  const images = document.querySelectorAll('img:not(.responsive-image)');
  
  images.forEach(img => {
    // Add responsive class
    img.classList.add('responsive-image');
    
    // Add loading="lazy" attribute if not present
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add decoding="async" attribute if not present
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
    
    // Set explicit width and height if available from attributes
    if (img.hasAttribute('width') && img.hasAttribute('height')) {
      const width = img.getAttribute('width');
      const height = img.getAttribute('height');
      img.style.aspectRatio = `${width} / ${height}`;
    }
  });
};

// Reduced motion detection
const detectReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduced-motion');
  }
  
  // Listen for changes in preference
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  });
};

// Mobile detection for optimizations
const detectMobile = () => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  if (isMobile) {
    document.documentElement.classList.add('mobile-device');
    
    // Apply mobile optimizations
    const elements = document.querySelectorAll('.mobile-optimizable');
    elements.forEach(el => {
      el.classList.add('mobile-optimized');
      el.classList.add('simplified-animation');
    });
  }
  
  // Listen for changes in screen size
  window.matchMedia('(max-width: 768px)').addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('mobile-device');
    } else {
      document.documentElement.classList.remove('mobile-device');
    }
  });
};

// Optimize tab switching
const optimizeTabSwitching = () => {
  const tabContainers = document.querySelectorAll('.optimized-tabs');
  
  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('[role="tab"]');
    const panels = container.querySelectorAll('[role="tabpanel"]');
    
    // Hide all panels initially except the active one
    panels.forEach(panel => {
      if (!panel.hasAttribute('aria-hidden') || panel.getAttribute('aria-hidden') === 'false') {
        panel.classList.add('optimized-tab-content');
      } else {
        panel.style.display = 'none';
      }
    });
    
    // Add click handlers with optimized rendering
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Get the target panel
        const targetId = tab.getAttribute('aria-controls');
        const targetPanel = document.getElementById(targetId);
        
        // Update tab states
        tabs.forEach(t => {
          t.setAttribute('aria-selected', 'false');
          t.classList.remove('active');
        });
        
        tab.setAttribute('aria-selected', 'true');
        tab.classList.add('active');
        
        // Optimize panel switching
        panels.forEach(panel => {
          if (panel === targetPanel) {
            panel.style.display = '';
            panel.setAttribute('aria-hidden', 'false');
            
            // Use requestAnimationFrame for smoother transitions
            requestAnimationFrame(() => {
              panel.classList.add('optimized-tab-content');
              panel.style.opacity = '1';
              panel.style.transform = 'translateY(0)';
            });
          } else {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(10px)';
            
            // Hide after transition
            setTimeout(() => {
              panel.style.display = 'none';
              panel.setAttribute('aria-hidden', 'true');
            }, 300); // Match transition duration
          }
        });
      });
    });
  });
};

// Initialize all optimizations
const initPerformanceOptimizations = () => {
  // Apply hardware acceleration to animated elements
  document.querySelectorAll('.animated').forEach(el => {
    el.classList.add('hardware-accelerated');
  });
  
  // Setup lazy loading
  setupLazyLoading();
  
  // Optimize images
  optimizeImages();
  
  // Check for reduced motion preference
  detectReducedMotion();
  
  // Apply mobile optimizations
  detectMobile();
  
  // Optimize tab switching
  optimizeTabSwitching();
  
  // Initialize performance monitor (hidden by default)
  createPerformanceMonitor();
  
  // Log initialization
  console.log('Performance optimizations initialized');
};

// Run optimizations when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);

// Export utilities for use in other components
export {
  createIntersectionObserver,
  createPerformanceMonitor,
  setupLazyLoading,
  optimizeImages,
  detectReducedMotion,
  detectMobile,
  optimizeTabSwitching,
  initPerformanceOptimizations
};

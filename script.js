/**
 * LadderFrame Advisors - Interactive Logic & Micro-animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initCapabilityHoverSync();
  initMetricCounters();
});

/**
 * 1. Top Viewport Scroll Progress Bar
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
}

/**
 * 2. Synchronize capability hover states with the 6 red lines in the primary logo
 */
function initCapabilityHoverSync() {
  const capabilityItems = document.querySelectorAll('.capability-item');
  const lineMap = {
    grow: '1',
    expand: '2',
    win: '3',
    build: '4',
    transform: '5',
    perform: '6'
  };

  capabilityItems.forEach(item => {
    const capKey = item.getAttribute('data-capability');
    const lineIndex = lineMap[capKey];
    
    if (lineIndex) {
      item.addEventListener('mouseenter', () => {
        const logoLine = document.querySelector(`.logo-red-line[data-line="${lineIndex}"]`);
        if (logoLine) logoLine.classList.add('active-highlight');
      });

      item.addEventListener('mouseleave', () => {
        const logoLine = document.querySelector(`.logo-red-line[data-line="${lineIndex}"]`);
        if (logoLine) logoLine.classList.remove('active-highlight');
      });
    }
  });
}

/**
 * 3. Animated Metric Counting (Slot-machine / Roll-up Style)
 */
function initMetricCounters() {
  const metricElements = document.querySelectorAll('.exp-metric-num[data-counter], .metric-value[data-counter]');
  if (!metricElements.length) return;

  let hasAnimated = false;

  const animateMetrics = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    const duration = 1600; // milliseconds
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Smooth ease-out cubic curve
      const easeProgress = 1 - Math.pow(1 - rawProgress, 3);

      metricElements.forEach(el => {
        const type = el.getAttribute('data-counter');
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        if (type === 'single') {
          const target = parseFloat(el.getAttribute('data-target'));
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const currentVal = target * easeProgress;

          if (rawProgress >= 1) {
            el.textContent = `${prefix}${decimals > 0 ? target.toFixed(decimals) : target}${suffix}`;
          } else {
            const formatted = decimals > 0 ? currentVal.toFixed(decimals) : Math.floor(currentVal);
            el.textContent = `${prefix}${formatted}${suffix}`;
          }
        } else if (type === 'range') {
          const startTarget = parseFloat(el.getAttribute('data-start'));
          const endTarget = parseFloat(el.getAttribute('data-end'));

          const currentStart = startTarget * easeProgress;
          const currentEnd = endTarget * easeProgress;

          if (rawProgress >= 1) {
            el.textContent = `${prefix}${startTarget}–${endTarget}${suffix}`;
          } else {
            el.textContent = `${prefix}${Math.floor(currentStart)}–${Math.floor(currentEnd)}${suffix}`;
          }
        }
      });

      if (rawProgress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  // Trigger when Selected Experience section comes into view
  const experienceSection = document.querySelector('.experience-section');
  if (experienceSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateMetrics();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(experienceSection);
  } else {
    // Fallback if IntersectionObserver isn't available
    setTimeout(animateMetrics, 300);
  }
}

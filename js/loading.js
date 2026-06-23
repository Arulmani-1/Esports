// loading.js
(() => {
  let loader = document.getElementById('page-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'page-loader';
    const wrapper = document.createElement('div');
    wrapper.className = 'loader-wrapper';
    
    const spinner = document.createElement('div');
    spinner.className = 'loader-spinner';
    
    const svgHtml = `
      <img src="assets/images/loading.png" alt="Loading Logo" class="loader-center-logo">
    `;
    
    wrapper.appendChild(spinner);
    wrapper.insertAdjacentHTML('beforeend', svgHtml);
    loader.appendChild(wrapper);
    document.body.insertBefore(loader, document.body.firstChild);
  } else {
    // Upgrade existing HTML structure if necessary
    if (!loader.querySelector('.loader-center-logo')) {
      loader.innerHTML = `
        <div class="loader-wrapper">
          <div class="loader-spinner"></div>
          <img src="assets/images/loading.png" alt="Loading Logo" class="loader-center-logo">
        </div>
      `;
    }
  }

  const hideLoader = () => {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }
    }, 0); // 0 seconds delay
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
})();

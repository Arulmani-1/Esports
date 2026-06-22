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
    
    const logo = document.createElement('div');
    logo.className = 'loader-logo';
    logo.innerText = 'S';
    
    wrapper.appendChild(spinner);
    wrapper.appendChild(logo);
    loader.appendChild(wrapper);
    document.body.insertBefore(loader, document.body.firstChild);
  } else {
    // Upgrade existing HTML structure
    if (!loader.querySelector('.loader-wrapper')) {
      loader.innerHTML = `
        <div class="loader-wrapper">
          <div class="loader-spinner"></div>
          <div class="loader-logo">S</div>
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
    }, 3000); // 3 seconds delay
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
})();

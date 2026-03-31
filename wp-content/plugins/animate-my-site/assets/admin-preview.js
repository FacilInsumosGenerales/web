document.addEventListener("DOMContentLoaded", function () {
  // const select = document.querySelector('#animmysite_pack_select'); // Removed in favor of radios
  const items = document.querySelectorAll('.animmysite-preview-item');
  const packChangeInput = document.querySelector('#animmysite_pack_change');

  if (!items.length) return;

  function runPreview() {
    // Simulate frontend behavior where `.animmysite-visible` is added after a short delay.
    items.forEach((el, index) => {
      el.classList.remove('animmysite-visible', 'animmysite-anim');
      // Force reflow so transitions reliably trigger.
      void el.offsetWidth;
      el.classList.add('animmysite-anim');
      setTimeout(() => {
        el.classList.add('animmysite-visible');
      }, 90 + index * 70);
    });
  }

  // Initial run on page load.
  // runPreview();

  // Handle Radio Changes (delegation or direct attachment)
  const radioInputs = document.querySelectorAll('input[name="animmysite_pack"]');
  radioInputs.forEach(radio => {
    radio.addEventListener('change', function () {
      const newPack = this.value;

      const link = document.getElementById('animmysite-preview-pack-css');
      if (link) {
        const currentHref = link.getAttribute('href');
        const newHref = currentHref.replace(/\/packs\/[^/]+\.css/, '/packs/' + newPack + '.css');
        link.setAttribute('href', newHref);
      }

      // Re-run the preview animation
      runPreview();
    });
  });
  // Check for saved state and show toast
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('animmysite_saved')) {
    const toast = document.getElementById('animmysite-toast');
    if (toast) {
      // Force a slight delay to ensure transition works
      setTimeout(() => {
        // Use localized string if available
        const savedText = (typeof ANIMMYSITE_ADMIN_STRINGS !== 'undefined' && ANIMMYSITE_ADMIN_STRINGS.settingsSaved)
          ? ANIMMYSITE_ADMIN_STRINGS.settingsSaved
          : "Settings saved!";
        toast.textContent = savedText;
        toast.classList.add('show');
      }, 100);

      // Hide after 3 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);

      // Clean URL
      urlParams.delete('animmysite_saved');
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.replaceState({}, '', newUrl);
    }
  }

  // Modal Logic
  const modal = document.getElementById('animmysite-modal');
  const overlay = document.getElementById('animmysite-modal-overlay');
  const closeBtn = document.getElementById('animmysite-modal-close');
  const openBtns = document.querySelectorAll('#animmysite-how-it-works-btn, #animmysite-how-it-works-link, .animmysite-how-it-works');

  function openModal(e) {
    if (e) e.preventDefault();
    if (modal && overlay) {
      modal.classList.add('animmysite-show');
      overlay.classList.add('animmysite-show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal && overlay) {
      modal.classList.remove('animmysite-show');
      overlay.classList.remove('animmysite-show');
      document.body.style.overflow = '';
    }
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
});


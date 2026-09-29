const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const form = document.querySelector('#application-form');
const dialog = document.querySelector('#success-dialog');
const toast = document.querySelector('#toast');

document.querySelector('#year').textContent = new Date().getFullYear();

menuButton.addEventListener('click', () => {
  const isOpen = header.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  header.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

function showToast() {
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3000);
}

document.querySelectorAll('[data-demo-video], .card-art button').forEach(button => {
  button.addEventListener('click', showToast);
});

const messages = {
  name: 'Nama penanggung jawab wajib diisi.',
  businessName: 'Nama usaha wajib diisi.',
  whatsapp: 'Nomor WhatsApp wajib diisi.',
  category: 'Pilih bidang usaha.',
  address: 'Alamat usaha wajib diisi.',
  story: 'Ceritakan produk unggulan minimal 20 karakter.',
  consent: 'Persetujuan diperlukan untuk mengirim pengajuan.'
};

function validateField(field) {
  const label = field.closest('label');
  if (!label) return true;
  const error = label.querySelector('.error');
  let valid = field.checkValidity();

  if (field.name === 'whatsapp' && field.value) {
    valid = /^[+\d][\d\s-]{8,17}$/.test(field.value.trim());
  }

  label.classList.toggle('invalid', !valid);
  if (error) {
    error.textContent = valid ? '' : (field.type === 'email' ? 'Masukkan alamat email yang valid.' : messages[field.name] || 'Periksa kembali isian ini.');
  }
  return valid;
}

form.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.closest('label')?.classList.contains('invalid')) validateField(field);
  });
});

function makeReference() {
  const date = new Date();
  const datePart = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('');
  return `INV-${datePart}-${Math.floor(1000 + Math.random() * 9000)}`;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input, select, textarea')];
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    form.querySelector('.invalid input, .invalid select, .invalid textarea')?.focus();
    return;
  }

  const submit = form.querySelector('.submit-button');
  submit.disabled = true;
  submit.querySelector('span').textContent = 'Mengirim…';
  const payload = Object.fromEntries(new FormData(form).entries());
  const reference = makeReference();
  payload.reference = reference;
  payload.submittedAt = new Date().toISOString();

  try {
    // Prototipe: simpan lokal. Saat API tersedia, isi window.INVESTA_API_URL.
    if (window.INVESTA_API_URL) {
      const response = await fetch(window.INVESTA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Pengiriman gagal');
    } else {
      const submissions = JSON.parse(localStorage.getItem('investa_submissions') || '[]');
      submissions.push(payload);
      localStorage.setItem('investa_submissions', JSON.stringify(submissions));
      await new Promise(resolve => setTimeout(resolve, 550));
    }

    document.querySelector('#reference-number').textContent = reference;
    dialog.showModal();
    form.reset();
  } catch (error) {
    toast.textContent = 'Pengajuan belum terkirim. Silakan coba kembali.';
    showToast();
  } finally {
    submit.disabled = false;
    submit.querySelector('span').textContent = 'Kirim pengajuan';
  }
});

dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.dialog-action').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

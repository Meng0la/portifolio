(() => {
  const form = document.getElementById('contato-form');
  const feedback = document.getElementById('feedback');
  const BTN = form.querySelector('button[type="submit"]');

  const setLoading = (v) => {
    BTN.disabled = v;
    BTN.textContent = v ? 'Enviando...' : 'Enviar';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    // honeypot
    if ((document.getElementById('website')?.value || '').trim()) return;

    setLoading(true);
    try {
      const data = new FormData(form);
      // endpoint AJAX do FormSubmit (sem redirecionar)
      const res = await fetch('https://formsubmit.co/ajax/g.menguebarros@gmail.com', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error('HTTP ' + res.status);
      // opcional: const json = await res.json(); // {success: '...'}
      alert('Contato enviado com sucesso! Obrigado!');
      form.reset();
      feedback.textContent = ''; // se você usar a área de feedback
    } catch (err) {
      alert('Não foi possível enviar agora. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  });
})();

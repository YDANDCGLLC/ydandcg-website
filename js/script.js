
const langsCache = {};
async function loadLang(code){
  const res = await fetch('/assets/lang/' + code + '.json');
  const data = await res.json();
  langsCache[code] = data;
  const current = localStorage.getItem('ydcg_lang') || 'es';
  applyLang(current);
}
function applyLang(code){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(langsCache[code] && langsCache[code][key]) el.textContent = langsCache[code][key];
  });
  const sEl = document.getElementById('slogan');
  if(langsCache[code] && langsCache[code]['hero_slogan']){
    const arr = langsCache[code]['hero_slogan'];
    let idx = 0;
    sEl.textContent = arr[idx];
    if(window._sloganInterval) clearInterval(window._sloganInterval);
    window._sloganInterval = setInterval(()=>{
      idx = (idx+1) % arr.length;
      sEl.classList.add('fade');
      setTimeout(()=>{ sEl.textContent = arr[idx]; sEl.classList.remove('fade'); }, 300);
    }, 3500);
  }
}
document.addEventListener('DOMContentLoaded', ()=>{
  ['es','en'].forEach(loadLang);
  document.querySelectorAll('.lang-switch [data-lang], .lang-switch button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const code = btn.getAttribute('data-lang') || btn.textContent.toLowerCase();
      localStorage.setItem('ydcg_lang', code);
      applyLang(code);
    });
  });
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', async (e)=>{
      const action = form.getAttribute('action') || '';
      if(action.includes('YOUR_FORM_ID')){
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        const subject = encodeURIComponent('Solicitud de cotización — ' + name);
        const body = encodeURIComponent(`Nombre: ${name}%0AEmail: ${email}%0ATeléfono: ${phone}%0A%0AMensaje:%0A${message}`);
        window.location.href = 'mailto:ydandecgleaningLLc@gmail.com?subject=' + subject + '&body=' + body;
      }
    });
  }
});

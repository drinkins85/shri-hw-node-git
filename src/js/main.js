import '../styles/main.scss';
import getFileContent from './getFileContent';
import uploadRepo from './uploadRepo';

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.fileBtn');
  const target = document.querySelector('.file-viewer');
  buttons.forEach((button) => {
    const hash = button.getAttribute('data-hash');
    button.addEventListener('click', () => {
      getFileContent(hash)
        .then((text) => {
          target.classList.add('file-viewer_visible');
          target.innerHTML = text;
        });
    });
  });

  const uploadForm = document.querySelector('.repo-upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = uploadForm.querySelector('.repo-upload-form__input').value;
      const btn = uploadForm.querySelector('.repo-upload-form__button');
      btn.innerHTML = 'Загрузка';
      btn.setAttribute('disabled', 'disabled');
      uploadRepo(url)
        .then(() => {
          window.location.reload();
        });
    });
  }
});

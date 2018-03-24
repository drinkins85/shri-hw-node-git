import '../styles/main.scss';
import getFileContent from './getFileContent';

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.fileBtn');
  const target = document.querySelector('.file-viewer');
  buttons.forEach((button) => {
    const hash = button.getAttribute('data-hash');
    button.addEventListener('click', () => {
      getFileContent(hash)
        .then((text) => {
          target.innerHTML = text;
        });
    });
  });
});

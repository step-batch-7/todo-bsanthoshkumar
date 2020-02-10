const togglePasswordVisibility = () => {
  const visibleIcon = document.querySelector('.visibleIcon');
  const invisibleIcon = document.querySelector('.invisibleIcon');
  const password = document.querySelector('.password');
  if (visibleIcon.classList.contains('hide')) {
    password.setAttribute('type', 'text');
    visibleIcon.classList.remove('hide');
    invisibleIcon.classList.add('hide');
  } else {
    password.setAttribute('type', 'password');
    visibleIcon.classList.add('hide');
    invisibleIcon.classList.remove('hide');
  }
}
// Обработчик нажатия Escape
const handleEscUp = (evt) => {
  if (evt.key === 'Escape') {
    const activePopup = document.querySelector('.popup_is-opened');
    if (activePopup) {
      closeModalWindow(activePopup);
    }
  }
};

// Открытие модального окна
const openModalWindow = (modalWindow) => {
  modalWindow.classList.add('popup_is-opened');
  document.addEventListener('keyup', handleEscUp);
};

// Закрытие модального окна
const closeModalWindow = (modalWindow) => {
  if (!modalWindow) {
    return;
  }
  
  modalWindow.classList.remove('popup_is-opened');
  document.removeEventListener('keyup', handleEscUp);
};

// Установка обработчиков закрытия
const setCloseModalWindowEventListeners = (modalWindow) => {
  const closeButtonElement = modalWindow.querySelector('.popup__close');
  
  closeButtonElement.addEventListener('click', () => {
    closeModalWindow(modalWindow);
  });
  
  modalWindow.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup')) {
      closeModalWindow(modalWindow);
    }
  });
};

export {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
};

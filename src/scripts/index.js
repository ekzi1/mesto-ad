import './pages/index.css';
import { getUserInfo, getCardList, setUserInfo, setUserAvatar, addNewCard, deleteCard, changeLikeCardStatus } from './components/api.js';
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { createCardElement, updateLikeStatus } from './components/card.js';

// Конфигурация валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

// DOM элементы
const placesList = document.querySelector('.places__list');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

// Модальные окна
const profileFormModal = document.querySelector('.popup_type_edit');
const cardFormModal = document.querySelector('.popup_type_new-card');
const imageModal = document.querySelector('.popup_type_image');
const avatarFormModal = document.querySelector('.popup_type_edit-avatar');

// Формы
const profileForm = profileFormModal.querySelector('.popup__form');
const cardForm = cardFormModal.querySelector('.popup__form');
const avatarForm = avatarFormModal.querySelector('.popup__form');

// Поля форм
const profileNameInput = profileForm.querySelector('.popup__input_type_name');
const profileJobInput = profileForm.querySelector('.popup__input_type_description');
const cardNameInput = cardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardForm.querySelector('.popup__input_type_url');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar');

// Элементы модального окна просмотра изображения
const imageElement = imageModal.querySelector('.popup__image');
const imageCaption = imageModal.querySelector('.popup__caption');

// Текущий ID пользователя
let currentUserId = null;

// Функция для изменения состояния кнопки при загрузке
const toggleSubmitButton = (submitButton, isLoading, loadingText) => {
  if (isLoading) {
    submitButton.dataset.textContent = submitButton.textContent;
    submitButton.textContent = loadingText;
    submitButton.disabled = true;
    submitButton.classList.add('popup__button_disabled');
  } else {
    submitButton.textContent = submitButton.dataset.textContent;
    submitButton.disabled = false;
    submitButton.classList.remove('popup__button_disabled');
  }
};

// Обработчик отправки формы профиля
const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = profileForm.querySelector('.popup__button');
  
  toggleSubmitButton(submitButton, true, 'Сохранение...');
  
  setUserInfo({
    name: profileNameInput.value,
    about: profileJobInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      toggleSubmitButton(submitButton, false);
    });
};

// Обработчик отправки формы аватара
const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector('.popup__button');
  
  toggleSubmitButton(submitButton, true, 'Сохранение...');
  
  setUserAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModal);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      toggleSubmitButton(submitButton, false);
    });
};

// Обработчик отправки формы карточки
const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = cardForm.querySelector('.popup__button');
  
  toggleSubmitButton(submitButton, true, 'Создание...');
  
  addNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((newCard) => {
      const cardElement = createCardElement(newCard, currentUserId, {
        handlePreviewPicture,
        handleLikeClick,
        handleDeleteClick,
      });
      placesList.prepend(cardElement);
      closeModalWindow(cardFormModal);
      cardForm.reset();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      toggleSubmitButton(submitButton, false);
    });
};

// Обработчик лайка
const handleLikeClick = (cardId, likeButton, likeCountElement) => {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  
  changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      updateLikeStatus(likeButton, likeCountElement, updatedCard.likes.length, !isLiked);
    })
    .catch((err) => {
      console.error(err);
    });
};

// Обработчик удаления карточки
const handleDeleteClick = (cardId, cardElement) => {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error(err);
    });
};

// Обработчик просмотра изображения
const handlePreviewPicture = (name, link) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModal);
};

// Открытие формы редактирования профиля
profileEditButton.addEventListener('click', () => {
  profileNameInput.value = profileTitle.textContent;
  profileJobInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModalWindow(profileFormModal);
});

// Открытие формы обновления аватара
profileAvatar.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModalWindow(avatarFormModal);
});

// Открытие формы добавления карточки
profileAddButton.addEventListener('click', () => {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openModalWindow(cardFormModal);
});

// Обработчики форм
profileForm.addEventListener('submit', handleProfileFormSubmit);
avatarForm.addEventListener('submit', handleAvatarFormSubmit);
cardForm.addEventListener('submit', handleCardFormSubmit);

// Закрытие модальных окон по крестику и оверлею
const allPopups = document.querySelectorAll('.popup');
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

// Включение валидации
enableValidation(validationConfig);

// Загрузка данных с сервера
Promise.all([getUserInfo(), getCardList()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    
    cards.forEach((card) => {
      const cardElement = createCardElement(card, currentUserId, {
        handlePreviewPicture,
        handleLikeClick,
        handleDeleteClick,
      });
      placesList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

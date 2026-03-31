/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import "../pages/index.css";

import logo from "../../Mesto 8 Sprint/logo.svg";

import { createCardElement } from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";
import { FormValidator } from "./components/FormValidator.js";
import { validationConfig } from "./utils/validation-config.js";
import { Api } from "./components/Api.js";
import { apiSettings } from "./utils/api-config.js";

const api = new Api(apiSettings);

const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description"
);

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(
  ".popup_type_edit-avatar"
);
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const profileFormValidator = new FormValidator(validationConfig, profileForm);
const newCardFormValidator = new FormValidator(validationConfig, cardForm);
const avatarFormValidator = new FormValidator(validationConfig, avatarForm);

profileFormValidator.enableValidation();
newCardFormValidator.enableValidation();
avatarFormValidator.enableValidation();

document.querySelector(".header__logo").src = logo;

let currentUserId = null;
let currentAvatarUrl = "";

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleLikeClick = (cardId, likeButton, likeCountEl) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  api
    .changeLikeCardStatus(cardId, !isLiked)
    .then((card) => {
      likeCountEl.textContent = String(card.likes.length);
      const nowLiked = card.likes.some((u) => u._id === currentUserId);
      likeButton.classList.toggle("card__like-button_is-active", nowLiked);
    })
    .catch((err) => console.error(err));
};

const handleDeleteClick = (cardId, cardElement) => {
  api
    .deleteCard(cardId)
    .then(() => cardElement.remove())
    .catch((err) => console.error(err));
};

const cardCallbacks = () => ({
  onPreviewPicture: handlePreviewPicture,
  onLikeClick: handleLikeClick,
  onDeleteClick: handleDeleteClick,
});

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  api
    .editProfile({
      name: profileTitleInput.value,
      about: profileDescriptionInput.value,
    })
    .then((user) => {
      profileTitle.textContent = user.name;
      profileDescription.textContent = user.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => console.error(err));
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  api
    .editAvatar(avatarInput.value)
    .then((user) => {
      currentAvatarUrl = user.avatar;
      profileAvatar.style.backgroundImage = `url(${user.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => console.error(err));
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  api
    .addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((newCard) => {
      placesWrap.prepend(
        createCardElement(newCard, currentUserId, cardCallbacks())
      );
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => console.error(err));
};

profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  profileFormValidator.resetValidation();
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  avatarInput.value = currentAvatarUrl;
  avatarFormValidator.resetValidation();
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  newCardFormValidator.resetValidation();
  openModalWindow(cardFormModalWindow);
});

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    currentAvatarUrl = userData.avatar;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((item) => {
      placesWrap.append(
        createCardElement(item, currentUserId, cardCallbacks())
      );
    });
  })
  .catch((err) => {
    console.error(err);
    alert(
      "Не удалось загрузить данные с сервера. Создайте файл .env (см. .env.example) с MESTO_COHORT и MESTO_TOKEN из Практикума."
    );
  });

const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

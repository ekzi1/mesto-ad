// Получение шаблона карточки
const getTemplate = () => {
  const template = document.getElementById('card-template');
  return template.content.querySelector('.card').cloneNode(true);
};

// Проверка, лайкнул ли пользователь карточку
const isCardLikedByUser = (card, userId) => {
  return card.likes.some((like) => like._id === userId);
};

// Создание элемента карточки
const createCardElement = (data, currentUserId, callbacks) => {
  const cardElement = getTemplate();
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCountElement = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__control-button_type_delete');
  
  // Установка данных карточки
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  likeCountElement.textContent = data.likes.length;
  
  // Проверка, лайкнул ли текущий пользователь
  if (isCardLikedByUser(data, currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }
  
  // Проверка, является ли текущий пользователь автором карточки
  const isOwner = data.owner._id === currentUserId;
  if (!isOwner) {
    deleteButton.remove();
  }
  
  // Обработчик лайка
  likeButton.addEventListener('click', () => {
    callbacks.handleLikeClick(data._id, likeButton, likeCountElement);
  });
  
  // Обработчик удаления (только для владельца)
  if (isOwner) {
    deleteButton.addEventListener('click', () => {
      callbacks.handleDeleteClick(data._id, cardElement);
    });
  }
  
  // Обработчик просмотра изображения
  cardImage.addEventListener('click', () => {
    callbacks.handlePreviewPicture(data.name, data.link);
  });
  
  return cardElement;
};

// Обновление состояния лайка
const updateLikeStatus = (likeButton, likeCountElement, likesCount, isLiked) => {
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  } else {
    likeButton.classList.remove('card__like-button_is-active');
  }
  likeCountElement.textContent = likesCount;
};

export {
  createCardElement,
  updateLikeStatus,
};

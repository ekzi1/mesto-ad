const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

const isCardLikedBy = (card, userId) =>
  Array.isArray(card.likes) &&
  card.likes.some((user) => user._id === userId || user === userId);

/**
 * @param {object} data — карточка с сервера (name, link, _id, likes, owner)
 * @param {string} currentUserId
 * @param {object} handlers
 */
export const createCardElement = (
  data,
  currentUserId,
  { onPreviewPicture, onLikeClick, onDeleteClick }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountEl = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(
    ".card__control-button_type_delete"
  );
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  const likes = data.likes || [];
  likeCountEl.textContent = String(likes.length);
  if (isCardLikedBy(data, currentUserId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  const isOwner = data.owner && data.owner._id === currentUserId;
  if (!isOwner && deleteButton) {
    deleteButton.remove();
  }

  if (onLikeClick && data._id) {
    likeButton.addEventListener("click", () =>
      onLikeClick(data._id, likeButton, likeCountEl)
    );
  }

  if (onDeleteClick && data._id && isOwner) {
    deleteButton.addEventListener("click", () =>
      onDeleteClick(data._id, cardElement)
    );
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () =>
      onPreviewPicture({ name: data.name, link: data.link })
    );
  }

  return cardElement;
};

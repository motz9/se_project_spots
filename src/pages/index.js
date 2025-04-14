import { enableValidation, validationConfig, resetValidation, disableButton } from "../scripts/validation.js";
import "./index.css";
import logoPath from "../images/logo.svg";
import pencilPath from "../images/pencil.svg";
import plusPath from "../images/plus.svg";
import Api from "../utils/Api.js";
import { handleSubmit } from "../utils/utils.js";


const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "4d9c0213-ee82-4209-9e72-4d7217385aae",
    "Content-Type": "application/json"
  }
});

api.getAppInfo()
    .then(([ cards, userInfo ]) => {
      cards.forEach((item) => {
        renderCard(item, "prepend");
      });

      profileNameElement.textContent = userInfo.name;
      profileDescriptionElement.textContent = userInfo.about;
      avatarImage.src = userInfo.avatar;
    })
    .catch(console.error);



let cardIdToDelete = null;

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__new-post-button");
const avatarModalButton = document.querySelector(".profile__avatar-button");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardModalFormElement = cardModal.querySelector(".modal__form");
const cardModalSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardModalLinkInput = cardModal.querySelector("#add-card-link-input");
const cardModalNameInput = cardModal.querySelector("#add-card-name-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement =
  previewModal.querySelector(".modal__caption");


const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const avatarModal = document.querySelector("#avatar-modal");
const avatarModalFormElement = avatarModal.querySelector(".modal__form");
const avatarModalSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarModalLinkInput = avatarModal.querySelector("#profile-avatar-input");
const avatarImage = document.querySelector(".profile__avatar");

const deleteModal = document.querySelector("#delete-modal");
const deleteModalForm = deleteModal.querySelector(".modal__form");
const deleteModalCancelButton = deleteModal.querySelector(".modal__cancel-button");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  cardElement.dataset.cardId = data._id;

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardLikeButton.addEventListener("click", () => {
    const isLiked = cardLikeButton.classList.contains("card__like-button_liked");
    api.handleLike(data._id, isLiked)
      .then(() => {
        cardLikeButton.classList.toggle("card__like-button_liked");
      })
      .catch(console.error);
});

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageElement.src = data.link;
    previewModalCaptionElement.textContent = data.name;
    previewModalImageElement.alt = data.name;
  });

  cardDeleteButton.addEventListener("click", () => {
    cardIdToDelete= data._id;
    openModal(deleteModal);
  });

  return cardElement;
}

function setupCloseButtonListeners() {
  const closeButtons = document.querySelectorAll(".modal__close-button");

  closeButtons.forEach((button) => {
    const modal = button.closest(".modal");
    button.addEventListener("click", () => closeModal(modal));
  });
}

document.querySelector('.header__logo').src = logoPath;
document.querySelector('.profile__edit-button img').src = pencilPath;
document.querySelector('.profile__new-post-button img').src = plusPath;

function handleOverlay(evt) {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(evt.target);
  }
}

function openModal(modal) {
  document.addEventListener("keydown", handleEsc);
  modal.addEventListener("mousedown", handleOverlay);
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.removeEventListener("mousedown", handleOverlay);
  document.removeEventListener("keydown", handleEsc);
  modal.classList.remove("modal_is-opened");
}

function handleEsc(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function handleEditFormSubmit(evt) {
    function successCallback(data) {
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
      closeModal(editModal);
  }
  handleSubmit(
    () => api.editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    }),
    evt,
    successCallback
  );
}


function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}
function handleCardModalFormSubmit(evt) {
  function successCallback(newCard) {
    renderCard(newCard);
    disableButton(cardModalSubmitButton, validationConfig);
    closeModal(cardModal);
  }
  handleSubmit(
    () => api.addNewCard({
      name: cardModalNameInput.value,
      link: cardModalLinkInput.value,
    }),
    evt,
    successCallback
  );
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileNameElement.textContent;
  editModalDescriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
  openModal(editModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalButton.addEventListener("click", () => {
  resetValidation(
    avatarModalFormElement,
    [avatarModalLinkInput],
    validationConfig
  );
  openModal(avatarModal);
});

function handleAvatarFormSubmit(evt) {
  function successCallback(data) {
    avatarImage.src = data.avatar;
    disableButton(avatarModalSubmitButton, validationConfig);
    closeModal(avatarModal);
  }
  handleSubmit(
    () => api.updateAvatar({ avatar: avatarModalLinkInput.value }),
    evt,
    successCallback
  )
}

function handleDeleteFormSubmit(evt) {
  const cardToDelete = document.querySelector(`[data-card-id = "${cardIdToDelete}"]`);

  function successCallback() {
    cardToDelete.remove();
    closeModal(deleteModal);
  }
  handleSubmit(
    () => api.deleteCard(cardIdToDelete),
    evt,
    successCallback
  );
}

avatarModalFormElement.addEventListener("submit", handleAvatarFormSubmit);
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardModalFormElement.addEventListener("submit", handleCardModalFormSubmit);
deleteModalForm.addEventListener("submit", handleDeleteFormSubmit);
deleteModalCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});


setupCloseButtonListeners();
enableValidation(validationConfig);

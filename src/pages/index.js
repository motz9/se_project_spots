import { enableValidation, validationConfig, resetValidation, disableButton } from "../scripts/validation.js";
import "./index.css";
import logoPath from "../images/logo.svg";
import pencilPath from "../images/pencil.svg";
import plusPath from "../images/plus.svg";
import avatarPath from "../images/avatar.jpg";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];
initialCards.unshift({
  name: "Golden Gate Bridge",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
});

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
        renderCard(item, "append");
      });

      document.querySelector('.profile__name').textContent = userInfo.name;
      document.querySelector('.profile__description').textContent = userInfo.about;
      document.querySelector('.profile__avatar').src = userInfo.avatar;
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
const cardModalLinkElement = document.querySelector(".add-card__link");
const cardModalNameElement = document.querySelector(".add-card__name");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardModalFormElement = cardModal.querySelector(".modal__form");
const cardModalSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardModalLinkInput = cardModal.querySelector("#add-card-link-input");
const cardModalNameInput = cardModal.querySelector("#add-card-name-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement =
  previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const avatarModal = document.querySelector("#avatar-modal");
const avatarModalFormElement = avatarModal.querySelector(".modal__form");
const avatarModalSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarModalCloseButton = avatarModal.querySelector(".modal__close-button");
const avatarModalLinkInput = avatarModal.querySelector("#profile-avatar-input");
const avatarImage = document.querySelector(".profile__avatar");

const deleteModal = document.querySelector("#delete-modal");

const deleteModalForm = deleteModal.querySelector(".modal__form");

deleteModalForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const cardToDelete = document.querySelector(`[data-card-id = "${cardIdToDelete}"]`);

  api.deleteCard(cardIdToDelete)
    .then(() => {
      cardToDelete.remove();
      closeModal(deleteModal);
    })
    .catch((err) => console.error(err));
});

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

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
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

document.addEventListener("DOMContentLoaded", () => {
  setupCloseButtonListeners();

  const editProfileModal = document.querySelector("#edit-modal");
});

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
  evt.preventDefault();
  api.editUserInfo({ name: editModalNameInput.value, about: editModalDescriptionInput.value })
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error);

}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}
function handleCardModalFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: cardModalNameInput.value,
    link: cardModalLinkInput.value,
  };

  api.addNewCard(inputValues)
    .then((newCard) => {
      renderCard(newCard);
      evt.target.reset();
      disableButton(cardModalSubmitButton, validationConfig);
      closeModal(cardModal);
    })
    .catch(console.error);
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
  evt.preventDefault();
  api.updateAvatar({ avatar: avatarModalLinkInput.value })
    .then((data) => {
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch((error) => {
    });
}

avatarModalFormElement.addEventListener("submit", handleAvatarFormSubmit);
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardModalFormElement.addEventListener("submit", handleCardModalFormSubmit);



enableValidation(validationConfig);

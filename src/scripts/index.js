import { enableValidation, validationConfig, resetValidation } from "./validation.js";

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

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__new-post-button");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const cardModalLinkElement = document.querySelector("add-card__link");
const cardModalNameElement = document.querySelector("add-card__name");

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

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

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
    cardElement.remove();
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
  editProfileModal.classList.remove("modal_is-opened");
});

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
  document.removeEventListener("mousedown", handleOverlay);
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
  profileNameElement.textContent = editModalNameInput.value;
  profileDescriptionElement.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
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
  renderCard(inputValues);
  evt.target.reset();
  disableButton(cardModalSubmitButton, settings);
  closeModal(cardModal);
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

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardModalFormElement.addEventListener("submit", handleCardModalFormSubmit);

initialCards.forEach((item) => {
  renderCard(item, "append");
});

enableValidation(validationConfig);

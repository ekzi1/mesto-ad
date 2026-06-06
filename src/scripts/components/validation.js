// Показ сообщения об ошибке
const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  if (errorElement) {
    errorElement.classList.add(config.errorClass);
    errorElement.textContent = errorMessage;
  }
};

// Скрытие сообщения об ошибке
const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  if (errorElement) {
    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = '';
  }
};

// Проверка валидности поля
const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    let errorMessage = '';
    
    if (inputElement.validity.valueMissing) {
      errorMessage = 'Вы пропустили это поле.';
    } else if (inputElement.validity.tooShort) {
      errorMessage = `Минимальное количество символов — ${inputElement.minLength}.`;
    } else if (inputElement.validity.tooLong) {
      errorMessage = `Максимальное количество символов — ${inputElement.maxLength}.`;
    } else if (inputElement.validity.typeMismatch || inputElement.validity.patternMismatch) {
      if (inputElement.dataset.errorMessage) {
        errorMessage = inputElement.dataset.errorMessage;
      } else {
        errorMessage = 'Введите URL адрес.';
      }
    } else {
      errorMessage = inputElement.validationMessage;
    }
    
    showInputError(formElement, inputElement, errorMessage, config);
    return false;
  }
  
  hideInputError(formElement, inputElement, config);
  return true;
};

// Проверка наличия невалидных полей
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

// Отключение кнопки
const disableSubmitButton = (submitButton, config) => {
  submitButton.classList.add(config.inactiveButtonClass);
  submitButton.disabled = true;
};

// Включение кнопки
const enableSubmitButton = (submitButton, config) => {
  submitButton.classList.remove(config.inactiveButtonClass);
  submitButton.disabled = false;
};

// Переключение состояния кнопки
const toggleButtonState = (inputList, submitButton, config) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(submitButton, config);
  } else {
    enableSubmitButton(submitButton, config);
  }
};

// Установка обработчиков событий
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const submitButton = formElement.querySelector(config.submitButtonSelector);
  
  toggleButtonState(inputList, submitButton, config);
  
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, submitButton, config);
    });
  });
};

// Очистка валидации формы
const clearValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const submitButton = formElement.querySelector(config.submitButtonSelector);
  
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });
  
  disableSubmitButton(submitButton, config);
};

// Включение валидации
const enableValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};

export {
  showInputError,
  hideInputError,
  checkInputValidity,
  hasInvalidInput,
  disableSubmitButton,
  enableSubmitButton,
  toggleButtonState,
  setEventListeners,
  clearValidation,
  enableValidation,
};

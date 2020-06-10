'use strict';
(function () {
  var imgUpload = document.querySelector('.img-upload');
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';

  var MAX_BLUR = 3;
  var MIN_HEAT = 1;
  var MAX_HEAT = 3;
  var QUANTITY_MAX_HASHTAGS = 5;
  var MAX_LENGTH_HASHTAG = 20;
  var DEFAULT_FILTER = 'none';
  var DEFAULT_FILTER_LEVEL = 100;
  var uploadEffect = document.querySelector('.img-upload__overlay');
  var uploadImagePreview = document.querySelector('.img-upload__preview');
  var filterLevelArea = document.querySelector('.img-upload__effect-level');
  var filterUploadLevelValue = document.querySelector('.effect-level__value');

  // слайдер, задающий глубину эффекта
  var filterLevelPin = document.querySelector('.effect-level__pin');
  var filterLevelBar = document.querySelector('.effect-level__line');
  var filterLevelValue = document.querySelector('.effect-level__depth');
  var currentFilter = DEFAULT_FILTER;

  var UPLOAD_RESIZE_STEP = 25;
  var UPLOAD_RESIZE_MIN = 25;
  var UPLOAD_RESIZE_MAX = 100;
  var DEFAULT_SCALE = 50;

  var uploadForm = document.querySelector('.img-upload__form');

  var closePreview = function () {
    // document.removeEventListener('keydown', onEscClosePreview);
    document.querySelector('.img-upload__overlay').classList.add('hidden');
  };

  var onEscClosePreview = function (evt) {
    if (evt.key === ESC_KEY) {
      closePreview();
    }
  };

  var onEnterClosePreview = function (evt) {
    if (evt.key === ENTER_KEY) {
      closePreview();
    }
  };

  var onMouseButtonClosePreview = function (evt) {
    if (evt.button === 0) {
      closePreview();
    }
  };

  imgUpload.querySelector('.img-upload__cancel').addEventListener('click', onMouseButtonClosePreview);
  imgUpload.querySelector('.img-upload__cancel').addEventListener('keydown', onEnterClosePreview);
  document.addEventListener('keydown', onEscClosePreview);

  var filterFunctions = {
    'none': function () {
      return '';
    },
    'chrome': function (level) {
      return 'grayscale(' + level / 100 + ')';
    },
    'sepia': function (level) {
      return 'sepia(' + level / 100 + ')';
    },
    'marvin': function (level) {
      return 'invert(' + level + '%)';
    },
    'phobos': function (level) {
      return 'blur(' + level / 100 * MAX_BLUR + 'px)';
    },
    'heat': function (level) {
      return 'brightness(' + (level / 100 * (MAX_HEAT - MIN_HEAT) + MIN_HEAT) + ')';
    }
  };

  var setFilterLevelValue = function (level) {
    filterUploadLevelValue.value = level;
    uploadImagePreview.style.filter = filterFunctions[currentFilter](level);
  };
  filterLevelArea.classList.toggle('hidden', currentFilter === DEFAULT_FILTER);
  var setFilterForUploadImage = function (filterName) {
    filterLevelArea.classList.toggle('hidden', filterName === DEFAULT_FILTER);
    uploadImagePreview.classList.remove('effects__preview--' + currentFilter);
    uploadImagePreview.classList.toggle('effects__preview--' + filterName, filterName !== DEFAULT_FILTER);
    currentFilter = filterName;
    setDefaultLevelValue();
  };

  uploadEffect.addEventListener('click', function (evt) {
    if (evt.target.type === 'radio') {
      var filterName = evt.target.value;
      setFilterForUploadImage(filterName);
    }
  });

  var setDefaultLevelValue = function () {
    setFilterLevelValue(DEFAULT_FILTER_LEVEL);
    setFilterPinPosition(DEFAULT_FILTER_LEVEL);
  };

  // находит смещение пина
  var getPinOffsetOfInPercent = function (value) {
    var valueInRange = Math.min(Math.max(0, value), filterLevelBar.offsetWidth);
    return valueInRange * 100 / filterLevelBar.offsetWidth;

  };

  // находит позицию пина в процентах
  var setFilterPinPosition = function (position) {
    filterLevelPin.style.left = position + '%';
    filterLevelValue.style.width = position + '%';
  };

  filterLevelPin.addEventListener('mousedown', function (evt) {
    // clientX числовое значение горизонтальной координаты
    var startPosition = evt.clientX;
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      // offsetLeft возвращает смещение в пикселях верхнего левого угла текущего элемента от родительского
      var shift = startPosition - moveEvt.clientX;
      var newPosition = filterLevelPin.offsetLeft - shift;
      var newOffset = getPinOffsetOfInPercent(newPosition);
      setFilterPinPosition(newOffset);
      setFilterLevelValue(newOffset);
      startPosition = moveEvt.clientX;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var uploadResizeField = document.querySelector('.scale__control--value');
  // находит изображение для трансформации
  var uploadImagePreviewForScale = document.querySelector('.img-upload__preview img');

  uploadResizeField.value = DEFAULT_SCALE + '%';
  uploadImagePreviewForScale.style.transform = 'scale(' + 0.5 + ')';

  var getScaleRange = function (step) {
    return Math.min(UPLOAD_RESIZE_MAX, Math.max(UPLOAD_RESIZE_MIN, step));
  };

  var changeScale = function (step) {
    var scalePercent = parseInt(uploadResizeField.value, 10);
    var newScalePercent = getScaleRange(scalePercent + step);
    uploadResizeField.value = newScalePercent + '%';
    uploadImagePreviewForScale.style.transform = 'scale(' + newScalePercent / 100 + ')';
  };

  var onResizePlus = function () {
    changeScale(UPLOAD_RESIZE_STEP);
  };

  var onResizeMinus = function () {
    changeScale(-UPLOAD_RESIZE_STEP);
  };

  document.querySelector('.scale__control--bigger').addEventListener('click', onResizePlus);
  document.querySelector('.scale__control--smaller').addEventListener('click', onResizeMinus);

  var onInputsOffEsc = function (evt) {
    if (evt.key === ESC_KEY) {
      evt.stopPropagation();
      document.removeEventListener('keydown', onInputsOffEsc);
    }
  };
  document.querySelector('.img-upload__text').addEventListener('keydown', onInputsOffEsc);

  var clearForm = function () {
    uploadForm.reset();
    document.querySelector('.imgUpload').src = 'img/upload-default-image.jpg';
  };

  var showSuccessMessage = function () {
    var main = document.querySelector('main');
    var successTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
    var successElement = successTemplate.cloneNode(true);
    document.addEventListener('click', onClickCloseSuccessMessage);
    document.addEventListener('keydown', onEscCloseSuccessMessage);

    return main.appendChild(successElement);
  };

  var showErrorMessage = function () {
    var main = document.querySelector('main');

    var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    var errorButton = errorElement.querySelector('.error__button');
    errorButton.addEventListener('click', onClickCloseErrorMessage);
    document.addEventListener('click', onClickCloseErrorMessage);
    document.addEventListener('keydown', onEscCloseErrorMessage);

    return main.appendChild(errorElement);
  };

  var removeSuccessMessageEvtListener = function () {
    document.removeEventListener('keydown', onEscCloseSuccessMessage);
    document.removeEventListener('click', onClickCloseSuccessMessage);
  };

  var closeMessage = function (element) {
    document.querySelector(element).remove();
  };

  var onEscCloseSuccessMessage = function (evt) {
    if (evt.key === ESC_KEY) {
      closeMessage('.success');
      removeSuccessMessageEvtListener();
    }
  };

  var onClickCloseSuccessMessage = function (evt) {
    if (evt.button === 0) {
      closeMessage('.success');
      removeSuccessMessageEvtListener();
    }
  };

  var removeErrorMessageEvtListener = function () {
    document.removeEventListener('click', onClickCloseErrorMessage);
    document.removeEventListener('keydown', onEscCloseErrorMessage);
  };
  var onEscCloseErrorMessage = function (evt) {
    if (evt.key === ESC_KEY) {
      closeMessage('.error');
      removeErrorMessageEvtListener();
    }
  };

  var onClickCloseErrorMessage = function (evt) {
    if (evt.button === 0) {
      closeMessage('.error');
      removeErrorMessageEvtListener();
    }
  };

  var saveHandler = function () {
    clearForm();
    showSuccessMessage();
  };

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(uploadForm), saveHandler, showErrorMessage);
    document.querySelector('.img-upload__overlay').classList.add('hidden');
  });
})();

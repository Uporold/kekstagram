'use strict';
(function () {
  var imgUpload = document.querySelector('.img-upload');
  var hashTagInput = imgUpload.querySelector('.text__hashtags');

  var getFilteredArray = function (string, separator) {
    return string.split(separator)
      .filter(function (element) {
        return element.length;
      });

  };

  var checkCopies = function (array) {
    for (var i = 0; i < array.length; i++) {
      for (var j = i + 1; j < array.length; j++) {
        if (array[i].toLowerCase() === array[j].toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  };

  var checkHashTags = function (array) {
    if (array === '#' && array.length === 1) {
      hashTagInput.setCustomValidity('Хештег не может состоять только из #');
    } else if (array[0] !== '#') {
      hashTagInput.setCustomValidity('Все хештеги должны начинаться с #');
    } else if (!array.match(/^[#][0-9A-Za-zа-яА-ЯёЁ]*$/) && array.length) {
      hashTagInput.setCustomValidity('Спецсимволы (#, @, $ и т.п.) - запрещены');
    } else if (array.length > 20) {
      hashTagInput.setCustomValidity('Максимальная длина 1 хештега - 20 символов');
    }
  };


  var onHashTagInputValidate = function () {
    hashTagInput.setCustomValidity('');

    var hashTagArray = getFilteredArray(hashTagInput.value, ' ');

    if (hashTagArray.length > 5) {
      hashTagInput.setCustomValidity('Не более 5-ти хештегов');
    } else if (checkCopies(hashTagArray)) {
      hashTagInput.setCustomValidity('Без повторений');
    } else if (hashTagArray.length > 0) {
      hashTagArray.forEach(function (element) {
        checkHashTags(element);
      });
    }
  };

  hashTagInput.addEventListener('input', onHashTagInputValidate);

})();

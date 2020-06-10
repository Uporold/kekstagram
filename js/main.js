'use strict';

var items = [];


var renderPictures = function (data) {
  var fragment = document.createDocumentFragment();
  data.forEach(function (elem) {
    fragment.appendChild(window.renderPicture(elem));
  });
  document.querySelector('.pictures').appendChild(fragment);
};

var enableSortPictures = function () {
  document.querySelector('.img-filters ').classList.remove('img-filters--inactive');
  document.querySelector('.img-filters ').addEventListener('click', onImgFiltersContainerClick);
};
var onSuccessLoadHandler = function (data) {
  items = data;
  renderPictures(data);
  enableSortPictures();
};
var getFiltered = {
  'filter-default': function (data) {
    removePictures();
    renderPictures(data);
  },
  'filter-random': function (data) {
    removePictures();
    renderPictures(shuffleArray(data.slice()).slice(10));
  },
  'filter-discussed': function (data) {
    removePictures();
    renderPictures(data.slice().sort(function (a, b) {
      return b.comments.length - a.comments.length;
    }));
  }
};
var removePictures = function () {
  var pictures = document.querySelectorAll('.picture');
  pictures.forEach(function (elem) {
    elem.remove();
  });
};

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};
var onImgFiltersContainerClick = function (evt) {
  var target = evt.target;
  var activeButton = document.querySelector('.img-filters ').querySelector('.img-filters__button--active');
  if (target !== activeButton && target.type === 'button') {
    activeButton.classList.remove('img-filters__button--active');
    target.classList.add('img-filters__button--active');
    window.debounce(getFiltered[target.id].bind(null, items));
  }
};

var onErrorLoadHandler = function (errorMessage) {
  var node = document.createElement('div');
  node.style = 'z-index: 100; text-align: center; background-color: red; position: sticky; top: 0; font-size: 30px;';
  node.textContent = errorMessage;
  document.body.insertAdjacentElement('afterbegin', node);
};

window.backend.load(onSuccessLoadHandler, onErrorLoadHandler);



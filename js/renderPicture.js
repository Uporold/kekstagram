'use strict';
(function () {
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  window.renderPicture = function (item) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('img').src = item.url;
    pictureElement.querySelector('.picture__likes').textContent = item.likes;
    pictureElement.querySelector('.picture__comments').textContent = item.comments.length;
    pictureElement.addEventListener('click', function () {
      window.renderBigPicture(item);
    });
    return pictureElement;
  };

})();

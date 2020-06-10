'use strict';
(function () {
  var socialComments = document.querySelector('.social__comments');
  var bigPicture = document.querySelector('.big-picture');

  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';

  var createComment = function (comment) {
    var commentElement = document.createElement('li');
    var userIconElement = document.createElement('img');
    var commentText = document.createElement('p');
    commentText.classList.add('social__text');
    commentText.textContent = comment.message;
    commentElement.classList.add('social__comment');

    userIconElement.classList.add('social__picture');
    userIconElement.src = comment.avatar;
    userIconElement.alt = 'Аватар комментатора фотографии';
    userIconElement.width = 35;
    userIconElement.height = 35;

    commentElement.appendChild(userIconElement);
    commentElement.appendChild(commentText);

    return commentElement;
  };
  var commentCountElement = bigPicture.querySelector('.comments-count--current');

  var addedComments = null;
  var addComments = function (item) {
    for (var i = 0; i < item.comments.length; i++) {

      if (i < 5) {
        addedComments++;
        socialComments.appendChild(createComment(item.comments[i]));
      } else {
        socialComments.appendChild(createComment(item.comments[i])).classList.add('visually-hidden');
      }
    }


    commentCountElement.textContent = addedComments.toString();
  };

  window.renderBigPicture = function (item) {
    bigPicture.classList.remove('hidden');
    bigPicture.querySelector('img').src = item.url;
    bigPicture.querySelector('img').alt = item.description;
    bigPicture.querySelector('.likes-count').textContent = item.likes;
    bigPicture.querySelector('.comments-count').textContent = item.comments.length;
    bigPicture.querySelector('.social__caption').textContent = item.description;
    socialComments.innerHTML = '';
    addComments(item);
    bigPicture.querySelector('.social__comments-loader').addEventListener('click', onMouseClick);
    bigPicture.querySelector('.big-picture__cancel').addEventListener('click', onMouseButtonCloseCard);
    bigPicture.querySelector('.big-picture__cancel').addEventListener('keydown', onEnterCloseCard);
    document.addEventListener('keydown', onEscCloseCard);
    bigPicture.querySelector('.social__comments-loader').classList.toggle('visually-hidden', socialComments.querySelectorAll('.visually-hidden').length === 0);
    return item;
  };

  var onMouseClick = function (evt) {
    // evt.preventDefault();
    if (evt.button === 0) {
      var hiddenComments = socialComments.querySelectorAll('.visually-hidden');
      for (var i = 0; i < hiddenComments.length; i++) {
        addedComments++;
        hiddenComments[i].classList.remove('visually-hidden');
        if (i > 3) {
          break;
        }
      }
      commentCountElement.textContent = addedComments.toString();
      bigPicture.querySelector('.social__comments-loader').classList.toggle('visually-hidden', socialComments.querySelectorAll('.visually-hidden').length === 0);
    }
  };

  var closeBigPicture = function () {
    addedComments = null;
    document.removeEventListener('keydown', onEscCloseCard);
    document.querySelector('.big-picture').classList.add('hidden');
    bigPicture.querySelector('.social__comments-loader').classList.remove('visually-hidden');
  };

  var onEscCloseCard = function (evt) {
    if (evt.key === ESC_KEY) {
      closeBigPicture();
    }
  };

  var onEnterCloseCard = function (evt) {
    if (evt.key === ENTER_KEY) {
      closeBigPicture();
    }
  };

  var onMouseButtonCloseCard = function (evt) {
    if (evt.button === 0) {
      closeBigPicture();
    }
  };

})();

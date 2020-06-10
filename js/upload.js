'use strict';

(function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png'];

  var imagePreview = function (input, previewDestination) {

    var fileChooser = document.querySelector(input);
    var preview = document.querySelector(previewDestination);

    fileChooser.addEventListener('change', function () {
      document.querySelector('.img-upload__overlay').classList.remove('hidden');
      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          preview.src = reader.result;
          document.querySelectorAll('.effects__preview ').forEach(function (elem) {
            elem.style.backgroundImage = 'url(' + reader.result + ')';
          });
        });

        reader.readAsDataURL(file);
      }
    });
  };
  imagePreview('#upload-file', '.imgUpload');
})();

/* -- Hide and Show buttons functionality -- */
function hideAndShow() {
  const buttons = document.querySelectorAll("button.hide-button");
  const content = document.querySelectorAll(".content");

  for (let [i, button] of buttons.entries()) {
    button.addEventListener("click", () => {
      if (content[i].classList.contains("show")) {
        content[i].classList.remove("show");
        content[i].classList.add("hide");
        button.innerHTML = "Mostrar";
      } else {
        content[i].classList.add("show");
        content[i].classList.remove("hide");
        button.innerHTML = "Esconder";
      }
    });
  }
}
hideAndShow();

function activeMenu() {
  /* -- Selected Links -- */
  const currentPage = location.pathname;
  const menuItems = document.querySelectorAll('header .links a');

  for (item of menuItems) {
    if (currentPage.includes(item.getAttribute('href'))) {
      item.classList.add('active');
    }
  }
}
activeMenu();

const PhotosUpload = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploadLimit: 5,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target;
    PhotosUpload.input = event.target;

    if (PhotosUpload.hasLimit(event)) return;

    Array.from(fileList).forEach(file => {
      const reader = new FileReader();

      PhotosUpload.files.push(file);

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);

        PhotosUpload.preview.appendChild(div);
      }

      reader.readAsDataURL(file)

    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload;
    const { files: fileList, } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} arquivos!`);
      event.preventDefault();
      return true;
    }

    const PhotoDiv = [];
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "photo") {
        PhotoDiv.push(item);
      }
    });

    const totalPhotos = fileList.length + PhotoDiv.length;

    if (totalPhotos > uploadLimit) {
      alert("Você ultrapassou o limite máximo de fotos!")

      event.preventDefault();

      return true;
    }

    return false;
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").ClipboardData || new DataTransfer();

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement('div');
    div.classList.add('photo');

    div.onclick = PhotosUpload.removePhoto;

    div.appendChild(image);

    div.appendChild(PhotosUpload.getRemoveButton());

    return div;
  },
  getRemoveButton() {
    const button = document.createElement('i');
    button.classList.add('material-icons');

    button.innerHTML = 'close';

    return button;
  },
  removePhoto(event) {
    const PhotoDiv = event.target.parentNode;
    const PhotosArray = Array.from(PhotosUpload.preview.children);
    const index = PhotosArray.indexOf(PhotoDiv);

    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    PhotoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    if (photoDiv) {
      const removedFiles = document.querySelector('input[name="removed_files"]');

      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`;
      }
    }

    photoDiv.remove();
  }
}

const ImageGallery = {
  highlight: document.querySelector('.food-image .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(event) {
    const { target } = event;

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'));

    target.classList.add('active');

    ImageGallery.highlight.src = target.src

  }
}
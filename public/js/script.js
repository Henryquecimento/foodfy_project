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

/* Pagination */
function paginate(selectedPage, totalPages) {
  let pages = [],
    oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if (firstAndLastPage || pagesAfterSelectedPage && pagesBeforeSelectedPage) {

      if (oldPage && currentPage - oldPage > 2) {
        pages.push('...');
      }

      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1)
      }

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }

  return pages;
}

function createPagination(pagination) {
  const filter = pagination.dataset.filter;
  const page = Number(pagination.dataset.page);
  const total = Number(pagination.dataset.total);

  const pages = paginate(page, total);

  let elements = "";

  for (let page of pages) {
    if (String(page).includes('...')) {
      elements += `<span>${page}</span>`;
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
      } else {
        elements += `<a href="?page=${page}">${page}</a>`;
      }
    }
  }

  pagination.innerHTML = elements;
}

const pagination = document.querySelector('.pagination');

if (pagination) {
  createPagination(pagination);
}

/* Photos upload */
const PhotosUpload = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploadLimit: 5,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target;
    PhotosUpload.input = event.target;

    if (PhotosUpload.hasLimit(event)) {
      PhotosUpload.updateFilesInput();

      return;
    }

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

    PhotosUpload.updateFilesInput();
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

    const newPhotos = Array.from(PhotosUpload.preview.children).filter(file => {
      if (file.classList.contains('photo') && !file.getAttribute('id')) return true;
    })

    const index = newPhotos.indexOf(PhotoDiv);

    PhotosUpload.files.splice(index, 1);
    PhotosUpload.updateFilesInput();

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
  },
  updateFilesInput() {
    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  }
}

const ImageGallery = {
  highlight: document.querySelector('.food-image .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(event) {
    const { target } = event;

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'));

    target.classList.add('active');

    ImageGallery.highlight.src = target.src;
    Lightbox.image.src = target.src;

  }
}

const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
  open() {
    Lightbox.target.style.opacity = 1;
    Lightbox.target.style.top = 0;
    Lightbox.target.style.bottom = 0;
    Lightbox.closeButton.style.top = 0;
  },
  close() {
    Lightbox.target.style.opacity = 0;
    Lightbox.target.style.top = "-100%";
    Lightbox.target.style.bottom = "initial";
    Lightbox.closeButton.style.top = "-80px";
  }
}

/* VALIDATIONS */
const Validate = {
  apply(input, func) {
    Validate.clearErrors(input);

    let results = Validate[func](input.value);
    input.value = results.value;

    if (results.error) {
      Validate.displayErrors(input, results.error);
    }
  },
  displayErrors(input, error) {
    const div = document.createElement("div");
    div.classList.add('error');

    div.innerHTML = error;

    input.parentNode.appendChild(div);

    input.focus();
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector('.error');

    if (errorDiv) errorDiv.remove();
  },
  isEmail(value) {
    let error = null;

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value.match(mailFormat)) {
      error = "Email Inválido";
    }

    return {
      error,
      value
    }
  }
}

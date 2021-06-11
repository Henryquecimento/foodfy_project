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
  preview: document.querySelector("#photos-preview"),
  uploadLimit: 5,
  handleFileInput(event) {
    const { files: fileList } = event.target;

    if (PhotosUpload.hasLimit(event)) return;

    Array.from(fileList).forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);

        PhotosUpload.preview.appendChild(div);
      }

      reader.readAsDataURL(file)

    });
  },
  hasLimit(event) {
    const { files: fileList } = event.target;
    const { uploadLimit } = PhotosUpload;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} arquivos!`);
      event.preventDefault();
      return true;
    }

    return false;
  },
  getContainer(image) {
    const div = document.createElement('div');
    div.classList.add('photo');

    div.onclick = () => alert('remover foto');

    div.appendChild(image);

    return div;
  }
}
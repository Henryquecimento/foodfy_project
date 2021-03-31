/* -- Hide and Show buttons functionality -- */

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

/* -- Selected Links -- */
const currentPage = location.pathname;
const menuItems = document.querySelectorAll('header .links a');

for (item of menuItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active');
  }
}

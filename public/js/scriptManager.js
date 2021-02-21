/* Admin - Recipes Maneger Manager */
const recipes = document.querySelectorAll(".recipe button");

const buttons = document.querySelectorAll('button.hide-button');
const content = document.querySelectorAll('.content');

for (let index = 0; recipes.length; index++) {
    recipes[index].addEventListener('click', () => {

        window.location.href = `recipes/${index}`;

    });
};

for (let [i, button] of buttons.entries()) {
    button.addEventListener('click', () => {
        if (content[i].classList.contains('show')) {
            content[i].classList.remove('show');
            content[i].classList.add('hide');
            button.innerHTML = 'Mostrar';
        } else {
            content[i].classList.add('show');
            content[i].classList.remove('hide');
            button.innerHTML = 'Esconder';
        };
    });
};

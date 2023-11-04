const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
const cardsWrap = document.querySelector('.cards__wrapper');
const cardsItems = document.querySelectorAll('.cards__item');
const burger = document.querySelector('.burger');
const menuWrap = document.querySelector('.header__menu-wrapper');

burger.addEventListener('click', () => {
    document.body.classList.toggle('mobile-menu');

    if (document.body.classList.contains('mobile-menu')) {
        menuWrap.addEventListener('click', event => {
            if (event.target.classList.contains('nav__item') || event.target.classList.contains('btn') || event.target.classList.contains('nav__item-link') || event.target.classList.contains('header__social-img')) {
                document.body.classList.remove('mobile-menu')
            }
        })
    }
})

if (document.body.classList.contains('mobile-menu')) {
    menuWrap.addEventListener('click', (event) => {
        if (event.currentTarget.classList.contains('nav__item') || event.currentTarget.classList.contains('header__social') || event.currentTarget.classList.contains('header__btn')) {
            document.body.classList.remove('mobile-menu')
        }
    })
}

let currentCard = 0;

const cardsCount = cardsItems.length;

let cardsItemWidth = 0;

cardsItems.forEach(cardsItem => {
    cardsItemWidth += (parseInt(cardsItem.clientWidth) / cardsCount);
})

const cardsWrapGap = parseInt(window.getComputedStyle(cardsWrap).getPropertyValue('gap'));

rightArrow.addEventListener('click', () => changeSlides('right'))

leftArrow.addEventListener('click', () => changeSlides('left'))

function changeSlides(direction) {
    if (direction === 'right') {
        if (currentCard < cardsCount - 1) {
            leftArrow.style.display = 'block';
            currentCard++
        } else if (currentCard == cardsCount - 1) {
            rightArrow.style.display = 'none';
        }
    } else if (direction === 'left') {
        if (currentCard > 0) {
            rightArrow.style.display = 'block';
            currentCard--
        } else if (currentCard == 0) {
            leftArrow.style.display = 'none';
        }
    }

    cardsWrap.style.transform = `translateX(-${currentCard * (cardsWrapGap + cardsItemWidth)}px)`
    console.log(cardsWrapGap + cardsItemWidth);
}

document.getElementById('first-input').addEventListener('keydown', (event) => {
    if (event.key == 13) {
        console.log('hello');
        event.preventDefault();
        document.getElementById('second-input').focus();
    }
});

/* Phone Mask */
mask('[data-tel-input]');

const phoneInput = document.querySelectorAll('[data-tel-input]');
phoneInput.forEach(function(input) {
    input.addEventListener('input', removePhonePlus)
    input.addEventListener('blur', removePhonePlus)

    function removePhonePlus() {
        if (input.value == '+') {
            input.value = '';
        }
    }
})
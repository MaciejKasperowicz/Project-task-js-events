const init = function() {
    const imagesList = document.querySelectorAll('.gallery__item');
    imagesList.forEach( img => {
        img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
    }); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia
    
    runJSSlider();
}

document.addEventListener('DOMContentLoaded', init);

const runJSSlider = function() {
    const imagesSelector = '.gallery__item';
    const sliderRootSelector = '.js-slider'; 

    const imagesList = document.querySelectorAll(imagesSelector);
    
    const sliderRootElement = document.querySelector(sliderRootSelector);
    initEvents(imagesList, sliderRootElement);
    initCustomEvents(imagesList, sliderRootElement, imagesSelector);
    
}
let autoSwitchingInterval;
const initEvents = function(imagesList, sliderRootElement) {
    imagesList.forEach( function(item)  {
        item.addEventListener('click', function(e) {
            fireCustomEvent(e.currentTarget, 'js-slider-img-click');
            fireCustomEvent(sliderRootElement, 'js-slider-auto-switch');
        });
        
    });
    
    // todo: 
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
    // na elemencie [.js-slider__nav--next]
    const navNext = sliderRootElement.querySelector('.js-slider__nav--next');
    navNext.addEventListener("click", function(){
        fireCustomEvent(navNext, "js-slider-img-next");
        //Additional task 2: disable automatic switching
        clearInterval(autoSwitchingInterval);
    })

    // todo:
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
    // na elemencie [.js-slider__nav--prev]
    const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');
    navPrev.addEventListener("click", function(){
        fireCustomEvent(navPrev, "js-slider-img-prev");
        //Additional task 2: disable automatic switching
        clearInterval(autoSwitchingInterval);
    })

    // todo:
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
    // tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
    const zoom = sliderRootElement.querySelector('.js-slider__zoom');
    zoom.addEventListener("click", function(e){
        // console.log(e.target)
        // console.log(e.currentTarget)
        if(e.target === e.currentTarget){
            fireCustomEvent(zoom, "js-slider-close");
        }
        //Additional task 2: disable automatic switching
        clearInterval(autoSwitchingInterval);
    })
    
}

const fireCustomEvent = function(element, name) {
    // console.log(element.className, '=>', name);
    const event = new CustomEvent(name, {
        bubbles: true,
    });

    element.dispatchEvent( event );
}

const initCustomEvents = function(imagesList, sliderRootElement, imagesSelector) {
    imagesList.forEach(function(img) {
        img.addEventListener('js-slider-img-click', function(event) {
            onImageClick(event, sliderRootElement, imagesSelector);
        });
    });
    sliderRootElement.addEventListener('js-slider-img-next', onImageNext);
    sliderRootElement.addEventListener('js-slider-img-prev', onImagePrev);
    sliderRootElement.addEventListener('js-slider-close', onClose);
    ///////////apply autoswitching event//////////////////////////////////////////
    sliderRootElement.addEventListener('js-slider-auto-switch', function(){
        onAutoSwitch(2000);
    });
    ////////////////////////////////////////////////////////////////////////
}

const onAutoSwitch = function(time){
    autoSwitchingInterval = setInterval(onImageNext, time) 
}

const onImageClick = function(event, sliderRootElement, imagesSelector) {
    // todo:
    // 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
    // 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
    // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
    // 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
    // 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
    // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany

    sliderRootElement.classList.add("js-slider--active");
    const sliderImage = sliderRootElement.querySelector(".js-slider__image");
    const currentFigure = event.target;
    const imgSrc = currentFigure.firstElementChild.getAttribute("src");
    sliderImage.src = imgSrc;

    const groupName = event.target.dataset.sliderGroupName;
    const figBelongsToGroup = document.querySelectorAll(`${imagesSelector}[data-slider-group-name="${groupName}"]`);
    const sliderThumbs = document.querySelector(".js-slider__thumbs");
    figBelongsToGroup.forEach(fig =>{
        const clonedFigure = fig.cloneNode(true);
        clonedFigure.className = "js-slider__thumbs-item";
        clonedFigure.firstElementChild.className = "js-slider__thumbs-image";
        
        if(clonedFigure.firstElementChild.getAttribute("src") === sliderImage.getAttribute("src") ) {
            clonedFigure.firstElementChild.classList.add("js-slider__thumbs-image--current");
        }
        // remove caption
        clonedFigure.removeChild(clonedFigure.lastElementChild);
        sliderThumbs.appendChild(clonedFigure);
    });
}

function getElementsForSwitching(currentThumbsImageSelector, sliderImageSelector, sliderThumbsSelector){
    const currentElement = document.querySelector(currentThumbsImageSelector);
    const currentElementParent = currentElement.parentElement;
    const nextElementParent = currentElementParent.nextElementSibling;
    const prevElementParent = currentElementParent.previousElementSibling;
    const sliderImage = document.querySelector(sliderImageSelector);
    const sliderThumbs = document.querySelector(sliderThumbsSelector);
    const firstSliderThumbsElement = sliderThumbs.firstElementChild.nextElementSibling;
    const lastSliderThumbsElement = sliderThumbs.lastElementChild;
    return{
        currentElement,
        nextElementParent,
        prevElementParent,
        sliderImage,
        firstSliderThumbsElement,
        lastSliderThumbsElement
    }
}
function changeSelectedThumbsImage(element, className ){
    element.firstElementChild.classList.add(className);
}

function changeSliderImage(element, elementParent){
    element.src = elementParent.firstElementChild.getAttribute("src");
}


const onImageNext = function(event) {
    // console.log(this, 'onImageNext');
    // // [this] wskazuje na element [.js-slider]

    // todo:
    // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
    // 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
    // 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    // 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]
    
    const elementsForSwitching = getElementsForSwitching(".js-slider__thumbs-image--current", ".js-slider__image", ".js-slider__thumbs");
    const {currentElement, nextElementParent, sliderImage, firstSliderThumbsElement} = elementsForSwitching;
    currentElement.classList.remove("js-slider__thumbs-image--current");

    if(nextElementParent){
        changeSelectedThumbsImage(nextElementParent, "js-slider__thumbs-image--current");
        changeSliderImage(sliderImage, nextElementParent);
    } else {
        //Additional task 1: endless switching
        changeSelectedThumbsImage(firstSliderThumbsElement, "js-slider__thumbs-image--current")
        changeSliderImage(sliderImage, firstSliderThumbsElement);
    }
    
}

const onImagePrev = function(event) {
    // console.log(this, 'onImagePrev');
    // [this] wskazuje na element [.js-slider]

    // todo:
    // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
    // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
    // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    // 5. podmienić atrybut [src] dla [.js-slider__image]

    const elementsForSwitching = getElementsForSwitching(".js-slider__thumbs-image--current", ".js-slider__image", ".js-slider__thumbs");
    const {currentElement, prevElementParent, sliderImage, lastSliderThumbsElement} = elementsForSwitching;
    currentElement.classList.remove("js-slider__thumbs-image--current");

    if(prevElementParent && !prevElementParent.classList.contains("js-slider__thumbs-item--prototype")){
        changeSelectedThumbsImage(prevElementParent, "js-slider__thumbs-image--current");
        changeSliderImage(sliderImage, prevElementParent)

    } else {
        //Additional task 1: endless switching
        changeSelectedThumbsImage(lastSliderThumbsElement, "js-slider__thumbs-image--current")
        changeSliderImage(sliderImage, lastSliderThumbsElement);
    }
}

const onClose = function(event) {
    console.log("zamknięcie")
    // todo:
    // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
    const jsSlider = document.querySelector(".js-slider");
    jsSlider.classList.remove("js-slider--active");
    
    // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
    const jsSliderThumbs = document.querySelector(".js-slider__thumbs");
    const prototypeItem = jsSliderThumbs.firstElementChild;
    

    jsSliderThumbs.innerHTML= "";
    jsSliderThumbs.appendChild(prototypeItem);
}
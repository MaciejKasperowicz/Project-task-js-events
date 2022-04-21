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

const initEvents = function(imagesList, sliderRootElement) {
    imagesList.forEach( function(item)  {
        item.addEventListener('click', function(e) {
            fireCustomEvent(e.currentTarget, 'js-slider-img-click');
        });
        
    });

    // todo: 
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
    // na elemencie [.js-slider__nav--next]
    const navNext = sliderRootElement.querySelector('.js-slider__nav--next');
    navNext.addEventListener("click", function(){
        fireCustomEvent(navNext, "js-slider-img-next");
    })

    // todo:
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
    // na elemencie [.js-slider__nav--prev]
    const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');
    navPrev.addEventListener("click", function(){
        fireCustomEvent(navPrev, "js-slider-img-prev")
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
    })
    
}

const fireCustomEvent = function(element, name) {
    console.log(element.className, '=>', name);

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
}

const onImageClick = function(event, sliderRootElement, imagesSelector) {
    // todo:  

    // 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
    sliderRootElement.classList.add("js-slider--active");

    // 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
    const sliderImage = sliderRootElement.querySelector(".js-slider__image");
    const currentFigure = event.target;
    const imgSrc = currentFigure.firstElementChild.getAttribute("src");
    sliderImage.src = imgSrc;

    // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
    const groupName = event.target.dataset.sliderGroupName;

    // 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
    const figBelongsToGroup = document.querySelectorAll(`${imagesSelector}[data-slider-group-name="${groupName}"]`);

    // 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
    // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany
    const sliderThumbs = document.querySelector(".js-slider__thumbs");
    figBelongsToGroup.forEach(fig =>{
        fig.className = "js-slider__thumbs-item";
        fig.firstElementChild.className = "js-slider__thumbs-image";
        
        if(fig.firstElementChild.getAttribute("src") === sliderImage.getAttribute("src") ) {
            fig.firstElementChild.classList.add("js-slider__thumbs-image--current");
        }
        // remove caption
        fig.removeChild(fig.lastElementChild)
        sliderThumbs.appendChild(fig)
    })
   
    
    
}

const onImageNext = function(event) {
    console.log(this, 'onImageNext');
    // [this] wskazuje na element [.js-slider]
    
    // todo:

    // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
    const currentElement = document.querySelector(".js-slider__thumbs-image--current")
    const currentElementParent = currentElement.parentElement;
    // console.log(currentElementParent)

    // 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
    const nextElementParent = currentElementParent.nextElementSibling;
    

    // 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    // console.log(currentElementParent)
    // console.log(nextElementParent)
    if(nextElementParent){
        currentElement.classList.remove("js-slider__thumbs-image--current");
        nextElementParent.firstElementChild.classList.add("js-slider__thumbs-image--current");

        // 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]
        const sliderImage = document.querySelector(".js-slider__image");
        sliderImage.src = nextElementParent.firstElementChild.getAttribute("src");
    }
    
}

const onImagePrev = function(event) {
    console.log(this, 'onImagePrev');
    // [this] wskazuje na element [.js-slider]
    
    // todo:

    // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
    const currentElement = document.querySelector(".js-slider__thumbs-image--current")
    const currentElementParent = currentElement.parentElement;

    // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
    const prevElementParent = currentElementParent.previousElementSibling;

    // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    
    if(prevElementParent && !prevElementParent.classList.contains("js-slider__thumbs-item--prototype")){
        currentElement.classList.remove("js-slider__thumbs-image--current");
        prevElementParent.firstElementChild.classList.add("js-slider__thumbs-image--current");

        // 5. podmienić atrybut [src] dla [.js-slider__image]
        const sliderImage = document.querySelector(".js-slider__image");
        sliderImage.src = prevElementParent.firstElementChild.getAttribute("src");
    }
}

const onClose = function(event) {
    // todo:
    // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
    // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
}
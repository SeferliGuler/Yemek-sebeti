  
    function downFav() {
        
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const favContainer = document.querySelector('.fav');
        if (favContainer) {
            favContainer.innerHTML = '';

            favorites.forEach(menuData => {
                favContainer.insertAdjacentHTML('beforeend',
                    `
                    <div class="fav-div" data-id="${menuData.id}" data-price="${menuData.price}">
                        <div><img src="${menuData.url}"></div>
                        <div class="div1">
                            <div class="div2">
                                <button class="negativ" data-id="${menuData.id}"><i class="fa-solid fa-minus" style="color: #ffffff;"></i></button>
                                <input type="number" class="number" id="myInput-${menuData.id}" min="1" value="1">
                                <button class="positiv" data-id="${menuData.id}"><i class="fa-solid fa-plus" style="color: #ffffff;"></i></button>
                            </div>
                            <p class="name">${menuData.name}</p>
                            <p>Composition: ${menuData.content}</p>
                            <p>Price: ${menuData.price} EUR</p>
                            <div class="sebet-div">
                                <button class="sebet" data-id="${menuData.id}">Sil</button>
                            </div>
                        </div>
                    </div>
                    `
                );

                const lastFavDiv = favContainer.querySelector('.fav-div:last-child');
                const negativButton = lastFavDiv.querySelector('.negativ');
                const positivButton = lastFavDiv.querySelector('.positiv');
                const sebetButton = lastFavDiv.querySelector('.sebet');

                negativButton.addEventListener('click', () => {
                    const input = lastFavDiv.querySelector(`#myInput-${menuData.id}`);
                    if (input && input.value > 0) {
                        input.value = parseInt(input.value) - 1;
                        Sebet();
                    }
                });

                positivButton.addEventListener('click', () => {
                    const input = lastFavDiv.querySelector(`#myInput-${menuData.id}`);
                    if (input) {
                        input.value = parseInt(input.value) + 1;
                        Sebet();
                    }
                });

                sebetButton.addEventListener('click', () => {
                    lastFavDiv.remove();
                    clearFav(menuData.id);
                    Sebet();
                })
                
            });
            Sebet();
        }
    }

    function Sebet() {
        const favDivs = document.querySelectorAll('.fav-div');
        let total = 0;
        favDivs.forEach(favDiv => {
            const price = parseFloat(favDiv.dataset.price);
            const input = favDiv.querySelector(`input[type="number"]`);
            if (input) {
                const quantity = parseInt(input.value);
                total += quantity * price;
            }
        });
        const totalContainer = document.querySelector('.tutar');
        if (totalContainer) {
            totalContainer.textContent = `Toplam tutar: ${total.toFixed(2)} EUR`;
        }
    }

    function clearFav(id) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(menuData => menuData.id == id);
        localStorage.setItem('favorites', JSON.stringify(favorites));

        const favDivs = document.querySelectorAll('.fav-div');
        favDivs.forEach(favDiv => {
            if (favDiv.dataset.id === id) {
                favDiv.style.display = 'none';
            }
        });
        let addedItemIds = JSON.parse(localStorage.getItem('addedItemIds')) || [];
        addedItemIds = addedItemIds.filter(itemId => itemId == id);
        localStorage.setItem('addedItemIds', JSON.stringify(addedItemIds));

        Sebet();
    }


    function addFavorites(menuData) {
        const itemId = menuData.id;
        let addedItemIds = JSON.parse(localStorage.getItem('addedItemIds')) || [];
        if (!addedItemIds.includes(itemId)) {
            addedItemIds.push(itemId);
            localStorage.setItem('addedItemIds', JSON.stringify(addedItemIds));
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites.push(menuData);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }


    function Menu() {
        fetch('menu.json')
            .then(response => response.json())
            .then(data => {
                const fetchContainer = document.querySelector('.fetch');
                if (fetchContainer) {
                    fetchContainer.innerHTML = '';

                    for (const key in data.result) {
                        const menuData = data.result[key];
                        fetchContainer.insertAdjacentHTML('beforeend',
                            `
                            <div class="menu-div" data-id="${menuData.id}">
                                <div><img src="${menuData.url}"></div>
                                <p class="name">${menuData.name}</p>
                                <p>Composition: ${menuData.content}</p>
                                <p>Price: ${menuData.price} EUR</p>
                                <button class="favori" data-id="${menuData.id}">Favorilərə əlavə et</button>
                            </div>
                            `
                        );

                        const lastMenuDiv = fetchContainer.querySelector('.menu-div:last-child .favori');
                        if (lastMenuDiv) {
                            lastMenuDiv.addEventListener('click', () => {
                                addFavorites(menuData);
                                lastMenuDiv.disabled = true;
                            });
                        }
                    }
                   
                }
            });
    }

  
    downFav();

    Menu();

    
    const clearButton = document.querySelector('.fav-clear');
    if (clearButton) {
        clearButton.addEventListener('click', function () {
            localStorage.removeItem('favorites');
            localStorage.removeItem('addedItemIds');
            const favContainer = document.querySelector('.fav');
            if (favContainer) {
                favContainer.innerHTML = '';
            }
            Sebet();
        });
    }

    document.querySelector('.res').addEventListener('click', () => {
        if (document.querySelector('.menu').classList.contains('left')) {
            document.querySelector('.menu').classList.remove('left');
        } else {
            document.querySelector('.menu').classList.add('left');
        }
    });

    const selectElement = document.querySelector('select');
    if (selectElement) {
        selectElement.addEventListener('change', function () {
            const selectedValue = selectElement.value;
            let url;

            if (selectedValue === 'meals') {
                url = 'menu.json';
            } else if (selectedValue === 'drink') {
                url = 'drink.json';
            }

            if (url) {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        const fetchContainer = document.querySelector('.fetch');
                        if (fetchContainer) {
                            fetchContainer.innerHTML = '';
                            for (const key in data.result) {
                                const menuData = data.result[key];
                                fetchContainer.insertAdjacentHTML('beforeend',
                                    `
                                    <div class="menu-div" data-id="${menuData.id}">
                                        <div><img src="${menuData.url}"></div>
                                        <p class="name">${menuData.name}</p>
                                        <p>Composition: ${menuData.content}</p>
                                        <p>Price: ${menuData.price} EUR</p>
                                        <button class="favori" data-id="${menuData.id}">Favorilərə əlavə et</button>
                                    </div>
                                    `
                                );

                                const lastMenuDiv = fetchContainer.querySelector('.menu-div:last-child .favori');
                                if (lastMenuDiv) {
                                    lastMenuDiv.addEventListener('click', () => {
                                        addFavorites(menuData);
                                        lastMenuDiv.disabled = true;
                                    });
                                }
                            }
                          
                        }
                    })
                    .catch(error => console.error('error', error));
            }
        });
    }





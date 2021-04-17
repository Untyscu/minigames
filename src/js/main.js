window.onload = () => {
    let board = document.getElementById("board");
    let panel = document.getElementById("panel");
    let boardSettings = {
        line: 6,
        column: 6,
        elements: new Array()
    }

    function Element(x, y, label, id){
        this.x = x;
        this.y = y;
        this.label = label;
        this.id = id;
    }
    let labels = ["red", "green", "blue", "orange"];
    let basket = []; // для отлова группы связанных по смыслу элементов
    let points = 0; // очки, насчитываются за каждый связанный элемент

    // функция для сетапа элементов
    function setup(){
        for(let l = 0; l < boardSettings.line; l++){
            for(let c = 0; c < boardSettings.column; c++){
                boardSettings.elements.push(new Element(l, c, labels[Math.floor(Math.random() * 4)], l.toString() + c.toString()));
            }
        }
    }
    // отрисовуем эдементы, тут можно сделать более структурированно 
    function render(elements){
        let counter = 0;
        for(var l = 0; l < boardSettings.line; l++){
            let row = document.createElement("div");
            row.className = "row";
            row.id = "row" + l;
            board.appendChild(row);
            for(var c = 0; c < boardSettings.column; c++){
                let col = document.createElement("div");
                col.className = "column";
                col.dataset.id = elements[counter].id;
                col.style.backgroundColor = elements[counter].label;
                col.addEventListener("click", function(){ action(col.dataset.id) });
                document.getElementById("row" + l).appendChild(col);
                counter++;
            }
        }
        panel.innerHTML = "<h2>" + points + "</h2>";
    }
    // первичная отрисовка
    setup();
    render(boardSettings.elements);
    // поиск из массива
    function parseElById(id){
        let element;
        boardSettings.elements.forEach(function(item){
                if(item.id == id){
                    element = item;
                }
        });
        return element;
    };
    // ищем связанные по смыслу элементы, рекурсивно.
    function find(item, arr){
        basket.push(item.id);
        if(item.x > 0){
            arr.filter(function(element){
                if(element.x == item.x - 1 && element.y == item.y && element.label == item.label){
                    if(!basket.includes(element.id)){
                        find(element, boardSettings.elements);
                    }
                }
            });
        }
        if(item.x < 5){
            arr.filter(function(element){
                if(element.x == item.x + 1 && element.y == item.y && element.label == item.label){
                    if(!basket.includes(element.id)){
                        find(element, boardSettings.elements);
                    }
                }
            });
        }
        if(item.y > 0){
            arr.filter(function(element){
                if(element.x == item.x && element.y == item.y - 1 && element.label == item.label){
                    if(!basket.includes(element.id)){
                        find(element, boardSettings.elements);
                    }
                }
            });
        }
        if(item.y < 5){
            arr.filter(function(element){
                if(element.x == item.x && element.y == item.y + 1 && element.label == item.label){
                    if(!basket.includes(element.id)){
                        find(element, boardSettings.elements);
                    }
                }
            });
        }
    };
    // изменяем цвет наших выбранных элементов
    function cahnge(toChange){
        boardSettings.elements.forEach(function(item){
            if(toChange.includes(item.id)){
                item.label = labels[Math.floor(Math.random() * 4)];
            }
        })
    }
    // экшен на каждом элементе
    function action(id){
        basket = []; // очистим корзину для отлова новых 
        find(parseElById(id), boardSettings.elements); // ищем
        cahnge(basket); // меняем их цвет
        board.innerHTML = ""; // очищаем экран для последующей отрисовки
        points += basket.length; // ах да, добавляем все выбранные элементы к очкам и отрисовуем их
        render(boardSettings.elements);
    };

}
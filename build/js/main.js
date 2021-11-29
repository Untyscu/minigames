window.onload = () => {
    let board = document.getElementById("board");
    let panel = document.getElementById("panel");
    let start = document.getElementById("start");
    let result = document.getElementById("result");
    let clock = document.getElementById("clock");
    let boardSettings = {
        line: 7,
        column: 7,
        elements: [],
        timeout: 10
    }

    function Element(x, y, label, id){
        this.x = x;
        this.y = y;
        this.label = label;
        this.id = id;
    }
    let labels = ["pomegranate", "nephritis", "belizehole", "orange", "turquoise", "wisteria", "midnightblue", "pumpkin"];
    let basket = []; // для отлова группы связанных по смыслу элементов
    let points = 0; // очки, насчитываются за каждый связанный элемент
    let timeout = boardSettings.timeout;
    let play = false;

    // функция для сетапа элементов
    function setup(){
        boardSettings.elements = [];
        for(let l = 0; l < boardSettings.line; l++){
            for(let c = 0; c < boardSettings.column; c++){
                boardSettings.elements.push(new Element(l, c, labels[Math.floor(Math.random() * 8)], l.toString() + c.toString()));
            }
        }
    }
    // отрисовуем эдементы, тут можно сделать более структурированно 
    function render(elements){
        board.innerHTML = ""; // очищаем экран для последующей отрисовки`
        let counter = 0;
        for(var l = 0; l < boardSettings.line; l++){
            let row = document.createElement("div");
            row.className = "row";
            row.id = "row" + l;
            board.appendChild(row);
            for(var c = 0; c < boardSettings.column; c++){
                let col = document.createElement("div");
                col.className = "column " + elements[counter].label;
                col.dataset.id = elements[counter].id;
                col.addEventListener("click", function(){ action(col.dataset.id) });
                document.getElementById("row" + l).appendChild(col);
                counter++;
            }
        }
        panel.innerText = points;
    }
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
        if(item.x < boardSettings.column - 1){
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
        if(item.y < boardSettings.line - 1){
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
    function cahnge(toChange, color){
        let set = [];
        labels.forEach(item => {
            if(item != color){
                return set.push(item);
            }
        });
        console.log(set);
        console.log(color);
        boardSettings.elements.forEach(function(item){
            if(toChange.includes(item.id)){
                item.label = set[Math.floor(Math.random() * 7)];
            }
        })
    }
    // экшен на каждом элементе
    function action(id){
        basket = []; // очистим корзину для отлова новых 
        let item = parseElById(id);
        find(item, boardSettings.elements); // ищем
        console.log(basket.length);
        if(basket.length > 1){
            cahnge(basket, item.label); // меняем их цвет
            points += basket.length; // ах да, добавляем все выбранные элементы к очкам и отрисовуем их
            timeout = boardSettings.timeout;
            render(boardSettings.elements);
        }        
    };

    let timer = () => { 
        setInterval(function(){
            if(timeout <= 0){
                board.style.display = 'none';
                result.innerHTML = "Your points: " + points + "<br>Your rating: in developing";
                clearInterval(timer);
            } else {
                clock.innerText = timeout - 1;
                timeout--;
            }
        }, 1000);
    }

    start.addEventListener('click', function(){
        // первичная отрисовка
        setup();
        points = 0;
        result.innerText = '';
        board.style.display = 'block';
        timeout = boardSettings.timeout;
        if(play){
            timeout = boardSettings.timeout;
        } else {
            timer();
            play = true;
        }
        render(boardSettings.elements);        
    });

}
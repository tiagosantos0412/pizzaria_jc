let modalQt = 0;
let modalKey = 0;
let cart = [];
//Função para abreviar o comando document.querySelector
const consulta = (elemento)=>document.querySelector(elemento);
const consultaTodos = (elemento)=>document.querySelectorAll(elemento);


//listagens das pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem =  consulta('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML= `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML=item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML=item.description; 
    
    //função para desativar a atualização ao clicar no item e abrir o modal
    pizzaItem.querySelector('a').addEventListener('click', (evento)=>{
        evento.preventDefault();

        //variável para receber o índice da pizza clicada saindo do elemento a e localizando o pizza-item mais próximo
        let key = evento.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        
        consulta('.pizzaBig img').src = pizzaJson[key].img;
        consulta('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        consulta('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        consulta('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        //deslecionar a classe selected do item grande para resetar a janela do modal
        consulta('.pizzaInfo--size.selected').classList.remove('selected');

        //consulta para percorrer cada um dos tamanhos dentro de pizzaInfo--size e preencher cada tag span com o tamanho de acordo com o index do tamanho
        consultaTodos('.pizzaInfo--size').forEach((size, sizeIndex)=>{

            //condição para deixar o tamanho grande selecionado commo padrão
            if(sizeIndex == 2){
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        
        consulta('.pizzaInfo--qt').innerHTML = modalQt;

        consulta('.pizzaWindowArea').style.opacity = 0;
        consulta('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            consulta('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    //preencher as informações em pizzaItem
    consulta('.pizza-area').append(pizzaItem);
}); 

//eventos do modal

//função para fechar o modal
function closeModal(){
    consulta('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        consulta('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

//seleciona cada um dos botões e adiciona a função de fechar o modal
consultaTodos('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

consulta('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    
    if(modalQt > 1){
        modalQt--;
        consulta('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

consulta('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    consulta('.pizzaInfo--qt').innerHTML = modalQt;
});

//Função para clicar no tamanho desmarcar todos e marcar o que eu escolhi
consultaTodos('.pizzaInfo--size').forEach((size, sizeIndex)=>{

    size.addEventListener('click', (evento)=>{
        consulta('.pizzaInfo--size.selected').classList.remove('selected'); 
        size.classList.add('selected');
    });
});

//Adicionar pizzas ao carrinho de compras
consulta('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //Qual a pizza?
    //console.log(`Pizza: ${modalKey}`);
    //Qual o tamanho selecionado?
    let size = parseInt(consulta('.pizzaInfo--size.selected').getAttribute('data-key'));
    //console.log(`Tamanho: ${size}`);
    //Quantas pizzas serão adicionadas?
    //console.log(`Quantidade: ${modalQt}`);

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
        cart[key].qtd += modalQt;
    }else{
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qtd:modalQt
        });
    }
    updateCart();
    closeModal();

});

    consulta('.menu-openner').addEventListener('click', ()=>{
        if(cart.length > 0){
            consulta('aside').style.left = '0';
        }
    });

    consulta('.menu-closer').addEventListener('click', ()=>{
        consulta('aside').style.left = '100vw';
    });

function updateCart(){

    consulta('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        consulta('aside').classList.add('show');
        consulta('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            //let pizzaItem = pizzaJason.find((item)=>item.id == cart[i].id);
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id;
            });
            subtotal += pizzaItem.price * cart[i].qtd;

            let cartItem = consulta('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break        
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qtd > 1){
                    cart[i].qtd --;
                }else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qtd ++;
                updateCart();
            });
            consulta('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        consulta('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        consulta('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        consulta('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        consulta('aside').classList.remove('show');
        consulta('aside').style.left = '100vw';
    }
}




"use strict"
/* - XMLHttpRequest() js native- устаревший вариант который никто не использует
const xhr = new XMLHttpRequest();
xhr.open('get','assets/data/cart.json');
xhr.send();
xhr.onreadystatechange = function() {
    if(xhr.readyState===4){
        if(xhr.status===200) {
        console.log(xhr.response);
        } else {
            alert(xhr.statusText);
        }
    }
}
*/

/* - fetch js native - код на чистом js
fetch('assets/data/cart.json')
    .then(resp=>{
       return resp.json();
})
    .then(resp=>{
    console.log(resp);
    viewCart(resp);
})
 */

/*- ниже отрабатывает код с библиотеки axios
axios('assets/data/cart.json')
    .then(resp => {
    viewCart(resp.data);
})
.cache(err=>{
    alert(err.message)
});
*/

/*
//jQeary library вариант
$.ajax({
    url:'assets/data/cart.json',
    type: 'get',
    dataType:'json',
    success: function(resp) {
        console.log(resp);
        viewCart(resp);
    },
    error: function(err) {
        console.log(err);
        alert(err.statusText);
    }
});//старый вариант кода

$.ajax('assets/data/cart.json')
    .done((resp)=>{
            viewCart(resp);
    })
    .fail((err)=> {
        alert(err.statusText);
    });//новый вариант кода
*/
//короткий вариант запроса на jQeary
// $.get('assets/data/cart.json', (resp)=>{viewCart(resp);});
/*
function viewCart(cart) {
    let html = '<ul>';
    cart.forEach(item=>{
        html +=`
        <li>
        <b> ${item.name} </b> ${item.qty} - ${item.price}
        </li>
`;
    });
    html += '<ul>';
    document.body.insertAdjacentHTML('afterBegin', html)
}
*/


//Функция которая загружает страницу

function loadPage(page) {
    $.get('pages/' + page +'.html', (html)=>{
        $('#page_content').html(html);
    });
}
loadPage('main');

$(function() {
    $('.nav-masthead a').on('click', function(e){
        e.preventDefault();
        loadPage($(this).attr('href'));
        $('.nav-link.active').removeClass('active');
        $(this).addClass('active');
    })
});


















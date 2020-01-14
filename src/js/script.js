document.addEventListener('click', function (q) {
  //изменение количества товаров по клику + и -
  if (q.target.classList.contains("quantity_plus")) {
    q.target.parentElement.querySelector("input").value > 9 ? 10 : ++q.target.parentElement.querySelector("input").value;
  } else if (q.target.classList.contains("quantity_minus")) {
    q.target.parentElement.querySelector("input").value < 2 ? 1 : --q.target.parentElement.querySelector("input").value;
  }


  if (q.target.classList.contains("delete")) {
    if (q.target.parentElement.parentElement.classList.contains("product1")) {
      document.querySelector('.orders1').remove();
    } else  if (q.target.parentElement.parentElement.classList.contains("product")) {
      document.querySelector('.orders').remove();
    }
    q.target.parentElement.parentElement.remove();
  }
});

//подсчет для скидки
function discountCount() {
  var total = document.querySelector('.total').innerHTML;
  var discount = (total / 100) * 20;
  document.querySelector('.discount-number').innerHTML = discount;
  totalAfter = total - discount;
}

document.addEventListener('click', function (q) {
//Скидка 20% по промокоду NY2020
  if (q.target.classList.contains("formPromo__submit")) {
    var promoCode = document.querySelector('.formPromo__input').value;
    if (promoCode !== "NY2020" && promoCode !== "ny2020") {
      document.querySelector('.discount-no').classList.remove('hide');
      document.querySelector('.discount-no').innerHTML = 'Промокод не верный';
      document.querySelector('.discount-yes').classList.add('hide');
    } else {
      discountCount();
      document.querySelector('.total').innerHTML = totalAfter.toLocaleString();
      document.querySelector('.discount-no').classList.add('hide');
      document.querySelector('.discount-yes').classList.remove('hide');
      document.querySelector('.formPromo__submit').classList.add('disabled');
    }
  }
  });





//JSON данные
var productItem = document.querySelector('.basket-product-item'),
    productTitle = document.querySelector('.basket-product-item__title'),
    productArticle = document.querySelector('.basket-product-item__article'),
    productPrice = document.querySelector('.basket-product-item__price-value'),
    productPriceOld = document.querySelector('.basket-product-item__price-old');
    
var requestURL = 'json/data.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  const productsList = request.response;
  showProduct(productsList);
}

function showProduct(jsonObj) {
  var product = jsonObj['product'];
  for (var i = 0; i < product.length; i++) {

    var productTitles = document.createElement('span');
    var productArticles = document.createElement('span');
    var productPrices = document.createElement('span');
    var productPriceOlds = document.createElement('span');


    productTitles.textContent = product[i].title;
    productArticles.textContent = product[i].article;
    productPrices.textContent = product[i].price.toLocaleString();
    productPriceOlds.textContent = product[i].priceOld.toLocaleString();


    productTitle.prepend(productTitles);
    productArticle.append(productArticles);
    productPrice.prepend(productPrices);
    productPriceOld.prepend(productPriceOlds);
  }
}

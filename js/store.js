const cartcontainer = document.getElementById("cart-container");
const userProducts = [];
const userId = localStorage.getItem("userId");
let subtotal = 0;
let total = 0;
let ship = 0;

const subttl = document.getElementById("sub-total");
const shipmnt = document.getElementById("ship");
const ttl = document.getElementById("total");
loadStore();

function loadStore() {
  fetch("http://localhost:8080/" + userId + "/cart", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((displayCart) => {
      userProducts.push(...displayCart);
      console.log(userProducts);
      onLoad();
    });
}

function onLoad() {
  userProducts.forEach((products) => {
    createProduct(products);
  });
  subttl.innerText = subtotal;
  shipmnt.innerText = ship;
  ttl.innerText = total;
}

function createProduct(product) {
  subtotal += product.productPrice;
  subttl.innerText = subtotal;
  total += product.productPrice + 50;
  ttl.innerText = total;
  ship += 50;
  shipmnt.innerText = ship;

  // <div class="col-10 mx-auto col-md-2 my-3">
  //   <img
  //     src="img/img-products/product-1.png"
  //     alt=""
  //     class="img-fluid"
  //   />
  // </div>

  const img = document.createElement("img");
  img.className = "img-fluid";
  img.src = product.productImgSrc;

  const firstDiv = document.createElement("div");
  firstDiv.className = "col-10 mx-auto col-md-2 my-3";
  firstDiv.appendChild(img);

  // <div class="col-10 mx-auto col-md-4">
  //   <p class="text-uppercase">comfortable chair</p>
  // </div>

  const para = document.createElement("p");
  para.className = "text-uppercase";
  para.innerText = product.productName;

  const secondDiv = document.createElement("div");
  secondDiv.className = "col-10 mx-auto col-md-3";
  secondDiv.append(para);

  // <div class="col-10 mx-auto col-md-2">
  //   <p class="text-uppercase">100.00$</p>
  // </div>

  const para1 = document.createElement("p");
  para1.className = "text-uppercase";
  para1.innerText = "₹" + product.productPrice;

  const thirdDiv = document.createElement("div");
  thirdDiv.className = "col-10 mx-auto col-md-2";
  thirdDiv.append(para1);

  // <div class="col-10 mx-auto col-md-2">
  //   <div class="d-flex justify-content-center align-items-center">
  //     <span class="btn btn-black mx-1">-</span>
  //     <span class="btn btn-black mx-1">4</span>
  //     <span class="btn btn-black mx-1">+</span>
  //   </div>
  // </div>

  const span2 = document.createElement("span");
  span2.className = "btn btn-black mx-1";
  span2.innerText = product.productNos;
  span2.id = "prod" + product.productId;

  const para2 = document.createElement("p");
  para2.className = "text-uppercase";
  para2.innerText = "₹" + product.productPrice * product.productNos;
  para2.id = "total" + product.productId;

  const span1 = document.createElement("span");
  span1.className = "btn btn-black mx-1";
  span1.innerText = "-";
  span1.onclick = () => {
    if (product.productNos > 1) {
      product.productNos -= 1;
      document.getElementById("prod" + product.productId).innerHTML =
        product.productNos;
      document.getElementById("total" + product.productId).innerHTML =
        "₹" + product.productPrice * product.productNos;
      subtotal -= product.productPrice;
      subttl.innerText = subtotal;
      total -= product.productPrice;
      ttl.innerText = total;
    }
  };

  const span3 = document.createElement("span");
  span3.className = "btn btn-black mx-1";
  span3.innerText = "+";
  span3.onclick = () => {
    product.productNos += 1;
    document.getElementById("prod" + product.productId).innerHTML =
      product.productNos;
    document.getElementById("total" + product.productId).innerHTML =
      "₹" + product.productPrice * product.productNos;
    subtotal += product.productPrice;
    subttl.innerText = subtotal;
    total += product.productPrice;
    ttl.innerText = total;
  };

  const fourthDiv = document.createElement("div");
  fourthDiv.className = "d-flex justify-content-center align-items-center";
  fourthDiv.appendChild(span1);
  fourthDiv.appendChild(span2);
  fourthDiv.appendChild(span3);

  const fifthDiv = document.createElement("div");
  fifthDiv.className = "col-10 mx-auto col-md-2";
  fifthDiv.appendChild(fourthDiv);

  // <div class="col-10 mx-auto col-md-2">
  //   <p class="text-uppercase">100.00$</p>
  // </div>

  const sixthDiv = document.createElement("div");
  sixthDiv.className = "col-10 mx-auto col-md-2";
  sixthDiv.append(para2);

  //remove from cart

  const button = document.createElement("button");

  button.style.color = "black";
  button.style.border = "none";
  button.style.backgroundColor = "white";
  button.style.cursor = "pointer";
  button.onmouseover = () => {
    button.style.color = "red";
  };
  button.onmouseout = () => {
    button.style.color = "black";
  };
  const icon = document.createElement("i");
  icon.className = "fas fa-trash";
  button.append(icon);
  button.onclick = () => removefromcart(product.productId);

  const sDiv = document.createElement("div");
  sDiv.className = "col-10 mx-auto col-md-1";
  sDiv.append(button);

  // end of remove from cart

  const line = document.createElement("hr");
  line.setAttribute("width", "90%");

  cartcontainer.append(firstDiv);
  cartcontainer.append(secondDiv);
  cartcontainer.append(thirdDiv);
  cartcontainer.append(fifthDiv);
  cartcontainer.append(sixthDiv);
  cartcontainer.append(sDiv);
  cartcontainer.append(line);

  //return product.productNos * product.productPrice;
}

document.getElementById("checkout").onclick = () => {
  fetch("http://localhost:8080/" + userId + "/cart", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userProducts),
  });
  location.href = "payment.html";
};

//remove from cart

function removefromcart(prodId) {
  fetch("http://localhost:8080/" + userId + "/cart/" + prodId, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });
  location.reload();
}

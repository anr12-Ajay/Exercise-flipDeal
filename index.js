const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let cors = require('cors');
app.use(cors());

let taxRate = 5;
let discountPercentage = 10;
let loyaltyRate = 2;

function calculateTotalPrice(newItemprice, cartTotal) {
  let sum = newItemprice + cartTotal;
  return sum.toString();
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateTotalPrice(newItemPrice, cartTotal));
});

function discountOnMembership(cartTotal, isMember) {
  if (isMember == 'true') {
    let finalPrice = cartTotal - (discountPercentage * cartTotal) / 100;
    return finalPrice.toString();
  } else {
    return cartTotal.toString();
  }
}

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember == true;
  res.send(discountOnMembership(cartTotal, isMember));
});

function calculateTax(cartTotal) {
  let taxTotal = (cartTotal * taxRate) / 100;
  return taxTotal.toString();
}

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateTax(cartTotal));
});

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

function estimateDeliveryTime(shippingMethod,distance){
  if shippingMethod==="express"{
    let timeDurationDay;
    timeDurationDay=distance/100;
    return timeDurationDay
  }else {
    let timeDurationDay;
    timeDurationDay=distance/50;
    return timeDurationDay
  }
}


app.get("/estimate-delivery",(req,res)=>{
  let shippingMethod= req.query.shippingMethod;
  let distance=parseFloat(req.query.distance);
  res.send(estimateDeliveryTime(shippingMethod,distance))
  
})
function CalculateShippingCost(distance,weight){
  let shippingCost=distance*weight*0.1;
  return shippingCost.toString();
}

app.get("/shipping-cost",(req,res)=>{
  let weight=parseFloat(req.query.weight);
  let distance=parseFloat(req.query.distance);
  res.send(CalculateShippingCost(distance,weight))
})



function calculateLoyaltyPoints(purchaseAmount){
  let loyaltyPoints=purchaseAmount*loyaltyRate;
  return loyaltyPoints.toString()
}

app.get("/loyalty-points",(req,res)=>{
  let purchaseAmount=parseFloat(req.query.purchaseAmount);
  res.send(calculateLoyaltyPoints(purchaseAmount));
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

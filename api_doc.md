## Wallet Apis

- /api/wallet/[user address]
  returns user's EscrowWallet balances
  ex:
  request: http://localhost:3000/api/wallet/0x0902CB364E49101F4ab5D4fFDE5035973e728D3F
  response: {
  "\_id": "627445ca1823f86c82819ed6",
  "address": "0x0902CB364E49101F4ab5D4fFDE5035973e728D3F",
  "balances": [
  {
  "token_address": "0xabc72d336528fEBEBd99a4Eeb81B9F792c0aA8b6",
  "token_name": "MockERC20",
  "token_symbol": "MERC20",
  "balance": 2.16,
  "_id": "62744c416185f8b3712dd2fb"
  }
  ],
  "createdAt": "2022-05-05T21:46:50.780Z",
  "updatedAt": "2022-05-09T06:23:46.436Z"
  }

- /api/wallet/[user address]/[token address]
  returns a token balance
  ex:
  request: http://localhost:3000/api/wallet/0x0902CB364E49101F4ab5D4fFDE5035973e728D3F/0xabc72d336528fEBEBd99a4Eeb81B9F792c0aA8b6
  response: {
  "token_address": "0xabc72d336528fEBEBd99a4Eeb81B9F792c0aA8b6",
  "token_name": "MockERC20",
  "token_symbol": "MERC20",
  "balance": 2.16,
  "\_id": "62744c416185f8b3712dd2fb"
  }

## Order Apis

- api/orders (POST)
  user to create a new order

  ```
  axios.post('/api/orders', {
    email,
    discordId,
    ethAddress,
    shippingAddress,
    cartItems,
    signature,
  });
  ```

  ex:
  request: http://localhost:3000/api/orders

  ```
  response: {
    {
      "_id": {    "$oid": "627fbb25b7d9b01e7571d336"  },
      "name": "Whitelist",
      "image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652342209/uis2zmcg0mmhpn89uekw.png",
      "brand": "Project Godjira",
      "quantity": 1,
      "price": 500,
      "discordId": "test1",
      "ethAddress": "0x9d95bcaa5b609fa97a7ec860bec115aa94f85ba9",
      "shippingAddress": "testadd",
      "email": "alex@gmail.com",
      "paidAt": {    "$date": {      "$numberLong": "1652538149483"    }  },
      "createdAt": {    "$date": {      "$numberLong": "1652538149490"    }  },
      "updatedAt": {    "$date": {      "$numberLong": "1652538149490"    }  },
      "__v": 0
    },
    {
      "_id": {    "$oid": "627fbe66b7d9b01e7571d37a"  },
      "name": "Whitelist",
      "image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652342209/uis2zmcg0mmhpn89uekw.png",
      "brand": "Project Godjira",
      "quantity": 1,
      "price": 500,
      "discordId": "test1",
      "ethAddress": "0x9d95bcaa5b609fa97a7ec860bec115aa94f85ba9",
      "shippingAddress": "testadd",
      "email": "eleanortay97@gmail.com",
      "paidAt": {    "$date": {      "$numberLong": "1652538982031"    }  },
      "createdAt": {    "$date": {      "$numberLong": "1652538982035"    }  },
      "updatedAt": {    "$date": {      "$numberLong": "1652538982035"    }  },
      "__v": 0
    }
  }
  ```

- api/orders/inventory (GET)
  returns list of products that a user has previously purchased

  ```
  await Order.find({ ethAddress: req.query.currentAccount });
  ```

  ex:
  request: http://localhost:3000/api/orders/inventory

  ```
  response: {
    {
      "_id": {    "$oid": "627fbb25b7d9b01e7571d336"  },
      "name": "Whitelist",
      "image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652342209/uis2zmcg0mmhpn89uekw.png",
      "brand": "Project Godjira",
      "quantity": 1,
      "price": 500,
      "discordId": "test1",
      "ethAddress": "0x9d95bcaa5b609fa97a7ec860bec115aa94f85ba9",
      "shippingAddress": "testadd",
      "email": "alex@gmail.com",
      "paidAt": {    "$date": {      "$numberLong": "1652538149483"    }  },
      "createdAt": {    "$date": {      "$numberLong": "1652538149490"    }  },
      "updatedAt": {    "$date": {      "$numberLong": "1652538149490"    }  },
      "__v": 0
    },
    {
      "_id": {    "$oid": "627fbe66b7d9b01e7571d37a"  },
      "name": "Whitelist",
      "image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652342209/uis2zmcg0mmhpn89uekw.png",
      "brand": "Project Godjira",
      "quantity": 1,
      "price": 500,
      "discordId": "test1",
      "ethAddress": "0x9d95bcaa5b609fa97a7ec860bec115aa94f85ba9",
      "shippingAddress": "testadd",
      "email": "eleanortay97@gmail.com",
      "paidAt": {    "$date": {      "$numberLong": "1652538982031"    }  },
      "createdAt": {    "$date": {      "$numberLong": "1652538982035"    }  },
      "updatedAt": {    "$date": {      "$numberLong": "1652538982035"    }  },
      "__v": 0
    }
  }
  ```

## Product Apis

- api/products
  returns all products in marketplace for users

  ```
  await axios.get(`/api/admin/products`, {});
  ```

  ex:
  request: http://localhost:3000/api/admin/products

  ```
  response: {
    {
      "_id": {    "$oid": "627cb691c00e55097dd8290a"  },
      "name": "Whitelist",
      "slug": "whitelist-project-godjira",
      "type": "Raffle",
      "brand": "Project Godjira",
      "currency": "UCD",
      "image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652342209/uis2zmcg0mmhpn89uekw.png",
      "price": 500,
      "originalCount": 100,
      "countInStock": 69,
      "createdAt": {    "$date": {      "$numberLong": "1652340369954"    }  },  "updatedAt": {    "$date": {      "$numberLong": "1652664972738"    }  },  "__v": 0,
      "claimed": 4
    },
    {
      "_id": {    "$oid": "627cbe0c70e4b07c64586aad"  },
      "name": "Whitelist",
      "slug": "whitelist-broskees",
      "type": "Whitelist",
      "brand": "Broskees",
      "currency": "UCD",
      "image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652342319/d3hwkckhzxvmjulaol5h.png",
      "price": 200,
      "originalCount": 10,
      "countInStock": 0,
      "claimed": 8,
      "createdAt": {    "$date": {      "$numberLong": "1652342284421"    }  },  "updatedAt": {    "$date": {      "$numberLong": "1652437357621"    }  },  "__v": 0
    }
  }
  ```

- api/products/types
  return products filtered according to types for users

  ```
  await axios.get(`/api/products/types`);
  ```

  ex:
  request: http://localhost:3000/api/products/Whitelist

  ```
  response: {
    {
      "_id": {    "$oid": "627cbe0c70e4b07c64586aad"  },
       "name": "Whitelist",  "slug": "whitelist-broskees",
       "type": "Whitelist",
       "brand": "Broskees",
       "currency": "UCD",
       "image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652342319/d3hwkckhzxvmjulaol5h.png",
       "price": 200,
       "originalCount": 10,
       "countInStock": 0,
       "claimed": 8,
       "createdAt": {    "$date": {      "$numberLong": "1652342284421"    }  },
       "updatedAt": {    "$date": {      "$numberLong": "1652437357621"    }  },
       "__v": 0
    },
    {
      "_id": {    "$oid": "627cc2b670e4b07c64586adc"  },
      "name": "Whitelist",
      "slug": "whitelist-mindblowon",
      "type": "Whitelist",
      "brand": "Mindblowon",
      "currency": "UCD",
      "image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652343515/u9mgldjsh8o0nzxbxrgz.png",
      "price": 100,
      "originalCount": 1,
      "countInStock": 0,
      "claimed": 1,
      "createdAt": {    "$date": {      "$numberLong": "1652343478592"    }  },
      "updatedAt": {    "$date": {      "$numberLong": "1652344252218"    }  },
      "__v": 0
    }
  }
  ```

## Admin Apis

- api/admin/products (GET)
  returns all products in marketplace for admins

```

await axios.get(`/api/admin/products`, {});

```

ex:
request: http://localhost:3000/api/admin/products

```

response: {
{
"\_id": { "$oid": "627cb691c00e55097dd8290a"  },
      "name": "Whitelist",
      "slug": "whitelist-project-godjira",
      "type": "Raffle",
      "brand": "Project Godjira",
      "currency": "UCD",
      "image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652342209/uis2zmcg0mmhpn89uekw.png",
      "price": 500,
      "originalCount": 100,
      "countInStock": 69,
      "createdAt": {    "$date": { "$numberLong": "1652340369954"    }  },  "updatedAt": {    "$date": { "$numberLong": "1652664972738"    }  },  "__v": 0,
      "claimed": 4
    },
    {
      "_id": {    "$oid": "627cbe0c70e4b07c64586aad" },
"name": "Whitelist",
"slug": "whitelist-broskees",
"type": "Whitelist",
"brand": "Broskees",
"currency": "UCD",
"image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652342319/d3hwkckhzxvmjulaol5h.png",
"price": 200,
"originalCount": 10,
"countInStock": 0,
"claimed": 8,
"createdAt": { "$date": {      "$numberLong": "1652342284421" } }, "updatedAt": { "$date": {      "$numberLong": "1652437357621" } }, "\_\_v": 0
}
}

```

- api/admin/products (PUSH)
  admin to add a single product

```

await axios.post(`/api/admin/products`, {});

```

ex:
request: http://localhost:3000/api/admin/products

```

response: {
"\_id": { "$oid": "627cb691c00e55097dd8290a"  },
      "name": "Whitelist",
      "slug": "whitelist-project-godjira",
      "type": "Raffle",
      "brand": "Project Godjira",
      "currency": "UCD",
      "image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652342209/uis2zmcg0mmhpn89uekw.png",
      "price": 500,
      "originalCount": 100,
      "countInStock": 69,
      "createdAt": {    "$date": { "$numberLong": "1652340369954"    }  },  "updatedAt": {    "$date": { "$numberLong": "1652664972738" } }, "\_\_v": 0,
"claimed": 4
}

```

- api/admin/[id] (PUT)
  admin to update a single product
  ex:
  request: http://localhost:3000/api/admin/products/627cb691c00e55097dd8290a

```

response: {
"\_id": { "$oid": "627cb691c00e55097dd8290a"  },
      "name": "Whitelist",
      "slug": "whitelist-project-godjira",
      "type": "Raffle",
      "brand": "Project Godjira",
      "currency": "UCD",
      "image": "https://res.cloudinary.com/dllok6eun/image/upload/v1652342209/uis2zmcg0mmhpn89uekw.png",
      "price": 500,
      "originalCount": 100,
      "countInStock": 69,
      "createdAt": {    "$date": { "$numberLong": "1652340369954"    }  },  "updatedAt": {    "$date": { "$numberLong": "1652664972738" } }, "\_\_v": 0,
"claimed": 4
}

```

- api/admin/[id] (DELETE)
  admin to delete a single product

```

await axios.delete(`/api/admin/products/${productId}`, {
data: {
productId,
ethAddress,
signature,
},
});

```

ex:
request: http://localhost:3000/api/admin/products/627cb691c00e55097dd8290a

- api/admin/upload (POST)
  admin to upload photo of nft when creating/editing a product
  this is done using https://cloudinary.com/users/login?RelayState=%2Fconsole%2F%2Fgetting-started%3Fcustomer_external_id%3Dc-61c30c2af7d35ddacb7242a0a83fdb

```

await axios.post('/api/admin/upload', bodyFormData, {
headers: {
'Content-Type': 'multipart/form-data',
},
});

```

```

```

By Eleanor and Takeshi

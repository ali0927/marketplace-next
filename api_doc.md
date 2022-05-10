## Wallet Apis
- /api/wallet/[user address]
  returns user's EscrowWallet balances
  ex: 
    request: http://localhost:3000/api/wallet/0x0902CB364E49101F4ab5D4fFDE5035973e728D3F
    response: {
      "_id": "627445ca1823f86c82819ed6",
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
      "_id": "62744c416185f8b3712dd2fb"
    }



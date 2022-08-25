import axios from "axios";
import { toast } from "react-toastify";
import { handleSectionExpire } from "../../utils/sharedVariable"
let CryptoJS = require("crypto-js");
let token = localStorage.getItem("authorization");
let REQUEST_SECRET_KEY = CryptoJS.AES.encrypt(
  process.env.REACT_APP_REQUEST_SECRET_KEY,
  process.env.REACT_APP_REQUEST_ENCRYPTION_KEY
).toString();
let config;
config = {
  headers: {
    Authorization: `${REQUEST_SECRET_KEY}`,
  },
};

var config1 = {
  headers: {
    "X-EntityToken": token,
    "Content-Type": "application/json",
  },
};
export const TokenTransfer = async (payload: any) => {
  const { type, amount, address, txHash, network, userId } = payload;
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post(
      `${url + "transactions/"}`,

      {
        type,
        amount,
        address,
        txHash,
        network,
        userId,
      },
      config
    );
    return response.data;
  } catch (error) {
    toast.error(error);
  }
};

export const ExchangeTokentansfer = async (payload: any) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const {
      txHash,
      amount,
      address,
      to,
      fromCurrency,
      toCurrency,
      walletId,
      status,
    } = payload;
    const fromAddress = address;
    const toAddress = to;
    const response = await axios.post(
      `${url + "exchange/"}`,
      {
        txHash,
        amount,
        fromAddress,
        toAddress,
        fromCurrency,
        toCurrency,
        walletId,
        status,
      },
      config
    );
    return response;
  } catch (error) {
    toast.error(error);
  }
};
export const SendSolToken = async (payload: any) => {
  const { amount, to, exchangeId } = payload;
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post(
      `${url + "transactions/create-solana-transaction"}`,
      {
        amount,
        to,
        exchangeId,
      },
      config
    );
    return response;
  } catch (e) {
    return e;
  }
};
export const SendBSCToken = async (payload: any) => {
  const { amount, to, exchangeId } = payload;
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post(
      `${url + "transactions/create-bsc-transaction"}`,
      {
        amount,
        to,
        exchangeId,
      },
      config
    );
    return response;
  } catch (e) {
    toast.error(e);
  }
};
export const getTransactions = async () => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.get(`${url + `transactions`}`);
    const { data } = response;
    return data.data.transactions;
  } catch (e) {
    toast.error(e);
  }
};

export const getTwoDaysTransactions = async (startDate, endDate) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.get(
      `${url + `transactions/?startDate=${startDate}&endDate=${endDate}`}`
    );
    const { data } = response;
    return data.data.transactions;
  } catch (e) {
    toast.error(e);
  }
};

export const getExchange = async () => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.get(`${url + `exchange`} `);
    const { data } = response;
    return data.data.exchange;
  } catch (e) {
    toast.error(e);
  }
};
export const getTwoDaysExchange = async (startDate, endDate) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.get(
      `${url + `exchange/?startDate=${startDate}&endDate=${endDate}`} `
    );
    const { data } = response;
    return data.data.exchange;
  } catch (e) {
    toast.error(e);
  }
};
export const GetCurrencyAmount = async (token: string) => {
  try {
    token = localStorage.getItem("authorization");
    config1 = {
      headers: {
        "X-EntityToken": token,
        "Content-Type": "application/json",
      },
    };

    const payload = {
      FunctionName: "GetCurrencyAmount",
      GeneratePlayStreamEvent: true,
      FunctionParameter: {
        currencyKey: "O2",
      },
    };
    const url = process.env.REACT_APP_API_PLAYFAB;
    const response = await axios.post(url, payload, config1);
    const { data } = response;
    return data;
  } catch (e) {
    handleSectionExpire(e)
  }
};
export const GetShillCurrencyAmount = async (token: string) => {
  try {
    token = localStorage.getItem("authorization");
    config1 = {
      headers: {
        "X-EntityToken": token,
        "Content-Type": "application/json",
      },
    };

    const payload = {
      FunctionName: "GetCurrencyAmount",
      GeneratePlayStreamEvent: true,
      FunctionParameter: {
        currencyKey: "SH",
      },
    };
    const url = process.env.REACT_APP_API_PLAYFAB;
    const response = await axios.post(url, payload, config1);
    const { data } = response;
    return data;
  } catch (e) {
  }
};
export const DepositBSCOutlandOdyssey = async (payload: any) => {
  const { type, amount, address, txHash, network, userId } = payload;
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post(
      `${url + "transactions/"}`,

      {
        type,
        amount,
        address,
        txHash,
        network,
        userId,
      },
      config
    );
    return response.data;
  } catch (error) {
    toast.error(error);
  }
};

export const DepositToOutlandOdyssey = async (amount: number) => {
  const number = Number(amount);
  try {
    token = localStorage.getItem("authorization");
    config1 = {
      headers: {
        "X-EntityToken": token,
        "Content-Type": "application/json",
      },
    };
    const payload = {
      FunctionName: "DepositToOutlandOdyssey",
      GeneratePlayStreamEvent: true,

      FunctionParameter: {
        currencyKey: "O2",
        amount: number,
      },
    };
    const url = process.env.REACT_APP_API_PLAYFAB;
    const response = await axios.post(url, payload, config1);
    const { data } = response;
    return data;
  } catch (e) {
    toast.error(e);
  }
};

export const TransferSolToken = async (payload: any) => {
  const { amount, Solana, walletId } = payload;
  const to = Solana;
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post(
      `${url + "transactions/transfer-tokens-to-solana-wallet"}`,
      {
        amount,
        to,
        walletId,
      },
      config
    );
    return response;
  } catch (e) {
    toast.error(e);
  }
};
export const TransferBSCToken = async (payload: any) => {
  const { amount, Binance, walletId } = payload;
  const to = Binance;
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post(
      `${url + "transactions/transfer-tokens-to-bsc-wallet"}`,
      {
        amount,
        to,
        walletId,
      },
      config
    );
    return response;
  } catch (e) {
    toast.error(e);
  }
};

export const TransferToWallet = async (amount: number) => {
  const number = Number(amount);

  try {
    token = localStorage.getItem("authorization");
    config1 = {
      headers: {
        "X-EntityToken": token,
        "Content-Type": "application/json",
      },
    };
    const payload = {
      FunctionName: "TransferToWallet",
      GeneratePlayStreamEvent: true,

      FunctionParameter: {
        currencyKey: "O2",
        amount: number,
      },
    };
    const url = process.env.REACT_APP_API_PLAYFAB;
    const response = await axios.post(url, payload, config1);
    const { data } = response;
    return data;
  } catch (e) {
    toast.error(e);
  }
};

export const DiscordCallback = async (code: number) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.get(
      `${url + `auth/discord-callback?code=${code}`}`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
export const Login = async (payload: any) => {
  try {
    token = localStorage.getItem("authorization");
    config1 = {
      headers: {
        "X-EntityToken": token,
        "Content-Type": "application/json",
      },
    };
    const url = process.env.REACT_APP_API_PLAYFAB_LOGIN;
    const response = await axios.post(url, payload, config1);
    return response;
  } catch (error) {
    return error?.response?.data;
  }
};
export const SignUp = async (payload: any) => {
  try {
    token = localStorage.getItem("authorization");
    const url = process.env.REACT_APP_API_PLAYFAB_REGISTER;
    const response = await axios.post(url, payload, config1);
    return response;
  } catch (error) {
    return error?.response?.data;
  }
};

export const WalletSignUp = async (payload: number) => {
  config = {
    headers: {
      Authorization: `${REQUEST_SECRET_KEY}`,
    },
  };
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post(
      `${url + `wallets/signup`}`,
      payload,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
export const WalletLogin = async (payload: number) => {
  config = {
    headers: {
      Authorization: `${REQUEST_SECRET_KEY}`,
    },
  };
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post(
      `${url + `wallets/login`}`,
      payload,
      config
    );
    return response.data;
  } catch (e) {
    return e;
  }
};

export const SendCustomBSCToken = async (payload: any) => {
  const { amount, walletId } = payload;
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post(
      `${url + "transactions/create-custom-wallet-bsc-transaction"}`,

      {
        walletId,
        amount,
      },
      config
    );
    return response.data;
  } catch (error) {
    toast.error(error);
  }
};

export const SendCustomSolanaToken = async (payload: any) => {
  const { amount, walletId } = payload;
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post(
      `${url + "transactions/create-custom-wallet-solana-transaction"}`,

      {
        walletId,
        amount,
      },
      config
    );
    return response.data;
  } catch (error) {
    toast.error(error);
  }
};

/* Activity Page */
export const allActivity = async (walletId: number, page: number) => {
  try {
    const url = process.env.REACT_APP_API_URL;

    const response = await axios.get(
      `${url + `activity/?walletId=${walletId}&page=${page}`}`
    );
    return response.data.data;
  } catch (error) {
    toast.error(error);
  }
};

export const withdrawFees = async (walletId: number) => {
  try {
    const amount = 0.5;

    const url = process.env.REACT_APP_API_URL;

    const response = await axios.post(
      `${url + "transactions/transfer-shill-tokens-from-bsc-wallet-to-address"
      }`,

      {
        walletId,
        amount,
      },
      config
    );
    return response.data;
  } catch (error) {
    toast.error(error);
  }
};

export const withdrawFeesOfSolanaWallet = async (walletId: number, returnFee: boolean) => {
  try {
    const amount = 0.5;

    const url = process.env.REACT_APP_API_URL;

    const response = await axios.post(
      `${url + "transactions/transfer-shill-tokens-from-sol-wallet-to-address"
      }`,

      {
        walletId,
        amount,
        returnFee
      },
      config
    );
    return response.data;
  } catch (error) {
    toast.error(error);
  }
};

export const SendNftsToWallet = async (token: string, dataPayload: any, mintedAddress: any, itemId: string, catalog: string, contractAddress: any, tokenId: number) => {
  try {
    token = localStorage.getItem("authorization");
    config1 = {
      headers: {
        "X-EntityToken": token,
        "Content-Type": "application/json",
      },
    };
    const metaData = dataPayload;
    let attributes = {};
    metaData?.attributes.forEach((value) => {
      let key = value?.trait_type;
      let values = value?.value ? value?.value : value?.string;
      attributes = { ...attributes, [key]: values };
    });
    const creators = metaData?.properties?.creators;
    delete metaData["properties"];
    delete metaData["attributes"];
    const nftData = { ...metaData, creators, attributes };
    const payload = {
      FunctionName: "TryCraftNFTItem",
      GeneratePlayStreamEvent: true,

      FunctionParameter: {
        ...nftData,
        mintedAddress,
        catalog,
        itemId,
        tokenId,
        contractAddress
      },
    };
    const url = process.env.REACT_APP_API_PLAYFAB;

    const response = await axios.post(url, payload, config1);
    const { data } = response;
    return data;
  } catch (e) {
    handleSectionExpire(e)
  }
};

export const getInventoryNftsFromGameWallet = async (token: string) => {
  try {
    token = localStorage.getItem("authorization");
    config1 = {
      headers: {
        "X-EntityToken": token,
        "Content-Type": "application/json",
      },
    };
    const payload = {
      FunctionName: "GetAllItems",
      GeneratePlayStreamEvent: true,

      FunctionParameter: {
        isNFT: true, //you can filter for NFT items
      },
    };
    const url = process.env.REACT_APP_API_PLAYFAB;
    const response = await axios.post(url, payload, config1);
    const { data } = response;
    return data;
  } catch (e) {
    handleSectionExpire(e)
  }
};

//Add NFT to Favorites

export const addToFavorite = async (id: number, address: any, type: number) => {
  try {
    const url = process.env.REACT_APP_API_URL;

    const response = await axios.post(
      `${url + "wallets/favouriteNft"}`,

      {
        id,
        address,
        type,
      },
      config
    );
    return response.data;
  } catch (error) {
    toast.error(error);
  }
};

export const getFavorite = async (walletId: number, type: number) => {
  try {
    const url = process.env.REACT_APP_API_URL;

    const response = await axios.get(
      `${url + `wallets/favouriteNft?id=${walletId}&&type=${type}`}`
    );
    return response.data;
  } catch (error) {
    toast.error(error);
  }
};

export const transferNfts = async (
  walletId: any,
  mintAddress: any,
  imageUrl: any,
  name: any,
  serialNumber: any
) => {
  try {
    const url = process.env.REACT_APP_API_URL;

    const response = await axios.post(
      `${url + "transactions/transferNft"}`,

      {
        walletId,
        mintAddress,
        imageUrl,
        serialNumber,
        name,
      },
      config
    );
    return response.data;
  } catch (error) {
    toast.error(error);
  }
};

export const transferNftTOWallet = async (
  walletId: any,
  mintAddress: any,
  imageUrl: any,
  name: any,
  serialNumber: any
) => {
  try {
    const url = process.env.REACT_APP_API_URL;

    const response = await axios.post(
      `${url + "transactions/transferToWallet"}`,

      {
        walletId,
        mintAddress,
        imageUrl,
        serialNumber,
        name,
      },
      config
    );
    return response.data;
  } catch (error) {
    toast.error(error);
  }
};



export const getSingleInventoryNft = async (token: string, id: any) => {
  try {
    token = localStorage.getItem("authorization");
    config1 = {
      headers: {
        "X-EntityToken": token,
        "Content-Type": "application/json",
      },
    };
    const payload = {
      FunctionName: "GetItemById",
      GeneratePlayStreamEvent: true,

      FunctionParameter: {
        itemInstanceId: id
      }
    }
    const url = process.env.REACT_APP_API_PLAYFAB;
    const response = await axios.post(url, payload, config1);
    const { data } = response;
    return data.data?.FunctionResult.nftItems[0];
  } catch (e) {
    handleSectionExpire(e)
  }
};


export const revokeInventoryNft = async (id: any, token: string) => {
  try {
    token = localStorage.getItem("authorization");
    config1 = {
      headers: {
        "X-EntityToken": token,
        "Content-Type": "application/json",
      },
    };

    const payload = {
      FunctionName: "RevokeItem",
      GeneratePlayStreamEvent: true,
      FunctionParameter: {
        itemInstanceId: id
      }
    }
    const url = process.env.REACT_APP_API_PLAYFAB;
    const response = await axios.post(url, payload, config1);
    const { data } = response;
    return data.data?.FunctionResult.isSuccess;
  } catch (e) {
    handleSectionExpire(e)
  }
};



export const createNft = async (
  payload: any,
) => {
  try {
    const url = process.env.REACT_APP_API_URL;

    const response = await axios.post(
      `${url + "transactions/createNft"}`,

      {
        payload
      },
      config
    );
    return response.data;
  } catch (error) {
    toast.error(error);
  }
};


export const UploadMetaData = async (metaData: object) => {
  try {
    const url = process.env.REACT_APP_API_METADATA_SERVER_URL;
    const response = await axios.post(
      `${url + "metaData"}`,

      {
        metadata: metaData
      },
      config
    );
    let URI = url + "metadata/" + response.data.data._id
    return URI

  } catch (error) {
    toast.error(error);
  }

}
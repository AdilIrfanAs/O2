export const token = localStorage.getItem("authorization");
export const Wallets: any = JSON.parse(localStorage.getItem("Wallets"));
export const expire: any = localStorage.getItem("expire");
export const NftOwner = localStorage.getItem("NftOwner");
export const handleSectionExpire = (e) => {
    let expireTime = localStorage.getItem("expire");
    if (expireTime) {
        const date = new Date().toISOString();
        if (date >= expireTime) {
            localStorage.removeItem("Wallets");
            localStorage.removeItem("authorization");
            localStorage.removeItem("expire");
        }
    }
    else{
        console.log(e)
    }

}
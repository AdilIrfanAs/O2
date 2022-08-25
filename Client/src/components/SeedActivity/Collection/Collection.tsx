import "./Collection.css";
import { useState, useEffect } from "react";
import { GetNft } from "../../../utils/SolanaConnection/SolanaNFTs";
const Collection = (props: any) => {

  //states

  const [selectedWallet, setSelectedWallet] = useState<string>('');

  useEffect(() => {
    if (props.SelectedWallet) {
      setSelectedWallet(props.SelectedWallet);
    }
  }, [props.SelectedWallet]);
  
  return (
    <>
      <GetNft
        LoggedOut={props.LoggedOut}
        LoggedIn={props.LoggedIn}
        SelectedWallet={selectedWallet}
      />
    </>
  );
};

export default Collection;

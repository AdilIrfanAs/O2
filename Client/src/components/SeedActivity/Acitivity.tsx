import Activity from "./ActivityTabs/ActivityTabs";
import { useState, useEffect } from "react";

const SeedTokenTransfer = (props: any) => {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [loggedout, setLoggedout] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {

    if (props.LoggedIn === true) {
      setLoggedIn(props.LoggedIn);
      setLoggedout(false);
    }
  }, [props.LoggedIn])
  useEffect(() => {
    if (props.Loggedout === true) {
      setLoggedIn(false);
      setLoggedout(props.Loggedout);
    }
  }, [props.Loggedout])
  useEffect(() => {
    setSelectedWallet(props.SelectedWallet);
  }, [props.SelectedWallet])
  return (
    <>
      <Activity
        LoggedOut={loggedout}
        LoggedIn={loggedIn}
        SelectedWallet={selectedWallet}
      />
    </>
  );
};

export default SeedTokenTransfer;

import { Outland } from "../../../utils/Outland/Outland"
import { useState, useEffect } from "react";
const OutlandOdyssey = (props: any) => {

    //states

    const [selectedWallet, setSelectedWallet] = useState<string>('');
    const [loggedout, setLoggedout] = useState<boolean>(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        if (props.LoggedOut === true) {
            setLoggedout(props.LoggedOut);
            setLoggedIn(false);
        } else if (props.LoggedIn === true) {
            setLoggedIn(props.LoggedIn);
            setLoggedout(false);
        }
    }, [props.LoggedOut, props.LoggedIn]);

    useEffect(() => {
        if (props.SelectedWallet) {
            setSelectedWallet(props.SelectedWallet);
        }
    }, [props.SelectedWallet]);

    return (

        <>
            <Outland LoggedOut={loggedout}
                LoggedIn={loggedIn}
                SelectedWallet={selectedWallet} />
        </>

    );
}
export default OutlandOdyssey;
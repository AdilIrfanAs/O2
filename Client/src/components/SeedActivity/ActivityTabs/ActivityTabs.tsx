import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Activity from "../Activity/Activity";
import Collection from "../Collection/Collection";
import OutlandOdyssey from "../../SeedActivity/OutlandOdyssey/OutlandOdyssey";
import TabContent from "./TabContent";
import TabNavItem from "./TabNavItem";
import { FavoriteNft } from "../FavoriteNfts/FavoriteNfts";
import "./activitytabs.css";
import WalletIcon from "../../../assets/images/wallet-icon.svg";
import OdysseyLogo from "../../../assets/images/outland-odyssey-logo.svg";


const ActivityTabs = (props: any) => {

  //states

  const [activeTab, setActiveTab] = useState<string>("tab1");
  const [loggedout, setLoggedout] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [selectedWallet, setSelectedWallet] = useState<string>('');

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
      <section>
        <div className="collection-spacing activity-tabs">
          <ul className="nav">
            <TabNavItem
              title="Wallet Inventory"
              id="tab1"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabIcon={WalletIcon}
            />
            <TabNavItem
              title="In-Game Inventory"
              id="tab2"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabIcon={OdysseyLogo}
            />
            <TabNavItem
              title="Activity"
              id="tab3"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabIcon={WalletIcon}
            />
            {/* <TabNavItem
              title="Favorite"
              id="tab4"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabIcon={WalletIcon}
            /> */}
          </ul>
          <Container fluid className="block-container">
            <Row>
              <Col>
                <div className="tabs">
                  <div className="outlet">
                    <TabContent id="tab1" activeTab={activeTab}>
                      <Collection
                        LoggedOut={loggedout}
                        LoggedIn={loggedIn}
                        SelectedWallet={selectedWallet}
                      />
                    </TabContent>
                    <TabContent id="tab2" activeTab={activeTab}>
                      <OutlandOdyssey
                        LoggedOut={loggedout}
                        LoggedIn={loggedIn}
                        SelectedWallet={selectedWallet}
                      />
                    </TabContent>
                    <TabContent id="tab3" activeTab={activeTab}>
                      <Activity LoggedOut={loggedout} LoggedIn={loggedIn} />
                    </TabContent>
                    {/* <TabContent id="tab4" activeTab={activeTab}>
                      <FavoriteNft LoggedOut={loggedout} LoggedIn={loggedIn} />
                    </TabContent> */}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </>
  );
};
export default ActivityTabs;

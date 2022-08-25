import { Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import CustomTabs from "../CustomTabs/CustomTabs";
import { Wallet } from "../../utils/SolanaConnection/SolanaWallet";
import { OnboardingButton } from "../../utils/web3Connection/MetaMask.web3";
import bsc from "../../assets/images/bsc.svg";
import solana from "../../assets/images/solana.png";
import { isMobile } from "react-device-detect";
declare const window: any;
interface options {
  value: string;
  text: string;
  icon: any;
}
interface data {
  value: number;
  text: string;
  icon: any;
}

const Tokens: React.FC = () => {
  let options: options[] = [
    {
      value: "Solana",
      text: "Solana",
      icon: (
        <span className="drop-down-images">
          <img src={solana} alt="" />
        </span>
      ),
    },
    {
      value: "Binance Smart Chain",
      text: "Binance Smart Chain",
      icon: (
        <span className="drop-down-images">
          <img src={bsc} alt="" />
        </span>
      ),
    },
  ];
  const [selectedOption, setSelectedOption] = useState<any>({
    value: "select options",
    text: "Select options",
    icon: "",
  });
  const [targetOption, setTargetOption] = useState<any>({
    value: "Select options",
    text: "Select options",
    icon: "",
  });
  const [address, setAddress] = useState<string | null>("");
  const [phantomAddress, setPhantomAddress] = useState<string | null>("");
  const [targetOptions, setTargetOptions] = useState<options[] | null>([]);
  const [state, setState] = useState();

  const scopePollingDetectionStrategy = () => {
    if (window.solana?.isPhantom) {
      return "Phantom";
    } else if (window.ethereum?.isMetaMask) {
      return "MetaMask";
    } else if (window.solflare?.isSolflare || window.SolflareApp) {
      return "Solflare";
    }
    return false;
  };

  const handleChange = async (e: any) => {
    setSelectedOption(e);
    setTargetOption({ value: "select options", text: "Select options" });
    const index = options.map((object) => object.value).indexOf(e.value);
    delete options[index];
    setTargetOptions(options);
  };
  const handleTargetOptions = (e: any) => {
    setTargetOption(e);
  };
  const SwapOptions = () => {
    const source = targetOption;
    const target = selectedOption;
    if (
      source.value != "Select options" &&
      target.value != "select options" &&
      source.value != "select options" &&
      target.value != "Select options"
    ) {
      setSelectedOption({
        value: source.value,
        text: source.text,
        icon: source.icon,
      });
      setTargetOption({
        value: target.value,
        text: target.text,
        icon: target.icon,
      });
      const index = options.map((object) => object.value).indexOf(source.value);
      delete options[index];
      setTargetOptions(options);
    }
  };

  useEffect(() => {
    setAddress(localStorage.getItem("walletAddress"));
    setPhantomAddress(localStorage.getItem("PhantomAddress"));
  }, [address]);

  const setOptions = async () => {
    if (isMobile) {
      const state = await scopePollingDetectionStrategy();
      if (state === "MetaMask") {
        setSelectedOption(options[1]);
        setTargetOption(options[0]);
        return true;
      } else if (state === "Phantom" || state === "Solflare") {
        setSelectedOption(options[0]);
        setTargetOption(options[1]);
        return true;
      } else {
        return false;
      }
    }
  };
  useEffect(() => {
    const setOptionsCheck = async () => {
      if (isMobile) {
        let data: any = await setOptions();
        setState(data);
      }
    };
    setOptionsCheck();
  }, []);
  return (
    <div>
      <section className="tokens">
        <Container>
          <div className="custom-container">
            <h2>Tokens</h2>
            <div className="box-wrapper">
              <fieldset>
                <legend className="token-counts">1. Source</legend>
                <div className="d-flex justify-content-between align-items-center select-token-content">
                  <p className="text-select-token">
                    Select tokens to send through the Portal.
                  </p>
                </div>
                <div className="fields-wrapper">
                  <div className="field-wrapper">
                    <label htmlFor="currency" className="form-label">
                      Source
                    </label>
                    {isMobile ? (
                      <Select<options | any>
                        placeholder="Select Option"
                        value={selectedOption}
                        options={state ? selectedOption : options}
                        classNamePrefix="custom-react-select"
                        onChange={handleChange}
                        getOptionLabel={(e): any => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {e.icon}
                            <span style={{ marginLeft: 15 }}>{e?.text}</span>
                          </div>
                        )}
                      />
                    ) : (
                      <Select<options | any>
                        placeholder="Select Option"
                        value={selectedOption}
                        options={options}
                        classNamePrefix="custom-react-select"
                        onChange={handleChange}
                        getOptionLabel={(e): any => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {e.icon}
                            <span style={{ marginLeft: 15 }}>{e?.text}</span>
                          </div>
                        )}
                      />
                    )}
                  </div>
                  {isMobile ? (
                    <div className="btn link-butn multibuttons"> </div>
                  ) : (
                    <button
                      type="submit"
                      className="btn link-butn multibuttons"
                      onClick={SwapOptions}
                    >
                      <span className="simple--btn">
                        <FontAwesomeIcon
                          className="arrow"
                          icon={faArrowRight}
                        />
                      </span>
                      <span className="bg-grey arrow-icon">
                        <FontAwesomeIcon
                          className="arrow show-icon"
                          icon={faArrowLeft}
                        />
                      </span>
                    </button>
                  )}
                  <div className="field-wrapper">
                    <label htmlFor="currency" className="form-label">
                      Target
                    </label>
                    {isMobile ? (
                      <Select<data | any>
                        placeholder="Select Option"
                        value={targetOption}
                        options={state ? targetOption : targetOptions}
                        classNamePrefix="custom-react-select"
                        onChange={handleTargetOptions}
                        getOptionLabel={(e): any => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {e.icon}
                            <span style={{ marginLeft: 15 }}>{e.text}</span>
                          </div>
                        )}
                      />
                    ) : (
                      <Select<data | any>
                        placeholder="Select Option"
                        value={targetOption}
                        options={targetOptions}
                        classNamePrefix="custom-react-select"
                        onChange={handleTargetOptions}
                        getOptionLabel={(e): any => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {e.icon}
                            <span style={{ marginLeft: 15 }}>{e.text}</span>
                          </div>
                        )}
                      />
                    )}
                  </div>
                </div>
                {selectedOption.text === "Binance Smart Chain" ||
                selectedOption.text === "Solana" ? (
                  <div className="btn-wrapper d-flex justify-content-center">
                    {selectedOption.text === "Binance Smart Chain" ? (
                      <div>
                        <OnboardingButton />
                      </div>
                    ) : (
                      <Wallet />
                    )}
                  </div>
                ) : null}
                <div className="btn-wrapper next-btn d-flex wraper-gradient-rounded-bg">
                  <a href="#target">
                    <button
                      type="submit"
                      className="disconnect-wallet btn btn-secondary gradient-rounded-bg"
                    >
                      Next
                    </button>
                  </a>
                </div>
              </fieldset>
            </div>
            <CustomTabs
              targetWallet={targetOption.text}
              targetWalletcurrency={targetOption.value}
              selectedWallet={selectedOption.text}
              selectedWalletcurrency={selectedOption.value}
              walletAddress={address}
              phantomAddress={phantomAddress}
            />
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Tokens;

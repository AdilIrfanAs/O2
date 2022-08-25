import { Container, Navbar, Nav, Dropdown, Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../assets/images/logo.svg";
import Mobilelogo from "../../assets/images/mobile-logo.svg"
import MobileGear from "../../assets/images/header-right-gear.png"
import CenterGear from "../../assets/images/mobile-header-gear.png"
import coin1 from "../../assets/images/coin1.png";
import coin2 from "../../assets/images/coin2.png";
import leftGear from "../../assets/images/left-upper-gear.png"
import leftBgGear from "../../assets/images/left-bg-gear.png"
import rightGear from "../../assets/images/right-bg-gear1.png"
import LogOut from "../../assets/images/log-out.svg"
import MenuTopGear from "../../assets/images/menu-top-gear.png"
import MenuBottomGear from "../../assets/images/menu-bottom-gear.png"
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getSolanaTokenBalance, getSPlTokenBalance, getSolanaO2TokenBalnce, getSolanaShillToken, getSolanaShillTokenBalance } from "../../utils/SolanaConnection/SolanaPhantom";
import { GetCurrencyAmount, GetShillCurrencyAmount } from "../../utils/api/Web3.api";
import { getBSCBalanceandToken } from "../../utils/web3Connection/web3";
import { token, expire } from "../../utils/sharedVariable"
import "./Header.css";
import "fa-icons";

const Header = (props: any) => {

	let history = useNavigate()
	const refOne = useRef(null);
	const { onClickOutside } = props;
	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
	}, [onClickOutside]);
	const handleClickOutside = (event: any) => {
		if (!refOne.current.contains(event.target)) {
			setsidebar(true)
		}
	};
	const [exportShow, setExportShow] = useState<boolean>(false);
	const [walletKey, setWalletKeys] = useState(null);
	const [bscTokenBalance, setBscTokenbalance] = useState<number>(0);
	const [solTokenBalance, setSolTokenbalance] = useState<number>(0);
	const [updateBalance, setUpdateBalance] = useState<boolean>(false);
	const [walletSelect, setWalletSelect] = useState("Binance");
	const [exprieDate, setExpireDate] = useState('');
	const [o2ContractToken, setO2ContractToken] = useState("");
	const [bscBalance, setBscBalance] = useState<number>(0);
	const [solBalance, setSolBalance] = useState<number>(0);
	const [o2SolContractToken, setO2SolContractToken] = useState<number>(0);
	const [shillToken, setShillToken] = useState<number>(0);
	const [solanaShillToken, setSolanaShillToken] = useState<number>(0);
	const [solanaShillContractionToken, setSolanaShillContractionToken] = useState<number>(0);
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [o2AvailableTokens, setO2AvailableTokens] = useState<number>(0)
	const [shillAvailableTokens, setShillAvailableTokens] = useState<number>(0)
	const [toggleBtn, setsidebar] = useState<boolean>(true);

	let pathName = window.location?.pathname
	const handleExportClose = () => setExportShow(false);
	const handleExportShow = () => setExportShow(true);
	const textAreaRef = useRef(null);

	const handleSelect = (options: string) => {
		setWalletSelect(options);
	};

	const getO2CurrencyAmount = async () => {
		if (token) {
			const response = await GetCurrencyAmount(token);
			response?.data?.FunctionResult?.amount
				? setO2AvailableTokens(response.data.FunctionResult.amount)
				: setO2AvailableTokens(0);
		}
	};
	const getShillCurrencyAmount = async () => {
		if (token) {
			const response = await GetShillCurrencyAmount(token);
			response?.data?.FunctionResult?.amount
				? setShillAvailableTokens(response.data.FunctionResult.amount)
				: setShillAvailableTokens(0);
		}
	};

	const getBinacebalance = async (data) => {
		if (data?.wallet?.bsc?.public_key) {
			const Tokenbalance: any = await getBSCBalanceandToken(
				data?.wallet?.bsc?.public_key
			);
			setBscTokenbalance(Tokenbalance.token);
			setO2ContractToken(Tokenbalance.O2TokenBalance);
			setBscBalance(Tokenbalance.bscBalance);
			setShillToken(Tokenbalance.shillTokenBalance);
		}
	};


	const getSolanabalance = async (data) => {

		const Tokenbalance: any =
			(await getSolanaTokenBalance(data?.wallet?.sol?.public_key))
		setSolTokenbalance(Number(Tokenbalance ? Tokenbalance : 0));
		const balance: any =
			(await getSPlTokenBalance(data?.wallet?.sol?.public_key)) / 1000000000;
		setSolBalance(Number(balance ? balance : 0));
		const O2ContractToken: any = (await getSolanaO2TokenBalnce()) / 1000000000;
		setO2SolContractToken(Number(O2ContractToken ? O2ContractToken : 0));
		const shillTokenBalance: number =
			(await getSolanaShillTokenBalance(data?.wallet?.sol?.public_key))
		setSolanaShillToken(Number(shillTokenBalance ? shillTokenBalance : 0));


		const shillContractToken = (await getSolanaShillToken())
		setSolanaShillContractionToken(Number(shillContractToken ? shillContractToken : 0));

	};

	const disconnect = () => {

		localStorage.removeItem("Wallets");
		localStorage.removeItem("authorization");
		localStorage.removeItem("expire");
		localStorage.removeItem("NftOwner");
		setWalletKeys(null);
		setSolBalance(0);
		setSolTokenbalance(0);
		setUpdateBalance(false);
		setBscTokenbalance(0);
		setWalletSelect("Binance");
		setExpireDate(null);
		setO2ContractToken("");
		setBscBalance(0);
		setO2SolContractToken(0);
		setShillToken(0);
		setShillAvailableTokens(0)
		setO2AvailableTokens(0)
		setsidebar(true)
		props.OuthHandler(true);
		history("/login")
	};
	useEffect(() => {

		props.SelectedWallet(
			walletSelect,
			walletKey,
			bscTokenBalance,
			solTokenBalance,
			bscBalance,
			solBalance,
			o2ContractToken,
			o2SolContractToken,
			shillToken,
			solanaShillToken
		);
	}, [walletKey])

	useEffect(() => {

		if (props.UpdateBalance === true) {
			getBinacebalance(walletKey);
			getSolanabalance(walletKey);
			getO2CurrencyAmount()
			getShillCurrencyAmount()
		}

	}, [props.UpdateBalance]);
	useEffect(() => {
		if (props.UpdateWallet) {
			setWalletSelect(props.UpdateWallet)
		}
	}, [props.UpdateWallet])

	useEffect(() => {

		if (walletKey || bscTokenBalance || solTokenBalance) {
			props.SelectedWallet(
				walletSelect,
				walletKey,
				bscTokenBalance,
				solTokenBalance,
				bscBalance,
				solBalance,
				o2ContractToken,
				o2SolContractToken,
				shillToken,
				solanaShillToken,
				o2AvailableTokens,
				shillAvailableTokens
			);
		}

	}, [
		walletSelect, walletKey, bscTokenBalance, solTokenBalance, o2ContractToken, o2SolContractToken, shillToken, o2AvailableTokens, solanaShillToken, shillAvailableTokens]);

	useEffect(() => {
		let Wallet = JSON.parse(localStorage.getItem("Wallets"));

		let expireTime = localStorage.getItem("expire");
		setWalletKeys(Wallet);
		getBinacebalance(Wallet);
		getSolanabalance(Wallet);
		getO2CurrencyAmount()
		getShillCurrencyAmount()
		setExpireDate(expireTime);
		if (expireTime) {
			const date = new Date().toISOString();
			if (date >= expireTime) {
				localStorage.removeItem("Wallets");
				localStorage.removeItem("authorization");
				localStorage.removeItem("expire");
				setWalletKeys(null);
				toast.error("Session_expire");
				history("/login")
			}
		}
	}, []);

	return (
		<>
			<div className={`sidebar-overlay ${!toggleBtn ? 'active' : ''}`}></div>
			<div className={pathName.includes("/nft-details") || pathName.includes("/SeedNftTransfer") || pathName.includes("/SeedNftTransfer2") ? "seed-header add-icon-header position-relative" : "seed-header position-relative"}>
				<Navbar expand="lg">
					<Container fluid className="p-0">
						<Link to="/" className="navbar-brand me-0 d-lg-inline-block d-none">
							<figure className="mb-0">
								<img src={logo} alt="Site Logo" />
							</figure>
						</Link>
						<Link to="/" className="navbar-brand mobile-header-logo me-0 d-lg-none d-inline-block">
							<figure className="mb-0">
								<img src={Mobilelogo} alt="Site Logo" />
							</figure>
						</Link>
						<Link to="/" className="header-back-link ms-sm-4 ms-2 mb-0">
							<FontAwesomeIcon className="me-0" icon={faArrowLeft} />
						</Link>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Nav className="mx-xl-auto ms-auto d-lg-flex flex-row align-items-lg-center haeder-show position-relative d-none">
							<Link
								to="/"
								className={pathName === "/" ? "nav-link active" : "nav-link"}
							>
								NFTs
							</Link>
							<Link
								to="/SeedTokenTransfer"
								className={pathName === "/SeedTokenTransfer" ? "nav-link active" : "nav-link "}
							>
								Token Transfers
							</Link>
						</Nav>
						<p className="text-white mb-0 d-lg-none mobile-wallet-address">
							{`${walletKey?.wallet?.bsc?.public_key.substring(
								0,
								4
							)} ... ${walletKey?.wallet?.bsc?.public_key.substring(
								40,
								44
							)}`}
						</p>
						<span className="user-name d-lg-inline-block d-none">{walletKey?.wallet?.username}</span>
						<div ref={refOne} >
							<span role="button" className="sidebar-toggle" onClick={() => setsidebar(!toggleBtn)}>
								<i className="fa fa-bars" aria-hidden="true"></i>
							</span>
							<aside className={`sidebar ${toggleBtn ? "show-sidebar" : ""
								}`}>
								{/* <div className="sidebar-header">
							</div> */}
								<div className="token-transfer-form fram mb-0 position-relative">
									<div className="fram-content">
										<span role="button" className="sidebar-toggle d-lg-none ms-auto" onClick={() => setsidebar(!toggleBtn)}>
											<i className="fa fa-times" aria-hidden="true"></i>
											{/* <i className="fa fa-bars ms-auto" aria-hidden="true"></i> */}
										</span>
										<div className="token-sec-wrapper">
											<Dropdown className="elipse-btn img-input-wrapper mx-auto position-relative">
												<div className="dropdown-button--bg">
													<Dropdown.Toggle
														className="d-flex align-items-center img-input"
														variant="none"
														id="dropdown-basic"
													>
														<p className="text-uppercase text-white mb-0">
															{walletSelect}
														</p>
													</Dropdown.Toggle>
												</div>
												<Dropdown.Menu className="dropdown-button--bg position-absolute">
													<div className="img-input px-0">
														<Dropdown.Item
															className="d-flex justify-content-between align-items-center "
															onClick={() => handleSelect("Binance")}
														>
															<p className="text-uppercase text-white mb-0">
																Binance
															</p>
														</Dropdown.Item>
														<Dropdown.Item onClick={() => handleSelect("Solana")}>
															<p className="text-uppercase text-white mb-0">Solana</p>
														</Dropdown.Item>
													</div>
												</Dropdown.Menu>
											</Dropdown>
											<p className="mb-3 text-center">In-game Tokens</p>
											<div className="d-lg-flex justify-content-between">
												<div className="img-input-wrapper position-relative">
													<figure className="mb-0">
														<img src={coin1} alt="Site Logo"></img>
													</figure>
													<div className="dropdown-button--bg">
														<div className="d-flex align-items-center justify-content-center img-input">
															{shillAvailableTokens}
														</div>
													</div>
												</div>
												<div className="img-input-wrapper m-0 position-relative">
													<figure className="mb-0">
														<img src={coin2} alt="Site Logo"></img>
													</figure>
													<div className="dropdown-button--bg">
														<div className="d-flex align-items-center justify-content-center img-input">
															{o2AvailableTokens}
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="token-sec-wrapper">
											{walletSelect === "Binance" ? (
												walletKey ? (
													<Dropdown
														className="elipse-btn img-input-wrapper mx-auto position-relative"
														id="elips"
														title={`${walletKey?.wallet?.bsc?.public_key.substring(
															0,
															4
														)} ... ${walletKey?.wallet?.bsc?.public_key.substring(
															38,
															44
														)}`}
													>
														<div className="dropdown-button--bg">
															<Dropdown.Toggle
																className="d-flex align-items-center img-input"
																variant="none"
																id="dropdown-basic"
															>
																<p className="text-uppercase text-white mb-0">
																	{`${walletKey?.wallet?.bsc?.public_key.substring(
																		0,
																		4
																	)} ... ${walletKey?.wallet?.bsc?.public_key.substring(
																		40,
																		44
																	)}`}
																</p>
															</Dropdown.Toggle>
														</div>
														<Dropdown.Menu className="dropdown-button--bg position-absolute">
															<div className="img-input px-0">
																<Dropdown.Item
																	onClick={() => {
																		navigator.clipboard.writeText(
																			walletKey?.wallet?.bsc?.public_key
																		);
																		toast.success("copied");
																	}}
																>
																	Copy address
																</Dropdown.Item>
																<Dropdown.Item className="ellipse-text2">
																	{Number(bscBalance).toFixed(2)} BNB
																</Dropdown.Item>
																<Dropdown.Item>{bscTokenBalance} O2Token</Dropdown.Item>{" "}
																<Dropdown.Item onClick={handleExportShow}>
																	Export Private key
																</Dropdown.Item>
															</div>
														</Dropdown.Menu>
													</Dropdown>
												) : (
													<span>xxxx...xxxx</span>
												)
											) : walletKey ? (
												<Dropdown
													className="elipse-btn img-input-wrapper mx-auto position-relative"
													id="dropdown-basic-button"
													title={`${walletKey?.wallet?.sol?.public_key.substring(
														0,
														4
													)} ... ${walletKey?.wallet?.sol?.public_key.substring(
														40,
														44
													)}`}
												>
													<div className="dropdown-button--bg">
														<Dropdown.Toggle
															className="d-flex align-items-center img-input"
															variant="none"
															id="dropdown-basic"
														>
															<p className="text-uppercase text-white mb-0">
																{`${walletKey?.wallet?.sol?.public_key.substring(
																	0,
																	4
																)} ... ${walletKey?.wallet?.sol?.public_key.substring(
																	40,
																	44
																)}`}
															</p>
														</Dropdown.Toggle>
													</div>
													<Dropdown.Menu className="dropdown-button--bg position-absolute">
														<div className="img-input px-0">
															<Dropdown.Item
																onClick={() => {
																	navigator.clipboard.writeText(
																		walletKey?.wallet?.sol?.public_key
																	);
																	toast.success("copied");
																}}
															>
																Copy address
															</Dropdown.Item>
															<Dropdown.Item className="ellipse-text2">
																{Number(solBalance).toFixed(2)} Sol
															</Dropdown.Item>
															<Dropdown.Item>{solTokenBalance} O2Token</Dropdown.Item>{" "}
															<Dropdown.Item onClick={handleExportShow}>
																Export Private key
															</Dropdown.Item>
														</div>
													</Dropdown.Menu>
												</Dropdown>
											) : (
												<span>xxxx...xxxx</span>
											)}
											<p className="mb-3 text-center">Wallet Tokens</p>
											<div className="d-lg-flex justify-content-between">
												<div className="img-input-wrapper m-lg-0 position-relative">
													<figure className="mb-0">
														<img src={coin1} alt="Site Logo"></img>
													</figure>
													<div className="dropdown-button--bg">
														<div className="d-flex align-items-center justify-content-center img-input">
															{walletSelect === "Binance" ? (
																<p className="ms-2">{Number(shillToken).toFixed(2)} </p>
															) : (
																<p className="ms-2"> {Number(solanaShillToken).toFixed(2)} </p>
															)}
														</div>
													</div>
												</div>
												<div className="img-input-wrapper m-0 position-relative">
													<figure className="mb-0">
														<img src={coin2} alt="Site Logo"></img>
													</figure>
													<div className="dropdown-button--bg">
														<div className="d-flex align-items-center justify-content-center img-input">
															{walletSelect === "Binance" ? (
																<p className="ms-2">{bscTokenBalance} </p>
															) : (
																<p className="ms-2"> {solTokenBalance} </p>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<Nav className="mx-xl-auto ms-auto position-relative d-lg-none d-block mb-4">
										<Link
											to="/"
											className="nav-link active d-block text-end mx-0 mb-3"
										>
											NFTs
										</Link>
										<Link
											to="/SeedTokenTransfer"
											className="nav-link active d-block text-end mx-0"
										>
											Token Transfers
										</Link>
									</Nav>
									<button className="log-out-btn d-flex align-items-center" onClick={disconnect}>
										<figure className="me-2 mb-0">
											<img src={LogOut} alt="Log out img" />
										</figure>
										Log out
									</button>
									<figure className="top-gear mb-0">
										<img src={MenuTopGear} alt="Top Gear" />
									</figure>
									<figure className="bottom-gear mb-0">
										<img src={MenuBottomGear} alt="Bottom Gear" />
									</figure>
								</div>
							</aside >
						</div >
					</Container >
					<figure className="left-bg-gear mb-0 d-lg-block d-none">
						<img src={leftBgGear} alt="leftbgGear" />
					</figure>
					<figure className="left-gear mb-0 d-lg-block d-none">
						<img className="img-fluid" src={leftGear} alt="leftGear" />
					</figure>
					<figure className="right-gear mb-0 d-lg-block d-none">
						<img className="img-fluid" src={rightGear} alt="rightGear" />
					</figure>
					<figure className="mobile-center-gear mb-0 d-lg-none">
						<img src={CenterGear} alt="molile header gear" />
					</figure>
					<figure className="mobile-right-gear mb-0 d-lg-none">
						<img src={MobileGear} alt="molile header gear" />
					</figure>
				</Navbar >
				<Modal
					show={exportShow}
					onHide={handleExportClose}
					className="header-modal"
				>
					<Modal.Body>
						{walletSelect === "Binance" ? (
							<div>
								<Form.Control
									as="textarea"
									value={walletKey?.wallet?.bsc?.private_key}
									style={{ height: "100px" }}
									ref={textAreaRef}
								/>
							</div>
						) : (
							<div>
								<Form.Control
									as="textarea"
									value={walletKey?.wallet?.sol?.private_key}
									style={{ height: "100px" }}
									ref={textAreaRef}
								/>
							</div>
						)}
					</Modal.Body>

					<Modal.Footer>
						<div className="d-flex flex-sm-row flex-column justify-content-between align-items-center w-100">
							<button
								className="btn btn-secondary"
								onClick={() => {
									navigator.clipboard.writeText(
										walletKey?.wallet?.sol?.private_key
									);
									textAreaRef.current.select();
									toast.success("copied");
								}}
							>
								<FontAwesomeIcon icon={faCopy} />
							</button>
							<p className="text-center my-1">
								{" "}
								<Button
									className="btn text-center modal-btn"
									onClick={handleExportClose}
								>
									Ok, I've written this down
								</Button>
							</p>
						</div>
					</Modal.Footer>
				</Modal>
			</div >
			{/* <div className="header-content-hide">
				<p className="ellipse-text d-flex align-items-center gradient-button fit-dropdown">
					{walletSelect === "Binance" ? (
						walletKey ? (
							<DropdownButton
								className="elipse-btn dropdown-button--bg"
								id="elips"
								title={`${walletKey?.wallet?.bsc?.public_key.substring(
									0,
									4
								)} ... ${walletKey?.wallet?.bsc?.public_key.substring(38, 44)}`}
							>
								<Dropdown.Item
									onClick={() => {
										navigator.clipboard.writeText(
											walletKey?.wallet?.bsc?.public_key
										);
										toast.success("copied");
									}}
								>
									Copy address
								</Dropdown.Item>
								<Dropdown.Item className="ellipse-text2">
									{bscBalance.substring(0, 4)} BNB
								</Dropdown.Item>
								<Dropdown.Item>{bscTokenBalance} O2Token</Dropdown.Item>{" "}
								<Dropdown.Item onClick={handleExportShow}>
									Export Private key
								</Dropdown.Item>
							</DropdownButton>
						) : (
							<span>xxxx...xxxx</span>
						)
					) : walletKey ? (
						<DropdownButton
							className="elipse-btn dropdown-button--bg"
							id="dropdown-basic-button"
							title={`${walletKey?.wallet?.sol?.public_key.substring(
								0,
								4
							)} ... ${walletKey?.wallet?.sol?.public_key.substring(40, 44)}`}
						>
							<Dropdown.Item
								onClick={() => {
									navigator.clipboard.writeText(
										walletKey?.wallet?.sol?.public_key
									);
									toast.success("copied");
								}}
							>
								Copy address
							</Dropdown.Item>
							<Dropdown.Item>{solBalance} Sol</Dropdown.Item>
							<Dropdown.Item>{solTokenBalance} O2Token</Dropdown.Item>
							<Dropdown.Item onClick={handleExportShow}>
								Export Private key
							</Dropdown.Item>
						</DropdownButton>
					) : (
						<span>xxxx...xxxx</span>
					)}
				</p>
				<div className="d-flex align-items-center img-input">
					<figure className="mb-0">
						<img src={coin2} alt="Site Logo"></img>
					</figure>
					{walletSelect === "Binance" ? (
						<p className="ms-2">{bscTokenBalance} </p>
					) : (
						<p className="ms-2"> {solTokenBalance} </p>
					)}
				</div>
			</div> */}
		</>
	);
};

export default Header;

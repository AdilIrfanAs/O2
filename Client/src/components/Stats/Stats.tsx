import React, { useState, useEffect } from 'react'
import { Container } from "react-bootstrap";

import { getTransactions, getExchange, getTwoDaysExchange, getTwoDaysTransactions } from "../../utils/api/Web3.api"
import moment from "moment"
const Stats: React.FC = () => {
    const [transactions, setTransactions] = useState(null)
    const [exchange, setExchange] = useState(null)
    const [twoDaysExchange, setTwoDaysExchange] = useState(null)
    const [twoDayTransactions, setTwoDaysTransactions] = useState(null)
    let EndDate: any = moment()
    EndDate = EndDate.format("YYYY-MM-DDTHH:mm:ss.ss")
    let startDate: any = moment()
    startDate = startDate.subtract(2, "days").format("YYYY-MM-DDTHH:mm:ss.ss")
    useEffect(() => {
        async function fetchMyAPI() {
            let AllTransactions = await getTransactions()
            let twoDaysTransactions = await getTwoDaysTransactions(startDate, EndDate)
            setTwoDaysTransactions(twoDaysTransactions)
            setTransactions(AllTransactions)
            let AllexchangeStats = await getExchange()
            setExchange(AllexchangeStats)
            let twoDaysexchangeStats = await getTwoDaysExchange(startDate, EndDate)
            setTwoDaysExchange(twoDaysexchangeStats)
        }
        fetchMyAPI()
    }
        , [])
    return (
        <div>
            <section className="tokens">
                <Container>
                    <div className="custom-container mt-4 ">
                        <h2>Exchange Count</h2>
                        <h6>This is how many exchanges the Token Bridge has processed.</h6>
                        <div className="box-wrapper mt-4 ">
                            <div className="jss108"><div className="jss109"><div className="MuiTypography-root MuiTypography-subtitle2 MuiTypography-noWrap">Last 48 Hours</div><div className="MuiTypography-root jss110 MuiTypography-h2 MuiTypography-noWrap">{twoDaysExchange?.length}</div></div><div className="jss109"><div className="MuiTypography-root MuiTypography-subtitle2 MuiTypography-noWrap">All Time</div><div className="MuiTypography-root jss110 MuiTypography-h2 MuiTypography-noWrap">{exchange?.length}</div></div></div>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="tokens">
                <Container>
                    <div className="custom-container mt-4 ">
                        <h2>Transaction Count</h2>
                        <h6>This is how many transactions the Token Bridge has processed.</h6>
                        <div className="box-wrapper mt-4 ">
                            <div className="jss108"><div className="jss109"><div className="MuiTypography-root MuiTypography-subtitle2 MuiTypography-noWrap">Last 48 Hours</div><div className="MuiTypography-root jss110 MuiTypography-h2 MuiTypography-noWrap">{twoDayTransactions?.length}</div></div><div className="jss109"><div className="MuiTypography-root MuiTypography-subtitle2 MuiTypography-noWrap">All Time</div><div className="MuiTypography-root jss110 MuiTypography-h2 MuiTypography-noWrap">{transactions?.length}</div></div></div>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    )
}

export default Stats
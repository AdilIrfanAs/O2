import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";

const  Footer =() => {
    return (
        <footer id="footer-design">
            <Container>
                <Row className="top-footer">
                    <Col lg={4}>
                        <strong className="logo-footer navbar-brand">
                            <Link to="#home">O2 Bridge</Link>
                        </strong>
                    </Col>
                    <Col lg={4} className="d-flex justify-content-center">
                        <div className="d-flex flex-column footer-linking contact-list">
                            <ul>
                                <li>
                                    <Link to="/apply-for">Bridge</Link>
                                </li>
                                <li>
                                    <Link to="/latest-news">FAQ</Link>
                                </li>
                                <li>
                                    <Link to="/contact-us">Stats</Link>
                                </li>
                            </ul>
                        </div>
                    </Col>
                    <Col lg={4} className="d-flex justify-content-center">
                        <div>
                            <p>Let's be friends</p>
                            <div className="social-icons">
                                <a className="arrow-icon" href="/" target="_blank">
                                    <FontAwesomeIcon icon={faDiscord} />
                                </a>
                                <a className="arrow-icon" href="/" target="_blank">
                                    <FontAwesomeIcon icon={faGithub} />
                                </a>
                                <a className="arrow-icon" href="/" target="_blank">
                                    <FontAwesomeIcon icon={faTelegram} />
                                </a>
                                <a className="arrow-icon" href="/" target="_blank">
                                    <FontAwesomeIcon icon={faTwitter} />
                                </a>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="">
                    <Col sm={12}>
                        <p>2022 © O2 Bridge. All Rights Reserved</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
export default Footer;

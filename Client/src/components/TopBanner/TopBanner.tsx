import {Container} from "react-bootstrap";

const TopBanner =() => {
    return (
        <div>
            <section className="top-banner-section">
                <Container>
                    <div className="content">
                        <h1>Token Bridge</h1>
                        <p>
                            Portal is a bridge that offers unlimited transfers across chains for tokens and NFTs wrapped by Wormhole.
                            <br />
                            Unlike many other bridges, you avoid double wrapping and never have to retrace your steps.
                        </p>
                    </div>
                </Container>
            </section>
        </div>
    );
}

export default TopBanner;

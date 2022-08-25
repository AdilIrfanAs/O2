import React from "react";
import './loader.css'
import LoaderImage from "../../assets/images/loader-anim.png"

const Loader: React.FC = () => {
    return (
        <>
            <div className="loading-overlay">
                <div className="load ">
                    <img className="loader-rotate" src={LoaderImage} alt="Loader Image" />
                </div>
            </div>
        </>
    )
}

export default Loader;
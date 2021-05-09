import React, { useState, useRef, useEffect } from 'react'
import "../styles/index.css";
import socket from "../socket";
import useChange from "../hooks/useChange";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import UploadImage from "./uploadImage";
import Errors from "./errors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const Index = () => {

    const [value, setValue] = useChange("");
    const [error, setError] = useState({
        status: false,
        message: ""
    });
    const [charge, setCharge] = useState(false);
    const valueImage = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (value === "") {
                setError({ status: true, message: "El nombre esta vacio. Escriba un nombre de usuario" });
                await setTimeout(() => {
                    setError({ status: false, message: "" });
                }, 4000);
            }
            else {
                socket.emit("new-user", { user: value, id: socket.id });
                window.localStorage.setItem("name", value);
                window.localStorage.setItem("id", socket.id);
                window.location.href = "/rooms";
            }
        }
        catch (err) {
            console.log(error);
        }
    };


    const uploadImage = async (e) => {
        try {
            const fileImg = e.target.files[0];
            if (fileImg) {
                const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmtd0lklr/image/upload";
                const CLOUDINARY_ID = "jdkpwzto";
                const data = new FormData();
                data.append("file", fileImg);
                data.append("upload_preset", CLOUDINARY_ID);
                setCharge(true);
                const res = await axios.post(CLOUDINARY_URL, data, {
                    headers: {
                        "Content-Type": "mulipart/form-data"
                    }
                });
                window.localStorage.setItem("img", res.data.url);
                setCharge(false);
            }
        }
        catch (err) {
            async function chargeError() {
                setCharge(false);
                setError({ status: true, message: "Ooops! Un error al subir la imagen. Intente de nuevo :(" });
                await setTimeout(() => {
                    setError({ status: false, message: "" });
                }, 4000);
            }
            chargeError();
            valueImage.current.value = "";

        }

    };

    useEffect(() => {
        if (window.localStorage.getItem("name")) {
            window.location.href = "/rooms";
        }
    }, []);

    return (
        <AnimatePresence>
            <motion.div className="home-container"  initial={{ x: "-100%" }} animate={{ x: 0, transition: { duration: 0.7 } }} exit={{ x: "-100%" }}>
                <div className="presentation">
                    <motion.h2 initial={{ x: "-100%", rotateY: 98 }} animate={{ x: 0, rotateY: 0, scale: 1, transition: { duration: 0.9 } }}>WELCOME</motion.h2>
                    <motion.h1 initial={{ rotateY: 98, visibility: "hidden" }} animate={{ rotateY: 0, visibility: "visible", scale: 1, transition: { duration: 1, delay: 0.1 } }}>ROOMCHAT</motion.h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="logo item">
                        <img src="./img/logo.svg" alt=""></img>
                        <h3>LOGIN</h3>
                    </div>
                    <label htmlFor="" className="item">Nombre de usuario</label>
                    <input type="text" id="username" className="item" onChange={(e) => setValue(e.target.value)} />
                    <label htmlFor="photo" className="item">+</label>
                    <input type="file" id="photo" className="item" ref={valueImage} onChange={uploadImage}></input>
                    <p className="item">Agregar una imagen</p>
                    <button type="submit" className="item"><FontAwesomeIcon icon={faArrowRight} /></button>
                </form>
                <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#424141" fillOpacity="1" d="M0,64L80,32L160,192L240,64L320,224L400,32L480,0L560,160L640,128L720,32L800,128L880,64L960,320L1040,128L1120,96L1200,64L1280,64L1360,32L1440,128L1440,320L1360,320L1280,320L1200,320L1120,320L1040,320L960,320L880,320L800,320L720,320L640,320L560,320L480,320L400,320L320,320L240,320L160,320L80,320L0,320Z"></path>
                </svg>
                <motion.div className="circle" initial={{ x: 0, y: 0 }} animate={{ x: "-400%", y: "-500%", transition: { duration: 25, repeat: Infinity, repeatType: "loop", repeatDelay: 5 } }}></motion.div>
                <AnimatePresence>
                    {
                        charge && <UploadImage />
                    }
                </AnimatePresence>
                <AnimatePresence>
                    {
                        error.status && <Errors error={error.message} />
                    }
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    )
}

export default Index

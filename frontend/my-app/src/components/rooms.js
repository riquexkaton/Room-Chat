import "../styles/rooms.css";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSignOutAlt, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { AnimatePresence, motion } from "framer-motion";
import useChange from "../hooks/useChange";
import axios from "axios";
import Errors from "./errors";
import UploadImage from "./uploadImage";
import socket from "../socket";
import sustituteImg from "../user-img.svg";

const Rooms = () => {

    const [value, setValue] = useChange("");
    const [description, setDescription] = useChange("");
    const [newImg, setNewImg] = useState("");
    const [rooms, setRooms] = useState([]);
    const [viewForm, setViewForm] = useState(false);
    const valueImage = useRef(null);
    const [charge, setCharge] = useState(false);
    const [error, setError] = useState({
        status: false,
        message: ""
    });
    const [time, setTime] = useState("");
    const watchForm = () => {
        setViewForm(true);
    }
    const closeForm = () => {
        setViewForm(false);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userName = window.localStorage.getItem("name");
        const idUser = window.localStorage.getItem("id");
        const imgUser = window.localStorage.getItem("img");
        if (value === "") {
            setError({ status: true, message: "El nombre de la sala esta vacio, por favor, ingrese un nombre a su sala" });
            await setTimeout(() => {
                setError({ status: false, message: "" });
            }, 4000)
        }
        else {
            socket.emit("new-room", {
                idUser: idUser,
                roomName: value,
                imgRoom: newImg,
                imgUser: imgUser,
                createdBy: userName,
                description: description
            });
            setViewForm(false);
            setDescription("");
            document.body.scrollTo(0, 0);
        }
    };

    useEffect(() => {
        socket.on("new-room", res => {
            setRooms([res, ...rooms]);
        });
        socket.on("charge-rooms", res => {
            setRooms([...res]);
        });
        socket.on("logout", res => {
            setRooms([...res]);

        });
        return () => socket.off();
    }, [rooms]);


    useEffect(() => {
        const updateTime = () => {
            const newTime = new Date();
            if (newTime.getHours() >= 12) {
                setTime(`${newTime.getHours()}:${newTime.getMinutes()}PM`);
            }
            else if (newTime.getHours() >= 0 && newTime.getHours() < 12) {
                setTime(`${newTime.getHours()}:${newTime.getMinutes()}AM`);
            }
        };

        let newInterval = setInterval(updateTime, 1000);

        return () => {
            clearInterval(newInterval);
        }

    }, [time]);

    const roomEnter = (id) => {
        window.location.href = `/chat/${id}`;
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
                console.log(res.data.url);
                setNewImg(res.data.url);
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

    const logout = () => {
        const id = window.localStorage.getItem("id");
        socket.emit("logout", id);
        window.localStorage.removeItem("name");
        window.localStorage.removeItem("img");
        window.localStorage.removeItem("id");
        window.location.href = "/";
    };

    const listRooms = rooms.map((item, index) => {
        return (
            <div className="room" key={item.id_room}>
                <img src={item.roomImg ? item.roomImg : "./img/img-group.svg"} alt=""></img>
                <h2>{item.roomName}</h2>
                <div className="room-info">
                    <button className="go-room" onClick={() => roomEnter(item.id_room)}><FontAwesomeIcon icon={faAngleRight} /></button>
                    <h3>{item.roomName}</h3>
                    <p>
                        {item.description}
                    </p>
                </div>
            </div>
        )
    });

    return (
        <AnimatePresence>
            <motion.div className="room-container" initial={{ x: -500 }} animate={{ x: 0, transition:{duration:1.2} }} exit={{ x: -500 }}>
                <div className="create-group" onClick={watchForm}>
                    +
                    <p>Crear nuevo grupo</p>
                </div>
                <AnimatePresence>
                    {viewForm &&
                        <motion.div className="create-group-screen" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="nameroom">Nombre de sala</label>
                                <input type="text" id="nameroom" onChange={(e) => setValue(e.target.value)}></input>
                                <label htmlFor="photo-room">+</label>
                                <input type="file" id="photo-room" onChange={uploadImage} ref={valueImage}></input>
                                <textarea placeholder="Agregue una descripcion" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                <button type="submit">CREAR</button>
                            </form>
                            <button className="close-form" onClick={closeForm}><FontAwesomeIcon icon={faTimes} /></button>
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
                    }
                </AnimatePresence>
                <header>
                    <div className="profile">
                        <div className="imgbx-profile">
                            <img src={window.localStorage.getItem("img") ? window.localStorage.getItem("img") :
                                sustituteImg} alt=""></img>
                            <button className="logout" onClick={logout}><FontAwesomeIcon icon={faSignOutAlt} /></button>
                        </div>
                        <motion.div className="time" initial={{x:"100%",visibility:"hidden"}} animate={{x:0,visibility:"visible", transition:{delay:1.6, duration:0.8}}} exit={{x:"100%",visibility:"hidden"}}>
                            {time}
                        </motion.div>
                    </div>
                    <motion.h2 initial={{ rotateY: 98, visibility: "hidden" }} animate={{ rotateY: 0, visibility: "visible", scale: 1, transition: { duration: 1, delay: 0.1 } }}>
                        {window.localStorage.getItem("name")}<span></span>
                    </motion.h2>
                </header>
                <div className="chats-rooms">
                    {listRooms}
                </div>
            </motion.div>
        </AnimatePresence>

    )
}

export default Rooms

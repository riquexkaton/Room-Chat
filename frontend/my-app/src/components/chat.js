import { useState, useEffect } from 'react'
import socket from "../socket";
import "../styles/chat.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faCommentAlt, faChevronLeft, faGrin } from '@fortawesome/free-solid-svg-icons'
import useChange from "../hooks/useChange";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import sustituteImg from "../user-img.svg";
import Picker from "emoji-picker-react";

const Chat = () => {

    const [messages, setMessages] = useState([]);
    const [viewEmojis, setViewEmojis] = useState(false);
    const [value, setValue] = useChange("");
    const [imgRoom, setImgRoom] = useState("");
    const [roomName, setRoomName] = useState("");
    const { id } = useParams();

    useEffect(() => {
        socket.on("message", msg => {
            setMessages([...messages, msg]);
            const scrollMessages = document.querySelector(".chat-messages");
            scrollMessages.scrollTo(0, scrollMessages.scrollHeight);
        });
        socket.on("charge-messages", msg => {
            setMessages([...msg]);
        });
        return () => socket.off();
    }, [messages]);

    useEffect(() => {
        socket.emit("join-room", id);
        socket.on("join-room", info => {
            setImgRoom(info.roomImg);
            setRoomName(info.roomName);
        });
        return () => socket.off();
    }, [id]);

    const sendMessage = (e) => {
        e.preventDefault();
        const userName = window.localStorage.getItem("name");
        const idUser = window.localStorage.getItem("id");
        const imgUser = window.localStorage.getItem("img");
        if (value !== "") {
            socket.emit("message", {
                id_room: id,
                userName: userName,
                imgUser: imgUser,
                idUser: idUser,
                value: value
            });
        }
        setValue("");
    };
    const onEmojiClick = (e, emojiObject) => {
        setValue(value + emojiObject.emoji);
    }
    const exitRoom = () => {
        window.location.href = "/rooms";
    };

    const listMessages = messages.map((item, index) => {
        const idUser = window.localStorage.getItem("id");
        return idUser === item.idUser ?
            <motion.li className="message emit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={index}>
                <img src={item.imgUser ? item.imgUser : sustituteImg} alt="" />
                <div className="message-info">
                    <b>{item.userName}</b>
                    <p>{item.value}</p>
                </div>
            </motion.li>
            :
            <motion.li className="message listened" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={index}>
                <div className="message-info">
                    <b>{item.userName}</b>
                    <p>{item.value}</p>
                </div>
                <img src={item.imgUser ? item.imgUser : sustituteImg} alt="" />
            </motion.li>

    });
    return (
        <AnimatePresence>
            {
                        <motion.div className="chat-container" initial={{y:"-100%"}} animate={{y:0, transition:{duration:1.2}}} exit={{y:"-100%"}}>
                        <header>
                            <button className="back-room" onClick={exitRoom}><FontAwesomeIcon icon={faChevronLeft} /></button>
                            <div className="imgbx">
                                <img src={imgRoom ? imgRoom : "/img/img-group.svg"} alt=""></img>
                            </div>
                            <h2>{roomName}<FontAwesomeIcon icon={faCommentAlt} style={{ fontSize: "1rem", color: "var(--color2)" }} /></h2>
                        </header>
                        <ul className="chat-messages">
                            <AnimatePresence>
                                {
                                    listMessages
                                }
                            </AnimatePresence>
                        </ul>
                        <form onSubmit={sendMessage}>
                            <input type="text" value={value} placeholder="Type something" onChange={(e) => setValue(e.target.value)} />
                            <div className="emoji-button" onClick={() => setViewEmojis(!viewEmojis)}>
                                <FontAwesomeIcon icon={faGrin} />
                            </div>
                            <button type="submit"><FontAwesomeIcon icon={faPaperPlane} /></button>
                        </form>
                        {
                            viewEmojis && (
                                <div className="emojis" >
                                    <Picker onEmojiClick={onEmojiClick} pickerStyle={{ width: "100%", boxShadow: "none" }} />
                                </div>
                            )
                        }
                    </motion.div>
            }
        </AnimatePresence>
    )
}

export default Chat

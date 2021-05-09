import React from 'react'
import {motion} from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'

const Errors = (props) => {
    return (
        <motion.div layout className="error" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.6 } }} exit={{ opacity: 0 }}>
            <motion.div layout className="message-error" >
                <FontAwesomeIcon icon={faExclamation} style={{ fontSize: "2rem", color:"var(--color5)" }} />
                <p>{props.error}</p>
            </motion.div>
        </motion.div>
    )
}

export default Errors

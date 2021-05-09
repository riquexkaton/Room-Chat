import React from 'react'
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhotoVideo } from '@fortawesome/free-solid-svg-icons'

const UploadImage = () => {
    return (
        <motion.div layout className="charge" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.6 } }} exit={{ opacity: 0 }}>
            <motion.div layout className="message-charge" >
                <FontAwesomeIcon icon={faPhotoVideo} style={{ fontSize: "2rem", color:"var(--color2)" }} />
                <p>Tu imagen se esta subiendo...</p>
            </motion.div>
        </motion.div>
    )
}

export default UploadImage


import { useEffect, useState } from "react"
import CircularProgress from '@mui/material/CircularProgress';

import ErrorIcon from '@mui/icons-material/Error';
import { Box } from "@mui/system";
const ImageLoader = ({ src, width = "100%", height = "100%", className }) => {

    const [state, setState] = useState('loading');

    useEffect(() => {
        if (!src) {
            setState('error'); return;
        }
        fetch(src).then(({ ok }) => {
            if (ok) { setState('ready'); }
            else {
                setState('error')
            }
        }).catch((e) => {
            console.error(e);
            setState('error')
        })

    }, [src])

    const boxStyle = { width, height, border: 2, borderRadius: "8px", textAlign: "center", display: 'flex' }

    const LoadingImage = () => {
        return <Box className={className} style={boxStyle}><CircularProgress /></Box>
    }

    const ReadyImage = () => {
        return <img className={className} style={boxStyle} src={src} />
    }
    const ErrorImage = () => {
        return <Box className={className} sx={boxStyle}><ErrorIcon sx={{ display: "block", margin: "auto" }} /></Box>
    }

    const renderImage = (state) => {
        
        switch (state) {

            case 'ready': return <ReadyImage />
            case 'error': return <ErrorImage />;
        }

        return <LoadingImage />;


    }


    return <>{renderImage(state)}</>


}

export default ImageLoader
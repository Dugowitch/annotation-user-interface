// components
import { Dialog as BaseDialog } from "@reach/dialog"

// style
import styled from "styled-components";
import "@reach/dialog/styles.css"


const StyledDialog = styled(BaseDialog)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
`

export default StyledDialog

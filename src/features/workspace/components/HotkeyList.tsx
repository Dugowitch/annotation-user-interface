import { FC } from "react"
import NamedContainer from "../../../components/NamedContainer"
import Layer from "../../../types/Layer"
import styled from "styled-components"


interface HotkeyListProps extends Layer {
    closeCallback: () => void,
}

const ListItem = styled.p`
    & > span {
        display: inline-block;
        font-family: monospace;
        min-width: 22ch;
        margin-right: 8px;
        margin-bottom: 16px;
    }
`

const HotkeyList: FC<HotkeyListProps> = ({$layer, closeCallback}) => {
    return (
        <NamedContainer style={{width: "clamp(400px, 800px, 40%)", margin: "64px auto"}} name={"Nastavení"} $layer={$layer} closeCallback={closeCallback}>
            <div style={{padding: "16px"}}>
                <ListItem><span>Ctrl+z</span>krok zpět</ListItem>
                <ListItem><span>Ctrl+y</span>krok napřed</ListItem>
                <ListItem><span>Ctrl+Shift+z</span>krok napřed</ListItem>
                <ListItem><span>mezerník</span>spustit/zastavit přehrávání</ListItem>
                <ListItem><span>šipka doprava</span>skok napřed</ListItem>
                <ListItem><span>šipka doleva</span>skok spátky</ListItem>
                <ListItem><span>Shift+šipka doprava</span>skok na nejbližší budoucí začátek segmentu</ListItem>
                <ListItem><span>Shift+šipka doleva</span>skok na nejbližší minulý začátek segmentu</ListItem>
                <ListItem><span>Ctrl+s</span>uložit</ListItem>
            </div>
        </NamedContainer>
    )
}

export default HotkeyList

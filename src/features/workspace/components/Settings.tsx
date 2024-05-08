import { FC } from "react"

// components
import NamedContainer from "../../../components/NamedContainer"
import IntegerInput from "../../../components/IntegerInput"

// style
import styled from "styled-components"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { useSelector } from "react-redux"
import { selectSkipLength, setSkipLength } from "../../player/redux/playbackSlice"

// types
import Layer from "../../../types/Layer"


interface SettingsProps extends Layer {
    closeCallback: () => void,
}

const SettingsLayout = styled.div<Layer>`
    padding: 8px;

    & > span {
        margin-right: 4px;
    }
`

const Settings: FC<SettingsProps> = ({$layer, closeCallback}) => {
    const dispatch = useAppDispatch()
    const skipLength = useSelector(selectSkipLength)

    return (
        <NamedContainer style={{width: "clamp(400px, 800px, 40%)", margin: "64px auto"}} name={"Nastavení"} $layer={$layer} closeCallback={closeCallback}>
            <SettingsLayout $layer={$layer}>
                <span>Délka skoku:</span>
                <IntegerInput
                    value={skipLength}
                    $width={"6ch"}
                    updateGlobalValue={(x) => dispatch(setSkipLength(x))}
                    $layer={$layer+1}
                    min={1}
                    max={600}
                />
                s
            </SettingsLayout>
        </NamedContainer>
    )
}

export default Settings

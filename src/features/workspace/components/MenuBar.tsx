import { FC, useState } from "react"

// components
import { Menu, MenuItem } from "@reach/menu-button"
import { MenuPopover } from "../../../components/MenuPopover"
import { MenuButton } from "../../../components/MenuButton"
import { MenuItems } from "../../../components/MenuItems"
import Button from "../../../components/Button"
import Dialog from "../../../components/Dialog"
import Settings from "./Settings"

// style
import styled from "styled-components"

// redux
import { useSelector } from "react-redux"
import { save, selectTitle } from "../redux/workspaceSlice"
import { useAppDispatch } from "../../../redux/hooks"
import { historyRedo, historyUndo } from "../redux/workspaceSlice"

// types
import Layer from "../../../types/Layer"


const MenuBarContainer = styled.nav<Layer>`
    display: grid;
    grid-template-areas:
        "logo title"
        "logo menuItems";
    grid-template-columns: auto 1fr;
    gap: 0 16px;
    background: ${({theme, $layer}) => theme.layers[$layer].background};

    img {
        grid-area: logo;
        height: 48px;
        margin: auto 0;
    }

    h1 {
        font-size: ${({theme}) => theme.text_s};
        font-weight: normal;
        margin-left: 8px;
    }

    button {
        font-weight: normal;
        font-size: 1rem;
        text-transform: none;
    }
`

const MenuItemsContainer = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;

    & [data-reach-menu-popover] {
        z-index: 999;
    }
`

const MenuBar : FC<React.HTMLAttributes<HTMLDivElement> & Layer> = ({$layer, ...props}) => {
    const title = useSelector(selectTitle)
    const dispatch = useAppDispatch()
    const [showSettings, setShowSettings] = useState(false)
    const [showHotkeys, setShowHotkeys] = useState(false)

    const handleNavigateToCatalogue = () => {
        const URL = "https://data.jamap.cz/cards/show-all"
        dispatch(save())
        window.location.href = URL
    }

    return (
        <MenuBarContainer $layer={$layer} {...props}>
            <img src="./assets/logo-spokendata-inverse.png" alt="SpokenData logo" />
            <h1>{title}</h1>
            <MenuItemsContainer>
                <Button $layer={$layer} onClick={handleNavigateToCatalogue}>Zpět do karty</Button>
                <Button $layer={$layer} onClick={() => dispatch(save())}>Uložit</Button>
                <Menu>
                    <MenuButton $layer={$layer}>Úpravy</MenuButton>
                    <MenuPopover $layer={$layer+1}>
                        <MenuItems $layer={$layer+1}>
                            <MenuItem onSelect={() => dispatch(historyUndo())}>Krok zpět</MenuItem> {/* Ctrl+Z */}
                            <MenuItem onSelect={() => dispatch(historyRedo())}>Krok napřed</MenuItem> {/* Ctrl+Shift+Z, Ctrl+Y */}
                        </MenuItems>
                    </MenuPopover>
                </Menu>
                <Button $layer={$layer} onClick={() => {setShowSettings(true)}}>Nastavení</Button>
                <Dialog isOpen={showSettings} onDismiss={() => setShowSettings(false)}>
                    <Settings $layer={$layer} closeCallback={() => setShowSettings(false)} />
                </Dialog>
                <Menu>
                    <MenuButton $layer={$layer}>Nápověda</MenuButton>
                    <MenuPopover $layer={$layer+1}>
                        <MenuItems $layer={$layer+1}>
                            <MenuItem onSelect={() => {/*TODO*/}}>Klávesové zkratky</MenuItem>
                            <MenuItem onSelect={() => {/*TODO*/}}>Videomanuál</MenuItem>
                        </MenuItems>
                    </MenuPopover>
                </Menu>
            </MenuItemsContainer>
        </MenuBarContainer>
    );
}

export default MenuBar;

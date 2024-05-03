import { MenuPopover as BaseMenuPopover } from "@reach/menu-button";

import styled, { css } from "styled-components";

import Layer from "../types/Layer";


export const MenuPopover = styled(BaseMenuPopover)<Layer>` ${({theme, $layer}) => css`
    background-color: ${theme.layers[$layer].background};
    border-radius: 4px;
    border: 1px solid ${theme.layers[$layer].active};
    box-shadow: 0 0 4px 0 ${theme.gray100};
    
    [data-reach-menu-items]:not(:last-of-type) {
        border-bottom: 1px solid ${theme.layers[$layer].active};
    }
`}`

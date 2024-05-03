import { MenuItems as BaseMenuItems } from "@reach/menu-button";

import { clickableBaseStyles } from "../style/clickableBaseStyles";
import styled, { css } from "styled-components";

import Layer from "../types/Layer";


export const MenuItems = styled(BaseMenuItems)<Layer>` ${({theme, $layer}) => css`
    background-color: transparent;
    border: none;
    padding: 4px;
    
    [data-reach-menu-item] {
        ${clickableBaseStyles}
        
        background-color: ${theme.layers[$layer].background};
        color: ${theme.textSecondary};
        padding: 4px 8px;
        font-size: 1rem;
        display: flex;
        align-items: center;
        
        &[data-selected] {
            background-color: ${theme.layers[$layer].active};
            color: ${theme.textPrimary};
        }
    }
`}`

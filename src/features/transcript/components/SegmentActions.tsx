import { FC } from "react";

// components
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { MenuButton } from "../../../components/MenuButton";
import { MenuPopover } from "../../../components/MenuPopover";
import { MenuItems } from "../../../components/MenuItems";
import { Menu, MenuItem } from "@reach/menu-button";

// types
import type Layer from "../../../types/Layer";


interface SegmentActionsProps extends Layer, React.HTMLAttributes<HTMLDivElement> {
    deleteHandler: () => void, 
    mergeHandler: () => void 
}

const SegmentActions: FC<SegmentActionsProps> = ({$layer, deleteHandler, mergeHandler, ...props}) => {
    return (
        <Menu>
            <MenuButton $layer={$layer} {...props}><MoreHorizIcon /></MenuButton>
            <MenuPopover $layer={$layer+1}>
                <MenuItems $layer={$layer+1}>
                    <MenuItem onSelect={mergeHandler}>Sloučit dolů</MenuItem>
                    <MenuItem onSelect={deleteHandler}>Smazat</MenuItem>
                </MenuItems>
            </MenuPopover>
        </Menu>
    )
}

export default SegmentActions
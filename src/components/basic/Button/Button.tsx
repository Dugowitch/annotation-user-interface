import { FC } from "react"
import { IconButton } from "./style/IconButton";
import { TextButton } from "./style/TextButton";

import Layer from "../../../style/Layer";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: string
}

const Button: FC<ButtonProps & Layer> = ({variant, ...props}) => {
    switch(variant) {
        case "icon":
            return <IconButton {...props}></IconButton>
        case "text":
            return <TextButton {...props}></TextButton>
        default:
            return <TextButton {...props}></TextButton>
    }
}

export default Button

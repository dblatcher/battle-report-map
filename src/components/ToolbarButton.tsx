import { IconButton } from "@mui/material"
import { ReactNode } from "react"

interface Props {
    children: ReactNode
    label: string
    onClick: { (): void }
}

export const ToolbarButton = ({ children, label, onClick }: Props) => (
    <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label={label}
        sx={{ mr: 2 }}
        onClick={onClick}
    >
        {children}
    </IconButton>
)
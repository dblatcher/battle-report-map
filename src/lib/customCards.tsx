import { CardProps, Card } from "@mui/material"
import { ReactNode } from "react"

export const hlMyCard = (cardProps: CardProps) => {
    const MyCard = (props: { children: ReactNode }) => (<Card {...cardProps}>{props.children}</Card>)
    return MyCard
}

export const HighPaddedCard = hlMyCard({ elevation: 4, sx: { padding: 0 } })
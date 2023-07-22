import { TerrainPiece } from "@/types"
import { SvgFrame } from "./SvgFrame"
import { BoxProps } from "@mui/material"
import { TerrainFigure } from "./TerrainFigure"

interface Props {
    terrainPiece: TerrainPiece
    boxProps?: BoxProps
    allowRotate?: boolean
}

export const TerrainPieceInFrame = ({ terrainPiece, allowRotate, boxProps = { sx: { width: '60px' } } }: Props) => {
    const { width, height } = terrainPiece
    const biggest = Math.max(width, height)

    const viewBox = allowRotate ? {
        width: biggest,
        height: biggest,
        minX: -biggest / 2,
        minY: -biggest / 2
    } : {
        width: width,
        height: height,
        minX: -width / 2,
        minY: -height / 2
    }

    return (
        <SvgFrame boxProps={boxProps} viewBox={viewBox}>
            <TerrainFigure terrainPiece={{
                ...terrainPiece,
                heading: allowRotate ? terrainPiece.heading : 0,
                x: 0,
                y: 0,
            }} />
        </SvgFrame>
    )
}
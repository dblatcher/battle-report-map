import { TerrainPiece } from "@/types"
import { SvgFrame } from "./SvgFrame"
import { BoxProps } from "@mui/material"
import { TerrainFigure } from "./TerrainFigure"

interface Props {
    terrainPiece: TerrainPiece
    boxProps?: BoxProps
}

export const TerrainPieceInFrame = ({ terrainPiece, boxProps = { sx: { width: '60px' } } }: Props) => {
    const { width, height } = terrainPiece
    return (
        <SvgFrame boxProps={boxProps} viewBox={{
            width: width,
            height: height,
            minX: -width / 2,
            minY: -height / 2
        }}>
            <TerrainFigure terrainPiece={{
                ...terrainPiece,
                heading: 0,
                x: 0,
                y: 0,
            }} />
        </SvgFrame>
    )
}
import { TerrainPiece } from "@/types";
import { PlacedImage } from "./PlacedImage";


type Props = { terrainPiece: TerrainPiece, isActive?: boolean }


export const TerrainFigure = ({ terrainPiece, isActive }: Props) => {
    const { x, y, heading, href, width, height } = terrainPiece

    return (
        <g style={isActive ? { filter: 'drop-shadow(0px 0px 9px white' } : {}}>
            <PlacedImage
                asset={{ href, width, height, description: '' }}
                {...{ x, y, heading }}
            />
        </g >
    )
}
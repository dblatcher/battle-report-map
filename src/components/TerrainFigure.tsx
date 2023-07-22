import { inDegrees } from "@/lib/uitl";
import { TerrainPiece } from "@/types";


type Props = { terrainPiece: TerrainPiece, isActive?: boolean }


export const TerrainFigure = ({ terrainPiece, isActive }: Props) => {
    const { x, y, heading, href, width, height } = terrainPiece

    return (
        <g style={isActive ? { filter: 'drop-shadow(0px 0px 9px white' } : {}}>
            <image href={href} width={width} height={height} transform={`
                translate(${x} ${y})
                rotate (${inDegrees(-heading)})
                translate(${-width / 2} ${-height / 2})
                `}
                preserveAspectRatio="none"
            />
        </g >
    )
}
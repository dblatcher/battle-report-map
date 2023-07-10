import { inDegrees } from "@/lib/uitl";
import { TerrainPiece } from "@/types";


type Props = { terrainPiece: TerrainPiece, }


export const TerrainFigure = ({ terrainPiece }: Props) => {
    const { x, y, heading, href, width, height } = terrainPiece

    return (
        <g >
            <image href={href} width={width} height={height} transform={`
                translate(${x} ${y})
                rotate (${inDegrees(-heading)})
                translate(${-width / 2} ${-height / 2})
                `}
                preserveAspectRatio="none"
            />
        </g>
    )
}
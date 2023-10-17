import { rotate, translate } from "@/lib/geometry";
import { getCirclePaths, getPoints, getWingPath, pointToString } from "@/lib/shapes";
import { Unit } from "@/types";
import { MarkersOnUnit } from "./Markers";
import { PlacedImage } from "./PlacedImage";


type Props = {
    unit: Unit,
    isActive?: boolean,
    showMarkers?: boolean,
    onContextMenu?: { (): void },
}


const PolygonDesign = ({ unit }: { unit: Unit }) => {

    const { x, y, heading, col1, col2 } = unit
    const { outlinePoints, patternPoints } = getPoints(unit)

    const outline = outlinePoints.map(rotate(heading))
        .map(translate(x, y))
        .map(pointToString)
        .join(" ")

    const pattern = patternPoints?.map(rotate(heading))
        .map(translate(x, y))
        .map(pointToString)
        .join(" ")

    return (<>
        <polygon points={outline} fill={col1} stroke="none" />
        {pattern && <polygon points={pattern} fill={col2} stroke="none" />}
        <polygon points={outline} fill="none" stroke="black" />
    </>
    )
}

const CircleDesign = ({ unit }: { unit: Unit }) => {
    const { col1, col2, wings } = unit
    const { outlinePath, patternPath } = getCirclePaths(unit)
    const wingPath = wings ? getWingPath(unit) : undefined;

    return (<>
        {wingPath && <>
            <path d={wingPath} fill="white" />
            <path d={wingPath} stroke={'black'} fill="none" strokeWidth={.375} />
        </>}
        <path d={outlinePath} fill={col1} />
        {patternPath && <path d={patternPath} fill={col2} />}
        <path d={outlinePath} stroke={'black'} fill="none" />
    </>)
}

export const UnitFigure = ({ unit, isActive, showMarkers, onContextMenu }: Props) => {
    const { x, y, heading, badge, shape } = unit

    return (
        <g style={isActive ? { filter: 'drop-shadow(0px 0px 9px white' } : {}}
            onContextMenu={(event) => {
                if (onContextMenu) {
                    event.preventDefault()
                    onContextMenu()
                }
            }}
        >
            {shape === 'circle' ? <CircleDesign unit={unit} /> : <PolygonDesign unit={unit} />}
            {badge && (
                <PlacedImage asset={badge}
                    {...{ x, y, heading }}
                />
            )}
            {showMarkers && <MarkersOnUnit unit={unit} />}
        </g>
    )
}
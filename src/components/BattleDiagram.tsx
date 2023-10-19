import { HighPaddedCard } from "@/lib/customCards"
import { Cartesian } from "@/lib/geometry"
import { BattleField, TerrainPiece, Unit } from "@/types"
import { DownloadableSvgFrame } from "./DownloadableSvgFrame"
import { FloodRect } from "./FloodRect"
import { TerrainFigure } from "./TerrainFigure"
import { UnitFigure } from "./UnitFigure"
import { ImageDefsAndProvider } from "@/context/ImageDefProvider"

interface Props {
    battleField: BattleField
    terrainPieces: TerrainPiece[]
    units: Unit[]
    handleFrameClick: { (coordinate: Cartesian): void }
    setActiveUnitIndex: { (index: number): void }
    activeTerrainPieceIndex?: number
    activeUnitIndex?: number
}


export const BattleDiagram = ({
    battleField,
    terrainPieces, units,
    handleFrameClick, setActiveUnitIndex,
    activeTerrainPieceIndex, activeUnitIndex
}: Props) => {


    const badegHrefs = units.map(unit => unit.badge?.href).filter(href => typeof href === 'string') as string[]
    const terrainPieceHref = terrainPieces.map(piece => piece.href)

    return (
        <DownloadableSvgFrame
            reportClick={handleFrameClick}
            fileName="map"
            boxProps={{ component: HighPaddedCard }}
            viewBox={battleField.viewBox}>

            <ImageDefsAndProvider hrefs={[...badegHrefs, ...terrainPieceHref]} idPrefix="battle-map-" >
                <FloodRect fill={battleField.backgroundColor} viewBox={battleField.viewBox} />

                {terrainPieces.filter(piece => !piece.aboveUnits).map((piece, index) => (
                    <TerrainFigure
                        isActive={activeTerrainPieceIndex === index}
                        terrainPiece={piece}
                        key={index} />
                ))}

                {units.map((unit, index) => (
                    <UnitFigure key={index}
                        isActive={activeUnitIndex === index}
                        showMarkers
                        unit={unit}
                        onContextMenu={() => { setActiveUnitIndex(index) }}
                    />
                ))}

                {terrainPieces.filter(piece => piece.aboveUnits).map((piece, index) => (
                    <TerrainFigure
                        isActive={activeTerrainPieceIndex === index}
                        terrainPiece={piece}
                        key={index} />
                ))}
            </ImageDefsAndProvider>
        </DownloadableSvgFrame>
    )
}
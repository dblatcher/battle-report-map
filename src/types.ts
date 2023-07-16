export type ViewBox = {
    minX?: number
    minY?: number
    width?: number
    height?: number
}

export type BattleField = {
    viewBox: ViewBox;
    backgroundColor: string;
}

export type TerrainPiece = Position & {
    href: string;
    width: number
    height: number
    aboveUnits?: boolean
}

export type Position = {
    x: number;
    y: number;
    heading: number;
}

export type ImageAsset = {
    href: string;
    description: string;
    height: number;
    width: number;
}
export type Badge = ImageAsset
export type TerrainImage = ImageAsset

export type UnitDesign = {
    width: number;
    height: number;
    arrowSize?: number;
    col1: string;
    col2: string;
    patternShape?: PatternShape;
    shape: 'rectangle' | 'triangle' |'circle';
    badge?: Badge;
    wings?: boolean;
}

export type Markers = {
    hits?: number;
}

export type PatternShape = 'left-diagonal' | 'right-diagonal' | 'vertical'

export type Unit = Position & UnitDesign & Markers

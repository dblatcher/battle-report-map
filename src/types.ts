export type ViewBox = {
    minX?: number
    minY?: number
    width?: number
    height?: number
}

export type Position = {
    x: number;
    y: number;
    heading: number;
}

export type Badge = {
    href: string;
    description: string;
    height: number;
    width: number;
}

export type UnitDesign = {
    width: number;
    height: number;
    arrowSize?: number;
    col1: string;
    col2: string;
    patternShape?: PatternShape;
    shape: 'rectangle' | 'triangle';
    badge?: Badge
}

export type Markers = {
    hits?: number;
}

export type PatternShape = 'left-diagonal' | 'right-diagonal' | 'vertical'

export type Unit = Position & UnitDesign & Markers

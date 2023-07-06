import { ViewBox } from "@/types"


interface Props {
    fill: string
    viewBox?: ViewBox
}

export const FloodRect = ({ viewBox = {}, fill }: Props) => {
    const { minX = 0, minY = 0, width = 100, height = 100 } = viewBox
    return <rect x1={minX} x2={minY} width={width} height={height} fill={fill} />

}
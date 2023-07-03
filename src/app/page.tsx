import { SvgFrame } from "@/components/SvgFrame";
import { RectangularUnit } from "@/components/RectangularUnit"

export default function Home() {
  return (
    <main >
      <h1>Battle map test page</h1>
      <SvgFrame viewBox={{ width: 400, height:200 }} style={{ border: '1px solid black' }}>
        <RectangularUnit x={45} y={40} width={20} height={20} heading={1}  col1="green" col2="white" patternShape="right-diagonal"/>
        <RectangularUnit x={25} y={30} width={20} height={10} heading={.4}  patternShape="vertical"/>
        <RectangularUnit x={20} y={60} width={30} height={10} heading={0}  patternShape="vertical" col2="antiquewhite"/>
        <RectangularUnit x={120} y={65} width={30} height={10} heading={0}  patternShape="vertical" col2="antiquewhite"/>
      </SvgFrame>
    </main>
  )
}

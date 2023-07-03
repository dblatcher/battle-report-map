import { SvgFrame } from "@/components/SvgFrame";
import { RectangularUnit } from "@/components/RectangularUnit"

export default function Home() {
  return (
    <main >
      <h1>Battle map test page</h1>
      <SvgFrame viewBox={{ width: 200 }} style={{ border: '1px solid black' }}>
        <RectangularUnit x={45} y={30} width={20} height={10} heading={1} />
        <RectangularUnit x={25} y={30} width={20} height={10} heading={.4} />
      </SvgFrame>
    </main>
  )
}

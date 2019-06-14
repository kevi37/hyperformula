import {HandsOnEngine} from "../src";
import {simpleCellAddress} from "../src/Cell";

describe('CRUDS', () => {
  it('update formula vertex', () => {
    const sheet = [
        ['1', '2', '=A1']
    ]
    const engine = HandsOnEngine.buildFromArray(sheet)
    const a1 = engine.addressMapping!.getCell(simpleCellAddress(0, 0, 0))
    const b1 = engine.addressMapping!.getCell(simpleCellAddress(0, 1, 0))
    const c1 = engine.addressMapping!.getCell(simpleCellAddress(0, 2, 0))

    expect(engine.graph.existsEdge(a1, c1)).toBe(true)
    expect(engine.getCellValue("C1")).toBe(1)

    engine.setCellContent(simpleCellAddress(0, 2, 0), "=B1")

    expect(engine.graph.existsEdge(a1, c1)).toBe(false)
    expect(engine.graph.existsEdge(b1, c1)).toBe(true)

    expect(engine.getCellValue("C1")).toBe(2)
  })
})
import {Config, HandsOnEngine} from "../src";
import {simpleCellAddress} from "../src/Cell";
import {EmptyCellVertex, MatrixVertex, RangeVertex, ValueCellVertex} from "../src/Vertex";
import './testConfig.ts'

describe("Disable matrix optimizatoins", () => {
  it("should split matrix into value cell vertices", () => {
    const config = new Config({matrixDetection: true, matrixDetectionThreshold: 1})
    const sheet = [
      ['1', '2'],
      ['3', '4'],
    ]

    const engine = HandsOnEngine.buildFromArray(sheet, config)

    expect(engine.addressMapping!.fetchCell(simpleCellAddress(0, 0, 0))).toBeInstanceOf(MatrixVertex)

    engine.disableNumericMatrices()

    expect(engine.addressMapping!.fetchCell(simpleCellAddress(0, 0, 0))).toBeInstanceOf(ValueCellVertex)
    expect(engine.addressMapping!.fetchCell(simpleCellAddress(0, 1, 0))).toBeInstanceOf(ValueCellVertex)
    expect(engine.addressMapping!.fetchCell(simpleCellAddress(0, 0, 1))).toBeInstanceOf(ValueCellVertex)
    expect(engine.addressMapping!.fetchCell(simpleCellAddress(0, 1, 1))).toBeInstanceOf(ValueCellVertex)
    expect(engine.getCellValue("A1")).toBe(1)
    expect(engine.getCellValue("B2")).toBe(4)
  })

  it("should update edges between matrix and range", () => {
    const config = new Config({matrixDetection: true, matrixDetectionThreshold: 1})
    const sheet = [
      ['1', '2'],
      ['3', '4'],
      ['=SUM(A1:B1)']
    ]

    const engine = HandsOnEngine.buildFromArray(sheet, config)
    let range = engine.rangeMapping.getRange(simpleCellAddress(0, 0, 0), simpleCellAddress(0, 1, 0)) as RangeVertex
    expect(engine.graph.getDependecies(range).length).toBe(1)
    expect(Array.from(engine.addressMapping!.numericMatrices()).length).toBe(1)

    engine.disableNumericMatrices()
    const a1 = engine.addressMapping!.fetchCell(simpleCellAddress(0, 0, 0)) as ValueCellVertex
    const b1 = engine.addressMapping!.fetchCell(simpleCellAddress(0, 1, 0)) as ValueCellVertex
    expect(a1).toBeInstanceOf(ValueCellVertex)
    expect(b1).toBeInstanceOf(ValueCellVertex)

    range = engine.rangeMapping.getRange(simpleCellAddress(0, 0, 0), simpleCellAddress(0, 1, 0)) as RangeVertex
    expect(engine.graph.getDependecies(range).length).toBe(2)
    expect(engine.graph.existsEdge(a1, range)).toBe(true)
    expect(engine.graph.existsEdge(b1, range)).toBe(true)
    expect(Array.from(engine.addressMapping!.numericMatrices()).length).toBe(0)
  })

  it("should update edges between matrix and formulas", () => {
    const config = new Config({matrixDetection: true, matrixDetectionThreshold: 1})
    const sheet = [
      ['1', '2'],
      ['3', '4'],
      ['=A1+B2'],
    ]

    const engine = HandsOnEngine.buildFromArray(sheet, config)
    const a1 = engine.addressMapping!.fetchCell(simpleCellAddress(0, 0, 0)) as MatrixVertex
    const b2 = engine.addressMapping!.fetchCell(simpleCellAddress(0, 1, 1)) as MatrixVertex
    expect(a1).toBeInstanceOf(MatrixVertex)
    expect(b2).toBeInstanceOf(MatrixVertex)
    expect(a1).toBe(b2)

    engine.disableNumericMatrices()

    const a1_after_update = engine.addressMapping!.fetchCell(simpleCellAddress(0, 0, 0)) as ValueCellVertex
    const b2_after_update = engine.addressMapping!.fetchCell(simpleCellAddress(0, 1, 1)) as ValueCellVertex
    expect(a1_after_update).toBeInstanceOf(ValueCellVertex)
    expect(b2_after_update).toBeInstanceOf(ValueCellVertex)
    expect(a1_after_update).not.toBe(b2_after_update)

    const a3 = engine.addressMapping!.fetchCell(simpleCellAddress(0, 0, 2)) as ValueCellVertex
    expect(engine.graph.existsEdge(a1_after_update, a3)).toBe(true)
    expect(engine.graph.existsEdge(b2_after_update, a3)).toBe(true)
  })

  it("should not change edges not related to matrix", () => {
    const config = new Config({matrixDetection: true, matrixDetectionThreshold: 1})
    const sheet = [
      ['1', '2'],
      ['3', '4'],
      ['=A1+C1'],
    ]

    const engine = HandsOnEngine.buildFromArray(sheet, config)

    const a3 = engine.addressMapping!.fetchCell(simpleCellAddress(0, 0, 2)) as ValueCellVertex
    const a1 = engine.addressMapping!.fetchCell(simpleCellAddress(0, 0, 0)) as ValueCellVertex
    const c1 = engine.addressMapping!.fetchCell(simpleCellAddress(0, 2, 0)) as EmptyCellVertex
    expect(a1).toBeInstanceOf(MatrixVertex)
    expect(c1).toBeInstanceOf(EmptyCellVertex)
    expect(engine.graph.existsEdge(c1, a3)).toBe(true)

    engine.disableNumericMatrices()

    let a1_after_update = engine.addressMapping!.fetchCell(simpleCellAddress(0, 0, 0)) as ValueCellVertex
    let c1_after_update = engine.addressMapping!.fetchCell(simpleCellAddress(0, 2, 0)) as EmptyCellVertex
    expect(c1).toBe(c1_after_update)

    expect(a1_after_update).toBeInstanceOf(ValueCellVertex)
    expect(c1_after_update).toBeInstanceOf(EmptyCellVertex)
    expect(engine.graph.existsEdge(a1_after_update, a3)).toBe(true)
    expect(engine.graph.existsEdge(c1_after_update, a3)).toBe(true)
  })
})
import {AddressMapping} from '../src/AddressMapping'
import {simpleCellAddress} from '../src/Cell'
import {CellAddress} from '../src/CellAddress'
import {Config} from '../src/Config'
import {Graph} from '../src/Graph'
import {GraphBuilder} from '../src/GraphBuilder'
import {buildCellRangeAst, buildProcedureAst} from '../src/parser'
import {RangeMapping} from '../src/RangeMapping'
import {SheetMapping} from '../src/SheetMapping'
import {Statistics} from '../src/statistics/Statistics'
import {EmptyCellVertex, MatrixVertex, ValueCellVertex, Vertex} from '../src/Vertex'
import './testConfig.ts'

describe('GraphBuilder', () => {
  it('build sheet with simple number cell', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')
    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config(), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [['42']]})

    const node = addressMapping.getCell(simpleCellAddress(0, 0, 0))!
    expect(node).toBeInstanceOf(ValueCellVertex)
    expect(node.getCellValue()).toBe(42)
  })

  it('build sheet with simple string cell', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')
    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config(), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [['foo']]})

    const node = addressMapping.getCell(simpleCellAddress(0, 0, 0))!
    expect(node).toBeInstanceOf(ValueCellVertex)
    expect(node.getCellValue()).toBe('foo')
  })

  it('building for cell with empty string should give empty vertex', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')
    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config(), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [['']]})

    const node = addressMapping.getCell(simpleCellAddress(0, 0, 0))!
    expect(node).toBe(EmptyCellVertex.getSingletonInstance())
  })

  it('#buildGraph', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')

    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config(), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [
      ['1', 'A5', '2'],
      ['foo', 'bar', 'A2'],
    ]})

    expect(graph.nodesCount()).toBe(
      6 + // for the cells above
      1, // for EmptyCellVertex
    )
  })

  it('#buildGraph works with ranges', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')

    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config(), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [
      ['1', '2', '0'],
      ['3', '4', '=A1:B2'],
    ]})

    expect(graph.nodesCount()).toBe(
      6 + // for cells above
      1 + // for range vertex
      1, // for EmptyCellVertex
    )
    const nodesA1 = graph.adjacentNodes(addressMapping.getCell(simpleCellAddress(0, 0, 0))!)!
    const nodesA2 = graph.adjacentNodes(addressMapping.getCell(simpleCellAddress(0, 0, 1))!)!
    const nodesB1 = graph.adjacentNodes(addressMapping.getCell(simpleCellAddress(0, 1, 0))!)!
    const nodesB2 = graph.adjacentNodes(addressMapping.getCell(simpleCellAddress(0, 1, 1))!)!
    expect(nodesA1).toEqual(nodesA2)
    expect(nodesA2).toEqual(nodesB1)
    expect(nodesB1).toEqual(nodesB2)
    expect(nodesB1.size).toEqual(1)
    const rangeVertex = Array.from(nodesB2)[0]!
    expect(graph.adjacentNodes(rangeVertex)!).toEqual(new Set([addressMapping.getCell(simpleCellAddress(0, 2, 1))!]))
  })

  it('#loadSheet - it should build graph with only one RangeVertex', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')

    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config(), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [
        ['1', '2', '0'],
        ['3', '4', '=A1:B2'],
        ['5', '6', '=A1:B2'],
    ]})

    expect(graph.nodesCount()).toBe(
      9 + // for cells above
      1 + // for both ranges (reuse same ranges)
      1, // for EmptyCellVertex
    )
  })

  it('build with range one row smaller', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')
    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config(), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [
      ['1', '0'],
      ['3', '=A1:A2'],
      ['5', '=A1:A3'],
    ]})

    expect(graph.edgesCount()).toBe(
      2 + // from cells to range(A1:A2)
      2 + // from A3 and range(A1:A2) to range(A1:A3)
      2, // from range vertexes to formulas
    )
  })

  it('#buildGraph should work even if range dependencies are empty', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')

    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config(), sheetMapping)
    graphBuilder.buildGraph({ Sheet1: [['1', '2', '=SUM(A1:B2)']]})

    expect(graph.nodesCount()).toBe(
      3 + // for cells above
      1 + // for range vertex
      1, // for EmptyCellVertex
    )
    expect(graph.edgesCount()).toBe(
      2 + // from cells to range vertex
      1 + // from EmptyCellVertex to range vertices
      1, // from range to cell with SUM
    )
  })

  it("optimization doesn't work if smaller range is after bigger", () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')
    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config(), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [
      ['1', '0'],
      ['3', '=A1:A3'],
      ['5', '=A1:A2'],
    ]})

    expect(graph.edgesCount()).toBe(
      3 + // from 3 cells to range(A1:A2)
      2 + // from 2 cells to range(A1:A2)
      2, // from range vertexes to formulas
    )
  })

  it('matrix cause next cells to be ignored', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')
    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config({ matrixDetection: true }), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [
      ['1', '2', '8'],
      ['3', '4', '9'],
      ['{=mmult(A1:B2,C1:C2)}'],
      ['{=mmult(A1:B2,C1:C2)}'],
    ]})
    expect(addressMapping.getCell(simpleCellAddress(0, 0, 2))).toBeInstanceOf(MatrixVertex)
    expect(addressMapping.getCell(simpleCellAddress(0, 0, 3))).toBeInstanceOf(MatrixVertex)
    expect(addressMapping.getCell(simpleCellAddress(0, 0, 4))).toBeInstanceOf(EmptyCellVertex)
  })

  it('matrix no overlap', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')
    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config({ matrixDetection: true }), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [
      ['1', '2'],
      ['3', '4'],
      ['5', '6'],
      ['1', '2'],
      ['3', '4'],
      ['=sumprod($A1:$B1,transpose(A$4:A$5))', '=sumprod($A1:$B1,transpose(B$4:B$5))'],
      ['=sumprod($A2:$B2,transpose(A$4:A$5))', '=sumprod($A2:$B2,transpose(B$4:B$5))'],
      ['=sumprod($A3:$B3,transpose(A$4:A$5))', '=sumprod($A3:$B3,transpose(B$4:B$5))'],
    ]})

    const vertex = addressMapping.getCell(simpleCellAddress(0, 0, 5))
    expect(vertex).toBeInstanceOf(MatrixVertex)
    expect((vertex as MatrixVertex).getFormula()).toEqual(buildProcedureAst('MMULT', [
      buildCellRangeAst(CellAddress.absolute(0, 0, 0), CellAddress.absolute(0, 1, 2)),
      buildCellRangeAst(CellAddress.absolute(0, 0, 3), CellAddress.absolute(0, 1, 4)),
    ]))
  })


  it('overlap', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')
    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config({ matrixDetection: true }), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [
      ['1', '2'],
      ['3', '4'],
      ['5', '6'],
      ['1', '2'],
      ['3', '4'],
      ['=sumprod($A4:$B4,transpose(A$4:A$5))', '=sumprod($A4:$B4,transpose(B$4:B$5))'],
      ['=sumprod($A5:$B5,transpose(A$4:A$5))', '=sumprod($A5:$B5,transpose(B$4:B$5))'],
      ['=sumprod($A6:$B6,transpose(A$4:A$5))', '=sumprod($A6:$B6,transpose(B$4:B$5))'],
    ]})

    expect(addressMapping.getCell(simpleCellAddress(0, 0, 5))).not.toBeInstanceOf(MatrixVertex)
  })

  it('matrix no overlap 2', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')
    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config({ matrixDetection: true }), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [
      ['1', '2'],
      ['3', '4'],
      ['5', '6'],
      ['1', '2'],
      ['3', '4'],
      ['=sumprod(transpose($A1:$B1),A$4:A$5)', '=sumprod(transpose($A1:$B1),B$4:B$5)'],
      ['=sumprod(transpose($A2:$B2),A$4:A$5)', '=sumprod(transpose($A2:$B2),B$4:B$5)'],
      ['=sumprod(transpose($A3:$B3),A$4:A$5)', '=sumprod(transpose($A3:$B3),B$4:B$5)'],
    ]})

    expect(addressMapping.getCell(simpleCellAddress(0, 0, 5))).toBeInstanceOf(MatrixVertex)
  })

  it('matrix with plain numbers', () => {
    const graph = new Graph<Vertex>()
    const addressMapping = new AddressMapping(0.5)
    const sheetMapping = new SheetMapping()
    sheetMapping.addSheet('Sheet1')
    const graphBuilder = new GraphBuilder(graph, addressMapping, new RangeMapping(), new Statistics(), new Config({ matrixDetection: true }), sheetMapping)

    graphBuilder.buildGraph({ Sheet1: [
          ['1', '2'],
          ['3', '4'],
    ]})

    expect(addressMapping.getCell(simpleCellAddress(0, 0, 0))).toBeInstanceOf(MatrixVertex)
    expect(addressMapping.getCellValue(simpleCellAddress(0, 0, 0))).toEqual(1)
    expect(addressMapping.getCellValue(simpleCellAddress(0, 1, 0))).toEqual(2)
    expect(addressMapping.getCellValue(simpleCellAddress(0, 0, 1))).toEqual(3)
    expect(addressMapping.getCellValue(simpleCellAddress(0, 1, 1))).toEqual(4)
  })
})

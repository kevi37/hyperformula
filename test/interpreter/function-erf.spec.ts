import {CellError, HyperFormula} from "../../src";
import {adr, expectCloseTo} from "../testUtils";
import {ErrorType} from "../../src/Cell";

describe('Function ERF', () => {
  const precision = 0.0000003

  it('should return error for wrong number of arguments', () => {
    const engine = HyperFormula.buildFromArray([
        ['=ERF()'],
        ['=ERF(1, 2, 3)'],
    ])

    expect(engine.getCellValue(adr('A1'))).toEqual(new CellError(ErrorType.NA))
    expect(engine.getCellValue(adr('A2'))).toEqual(new CellError(ErrorType.NA))
  })

  it('should return error for arguments of wrong type', () => {
    const engine = HyperFormula.buildFromArray([
      ['=ERF("foo")'],
      ['=ERF(1, "bar")'],
    ])

    expect(engine.getCellValue(adr('A1'))).toEqual(new CellError(ErrorType.VALUE))
    expect(engine.getCellValue(adr('A2'))).toEqual(new CellError(ErrorType.VALUE))
  })

  it('should work for single argument', () => {
    const engine = HyperFormula.buildFromArray([
      ['=ERF(1)'],
      ['=ERF(3.14)'],
    ])

    expectCloseTo(engine.getCellValue(adr('A1')), 0.8427007929497148, precision)
    expectCloseTo(engine.getCellValue(adr('A2')), 0.9999910304344467, precision)
  })

  it('should work with second argument', () => {
    const engine = HyperFormula.buildFromArray([
      ['=ERF(-2.3, -0.7)'],
      ['=ERF(-2.3, 2)'],
      ['=ERF(5.6, -3.1)'],
    ])

    expectCloseTo(engine.getCellValue(adr('A1')), 0.32105562956522493, precision)
    expectCloseTo(engine.getCellValue(adr('A2')), 1.9941790884215962, precision)
    expectCloseTo(engine.getCellValue(adr('A3')), -1.9999883513426304, precision)
  })
})
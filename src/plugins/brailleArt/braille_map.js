export const brailleMap = new Map([
  [JSON.stringify([[0,0], [0,0], [0,0]]), '⠀'],
  [JSON.stringify([[1,0], [0,0], [0,0]]), '⠁'],
  [JSON.stringify([[0,0], [1,0], [0,0]]), '⠂'],
  [JSON.stringify([[1,0], [1,0], [0,0]]), '⠃'],
  [JSON.stringify([[0,0], [0,0], [1,0]]), '⠄'],
  [JSON.stringify([[1,0], [0,0], [1,0]]), '⠅'],
  [JSON.stringify([[0,0], [1,0], [1,0]]), '⠆'],
  [JSON.stringify([[1,0], [1,0], [1,0]]), '⠇'],
  [JSON.stringify([[0,1], [0,0], [0,0]]), '⠈'],
  [JSON.stringify([[1,1], [0,0], [0,0]]), '⠉'],
  [JSON.stringify([[0,1], [1,0], [0,0]]), '⠊'],
  [JSON.stringify([[1,1], [1,0], [0,0]]), '⠋'],
  [JSON.stringify([[0,1], [0,0], [1,0]]), '⠌'],
  [JSON.stringify([[1,1], [0,0], [1,0]]), '⠍'],
  [JSON.stringify([[0,1], [1,0], [1,0]]), '⠎'],
  [JSON.stringify([[1,1], [1,0], [1,0]]), '⠏'],
  [JSON.stringify([[0,0], [0,1], [0,0]]), '⠐'],
  [JSON.stringify([[1,0], [0,1], [0,0]]), '⠑'],
  [JSON.stringify([[0,0], [1,1], [0,0]]), '⠒'],
  [JSON.stringify([[1,0], [1,1], [0,0]]), '⠓'],
  [JSON.stringify([[0,0], [0,1], [1,0]]), '⠔'],
  [JSON.stringify([[1,0], [0,1], [1,0]]), '⠕'],
  [JSON.stringify([[0,0], [1,1], [1,0]]), '⠖'],
  [JSON.stringify([[1,0], [1,1], [1,0]]), '⠗'],
  [JSON.stringify([[0,1], [0,1], [0,0]]), '⠘'],
  [JSON.stringify([[1,1], [0,1], [0,0]]), '⠙'],
  [JSON.stringify([[0,1], [1,1], [0,0]]), '⠚'],
  [JSON.stringify([[1,1], [1,1], [0,0]]), '⠛'],
  [JSON.stringify([[0,1], [0,1], [1,0]]), '⠜'],
  [JSON.stringify([[1,1], [0,1], [1,0]]), '⠝'],
  [JSON.stringify([[0,1], [1,1], [1,0]]), '⠞'],
  [JSON.stringify([[1,1], [1,1], [1,0]]), '⠟'],
  [JSON.stringify([[0,0], [0,0], [0,1]]), '⠠'],
  [JSON.stringify([[1,0], [0,0], [0,1]]), '⠡'],
  [JSON.stringify([[0,0], [1,0], [0,1]]), '⠢'],
  [JSON.stringify([[1,0], [1,0], [0,1]]), '⠣'],
  [JSON.stringify([[0,0], [0,0], [1,1]]), '⠤'],
  [JSON.stringify([[1,0], [0,0], [1,1]]), '⠥'],
  [JSON.stringify([[0,0], [1,0], [1,1]]), '⠦'],
  [JSON.stringify([[1,0], [1,0], [1,1]]), '⠧'],
  [JSON.stringify([[0,1], [0,0], [0,1]]), '⠨'],
  [JSON.stringify([[1,1], [0,0], [0,1]]), '⠩'],
  [JSON.stringify([[0,1], [1,0], [0,1]]), '⠪'],
  [JSON.stringify([[1,1], [1,0], [0,1]]), '⠫'],
  [JSON.stringify([[0,1], [0,0], [1,1]]), '⠬'],
  [JSON.stringify([[1,1], [0,0], [1,1]]), '⠭'],
  [JSON.stringify([[0,1], [1,0], [1,1]]), '⠮'],
  [JSON.stringify([[1,1], [1,0], [1,1]]), '⠯'],
  [JSON.stringify([[0,0], [0,1], [0,1]]), '⠰'],
  [JSON.stringify([[1,0], [0,1], [0,1]]), '⠱'],
  [JSON.stringify([[0,0], [1,1], [0,1]]), '⠲'],
  [JSON.stringify([[1,0], [1,1], [0,1]]), '⠳'],
  [JSON.stringify([[0,0], [0,1], [1,1]]), '⠴'],
  [JSON.stringify([[1,0], [0,1], [1,1]]), '⠵'],
  [JSON.stringify([[0,0], [1,1], [1,1]]), '⠶'],
  [JSON.stringify([[1,0], [1,1], [1,1]]), '⠷'],
  [JSON.stringify([[0,1], [0,1], [0,1]]), '⠸'],
  [JSON.stringify([[1,1], [0,1], [0,1]]), '⠹'],
  [JSON.stringify([[0,1], [1,1], [0,1]]), '⠺'],
  [JSON.stringify([[1,1], [1,1], [0,1]]), '⠻'],
  [JSON.stringify([[0,1], [0,1], [1,1]]), '⠼'],
  [JSON.stringify([[1,1], [0,1], [1,1]]), '⠽'],
  [JSON.stringify([[0,1], [1,1], [1,1]]), '⠾'],
  [JSON.stringify([[1,1], [1,1], [1,1]]), '⠿'],
]);

window.brailleMap = brailleMap;

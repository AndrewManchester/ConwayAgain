const sumValueOfSurroundingCells = (theCellRow, theCellCol, dataGrid) => {
     
  const rows = dataGrid.length
  const cols = dataGrid[0].length
  const offset = [[-1,-1],[-1,0],[-1,1],      //row above cell
                  [ 0,-1],[ 0,1],             //same row as cell. Removed [0,0]
                  [ 1,-1],[ 1,0],[ 1,1] ]     //row below cell

  return offset.reduce((accum, valueFromOffset) => {
      //alert(valueFromOffset)
      const [row, col] = valueFromOffset
      const newRow = row+theCellRow
      const newCol = col+theCellCol
      //Need to check that we are not accessing values outside our grid
      if (newRow < 0 || newCol < 0 || newRow >= rows || newCol >= cols) {
         return accum 
      } else {
         return accum + dataGrid[row+theCellRow][col+theCellCol]
      }
    },0)
    
}

const processCellsInRow = (aRow, rowNum, theGrid) => {  
return aRow.map((aCell, colNum) => 
{
    const livingCellsAround = sumValueOfSurroundingCells(rowNum, colNum, theGrid)
    if (aCell === 0) {
       //Cell is dead. If it has three living cells around it then
       //bring it back to life
       return  (livingCellsAround === 3) ? 1 : 0
    }
    else {
      //Cell is alive. It dies if living cells around it is
      //less than 2 or more than 3
       return (livingCellsAround < 2 || livingCellsAround > 3) ? 0 : 1
    }
 })    //map end
}


const life = (gridFull) => {		
//Iterate old grid gridFull values to build newGrid
let newGrid = gridFull.map((aRow, rowNum, theGrid) => processCellsInRow(aRow, rowNum, theGrid))
//console.log(newGrid)
return newGrid
}

export default life

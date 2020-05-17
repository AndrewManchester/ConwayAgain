function arrayClone(arr) {
  //Various options here
  //return JSON.parse(JSON.stringify(arr));	
  return arr.map((aRow, index) => [...aRow])
}

export default arrayClone

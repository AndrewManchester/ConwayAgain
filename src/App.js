import React, { useState, useEffect } from 'react';

//import {Container, Columns, Column, Button, Notification } from 'react-bulma-components/dist';
import life from './life'
import arrayClone from './arrayclone'
import { useMachine } from '@xstate/react';
import { Machine} from 'xstate';
import './App.css'


function GridContainer(props) {
  
   function gridContainerStyle(cols, size) {
     //alert(`this is the ${cols}`)
     var z = {
        display: "grid",
        gridTemplateColumns: "repeat(" + cols + ", " + size + "px)",
        backgroundColor: "primary",
     }
     return z
   }


  const boxLayOut = (rows, cols) => { 
    var theRet = []
    var index = 0 //for key
    for(let i=0; i < rows; i++) {
      for(let j=0; j < cols; j++) {
	        theRet.push(
          <div onClick={() => { props.message(i, j)}} 
               className={`grid-item 
                  ${props.grid[i][j] === 0 ? "set-green" : "set-red"}`}
               key={index}>
           </div>
          )
          index = index + 1
       }
     }
     return theRet
  }

  return (  <div style={gridContainerStyle(props.cols, props.boxSize)}>
                  {boxLayOut(props.rows, props.cols)}   
            </div>
        )
        
}

    

function App()  {
  
      const boxSize = 20; //this is width, the height is defined css grid-item
      const speed = 500;
      //As grid size increases user response falls
      const cols =  60 //67;
      const rows = 25 //35;
      const startTextIndex = 0
      const stopTextIndex = 1
      const buttonContents = ["Start","Stop"]

      const buttonMachine = Machine({
      id: 'buttons',
      initial: 'starting',
      states: {
      starting: { 
        on: {  STOPSTARTPRESS:  { target: 'running',
                                actions: ['hideClearButton',
                                          'setCountZero',
                                          'setStopStartStop', 
                                          'startIterations']  },
               SELECTCELL:  { actions: 'cellHandler' },
             
          }
      },
      running: { 
        on: {  STOPSTARTPRESS:  { target: 'starting',
                                actions: ['hideClearButton',
                                          'setStopStartStart',
                                          'stopIterations',
                                          ] },                  
          },
      }
  }
});
 
      //Could have used boolean to fill the array but using 1s and 0s works better with 
      //the actual logic of the game. Can easily sum 1s and 0s 
      const [gridFull, setGridFull]  = useState(Array(rows).fill().map(() => Array(cols).fill(0)))
      const [stopStartText, setStopStartText] = useState(buttonContents[startTextIndex])
      const [generation,    setGeneration] = useState(0)
      const [showClear,     setShowClear]  = useState(true)
      const [isActive,      setIsActive]   = useState(false);   
  
     const [current, send] = useMachine(buttonMachine, { 
     actions: {
          setStopStartStop:  () => { setStopStartText(buttonContents[stopTextIndex])},
          setStopStartStart: () => { setStopStartText(buttonContents[startTextIndex])},
          startIterations:   () => { setIsActive(true) },
          stopIterations:    () => { setIsActive(false) },
          setCountZero:      () => { setGeneration(0) },
          hideClearButton:   () => { setShowClear(!showClear)},
          cellHandler:       
            (context, event) => { 
              let gridCopy = arrayClone(gridFull)
              const {row, col} = event.data
              gridCopy[row][col] = (gridCopy[row][col] === 0) ?  1 : 0
              setGridFull(gridCopy)
            }
          }
      }); 
    

 //Timer solution from 
 //https://upmostly.com/tutorials/build-a-react-timer-component-using-hooks
 //Also use setTimeout or setInterval
 //https://johnresig.com/blog/how-javascript-timers-work/
 useEffect(() => {
    let interval = null;
    if (isActive) {
      //console.log("running")
      interval = setInterval(() => {
        setGeneration(generation => generation + 1)
        setGridFull(gridFull => life(gridFull))
      }, speed);
    } 
    return () => { if (isActive) {
                     //console.log("ending")
                     clearInterval(interval)
                   }
                 }
  }, [isActive, generation]);


  
  const clearBoard = () => {
    //console.log(current)
		var grid = Array(rows).fill().map(() => Array(cols).fill(0));
    setGridFull(grid)
    setGeneration(0)

	}
    
  const boxItemClick = (theRow, theCol) => {
    send('SELECTCELL', {data: { row: theRow, col: theCol}});
   }   

  const stopStartClick = () => {
    send('STOPSTARTPRESS');
  }
    

 
    //Has to JSX here
    return (
      <div className="container">
        <div className="columns">   
        <div className="column is-full has-background-primary">
          <div className="content">
            <h1>Conway's Game of Life</h1>
           
           <button className={
  `button ${(stopStartText.localeCompare(buttonContents[startTextIndex]) === 0) 
   ? "is-success" : "is-danger"}`}
             
              onClick={stopStartClick}>{stopStartText}
           </button>
           <input className="button" 
                  type="reset" 
                  value={generation}
            /> 
           {showClear ? 
               <button className="button is-success" 
                      onClick={clearBoard}>
                 Clear
              </button> : null }
          
        </div>
        <div className="centreBlock">
          <div></div>
          <GridContainer 
                message={boxItemClick} 
                boxSize={boxSize}
                rows={rows}
                cols={cols}
                grid={gridFull}/>
            <div></div>
       </div>
      </div>
      </div>
    </div>
    )

  
}


export default App;

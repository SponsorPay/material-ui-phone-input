import Paper from "@material-ui/core/Paper"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import * as React from "react"
import * as ReactDOM from "react-dom"
import {PhoneInput} from "./phoneInput"

const darkTheme = createMuiTheme({
  palette: {
    text: {
      primary: "#fff"
    },
    background: {
      default: "#1d0047",
      paper: "#1d0047"
    }
  }
})

const lightTheme = createMuiTheme()

ReactDOM.render(<div>
  <PhoneInput label="Phone Number"/>

  <MuiThemeProvider theme={darkTheme}>
    <Paper>
      <PhoneInput listTheme={lightTheme}/>
    </Paper>
  </MuiThemeProvider>
</div>, document.getElementById("root"))

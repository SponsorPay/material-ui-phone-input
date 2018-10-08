import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
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
  <PhoneInput />

  <MuiThemeProvider theme={darkTheme}>
    <Paper>
      <PhoneInput listTheme={lightTheme}/>
    </Paper>
  </MuiThemeProvider>

  <PhoneInput
    renderInput={
      input =>
        <FormControl>
          <InputLabel>
            Phone Number
          </InputLabel>
          {input}
        </FormControl>
    }
  />

</div>, document.getElementById("root"))

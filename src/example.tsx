import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Paper from "@material-ui/core/Paper"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import * as React from "react"
import * as ReactDOM from "react-dom"
import {PhoneInput, PhoneInputProps, PhoneInputState} from "./phoneInput"

const lookup = require("country-data").lookup

const darkTheme = createMuiTheme({
  palette: {
    text: {
      primary: "#fff"
    },
    background: {
      default: "#1d0047",
      paper: "#1d0047"
    }
  },
  typography: {
    useNextVariants: true
  }
})

const lightTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
})

class App extends React.Component {
  state = {
    country: null as PhoneInputProps["country"],
    phone: null as PhoneInputProps["phone"]
  }

  async componentDidMount() {
    const country =  await lookup.countries({alpha2: "IL"})[0]
    setTimeout(() => {
      this.setState({
        country,
        phone: "3457643734"
      })
    }, 10)
  }

  render() {
    return (
      <div>
        <PhoneInput
          phone={"4353636"}
          country={this.state.country}
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

      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("root"))

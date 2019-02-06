import ButtonBase from "@material-ui/core/ButtonBase/ButtonBase"
import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener"
import Grid from "@material-ui/core/Grid/Grid"
import Input, {InputProps} from "@material-ui/core/Input"
import Paper from "@material-ui/core/Paper/Paper"
import Popper from "@material-ui/core/Popper/Popper"
import {Theme} from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import withStyles from "@material-ui/core/styles/withStyles"
import Typography from "@material-ui/core/Typography/Typography"
import ArrowIcon from "@material-ui/icons/ArrowDropDown"
import {AsYouType} from "libphonenumber-js"
import * as React from "react"
import {List, ListRowProps} from "react-virtualized/dist/commonjs/List"
import {Classes} from "./classes"
import {Country} from "./country"
import {CountryIcon} from "./countryIcon"
import {CountryMenuItem} from "./countryMenuItem"

const sortBy = require("lodash/sortBy")
const identity = require("lodash/identity")

const lookup = require("country-data").lookup

function getCountries(): Country[] {
  const countries = lookup.countries({status: "assigned"})
    .filter((y: any) => y.countryCallingCodes != "")
  return sortBy(countries, "name")
}

const allCountries = getCountries()

const unknownCountry: Country = {
  name: "",
  alpha2: "",
  countryCallingCodes: [""]
}

export const styles = {
  worldIcon: {
    backgroundColor: "#9B9B9B",
    color: "#fff"
  },
  hiddenInput: {
    width: 0,
    height: 0,
    padding: 0,
    outline: "none",
    border: "none",
  },
  hiddenInputRoot: {
    overflow: "hidden"
  },
  list: {
    outline: "none" as any
  },
  popper: {
    zIndex: 999
  },
  input: {marginRight: 0},
  textField: {
    paddingBottom: 0
  },
  button: {
    padding: 0
  },
  buttonFlag: {
    display: "flex",
    marginLeft: 8
  },
  paper: {
    display: "flex",
    borderRadius: 0
  },

}

export interface PhoneInputProps {
  onBlur?: () => any,
  onChange?: (alpha2: string, phoneNumber: string) => any,
  classes?: Classes<typeof styles>
  width?: number
  fieldTheme?: Theme
  listTheme?: Theme
  renderInput?: (input: React.ReactElement<InputProps>) => React.ReactNode
}

export interface PhoneInputState {
  phone: string
  anchorEl: HTMLElement | null
  country: Country
  countries: Country[]
  search: string
}

@(withStyles(styles) as any)
export class PhoneInput extends React.Component<PhoneInputProps, PhoneInputState> {
  list: List | null = null

  state = {
    phone: "",
    anchorEl: null as any,
    country: unknownCountry,
    countries: allCountries,
    search: ""
  }

  handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const {onChange} = this.props
    const asYouType = new AsYouType()
    let phone = asYouType.input(event.target.value)
    const alpha2 = asYouType.country
    const national = asYouType.getNationalNumber()
    const country = lookup.countries({alpha2})[0] || unknownCountry
    const code = country.countryCallingCodes[0]
    phone = alpha2 ? phone.replace(code, `(${code})`) : phone
    phone = phone.replace(/[^)]\s/g, (match: string) => match.replace(/\s/g, "-"))
    this.setState({
      phone,
      country,
    })
    onChange && onChange(alpha2, national)
  }

  handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleClose = () => {
    this.setState({anchorEl: null, countries: allCountries, search: ""})
  }

  handleSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const search = event.target.value
    const countries = allCountries.filter(country => new RegExp(search, "i").test(country.name))
    this.setState({
      search,
      countries
    })
  }

  handleCountryClick = (country: Country) => {
    const {country: selectedCountry, phone: selectedPhone} = this.state
    const currentCallingCode = `(${selectedCountry.countryCallingCodes[0]})`
    const newCallingCode = `(${country.countryCallingCodes[0]})`
    const phone = selectedPhone.indexOf(currentCallingCode) !== -1 ? selectedPhone.replace(
      currentCallingCode,
      newCallingCode
    ) : newCallingCode
    this.setState({
      anchorEl: null,
      search: "",
      phone,
      country,
      countries: allCountries
    })
  }

  handleBlur = () => {
    const {onBlur} = this.props
    onBlur && onBlur()
  }

  emptyRow = ( {index, style}: ListRowProps) => {
    return <Typography  key="unknown" style={{
      fontWeight: 300,
      paddingLeft: 8,
      textAlign: "center",
      ...style
    }}>{"Country name not found: "}{this.state.search}</Typography>
  }

  rowRenderer = ({index, style}: ListRowProps) => {
    const {countries} = this.state
    const country = countries[index]
    return <CountryMenuItem
      key={country.name}
      country={country}
      style={{...style, boxSizing: "border-box"}}
      onSelectCountry={this.handleCountryClick}
      search={this.state.search}
    />
  }

  listRef = (list: List) => {
    this.list = list
  }

  componentDidUpdate(prevProps: PhoneInputProps, prevState: PhoneInputState) {
    if (prevState.countries != this.state.countries) {
      this.list && this.list.forceUpdateGrid()
    }
  }

  render() {
    const {classes: classesProp, fieldTheme, listTheme, renderInput = identity} = this.props
    const {anchorEl, countries, country} = this.state
    const classes = classesProp!

    const field = <Input
      onChange={this.handleChange}
      onBlur={this.handleBlur}
      fullWidth
      value={this.state.phone}
      className={classes.textField}
      startAdornment={
        <ButtonBase component="div" onClick={this.handleClick} className={classes.button}>
          <Grid container direction="row" alignItems="center" wrap="nowrap">
            <CountryIcon country={country} className={classes.buttonFlag}/>
            <ArrowIcon/>
          </Grid>
        </ButtonBase>
      }
    />
    const rowRender = countries.length ? this.rowRenderer : this.emptyRow
    const rowCount=countries.length ? countries.length : 1
    const list = <Paper className={classes.paper}>
      <div className={classes.hiddenInputRoot}>
        <input className={classes.hiddenInput} onChange={this.handleSearch} autoFocus value={this.state.search}/>
      </div>
      <List ref={this.listRef} height={250} rowHeight={36} rowCount={rowCount}
            className={classes.list}
            width={this.props.width || 331} rowRenderer={rowRender} overscanRowCount={10}
      />
    </Paper>

    const fieldWithTheme = fieldTheme ? <MuiThemeProvider theme={fieldTheme}>{field}</MuiThemeProvider> : field

    return <React.Fragment>

      {renderInput(fieldWithTheme)}

      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start" className={classes.popper}>
        <ClickAwayListener onClickAway={this.handleClose}>
          {listTheme ? <MuiThemeProvider theme={listTheme}>{list}</MuiThemeProvider> : list}
        </ClickAwayListener>
      </Popper>
    </React.Fragment>
  }
}

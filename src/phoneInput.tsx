import Button from "@material-ui/core/Button/Button"
import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener"
import Grid from "@material-ui/core/Grid/Grid"
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment"
import Paper from "@material-ui/core/Paper/Paper"
import Popper from "@material-ui/core/Popper/Popper"
import withStyles from "@material-ui/core/styles/withStyles"
import TextField from "@material-ui/core/TextField/TextField"
import ArrowIcon from "@material-ui/icons/ArrowDropDown"
import {AsYouType} from "libphonenumber-js"
import * as React from "react"
import {Country} from "./country"
import {CountryIcon} from "./countryIcon"
import {CountryMenuItem} from "./countryMenuItem"
import {List, ListRowProps} from "react-virtualized"
import Input from "@material-ui/core/Input/Input"
import Typography from "@material-ui/core/Typography/Typography"

const sortBy = require("lodash/sortBy")

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

const styles = {
  worldIcon: {
    backgroundColor: "#9B9B9B",
    color: "FFFFFF"
  },
  hiddenInput: {
    width: "0",
    height: "0",
    padding: "0"
  },
  popover: {
    maxHeight: "14em",
  },
  list: {
    overflow: "auto",
    maxHeight: "14em",
  },
  popper: {
    zIndex: 999
  },
  input: {marginRight: 0},
  textField: {paddingBottom: 0},
  button: {padding: 0}
}

export interface PhoneInputProps {
  onBlur?: () => any,
  onChange?: (alpha2: string, phoneNumber: string) => any,
  error: boolean,
  helperText: string
  classes?: Record<string, string>
  width?: number
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

  handleClick: React.MouseEventHandler<HTMLInputElement> = (event) => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleClose = () => {
    this.setState({anchorEl: null})
  }

  handleSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const search = event.target.value
    const countries = allCountries.filter(country => new RegExp(`${search}`, "i").test(country.name))
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
    const {error, helperText, classes: classesProp} = this.props
    const {anchorEl, countries, country} = this.state
    const classes = classesProp!
    return <Grid container direction={"column"}>
      <Grid item>
        <TextField
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          label={"Phone Number"}
          fullWidth={true}
          value={this.state.phone}
          className={classes.textField}
          error={error}
          helperText={helperText}
          InputProps={{
            startAdornment:
              <InputAdornment position="start" className={classes.input}>
                <Button onClick={this.handleClick} className={classes.button}>
                  <Grid>
                    <CountryIcon country={country}/>
                  </Grid>
                  <Grid>
                    <ArrowIcon/>
                  </Grid>
                </Button>
              </InputAdornment>
          }}
        />
      </Grid>

      <Grid item>
        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement={"bottom-start"} className={classes.popper}>
          <Paper>
            <ClickAwayListener onClickAway={this.handleClose}>
              <Paper>
                <Input onChange={this.handleSearch} autoFocus disableUnderline
                       inputProps={{padding: 0}} value={this.state.search}
                       className={classes.hiddenInput}/>
                {!countries.length ? <Typography>There is no country match the result</Typography> :
                  <List ref={this.listRef} height={250} rowHeight={36} rowCount={countries.length}
                        width={this.props.width || 331} rowRenderer={this.rowRenderer} overscanRowCount={10}
                  />}
              </Paper>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </Grid>
    </Grid>
  }
}

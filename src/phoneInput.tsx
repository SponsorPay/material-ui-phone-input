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
import {FixedSizeList as List, ListChildComponentProps} from "react-window"
import {Classes} from "./classes"
import {Country} from "./country"
import {CountryIcon} from "./countryIcon"
import {CountryMenuItem} from "./countryMenuItem"

const sortBy = require("lodash/sortBy")
const identity = require("lodash/identity")
const lookup = require("country-data").lookup

function getCountries(): Country[] {
  const countries = lookup
    .countries({status: "assigned"})
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
    border: "none"
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
  }
}

export interface PhoneInputProps {
  onBlur?: () => any
  onChange?: (country: Country, phoneNumber: string) => any
  classes?: Classes<typeof styles>
  width?: number
  fieldTheme?: Theme
  listTheme?: Theme
  renderInput?: (input: React.ReactElement<InputProps>) => React.ReactNode
  phone?: string | null
  country?: Country | null
}

export interface PhoneInputState {
  phone: string
  anchorEl: HTMLElement | null
  country: Country
  countries: Country[]
  search: string
}

@(withStyles(styles) as any)
export class PhoneInput extends React.Component<
  PhoneInputProps,
  PhoneInputState
> {
  listRef = React.createRef<List>()

  constructor(props: PhoneInputProps, ...args: any[]) {
    super(props, ...args)

    const country = this.props.country || unknownCountry

    const state = {
      phone: "",
      anchorEl: null as any,
      country,
      countries: allCountries,
      search: ""
    }

    if (this.props.phone) {
      const asYouType = new AsYouType()
      const parsedPhone = asYouType.input(this.props.phone)
      const alpha2 = asYouType.country
      const code = country.countryCallingCodes[0]
      const phoneWithCountry = alpha2 ? parsedPhone.replace(code, `(${code})`) : parsedPhone
      state.phone = phoneWithCountry.replace(/[^)]\s/g, (match: string) => match.replace(/\s/g, "-"))
    }

    this.state = state
  }

  handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {onChange} = this.props
    const asYouType = new AsYouType()
    const parsedPhone = asYouType.input(event.target.value)
    const alpha2 = asYouType.country
    const national = asYouType.getNationalNumber()
    const country = lookup.countries({alpha2})[0] || this.state.country
    const code = country.countryCallingCodes[0]
    const phoneWithCountry = alpha2 ? parsedPhone.replace(code, `(${code})`) : parsedPhone
    const phone = phoneWithCountry.replace(/[^)]\s/g, (match: string) =>
      match.replace(/\s/g, "-")
    )
    this.setState(
      {
        phone,
        country
      },
      () => {
        onChange && onChange(country, national)
      }
    )
  }

  handleClick: React.MouseEventHandler<HTMLElement> = event => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleClose = () => {
    this.setState({anchorEl: null, countries: allCountries, search: ""})
  }

  handleSearch: React.ChangeEventHandler<HTMLInputElement> = event => {
    const search = event.target.value
    const countries = allCountries.filter(country =>
      new RegExp(search, "i").test(country.name)
    )
    this.setState({
      search,
      countries
    })
  }

  handleCountryClick = (country: Country) => {
    const {onChange} = this.props
    const {country: selectedCountry, phone: selectedPhone} = this.state
    const currentCallingCode = `(${selectedCountry.countryCallingCodes[0]})`
    const newCallingCode = `(${country.countryCallingCodes[0]})`
    const phone =
      selectedPhone.indexOf(currentCallingCode) !== -1
        ? selectedPhone.replace(currentCallingCode, newCallingCode)
        : newCallingCode
    this.setState(
      {
        anchorEl: null,
        search: "",
        phone,
        country,
        countries: allCountries
      },
      () => {
        onChange && onChange(country, phone)
      }
    )
  }

  handleBlur = () => {
    const {onBlur} = this.props
    onBlur && onBlur()
  }

  emptyRow = ({index, style}: ListChildComponentProps) => {
    return (
      <Typography
        key="unknown"
        style={{
          fontWeight: 300,
          paddingLeft: 8,
          textAlign: "center",
          ...style
        }}
      >
        {"Country name not found: "}
        {this.state.search}
      </Typography>
    )
  }

  rowRenderer = ({index, style}: ListChildComponentProps) => {
    const {countries} = this.state
    const country = countries[index]
    return (
      <CountryMenuItem
        key={country.name}
        country={country}
        style={{...style, boxSizing: "border-box"}}
        onSelectCountry={this.handleCountryClick}
        search={this.state.search}
      />
    )
  }

  render() {
    const {
      classes: classesProp,
      fieldTheme,
      listTheme,
      renderInput = identity
    } = this.props
    const {anchorEl, countries, country} = this.state
    const classes = classesProp!

    const field = (
      <Input
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        fullWidth
        value={this.state.phone}
        className={classes.textField}
        startAdornment={
          <ButtonBase
            component="div"
            onClick={this.handleClick}
            className={classes.button}
          >
            <Grid container direction="row" alignItems="center" wrap="nowrap">
              <CountryIcon country={country} className={classes.buttonFlag} />
              <ArrowIcon />
            </Grid>
          </ButtonBase>
        }
      />
    )
    const rowRender = countries.length ? this.rowRenderer : this.emptyRow
    const rowCount = countries.length ? countries.length : 1
    const list = (
      <Paper className={classes.paper}>
        <div className={classes.hiddenInputRoot}>
          <input
            className={classes.hiddenInput}
            onChange={this.handleSearch}
            autoFocus
            value={this.state.search}
          />
        </div>
        <List
          ref={this.listRef}
          height={250}
          itemSize={36}
          itemCount={rowCount}
          className={classes.list}
          width={this.props.width || 331}
          overscanCount={10}
        >
          {rowRender}
        </List>
      </Paper>
    )

    const fieldWithTheme = fieldTheme ? (
      <MuiThemeProvider theme={fieldTheme}>{field}</MuiThemeProvider>
    ) : (
      field
    )

    return (
      <>
        {renderInput(fieldWithTheme)}

        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="bottom-start"
          className={classes.popper}
        >
          <ClickAwayListener onClickAway={this.handleClose}>
            {listTheme ? (
              <MuiThemeProvider theme={listTheme}>{list}</MuiThemeProvider>
            ) : (
              list
            )}
          </ClickAwayListener>
        </Popper>
      </>
    )
  }
}

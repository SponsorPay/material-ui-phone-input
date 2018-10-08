import * as React from "react";
import MenuItem, {MenuItemProps} from "@material-ui/core/MenuItem/MenuItem"
import Grid from "@material-ui/core/Grid/Grid"
import Typography from "@material-ui/core/Typography"
import withStyles from "@material-ui/core/styles/withStyles"
import {Country} from "./country"
import {CountryIcon} from "./countryIcon"

const styles = {
  countryName: {
    fontSize: "1em",
    flex: 1,
  },
  maxLines: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-all",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 1,
  } as any,
  dialNumber: {
    marginLeft: "auto",
  },
  countryCode: {
    color: "#1D0047",
    fontSize: "1em",
  },
  countryNameList: {
    color: "#1D0047",
    fontWeight: 300,
    paddingLeft: 8
  },
  menuItem: {
    padding: "0 8px",
  },
  countryFlag: {
    display: "flex"
  }
}

export interface CountryItemProps extends MenuItemProps {
  search: string
  onSelectCountry: (country: Country) => any
  classes?: Record<string, string>
  country: Country
}

@(withStyles(styles) as any)
export class CountryMenuItem extends React.Component<CountryItemProps> {
  highlightSearch(name: string, search: string) {
    const {classes: classesProp} = this.props
    const classes = classesProp!
    if (search) {
      const parts = name.split(new RegExp(`(${search})`, "gi"))
      return <Typography className={classes.countryNameList}>
        {parts.map((part, index) => part.toLowerCase() === search.toLowerCase() ?
          <b key={index}>{part}</b> : part)}</Typography>
    }
    return <Typography className={classes.countryNameList}>{name}</Typography>
  }

  handleClick = () => {
    this.props.onSelectCountry(this.props.country)
  }

  render() {
    const {country, search, classes: classesProp, onSelectCountry, ...props} = this.props
    const classes = classesProp!
    return <MenuItem component="div" onClick={this.handleClick} className={classes.menuItem} {...props}>
      <Grid container direction="row" alignItems="center" wrap="nowrap">
        <CountryIcon className={classes.countryFlag} country={country}/>

        <Grid zeroMinWidth item className={classes.countryName}>
          <div className={classes.maxLines}>{this.highlightSearch(country.name, search)}</div>
        </Grid>
        <Grid item className={classes.dialNumber}>
          <Typography className={classes.countryCode}>{country.countryCallingCodes[0]}</Typography>
        </Grid>
      </Grid>
    </MenuItem>
  }
}

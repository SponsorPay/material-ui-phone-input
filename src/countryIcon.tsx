import withStyles from "@material-ui/core/styles/withStyles"
import {HTMLAttributes} from "react"
import * as React from "react"
import LanguageIcon from "@material-ui/icons/Language"
import * as classNames from "classnames"

export interface CountryIconProps extends HTMLAttributes<HTMLDivElement> {
  country: {
    alpha2: string
    name: string
  }
  classes?: Record<string, string>
}

const styles = {
  root: {
    width: 26,
},
  image: {
    height: 20,
    width: 26,
    borderRadius: 3,
    objectFit: "cover" as any
  },
  ww: {
    backgroundColor: "#9b9b9b",
    color: "#fff"
  }
}

@(withStyles(styles) as any)
export class CountryIcon extends React.PureComponent<CountryIconProps> {
  render() {
    const {country, classes: classesProp, className, ...props} = this.props
    const classes = classesProp!
    const src = country.alpha2 &&
      `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.0/flags/1x1/${country.alpha2.toLowerCase()}.svg`
    return <div className={classNames(classes.root, className)} {...props}>
      {country.alpha2 ?
        <img alt={country.name} className={classes.image} src={src}/> :
        <LanguageIcon className={classNames(classes.image, classes.ww)} />}
    </div>
  }
}

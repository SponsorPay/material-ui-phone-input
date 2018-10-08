import {PhoneInput} from "../src"
import * as reactTestRenderer from "react-test-renderer"
import * as shallow from "react-test-renderer/shallow"
import * as React from "react"
import {renderToStaticMarkup} from "react-dom/server"
import * as testUtils from "react-dom/test-utils"

describe("PhoneInput", function () {
  this.timeout(100000)
  it("should render", () => {
    // reactTestRenderer.create(<PhoneInput/>)

    const renderer = shallow.createRenderer()
    renderer.render(<PhoneInput/>)
    const element = renderer.getRenderOutput()

    renderToStaticMarkup(<PhoneInput />)
  })
})

/*

Perlin Texture for Framer
A component to make Perlin noise with RGBA effects
MIT License

// The MIT License

Copyright (c) 2021 Yann Bellot, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

import { addPropertyControls, ControlType, Color, Frame } from "framer"

function getRandomValue(min, max) {
    return Math.random() * (max - min) + min
}

// Return random value deviation
function getRandomGap(value, rValue, type) {
    // Simple deviation
    if (type === "NUMBER") {
        value = Math.round(value + getRandomValue(-rValue, rValue))
        return value
    }

    // Deviation in 0 to 100.
    if (type === "PURCENT") {
        value = Math.round(value + getRandomValue(-rValue, rValue))
        if (value > 100) {
            value = 100
        }
        if (value < 0) {
            value = 0
        }
        return value
    }

    // Deviation in 0 to 360° in loop (trigonometric circle)
    if (type === "TRIGO") {
        value = Math.round(value + getRandomValue(-rValue, rValue))
        if (value > 360) {
            value = value - 360
        }
        if (value < 0) {
            value = 360 + value
        }
        return value
    }
}

// ID link function
function fIdLink(id) {
    let link = "url(#" + id + ")"
    return link
}

// Mask ID generator
const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

// Random identifier generator
function generateString(length) {
    let result = ""
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

// Pattern function
export default function Perlin_Texture(props) {
    const { style } = props
    // Random ID generator
    let randomID = generateString(6)
    let maskID = "mask_" + randomID
    let urlMaskID = "url(#" + maskID + ")"
    let perlinID = "perlin_" + randomID
    let urlPerlinID = "url(#" + perlinID + ")"

    // Lighting color
    let lightingColor = props.lightingColor
    let lightingScale = props.lightingScale
    let diffuseConstant = props.diffuseConstant

    // Perlin noise
    let perlinType = props.perlinType
    if (perlinType === true) {
        perlinType = "turbulence"
    }
    if (perlinType === false) {
        perlinType = "fractalNoise"
    }
    let xFrequency = props.xFrequency
    let yFrequency = props.yFrequency
    let baseFrequency = xFrequency + " " + yFrequency

    let octaveTurb = props.octaveTurb
    let seedTurb = props.seedTurb
    if (props.seedToggle === true) {
        seedTurb = getRandomValue(1, 10000)
    }
    let effectType
    if (props.effectToggle == 2) {
        effectType = "discrete"
    }
    if (props.effectToggle == 3) {
        effectType = "table"
    }
    let azimuth = props.azimuth
    let elevation = props.elevation

    // Table & discrete filter variables
    let rTableValues = props.redTable
    let gTableValues = props.greenTable
    let bTableValues = props.blueTable
    let aTableValues = props.alphaTable

    // Linear filter variables
    let redLinearSlope = props.rgbaSlope[0]
    let redLinearIntercept = props.rgbaIntercept[0]
    let greenLinearSlope = props.rgbaSlope[1]
    let greenLinearIntercept = props.rgbaIntercept[1]
    let blueLinearSlope = props.rgbaSlope[2]
    let blueLinearIntercept = props.rgbaIntercept[2]
    let alphaLinearSlope = props.rgbaSlope[3]
    let alphaLinearIntercept = props.rgbaIntercept[3]

    // Gamma filter variables
    let redGammaAmplitude = props.rgbaAmplitude[0] * 10
    let redGammaExponent = props.rgbaExponent[0] * 10
    let greenGammaAmplitude = props.rgbaAmplitude[1] * 10
    let greenGammaExponent = props.rgbaExponent[1] * 10
    let blueGammaAmplitude = props.rgbaAmplitude[2] * 10
    let blueGammaExponent = props.rgbaExponent[2] * 10
    let alphaGammaAmplitude = props.rgbaAmplitude[3] * 10
    let alphaGammaExponent = props.rgbaExponent[3] * 10

    // SVG graphic returns

    // Basic filter
    if (props.effectToggle === 1) {
        return (
            <svg style={{ width: 200, height: 200, ...style }}>
                <filter id={perlinID}>
                    <feTurbulence
                        type={perlinType}
                        baseFrequency={baseFrequency}
                        numOctaves={octaveTurb}
                        result={perlinType}
                        seed={seedTurb}
                    />
                </filter>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    filter={urlPerlinID}
                />
            </svg>
        )
    }
    // Table & discrete filter return
    if (props.effectToggle === 2 || props.effectToggle === 3) {
        return (
            <svg style={{ width: 200, height: 200, ...style }}>
                <filter id={perlinID}>
                    <feTurbulence
                        type={perlinType}
                        baseFrequency={baseFrequency}
                        numOctaves={octaveTurb}
                        result={perlinType}
                        seed={seedTurb}
                    />
                    <feComponentTransfer>
                        <feFuncR
                            type={effectType}
                            tableValues={rTableValues}
                        ></feFuncR>
                        <feFuncG
                            type={effectType}
                            tableValues={gTableValues}
                        ></feFuncG>
                        <feFuncB
                            type={effectType}
                            tableValues={bTableValues}
                        ></feFuncB>
                        <feFuncA
                            type={effectType}
                            tableValues={aTableValues}
                        ></feFuncA>
                    </feComponentTransfer>
                </filter>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    filter={urlPerlinID}
                />
            </svg>
        )
    }
    // Linear filter return
    if (props.effectToggle === 4) {
        return (
            <svg style={{ width: 200, height: 200, ...style }}>
                <filter id={perlinID}>
                    <feTurbulence
                        type={perlinType}
                        baseFrequency={baseFrequency}
                        numOctaves={octaveTurb}
                        result={perlinType}
                        seed={seedTurb}
                    />
                    <feComponentTransfer>
                        <feFuncR
                            type="linear"
                            slope={redLinearSlope}
                            intercept={redLinearIntercept}
                        ></feFuncR>
                        <feFuncG
                            type="linear"
                            slope={greenLinearSlope}
                            intercept={greenLinearIntercept}
                        ></feFuncG>
                        <feFuncB
                            type="linear"
                            slope={blueLinearSlope}
                            intercept={blueLinearIntercept}
                        ></feFuncB>
                        <feFuncA
                            type="linear"
                            slope={alphaLinearSlope}
                            intercept={alphaLinearIntercept}
                        ></feFuncA>
                    </feComponentTransfer>
                </filter>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    filter={urlPerlinID}
                />
            </svg>
        )
    }
    // Gamma filter return
    if (props.effectToggle === 5) {
        return (
            <svg style={{ width: 200, height: 200, ...style }}>
                <filter id={perlinID}>
                    <feTurbulence
                        type={perlinType}
                        baseFrequency={baseFrequency}
                        numOctaves={octaveTurb}
                        result={perlinType}
                        seed={seedTurb}
                    />
                    <feComponentTransfer>
                        <feFuncR
                            type="gamma"
                            amplitude={redGammaAmplitude}
                            exponent={redGammaExponent}
                            offset="0"
                        ></feFuncR>
                        <feFuncG
                            type="gamma"
                            amplitude={greenGammaAmplitude}
                            exponent={greenGammaExponent}
                            offset="0"
                        ></feFuncG>
                        <feFuncB
                            type="gamma"
                            amplitude={blueGammaAmplitude}
                            exponent={blueGammaExponent}
                            offset="0"
                        ></feFuncB>
                        <feFuncA
                            type="gamma"
                            amplitude={alphaGammaAmplitude}
                            exponent={alphaGammaExponent}
                            offset="0"
                        ></feFuncA>
                    </feComponentTransfer>
                </filter>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    filter={urlPerlinID}
                />
            </svg>
        )
    }
    // Lighting filter return
    if (props.effectToggle === 6) {
        return (
            <svg style={{ width: 200, height: 200, ...style }}>
                <filter id={perlinID}>
                    <feTurbulence
                        type={perlinType}
                        baseFrequency={baseFrequency}
                        numOctaves={octaveTurb}
                        result={perlinType}
                        seed={seedTurb}
                    />
                    <feDiffuseLighting
                        lightingColor={lightingColor}
                        surfaceScale={lightingScale}
                        diffuseConstant={diffuseConstant}
                    >
                        <feDistantLight
                            azimuth={azimuth}
                            elevation={elevation}
                        ></feDistantLight>
                    </feDiffuseLighting>
                </filter>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    filter={urlPerlinID}
                />
            </svg>
        )
    }
}

// Property Controls
addPropertyControls(Perlin_Texture, {
    // Perlin control
    perlinType: {
        type: ControlType.Boolean,
        title: "Noise",
        defaultValue: true,
        enabledTitle: "Turbul.",
        disabledTitle: "Fractal N.",
    },
    // Perlin filter options
    effectToggle: {
        type: ControlType.Enum,
        title: "Effect",
        options: [1, 2, 3, 4, 5, 6],
        optionTitles: [
            "None",
            "Discrete",
            "Table",
            "Linear",
            "Gamma",
            "Lighting",
        ],
    },
    // Perlin lighting filter options
    lightingColor: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "#FFFFFF",
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 2 ||
                props.effectToggle === 3 ||
                props.effectToggle === 4 ||
                props.effectToggle === 5
            )
        },
    },
    lightingScale: {
        type: ControlType.Number,
        title: "Intensity",
        defaultValue: 20,
        min: 0,
        max: 100,
        step: 0.1,
        displayStepper: false,
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 2 ||
                props.effectToggle === 3 ||
                props.effectToggle === 4 ||
                props.effectToggle === 5
            )
        },
    },
    diffuseConstant: {
        type: ControlType.Number,
        title: "Reflection",
        defaultValue: 1,
        min: 0,
        max: 100,
        step: 0.1,
        displayStepper: false,
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 2 ||
                props.effectToggle === 3 ||
                props.effectToggle === 4 ||
                props.effectToggle === 5
            )
        },
    },
    azimuth: {
        type: ControlType.Number,
        title: "Azimuth",
        defaultValue: 40,
        min: 0,
        max: 180,
        step: 1,
        displayStepper: false,
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 2 ||
                props.effectToggle === 3 ||
                props.effectToggle === 4 ||
                props.effectToggle === 5
            )
        },
    },
    elevation: {
        type: ControlType.Number,
        title: "Elevation",
        defaultValue: 60,
        min: 0,
        max: 180,
        step: 1,
        displayStepper: false,
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 2 ||
                props.effectToggle === 3 ||
                props.effectToggle === 4 ||
                props.effectToggle === 5
            )
        },
    },
    // Perlin basic options
    xFrequency: {
        type: ControlType.Number,
        title: "x Frequency",
        defaultValue: 0.01,
        min: 0.0001,
        max: 0.05,
        step: 0.001,
        displayStepper: false,
        hidden(props) {
            return props.typeToggle == "b" || props.typeToggle == "a"
        },
    },
    yFrequency: {
        type: ControlType.Number,
        title: "y Frequency",
        defaultValue: 0.01,
        min: 0.0001,
        max: 0.05,
        step: 0.001,
        displayStepper: false,
        hidden(props) {
            return props.typeToggle == "b" || props.typeToggle == "a"
        },
    },
    octaveTurb: {
        type: ControlType.Number,
        title: "Octave",
        defaultValue: 3,
        min: 1,
        max: 5,
        step: 1,
        displayStepper: false,
        hidden(props) {
            return props.typeToggle == "b" || props.typeToggle == "a"
        },
    },
    seedToggle: {
        type: ControlType.Boolean,
        title: "Seed",
        defaultValue: true,
        enabledTitle: "Random",
        disabledTitle: "Manual",
        hidden(props) {
            return props.typeToggle == "b" || props.typeToggle == "a"
        },
    },
    seedTurb: {
        type: ControlType.Number,
        title: "Value",
        defaultValue: 1,
        min: 1,
        max: 1000,
        step: 1,
        displayStepper: false,
        hidden(props) {
            return (
                props.typeToggle == "b" ||
                props.typeToggle == "a" ||
                props.seedToggle === true
            )
        },
    },
    // Perlin rgba table filter options
    redTable: {
        type: ControlType.Array,
        control: {
            type: ControlType.Number,
            title: "Value",
            defaultValue: 0.5,
            min: 0,
            max: 1,
            step: 0.01,
            displayStepper: false,
        },
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 4 ||
                props.effectToggle === 5 ||
                props.effectToggle === 6
            )
        },
        defaultValue: [0, 0.5, 0.25],
        maxCount: 5,
    },
    greenTable: {
        type: ControlType.Array,
        control: {
            type: ControlType.Number,
            title: "Value",
            defaultValue: 0,
            min: 0,
            max: 1,
            step: 0.01,
            displayStepper: false,
        },
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 4 ||
                props.effectToggle === 5 ||
                props.effectToggle === 6
            )
        },
        defaultValue: [0, 0.75, 0.25],
        maxCount: 5,
    },
    blueTable: {
        type: ControlType.Array,
        control: {
            type: ControlType.Number,
            title: "Value",
            defaultValue: 0,
            min: 0,
            max: 1,
            step: 0.01,
            displayStepper: false,
        },
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 4 ||
                props.effectToggle === 5 ||
                props.effectToggle === 6
            )
        },
        defaultValue: [0.25, 0.75, 0],
        maxCount: 5,
    },
    alphaTable: {
        type: ControlType.Array,
        control: {
            type: ControlType.Number,
            title: "Value",
            defaultValue: 1,
            min: 0,
            max: 1,
            step: 0.01,
            displayStepper: false,
        },
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 4 ||
                props.effectToggle === 5 ||
                props.effectToggle === 6
            )
        },
        defaultValue: [1, 1, 1],
        maxCount: 5,
    },
    // Perlin rgba linear filter options
    rgbaSlope: {
        type: ControlType.Array,
        title: "RGBA slope",
        control: {
            type: ControlType.Number,
            defaultValue: 0,
            min: 0,
            max: 10,
            step: 0.01,
            displayStepper: false,
        },
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 2 ||
                props.effectToggle === 3 ||
                props.effectToggle === 5 ||
                props.effectToggle === 6
            )
        },
        defaultValue: [0.5, 0.5, 0.5, 0.5],
        maxCount: 4,
    },
    rgbaIntercept: {
        type: ControlType.Array,
        title: "RGBA intercept",
        control: {
            type: ControlType.Number,
            defaultValue: 0,
            min: 0,
            max: 1,
            step: 0.01,
            displayStepper: false,
        },
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 2 ||
                props.effectToggle === 3 ||
                props.effectToggle === 5 ||
                props.effectToggle === 6
            )
        },
        defaultValue: [0, 0, 0, 0.5],
        maxCount: 4,
    },
    // Perlin rgba linear filter options
    rgbaAmplitude: {
        type: ControlType.Array,
        title: "RGBA amplitude",
        control: {
            type: ControlType.Number,
            defaultValue: 0,
            min: 0,
            max: 1,
            step: 0.01,
            displayStepper: false,
        },
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 2 ||
                props.effectToggle === 3 ||
                props.effectToggle === 4 ||
                props.effectToggle === 6
            )
        },
        defaultValue: [0.5, 0.5, 0.5, 1],
        maxCount: 4,
    },
    rgbaExponent: {
        type: ControlType.Array,
        title: "RGBA exponenet",
        control: {
            type: ControlType.Number,
            defaultValue: 0,
            min: 0,
            max: 1,
            step: 0.01,
            displayStepper: false,
        },
        hidden(props) {
            return (
                props.effectToggle === 1 ||
                props.effectToggle === 2 ||
                props.effectToggle === 3 ||
                props.effectToggle === 4 ||
                props.effectToggle === 6
            )
        },
        defaultValue: [0.5, 0.5, 0.5, 0],
        maxCount: 4,
    },
})

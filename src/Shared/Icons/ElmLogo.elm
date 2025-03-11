module Shared.Icons.ElmLogo exposing (elmLogo)

import Svg exposing (Svg, svg, g, polygon)
import Svg.Attributes exposing 
    ( width
    , height
    , viewBox
    , version
    , preserveAspectRatio
    , fill
    , fillOpacity
    , points
    )
import Html exposing (text)


elmLogo : Svg msg
elmLogo =
    svg
        [ width "15px"
        , height "15px"
        , viewBox "0 0 256 256"
        , version "1.1"
        , preserveAspectRatio "xMidYMid"
        ]
        [ Svg.node "title" [] [ text "Elm" ]
        , g []
            [ polygon
                [ points "8.52852758 256 127.927914 136.600614 247.3273 256"
                , fill "#1293D8"
                ]
                []
            , polygon
                [ points "0 8.67270025 119.399386 128.072086 4.84790665e-14 247.471472"
                , fill "#1293D8"
                ]
                []
            , polygon
                [ fillOpacity "0.75"
                , points "136.594522 0 256 0 256 119.405478"
                , fill "#1293D8"
                ]
                []
            , polygon
                [ points "136.456441 128.072086 191.89187 183.507516 247.3273 128.072086 191.89187 72.6366571"
                , fill "#1293D8"
                ]
                []
            , polygon
                [ fillOpacity "0.75"
                , points "8.52852758 0.144172676 119.399386 0.144172676 171.423404 52.1681909 60.5525458 52.1681909"
                , fill "#1293D8"
                ]
                []
            , polygon
                [ fillOpacity "0.75"
                , points "183.363343 64.1081295 127.927914 119.543559 72.4924844 64.1081295"
                , fill "#1293D8"
                ]
                []
            , polygon
                [ fillOpacity "0.75"
                , points "255.855827 247.471472 200.420398 192.036043 255.855827 136.600614"
                , fill "#1293D8"
                ]
                []
            ]
        ]

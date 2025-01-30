module Views.Console exposing (..)

import Html exposing (Html)
import Html exposing (div, text)
import Html.Attributes exposing (id)
import Time
import Types.ConsoleMessage exposing (ConsoleMessage)

--Conole view
viewConsole : List ConsoleMessage -> Html msg
viewConsole consoleMessages =
    div [ Html.Attributes.class "mt-3 bg-gray-800 text-white p-3 rounded shadow-lg" ]
        [ div
            [ id "consoleContainer"
            , Html.Attributes.class "font-mono text-sm h-24 overflow-y-auto"
            ]
            (consoleMessages
                |> List.map (\msg ->
                    div [ Html.Attributes.class "py-1" ]
                        [ text ("[" ++ formatTime msg.timestamp ++ "] " ++ msg.text) ]
                )
            )
        ]


formatTime : Time.Posix -> String
formatTime posix =
    let
        hh = Time.toHour Time.utc posix + 1
        mm = Time.toMinute Time.utc posix
        ss = Time.toSecond Time.utc posix
        twoDigits n = String.padLeft 2 '0' (String.fromInt n)
    in
    twoDigits hh ++ ":" ++ twoDigits mm ++ ":" ++ twoDigits ss
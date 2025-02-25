module Shared.Components.InputTextArea exposing (..)

import Html exposing (Html, div, textarea, button, text)
import Html.Attributes exposing (class, placeholder, value, disabled, rows, id)
import Html.Events exposing (onInput, onClick)

import Shared.Icons.Trash exposing (heroiconTrash)

inputTextArea : Bool -> String -> ( String -> msg ) -> msg -> Html msg
inputTextArea simStarted inputText onUpdateCode onDeleteInput =
    div [ class "flex flex-col w-1/3 bg-white p-3 shadow-lg rounded relative" ]
        [ textarea
            ( 
            [ 
            id "textbox"
            , class 
                    ( "flex-grow w-full h-full p-2 border rounded resize-none overflow-auto text-lg font-mono "
                        ++ if simStarted then
                            "bg-gray-100 text-gray-700 cursor-not-allowed"
                        else
                            "bg-white text-black"
                    )
            , placeholder "Enter your code here..."
            , onInput onUpdateCode
            , value inputText
            , rows 10
            ]
            ++ (if simStarted then [ disabled True ] else [])
            )
            []
        , if not simStarted then
              button 
                  [ class "absolute bottom-9 right-10 text-gray-500 hover:text-red-500"
                  , onClick onDeleteInput
                  ]
                  [ heroiconTrash ]
          else
              text ""
        ]
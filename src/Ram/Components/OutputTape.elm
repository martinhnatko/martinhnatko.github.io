module Ram.Components.OutputTape exposing (viewOutputTape)

import Ram.Types.Model exposing (Model)
import Ram.Types.Messages exposing (Msg(..))

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)

import String
import Array
import Dict


viewOutputTape : Model -> Html Msg
viewOutputTape model =
    let
        -- Convert the output tape array to a list and keep only the Just values.
        cells : List Int
        cells =
            model.outputTape
                |> Array.toList

    in
    div [ class "flex rounded bg-white space-x-1.5 p-1 lg:space-x-2 lg:p-2 overflow-x-auto" ]
        (if List.isEmpty cells then
            -- Render a placeholder cell that is invisible but takes up the same space
            [ div [ class "w-16 h-16 lg:w-20 lg:h-20 border rounded invisible" ] [] ]
         else
            
            (List.indexedMap
                (\index cell ->
                    renderOutputCell index cell model
                )
                cells
            )            
        )
        
renderOutputCell : Int -> Int -> Model -> Html Msg
renderOutputCell index cell model =
    let
        highlightClass =
            Dict.get index model.highlighted_output_tape
                |> Maybe.withDefault ""

        ( displayValue, bgClass ) =
            ( String.fromInt cell
            , if highlightClass /= "" then
                "flex-none px-1 w-16 h-16 lg:w-20 lg:h-20 border overflow-x-auto rounded text-center flex items-center justify-center font-mono " ++ highlightClass
              else
                "flex-none px-1 w-16 h-16 lg:w-20 lg:h-20 border overflow-x-auto rounded text-center flex items-center justify-center font-mono bg-white"
            )

        inputElement =
            div [ class bgClass ] [ text displayValue ]
    in
    inputElement

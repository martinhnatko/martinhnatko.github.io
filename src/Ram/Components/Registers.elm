module Ram.Components.Registers exposing (..)

import Ram.Types.Messages exposing (Msg(..))
import Ram.Types.Model exposing (Model)

import Html exposing (Html, div, text, h3, p, span)
import Html.Attributes exposing (class)

import Dict

viewRegisters : Model -> Html Msg
viewRegisters model =
    div [class "flex flex-col w-1/3 gap-3"] [
        
        div [class "flex w-full h-full overflow-auto bg-white rounded p-1"] 
            [ div [ class "flex flex-col w-full p-1 rounded overflow-y-auto" ]
                (
                model.registers
                    |> Dict.toList
                    |> List.map
                        (\(regNum, (value, wasUsed)) ->
                            let
                                highlightClass =
                                        Dict.get regNum model.highlighted_registers
                                            |> Maybe.withDefault ""
                            in
                            div
                                [ 
                                class
                                    (
                                    case wasUsed of
                                        Just _ ->
                                            "flex items-center gap-4 p-1 border-b last:border-none font-mono "
                                                ++ highlightClass

                                        Nothing ->
                                            "flex items-center gap-4 p-1 border-b last:border-none font-mono bg-gray-100 rounded" 
                                                ++ highlightClass
                                    )
                                ]
                                [ div 
                                    (
                                    if regNum == 0 then
                                        [ class "text-blue-500 w-8 text-right" ]
                                    else 
                                        [ class "text-gray-500 w-8 text-right" ]
                                    )
                                    [ text (String.fromInt regNum) ]
                                , div [ class "h-5 w-px bg-gray-300" ] []
                                , div [ class "flex-1 text-left font-medium text-gray-900" ]
                                    [ text (String.fromInt value) ]
                                ]
                        )
                    )   
 
            ] 
        
        , div [ class "flex bg-white rounded w-full p-1.5 rounded gap-1.5" ]
            [ 
            -- Card #1: Time Complexity
            div [ class "bg-white w-1/2 p-1 rounded border" ]
                [ h3 [ class "text-md font-semibold mb-1" ] [ text "Time Complexity" ]
                , p [] 
                    [ text "Logarithmic cost: " 
                    , span [ class "text-green-600 font-semibold" ] [ text (model.logTime |> String.fromInt) ]
                    ]
                , p [] 
                    [ text "Uniform cost: "
                    , span [ class "text-green-600 font-semibold" ] [ text (model.executedInstructions |> String.fromInt) ]   
                    ]
                ]
            
            -- Card #2: Space Complexity
            , div [ class "bg-white w-1/2 p-1 rounded border" ]
                [ h3 [ class "text-md font-semibold mb-1" ] [ text "Space Complexity" ]
                , p [] 
                    [ text "Logarithmic cost: " 
                    , span [ class "text-green-600 font-semibold" ] [ text (model.logSpace |> String.fromInt) ]
                    ]
                , p [] 
                    [ text "Uniform cost: " 
                    , span [ class "text-green-600 font-semibold" ] [ text ( 
                                                                            model.registers
                                                                                |> Dict.values
                                                                                |> List.filter (\(_, wasUsed) -> wasUsed /= Nothing)
                                                                                |> List.map Tuple.second
                                                                                |> List.length
                                                                                |> String.fromInt
                                                                            ) 
                                                                    ]
                    ]
                ]
            ]
        
    ]
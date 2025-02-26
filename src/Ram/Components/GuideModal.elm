module Ram.Components.GuideModal exposing (..)

import Html exposing (Html, div, button, text, h2, p,  h3, span, table, thead, tr, th, tbody, td)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

import Shared.Icons.X exposing (heroiconX)

viewGuideModal : msg -> (Int -> msg) -> Html msg
viewGuideModal onToggleGuideModal onLoadSlot =
    div
        [ class "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        ]
        [ div
            [ class "bg-white p-4 rounded shadow-lg relative max-h-[80vh] max-w-4xl overflow-y-auto"
            ]
            [ -- “X” button in the top-right
              button
                [ class "absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                , onClick onToggleGuideModal
                ]
                [ heroiconX ]
            
            
                , h2 [ class "text-xl font-bold mb-4" ] [ text "Random Access Machine Guide" ]
                
                , p []
                    [ text "Random Access Machine (RAM) is a computational model similar to conventional sequential computers. It consists of data memory (implemented as registers) and program memory containing instructions. An input/output unit interfaces with the environment, while an arithmetic-logic and control unit interprets and executes the program." ]
                
                , p []
                    [ text "Comments in the code can be written using the '#' symbol." ]
                        -- span [ class "text-red-500 font-bold" ]
                        -- [ text "Errors " ]are printed to the console below
                
                , p [ class "mt-4" ]
                    [ h3 [ class "text-md font-bold" ] [ text "Operations:" ] ]
                
                , table [ class "min-w-full table-fixed mt-2" ]
                        [ thead []
                            [ tr []
                                [ th [ class "px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" ]
                                    [ text "Instruction" ]
                                , th [ class "px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" ]
                                    [ text "Example" ]
                                , th [ class "px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" ]
                                    [ text "Description" ]
                                ]
                            ]
                        
                        , tbody [ class "bg-white divide-y divide-gray-300" ]
                            
                            [ -- LOAD instruction row
                            tr [ class "bg-blue-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-blue-500 font-bold" ]
                                        [ text "LOAD operand" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "LOAD =10" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Operand is loaded into the accumulator." ]
                                ]
                            
                            , -- STORE instruction row
                            tr [ class "bg-blue-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-blue-500 font-bold" ]
                                        [ text "STORE operand" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "STORE 15" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Content of accumulator is stored into memory." ]
                                ]

                            , -- ADD instruction row
                            tr [ class "bg-blue-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-blue-500 font-bold" ]
                                        [ text "ADD operand" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "ADD *5" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Operand is added to the accumulator." ]
                                ]
                            
                            , -- SUB instruction row
                            tr [ class "bg-blue-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-blue-500 font-bold" ]
                                        [ text "SUB operand" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "SUB =1" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Operand is subtracted from the accumulator." ]
                                ]
                            
                            , -- MUL instruction row
                            tr [ class "bg-blue-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-blue-500 font-bold" ]
                                        [ text "MUL operand" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "MUL 8" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Accumulator is multiplied by the operand." ]
                                ]
                            
                            , -- DIV instruction row
                            tr [ class "bg-blue-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-blue-500 font-bold" ]
                                        [ text "DIV operand" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "DIV =2" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Accumulator is divided by the operand." ]
                                ]
                            
                            , -- READ instruction row
                            tr [ class "bg-blue-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-blue-500 font-bold" ]
                                        [ text "READ operand" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "READ 3" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Value from input tape is stored into operand." ]
                                ]
                            
                            , -- WRITE instruction row
                            tr [ class "bg-blue-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-blue-500 font-bold" ]
                                        [ text "WRITE operand" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "WRITE *20" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Accumulator value is stored on the writing tape." ]
                                ]
                            
                            , -- JUMP instruction row
                            tr [ class "bg-gray-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-gray-500 font-bold" ]
                                        [ text "JUMP label" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "JUMP loop" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Value of the instruction pointer (IP) is set according to the label." ]
                                ]
                            
                            , -- JZERO instruction row
                            tr [ class "bg-gray-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-gray-500 font-bold" ]
                                        [ text "JZERO label" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "JZERO loop" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "If the accumulator is 0, IP is set according to the label." ]
                                ]
                            
                            , -- JGTZ instruction row
                            tr [ class "bg-gray-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-gray-500 font-bold" ]
                                        [ text "JGTZ label" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "JGTZ loop" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "If the accumulator is greater than 0, IP is set according to the label." ]
                                ]

                            , -- HALT instruction row
                            tr [ class "bg-red-50" ]
                                [ td [ class "px-4 py-2 whitespace-normal" ]
                                    [ span [ class "text-red-500 font-bold" ]
                                        [ text "HALT" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-left" ]
                                    [ text "HALT" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Program execution is halted." ]
                                ]
                            ]
                        ]
                , p [ class "mt-4" ]
                    [ h3 [ class "text-md font-bold" ] [ text "Operands:" ] ]

                , table [ class "min-w-full table-fixed mt-2" ]
                        [ thead []
                            [ tr []
                                [ th [ class "px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" ]
                                    [ text "Operand" ]
                                , th [ class "px-8 py-2 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" ]
                                    [ text "Example" ]
                                , th [ class "px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" ]
                                    [ text "Description" ]
                                ]
                            ]
                        , tbody [ class "bg-white divide-y divide-gray-200" ]
                            [ -- Constant addressing row
                            tr []
                                [ td [ class "px-4 py-2 whitespace-normal text-center" ]
                                    [ span [ class "font-bold" ]
                                        [ text "=i" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-center" ]
                                    [ text "ADD =-5" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Constant addressing. In this example, the constant -5 is added to the accumulator." ]
                                ]
                            , -- Direct addressing row
                            tr []
                                [ td [ class "px-4 py-2 whitespace-normal text-center" ]
                                    [ span [ class "font-bold" ]
                                        [ text "i" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-center" ]
                                    [ text "ADD 4" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Direct addressing. The operand is evaluated as the content of register i. In this example, the value from register 4 is added to the accumulator." ]
                                ]
                            , -- Indirect addressing row
                            tr []
                                [ td [ class "px-4 py-2 whitespace-normal text-center" ]
                                    [ span [ class "font-bold" ]
                                        [ text "*i" ]
                                    ]
                                , td [ class "px-4 py-2 whitespace-normal text-center" ]
                                    [ text "ADD *7" ]
                                , td [ class "px-4 py-2 whitespace-normal" ]
                                    [ text "Indirect addressing. The content of register i determines the register whose content is used as the operand. In this example, the value from the register whose index is specified by the content of register 7 is added to the accumulator." ]
                                ]
                            ]
                        ]




                , p [ class "mt-4" ]
                    [ h3 [ class "text-md font-bold" ] [ text "Example codes:" ] ]

                , div [ class "flex flex-row gap-4 mt-2" ] 
                    [
                    
                    
                    div [ class "border p-3 rounded bg-white shadow-sm w-full" ]
                        [ div
                            [ class "font-bold text-gray-700" ]
                            [ text "Example 1: Avg of two numbers" ]

                        , div [ class "flex gap-2 mt-2" ]
                            [
                            -- Load button
                            button
                                [ class "bg-blue-500 text-white px-2 py-1 rounded"
                                , onClick (onLoadSlot 21)
                                ]
                                [ text "Load" ]
                            ]
                        ]

                    , div [ class "border p-3 rounded bg-white shadow-sm w-full" ]
                        [ div
                            [ class "font-bold text-gray-700" ]
                            [ text "Example 2: a^n" ]

                        , div [ class "flex gap-2 mt-2" ]
                            [
                            -- Load button
                            button
                                [ class "bg-blue-500 text-white px-2 py-1 rounded"
                                , onClick (onLoadSlot 22)
                                ]
                                [ text "Load" ]
                            ]
                        ]
                    
                    , div [ class "border p-3 rounded bg-white shadow-sm w-full" ]
                        [ div
                            [ class "font-bold text-gray-700" ]
                            [ text "Example 3: n!" ]

                        , div [ class "flex gap-2 mt-2" ]
                            [
                            -- Load button
                            button
                                [ class "bg-blue-500 text-white px-2 py-1 rounded"
                                , onClick (onLoadSlot 23)
                                ]
                                [ text "Load" ]
                            ]
                        ]

                    ]
            ]
        ]
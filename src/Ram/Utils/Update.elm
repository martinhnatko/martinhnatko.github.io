module Ram.Utils.Update exposing (..)

import Ram.Types.Messages exposing (Msg)
import Ram.Types.Model exposing (Model)
import Ram.Types.Messages exposing (Msg(..))
import Ram.Types.Slot exposing (Slot)

import Ram.Utils.RamParser exposing (parseRAM)
import Ram.Utils.ExecuteInstruction exposing (executeInstruction)
import Ram.Utils.HelperFunctions exposing (encodeSlot, requestAddMessage)
import Ram.Utils.PrintErrors exposing (printErrors)

import Shared.Types.ConsoleMessage exposing (ConsoleMessageType(..))
import Shared.Ports exposing (setItem, scrollToBottom)

import Dict
import List exposing (range)
import Array
import Platform.Cmd as Cmd
import Time
import Task

-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateCode newCode ->
            let
                newInstructions = parseRAM newCode model

                encodedSlot = encodeSlot { name = "", inputText = newCode, inputTape = model.inputTape }
            in
            ( { model | inputText = newCode, instructions = newInstructions}, setItem ("ram_current", encodedSlot) )

        Tick _ ->
            if not model.isRunning then
                (model, Cmd.none)
            else
                let
                    speed = Array.get (model.speedIdx - 1) model.speeds|> Maybe.withDefault 1000

                    -- half the speed in ms
                    highlightDuration = speed // 2

                    ( updatedModel, removalCmd ) = executeInstruction model highlightDuration
                in
                if updatedModel.instructionPointer >= List.length updatedModel.instructions then
                    ( { updatedModel | isRunning = False }, Cmd.batch [removalCmd, Task.perform (ComputeAndPrintDuration False) Time.now] )
                else
                    ( updatedModel, removalCmd )

        
        Step ->
            let
                highlightDuration = 600
                ( newModel, removeHighlightCmd ) = executeInstruction model highlightDuration
            in
            if not model.simStarted && newModel.instructionPointer >= List.length newModel.instructions then
                ( { newModel | simStarted = True }
                , Cmd.batch [printErrors model.instructions, removeHighlightCmd, requestAddMessage (SimStarted, "Simulation started"), Task.perform (ComputeAndPrintDuration False) Time.now, Task.perform SetStartTime Time.now]
                )
            else if not model.simStarted then
                ( { newModel | simStarted = True }
                , Cmd.batch [printErrors model.instructions, removeHighlightCmd, requestAddMessage (SimStarted, "Simulation started"), Task.perform SetStartTime Time.now]
                )
            else if newModel.instructionPointer >= List.length newModel.instructions then
                ( { newModel | isRunning = False }, Cmd.batch [removeHighlightCmd, Task.perform (ComputeAndPrintDuration False) Time.now] )
            
            else if model.simStarted then
                ( newModel, removeHighlightCmd )
            else
                ( model, Cmd.none )


        Start ->
            if model.simStarted then
                -- Already started once, so just set isRunning = True
                ( { model | isRunning = True }, Cmd.none )

            else
                ( { model
                    | isRunning = True
                    , simStarted = True
                }
                , Cmd.batch [ (printErrors model.instructions), requestAddMessage (SimStarted, "Simulation started"), Task.perform SetStartTime Time.now ]
                )

        SetStartTime now ->
            ( { model | simulationStartTime = Just now }, Cmd.none )
        
        ComputeAndPrintDuration byHalting now ->
            case model.simulationStartTime of
                Just startTime ->
                    let
                        duration = Time.posixToMillis now - Time.posixToMillis startTime

                        fromFloatWithDecimals decimals no =
                            (no * (10 ^ decimals))
                                |> round
                                |> toFloat
                                |> (\n -> n / (10 ^ decimals))
                                |> String.fromFloat
                        
                        numOfInstructions = model.executedInstructions
                        speed = fromFloatWithDecimals 2 ((toFloat numOfInstructions) / (toFloat duration * 0.001))
                    in
                    if numOfInstructions == 0 then
                        (
                            { model
                                | simulationStartTime = Nothing
                                , executedInstructions = 0
                            }
                            , requestAddMessage (InfoMessage, "Reached end of instructions. Duration: " ++ String.fromInt duration ++ " ms. Number of executed instructions: " ++ String.fromInt numOfInstructions ++ ".")
                        )
                    else
                        if byHalting then
                            (
                                { model
                                    | simulationStartTime = Nothing
                                    , executedInstructions = 0
                                }
                                , requestAddMessage (InfoMessage, "Program halted. Duration: " ++ String.fromInt duration ++ " ms. Number of executed instructions: " ++ String.fromInt numOfInstructions ++ ". Speed: " ++ speed ++ " instructions/second.")
                            )
                        else
                            (
                                { model
                                    | simulationStartTime = Nothing
                                    , executedInstructions = 0
                                }
                                , requestAddMessage (InfoMessage, "Reached end of instructions. Duration: " ++ String.fromInt duration ++ " ms. Number of executed instructions: " ++ String.fromInt numOfInstructions ++ ". Speed: " ++ speed ++ " instructions/second.")
                            )


                Nothing ->
                    ( model, Cmd.none )

        Pause ->
            ( 
                {
                model
                    | isRunning = False
                    , highlighted_input_tape = Dict.empty
                    , highlighted_registers = Dict.empty
                    , highlighted_output_tape = Dict.empty
                }
                , Cmd.none 
            )

        Reset ->
            ( { model
                | isRunning = False
                , simStarted = False
                , instructionPointer = 0
                , registers = Dict.fromList (List.map (\n -> (n,0)) (range 0 100))
                , halted = False
                , inputTapePointer = 0
                , outputTape = Array.empty
                , highlighted_input_tape = Dict.empty
                , highlighted_registers = Dict.empty
                , highlighted_output_tape = Dict.empty
                , simulationStartTime = Nothing
                , executedInstructions = 0
              }
            , requestAddMessage (SimStopped, "Simulation stopped")
            )
                

        
        ChangeSpeed newSpeed ->
            ( { model | speedIdx = newSpeed }, Cmd.none )
        
        RemoveHighlightFromRegisters reg ->
            let
                newHighlighted =
                    Dict.remove reg model.highlighted_registers
            in
            ( { model | highlighted_registers = newHighlighted }, Cmd.none )
        
        RemoveHighlightFromInputTape idx ->
            let
                newHighlighted =
                    Dict.remove idx model.highlighted_input_tape
            in
            ( { model | highlighted_input_tape = newHighlighted }, Cmd.none )

        RemoveHighlightFromOutputTape idx ->
            let
                newHighlighted =
                    Dict.remove idx model.highlighted_output_tape
            in
            ( { model | highlighted_output_tape = newHighlighted }, Cmd.none )
        
        SwitchHighlight (typeSource, source) (typeDest, dest, style) ->
            let 
                newHighlightedInputTape =
                    if typeSource == 0 then
                        Dict.remove source model.highlighted_input_tape
                    else
                        model.highlighted_input_tape

                newHighlightedRegisters =
                    if typeSource == 1 then
                        Dict.remove source model.highlighted_registers
                    else
                        model.highlighted_registers

                newHighlightedOutputTape =
                    if typeSource == 2 then
                        Dict.remove source model.highlighted_output_tape
                    else
                        model.highlighted_output_tape

                finalHighlightedInputTape =
                    if typeDest == 0 then
                        Dict.insert dest style newHighlightedInputTape
                    else
                        newHighlightedInputTape
                
                finalHighlightedRegisters =
                    if typeDest == 1 then
                        Dict.insert dest style newHighlightedRegisters
                    else
                        newHighlightedRegisters
                
                finalHighlightedOutputTape =
                    if typeDest == 2 then
                        Dict.insert dest style newHighlightedOutputTape
                    else
                        newHighlightedOutputTape

            in
            ( { model 
                | highlighted_registers = finalHighlightedRegisters
                , highlighted_input_tape = finalHighlightedInputTape
                , highlighted_output_tape = finalHighlightedOutputTape
              }
              , Cmd.none
            )

        AddMessageWithTime messageType posix text ->
            let
                newConsoleMessage =
                    { messageType = messageType
                    , timestamp = posix
                    , text = text
                    }

                updatedModel =
                    { model
                        | consoleMessages =
                            model.consoleMessages ++ [ newConsoleMessage ]
                    }
            in
            -- After adding the message, scroll to bottom
            ( updatedModel, scrollToBottom "consoleContainer" )
        
        DeleteInput ->
            ( { model
                | isRunning = False
                , inputText = ""
                , simStarted = False
                , instructionPointer = 0
                , registers = Dict.fromList (List.map (\n -> (n,0)) (range 0 100))
                , instructions = []
              }
            , setItem ("ram_current", "")
            )

        SaveSlot i ->
            case Array.get i model.slots of
                Just slot ->
                    let
                        updatedSlot = { slot | inputText = model.inputText, inputTape = model.inputTape }
                        encodedSlot = encodeSlot updatedSlot

                    in
                    ( 
                    { model | slots = Array.set i updatedSlot model.slots } 
                    , Cmd.batch [ setItem ("ram_slot_" ++ String.fromInt i, encodedSlot), requestAddMessage (InfoMessage, "Current code saved to slot "  ++ String.fromInt i ++ "." ) ]
                    )
                    
                Nothing ->
                    ( model, Cmd.none )

        DeleteSlot i ->
            case Array.get i model.slots of
                Just slot ->
                    let
                        updatedSlot = { slot | inputText = "", inputTape = Array.empty }
                        encodedSlot = encodeSlot updatedSlot
                    in
                    (
                    { model | slots = Array.set i updatedSlot model.slots }
                    , Cmd.batch [ setItem ("ram_slot_" ++ String.fromInt i, encodedSlot), requestAddMessage (InfoMessage, "Slot " ++ String.fromInt i ++ " deleted.") ]
                    )

                Nothing ->
                    ( model, Cmd.none )

        LoadSlot i ->
            case Array.get i model.slots of
                Just slot ->
                    ( { model 
                        | inputText = slot.inputText
                        , instructions = parseRAM slot.inputText model
                        , inputTape = slot.inputTape
                        , inputTapePointer = 0
                        , instructionPointer = 0
                        , registers = Dict.fromList (List.map (\n -> (n,0)) (range 0 100))
                        , halted = False
                        , highlighted_input_tape = Dict.empty
                        , highlighted_registers = Dict.empty
                        , highlighted_output_tape = Dict.empty
                        , simStarted = False
                        , isRunning = False
                        , outputTape = Array.empty
                        , simulationStartTime = Nothing
                        , executedInstructions = 0
                        }
                    , Cmd.batch [ setItem ("ram_current", { name = "", inputText = slot.inputText, inputTape = slot.inputTape } |> encodeSlot ), requestAddMessage (InfoMessage, "Slot " ++ String.fromInt i ++ " loaded.") ]
                    )

                _ ->
                    (model, Cmd.none)
        
        ToggleSlotsModal ->
            ( { model | showSlotsModal = not model.showSlotsModal }, Cmd.none )
        
        UpdateInputTape idx value ->
            let
                updatedTape = Array.set idx value model.inputTape
            in
            ( { model | inputTape = updatedTape }
            , setItem ("ram_current", { name = "", inputText = model.inputText, inputTape = updatedTape } |> encodeSlot)
            )
        
        AddCellToInputTape ->
            let
                updatedTape = Array.push 0 model.inputTape
            in
            ( { model | inputTape = updatedTape }
            , setItem ("ram_current", { name = "", inputText = model.inputText, inputTape = updatedTape } |> encodeSlot)
            )
        
        RemoveLastCell ->
            let
                len = Array.length model.inputTape
            in
            if len > 0 then
                let
                    updatedTape = Array.slice 0 (len - 1) model.inputTape
                in
                ( { model | inputTape = updatedTape }
                , setItem ("ram_current", { name = "", inputText = model.inputText, inputTape = updatedTape } |> encodeSlot)
                ) 
            else
                ( model, Cmd.none )
        
        GoBackToMenu ->
            ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )
        
        UpdateSlotName i newName ->
            case Array.get i model.slots of
                Just slot ->
                    let
                        updatedSlot : Slot
                        updatedSlot = { slot | name = newName }
                        
                        encodedSlot = encodeSlot updatedSlot
                    in
                    ( { model | slots = Array.set i updatedSlot model.slots }, setItem ("ram_slot_" ++ String.fromInt i, encodedSlot) )

                Nothing ->
                    ( model, Cmd.none )
        
        ToggleGuideModal ->
            ( { model | showGuideModal = not model.showGuideModal }, Cmd.none )
            
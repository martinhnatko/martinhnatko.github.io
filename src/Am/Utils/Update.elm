module Am.Utils.Update exposing (..)

import Am.Types.Messages exposing (Msg)
import Am.Types.Model exposing (Model)
import Am.Types.Messages exposing (Msg(..))
import Am.Types.Slot exposing (Slot)

import Am.Utils.AbacusParser exposing (parseAM)
import Am.Utils.ExecuteInstruction exposing (executeInstruction)
import Am.Utils.HelperFunctions exposing (encodeSlot, requestAddMessage)
import Am.Utils.PrintErrors exposing (printErrors)

import Shared.Ports exposing (setItem, scrollToBottom)
import Shared.Types.ConsoleMessage exposing (ConsoleMessageType(..))

import Dict
import List exposing (range)
import Array
import Platform.Cmd as Cmd
import Time
import Maybe
import Task

-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateCode newCode ->
            let
                newInstructions = parseAM newCode model

                encodedSlot = encodeSlot { name = "", inputText = newCode }
            in
            ( { model | inputText = newCode, instructions = newInstructions}, setItem ("am_current", encodedSlot) )

        Tick _ ->
            if not model.isRunning then
                (model, Cmd.none)
            else
                let
                    speed = (Array.get (model.speedIdx - 1) model.speeds) |> Maybe.withDefault 1000

                    -- half the speed in ms
                    highlightDuration = speed // 2

                    ( updatedModel, removalCmd ) = executeInstruction model highlightDuration
                in
                if updatedModel.instructionPointer >= List.length updatedModel.instructions then
                    ( { updatedModel | isRunning = False }, Cmd.batch [removalCmd, Task.perform ComputeAndPrintDuration Time.now] )
                else
                    ( updatedModel, removalCmd )

        Step ->
            let
                highlightDuration = 350
                ( newModel, removeHighlightCmd ) = executeInstruction model highlightDuration
            in
            if not model.simStarted && newModel.instructionPointer >= List.length newModel.instructions then
                ( { newModel | simStarted = True }
                , Cmd.batch [printErrors model.instructions, removeHighlightCmd, requestAddMessage (SimStarted, "Simulation started"), Task.perform ComputeAndPrintDuration Time.now,  Task.perform SetStartTime Time.now]
                )
            else if not model.simStarted then
                ( { newModel | simStarted = True }
                , Cmd.batch [printErrors model.instructions, removeHighlightCmd, requestAddMessage (SimStarted, "Simulation started"), Task.perform SetStartTime Time.now]
                )
            else if newModel.instructionPointer >= List.length newModel.instructions then
                ( { newModel | isRunning = False }, Cmd.batch [removeHighlightCmd, Task.perform ComputeAndPrintDuration Time.now] )
            
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
                , Cmd.batch [printErrors model.instructions, requestAddMessage (SimStarted, "Simulation started"), Task.perform SetStartTime Time.now]
                )
        
        SetStartTime now ->
            ( { model | simulationStartTime = Just now }, Cmd.none )
        
        ComputeAndPrintDuration now ->
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
                    , highlighted = Dict.empty 
                }
                , Cmd.none
            )

        Reset ->
            ( { model
                | isRunning = False
                , simStarted = False
                , instructionPointer = 0
                , registers = Dict.fromList (List.map (\n -> (n,0)) (range 0 100))
                , highlighted = Dict.empty
                , simulationStartTime = Nothing
                , executedInstructions = 0
              }
            , requestAddMessage (SimStopped, "Simulation stopped")
            )

        ChangeSpeed newSpeed ->
            ( { model | speedIdx = newSpeed }, Cmd.none )
        
        RemoveHighlight reg ->
            let
                newHighlighted =
                    Dict.remove reg model.highlighted
            in
            ( { model | highlighted = newHighlighted }, Cmd.none )

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
            , setItem ("am_current", { name = "", inputText = "" } |> encodeSlot)
            )

        SaveSlot i ->
            case Array.get i model.slots of
                Just slot ->
                    let
                        updatedSlot = { slot | inputText = model.inputText }
                        encodedSlot = encodeSlot updatedSlot
                    in
                    ( { model | slots = Array.set i updatedSlot model.slots }
                    , Cmd.batch [ setItem ("am_slot_" ++ String.fromInt i, encodedSlot), requestAddMessage (InfoMessage, "Current code saved to slot " ++ String.fromInt i ++ ".") ]
                    )

                Nothing ->
                    ( model, Cmd.none )

        DeleteSlot i ->
            case Array.get i model.slots of
                Just slot ->
                    let
                        updatedSlot = { slot | inputText = "" }
                        encodedSlot = encodeSlot updatedSlot
                    in
                    ( { model | slots = Array.set i updatedSlot model.slots }
                    , Cmd.batch [ setItem ("am_slot_" ++ String.fromInt i, encodedSlot), requestAddMessage (InfoMessage, "Slot " ++ String.fromInt i ++ " deleted.") ]
                    )
                
                _ ->
                    ( model, Cmd.none )

        LoadSlot i ->
            case Array.get i model.slots of
                Just slot ->
                    ( { model 
                        | inputText = slot.inputText
                        , instructions = parseAM slot.inputText model
                        , isRunning = False
                        , simStarted = False
                        , instructionPointer = 0
                        , registers = Dict.fromList (List.map (\n -> (n,0)) (range 0 100))
                        , highlighted = Dict.empty
                        , simulationStartTime = Nothing
                        , executedInstructions = 0
                    }
                    , (
                        if i == 21 then
                            Cmd.batch [ setItem ("am_current", { name = "", inputText = slot.inputText } |> encodeSlot), requestAddMessage (InfoMessage, "Example 1 loaded." ) ]
                        else if i == 22 then 
                            Cmd.batch [ setItem ("am_current", { name = "", inputText = slot.inputText } |> encodeSlot), requestAddMessage (InfoMessage, "Example 2 loaded." ) ]
                        else if i == 23 then
                            Cmd.batch [ setItem ("am_current", { name = "", inputText = slot.inputText } |> encodeSlot), requestAddMessage (InfoMessage, "Example 3 loaded." ) ]
                        else
                            Cmd.batch [ setItem ("am_current", { name = "", inputText = slot.inputText } |> encodeSlot), requestAddMessage (InfoMessage, "Slot " ++ String.fromInt i ++ " loaded.") ])
                    )
                
                Nothing ->
                    ( model, Cmd.none )
        
        UpdateSlotName i newName ->
            case Array.get i model.slots of
                Just slot ->
                    let
                        updatedSlot : Slot
                        updatedSlot = { slot | name = newName }
                        
                        encodedSlot = encodeSlot updatedSlot
                    in
                    ( { model | slots = Array.set i updatedSlot model.slots }, setItem ("am_slot_" ++ String.fromInt i, encodedSlot) )

                Nothing ->
                    ( model, Cmd.none )
        
        ToggleSlotsModal ->
            ( { model | showSlotsModal = not model.showSlotsModal }, Cmd.none )
        
        ToggleGuideModal ->
            ( { model | showGuideModal = not model.showGuideModal }, Cmd.none )
        
        GoBackToMenu ->
            ( model, Cmd.none )
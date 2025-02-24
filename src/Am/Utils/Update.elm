module Am.Utils.Update exposing (..)

import Am.Types.Messages exposing (Msg)
import Am.Types.Model exposing (Model)
import Am.Types.Messages exposing (Msg(..))
import Am.Types.Slot exposing (Slot)

import Am.Utils.AbacusParser exposing (..)
import Am.Utils.ExecuteInstruction exposing (executeInstruction)
import Am.Utils.HelperFunctions exposing (..)
import Am.Utils.PrintErrors exposing (printErrors)

import Shared.Ports exposing (setItem, scrollToBottom)
import Shared.Types.ConsoleMessage exposing (ConsoleMessageType(..))

import Dict
import List exposing (range)
import Array
import Platform.Cmd as Cmd

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
                    defaultSpeed = 1000
                    speed =
                        Array.get (model.speedIdx - 1) model.speeds
                            |> Maybe.withDefault defaultSpeed

                    -- half the speed in ms
                    highlightDuration =
                        speed // 2

                    ( updatedModel, removalCmd ) =
                        executeInstruction model highlightDuration
                in
                ( updatedModel, removalCmd )


        Start ->
            if model.simStarted then
                -- Already started once, so just set isRunning = True
                ( { model | isRunning = True }, Cmd.none )

            else
                ( { model
                    | isRunning = True
                    , simStarted = True
                }
                , Cmd.batch [printErrors model.instructions, requestAddMessage (SimStarted, "Simulation started")]
                )

        Pause ->
            ( { model | isRunning = False }, Cmd.none )

        Reset ->
            ( { model
                | isRunning = False
                , simStarted = False
                , instructionPointer = 0
                , registers = Dict.fromList (List.map (\n -> (n,0)) (range 0 100))
                , highlighted = Dict.empty
              }
            , requestAddMessage (SimStopped, "Simulation stopped")
            )

        Step ->
            let
                highlightDuration = 350
                ( newModel, removeHighlightCmd ) =
                    executeInstruction model highlightDuration
            in
            if model.simStarted then
                ( newModel, removeHighlightCmd )
            else
                ( { newModel
                        | simStarted = True 
                    }
                , Cmd.batch [printErrors model.instructions, removeHighlightCmd, requestAddMessage (SimStarted, "Simulation started")] )
        
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
                    ( { model | slots = Array.set i updatedSlot model.slots }, setItem ("am_slot_" ++ String.fromInt i, encodedSlot) )

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
                    , setItem ("am_slot_" ++ String.fromInt i, encodedSlot) 
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
                    }
                    , setItem ("am_current", { name = "", inputText = slot.inputText } |> encodeSlot) 
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
        
        GoBackToMenu ->
            ( model, Cmd.none )
module Am.Types.Model exposing (..)

import Am.Types.Instructions exposing (Instruction)
import Am.Types.Slot exposing (Slot)

import Shared.Types.ConsoleMessage exposing (ConsoleMessage)

import Dict exposing (Dict)
import Array exposing (Array)
import Time exposing (Posix)

-- MODEL
type alias Model =
    { inputText : String
    , registers : Dict Int Int
    , highlighted : Dict Int String
    , instructions : List Instruction
    , isRunning : Bool
    , simStarted : Bool
    , instructionPointer : Int
    , speeds : Array Int
    , speedIdx : Int
    , consoleMessages : List ConsoleMessage
    , slots : Array Slot
    , showSlotsModal : Bool
    , showGuideModal : Bool
    , simulationStartTime : Maybe Posix
    , executedInstructions : Int
    }
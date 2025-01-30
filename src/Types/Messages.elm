module Types.Messages exposing (..)
import Time

-- MESSAGES
type Msg
    = UpdateCode String
    | Start
    | Tick Time.Posix
    | Pause
    | Reset
    | Step
    | ChangeSpeed Int
    | RemoveHighlight Int
    | RequestAddMessage String  -- Ask for a new console message with the current time
    | AddMessageWithTime Time.Posix String  -- Add a new console message with a given time
    | DeleteInput
    | GotItem (String, Maybe String)
    | SaveSlot Int
    | LoadSlot Int
    | ToggleSlotsModal
    | DeleteSlot Int
module Types.Instructions exposing (..)

type Instruction
    = Increment Int
    | Decrement Int
    | StartLoop Int Int
    | EndLoop Int Int 
    | UnknownInstruction
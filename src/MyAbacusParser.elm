module MyAbacusParser exposing (..)

import Char exposing (isDigit)
import List exposing (drop)
import Maybe


-- INSTRUCTIONS

type Instruction
    = Increment Int
    | Decrement Int
    | StartLoop Int Int
    | EndLoop Int Int 
    | UnknownInstruction


-- PARSE INSTRUCTIONS

type alias LoopStack =
    List Int -- StartLoop index


parseInstructions : List Instruction -> LoopStack -> Int -> List Char -> List Instruction
parseInstructions instructions stack currentIndex input =
    case input of
        [] ->
            -- If stack is non-empty, map all unmatched StartLoops to UnknownInstruction
            if List.isEmpty stack then
                instructions
            else
                instructions
                    |> List.map (\instr ->
                        case instr of
                            StartLoop endLoopIndex conditionIndex ->
                                if endLoopIndex == -1 && conditionIndex == -1 then
                                    UnknownInstruction
                                else
                                    instr
                            other ->
                                other
                    )

        'a' :: rest ->
            let
                digits = getFirstDigits rest
                remaining = drop (List.length digits) rest
                value = Maybe.withDefault 0 (String.fromList digits |> String.toInt)
                newInstruction = Increment value
            in
            parseInstructions (instructions ++ [newInstruction]) stack (currentIndex + 1) remaining

        's' :: rest ->
            let
                digits = getFirstDigits rest
                remaining = drop (List.length digits) rest
                value = Maybe.withDefault 0 (String.fromList digits |> String.toInt)
                newInstruction = Decrement value
            in
            parseInstructions (instructions ++ [newInstruction]) stack (currentIndex + 1) remaining

        '(' :: rest ->
            -- Parse StartLoop, condition is parsed after ')'
            parseInstructions (instructions ++ [StartLoop -1 -1]) (currentIndex :: stack) (currentIndex + 1) rest

        ')' :: rest ->
            let
                digits = getFirstDigits rest
                remaining = drop (List.length digits) rest
                conditionIndex = Maybe.withDefault 0 (String.fromList digits |> String.toInt)
            in
            case stack of
                [] ->
                    parseInstructions (instructions ++ [UnknownInstruction]) stack (currentIndex + 1) rest

                startLoopIndex :: remainingStack ->
                    let
                        endInstruction = EndLoop startLoopIndex conditionIndex
                        updatedInstructions =
                            List.indexedMap
                                (\i instr ->
                                    case instr of
                                        StartLoop _ _ ->
                                            if i == startLoopIndex then
                                                StartLoop currentIndex conditionIndex
                                            else
                                                instr

                                        _ ->
                                            instr
                                )
                                instructions
                    in
                    parseInstructions (updatedInstructions ++ [endInstruction]) remainingStack (currentIndex + 1) remaining

        c :: rest ->
            if isWhitespace c then
                parseInstructions instructions stack currentIndex rest
            else
                parseInstructions (instructions ++ [UnknownInstruction]) stack (currentIndex + 1) rest


-- HELPER FUNCTION

getFirstDigits : List Char -> List Char
getFirstDigits chars =
    case chars of
        [] ->
            []

        c :: rest ->
            if isDigit c then
                c :: getFirstDigits rest
            else
                []


isWhitespace : Char -> Bool
isWhitespace c =
    c == ' ' || c == '\t' || c == '\n' || c == '\r'
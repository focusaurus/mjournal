module Events
    exposing
        ( onBlurEditable
        , onDownArrow
        , onEdit
        , onEnter
        , onShiftEnter
        , onKeyDown
        , onUpArrow
        , keyCodes
        )

import Html exposing (Attribute)
import Html.Events exposing (keyCode, on, onWithOptions, targetValue)
import Json.Decode as JD
import Messages exposing (Msg)


-- import Model exposing (KeyModified)


keyCodes : { enter : Int, down : Int, up : Int, escape : Int }
keyCodes =
    { enter = 13
    , down = 40
    , up = 38
    , escape = 27
    }


onKeyCode : Int -> Msg -> Attribute Msg
onKeyCode code msg =
    -- filter "keydown" events for a specific key code
    on "keydown" <|
        JD.map
            (always msg)
            (keyCode |> JD.andThen (isKeyCode code))


onEnter : Msg -> Attribute Msg
onEnter =
    onKeyCode keyCodes.enter


onDownArrow : Msg -> Attribute Msg
onDownArrow =
    onKeyCode keyCodes.down


onUpArrow : Msg -> Attribute Msg
onUpArrow =
    onKeyCode keyCodes.up


onKeyDown msg =
    on "keydown" <|
        JD.map msg keyCode



-- (always msg)
-- (keyCode)
-- the event has a keyCode and target.value
-- if keyCode is 13, decode to target.value,
-- otherwise, fail to decode
-- onEnterValue : Msg -> Attribute String
-- onEnterValue tagger =
--     on "keydown" <|
--         isEnter


isKeyCode : Int -> Int -> JD.Decoder ()
isKeyCode want code =
    if code == want then
        JD.succeed ()
    else
        JD.fail "not the right key code"



-- isShiftEnter : Bool -> Int -> JD.Decoder ()
-- isShiftEnter shiftKey keyCode =
--     if shiftKey && keyCode == 13 then
--         JD.succeed ()
--     else
--         JD.fail "Not shift-ENTER"


shiftKey : JD.Decoder Bool
shiftKey =
    JD.field "shiftKey" JD.bool


isShift : Bool -> JD.Decoder ()
isShift shiftKey =
    if shiftKey then
        JD.succeed ()
    else
        JD.fail "Not shift key"


onShiftEnter : (String -> Msg) -> Attribute Msg
onShiftEnter tagger =
    onWithOptions "keydown" { preventDefault = True, stopPropagation = False } <|
        JD.map3
            (\c s t -> (tagger t))
            (keyCode |> JD.andThen (isKeyCode keyCodes.enter))
            (shiftKey |> JD.andThen isShift)
            innerTextDecoder


onBlurEditable : (String -> msg) -> Attribute msg
onBlurEditable tagger =
    on "blur" (JD.map tagger innerTextDecoder)


innerTextDecoder : JD.Decoder String
innerTextDecoder =
    JD.at [ "target", "innerText" ] JD.string


onEdit : (String -> value) -> Attribute value
onEdit tagger =
    on "input" (JD.map tagger innerTextDecoder)

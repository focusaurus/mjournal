module Events exposing (onEnter, onBlurEditable, onShiftEnter)

import Html exposing (Attribute)
import Html.Events exposing (keyCode, on, onWithOptions)
import Json.Decode as JD
import Messages exposing (Msg)


-- import Model exposing (KeyModified)


onEnter : Msg -> Attribute Msg
onEnter msg =
    -- filter "keydown" events for return key (code 13)
    on "keydown" <|
        JD.map
            (always msg)
            (keyCode |> JD.andThen isEnter)


isEnter : Int -> JD.Decoder ()
isEnter code =
    if code == 13 then
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
            (keyCode |> JD.andThen isEnter)
            (shiftKey |> JD.andThen isShift)
            targetText


targetText : JD.Decoder String
targetText =
    (JD.at [ "target", "textContent" ] JD.string)


onBlurEditable : (String -> msg) -> Attribute msg
onBlurEditable tagger =
    on "blur" (JD.map tagger targetText)
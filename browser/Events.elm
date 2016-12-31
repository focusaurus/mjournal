module Events exposing (onEnter, onBlurEditable, onShiftEnter, onEdit)

import Html exposing (Attribute)
import Html.Events exposing (keyCode, on, onWithOptions, targetValue)
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

-- the event has a keyCode and target.value
-- if keyCode is 13, decode to target.value,
-- otherwise, fail to decode
-- onEnterValue : Msg -> Attribute String
-- onEnterValue tagger =
--     on "keydown" <|
--         isEnter


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

textContentDecoder : JD.Decoder String
textContentDecoder =
  JD.at ["target", "textContent"] JD.string

onEdit : (String -> value) -> Attribute value
onEdit tagger =
    on "input" (JD.map tagger textContentDecoder)

module Lab.ContentEditable exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (on, onInput, onClick, onWithOptions, keyCode)
import Json.Decode as JD


type Msg
    = SetText String
    | Clear


type alias Model =
    { startText : String
    , dbText : String
    }


isEnter : Int -> JD.Decoder ()
isEnter code =
    if code == 13 then
        JD.succeed ()
    else
        JD.fail "not the right key code"


shiftKey : JD.Decoder Bool
shiftKey =
    JD.field "shiftKey" JD.bool


isShift : Bool -> JD.Decoder ()
isShift shiftKey =
    if shiftKey then
        JD.succeed ()
    else
        JD.fail "Not shift key"

--
-- textContentDecoder : JD.Decoder String
-- textContentDecoder =
--     JD.at [ "target", "textContent" ] JD.string

onShiftEnter : (String -> Msg) -> Attribute Msg
onShiftEnter tagger =
    onWithOptions "keydown" { preventDefault = True, stopPropagation = False } <|
        JD.map3
            (\c s t -> (tagger t))
            (keyCode |> JD.andThen isEnter)
            (shiftKey |> JD.andThen isShift)
            innerTextDecoder

innerTextDecoder : JD.Decoder String
innerTextDecoder =
    JD.at [ "target", "innerText" ] JD.string


onBlurEditable : (String -> msg) -> Attribute msg
onBlurEditable tagger =
    on "blur" (JD.map tagger innerTextDecoder)


onEdit : (String -> value) -> Attribute value
onEdit tagger =
    on "input" (JD.map tagger innerTextDecoder)


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        SetText text ->
            let
                _ =
                    Debug.log "SetText" text
            in
                ( { model | dbText = text }, Cmd.none )

        Clear ->
            ( { model | dbText = "" }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div []
        [ h1 []
            [ text "Content Editable Drops Newlines"
            , p [] [ text "Edit the div below. Put some newlines. They will not be in the String in the model." ]
            ]
        , div
            [ contenteditable True
              -- , onEdit SetText
            , onBlurEditable SetText
            , onShiftEnter SetText
            ]
            [ text model.startText ]
        , div
            [ style
                [ ( "white-space", "pre-line" )
                , ( "border", "1px solid green" )
                , ( "margin-top", "3em" )
                ]
            ]
            [ text model.dbText ]
        , button [ onClick Clear ] [ text "Clear" ]
        ]


init : ( Model, Cmd Msg )
init =
    ( Model "1" "1", Cmd.none )


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

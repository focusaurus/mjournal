module Lab.Delay exposing (main)

import Html exposing (..)
import Html.Events exposing (onClick)
import Process
import Time
import Task


type Msg
    = Delay
    | Done


type alias Model =
    { word : String
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        Delay ->
            ( model
            , Process.sleep (Time.second * 2)
                |> Task.perform (always Done)
            )

        Done ->
            ( { model | word = "Done" }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div []
        [ h1 []
            [ text "Delay"
            ]
        , p [] [ text model.word ]
        , button [ onClick Delay ] [ text "Delay" ]
        ]


init : ( Model, Cmd Msg )
init =
    ( Model "start", Cmd.none )


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

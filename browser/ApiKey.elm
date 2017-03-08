module ApiKey exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http
import Json.Decode as JD


type Msg
    = GetApiKey
    | GetApiKeyDone (Result Http.Error ApiKey)


type alias ApiKey =
    { key : String
    }


apiKey : JD.Decoder ApiKey
apiKey =
    JD.map ApiKey (JD.field "key" JD.string)


type alias Model =
    { error : String
    , apiKey : Maybe ApiKey
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        GetApiKey ->
            ( { model | error = "" }
            , Http.post "/api/users/key" Http.emptyBody apiKey
                |> Http.send GetApiKeyDone
            )

        GetApiKeyDone (Err err) ->
            let
                defaultError =
                    "Error getting API Key. "

                networkError =
                    "Network error. Try again later."
            in
                case err of
                    Http.Timeout ->
                        ( { model | error = networkError }, Cmd.none )

                    Http.NetworkError ->
                        ( { model | error = networkError }, Cmd.none )

                    Http.BadStatus res ->
                        ( { model | error = defaultError ++ res.status.message }, Cmd.none )

                    Http.BadPayload message res ->
                        ( { model | error = defaultError ++ message }, Cmd.none )

                    _ ->
                        ( { model | error = "oops" }, Cmd.none )

        GetApiKeyDone (Ok key) ->
            ( { model | apiKey = Just key, error = "" }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div []
        [ p [ class "error" ] [ text model.error ]
        , case model.apiKey of
            Nothing ->
                button [ onClick GetApiKey ] [ text "Get API Key" ]

            Just key ->
                p [] [ text ("Your API Key is: " ++ key.key) ]
        ]


init : ( Model, Cmd Msg )
init =
    ( Model "" Nothing, Cmd.none )


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

module Lab.ContentEditable exposing (main)

import Html exposing (..)
import RemoteData as RD
import Json.Decode as JD
import Http


-- import Html.Attributes exposing (..)

import Html.Events exposing (on, onInput, onClick, onWithOptions, keyCode)


type alias Joke =
    { text : String
    , id : Int
    }



-- http://api.icndb.com/jokes/random/3


type Msg
    = LoadMore
    | JokesDone (RD.WebData (List Joke))


type alias Model =
    { jokes : RD.WebData (List Joke)
    , nextJokes : RD.WebData (List Joke)
    }


decodeJokes : JD.Decoder (List Joke)
decodeJokes =
    JD.field "value" (JD.list decodeJoke)


decodeJoke : JD.Decoder Joke
decodeJoke =
    JD.map2 Joke
        (JD.field "joke" JD.string)
        (JD.field "id" JD.int)


jokesHtml jokes =
    div [] (List.map jokeHtml jokes)


jokeHtml joke =
    p [] [ text joke.text ]


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        LoadMore ->
            ( model
            , Http.get "http://api.icndb.com/jokes/random/10" decodeJokes
                |> RD.sendRequest
                |> Cmd.map JokesDone
            )

        JokesDone jokes ->
            ( { model | jokes = jokes }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "WebData Pagination" ]
        , case model.jokes of
            RD.NotAsked ->
                div [] [ text "Not Asked" ]

            RD.Loading ->
                p [] [ text "Loading" ]

            RD.Failure x ->
                let
                    message =
                        case x of
                            Http.BadUrl x ->
                                "BadUrl"

                            Http.Timeout ->
                                "Timeout"

                            Http.NetworkError ->
                                "NetworkError"

                            Http.BadStatus mes ->
                                "BadStatus"

                            Http.BadPayload s r ->
                                "BadPayload" ++ s
                in
                    p [] [ text ("Failure" ++ message) ]

            RD.Success jokes ->
                jokesHtml jokes
        , button [ onClick LoadMore ] [ text "MOAR JOAKS" ]
        ]


init : ( Model, Cmd Msg )
init =
    ( Model RD.NotAsked RD.NotAsked, Cmd.none )


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

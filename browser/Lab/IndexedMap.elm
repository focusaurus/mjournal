module Lab.ContentEditable exposing (main)

import Html exposing (..)


-- import Html.Attributes exposing (..)

import Html.Events exposing (on, onInput, onClick, onWithOptions, keyCode)


type Msg
    = Next
    | Previous


type alias Model =
    { tagSuggestions : List String
    , selectedIndex : Int
    }


isSelected selectedIndex index tag =
    ( selectedIndex == index, tag )


suggestionsHtml model =
    let
        boolTag =
            List.indexedMap (isSelected model.selectedIndex) model.tagSuggestions
    in
        div [] (List.map suggestionHtml boolTag)


suggestionHtml boolTag =
    let
        selected =
            Tuple.first boolTag

        tag =
            Tuple.second boolTag
    in
        div []
            [ text
                (tag
                    ++ if selected then
                        " *"
                       else
                        ""
                )
            ]


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        Next ->
            let
                max =
                    List.length model.tagSuggestions - 1

                index =
                    if model.selectedIndex >= max then
                        max
                    else
                        model.selectedIndex + 1
            in
                ( { model | selectedIndex = index }, Cmd.none )

        Previous ->
            let
                index =
                    if model.selectedIndex < 1 then
                        0
                    else
                        model.selectedIndex - 1
            in
                ( { model | selectedIndex = index }, Cmd.none )

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div []
        [ h1 []
            [ text "List.indexedMap"
            ]
        , suggestionsHtml model
        , button [ onClick Next ] [ text "Next" ]
        , button [ onClick Previous ] [ text "Previous" ]
        ]


init : ( Model, Cmd Msg )
init =
    ( Model [ "one", "two", "three" ] 0, Cmd.none )


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

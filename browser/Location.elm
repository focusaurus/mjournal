module Location exposing (location, route, parse, apiQuery)

import Http
import Model
import UrlParser as Url exposing ((<?>))
import Navigation


route : Url.Parser (Model.Screen -> a) a
route =
    Url.oneOf
        [ Url.map Model.EntriesScreen (Url.s "" <?> Url.stringParam "textSearch" <?> Url.intParam "after" <?> Url.intParam "before")
        ]


parse : Model.PageState -> Navigation.Location -> Model.PageState
parse pageState location =
    let
        screen =
            case pageState.userId of
                Nothing ->
                    Model.SignInScreen

                Just id ->
                    Maybe.withDefault pageState.screen (Url.parsePath route location)

        -- _ = Debug.log "Location.parse" pageState
    in
        case screen of
            Model.EntriesScreen textSearch after before ->
                { pageState
                    | textSearch = Maybe.withDefault "" textSearch
                    , after = after
                    , before = before
                    , screen = screen
                }

            Model.SignInScreen ->
                { pageState
                    | textSearch = ""
                    , after = Nothing
                    , before = Nothing
                    , screen = screen
                }


encode : ( String, String ) -> String
encode pair =
    Http.encodeUri (Tuple.first pair) ++ "=" ++ Http.encodeUri (Tuple.second pair)


toQuery : List (Maybe ( String, String )) -> String
toQuery pairs =
    List.filterMap identity pairs
        |> List.map encode
        |> String.join "&"
        |> (\q ->
                if String.isEmpty q then
                    ""
                else
                    "?" ++ q
           )


location : Model.Model -> String
location model =
    let
        after =
            Maybe.map (\after -> ( "after", toString after )) model.pageState.after

        before =
            Maybe.map (\before -> ( "before", toString before )) model.pageState.before

        textSearch =
            if String.isEmpty model.pageState.textSearch then
                Nothing
            else
                Just ( "textSearch", model.pageState.textSearch )
    in
        toQuery [ after, before, textSearch ]


apiQuery : Maybe String -> Maybe Int -> Maybe Int -> String
apiQuery textSearch after before =
    let
        afterTuple =
            Maybe.map (\after -> ( "after", toString after )) after

        beforeTuple =
            Maybe.map (\before -> ( "before", toString before )) before

        ts =
            Maybe.withDefault "" textSearch

        textSearchTuple =
            if String.isEmpty ts then
                Nothing
            else
                Just ( "textSearch", ts )
    in
        toQuery [ afterTuple, beforeTuple, textSearchTuple ]

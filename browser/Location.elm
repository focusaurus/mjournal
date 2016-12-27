module Location exposing (location, route, parse, parse2, apiQuery)

import Http
import Model
import UrlParser as Url exposing ((<?>))
import Navigation


route : Url.Parser (Model.Screen -> a) a
route =
    Url.oneOf
        [ -- Url.map Home top
          Url.map Model.EntriesScreen (Url.s "elm" <?> Url.stringParam "textSearch" <?> Url.intParam "after" <?> Url.intParam "before")
          -- , Url.map BlogPost (s "blog" </> int)
        ]


parse : Navigation.Location -> Model.Screen
parse location =
    Maybe.withDefault Model.SignInScreen (Url.parsePath route location)


parse2 : Model.PageState -> Navigation.Location -> Model.PageState
parse2 pageState location =
    let
        screen =
            Maybe.withDefault pageState.screen (Url.parsePath route location)

        state =
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
    in
        state


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
            case model.pageState.after of
                Just after ->
                    Just ( "after", toString after )

                Nothing ->
                    Nothing

        before =
            case model.pageState.before of
                Just before ->
                    Just ( "before", toString before )

                Nothing ->
                    Nothing

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
            case after of
                Just after ->
                    Just ( "after", toString after )

                Nothing ->
                    Nothing

        beforeTuple =
            case before of
                Just before ->
                    Just ( "before", toString before )

                Nothing ->
                    Nothing

        ts =
            Maybe.withDefault "" textSearch

        textSearchTuple =
            if String.isEmpty ts then
                Nothing
            else
                Just ( "textSearch", ts )
    in
        toQuery [ afterTuple, beforeTuple, textSearchTuple ]

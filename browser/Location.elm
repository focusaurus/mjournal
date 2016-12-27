module Location exposing (location)

import Http
import Model

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
                    Just ( "after", toString after.id )

                Nothing ->
                    Nothing

        before =
            case model.pageState.before of
                Just before ->
                    Just ( "before", toString before.id )

                Nothing ->
                    Nothing

        textSearch =
            if String.isEmpty model.pageState.textSearch then
                Nothing
            else
                Just ( "textSearch", model.pageState.textSearch )
    in
        toQuery [ after, before, textSearch ]

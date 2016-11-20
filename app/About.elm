module About exposing (about)

import Html exposing (..)
import Html.Attributes exposing (class)


about : Html a
about =
    div
        [ class "about" ]
        [ h3
            []
            [ text "mjournal is a clean, organized journal for notes and thoughts" ]
        , ul
            []
            [ li
                []
                [ text "uncluttered design lets you focus on your words" ]
            , li
                []
                [ text "Entries are automatically timestamped and displayed chronologically" ]
            , li
                []
                [ text "Use tags as a simple way to categorize related entries" ]
            , li
                []
                [ text "Powerful full-text search lets you find entries quickly" ]
            ]
        ]

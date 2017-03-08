module EntriesView exposing (new, list)

import Date.Extra
import Events exposing (onBlurEditable, onShiftEnter, onEdit)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput, onBlur)
import Messages exposing (Msg(..))
import Model exposing (Model, Entry)
import Tag exposing (tags)


list : Model -> Html Msg
list model =
    div [] (List.map entryTag model.entries)


entryTag : Entry -> Html Msg
entryTag entry =
    div [ class "entry" ]
        [ div [ class "meta-row" ]
            [ i
                [ classList
                    [ ( "delete-entry", True )
                    , ( "meta", True )
                    , ( "icon-bin2", not entry.confirmingDelete )
                    , ( "icon-warning", entry.confirmingDelete )
                    ]
                , title "delete entry (click twice)"
                , onClick (DeleteEntry1 entry)
                ]
                []
            , div [ class "created meta" ] [ text (Date.Extra.toFormattedString "MMM dd, yyyy hh:mm a" entry.created) ]
            ]
        , p
            [ class "body"
            , contenteditable True
            , onBlurEditable (SaveBody entry)
            , onShiftEnter (SaveBody entry)
            ]
            [ text entry.body ]
        , tags entry
        ]


new : Model -> Html Msg
new model =
    div [ class "entry" ]
        [ label
            [ class "new" ]
            [ text "Type a new entry below. SHIFT-ENTER to save." ]
          -- , p
          --     [ class "body new"
          --     , onShiftEnter CreateEntry
          --       -- , onBlurEditable SetNewEntryBody
          --     , onBlur CreateEntry
          --     , onInput SetNewEntryBody
          --     , value model.newEntry.body
          --     ]
          --     []
          --   [ text model.newEntryBody ]
        , p
            [ class "body new"
            , contenteditable True
            , onBlurEditable SetNewEntryBody
            , onShiftEnter SetNewEntryBodyAndSave
              -- , onEdit SetNewEntryBody
            ]
            []
        , tags model.newEntry
        , button
            [ onClick (CreateEntry Nothing) ]
            [ text "Save" ]
        ]

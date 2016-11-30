module Menu exposing (component)

import Html exposing (..)
import Html.Attributes exposing (..)
import Messages exposing (Msg)
import Model exposing (Theme)


themeLink : Theme -> Html Msg
themeLink theme =
    a
        []
        -- ng-click "setTheme(theme.name)"
        [ i
            [ class "icon-checkmark2" ]
            -- [ ng-class "{'icon-checkmark': theme.selected, 'icon-checkmark2': !theme.selected}", class "icon-checkmark2" ]
            [ text ("Theme: " ++ theme.name) ]
        ]


component : Html Msg
component =
    div
        [ class "menu-bar" ]
        [ nav
            [ class "settings-menu" ]
            [ span
                [ class "dropdown" ]
                -- , dropdown "" ]
                [ a
                    [ class "menu icon-menu" ]
                    --, dropdown-toggle "",  aria-haspopup "true", aria-expanded "false" ]
                    []
                , nav
                    [ class "dropdown-menu" ]
                    --, role "menu" ]
                    [ a
                        [ class "sign-out", href "/api/users/sign-out", target "_self" ]
                        [ i
                            [ class "icon-exit" ]
                            [ text "Sign Out" ]
                        ]
                      -- , (List.map themeLink themes)
                    , themeLink (Theme "moleskine")
                    , themeLink (Theme "hoth")
                    , a
                        [ href "/docs", target "_self" ]
                        [ i
                            [ class "icon-lifebuoy" ]
                            [ text "Documentation" ]
                        ]
                    ]
                ]
            ]
        ]

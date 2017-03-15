module Menu exposing (component)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onWithOptions)
import Messages exposing (Msg(ToggleMenu, SetTheme))
import Model exposing (Model, Theme(Moleskine, Hoth))
import Json.Decode as Json
import Theme


stopPropagation : Attribute Msg
stopPropagation =
    onWithOptions "click"
        { stopPropagation = True
        , preventDefault = True
        }
        (Json.map ToggleMenu <| Json.succeed "")


themeLink : Theme -> Theme -> Html Msg
themeLink current theme =
    a
        [ onClick (SetTheme theme) ]
        [ i
            [ classList
                [ ( "icon-checkmark", current == theme )
                , ( "icon-checkmark2", current /= theme )
                ]
            ]
            [ text ("Theme: " ++ (Theme.toString theme)) ]
        ]


component : Model -> Html Msg
component model =
    div
        [ class "menu-bar" ]
        [ nav
            [ class "settings-menu" ]
            [ span
                [ classList
                    [ ( "dropdown", True )
                    , ( "open", model.menuOpen )
                    ]
                ]
                -- [ class (menuState model.menuOpen) ]
                -- , dropdown "" ]
                [ a
                    [ class "menu icon-menu", stopPropagation ]
                    --, dropdown-toggle "",  aria-haspopup "true", aria-expanded "false" ]
                    []
                , menu
                    [ class "dropdown-menu" ]
                    --, role "menu" ]
                    [ menuitem []
                        [ a
                            [ class "sign-out", href "/api/users/sign-out" ]
                            [ i
                                [ class "icon-exit" ]
                                [ text "Sign Out" ]
                            ]
                        ]
                    , menuitem [] [ themeLink model.theme Moleskine ]
                    , menuitem [] [ themeLink model.theme Hoth ]
                    , menuitem []
                        [ a
                            [ href "/docs", target "_self" ]
                            [ i
                                [ class "icon-lifebuoy" ]
                                [ text "Documentation" ]
                            ]
                        ]
                    ]
                ]
            ]
        ]

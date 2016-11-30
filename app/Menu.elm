module Menu exposing (component)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onWithOptions)
import Messages exposing (Msg, Msg(ToggleMenu), Msg(SignOut))
import Model exposing (Model, Theme)
import Json.Decode as Json


stopPropagation : Attribute Msg
stopPropagation =
    onWithOptions "click"
        { stopPropagation = True
        , preventDefault = True
        }
        (Json.map ToggleMenu <| Json.succeed "")


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


-- menuState : Bool -> String
-- menuState open =
--     "dropdown"
--         ++ (if open then
--                 " open"
--             else
--                 ""
--            )


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
                , nav
                    [ class "dropdown-menu" ]
                    --, role "menu" ]
                    [ a
                        [ class "sign-out", onClick SignOut ]
                        -- [ class "sign-out", href "/api/users/sign-out", target "_self" ]
                        [ i
                            [ class "icon-exit" ]
                            [ text "Sign Out" ]
                        ]
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

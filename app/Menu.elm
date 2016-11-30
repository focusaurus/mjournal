module Menu exposing (component)

import Html exposing (..)
import Html.Attributes exposing (..)

import Messages exposing (Msg)

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
        -- , a
        --   [ ng-repeat "theme in themes", ng-click "setTheme(theme.name)", class "ng-binding", ]
        --   [ i
        --     [ ng-class "{'icon-checkmark': theme.selected, 'icon-checkmark2': !theme.selected}", class "icon-checkmark2" ]
        --     [] text "Theme: Hoth"
        --   ]
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

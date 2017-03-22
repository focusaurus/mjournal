module Main exposing (..)

{-| elm-package install elm-lang/navigation evancz/url-parser
-}

import Html exposing (Html, caption, div, table, tbody, td, text, th, thead, tr)
import Navigation exposing (Location)
import String
import UrlParser exposing (Parser, (</>), map, oneOf, s, int, string, top, parseHash)


type Msg
    = L Location


type Route
    = Index
    | Foo
    | Bar String
    | Baz Int
    | Qux Int String
    | Quux String
    | Nested Clock


type Clock
    = Hickery
    | Dickery
    | Dock String
    | TheMouseWentUp Int


nestedMatchers : Parser (Clock -> a) a
nestedMatchers =
    oneOf
        [ map Hickery top
        , map Dickery (s "dickery")
        , map Dock (s "dock" </> string)
        , map TheMouseWentUp
            (s "the" </> s "mouse" </> s "went" </> s "up" </> int)
        ]


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map Index top
        , map Foo (s "foo")
        , map Bar (s "bar" </> string)
        , map Baz (s "baz" </> int)
        , map Qux (s "qux" </> int </> string)
        , map Nested (s "nested" </> nestedMatchers)
        , map Quux string
        ]


toLocation : String -> Location
toLocation hash =
    Location "" "" "" "" "" "" "" "" (String.cons '#' hash) "" ""


testLocations : List ( String, Location )
testLocations =
    List.map (\s -> ( s, toLocation s ))
        [ ""
        , "/"
        , "foo"
        , "bar"
        , "bar/test1"
        , "bar/test2/test3"
        , "baz"
        , "baz/test4"
        , "baz/20"
        , "qux/12"
        , "qux/xx"
        , "qux/yy/99"
        , "qux/13/zz"
        , "qux/13/zz/"
        , "saveme"
        , "shame/on/me"
        , "nested"
        , "nested/"
        , "nested/dickery"
        , "nested/dickery/dickery"
        , "nested/plz"
        , "nested/dock"
        , "nested/dock/"
        , "nested/dock/1"
        , "nested/dock/DOCK!!"
        , "nested/the/"
        , "nested/the/mouse"
        , "nested/the/mouse/went"
        , "nested/the/mouse/went/up"
        , "nested/the/mouse/went/up/666"
        ]


row : ( String, Location ) -> Html Msg
row ( h, r ) =
    tr []
        [ td [] [ text h ]
        , td [] [ text << toString <| parseHash matchers r ]
        ]


view : Location -> Html Msg
view location =
    table []
        [ caption [] [ text "URL Parsing Playaround" ]
        , thead []
            [ tr []
                [ th [] [ text "Hash" ]
                , th [] [ text "Parsed Route" ]
                ]
            ]
        , tbody []
            << List.map row
          <|
            ( "Current Hash", location )
                :: testLocations
        ]


main : Program Never Location Msg
main =
    Navigation.program L
        { init = flip (,) Cmd.none
        , update = \(L l) _ -> ( l, Cmd.none )
        , view = view
        , subscriptions = always Sub.none
        }
